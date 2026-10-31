import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";

/* ---------------------------------------------------------------------------
   Naat template — lyric lines with per-word timings (verse-complete clip).
   Kalam: Ala Hazrat Imam Ahmad Raza Khan (Rahmatullahi Alaih), Hadaiq-e-Bakhshish.
   Recitation: Owais Raza Qadri.  Clip = the complete matla (0 – 61 s).
--------------------------------------------------------------------------- */
type Wd = [string, string, number, number]; // urdu, roman, start, end
const M1R = ["Sab", "se", "Aula", "o", "Aala", "Hamara", "Nabi"];
const M1U = ["سب", "سے", "اولیٰ", "و", "اعلیٰ", "ہمارا", "نبی"];
const M2R = ["Sab", "se", "Bala", "o", "Wala", "Hamara", "Nabi"];
const M2U = ["سب", "سے", "بالا", "و", "والا", "ہمارا", "نبی"];
const mk = (u: string[], r: string[], t: [number, number][]): Wd[] => u.map((w, i) => [w, r[i], t[i][0], t[i][1]]);
const LINES: { start: number; end: number; words: Wd[] }[] = [
  { start: 0.0, end: 9.12, words: mk(M1U, M1R, [[0, 0.56], [0.56, 1.16], [1.16, 3.68], [3.68, 3.7], [3.68, 5.42], [5.42, 7.66], [7.66, 9.12]]) },
  { start: 9.12, end: 27.9, words: mk(M1U, M1R, [[9.12, 9.66], [9.66, 10.16], [10.16, 12.62], [12.62, 12.64], [12.62, 24.92], [24.92, 26.8], [26.8, 27.16]]) },
  { start: 28.5, end: 35.66, words: mk(M1U, M1R, [[28.64, 30.04], [30.04, 30.34], [30.34, 31.92], [31.92, 32.0], [32.0, 33.6], [33.6, 34.5], [34.5, 35.66]]) },
  { start: 35.66, end: 44.04, words: mk(M2U, M2R, [[35.66, 36.48], [36.48, 36.86], [36.86, 38.3], [38.3, 38.66], [38.66, 40.48], [40.48, 42.66], [42.66, 44.04]]) },
  { start: 44.04, end: 52.82, words: mk(M2U, M2R, [[44.04, 44.68], [44.68, 45.2], [45.2, 47.02], [47.02, 47.36], [47.36, 49.06], [49.06, 51.32], [51.32, 52.82]]) },
  { start: 52.82, end: 62.2, words: mk(M1U, M1R, [[52.82, 53.36], [53.36, 53.94], [53.94, 56.3], [56.3, 56.32], [56.3, 57.92], [57.92, 59.9], [59.9, 61.04]]) },
];
export const NAAT_DUR = 62.6;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INO = Easing.bezier(0.65, 0, 0.35, 1);
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };
const prng = (seed: number) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: 1920 };

/* ---------------- illustrated Madinah (stand-in until real free footage is wired) ---------------- */
const GreenDome: React.FC<{ x: number; y: number; s: number; glow?: number; night?: boolean }> = ({ x, y, s, glow = 0, night = false }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <defs>
      <linearGradient id={`gd${night ? "n" : "d"}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={night ? "#0f3b22" : "#1b5e33"} /><stop offset="45%" stopColor={night ? "#2c7a45" : "#3d9a5a"} /><stop offset="100%" stopColor={night ? "#0b2e1a" : "#164d2a"} />
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff1b0" /><stop offset="55%" stopColor="#d9a441" /><stop offset="100%" stopColor="#8f5f1c" /></linearGradient>
      <linearGradient id="drum" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={night ? "#1c5a35" : "#2c7a45"} /><stop offset="50%" stopColor={night ? "#2f8150" : "#43a463"} /><stop offset="100%" stopColor={night ? "#174a2c" : "#245f38"} /></linearGradient>
    </defs>
    {/* base */}
    <rect x={-210} y={0} width={420} height={120} fill={night ? "#cfc2a6" : "#e8dcc0"} />
    <rect x={-210} y={0} width={420} height={14} fill="#bba57d" />
    {/* drum */}
    <rect x={-150} y={-120} width={300} height={124} fill="url(#drum)" />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${-120 + i * 40} -20 L ${-120 + i * 40} -80 Q ${-108 + i * 40} -100 ${-96 + i * 40} -80 L ${-96 + i * 40} -20 Z`} fill={night ? "#ffe9a8" : "#0d2d1a"} opacity={night ? 0.75 : 0.55} />)}
    {/* ribbed dome */}
    <path d="M -160 -118 Q -170 -300 0 -420 Q 170 -300 160 -118 Z" fill={`url(#gd${night ? "n" : "d"})`} />
    {Array.from({ length: 11 }, (_, i) => {
      const k = (i - 5) / 5.5;
      return <path key={i} d={`M ${k * 160} -118 Q ${k * 165} -300 0 -420`} stroke="#0b2e1a" strokeOpacity={0.35} strokeWidth={4} fill="none" />;
    })}
    <path d="M -60 -380 Q 0 -410 40 -395" stroke="#ffffff" strokeOpacity={night ? 0.12 : 0.25} strokeWidth={18} fill="none" />
    {/* finial */}
    <rect x={-6} y={-470} width={12} height={56} fill="url(#gold)" />
    <circle cy={-480} r={16} fill="url(#gold)" /><circle cy={-510} r={12} fill="url(#gold)" />
    <path d="M -22 -548 A 26 26 0 1 0 18 -560 A 20 20 0 1 1 -22 -548 Z" fill="url(#gold)" />
    {glow > 0 ? <circle cy={-520} r={90} fill="url(#fin)" opacity={glow} /> : null}
  </g>
);
const SilverDome: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <defs><linearGradient id="sv" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8d96a3" /><stop offset="45%" stopColor="#e6ebf1" /><stop offset="100%" stopColor="#7f8894" /></linearGradient></defs>
    <rect x={-150} y={-90} width={300} height={94} fill="#d8ccb0" />
    <path d="M -150 -88 Q -160 -230 0 -310 Q 160 -230 150 -88 Z" fill="url(#sv)" />
    {Array.from({ length: 9 }, (_, i) => { const k = (i - 4) / 4.5; return <path key={i} d={`M ${k * 150} -88 Q ${k * 155} -230 0 -310`} stroke="#5f6773" strokeOpacity={0.3} strokeWidth={3} fill="none" />; })}
    <rect x={-5} y={-350} width={10} height={44} fill="url(#gold)" />
    <path d="M -18 -372 A 20 20 0 1 0 14 -382 A 16 16 0 1 1 -18 -372 Z" fill="url(#gold)" />
  </g>
);
const Minaret: React.FC<{ x: number; y: number; s: number; lit?: boolean }> = ({ x, y, s, lit = false }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <defs><linearGradient id="mn" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#c9b892" /><stop offset="50%" stopColor="#f3e9cf" /><stop offset="100%" stopColor="#b9a67f" /></linearGradient></defs>
    <rect x={-34} y={-760} width={68} height={760} fill="url(#mn)" />
    {[-200, -420, -620].map((yy, i) => (
      <g key={i}>
        <rect x={-58} y={yy - 26} width={116} height={26} fill="#e8dcc0" />
        <rect x={-50} y={yy - 70} width={100} height={46} fill={lit ? "#ffe6a3" : "#d6c49c"} opacity={lit ? 0.85 : 1} />
        {Array.from({ length: 4 }, (_, k) => <rect key={k} x={-44 + k * 24} y={yy - 64} width={14} height={34} rx={7} fill={lit ? "#fff7d6" : "#8d7b58"} />)}
        <rect x={-58} y={yy - 80} width={116} height={12} fill="#cdbb92" />
      </g>
    ))}
    <path d="M -36 -760 L 0 -900 L 36 -760 Z" fill="#2c7a45" />
    <rect x={-4} y={-940} width={8} height={44} fill="url(#gold)" />
    <path d="M -16 -958 A 18 18 0 1 0 12 -968 A 14 14 0 1 1 -16 -958 Z" fill="url(#gold)" />
    {lit ? <circle cy={-640} r={160} fill="url(#lamp)" opacity={0.5} /> : null}
  </g>
);
const Umbrella: React.FC<{ x: number; y: number; s: number; open?: number }> = ({ x, y, s, open = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-10} y={-380} width={20} height={380} fill="#e9e3d6" />
    <path d={`M 0 -380 L ${-230 * open} ${-430 + 30 * (1 - open)} L 0 ${-470} L ${230 * open} ${-430 + 30 * (1 - open)} Z`} fill="#f4efe4" opacity={0.95} />
    <path d={`M 0 -380 L ${-230 * open} ${-430} M 0 -380 L ${230 * open} ${-430}`} stroke="#c9bfa9" strokeWidth={4} />
  </g>
);
const Lamp: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-6} y={-300} width={12} height={300} fill="#3b3a38" />
    <circle cy={-320} r={120} fill="url(#lamp)" opacity={0.75 + 0.1 * Math.sin(t * 3 + x)} />
    <rect x={-22} y={-350} width={44} height={50} rx={8} fill="#fff3c9" />
  </g>
);
const PEOPLE = (() => { const r = prng(77); return Array.from({ length: 22 }, () => ({ x: r() * 1400 - 160, sp: (r() > 0.5 ? 1 : -1) * (20 + r() * 30), s: 0.5 + r() * 0.4, c: r() > 0.25 ? "#f4f1ea" : "#2b2b33" })); })();
const Walkers: React.FC<{ t: number; y: number }> = ({ t, y }) => (
  <g>
    {PEOPLE.map((p, i) => {
      const x = (((p.x + p.sp * t) % 1500) + 1500) % 1500 - 200;
      const b = 3 * Math.abs(Math.sin(t * 5 + i));
      return (
        <g key={i} transform={`translate(${x},${y + p.s * 30 - b}) scale(${p.s})`}>
          <path d="M -26 0 Q -30 -70 -22 -120 L 22 -120 Q 30 -70 26 0 Z" fill={p.c} opacity={0.9} />
          <circle cy={-140} r={20} fill="#c9a07a" /><path d="M -22 -146 Q 0 -172 22 -146 L 24 -128 L -24 -128 Z" fill={p.c === "#2b2b33" ? "#2b2b33" : "#ffffff"} />
        </g>
      );
    })}
  </g>
);
const Stars: React.FC<{ t: number; n?: number }> = ({ t, n = 120 }) => {
  const r = prng(5);
  return <g>{Array.from({ length: n }, (_, i) => { const x = r() * 1080, y = r() * 1100, s = 0.8 + r() * 2.2, w = 0.6 + r() * 2, p = r() * 6.3; return <circle key={i} cx={x} cy={y} r={s} fill="#fff8e6" opacity={0.25 + 0.6 * (0.5 + 0.5 * Math.sin(t * w + p))} />; })}</g>;
};
const Motes: React.FC<{ t: number; seed: number; color?: string }> = ({ t, seed, color = "#ffe7a8" }) => {
  const r = prng(seed);
  return <g>{Array.from({ length: 40 }, (_, i) => { const x0 = r() * 1080, y0 = r() * 1920, sp = 20 + r() * 40, s = 1.5 + r() * 3; const y = ((y0 - sp * t) % 1920 + 1920) % 1920; return <circle key={i} cx={x0 + 20 * Math.sin(t * 0.7 + i)} cy={y} r={s} fill={color} opacity={0.35 + 0.3 * Math.sin(t * 2 + i)} />; })}</g>;
};
const SharedDefs: React.FC = () => (
  <defs>
    <radialGradient id="lamp"><stop offset="0%" stopColor="#fff1c4" stopOpacity={0.9} /><stop offset="100%" stopColor="#ffd98a" stopOpacity={0} /></radialGradient>
    <radialGradient id="fin"><stop offset="0%" stopColor="#fff6cf" stopOpacity={1} /><stop offset="100%" stopColor="#ffe08a" stopOpacity={0} /></radialGradient>
    <radialGradient id="moon"><stop offset="0%" stopColor="#fffbe8" stopOpacity={0.9} /><stop offset="100%" stopColor="#fffbe8" stopOpacity={0} /></radialGradient>
  </defs>
);

type ShotProps = { t: number; u: number };
const ShotDusk: React.FC<ShotProps> = ({ t, u }) => (
  <svg viewBox="0 0 1080 1920" style={full}>
    <SharedDefs />
    <defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2e2a5c" /><stop offset="45%" stopColor="#c86b5a" /><stop offset="75%" stopColor="#f2b27a" /><stop offset="100%" stopColor="#f6d1a0" /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#dusk)" />
    <g transform={`translate(540,1180) scale(${1 + 0.12 * u}) translate(-540,-1180)`}>
      <Minaret x={150} y={1500} s={1.25} />
      <GreenDome x={600} y={1480} s={1.9} glow={0.6 + 0.3 * Math.sin(t * 2)} />
    </g>
    <rect y={1500} width={1080} height={420} fill="#2a2118" opacity={0.85} />
    <Motes t={t} seed={3} />
  </svg>
);
const ShotBlue: React.FC<ShotProps> = ({ t, u }) => (
  <svg viewBox="0 0 1080 1920" style={full}>
    <SharedDefs />
    <defs><linearGradient id="blue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0e1a3c" /><stop offset="60%" stopColor="#2b4a7e" /><stop offset="100%" stopColor="#7d8fb3" /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#blue)" />
    <Stars t={t} n={70} />
    <g transform={`translate(0,${interpolate(u, [0, 1], [180, -120])})`}>
      <Minaret x={330} y={1900} s={1.8} lit />
      <GreenDome x={820} y={1750} s={1.25} night glow={0.5} />
      <SilverDome x={1080} y={1760} s={0.9} />
    </g>
    <Motes t={t} seed={9} color="#fff1c4" />
  </svg>
);
const ShotCourtyard: React.FC<ShotProps> = ({ t, u }) => (
  <svg viewBox="0 0 1080 1920" style={full}>
    <SharedDefs />
    <defs><linearGradient id="nightC" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#070b1c" /><stop offset="55%" stopColor="#1b2546" /><stop offset="100%" stopColor="#3a3550" /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#nightC)" />
    <Stars t={t} n={60} />
    <g transform={`translate(${interpolate(u, [0, 1], [0, -220])},0)`}>
      <rect x={-200} y={980} width={1700} height={340} fill="#d8c9a6" />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${-150 + i * 170} 1320 L ${-150 + i * 170} 1100 Q ${-65 + i * 170} 1010 ${20 + i * 170} 1100 L ${20 + i * 170} 1320 Z`} fill="#ffdf9e" opacity={0.85} />)}
      <GreenDome x={1180} y={980} s={0.75} night glow={0.4} />
      {[0, 1, 2, 3, 4, 5].map((i) => <Umbrella key={i} x={-80 + i * 300} y={1640} s={0.9} open={0.85} />)}
      {[0, 1, 2, 3, 4].map((i) => <Lamp key={i} x={80 + i * 330} y={1700} s={1.3} t={t} />)}
      <rect x={-200} y={1640} width={1700} height={300} fill="#e9e1cf" />
      <rect x={-200} y={1640} width={1700} height={300} fill="url(#lamp)" opacity={0.2} />
      <Walkers t={t} y={1760} />
    </g>
  </svg>
);
const ShotTwin: React.FC<ShotProps> = ({ t, u }) => (
  <svg viewBox="0 0 1080 1920" style={full}>
    <SharedDefs />
    <defs><linearGradient id="nightD" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#050815" /><stop offset="70%" stopColor="#14203f" /><stop offset="100%" stopColor="#283458" /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#nightD)" />
    <Stars t={t} />
    <circle cx={820} cy={330} r={220} fill="url(#moon)" /><circle cx={820} cy={330} r={60} fill="#fff6dc" />
    <g transform={`translate(540,1500) scale(${1.05 + 0.1 * u}) translate(-540,-1500)`}>
      <Minaret x={90} y={1620} s={1.35} lit />
      <Minaret x={1000} y={1620} s={1.2} lit />
      <SilverDome x={300} y={1560} s={1.0} />
      <GreenDome x={660} y={1560} s={1.25} night glow={0.7 + 0.2 * Math.sin(t * 2.4)} />
    </g>
    <rect y={1560} width={1080} height={360} fill="#cfc2a6" /><rect y={1560} width={1080} height={360} fill="#1b1d2a" opacity={0.55} />
    <Motes t={t} seed={13} color="#fff1c4" />
  </svg>
);
const ShotSkyline: React.FC<ShotProps> = ({ t, u }) => (
  <svg viewBox="0 0 1080 1920" style={full}>
    <SharedDefs />
    <defs><linearGradient id="nightE" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#04060f" /><stop offset="65%" stopColor="#101a36" /><stop offset="100%" stopColor="#2d2b45" /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#nightE)" />
    <Stars t={t} n={150} />
    <g transform={`translate(540,1400) scale(${1.25 - 0.22 * u}) translate(-540,-1400)`}>
      {[60, 250, 830, 1020].map((x, i) => <Minaret key={i} x={x} y={1480} s={0.95 + (i % 2) * 0.15} lit />)}
      <SilverDome x={360} y={1430} s={0.75} />
      <GreenDome x={620} y={1430} s={0.95} night glow={0.8} />
      <rect x={-300} y={1430} width={1700} height={120} fill="#e7d8b6" />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M ${-260 + i * 110} 1550 L ${-260 + i * 110} 1470 Q ${-215 + i * 110} 1440 ${-170 + i * 110} 1470 L ${-170 + i * 110} 1550 Z`} fill="#ffdf9e" opacity={0.8} />)}
    </g>
    <rect y={1550} width={1080} height={370} fill="#14141f" />
    <Motes t={t} seed={21} color="#fff1c4" />
  </svg>
);

const SHOTS: { a: number; b: number; C: React.FC<ShotProps> }[] = [
  { a: 0, b: 9.12, C: ShotDusk },
  { a: 9.12, b: 28.5, C: ShotBlue },
  { a: 28.5, b: 44.04, C: ShotCourtyard },
  { a: 44.04, b: 52.82, C: ShotTwin },
  { a: 52.82, b: NAAT_DUR, C: ShotSkyline },
];

/* ---------------- lyric overlay ---------------- */
const Lyric: React.FC<{ t: number }> = ({ t }) => {
  const li = LINES.findIndex((l) => t >= l.start - 0.2 && t < l.end);
  if (li < 0) return null;
  const L = LINES[li];
  const o = interpolate(t, [L.start - 0.2, L.start + 0.3, L.end - 0.35, L.end], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 760, textAlign: "center", opacity: o }}>
      <div dir="rtl" lang="ur" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", fontWeight: 700, fontSize: 64, lineHeight: 2.1, color: "#ffffff", textShadow: "0 4px 22px rgba(0,0,0,0.75)", whiteSpace: "nowrap" }}>
        {L.words.map(([u, , a, b], i) => {
          const on = t >= a - 0.05;
          const cur = t >= a - 0.05 && t < b + 0.1;
          return <span key={i} style={{ display: "inline-block", margin: "0 8px", opacity: on ? 1 : 0.28, color: cur ? "#f3cf6a" : "#ffffff", translate: `0px ${on ? 0 : 10}px` }}>{u}{i === L.words.length - 1 ? <span style={{ fontFamily: "Amiri, serif", fontSize: 50, marginRight: 8 }}>ﷺ</span> : null}</span>;
        })}
      </div>
      <div style={{ marginTop: -8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 34, letterSpacing: "0.08em", color: "#ffffff", textShadow: "0 3px 14px rgba(0,0,0,0.8)", whiteSpace: "nowrap" }}>
        {L.words.map(([, r, a, b], i) => {
          const on = t >= a - 0.05;
          const cur = t >= a - 0.05 && t < b + 0.1;
          return <span key={i} style={{ display: "inline-block", margin: "0 7px", opacity: on ? 1 : 0.3, color: cur ? "#f3cf6a" : "#ffffff" }}>{r.toUpperCase()}{i === L.words.length - 1 ? <span style={{ fontFamily: "Amiri, serif", marginLeft: 8 }}>ﷺ</span> : null}</span>;
        })}
      </div>
    </div>
  );
};

/* grain + vignette + grade */
const Grain: React.FC<{ frame: number }> = ({ frame }) => {
  const r = prng(frame * 7 + 1);
  return (
    <svg viewBox="0 0 270 480" style={{ ...full, opacity: 0.07, mixBlendMode: "overlay" }} preserveAspectRatio="none">
      {Array.from({ length: 900 }, (_, i) => <rect key={i} x={r() * 270} y={r() * 480} width={1} height={1} fill={r() > 0.5 ? "#fff" : "#000"} />)}
    </svg>
  );
};

export const NaatSabSeAula: React.FC = () => {
  const t = useT();
  const frame = useCurrentFrame();
  const XF = 0.7;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {SHOTS.map((s, i) => {
        if (t < s.a - XF || t > s.b + 0.05) return null;
        const u = interpolate(t, [s.a, s.b], [0, 1], clamp);
        const inO = i === 0 ? 1 : interpolate(t, [s.a - XF, s.a + 0.1], [0, 1], { ...clamp, easing: INO });
        const blur = i === 0 ? 0 : interpolate(t, [s.a - XF, s.a + 0.1], [14, 0], clamp);
        return <div key={i} style={{ ...full, opacity: inO, filter: blur > 0.2 ? `blur(${blur}px)` : "none" }}><s.C t={t} u={u} /></div>;
      })}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)" }} />
      <Lyric t={t} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1220, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 28, lineHeight: 1.45, letterSpacing: "0.06em", color: "rgba(255,255,255,0.8)", opacity: interpolate(t, [1, 2], [0, 1], clamp) }}>
        OWAIS RAZA QADRI<br />KALAM: ALA HAZRAT (RAHMATULLAHI ALAIH)
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1330, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)" }}>@YOURCHANNEL</div>
      <Grain frame={frame} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(t, [61.3, NAAT_DUR], [0, 1], { ...clamp, easing: OUT }) }} />
      <Audio src={staticFile("naat/sab-se-aula.m4a")} />
    </AbsoluteFill>
  );
};
