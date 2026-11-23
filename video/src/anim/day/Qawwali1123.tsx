import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import beats from "../qawwali/yaad-beats.json";
import { Words, EndCard, pulseAt, G, Credit } from "../qawwali/QawwaliStory";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Stars, Glow, flick, PETAL, k } from "../qawwali/anim/QawwaliAnim";
import { rn } from "./AnimKit";

/* Mehfil-e-Sama qawwali · 23 Nov 2026 (Monday) · "Yaad-e-Nabi Ka Gulshan Mehka" (Ustad Nusrat Fateh Ali Khan; H6ff2pnxUn0,
   clip 120.8–181.3 s: the refrain "Yaad-e-Nabi ka gulshan mehka, mehka lagta hai", "Mehfil mein maujood hain Aaqa, aisa lagta hai" x2,
   "Naam-e-Muhammad kitna meetha meetha lagta hai" x2, ending on the verse end before the next repeat).
   Modern qawwali -> NO lyric lines on screen, only the title words + credits; the animation acts out the meaning.
   The Prophet ﷺ is NEVER drawn or shown as a figure: remembrance = a garden blooming, the mehfil = ordinary people and lamps
   that brighten, the blessed name = gold calligraphy only. No halo behind any head; no spinning text. Silent render. */
export const YAAD_DUR = 60.5;
const BEATS = (beats as { beats: number[] }).beats;
const W = 1080, H = 1920;
const SEEK: Look = { beard: true, cap: "#f4efe6", top: "#e9dcc3", topD: "#c8b89a", shawl: true, hair: "#1f1510", beardC: "#2a1d14" };
const M1: Look = { beard: true, cap: "#2e7d5b", top: "#cfe3d6", topD: "#a9c7b4", shawl: false, hair: "#1a120c" };
const M2: Look = { beard: true, cap: null, top: "#d9c7a6", topD: "#b9a684", shawl: true, hair: "#24170f", beardC: "#8a8a8a", skin: ["#c99a72", "#ad7c55", "#8a5d3a"] };
const M3: Look = { beard: false, cap: "#ffffff", top: "#b8c9e0", topD: "#93a7c2", shawl: false, hair: "#120c08", skin: ["#e3b58e", "#c99a72", "#a77850"] };
const GROUPS: G[] = [
  { a: 0.4, b: 4.8, words: [{ w: "YAAD-E-NABI", t: 0.5, big: true, gold: true }, { w: "KA GULSHAN", t: 1.5 }] },
  { a: 4.8, b: 8.0, words: [{ w: "MEHKA", t: 4.9, big: true, gold: true, hold: 7.8 }] },
];
const CREDIT: Credit = { title: ["Yaad-e-Nabi Ka", "Gulshan Mehka"], kalam: "QAWWALI", artist: "USTAD NUSRAT FATEH ALI KHAN", rights: "AUDIO © ORIGINAL PUBLISHER · SHARED WITH CREDIT" };

const Rose: React.FC<{ x: number; y: number; o: number; s?: number; t: number; i: number }> = ({ x, y, o, s = 1, t, i }) => o <= 0 ? null : (
  <g transform={`translate(${x} ${y + Math.sin(t * 1.5 + i) * 3}) scale(${s * Math.min(1, o)})`}>
    <path d="M 0 0 L 0 90" stroke="#2f6b3a" strokeWidth={6} />
    <ellipse cx={-22} cy={50} rx={20} ry={9} fill="#3f8a4c" transform="rotate(-30 -22 50)" />
    {[0, 72, 144, 216, 288].map((r, j) => <path key={j} d={PETAL} transform={`rotate(${r + 10 * Math.sin(t + i)}) translate(0 -14) scale(1.1)`} fill={j % 2 ? "#c8143c" : "#e0284f"} />)}
    <circle r={10} fill="#8a0d2a" />
  </g>
);
const ROSES = Array.from({ length: 22 }, (_, i) => { const r = rn(i + 500); return { x: 60 + r() * 960, y: 1300 + r() * 420, s: 0.7 + r() * 0.6 }; });
const Garden: React.FC<{ t: number; bloom: number; dawn?: number; pulse: number }> = ({ t, bloom, dawn = 0, pulse }) => (
  <g>
    <defs><linearGradient id="gq23" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={dawn > 0.5 ? "#f0a86a" : "#0c0a22"} /><stop offset="60%" stopColor={dawn > 0.5 ? "#ffe0b0" : "#2a1f44"} /><stop offset="100%" stopColor="#1a2a1c" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#gq23)" />
    <Stars t={t} o={1 - dawn} />
    {/* courtyard arches */}
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${180 + i * 360} 1240)`}><path d="M -150 0 L -150 -420 Q 0 -620 150 -420 L 150 0" fill="none" stroke={dawn > 0.5 ? "#c48a5a" : "#3a2c4a"} strokeWidth={26} /></g>)}
    <rect y={1240} width={W} height={680} fill="#1f3a24" />
    {ROSES.map((r, i) => <Rose key={i} x={r.x} y={r.y} s={r.s} t={t} i={i} o={bloom * 22 - i} />)}
    {/* fragrance: slow golden ribbons rising from the flowers, a little brighter on the beat */}
    {Array.from({ length: 6 }, (_, i) => { const x0 = 120 + i * 170, ph = t * 0.8 + i; return <path key={i} d={`M ${x0} 1400 C ${x0 + 60 * Math.sin(ph)} 1200, ${x0 - 60 * Math.cos(ph)} 1000, ${x0 + 40 * Math.sin(ph * 1.3)} 800`} stroke="#ffd27a" strokeWidth={4} fill="none" opacity={bloom * (0.18 + 0.15 * pulse)} strokeDasharray="10 18" strokeDashoffset={-t * 40} />; })}
  </g>
);
const Lamp: React.FC<{ x: number; y: number; on: number; t: number; i: number }> = ({ x, y, on, t, i }) => (
  <g transform={`translate(${x} ${y})`}>
    <line x1={0} y1={-400} x2={0} y2={-40} stroke="#5a3b22" strokeWidth={4} />
    <path d="M -36 -40 L 36 -40 L 26 36 L -26 36 Z" fill="#8a5a2a" />
    <path d="M -24 -28 L 24 -28 L 18 26 L -18 26 Z" fill="#ffe2a0" opacity={(0.3 + 0.7 * on) * flick(t, i)} />
    <Glow id={`lq23${i}${Math.round(x)}`} cx={0} cy={0} r={140 + 120 * on} c="#ffb547" o={0.25 + 0.45 * on} />
  </g>
);
const Petals: React.FC<{ t: number; a: number; n?: number; seed?: number }> = ({ t, a, n = 36, seed = 3 }) => (
  <g>{Array.from({ length: n }, (_, i) => { const r = rn(i + seed * 100), x = r() * W, sp = 120 + r() * 180, d = t - a - r() * 2; if (d < 0) return null; const y = -60 + d * sp; if (y > H) return null; return <path key={i} d={PETAL} transform={`translate(${x + Math.sin(t * 2 + i) * 30} ${y}) rotate(${i * 40 + (t - a) * 30}) scale(${0.7 + r()})`} fill={i % 3 ? "#c8143c" : "#ff6f8e"} opacity={0.9} />; })}</g>
);

/* A 0–15.5: the seeker in a night courtyard garden with his tasbeeh, eyes closed in remembrance; roses bloom on "mehka" */
const S_Garden: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const bloom = k(t, 2.8, 12);
  return (
    <g>
      <Garden t={t} bloom={bloom} pulse={pulse} />
      <g transform="translate(540 1800) scale(0.72)"><Seeker uid="yq1" t={t} look={SEEK} blink={blinkAt(t, 1)} closed={t > 1 ? 0.9 : 0} smile={0.3 + 0.5 * bloom} nod={4 * Math.sin(t * 1.6)} lArm={[-20, 110]} rArm={[-20 - 6 * pulse, 110]} /></g>
    </g>
  );
};
/* B 15.5–31.6 "mehfil mein maujood...": an ordinary mehfil of men sitting under lamps; every lamp brightens and petals drift */
const S_Mehfil: React.FC<{ t: number; pulse: number; tag: string; at: number }> = ({ t, pulse, tag, at }) => {
  const on = k(t, at - 0.5, at + 1.2);
  return (
    <g>
      <rect width={W} height={H} fill="#140c18" />
      <rect y={1300} width={W} height={620} fill="#3a2418" />
      <rect x={60} y={1330} width={960} height={60} rx={10} fill="#7a1f2a" opacity={0.7} />
      {[160, 400, 680, 920].map((x, i) => <Lamp key={i} x={x} y={560 + (i % 2) * 70} on={on * (0.9 + 0.1 * pulse)} t={t} i={i} />)}
      {[{ x: 210, l: M1 }, { x: 540, l: SEEK }, { x: 870, l: M2 }].map((p, i) => (
        <g key={i} transform={`translate(${p.x} 1700) scale(0.72)`}><Seeker uid={`yq2${tag}${i}`} t={t} look={p.l} blink={blinkAt(t, 2 + i)} closed={0.6 * on} smile={0.2 + 0.7 * on} nod={3 * Math.sin(t * 1.6 + i)}
          lArm={[-6, 8]} rArm={i === 1 && on > 0.3 ? [10, 140] : [-6 - 8 * pulse, 8]} tear={i === 1 ? on : 0} /></g>))}
      <Petals t={t} a={at} n={30} seed={tag === "a" ? 4 : 5} />
    </g>
  );
};
/* C: close on the seeker, swaying on the beat, eyes closed, hand on heart; the lamp behind is off to the side (no halo) */
const S_Close: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => (
  <g>
    <rect width={W} height={H} fill="#1a1020" />
    <Lamp x={880} y={620} on={0.9} t={t} i={7} />
    <g transform={`translate(${470 + 10 * Math.sin(t * 1.4)} 2250) scale(1.5)`}><Seeker uid="yq3" t={t} look={SEEK} blink={blinkAt(t, 5)} closed={0.85} smile={0.6} tilt={4 * Math.sin(t * 1.4)} lArm={[-6, 8]} rArm={[10, 140]} tear={0.8} /></g>
    <Petals t={t} a={32} n={24} seed={6} />
  </g>
);
/* D/E "Naam-e-Muhammad kitna meetha": gold calligraphy of the blessed name glows on a wall panel; the seeker smiles; sweetness = honey-gold sparks */
const S_Name: React.FC<{ t: number; pulse: number; at: number; dawn?: boolean }> = ({ t, pulse, at, dawn }) => {
  const nm = k(t, at - 0.4, at + 1.0), d = dawn ? k(t, at, at + 4) : 0, out = dawn ? 1 - k(t, 54.4, 55.2) : 1;
  return (
    <g>
      {dawn ? <Garden t={t} bloom={1} dawn={d} pulse={pulse} /> : <rect width={W} height={H} fill="#140c18" />}
      <g transform="translate(540 700)" opacity={out}>
        <rect x={-380} y={-200} width={760} height={360} rx={40} fill="#1d1420" stroke="#c9a14a" strokeWidth={8} opacity={0.95} />
        <text y={60} textAnchor="middle" fontFamily="Amiri" fontSize={190} fill="#f2c46b" opacity={nm} style={{ filter: `drop-shadow(0 0 ${10 + 16 * pulse}px #ffcf6a)` }}>مُحَمَّد ﷺ</text>
      </g>
      {Array.from({ length: 16 }, (_, i) => { const r = rn(i + 900), dd = ((t - at) * 0.5 + r()) % 1; return nm > 0.5 && <circle key={i} cx={200 + r() * 680} cy={980 - dd * 500} r={4 + r() * 5} fill="#ffcf6a" opacity={(1 - dd) * 0.8} />; })}
      <g transform="translate(540 1740) scale(0.9)" opacity={out}><Seeker uid={`yq4${dawn ? "d" : ""}`} t={t} look={SEEK} blink={blinkAt(t, 6)} gazeY={-0.6} smile={0.4 + 0.6 * nm} wide={0.2 * nm} lArm={[-6, 8]} rArm={[10, 140]} /></g>
    </g>
  );
};

type Shot = { a: number; b: number; r: (t: number, pulse: number) => React.ReactNode };
const SHOTS: Shot[] = [
  { a: 0, b: 15.5, r: (t, p) => <S_Garden t={t} pulse={p} /> },
  { a: 15.5, b: 31.6, r: (t, p) => <S_Mehfil t={t} pulse={p} tag="a" at={20.9} /> },
  { a: 31.6, b: 42.0, r: (t, p) => <S_Close t={t} pulse={p} /> },
  { a: 42.0, b: 51.6, r: (t, p) => <S_Name t={t} pulse={p} at={44.1} /> },
  { a: 51.6, b: YAAD_DUR + 1, r: (t, p) => <S_Name t={t} pulse={p} at={52.0} dawn /> },
];
const XF = 0.3;

export const Qawwali1123: React.FC<{ withAudio?: boolean }> = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t, BEATS);
  const fade = Math.max(interp(t, [0, 0.6], [1, 0]), interp(t, [YAAD_DUR - 1.2, YAAD_DUR], [0, 1]));
  const dip = Math.max(0, ...SHOTS.slice(1).map((s) => 1 - Math.abs(t - s.a) / XF));
  return (
    <AbsoluteFill style={{ background: "#07040c" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => (t < s.a || t >= s.b ? null : <g key={i} transform={`translate(540 960) scale(${1 + 0.006 * pulse}) translate(-540 -960)`}>{s.r(t, pulse)}</g>))}
        <defs><radialGradient id="vig23" cx="50%" cy="46%" r="75%"><stop offset="60%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.5} /></radialGradient></defs>
        <rect width={W} height={H} fill="url(#vig23)" />
      </svg>
      <AbsoluteFill style={{ background: "#07040c", opacity: dip * 0.85 }} />
      <Words t={t} pulse={pulse} groups={GROUPS} />
      <EndCard t={t} start={55.0} credit={CREDIT} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "0.12em", color: "rgba(255,245,232,0.8)", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>NUSRAT FATEH ALI KHAN · YAAD-E-NABI KA GULSHAN MEHKA</div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
