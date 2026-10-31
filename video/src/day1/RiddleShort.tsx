import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing, Audio } from "remotion";
import data from "./riddle-timing.json";
import { tw, pop, clamp, prng, Kid, Mum, Person, Defs } from "../kids/kit";

type Tok = [string, number, number];
type Line = { id: string; start: number; end: number; tokens: Tok[] };
const LINES = data.lines as unknown as Line[];
export const RIDDLE_DUR = data.total as number;
const S = (i: number) => LINES[i].start;
const E = (i: number) => LINES[i].end;
const W = (i: number, word: string) => {
  const k = LINES[i].tokens.find((x) => x[0].toLowerCase().replace(/[^a-z0-9]/g, "").startsWith(word));
  return k ? k[1] : LINES[i].start;
};

const NAVY = "#16213e";
const CREAM = "#fff4e0";
const ORANGE = "#ff8c42";
const GOLD = "#ffc857";
const RED = "#ff5a4e";
const MONT = "Montserrat, sans-serif";
const BALOO = "'Baloo 2', Montserrat, sans-serif";

const rs = prng(23);
const STARS = Array.from({ length: 80 }, () => ({ x: rs() * 1080, y: rs() * 900, r: 1 + rs() * 2.6, w: 0.6 + rs() * 2, p: rs() * 6.28 }));

const Sky: React.FC<{ t: number; dark: number }> = ({ t, dark }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b1230" />
        <stop offset="0.6" stopColor="#24345f" />
        <stop offset="1" stopColor="#1a2547" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#sky)" />
    {STARS.map((s, i) => <circle key={i} cx={s.x} cy={s.y + 120} r={s.r} fill="#fff8e1" opacity={0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.w + s.p))} />)}
    <circle cx={880} cy={330} r={70} fill="#f4ecd0" opacity={0.9} />
    <circle cx={905} cy={315} r={62} fill="#24345f" opacity={0.95} />
    <rect width={1080} height={1920} fill="#000" opacity={dark} />
  </svg>
);

/* torch with flickering flame; alive 0..1 */
const Torch: React.FC<{ x: number; y: number; s: number; t: number; alive: number }> = ({ x, y, s, t, alive }) => {
  const fl = 1 + 0.08 * Math.sin(t * 17) + 0.05 * Math.sin(t * 29);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle cy={-150} r={220} fill="url(#torchGlow)" opacity={0.8 * alive} />
      <rect x={-16} y={-120} width={32} height={230} rx={10} fill="#7a4f2a" />
      <path d="M -34 -130 L 34 -130 L 24 -100 L -24 -100 Z" fill="#9a9a9a" />
      <g transform={`translate(0,-130) scale(${alive * fl},${alive * fl})`}>
        <path d="M 0 -150 C 40 -100 54 -60 40 -20 C 30 6 -30 6 -40 -20 C -54 -60 -30 -90 0 -150 Z" fill={ORANGE} />
        <path d="M 0 -96 C 20 -70 26 -46 18 -24 C 12 -8 -12 -8 -18 -24 C -26 -46 -14 -64 0 -96 Z" fill="#ffe08a" />
      </g>
      {alive < 0.5 ? [0, 1, 2].map((i) => <circle key={i} cx={10 * Math.sin(t * 2 + i)} cy={-160 - ((t * 60 + i * 40) % 120)} r={10 + i * 3} fill="#8a8a9a" opacity={0.3 * (1 - alive)} />) : null}
    </g>
  );
};

const Timer: React.FC<{ t: number }> = ({ t }) => {
  // 17:00 shown from frame 0, ticks down slowly; slams to 0:00 at "out"; resets to 17:00 at line 8
  const out = W(7, "out");
  let secs = Math.max(0, 17 * 60 - Math.floor(t * 4));
  let col = CREAM;
  if (t >= out - 0.6 && t < S(8) - 0.1) { secs = Math.round(interpolate(t, [out - 0.6, out], [secs, 0], clamp)); col = RED; }
  if (t >= S(8) - 0.1) { secs = 17 * 60; col = GOLD; }
  const mm = Math.floor(secs / 60), ss = secs % 60;
  const k = pop(t, 0, 0.4);
  const flash = t >= S(8) - 0.1 ? pop(t, W(8, "seventeen"), 0.5) : 0;
  return (
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${0.7 + 0.3 * k + 0.12 * flash * (1 - flash)})`, background: "rgba(10,16,40,0.75)", border: `6px solid ${col}`, borderRadius: 30, padding: "6px 34px", fontFamily: MONT, fontWeight: 800, fontSize: 92, color: col, letterSpacing: "0.04em" }}>
        {mm}:{String(ss).padStart(2, "0")}
      </div>
    </div>
  );
};

const Gorge: React.FC<{ t: number; sway: number }> = ({ t, sway }) => {
  const sag = 60 + 22 * sway * Math.sin(t * 6);
  const planks = Array.from({ length: 14 }, (_, i) => i);
  return (
    <g>
      <path d="M -10 760 L 300 760 L 330 800 L 290 1100 L -10 1100 Z" fill="#3b2f4a" />
      <path d="M 1090 760 L 780 760 L 750 800 L 790 1100 L 1090 1100 Z" fill="#3b2f4a" />
      <path d="M -10 760 L 300 760 L 306 772 L -10 772 Z" fill="#5a4a6a" />
      <path d="M 1090 760 L 780 760 L 774 772 L 1090 772 Z" fill="#5a4a6a" />
      <path d={`M 300 700 Q 540 ${700 + sag} 780 700`} stroke="#c9a46a" strokeWidth={8} fill="none" />
      {planks.map((i) => {
        const x = 304 + i * 34;
        const u = (x - 300) / 480;
        const y = 762 + 4 * sag * u * (1 - u);
        return <rect key={i} x={x} y={y - 6} width={28} height={14} rx={3} fill="#a77b45" transform={`rotate(${6 * sway * Math.sin(t * 6 + i)} ${x + 14} ${y})`} />;
      })}
      <path d={`M 300 764 Q 540 ${764 + 2 * sag} 780 764`} stroke="#8a6436" strokeWidth={6} fill="none" />
    </g>
  );
};

const Crew: React.FC<{ t: number }> = ({ t }) => {
  // walk in from the left during line 1
  const walk = tw(t, S(1), 1.6, -420, 0);
  const bob = (ph: number) => (t < S(1) + 1.6 && t > S(1) ? 8 * Math.abs(Math.sin(t * 9 + ph)) : 0);
  const tag = (word: string, i: number) => pop(t, W(3, word), 0.4) * (i ? 1 : 1);
  const tags = [
    { name: "ADAM", time: "1 MIN", w: "adam", x: 70 },
    { name: "ZARA", time: "2 MIN", w: "zara", x: 140 },
    { name: "OMAR", time: "5 MIN", w: "omar", x: 210 },
    { name: "GRANDAD", time: "10 MIN", w: "grandad", x: 280 },
  ];
  return (
    <g transform={`translate(${walk},0)`}>
      <Kid x={70} y={760} s={0.5} bob={bob(0)} shirt="#2bb3a3" pants="#2b4a7d" />
      <Mum x={140} y={760} s={0.42} bob={bob(1)} dress="#c0507a" hijab="#f0a6c0" />
      <Kid x={210} y={760} s={0.5} bob={bob(2)} shirt="#ff8c42" pants="#4a3a6d" cap={false} />
      <g>
        <Person x={278} y={760} s={0.62} robe="#8a8f9a" cloth="#f2f2ea" skin="#d6a77e" bob={bob(3)} />
        <line x1={306} y1={660} x2={318} y2={760} stroke="#6b4a2a" strokeWidth={6} strokeLinecap="round" />
      </g>
      {tags.map((g, i) => {
        const p = tag(g.w, i);
        return p > 0 ? (
          <g key={g.name} transform={`translate(${g.x},${560 - (i % 2) * 70}) scale(${p})`}>
            <rect x={-58} y={-34} width={116} height={68} rx={16} fill={CREAM} stroke={NAVY} strokeWidth={4} />
            <text y={-6} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={18} fill={NAVY}>{g.name}</text>
            <text y={22} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={24} fill={ORANGE}>{g.time}</text>
          </g>
        ) : null;
      })}
    </g>
  );
};

const RuleCard: React.FC<{ t: number; at: number; until: number; text: string; sub?: string; color?: string }> = ({ t, at, until, text, sub, color = CREAM }) => {
  const p = pop(t, at, 0.45);
  const o = interpolate(t, [at, at + 0.1, until - 0.2, until], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `scale(${p}) rotate(-2deg)`, background: color, color: NAVY, borderRadius: 24, padding: "16px 40px", border: `6px solid ${NAVY}`, boxShadow: "0 10px 0 rgba(0,0,0,0.25)", textAlign: "center" }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 58, lineHeight: 1.05 }}>{text}</div>
        {sub ? <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 32, color: "#5a5a7a", marginTop: 6 }}>{sub}</div> : null}
      </div>
    </div>
  );
};

const Ledger: React.FC<{ t: number }> = ({ t }) => {
  const rows = [
    ["GRANDAD + ADAM  →", "10"],
    ["ADAM BACK  ←", "1"],
    ["OMAR + ADAM  →", "5"],
    ["ADAM BACK  ←", "1"],
    ["ZARA + ADAM  →", "2"],
  ];
  const a = S(6) + 0.2, b = E(6);
  const o = interpolate(t, [a, a + 0.2, E(7) + 0.1, E(7) + 0.4], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const step = (b - a) / 6;
  const shown = rows.filter((_, i) => t >= a + i * step).length;
  const total = rows.slice(0, shown).reduce((s, r) => s + Number(r[1]), 0);
  const stamp = pop(t, W(7, "too"), 0.4);
  return (
    <div style={{ position: "absolute", top: 440, left: 120, right: 120, opacity: o, background: "rgba(255,244,224,0.96)", borderRadius: 26, border: `6px solid ${NAVY}`, padding: "22px 34px", fontFamily: MONT, fontWeight: 800, color: NAVY }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 38, lineHeight: 1.45, opacity: i < shown ? 1 : 0.15 }}>
          <span>{r[0]}</span><span style={{ color: ORANGE }}>{r[1]}</span>
        </div>
      ))}
      <div style={{ borderTop: `5px solid ${NAVY}`, marginTop: 10, paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 52 }}>
        <span>TOTAL</span><span style={{ color: total > 17 ? RED : NAVY }}>{total} MIN</span>
      </div>
      {stamp > 0 ? (
        <div style={{ position: "absolute", right: -30, bottom: -40, transform: `rotate(-12deg) scale(${stamp})`, border: `8px solid ${RED}`, color: RED, borderRadius: 18, padding: "4px 22px", fontSize: 64, background: "rgba(255,244,224,0.92)" }}>19 &gt; 17 ✗</div>
      ) : null}
    </div>
  );
};

const Question: React.FC<{ t: number }> = ({ t }) => {
  const at = S(9) - 0.1;
  const p = pop(t, at, 0.5);
  if (t < at) return null;
  return (
    <div style={{ position: "absolute", top: 430, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div style={{ transform: `scale(${p}) rotate(-2deg)`, background: CREAM, border: `8px solid ${NAVY}`, borderRadius: 30, padding: "26px 40px", textAlign: "center", boxShadow: "0 12px 0 rgba(0,0,0,0.3)" }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 74, color: NAVY, lineHeight: 1.05 }}>ALL 4 ACROSS<br />IN <span style={{ color: ORANGE }}>17</span> MINUTES?</div>
      </div>
      <div style={{ transform: `scale(${pop(t, S(10), 0.5)})`, display: "flex", alignItems: "center", gap: 18, background: ORANGE, borderRadius: 60, padding: "12px 34px" }}>
        <span style={{ fontSize: 56 }}>💬</span>
        <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 46, color: NAVY }}>COMMENT YOUR ANSWER</span>
      </div>
      <div style={{ transform: `scale(${pop(t, W(10, "solution"), 0.5)})`, fontFamily: MONT, fontWeight: 800, fontSize: 44, color: GOLD, textAlign: "center" }}>SOLUTION TOMORROW AT SUNRISE 🌅</div>
    </div>
  );
};

const Captions: React.FC<{ t: number }> = ({ t }) => {
  const line = LINES.find((l) => t >= l.start - 0.15 && t <= l.end + 0.3);
  if (!line) return null;
  const o = interpolate(t, [line.start - 0.15, line.start, line.end + 0.1, line.end + 0.3], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1220, height: 300, display: "flex", alignItems: "center", justifyContent: "center", opacity: o }}>
      <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 66, lineHeight: 1.12, textAlign: "center", color: CREAM }}>
        {line.tokens.map(([w, a], i) => {
          const on = t >= a - 0.02;
          const num = /\d|seventeen|nineteen|one|two|five|ten|minute/i.test(w);
          const k = pop(t, a - 0.02, 0.28);
          return (
            <span key={i} style={{ display: "inline-block", margin: "0 10px", color: on ? (num ? GOLD : CREAM) : "rgba(255,244,224,0.3)", transform: `translateY(${(1 - k) * 12}px) scale(${0.92 + 0.08 * k})`, WebkitTextStroke: "3px #0b1230", paintOrder: "stroke fill" }}>{w}</span>
          );
        })}
      </div>
    </div>
  );
};

const Header: React.FC = () => (
  <div style={{ position: "absolute", top: 222, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
    <Img src={staticFile("day1/solve-by-sunrise.png")} style={{ width: 62, height: 62, borderRadius: 31 }} />
    <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 32, color: CREAM, letterSpacing: "0.05em" }}>SOLVE BY SUNRISE · RIDDLE #1</span>
  </div>
);

export const RiddleShort: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const out = W(7, "out");
  const alive = t < out - 0.3 ? 1 : t < S(8) ? interpolate(t, [out - 0.3, out + 0.2], [1, 0], clamp) : interpolate(t, [S(8), S(8) + 0.5], [0, 1], clamp);
  const dark = t < out - 0.3 ? 0 : t < S(8) ? interpolate(t, [out - 0.3, out + 0.3], [0, 0.55], clamp) : interpolate(t, [S(8), S(8) + 0.5], [0.55, 0], clamp);
  // camera: hook = torch close-up, then pull back to the gorge
  const zoom = interpolate(t, [0, S(1) - 0.1, S(1) + 0.9], [2.1, 2.1, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const sway = interpolate(t, [S(2), S(2) + 0.3, E(2), E(2) + 0.5], [0, 1, 1, 0], clamp);
  const sceneO = interpolate(t, [S(6) + 0.1, S(6) + 0.4, E(7) + 0.2, E(7) + 0.5], [1, 0.25, 0.25, 1], clamp) * (t > S(9) - 0.2 ? interpolate(t, [S(9) - 0.2, S(9) + 0.2], [1, 0.3], clamp) : 1);
  const end = E(10) + 0.3;
  const endP = pop(t, end, 0.5);
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Sky t={t} dark={dark} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Defs />
        <defs>
          <radialGradient id="torchGlow"><stop offset="0" stopColor="#ffd27a" stopOpacity={0.85} /><stop offset="1" stopColor="#ff8c42" stopOpacity={0} /></radialGradient>
        </defs>
        <g opacity={sceneO} transform={`translate(540,700) scale(${zoom}) translate(-540,-700)`}>
          <Gorge t={t} sway={sway} />
          {t > S(1) - 0.2 ? <Crew t={t} /> : null}
          {t > S(2) && t < E(2) + 0.3 ? (
            <g>
              <Kid x={470} y={790} s={0.45} shirt="#2bb3a3" />
              <Kid x={600} y={796} s={0.45} shirt="#ff8c42" cap={false} />
              <g opacity={pop(t, W(2, "two"), 0.3)}>
                <Mum x={720} y={800} s={0.38} dress="#c0507a" hijab="#f0a6c0" />
                <path d="M 680 560 L 760 640 M 760 560 L 680 640" stroke={RED} strokeWidth={14} strokeLinecap="round" />
              </g>
            </g>
          ) : null}
          <Torch x={540} y={640} s={0.7} t={t} alive={alive} />
          {t > S(5) - 0.1 && t < E(5) + 0.3 ? (
            <g opacity={interpolate(t, [S(5) - 0.1, S(5) + 0.2, E(5), E(5) + 0.3], [0, 1, 1, 0], clamp)}>
              <path d={`M 760 560 Q 540 ${460 - 20 * Math.sin(t * 4)} 320 560`} stroke={GOLD} strokeWidth={10} fill="none" strokeDasharray="22 16" strokeDashoffset={-t * 120} />
              <path d="M 320 560 l 34 -26 l 4 40 z" fill={GOLD} />
            </g>
          ) : null}
        </g>
      </svg>
      <Timer t={t} />
      <Header />
      <RuleCard t={t} at={S(2)} until={E(2) + 0.3} text="MAX 2 ON THE BRIDGE" />
      <RuleCard t={t} at={S(4)} until={E(4) + 0.3} text="PAIR = SLOWER SPEED" sub="Adam + Grandad = 10 min" />
      <RuleCard t={t} at={S(5)} until={E(5) + 0.3} text="TORCH MUST COME BACK" />
      <Ledger t={t} />
      {t > S(8) && t < S(9) - 0.1 ? (
        <div style={{ position: "absolute", top: 460, left: 0, right: 0, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 280, color: GOLD, transform: `scale(${pop(t, W(8, "seventeen"), 0.5)})`, WebkitTextStroke: "10px #0b1230", paintOrder: "stroke fill" }}>17</div>
      ) : null}
      <Question t={t} />
      <Captions t={t} />
      {t >= end ? (
        <AbsoluteFill style={{ background: `rgba(11,18,48,${0.9 * Math.min(1, (t - end) / 0.3)})`, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
          <Img src={staticFile("day1/solve-by-sunrise.png")} style={{ width: 300, height: 300, borderRadius: 150, transform: `scale(${endP})` }} />
          <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, color: CREAM, opacity: endP }}>Solve by Sunrise</div>
          <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 38, color: GOLD, opacity: endP }}>One riddle a day · answer tomorrow</div>
        </AbsoluteFill>
      ) : null}
      <Audio src={staticFile("day1/riddle-mix.m4a")} />
    </AbsoluteFill>
  );
};
