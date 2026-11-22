import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import beats from "../qawwali/ghaus-beats.json";
import { Words, EndCard, pulseAt, G, Credit } from "../qawwali/QawwaliStory";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Stars, Glow, flick, PETAL, k, ease } from "../qawwali/anim/QawwaliAnim";
import { rn } from "./AnimKit";

/* Mehfil-e-Sama qawwali · 22 Nov 2026 (11 Jumada al-Akhirah, Gyarwi Sharif) · "Ya Ghaus Ya Meeran" (Nusrat Fateh Ali Khan;
   P5O7d6z5LJw, clip 22.6–106.8 s: the refrain twice + "Ghaus-e-Samdani, Qutb-e-Rabbani" + one full verse ending before the next refrain).
   Modern qawwali -> NO lyrics on screen beyond the title words; title + credits only; the animation acts out the meaning.
   Huzoor Ghaus-e-Azam (Rahmatullahi Alaih) and all Awliya are NEVER drawn: he is only a far golden light across the river;
   "every wali bows his neck" = a row of lantern flames bowing toward that light; the blessed lineage = a garland of lights.
   An ordinary young seeker with a face. No halo behind any head; no spinning text. Silent render. */
export const GHAUS_DUR = 84.2;
const BEATS = (beats as { beats: number[] }).beats;
const W = 1080, H = 1920;
const SEEK: Look = { beard: true, cap: "#2e7d5b", top: "#e9dcc3", topD: "#c8b89a", shawl: true, hair: "#1f1510", beardC: "#2a1d14" };
const GROUPS: G[] = [
  { a: 0.0, b: 4.6, words: [{ w: "YA GHAUS", t: 0.0, big: true, gold: true }, { w: "YA MEERAN", t: 1.26, big: true }] },
  { a: 4.7, b: 9.4, words: [{ w: "YA GHAUS", t: 4.7, big: true, gold: true }, { w: "YA MEERAN", t: 5.88, big: true, hold: 9.2 }] },
];
const CREDIT: Credit = { title: ["Ya Ghaus", "Ya Meeran"], kalam: "QAWWALI · GYARWI SHARIF", artist: "NUSRAT FATEH ALI KHAN", rights: "AUDIO © ORIGINAL PUBLISHER · SHARED WITH CREDIT" };

/* night river: far bank with the golden light (never a figure), water with reflections */
const River: React.FC<{ t: number; light?: number; dawn?: number; pulse?: number }> = ({ t, light = 0.6, dawn = 0, pulse = 0 }) => (
  <g>
    <defs><linearGradient id="rv22" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={dawn > 0.5 ? "#e88a4a" : "#0c0a22"} /><stop offset="55%" stopColor={dawn > 0.5 ? "#ffd59a" : "#27204a"} /><stop offset="100%" stopColor="#1a1430" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#rv22)" />
    <Stars t={t} o={1 - dawn} />
    {/* far bank: low flat-roof city with palms, all silhouettes */}
    <path d="M 0 900 L 60 900 L 60 860 L 160 860 L 160 890 L 260 890 L 260 840 L 340 840 L 340 900 L 740 900 L 740 850 L 840 850 L 840 880 L 960 880 L 960 840 L 1080 840 L 1080 960 L 0 960 Z" fill={dawn > 0.5 ? "#7a4a3a" : "#120e24"} />
    {[120, 300, 820, 1000].map((x, i) => <g key={i} transform={`translate(${x} 900)`}><rect x={-5} y={-120} width={10} height={120} fill={dawn > 0.5 ? "#6a3f30" : "#120e24"} />{[-60, -20, 20, 60].map((r, j) => <ellipse key={j} cx={Math.sin(r / 40) * 40} cy={-124} rx={44} ry={10} transform={`rotate(${r} 0 -124)`} fill={dawn > 0.5 ? "#6a3f30" : "#120e24"} />)}</g>)}
    {/* the golden light on the far bank */}
    <ellipse cx={540} cy={890} rx={60 + 30 * light} ry={26 + 10 * light} fill="#fff1c8" opacity={0.5 + 0.5 * light} />
    <Glow id="gl22" cx={540} cy={880} r={260 + 380 * light} c="#ffd27a" o={(0.35 + 0.4 * light) * (0.92 + 0.08 * pulse)} />
    {/* water */}
    <rect y={960} width={W} height={460} fill="#141032" />
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={540 - (30 + i * 10) + Math.sin(t * 2 + i) * 14} y={980 + i * 30} width={2 * (30 + i * 10)} height={6} rx={3} fill="#ffd27a" opacity={(0.5 - i * 0.03) * light} />)}
    {/* near bank */}
    <path d="M 0 1420 Q 540 1380 1080 1420 L 1080 1920 L 0 1920 Z" fill="#2a2018" />
  </g>
);
const Lamp: React.FC<{ x: number; y: number; on: number; bow?: number; t: number; i: number; s?: number }> = ({ x, y, on, bow = 0, t, i, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-6} y={0} width={12} height={160} fill="#3a2c22" />
    <rect x={-26} y={-60} width={52} height={64} rx={8} fill="#5a4030" />
    <path d={`M 0 -10 Q ${-12 + 18 * bow} -34 ${30 * bow} ${-58 + 14 * bow} Q ${12 + 18 * bow} -34 0 -10 Z`} fill="#ffcf6a" opacity={on * flick(t, i)} />
    <Glow id={`lm22${i}${Math.round(x)}`} cx={10 * bow} cy={-30} r={150} c="#ffb547" o={0.45 * on * flick(t, i)} />
  </g>
);
const Petals: React.FC<{ t: number; a: number; n?: number; seed?: number }> = ({ t, a, n = 40, seed = 7 }) => (
  <g>{Array.from({ length: n }, (_, i) => { const r = rn(i + seed * 100), x = r() * W, sp = 120 + r() * 180, d = t - a - r() * 2; if (d < 0) return null; const y = -60 + d * sp; if (y > H) return null; return <path key={i} d={PETAL} transform={`translate(${x + Math.sin(t * 2 + i) * 30} ${y}) rotate(${i * 40 + (t - a) * 30}) scale(${0.7 + r()})`} fill={i % 3 ? "#c8143c" : "#ff6f8e"} opacity={0.9} />; })}</g>
);

/* A 0–9.3 "Ya Ghaus Ya Meeran" x2: the seeker on the near bank lifts his hands toward the far golden light, which answers brighter */
const S_Call: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const up = k(t, 0.3, 1.4), call2 = k(t, 4.7, 5.4);
  return (
    <g>
      <River t={t} light={0.4 + 0.3 * call2 + 0.1 * pulse} pulse={pulse} />
      <g transform="translate(380 1900) scale(0.75)">
        <Seeker uid="gh1" t={t} look={SEEK} back lArm={[-110 * up - 4, -10 * up + 8]} rArm={[-110 * up - 4, -10 * up + 8]} wind={0.4} />
      </g>
    </g>
  );
};
/* B 9.3–22: he walks the riverside path; lamps light one by one on the beat */
const LAMPS_B = [0, 1, 2, 3, 4, 5].map((i) => ({ x: i % 2 ? 900 - i * 40 : 180 + i * 40, y: 1500 - i * 60, s: 1 - i * 0.1 }));
const S_Path: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const go = ease((t - 9.3) / 12);
  return (
    <g>
      <River t={t} light={0.6 + 0.1 * pulse} pulse={pulse} />
      {LAMPS_B.map((l, i) => <Lamp key={i} t={t} i={i} x={l.x} y={l.y} s={l.s} on={k(t, 10.2 + i * 1.6, 10.8 + i * 1.6)} />)}
      <g transform={`translate(540 ${1900 - 300 * go}) scale(${0.95 - 0.35 * go})`}>
        <Seeker uid="gh2" t={t} look={SEEK} back walk={t * 6} lArm={[-4, 8]} rArm={[-4, 8]} wind={0.4} />
      </g>
    </g>
  );
};
/* C 22–36 "Ghaus-e-Samdani, Qutb-e-Rabbani": he sits and looks up; the stars wheel round one fixed point (the qutb, the pole) */
const S_Qutb: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const rot = (t - 22) * 4;
  return (
    <g>
      <rect width={W} height={H} fill="#0a0820" />
      <g transform={`translate(540 520) rotate(${rot})`}>
        {Array.from({ length: 90 }, (_, i) => { const r = rn(i + 900), rad = 60 + r() * 900, a = r() * 360; return <g key={i} transform={`rotate(${a})`}><path d={`M ${rad} 0 A ${rad} ${rad} 0 0 1 ${rad * Math.cos(0.12)} ${rad * Math.sin(0.12)}`} stroke="#cfd8ff" strokeWidth={2 + r() * 2} fill="none" opacity={0.35 + 0.4 * r()} /><circle cx={rad} cy={0} r={2 + r() * 3} fill="#fff" /></g>; })}
      </g>
      <circle cx={540} cy={520} r={16 + 4 * pulse} fill="#fff6d6" />
      <Glow id="qt22" cx={540} cy={520} r={260} c="#ffe7a8" o={0.5} />
      <path d="M 0 1500 Q 540 1440 1080 1500 L 1080 1920 L 0 1920 Z" fill="#1d1630" />
      <rect x={60} y={1560} width={480} height={70} rx={10} fill="#2e6b4f" />
      <g transform="translate(300 1640) scale(0.95)">
        <Seeker uid="gh3" t={t} look={SEEK} blink={blinkAt(t, 3)} gazeY={-0.9} gazeX={0.5} smile={0.4} wide={0.3} lArm={[20, 100]} rArm={[20, 100]} wind={0.2} />
      </g>
    </g>
  );
};
/* D 36–48.8: hand on heart, he bows with adab toward the light across the water */
const S_Adab: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const bow = k(t, 38, 40) * (1 - k(t, 45, 47));
  return (
    <g>
      <River t={t} light={0.8 + 0.1 * pulse} pulse={pulse} />
      <g transform="translate(330 1880) scale(0.95)">
        <Seeker uid="gh4" t={t} look={SEEK} blink={blinkAt(t, 4)} closed={0.5 + 0.3 * bow} smile={0.4} nod={22 * bow} gazeX={0.6} gazeY={0.3} rArm={[30, 120]} lArm={[-6, 8]} wind={0.3} />
      </g>
    </g>
  );
};
/* E 48.8–61.6 "every wali bows his neck": a long row of lantern flames bows toward the far light, one after another on the beat */
const S_Bow: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => (
  <g>
    <River t={t} light={0.9 + 0.1 * pulse} pulse={pulse} />
    {Array.from({ length: 9 }, (_, i) => { const x = 80 + i * 115, side = x < 540 ? 1 : -1, bow = side * k(t, 49.5 + Math.abs(x - 540) / 115 * 0.7, 50.5 + Math.abs(x - 540) / 115 * 0.7); return <Lamp key={i} t={t} i={i} x={x} y={1560 + Math.abs(x - 540) * 0.2} s={0.9} on={1} bow={bow} />; })}
    <Petals t={t} a={55} n={20} seed={4} />
  </g>
);
/* F 61.6–74.3 the blessed lineage: a garland of lights links outward from the far light, two bright ones first */
const S_Silsila: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const N = 12;
  return (
    <g>
      <River t={t} light={1} pulse={pulse} />
      {Array.from({ length: N }, (_, i) => { const p = k(t, 62 + i * 0.7, 62.6 + i * 0.7); if (p <= 0) return null; const a = -Math.PI / 2 + (i % 2 ? 1 : -1) * (0.3 + Math.floor(i / 2) * 0.22); const r = 200 + Math.floor(i / 2) * 120; const x = 540 + Math.cos(a) * r * 1.3, y = 880 - Math.sin(-a) * r * 0.25 + Math.floor(i / 2) * 110;
        return <g key={i}><line x1={540} y1={880} x2={x} y2={y} stroke="#ffd27a" strokeWidth={3} opacity={0.35 * p} /><circle cx={x} cy={y} r={(i < 2 ? 22 : 13) * p} fill="#fff1c8" /><Glow id={`sl22${i}`} cx={x} cy={y} r={i < 2 ? 160 : 90} c="#ffd27a" o={0.5 * p} /></g>; })}
      <g transform="translate(330 1900) scale(0.8)">
        <Seeker uid="gh5" t={t} look={SEEK} back lArm={[-4, 8]} rArm={[-4, 8]} wind={0.3} />
      </g>
    </g>
  );
};
/* G 74.3–84.2 dawn over the city; he raises his hands in thanks; petals; end card */
const S_Dawn: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const dawn = k(t, 74.3, 77), up = k(t, 75, 76.5);
  return (
    <g>
      <River t={t} light={1} dawn={dawn} pulse={pulse} />
      <Petals t={t} a={75} n={45} seed={11} />
      <g transform="translate(540 1900) scale(0.85)">
        <Seeker uid="gh6" t={t} look={SEEK} blink={blinkAt(t, 6)} smile={1} closed={0.4} gazeY={-0.6} lArm={[-60 * up - 4, 60 * up + 8]} rArm={[-60 * up - 4, 60 * up + 8]} wind={0.3} />
      </g>
    </g>
  );
};

type Shot = { a: number; b: number; r: (t: number, pulse: number) => React.ReactNode };
const SHOTS: Shot[] = [
  { a: 0, b: 9.3, r: (t, p) => <S_Call t={t} pulse={p} /> },
  { a: 9.3, b: 22.0, r: (t, p) => <S_Path t={t} pulse={p} /> },
  { a: 22.0, b: 36.0, r: (t, p) => <S_Qutb t={t} pulse={p} /> },
  { a: 36.0, b: 48.8, r: (t, p) => <S_Adab t={t} pulse={p} /> },
  { a: 48.8, b: 61.6, r: (t, p) => <S_Bow t={t} pulse={p} /> },
  { a: 61.6, b: 74.3, r: (t, p) => <S_Silsila t={t} pulse={p} /> },
  { a: 74.3, b: GHAUS_DUR + 1, r: (t, p) => <S_Dawn t={t} pulse={p} /> },
];
const XF = 0.3;

export const Qawwali1122: React.FC<{ withAudio?: boolean }> = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t, BEATS);
  const fade = Math.max(interp(t, [0, 0.6], [1, 0]), interp(t, [GHAUS_DUR - 1.2, GHAUS_DUR], [0, 1]));
  const dip = Math.max(0, ...SHOTS.slice(1).map((s) => 1 - Math.abs(t - s.a) / XF));
  return (
    <AbsoluteFill style={{ background: "#07040c" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => {
          if (t < s.a || t >= s.b) return null;
          return <g key={i} transform={`translate(540 960) scale(${1 + 0.006 * pulse}) translate(-540 -960)`}>{s.r(t, pulse)}</g>;
        })}
        <defs><radialGradient id="vig22" cx="50%" cy="46%" r="75%"><stop offset="60%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.5} /></radialGradient></defs>
        <rect width={W} height={H} fill="url(#vig22)" />
      </svg>
      <AbsoluteFill style={{ background: "#07040c", opacity: dip * 0.85 }} />
      <Words t={t} pulse={pulse} groups={GROUPS} />
      <EndCard t={t} start={79.0} credit={CREDIT} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "0.12em", color: "rgba(255,245,232,0.8)", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>NUSRAT FATEH ALI KHAN · YA GHAUS YA MEERAN</div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
