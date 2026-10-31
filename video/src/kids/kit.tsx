import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../kids-timing.json";

/* ---------------- timing ---------------- */
export type Tok = [string, number, number];
export type KLine = { id: string; scene: string; start: number; end: number; tokens: Tok[] };
export const LINES = data.lines as unknown as KLine[];
export const TOTAL = data.total as number;
export const L = (id: string) => {
  const l = LINES.find((x) => x.id === id);
  if (!l) throw new Error("no line " + id);
  return l;
};
export const S = (id: string) => L(id).start;
export const E = (id: string) => L(id).end;
/** start time of the first token in a line whose text contains `word` (case-insensitive), else line start */
export const WT = (id: string, word: string, nth = 0) => {
  const toks = L(id).tokens.filter((t) => t[0].toLowerCase().replace(/[^a-z0-9]/g, "").includes(word.toLowerCase()));
  return toks[nth] ? toks[nth][1] : S(id);
};

const order: string[] = [];
LINES.forEach((l) => { if (!order.includes(l.scene)) order.push(l.scene); });
export const SCENES = order.map((name, i) => {
  const first = LINES.find((l) => l.scene === name)!;
  const start = i === 0 ? 0 : first.start - 0.6;
  return { name, start };
}).map((s, i, arr) => ({ ...s, end: i + 1 < arr.length ? arr[i + 1].start : TOTAL }));
export const SC = (name: string) => SCENES.find((s) => s.name === name)!;

/* ---------------- motion helpers ---------------- */
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INO = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const tw = (t: number, at: number, d: number, a: number, b: number, easing: (x: number) => number = OUT) =>
  interpolate(t, [at, at + d], [a, b], { ...clamp, easing });
/** springy pop 0→1 with overshoot */
export const pop = (t: number, at: number, d = 0.45) => interpolate(t, [at, at + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
export const fadeIO = (t: number, a: number, b: number, f = 0.3) =>
  interpolate(t, [a, a + f, b - f, b], [0, 1, 1, 0], clamp);
export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};
export const prng = (seed: number) => {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
};

/* ---------------- fonts / colours ---------------- */
export const BALOO = "'Baloo 2', 'Nunito', sans-serif";
export const NUN = "Nunito, sans-serif";
export const AMIRI = "Amiri, serif";
export const SAL_TXT = "Sallallahu Alaihi Wa Alihi Wasallam";

/* ---------------- characters (faceless, circle heads) ---------------- */
export type Pose = { armL?: number; armR?: number; legL?: number; legR?: number; lean?: number; tilt?: number };

const Limb: React.FC<{ x: number; y: number; ang: number; len: number; w: number; color: string; end?: React.ReactNode }> = ({ x, y, ang, len, w, color, end }) => (
  <g transform={`translate(${x},${y}) rotate(${ang})`}>
    <rect x={-w / 2} y={-w / 2} width={w} height={len + w / 2} rx={w / 2} fill={color} />
    {end ? <g transform={`translate(0,${len})`}>{end}</g> : null}
  </g>
);

/** child; feet at (x,y). Facing right by default. */
export const Kid: React.FC<{ x: number; y: number; s?: number; pose?: Pose; flip?: boolean; bob?: number; shirt?: string; pants?: string; skin?: string; cap?: boolean; squash?: number }> = ({
  x, y, s = 1, pose = {}, flip = false, bob = 0, shirt = "#2fa36b", pants = "#2b4a7d", skin = "#e6b48c", cap = true, squash = 1,
}) => {
  const { armL = 8, armR = -8, legL = 0, legR = 0, lean = 0, tilt = 0 } = pose;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={0} cy={4} rx={58} ry={11} fill="#000" opacity={0.16} />
      <g transform={`translate(0,${-bob}) rotate(${lean}) scale(1,${squash})`}>
        <Limb x={-17} y={-108} ang={-legL} len={92} w={26} color={pants} end={<ellipse cx={8} cy={4} rx={20} ry={11} fill="#3a2a22" />} />
        <Limb x={17} y={-108} ang={-legR} len={92} w={26} color={pants} end={<ellipse cx={8} cy={4} rx={20} ry={11} fill="#3a2a22" />} />
        <Limb x={-40} y={-196} ang={-armL} len={84} w={22} color={shirt} end={<circle r={14} fill={skin} />} />
        <rect x={-50} y={-220} width={100} height={124} rx={36} fill={shirt} />
        <rect x={-50} y={-130} width={100} height={18} fill="#000" opacity={0.08} />
        <Limb x={40} y={-196} ang={-armR} len={84} w={22} color={shirt} end={<circle r={14} fill={skin} />} />
        <g transform={`translate(0,-270) rotate(${tilt})`}>
          <circle r={54} fill={skin} />
          {cap ? (
            <g>
              <path d="M -52 -8 A 52 46 0 0 1 52 -8 L 52 -2 L -52 -2 Z" fill="#fbfbf5" />
              <path d="M -48 -14 L 48 -14" stroke="#d8d6c8" strokeWidth={3} strokeDasharray="6 6" />
            </g>
          ) : null}
        </g>
      </g>
    </g>
  );
};

/** mother in hijab and abaya; feet at (x,y). */
export const Mum: React.FC<{ x: number; y: number; s?: number; armL?: number; armR?: number; flip?: boolean; bob?: number; dress?: string; hijab?: string; skin?: string }> = ({
  x, y, s = 1, armL = 6, armR = -6, flip = false, bob = 0, dress = "#7b5ea7", hijab = "#c9a7d8", skin = "#dcae86",
}) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <ellipse cx={0} cy={4} rx={70} ry={12} fill="#000" opacity={0.16} />
    <g transform={`translate(0,${-bob})`}>
      <Limb x={-44} y={-250} ang={-armL} len={118} w={30} color={dress} end={<circle r={15} fill={skin} />} />
      <path d="M -54 -268 Q -66 -120 -86 0 L 86 0 Q 66 -120 54 -268 Q 0 -290 -54 -268 Z" fill={dress} />
      <Limb x={44} y={-250} ang={-armR} len={118} w={30} color={dress} end={<circle r={15} fill={skin} />} />
      <path d="M -70 -330 Q -80 -250 -52 -228 L 52 -228 Q 80 -250 70 -330 Q 0 -420 -70 -330 Z" fill={hijab} />
      <circle cx={0} cy={-330} r={68} fill={hijab} />
      <circle cx={0} cy={-326} r={44} fill={skin} />
    </g>
  </g>
);

/** townsperson of old Makkah (faceless), feet at (x,y). */
export const Person: React.FC<{ x: number; y: number; s?: number; robe: string; cloth: string; skin: string; flip?: boolean; bob?: number; sway?: number; armUp?: number }> = ({
  x, y, s = 1, robe, cloth, skin, flip = false, bob = 0, sway = 0, armUp = 0,
}) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <ellipse cx={0} cy={3} rx={44} ry={8} fill="#000" opacity={0.14} />
    <g transform={`translate(0,${-bob}) skewX(${sway})`}>
      <Limb x={30} y={-180} ang={-(-6 - armUp)} len={74} w={18} color={robe} end={<circle r={11} fill={skin} />} />
      <path d="M -38 -190 Q -46 -90 -50 0 L 50 0 Q 46 -90 38 -190 Q 0 -204 -38 -190 Z" fill={robe} />
      <path d="M -38 -150 L 38 -150" stroke="#000" strokeOpacity={0.08} strokeWidth={10} />
      <circle cx={0} cy={-224} r={34} fill={skin} />
      <path d="M -38 -232 Q 0 -278 38 -232 L 42 -186 Q 30 -196 26 -214 L -26 -214 Q -30 -196 -42 -186 Z" fill={cloth} />
      <path d="M -36 -240 Q 0 -262 36 -240" stroke="#3a3330" strokeWidth={5} fill="none" opacity={0.6} />
    </g>
  </g>
);

export const Ball: React.FC<{ x: number; y: number; r?: number; rot?: number }> = ({ x, y, r = 24, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <circle r={r} fill="#fff" stroke="#333" strokeWidth={2.5} />
    <path d={`M 0 ${-r * 0.38} L ${r * 0.36} ${-r * 0.12} L ${r * 0.22} ${r * 0.3} L ${-r * 0.22} ${r * 0.3} L ${-r * 0.36} ${-r * 0.12} Z`} fill="#222" />
    {[0, 72, 144, 216, 288].map((a) => (
      <line key={a} x1={0} y1={-r * 0.38} x2={0} y2={-r * 0.95} stroke="#333" strokeWidth={2} transform={`rotate(${a})`} />
    ))}
  </g>
);

/** gently swinging lantern with glow */
export const Lantern: React.FC<{ x: number; t: number; len: number; color?: string; phase?: number; s?: number }> = ({ x, t, len, color = "#ffcf5a", phase = 0, s = 1 }) => {
  const a = 6 * Math.sin(t * 1.3 + phase);
  return (
    <g transform={`translate(${x},0) rotate(${a}) scale(${s})`}>
      <line x1={0} y1={0} x2={0} y2={len} stroke="#d9c38a" strokeWidth={3} />
      <g transform={`translate(0,${len})`}>
        <circle cy={60} r={110} fill="url(#lanternGlow)" opacity={0.7 + 0.15 * Math.sin(t * 3 + phase)} />
        <path d="M -10 0 L 10 0 L 16 14 L -16 14 Z" fill="#b8893a" />
        <path d="M -30 14 Q -44 60 -24 104 L 24 104 Q 44 60 30 14 Z" fill={color} />
        <path d="M -30 14 Q -44 60 -24 104 L 24 104 Q 44 60 30 14 Z" fill="none" stroke="#b8893a" strokeWidth={4} />
        <path d="M -12 30 Q -18 60 -10 92 M 12 30 Q 18 60 10 92 M 0 24 L 0 98" stroke="#b8893a" strokeWidth={3} fill="none" />
        <path d="M -20 104 L 20 104 L 8 118 L -8 118 Z" fill="#b8893a" />
      </g>
    </g>
  );
};

export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="lanternGlow"><stop offset="0%" stopColor="#ffe39a" stopOpacity={0.9} /><stop offset="100%" stopColor="#ffe39a" stopOpacity={0} /></radialGradient>
    <radialGradient id="softGlow"><stop offset="0%" stopColor="#fff6cf" stopOpacity={1} /><stop offset="45%" stopColor="#ffe08a" stopOpacity={0.45} /><stop offset="100%" stopColor="#ffe08a" stopOpacity={0} /></radialGradient>
    <radialGradient id="sunGlow"><stop offset="0%" stopColor="#fff3c4" stopOpacity={1} /><stop offset="60%" stopColor="#ffd27a" stopOpacity={0.35} /><stop offset="100%" stopColor="#ffd27a" stopOpacity={0} /></radialGradient>
  </defs>
);

/** star field */
const rs = prng(11);
export const STARS = Array.from({ length: 90 }, () => ({ x: rs() * 1920, y: rs() * 760, r: 1.2 + rs() * 2.6, w: 0.8 + rs() * 2.4, p: rs() * 6.28 }));
export const Stars: React.FC<{ t: number; o?: number }> = ({ t, o = 1 }) => (
  <g opacity={o}>
    {STARS.map((s, i) => (
      <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff8e1" opacity={0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.w + s.p))} />
    ))}
  </g>
);

/** speech / thought bubble in HTML so text wraps nicely */
export const Bubble: React.FC<{ x: number; y: number; w: number; text: React.ReactNode; t: number; at: number; until?: number; tail?: "left" | "right" | "down" | "none"; color?: string; size?: number; thought?: boolean }> = ({
  x, y, w, text, t, at, until = 1e9, tail = "down", color = "#ffffff", size = 46, thought = false,
}) => {
  const p = pop(t, at, 0.4);
  const o = interpolate(t, [at, at + 0.15, until - 0.25, until], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: tail === "left" ? "0% 100%" : tail === "right" ? "100% 100%" : "50% 100%", opacity: o }}>
      <div style={{ background: color, borderRadius: thought ? 60 : 36, padding: "22px 30px", fontFamily: BALOO, fontWeight: 800, fontSize: size, lineHeight: 1.12, color: "#2b2340", textAlign: "center", boxShadow: "0 10px 0 rgba(0,0,0,0.12)", border: "5px solid #2b2340" }}>{text}</div>
      {tail !== "none" && !thought ? (
        <div style={{ position: "absolute", bottom: -26, left: tail === "left" ? 50 : tail === "right" ? undefined : "50%", right: tail === "right" ? 50 : undefined, marginLeft: tail === "down" ? -18 : 0, width: 0, height: 0,
          borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `28px solid #2b2340` }} />
      ) : null}
      {thought ? (
        <>
          <div style={{ position: "absolute", bottom: -34, left: 60, width: 30, height: 30, borderRadius: 15, background: color, border: "5px solid #2b2340" }} />
          <div style={{ position: "absolute", bottom: -66, left: 36, width: 18, height: 18, borderRadius: 9, background: color, border: "4px solid #2b2340" }} />
        </>
      ) : null}
    </div>
  );
};

/** iris transition: scene reveals through an expanding circle */
export const Iris: React.FC<{ t: number; start: number; children: React.ReactNode }> = ({ t, start, children }) => {
  const r = start === 0 ? 2400 : tw(t, start, 0.7, 0, 2300, Easing.inOut(Easing.cubic));
  return <div style={{ position: "absolute", inset: 0, clipPath: `circle(${r}px at 50% 50%)` }}>{children}</div>;
};

/** big friendly title text with letter-by-letter pop */
export const PopText: React.FC<{ text: string; t: number; at: number; size: number; color: string; stroke?: string; stagger?: number; font?: string }> = ({ text, t, at, size, color, stroke = "#2b2340", stagger = 0.05, font = BALOO }) => (
  <span style={{ fontFamily: font, fontWeight: 800, fontSize: size, color, WebkitTextStroke: `${Math.round(size / 18)}px ${stroke}`, paintOrder: "stroke fill", letterSpacing: "0.01em", whiteSpace: "pre" }}>
    {text.split("").map((c, i) => {
      const p = pop(t, at + i * stagger, 0.4);
      return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * 40}px) scale(${0.3 + 0.7 * p})`, opacity: Math.min(1, p * 1.5) }}>{c === " " ? " " : c}</span>;
    })}
  </span>
);
