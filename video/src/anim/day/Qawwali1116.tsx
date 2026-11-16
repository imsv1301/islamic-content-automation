import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import beats from "../qawwali/jholi-beats.json";
import { Words, EndCard, pulseAt, G, Credit } from "../qawwali/QawwaliStory";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Stars, Glow, flick, PETAL, prng, k, ease } from "../qawwali/anim/QawwaliAnim";
import { rn } from "./AnimKit";

/* Mehfil-e-Sama qawwali · 16 Nov 2026 · "Bhar Do Jholi Meri Ya Muhammad" (Sabri Brothers; f-BfJjp_XaY, clip 133.0–189.0 s:
   the refrain "Bhar do jholi meri Ya Muhammad, laut kar main na jaunga khali" + "bhar do jholi hum sab ki", complete lines).
   Modern kalam (Purnam Allahabadi) -> NO lyrics on screen beyond the title; title + credits only; the animation acts out the meaning:
   a young seeker comes at night with an empty cloth (jholi) to a lit doorway, holds it out with adab, will not go back empty,
   light and rose petals fill it, then other ordinary people come with their empty cloths and all are filled.
   The doorway is only light (never a drawn dome or any figure). Ordinary people only; no halo behind any head; no spinning text. Silent render. */
export const JHOLI_DUR = 56.0;
const BEATS = (beats as { beats: number[] }).beats;
const W = 1080, H = 1920;
const SEEK: Look = { beard: false, cap: "#f8f4eb", top: "#e9dcc3", topD: "#c8b89a", shawl: true, hair: "#1f1510" };
const PPL = (i: number): Look => ({ beard: i === 0, cap: i === 0 ? "#ffffff" : null, hijab: i === 1 ? "#5c4a7a" : null, long: i === 1, top: ["#8a6a4a", "#9c86b8", "#4f7a6b"][i], topD: ["#6b5038", "#7d6898", "#3a5f52"][i], pants: "#3a3040", shawl: false, hair: "#2a1d14", kid: i === 2, skin: [["#e3b58e", "#c99a72", "#a77850"], ["#f0c9a4", "#d9a982", "#b8865f"], ["#c99a72", "#ad7c55", "#8a5d3a"]][i] as [string, string, string] });
const GROUPS: G[] = [{ a: 4.4, b: 9.4, words: [{ w: "BHAR DO", t: 4.48, big: true, gold: true }, { w: "JHOLI", t: 5.88, big: true, hold: 9.2 }] }];
const CREDIT: Credit = { title: ["Bhar Do", "Jholi"], kalam: "QAWWALI", artist: "SABRI BROTHERS", rights: "AUDIO © ORIGINAL PUBLISHER · SHARED WITH CREDIT" };

/* night lane with a lit doorway at the end; door = light (open) */
const Lane: React.FC<{ t: number; open?: number; dawn?: number }> = ({ t, open = 0.3, dawn = 0 }) => (
  <g>
    <defs><linearGradient id="ln16" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={dawn > 0.5 ? "#f2a65a" : "#120c22"} /><stop offset="60%" stopColor={dawn > 0.5 ? "#ffd8a0" : "#2e1d3a"} /><stop offset="100%" stopColor="#3b2416" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#ln16)" />
    <Stars t={t} o={1 - dawn} />
    {/* side walls in perspective */}
    <path d="M 0 300 L 400 820 L 400 1260 L 0 1700 Z" fill="#241827" /><path d="M 1080 300 L 680 820 L 680 1260 L 1080 1700 Z" fill="#241827" />
    <path d="M 0 1700 L 400 1260 L 680 1260 L 1080 1700 L 1080 1920 L 0 1920 Z" fill="#3a2a22" />
    {/* the doorway: an arch of light only */}
    <path d="M 440 1260 L 440 960 Q 540 840 640 960 L 640 1260 Z" fill="#5a3824" />
    <path d="M 456 1260 L 456 968 Q 540 862 624 968 L 624 1260 Z" fill="#fff1c8" opacity={0.25 + 0.75 * open} />
    <Glow id="dr16" cx={540} cy={1080} r={260 + 340 * open} c="#ffe7a8" o={0.35 + 0.45 * open} />
    {/* light spilling down the lane */}
    <path d="M 456 1260 L 624 1260 L 900 1920 L 180 1920 Z" fill="#ffe7a8" opacity={0.12 * open} />
    {/* lamps along the walls */}
    {[[150, 760], [930, 760], [300, 960], [780, 960]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><rect x={-14} y={-30} width={28} height={44} rx={6} fill="#ffcf6a" opacity={0.85 * flick(t, i)} /><Glow id={`lp16${i}`} cx={0} cy={-8} r={140} c="#ffb547" o={0.4 * flick(t, i)} /></g>)}
  </g>
);
/* the jholi (cloth held out in front at hand height); fill 0..1 */
const Jholi: React.FC<{ x: number; y: number; s?: number; fill?: number; t: number; c?: string }> = ({ x, y, s = 1, fill = 0, t, c = "#2e7d5b" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M -120 0 Q 0 ${70 + 40 * fill} 120 0`} stroke={c} strokeWidth={14} fill="none" />
    {fill > 0 && <g>{Array.from({ length: Math.round(14 * fill) }, (_, i) => { const r = rn(i + 40); return <path key={i} d={PETAL} transform={`translate(${-80 + r() * 160} ${20 + r() * 40 * fill}) rotate(${i * 50}) scale(${0.7 + r() * 0.4})`} fill={i % 3 ? "#c8143c" : "#ff6f8e"} />; })}
      <Glow id={`jg${Math.round(x)}`} cx={0} cy={30} r={140} c="#ffe7a8" o={0.6 * fill * (0.85 + 0.15 * Math.sin(t * 5))} /></g>}
    <path d={`M -120 0 Q 0 ${90 + 40 * fill} 120 0 Q 0 ${50 + 40 * fill} -120 0 Z`} fill={c} opacity={0.95} />
  </g>
);
const Petals: React.FC<{ t: number; a: number; n?: number; seed?: number; x0?: number; x1?: number; sink?: number }> = ({ t, a, n = 40, seed = 7, x0 = 0, x1 = W, sink = H }) => (
  <g>{Array.from({ length: n }, (_, i) => { const r = rn(i + seed * 100), x = x0 + r() * (x1 - x0), sp = 120 + r() * 180, d = t - a - r() * 2; if (d < 0) return null; const y = -60 + d * sp; if (y > sink) return null; return <path key={i} d={PETAL} transform={`translate(${x + Math.sin(t * 2 + i) * 30} ${y}) rotate(${i * 40 + (t - a) * 30}) scale(${0.7 + r()})`} fill={i % 3 ? "#c8143c" : "#ff6f8e"} opacity={0.9} />; })}</g>
);

/* A 0–8: he walks down the night lane toward the lit doorway, the empty cloth over his arm */
const S_Walk: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const go = ease(t / 6);
  return (
    <g>
      <Lane t={t} open={0.3 + 0.1 * pulse} />
      <g transform={`translate(${560 - 20 * go} ${1900 - 420 * go}) scale(${0.95 - 0.5 * go})`}>
        <Seeker uid="jk1" t={t} look={SEEK} back walk={t * 6} lArm={[-4, 8]} rArm={[-4, 8]} wind={0.4} />
      </g>
    </g>
  );
};
/* B 8–16: at the door he holds the empty cloth out with adab, head bowed */
const S_Ask: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const up = k(t, 6.6, 8.2), bow = k(t, 8.5, 9.6);
  return (
    <g>
      <rect width={W} height={H} fill="#1a1024" />
      <Stars t={t} o={0.6} />
      <path d="M 180 1500 L 180 600 Q 540 220 900 600 L 900 1500 Z" fill="#5a3824" />
      <path d="M 230 1500 L 230 640 Q 540 300 850 640 L 850 1500 Z" fill="#fff1c8" opacity={0.45 + 0.1 * pulse} />
      <Glow id="dr16b" cx={540} cy={900} r={700} c="#ffe7a8" o={0.4} />
      <rect y={1500} width={W} height={420} fill="#3a2a22" />
      <g transform="translate(540 1900) scale(1.0)">
        <Seeker uid="jk2" t={t} look={SEEK} back lArm={[-20 * up - 4, 40 * up + 8]} rArm={[-20 * up - 4, 40 * up + 8]} nod={20 * bow} wind={0.3} />
      </g>
      <g opacity={up}><Jholi x={540} y={1900 - 420 - 40 * up} s={1.2} t={t} /></g>
    </g>
  );
};
/* C 16–23: "laut kar main na jaunga khali": he sits by the door and waits, the cloth still empty in his hands, a tear */
const S_Wait: React.FC<{ t: number; pulse: number }> = ({ t }) => (
  <g>
    <Lane t={t} open={0.45} />
    <g transform="translate(300 1760) scale(0.75)">
      <Seeker uid="jk3" t={t} look={SEEK} blink={blinkAt(t, 3)} gazeX={0.7} gazeY={-0.4} brow={0.3} closed={0.2} tear={k(t, 15, 20)} lArm={[20, 60]} rArm={[20, 60]} wind={0.3} />
    </g>
    <Jholi x={300} y={1760 - 360 * 0.75} s={0.75} t={t} />
  </g>
);
/* D 23–31: the door opens wide; light and rose petals pour down and fill his cloth */
const S_Fill: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const open = k(t, 21, 23), fill = k(t, 22.5, 29);
  return (
    <g>
      <Lane t={t} open={0.5 + 0.5 * open + 0.1 * pulse} />
      <Petals t={t} a={21.6} n={60} seed={3} x0={300} x1={780} sink={1500} />
      <g transform="translate(540 1900) scale(0.95)">
        <Seeker uid="jk4" t={t} look={SEEK} blink={blinkAt(t, 4)} gazeY={-0.5} wide={0.6 * open} smile={0.6 * fill} lArm={[10, 40]} rArm={[10, 40]} wind={0.3} />
      </g>
      <Jholi x={540} y={1900 - 360 * 0.95} s={1.0} t={t} fill={fill} />
    </g>
  );
};
/* E 31–37: tears of joy; he presses the full cloth to his heart */
const S_Joy: React.FC<{ t: number; pulse: number }> = ({ t }) => {
  const S = interp(ease((t - 30) / 6), [0, 1], [1.5, 1.8]);
  return (
    <g>
      <rect width={W} height={H} fill="#1a1024" />
      <Glow id="jy16" cx={540} cy={1400} r={700} c="#ffb547" o={0.35} />
      <Petals t={t} a={29.5} n={25} seed={9} />
      <g transform={`translate(540 ${560 + 790 * S}) scale(${S})`}>
        <Seeker uid="jk5" t={t} look={SEEK} blink={blinkAt(t, 5)} closed={0.6} smile={0.9} tear={((t - 30) / 4) % 1} lArm={[30, 110]} rArm={[30, 110]} wind={0.2} />
      </g>
    </g>
  );
};
/* F 37–47: "bhar do jholi hum sab ki": others come down the lane with empty cloths; petals fill every one */
const S_All: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const come = k(t, 36, 39.5);
  const P = [{ x: 200, s: 0.62 }, { x: 420, s: 0.6 }, { x: 650, s: 0.62 }, { x: 870, s: 0.48 }];
  return (
    <g>
      <Lane t={t} open={0.9 + 0.1 * pulse} />
      <Petals t={t} a={40} n={80} seed={5} sink={1560} />
      {P.map((p, i) => { const fill = k(t, 41 + i * 0.7, 45 + i * 0.5); const y = 1840 + 120 * (1 - come);
        return <g key={i}>
          <g transform={`translate(${p.x} ${y}) scale(${p.s})`}>
            {i === 1 ? <Seeker uid="jk6" t={t} look={SEEK} blink={blinkAt(t, 6)} gazeY={-0.5} smile={1} lArm={[10, 40]} rArm={[10, 40]} wind={0.3} />
              : <Seeker uid={`jp${i}`} t={t} look={PPL(i === 0 ? 0 : i === 2 ? 1 : 2)} blink={blinkAt(t, 10 + i)} gazeY={-0.5} smile={0.4 + 0.6 * fill} lArm={[10, 40]} rArm={[10, 40]} />}
          </g>
          <Jholi x={p.x} y={y - 360 * p.s} s={p.s * 1.05} t={t} fill={fill} c={["#8a1f3d", "#2e7d5b", "#b5652c", "#1f5f8a"][i]} />
        </g>; })}
    </g>
  );
};
/* G 47–56: dawn; everyone raises their hands in thanks; end card */
const S_Dawn: React.FC<{ t: number; pulse: number }> = ({ t }) => {
  const dawn = k(t, 47, 50), up = k(t, 47.5, 49);
  return (
    <g>
      <Lane t={t} open={1} dawn={dawn} />
      <Petals t={t} a={46} n={40} seed={11} />
      {[{ x: 220, l: PPL(0), s: 0.6 }, { x: 430, l: SEEK, s: 0.62 }, { x: 650, l: PPL(1), s: 0.6 }, { x: 860, l: PPL(2), s: 0.46 }].map((p, i) => (
        <g key={i} transform={`translate(${p.x} 1860) scale(${p.s})`}><Seeker uid={`jd${i}`} t={t} look={p.l} blink={blinkAt(t, 30 + i)} smile={1} closed={0.4} gazeY={-0.6} lArm={[-60 * up - 4, 60 * up + 8]} rArm={[-60 * up - 4, 60 * up + 8]} wind={0.3} /></g>
      ))}
    </g>
  );
};

type Shot = { a: number; b: number; r: (t: number, pulse: number) => React.ReactNode };
const SHOTS: Shot[] = [
  { a: 0, b: 6.0, r: (t, p) => <S_Walk t={t} pulse={p} /> },
  { a: 6.0, b: 12.7, r: (t, p) => <S_Ask t={t} pulse={p} /> },
  { a: 12.7, b: 21.0, r: (t, p) => <S_Wait t={t} pulse={p} /> },
  { a: 21.0, b: 30.0, r: (t, p) => <S_Fill t={t} pulse={p} /> },
  { a: 30.0, b: 36.0, r: (t, p) => <S_Joy t={t} pulse={p} /> },
  { a: 36.0, b: 47.0, r: (t, p) => <S_All t={t} pulse={p} /> },
  { a: 47.0, b: JHOLI_DUR + 1, r: (t, p) => <S_Dawn t={t} pulse={p} /> },
];
const XF = 0.3;

export const Qawwali1116: React.FC<{ withAudio?: boolean }> = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t, BEATS);
  const fade = Math.max(interp(t, [0, 0.6], [1, 0]), interp(t, [JHOLI_DUR - 1.2, JHOLI_DUR], [0, 1]));
  /* dip through dark at every cut instead of cross-fading characters over each other */
  const dip = Math.max(0, ...SHOTS.slice(1).map((s) => 1 - Math.abs(t - s.a) / XF));
  return (
    <AbsoluteFill style={{ background: "#07040c" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => {
          if (t < s.a || t >= s.b) return null;
          return <g key={i} transform={`translate(540 960) scale(${1 + 0.006 * pulse}) translate(-540 -960)`}>{s.r(t, pulse)}</g>;
        })}
        <defs><radialGradient id="vig16" cx="50%" cy="46%" r="75%"><stop offset="60%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.5} /></radialGradient></defs>
        <rect width={W} height={H} fill="url(#vig16)" />
      </svg>
      <AbsoluteFill style={{ background: "#07040c", opacity: dip * 0.85 }} />
      <Words t={t} pulse={pulse} groups={GROUPS} />
      <EndCard t={t} start={51.8} credit={CREDIT} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "0.12em", color: "rgba(255,245,232,0.8)", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>SABRI BROTHERS · BHAR DO JHOLI</div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
