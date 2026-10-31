import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing, Audio } from "remotion";
import data from "./kidsshort-timing.json";
import { pop, clamp, prng, Kid, Mum, BALOO, INO } from "../kids/kit";

/* Islam for Little Ones · Short: 3 eating sunnahs (Sahih al-Bukhari 5376, Sahih Muslim 2022). Faceless characters, no Prophet depicted. */
type Tok = [string, number, number];
type Line = { id: string; start: number; end: number; tokens: Tok[] };
const LINES = data.lines as unknown as Line[];
export const KIDSSHORT_DUR = data.total as number;
const S = (i: number) => LINES[i].start;
const E = (i: number) => LINES[i].end;
const INK = "#2b2340", TEAL = "#2bb3a3", SUN = "#ffd23f", PINK = "#ff8fb1", CREAM = "#fff8ec";
const rs = prng(9);
const SPARK = Array.from({ length: 34 }, () => ({ x: rs() * 1080, y: 260 + rs() * 900, s: 0.5 + rs(), p: rs() * 6.28 }));

const Star: React.FC<{ x: number; y: number; r: number; fill: string; rot?: number }> = ({ x, y, r, fill, rot = 0 }) => (
  <path transform={`translate(${x},${y}) rotate(${rot})`} d={Array.from({ length: 10 }, (_, i) => { const rr = i % 2 ? r * 0.45 : r; const a = (Math.PI / 5) * i - Math.PI / 2; return `${i ? "L" : "M"} ${(rr * Math.cos(a)).toFixed(1)} ${(rr * Math.sin(a)).toFixed(1)}`; }).join(" ") + " Z"} fill={fill} stroke={INK} strokeWidth={r / 9} strokeLinejoin="round" />
);

const Room: React.FC<{ t: number }> = ({ t }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe9c9" /><stop offset="1" stopColor="#ffd9a8" /></linearGradient>
      <linearGradient id="win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb36b" /><stop offset="1" stopColor="#ffe08a" /></linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#wall)" />
    <g transform="translate(640,300)">
      <rect width={330} height={380} rx={26} fill="url(#win)" stroke="#c98b55" strokeWidth={16} />
      <circle cx={165} cy={250 + 8 * Math.sin(t * 0.8)} r={62} fill="#fff3c4" opacity={0.95} />
      <rect x={157} width={16} height={380} fill="#c98b55" /><rect y={182} width={330} height={16} fill="#c98b55" />
    </g>
    {SPARK.map((s, i) => <Star key={i} x={s.x} y={s.y} r={7 * s.s} fill="#fff" rot={t * 40 + i * 20} />).map((el, i) => <g key={i} opacity={0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2 + SPARK[i].p))}>{el}</g>)}
    <rect y={1130} width={1080} height={790} fill="#c98b55" />
    <rect y={1124} width={1080} height={14} fill="#a86e3e" />
  </svg>
);

const FOOD: [number, number, string][] = [[-95, -4, "#ff8c42"], [-35, -14, "#7ac74f"], [35, -8, "#e8505b"], [95, 0, "#ffd23f"]];
/* bite: the nearest piece travels hand -> mouth during rule 3 */
const biteP = (t: number) => interpolate(t, [S(4) + 1.0, S(4) + 1.9], [0, 1], { ...clamp, easing: INO });
const Table: React.FC<{ t: number; kx: number }> = ({ t, kx }) => {
  const near = t > S(4) - 0.1 && t < E(5) + 0.3 ? pop(t, S(4) + 0.3, 0.5) : 0;
  const bp = biteP(t);
  const gone = t > S(4) + 1.9;
  return (
    <g>
      <ellipse cx={540} cy={1048} rx={480} ry={74} fill="#6e4426" />
      <ellipse cx={540} cy={1040} rx={470} ry={70} fill="#8a5a33" />
      <ellipse cx={540} cy={1028} rx={210} ry={44} fill="#000" opacity={0.12} />
      <ellipse cx={540} cy={1020} rx={210} ry={44} fill="#fff" stroke={INK} strokeWidth={6} />
      <ellipse cx={540} cy={1012} rx={150} ry={28} fill="#ffe6b0" />
      {near > 0 ? (
        <g opacity={near}>
          <path d="M 470 976 A 150 40 0 0 0 470 1058" fill="none" stroke={SUN} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${300 * near} 400`} />
          <circle cx={445} cy={1008} r={46 + 4 * Math.sin(t * 7)} fill={SUN} opacity={0.3} />
        </g>
      ) : null}
      {FOOD.map(([dx, dy, c], i) => {
        if (i === 0 && gone) return null;
        let x = 540 + dx, y = 1008 + dy, r = 20;
        if (i === 0 && bp > 0) { x = interpolate(bp, [0, 1], [x, kx + 40]); y = interpolate(bp, [0, 1], [y, 800]) - 60 * Math.sin(bp * Math.PI); r = 20 * (1 - 0.6 * bp); }
        const wob = Math.sin(t * 3 + i * 1.7) * 2;
        return <circle key={i} cx={x} cy={y + wob} r={r} fill={c} stroke={INK} strokeWidth={4} />;
      })}
      {gone && t < S(4) + 3 ? (
        <g transform={`translate(${kx + 150},${730}) scale(${pop(t, S(4) + 1.9, 0.4)})`}>
          <text textAnchor="middle" fontFamily={BALOO} fontWeight={800} fontSize={58} fill={PINK} stroke={INK} strokeWidth={7} paintOrder="stroke">yum!</text>
        </g>
      ) : null}
    </g>
  );
};

const Burst: React.FC<{ t: number; at: number; x: number; y: number; color?: string }> = ({ t, at, x, y, color = SUN }) => {
  const k = (t - at) / 0.7;
  if (k < 0 || k > 1) return null;
  const e = Easing.out(Easing.cubic)(k);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 + 0.3;
        return <Star key={i} x={x + Math.cos(a) * 190 * e} y={y + Math.sin(a) * 150 * e} r={16 * (1 - k) + 4} fill={i % 2 ? color : "#fff"} rot={k * 200} />;
      })}
    </svg>
  );
};

const Tracker: React.FC<{ t: number }> = ({ t }) => {
  if (t < S(2) - 0.2 || t > E(5) + 0.3) return null;
  const o = interpolate(t, [S(2) - 0.2, S(2) + 0.1], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 230, left: 70, display: "flex", gap: 14, opacity: o }}>
      {[2, 3, 4].map((ln, i) => {
        const on = t >= S(ln) + 0.2;
        const p = on ? pop(t, S(ln) + 0.2, 0.4) : 0;
        return (
          <div key={i} style={{ width: 64, height: 64, borderRadius: 32, border: `6px solid ${INK}`, background: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: [TEAL, PINK, SUN][i], transform: `scale(${p})`, borderRadius: 32 }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BALOO, fontWeight: 800, fontSize: 36, color: INK }}>{i + 1}</div>
          </div>
        );
      })}
    </div>
  );
};

/* camera keyframes: [time, zoom, focusX, focusY] */
const camAt = (t: number) => {
  const K: [number, number, number, number][] = [
    [0, 1.0, 540, 900], [S(1), 1.0, 540, 900], [S(1) + 1.5, 1.12, 560, 880], [S(2) - 0.2, 1.12, 560, 880],
    [S(2) + 0.5, 1.42, 360, 820], [S(3) - 0.2, 1.42, 360, 820], [S(3) + 0.6, 1.5, 430, 860], [S(4) - 0.2, 1.5, 430, 860],
    [S(4) + 0.6, 1.45, 470, 930], [E(4), 1.4, 450, 900], [S(5) + 0.4, 1.0, 540, 900], [S(6), 1.0, 540, 900], [S(6) + 1.6, 1.1, 540, 880], [99, 1.1, 540, 880],
  ];
  let i = 0;
  while (i < K.length - 2 && t > K[i + 1][0]) i++;
  const [t0, z0, x0, y0] = K[i], [t1, z1, x1, y1] = K[i + 1];
  const k = INO(Math.max(0, Math.min(1, (t - t0) / Math.max(0.001, t1 - t0))));
  return { z: z0 + (z1 - z0) * k, fx: x0 + (x1 - x0) * k, fy: y0 + (y1 - y0) * k };
};

const RULES = [
  { line: 2, n: "1", title: "Say Bismillah", ar: "بِسْمِ اللّٰهِ", color: TEAL },
  { line: 3, n: "2", title: "Right hand", ar: "", color: PINK },
  { line: 4, n: "3", title: "Eat what's near", ar: "", color: SUN },
];

const RuleCard: React.FC<{ t: number }> = ({ t }) => {
  const r = RULES.find((x) => t >= S(x.line) - 0.15 && t < S(x.line + 1) - 0.1);
  if (!r) return null;
  const p = pop(t, S(r.line), 0.5);
  return (
    <div style={{ position: "absolute", top: 320, left: 70, width: 560, transform: `scale(${p}) rotate(-3deg)`, transformOrigin: "20% 50%" }}>
      <div style={{ background: CREAM, border: `8px solid ${INK}`, borderRadius: 40, padding: "18px 26px", boxShadow: "0 12px 0 rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 110, height: 110, borderRadius: 55, background: r.color, border: `6px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BALOO, fontWeight: 800, fontSize: 76, color: INK }}>{r.n}</div>
        <div>
          <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 56, lineHeight: 1, color: INK }}>{r.title}</div>
          {r.ar ? <div style={{ fontFamily: "Amiri, serif", fontSize: 52, color: TEAL, direction: "rtl" }}>{r.ar}</div> : null}
        </div>
      </div>
    </div>
  );
};

const Hook: React.FC<{ t: number }> = ({ t }) => {
  if (t > S(1) + 0.2) return null;
  const o = interpolate(t, [S(1) - 0.1, S(1) + 0.2], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", opacity: o }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
        {[0, 1, 2].map((i) => {
          const p = pop(t, 0.05 + i * 0.22, 0.45);
          return <svg key={i} width={150} height={150} style={{ transform: `scale(${p}) rotate(${(1 - p) * -90 + 8 * Math.sin(t * 3 + i)}deg)` }}><Star x={75} y={78} r={66} fill={[TEAL, PINK, SUN][i]} /></svg>;
        })}
      </div>
      <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 104, lineHeight: 1, color: SUN, WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, 0.8, 0.5)})`, marginTop: 10 }}>3 TINY RULES</div>
      <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 54, color: INK, transform: `scale(${pop(t, 1.2, 0.5)})` }}>for every meal 🍽️</div>
    </div>
  );
};

const Source: React.FC<{ t: number }> = ({ t }) => {
  const o = interpolate(t, [S(1), S(1) + 0.3, E(1) + 0.2, E(1) + 0.5], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 330, left: 90, right: 90, textAlign: "center", opacity: o, transform: `scale(${pop(t, S(1), 0.5)})` }}>
      <div style={{ background: CREAM, border: `7px solid ${INK}`, borderRadius: 34, padding: "22px 30px", fontFamily: BALOO, fontWeight: 800, fontSize: 46, color: INK, lineHeight: 1.15 }}>
        A lesson our Prophet<div style={{ fontSize: 30, color: PINK, margin: "4px 0" }}>Sallallahu Alaihi Wa Alihi Wasallam</div>taught a young boy
        <div style={{ fontSize: 30, color: TEAL, marginTop: 8 }}>Sahih al-Bukhari 5376 · Sahih Muslim 2022</div>
      </div>
    </div>
  );
};

const Recap: React.FC<{ t: number }> = ({ t }) => {
  if (t < S(5) - 0.1 || t > E(6) + 0.4) return null;
  const items = ["Bismillah", "Right hand", "Near you"];
  return (
    <div style={{ position: "absolute", top: 300, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {items.map((x, i) => {
        const p = pop(t, S(5) + i * ((E(5) - S(5)) / 3), 0.4);
        return (
          <div key={i} style={{ transform: `scale(${p})`, display: "flex", alignItems: "center", gap: 18, background: [TEAL, PINK, SUN][i], border: `7px solid ${INK}`, borderRadius: 60, padding: "8px 34px", fontFamily: BALOO, fontWeight: 800, fontSize: 58, color: INK }}>
            <span>✓</span><span>{x}</span>
          </div>
        );
      })}
      {t > S(6) ? <div style={{ marginTop: 10, transform: `scale(${pop(t, S(6), 0.5)})`, fontFamily: BALOO, fontWeight: 800, fontSize: 64, color: INK }}>Can you do all 3? 🌟</div> : null}
    </div>
  );
};

const Captions: React.FC<{ t: number }> = ({ t }) => {
  const line = LINES.find((l) => t >= l.start - 0.12 && t <= l.end + 0.3);
  if (!line) return null;
  const o = interpolate(t, [line.start - 0.12, line.start, line.end + 0.1, line.end + 0.3], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1330, minHeight: 190, display: "flex", alignItems: "center", justifyContent: "center", opacity: o }}>
      <div style={{ background: "rgba(43,35,64,0.88)", borderRadius: 30, padding: "14px 26px", fontFamily: BALOO, fontWeight: 800, fontSize: 56, lineHeight: 1.15, textAlign: "center", color: "#fff" }}>
        {line.tokens.map(([w, a], i) => {
          const on = t >= a - 0.02;
          return <React.Fragment key={i}>{w === "ﷺ" ? <span key={i} style={{ display: "inline-block", margin: "0 8px", fontSize: 34, color: on ? SUN : "rgba(255,255,255,0.35)" }}>(Sallallahu Alaihi Wa Alihi Wasallam)</span> : null}{w === "ﷺ" ? null : <span key={"w" + i} style={{ display: "inline-block", margin: "0 8px", color: on ? (/bismillah|right|near|three|3/i.test(w) ? SUN : "#fff") : "rgba(255,255,255,0.35)" }}>{w}</span>}</React.Fragment>;
        })}
      </div>
    </div>
  );
};

export const KidsShort: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const kidIn = interpolate(t, [0.2, 1.4], [-300, 330], { ...clamp, easing: Easing.out(Easing.back(1.3)) });
  const hop = t < 1.6 ? 40 * Math.abs(Math.sin(t * 7)) * (1 - t / 1.6) : 0;
  const bob = 6 * Math.abs(Math.sin(t * 2.2)) + hop;
  const rightUp = t > S(3) && t < E(3) + 0.4 ? pop(t, S(3) + 0.3, 0.4) * interpolate(t, [E(3), E(3) + 0.4], [1, 0], clamp) : 0;
  const reach = t > S(4) + 0.5 && t < S(4) + 2.3 ? Math.sin(Math.min(1, (t - S(4) - 0.5) / 1.8) * Math.PI) : 0;
  const bism = t > S(2) && t < E(2) + 0.4 ? pop(t, S(2) + 0.5, 0.4) : 0;
  const cheer = t > S(6) ? pop(t, S(6) + 0.3, 0.5) : 0;
  const end = E(6) + 0.4, endP = pop(t, end, 0.5);
  const c = camAt(t);
  const cam = `translate(${540 - c.fx * c.z}px, ${900 - c.fy * c.z}px) scale(${c.z})`;
  return (
    <AbsoluteFill style={{ background: "#ffe9c9" }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: cam }}>
        <Room t={t} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <Mum x={830} y={1130} s={1.1} armR={-10 + 40 * cheer} armL={10 + 8 * Math.sin(t * 2) + 120 * cheer} bob={bob * 0.5} />
          <Kid x={kidIn} y={1130} s={1.25} bob={bob + 14 * cheer * Math.abs(Math.sin(t * 6))} pose={{ armR: -20 + 150 * rightUp + 75 * reach + 120 * cheer, armL: 10 + 140 * cheer, tilt: 4 * Math.sin(t * 1.5) + (bism ? 8 * bism : 0) }} />
          {rightUp > 0 ? <g opacity={rightUp}><circle cx={kidIn + 130} cy={818} r={56 + 6 * Math.sin(t * 6)} fill={SUN} opacity={0.4} /><text x={kidIn + 190} y={760} fontFamily={BALOO} fontWeight={800} fontSize={40} fill={INK}>right hand ✓</text></g> : null}
          {bism > 0 ? (
            <g transform={`translate(${kidIn + 40},660) scale(${bism})`}>
              <path d="M 20 40 L 0 80 L 60 40 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
              <rect x={-10} y={-70} width={330} height={112} rx={44} fill="#fff" stroke={INK} strokeWidth={6} />
              <text x={155} y={10} textAnchor="middle" fontFamily="Amiri, serif" fontSize={58} fill={TEAL}>بِسْمِ اللّٰهِ</text>
            </g>
          ) : null}
          <Table t={t} kx={kidIn} />
        </svg>
      </div>
      <Burst t={t} at={S(2) + 0.1} x={260} y={380} color={TEAL} />
      <Burst t={t} at={S(3) + 0.1} x={260} y={380} color={PINK} />
      <Burst t={t} at={S(4) + 0.1} x={260} y={380} color={SUN} />
      <Burst t={t} at={S(6) + 0.3} x={540} y={700} color={SUN} />
      <Tracker t={t} />
      <Hook t={t} />
      <Source t={t} />
      <RuleCard t={t} />
      <Recap t={t} />
      <Captions t={t} />
      <Img src={staticFile("day1/islam-for-little-ones.png")} style={{ position: "absolute", top: 230, right: 50, width: 86, height: 86, borderRadius: 43, border: "5px solid #fff" }} />
      {t >= end ? (
        <AbsoluteFill style={{ background: `rgba(43,179,163,${0.95 * Math.min(1, (t - end) / 0.3)})`, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
          <Img src={staticFile("day1/islam-for-little-ones.png")} style={{ width: 300, height: 300, borderRadius: 150, border: "8px solid #fff", transform: `scale(${endP})` }} />
          <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 72, color: "#fff", opacity: endP }}>Islam for Little Ones</div>
        </AbsoluteFill>
      ) : null}
      <Audio src={staticFile("day1/kidsshort-mix.m4a")} />
    </AbsoluteFill>
  );
};
