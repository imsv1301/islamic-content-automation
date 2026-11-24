import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import beats from "../qawwali/allahhoo-beats.json";
import { Words, EndCard, pulseAt, G, Credit } from "../qawwali/QawwaliStory";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Stars, Glow, PETAL, k } from "../qawwali/anim/QawwaliAnim";
import { rn } from "./AnimKit";

/* Mehfil-e-Sama qawwali · 24 Nov 2026 · "Allah Hoo" (Ustad Nusrat Fateh Ali Khan; wjynrRhztU8, clip 164.5–213.9 s:
   "Allah hoo" chant, "Yeh zameen jab na thi, yeh jahan jab na tha", "Chand suraj na thay, aasman jab na tha" x2,
   "Raaz-e-haq bhi kisi par ayan jab na tha", "Tab na tha kuch yahan, tha magar Tu hi Tu", then one "Allah hoo" line).
   Modern qawwali -> NO lyric lines on screen, only the title words + credits; the animation acts out the meaning.
   Allah is NEVER drawn or shown as a figure, face or light-being: only the written Name in calligraphy. Creation fades
   away inside the seeker's vision (a framed window of the night), then returns at dawn with everything in dhikr.
   No halo behind any head; no spinning text. Silent render. */
export const ALLAHHOO_DUR = 49.4;
const BEATS = (beats as { beats: number[] }).beats;
const W = 1080, H = 1920;
const SEEK: Look = { beard: true, cap: "#f4efe6", top: "#e9dcc3", topD: "#c8b89a", shawl: true, hair: "#1f1510", beardC: "#2a1d14" };
const GROUPS: G[] = [
  { a: 0.0, b: 6.2, words: [{ w: "ALLAH", t: 0.1, big: true, gold: true }, { w: "HOO", t: 1.92, big: true, hold: 4.6 }] },
  { a: 41.0, b: 45.3, words: [{ w: "ALLAH", t: 41.1, big: true, gold: true }, { w: "HOO", t: 42.06, big: true }, { w: "ALLAH HOO", t: 43.22, big: true, gold: true, hold: 45.2 }] },
];
const CREDIT: Credit = { title: ["Allah Hoo", "Allah Hoo"], kalam: "QAWWALI", artist: "USTAD NUSRAT FATEH ALI KHAN", rights: "AUDIO © ORIGINAL PUBLISHER · SHARED WITH CREDIT" };

const Hill: React.FC<{ t: number; dawn?: number }> = ({ t, dawn = 0 }) => (
  <g>
    <defs><linearGradient id="hq24" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={dawn > 0.5 ? "#f0a86a" : "#0a0820"} /><stop offset="65%" stopColor={dawn > 0.5 ? "#ffe0b0" : "#25204a"} /><stop offset="100%" stopColor="#1a2a1c" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#hq24)" />
    <Stars t={t} o={1 - dawn} />
    <path d="M 0 1420 Q 260 1300 540 1360 T 1080 1330 L 1080 1920 L 0 1920 Z" fill={dawn > 0.5 ? "#3f6b3a" : "#17241a"} />
    {/* a lone tree on the hill, branches sway */}
    <g transform="translate(860 1360)"><path d="M -14 0 L -8 -300 L 8 -300 L 14 0 Z" fill="#3a2614" />
      {[[-90, -330, 110], [40, -380, 130], [110, -300, 100], [-20, -280, 90]].map(([x, y, r], i) => <circle key={i} cx={x + 6 * Math.sin(t * 1.3 + i)} cy={y} r={r} fill={dawn > 0.5 ? (i % 2 ? "#4f8a4c" : "#5fa35a") : (i % 2 ? "#1f3324" : "#25402b")} />)}</g>
  </g>
);
/* the vision window: a tall arched frame in the night sky where creation is shown, then fades */
const Arch: React.FC<{ children: React.ReactNode; o?: number }> = ({ children, o = 1 }) => (
  <g opacity={o}>
    <defs><clipPath id="arch24"><path d="M 200 1250 L 200 560 Q 540 240 880 560 L 880 1250 Z" /></clipPath></defs>
    <g clipPath="url(#arch24)">{children}</g>
    <path d="M 200 1250 L 200 560 Q 540 240 880 560 L 880 1250 Z" fill="none" stroke="#c9a14a" strokeWidth={10} />
  </g>
);
const SeekerSit: React.FC<{ t: number; pulse: number; uid: string; closed?: number; heart?: boolean; x?: number; s?: number; wide?: number; gazeY?: number }> = ({ t, pulse, uid, closed = 0.9, heart, x = 540, s = 0.62, wide = 0, gazeY = -0.4 }) => (
  <g transform={`translate(${x} 1880) scale(${s})`}><Seeker uid={uid} t={t} look={SEEK} blink={blinkAt(t, 3)} closed={closed} wide={wide} gazeY={gazeY} smile={0.4} nod={3 * Math.sin(t * 1.7) + 2 * pulse} lArm={[-20, 110]} rArm={heart ? [10, 140] : [-20 - 6 * pulse, 110]} /></g>
);

/* A 0–6.4 "Allah hoo": night hill, the seeker in dhikr with a tasbeeh, eyes closed, swaying on the beat */
const S_Dhikr: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => (
  <g>
    <Hill t={t} />
    <SeekerSit t={t} pulse={pulse} uid="ah1" s={0.62} />
    {/* tasbeeh beads slipping one per beat */}
    <g transform="translate(555 1600)">{Array.from({ length: 11 }, (_, i) => { const a = (i / 11) * Math.PI * 2 + Math.floor(t * 1.7) * 0.57; return <circle key={i} cx={Math.cos(a) * 46} cy={Math.sin(a) * 26 + 40} r={9} fill="#e9c46a" />; })}</g>
  </g>
);
/* B 6.4–15.0 "yeh zameen jab na thi, yeh jahan jab na tha": inside the arch a little world (hills, houses, river) dissolves into dust */
const World: React.FC<{ t: number; gone: number }> = ({ t, gone }) => (
  <g>
    <rect x={200} y={300} width={680} height={960} fill="#7fb3e0" opacity={1 - gone} />
    <path d="M 200 1000 Q 400 900 540 960 T 880 930 L 880 1260 L 200 1260 Z" fill="#5fa35a" opacity={1 - gone} />
    <path d="M 200 1120 Q 540 1080 880 1140 L 880 1180 Q 540 1120 200 1160 Z" fill="#4cc9f0" opacity={(1 - gone) * (0.8 + 0.2 * Math.sin(t * 3))} />
    {[[300, 980], [420, 960], [640, 970]].map(([x, y], i) => <g key={i} opacity={1 - gone}><rect x={x} y={y - 60} width={70} height={60} fill="#f4e1c1" /><path d={`M ${x - 8} ${y - 60} L ${x + 35} ${y - 100} L ${x + 78} ${y - 60} Z`} fill="#b5532f" /></g>)}
    {Array.from({ length: 60 }, (_, i) => { const r = rn(i + 40); const x = 220 + r() * 640, y = 900 + r() * 340; return gone > 0 && gone < 1 && <circle key={i} cx={x + (r() - 0.5) * 200 * gone} cy={y - 300 * gone * r()} r={3 + r() * 4} fill="#e9dcc3" opacity={(1 - gone) * 0.9} />; })}
  </g>
);
const S_World: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const gone = k(t, 9.6, 12.9);
  return (
    <g>
      <Hill t={t} />
      <Arch><rect x={200} y={300} width={680} height={960} fill="#05040d" /><Stars t={t} o={0.5 * gone} /><World t={t} gone={gone} /></Arch>
      <SeekerSit t={t} pulse={pulse} uid="ah2" closed={0.1} wide={0.3 * gone} gazeY={-0.7} s={0.55} x={540} />
    </g>
  );
};
/* C 15.0–24.7 "chand suraj na thay, aasman jab na tha" (x2): moon and sun rise into a blue sky in the arch, then fade, and the sky goes dark */
const S_SunMoon: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const m1 = k(t, 15.0, 15.8) * (1 - k(t, 19.3, 20.2)), s1 = k(t, 16.1, 16.9) * (1 - k(t, 19.3, 20.2));
  const m2 = k(t, 20.2, 20.9) * (1 - k(t, 24.0, 24.6)), s2 = k(t, 20.8, 21.5) * (1 - k(t, 24.0, 24.6));
  const sky = Math.max(k(t, 15.0, 16) * (1 - k(t, 18.8, 19.6)), k(t, 20.2, 21) * (1 - k(t, 23.6, 24.3)));
  return (
    <g>
      <Hill t={t} />
      <Arch>
        <rect x={200} y={300} width={680} height={960} fill="#05040d" />
        <rect x={200} y={300} width={680} height={960} fill="#6fa8dc" opacity={0.85 * sky} />
        <g opacity={Math.max(m1, m2)} transform={`translate(380 ${760 - 40 * Math.max(m1, m2)})`}><circle r={80} fill="#f3f0dc" /><circle cx={34} cy={-14} r={74} fill={sky > 0.3 ? "#6fa8dc" : "#05040d"} /></g>
        <g opacity={Math.max(s1, s2)} transform={`translate(700 ${820 - 60 * Math.max(s1, s2)})`}><Glow id="sun24" cx={0} cy={0} r={200} c="#ffcf6a" o={0.6} /><circle r={78} fill="#ffd166" /></g>
      </Arch>
      <SeekerSit t={t} pulse={pulse} uid="ah3" closed={0.1} gazeY={-0.8} s={0.55} />
    </g>
  );
};
/* D 24.7–34.4 "raaz-e-haq bhi kisi par ayan jab na tha": a great door in the arch, sealed shut; the seeker, hand on heart, in awe */
const S_Secret: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const seal = k(t, 25.4, 26.4);
  return (
    <g>
      <Hill t={t} />
      <Arch>
        <rect x={200} y={300} width={680} height={960} fill="#05040d" />
        <rect x={300} y={560} width={480} height={700} rx={20} fill="#3a2414" stroke="#6b4630" strokeWidth={14} />
        <line x1={540} y1={560} x2={540} y2={1260} stroke="#2a1a10" strokeWidth={10} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={320} y={620 + i * 160} width={440} height={14} fill="#6b4630" />)}
        <g transform={`translate(540 900) scale(${seal})`}><circle r={70} fill="#8a1f1f" /><circle r={52} fill="none" stroke="#c9a14a" strokeWidth={6} /><rect x={-14} y={-26} width={28} height={36} rx={6} fill="#c9a14a" /><path d="M -12 -26 Q 0 -50 12 -26" stroke="#c9a14a" strokeWidth={6} fill="none" /></g>
      </Arch>
      <SeekerSit t={t} pulse={pulse} uid="ah4" closed={0} wide={0.5} gazeY={-0.6} heart s={0.6} />
    </g>
  );
};
/* E 34.4–41.1 "tab na tha kuch yahan, tha magar Tu hi Tu": everything dark; only the written Name appears in gold (no figure) */
const S_Name: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const nm = k(t, 39.2, 40.6);
  return (
    <g>
      <rect width={W} height={H} fill="#030208" />
      {Array.from({ length: 40 }, (_, i) => { const r = rn(i + 640); return <circle key={i} cx={(r() * W + t * (8 + r() * 14)) % W} cy={(r() * H - t * (4 + r() * 6) + H * 4) % H} r={1.5 + r() * 2.5} fill="#cbb98f" opacity={0.12 + 0.1 * Math.sin(t * 1.3 + i)} />; })}
      <text x={540} y={1000} textAnchor="middle" fontFamily="Amiri" fontSize={300} fill="#f2c46b" opacity={nm} style={{ filter: `drop-shadow(0 0 ${12 + 14 * pulse}px #ffcf6a)` }}>اللّٰہ</text>
      {Array.from({ length: 18 }, (_, i) => { const r = rn(i + 600), d = ((t - 39.4) * 0.35 + r()) % 1; return nm > 0.3 && <circle key={i} cx={240 + r() * 600} cy={1250 - d * 600} r={3 + r() * 4} fill="#ffcf6a" opacity={(1 - d) * 0.7 * nm} />; })}
    </g>
  );
};
/* F 41.1–49.4 "Allah hoo": dawn; the world is back and everything is in dhikr: the tree sways, birds circle, petals fall, the seeker sways */
const S_Dawn: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const d = k(t, 41.0, 43.5);
  return (
    <g>
      <Hill t={t} dawn={d} />
      {Array.from({ length: 7 }, (_, i) => { const a = t * 0.6 + (i / 7) * Math.PI * 2; const x = 540 + Math.cos(a) * 320, y = 560 + Math.sin(a) * 120, f = Math.sin(t * 9 + i) * 12; return <path key={i} transform={`translate(${x} ${y}) scale(${0.9 + 0.2 * (i % 3)})`} d={`M -26 ${f} Q -13 -8 0 0 Q 13 -8 26 ${f}`} stroke="#3a2a2a" strokeWidth={5} fill="none" strokeLinecap="round" opacity={d} />; })}
      {Array.from({ length: 28 }, (_, i) => { const r = rn(i + 700), x = r() * W, sp = 110 + r() * 160, dd = t - 41.5 - r() * 2; if (dd < 0) return null; const y = -60 + dd * sp; return y < H && <path key={i} d={PETAL} transform={`translate(${x + Math.sin(t * 2 + i) * 30} ${y}) rotate(${i * 40 + dd * 30}) scale(${0.7 + r()})`} fill={i % 3 ? "#c8143c" : "#ff6f8e"} opacity={0.85} />; })}
      <SeekerSit t={t} pulse={pulse} uid="ah5" closed={0.85} s={0.6} />
    </g>
  );
};

type Shot = { a: number; b: number; r: (t: number, pulse: number) => React.ReactNode };
const SHOTS: Shot[] = [
  { a: 0, b: 6.4, r: (t, p) => <S_Dhikr t={t} pulse={p} /> },
  { a: 6.4, b: 15.0, r: (t, p) => <S_World t={t} pulse={p} /> },
  { a: 15.0, b: 24.7, r: (t, p) => <S_SunMoon t={t} pulse={p} /> },
  { a: 24.7, b: 34.4, r: (t, p) => <S_Secret t={t} pulse={p} /> },
  { a: 34.4, b: 41.0, r: (t, p) => <S_Name t={t} pulse={p} /> },
  { a: 41.0, b: ALLAHHOO_DUR + 1, r: (t, p) => <S_Dawn t={t} pulse={p} /> },
];
const XF = 0.3;

export const Qawwali1124: React.FC<{ withAudio?: boolean }> = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t, BEATS);
  const fade = Math.max(interp(t, [0, 0.6], [1, 0]), interp(t, [ALLAHHOO_DUR - 1.0, ALLAHHOO_DUR], [0, 1]));
  const dip = Math.max(0, ...SHOTS.slice(1).map((s) => 1 - Math.abs(t - s.a) / XF));
  return (
    <AbsoluteFill style={{ background: "#07040c" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => (t < s.a || t >= s.b ? null : <g key={i} transform={`translate(540 960) scale(${1 + 0.006 * pulse + 0.02 * ((t - s.a) / (s.b - s.a))}) translate(-540 -960)`}>{s.r(t, pulse)}</g>))}
        <defs><radialGradient id="vig24" cx="50%" cy="46%" r="75%"><stop offset="60%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.5} /></radialGradient></defs>
        <rect width={W} height={H} fill="url(#vig24)" />
      </svg>
      <AbsoluteFill style={{ background: "#07040c", opacity: dip * 0.85 }} />
      <Words t={t} pulse={pulse} groups={GROUPS} />
      <EndCard t={t} start={45.4} credit={CREDIT} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "0.12em", color: "rgba(255,245,232,0.8)", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>NUSRAT FATEH ALI KHAN · ALLAH HOO</div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
