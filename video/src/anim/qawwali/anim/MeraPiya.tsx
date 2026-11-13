import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import beats from "../mera-beats.json";
import { Words, LineCaption, EndCard, pulseAt, G, QL, Credit } from "../QawwaliStory";
import { Seeker, interp, blinkAt } from "./Seeker";
import { Stars, Glow, flick, PETAL, burst, LightBg, S_Mehfil, Room, prng, k, ease } from "./QawwaliAnim";

/* Mehfil-e-Sama · "Mera Piya Ghar Aaya" (kafi of Hazrat Baba Bulleh Shah, sung by Ustad Nusrat Fateh Ali Khan).
   Clip 84.5–150.5 s of the OSA upload: the refrain only (heard clearly). Story: night, he stops the clock that counts the hours,
   lights lamps, scatters petals, waits at the door; it opens into light (the Beloved is ONLY light); joy; qawwals clap.
   Same rules as QawwaliAnim: no protected figures, nothing haram, no halo behind his head, no spinning text. */
export const MERA_DUR = 66;
const BEATS = beats.beats as number[];
const W = 1080, H = 1920;

const L1 = { ur: "گھڑیالی دیو نکال نی، میرا پیا گھر آیا", roman: "Ghariyali deyo nikaal ni, mera piya ghar aaya", en: "Send the timekeeper away, my Beloved has come home" };
const L2 = { ur: "او لال نی، میرا پیا گھر آیا", roman: "O laal ni, mera piya ghar aaya", en: "O my dear one, my Beloved has come home" };
const LINES: QL[] = [
  { id: "a", start: 0.2, end: 24.6, ...L1 }, { id: "b", start: 24.78, end: 36.7, ...L2 },
  { id: "c", start: 36.9, end: 47.3, ...L1 }, { id: "d", start: 47.5, end: 61.4, ...L2 },
];
const ref = (o: number, g: number, d: number, n: number, m: number, p: number, gh: number, aa: number, gold: boolean): G["words"] => [
  ...(o >= 0 ? [{ w: "o", t: o }] : []),
  { w: "GHARIYALI", t: g, big: true, gold }, { w: "deyo", t: d }, { w: "NIKAAL NI", t: n, big: true },
  { w: "MERA", t: m, big: true }, { w: "PIYA", t: p, big: true, gold: true }, { w: "GHAR", t: gh, big: true }, { w: "AAYA", t: aa, big: true, gold: !gold },
];
const GROUPS: G[] = [
  { a: 0.2, b: 6.2, words: ref(-1, 0.22, 0.82, 2.3, 4.14, 4.58, 5.16, 5.7, true) },
  { a: 6.3, b: 12.3, words: ref(6.32, 6.62, 8.22, 8.4, 10.08, 10.64, 11.22, 11.7, false) },
  { a: 12.5, b: 18.1, words: ref(12.52, 12.9, 14.1, 14.48, 16.2, 16.78, 17.38, 17.82, true) },
  { a: 18.2, b: 24.6, words: ref(18.2, 18.82, 20.4, 20.64, 22.24, 22.92, 23.46, 23.98, false) },
  { a: 24.78, b: 29.0, words: [{ w: "o", t: 24.78 }, { w: "LAAL NI", t: 25.2, big: true, gold: true }, { w: "MERA", t: 26.32, big: true }, { w: "PIYA", t: 27.02, big: true, gold: true }, { w: "GHAR", t: 27.58, big: true }, { w: "AAYA", t: 28.04, big: true, hold: 28.9 }] },
  { a: 36.9, b: 44.6, words: [{ w: "GHARIYALI", t: 36.9, big: true, gold: true }, { w: "DEYO", t: 37.9, big: true }, { w: "NIKAAL", t: 38.8, big: true, gold: true, hold: 44.0 }, { w: "ni", t: 44.1 }] },
  { a: 47.5, b: 51.6, words: [{ w: "o laal ni", t: 47.5 }, { w: "MERA", t: 48.8, big: true }, { w: "PIYA", t: 49.5, big: true, gold: true }, { w: "GHAR", t: 50.0, big: true }, { w: "AAYA", t: 50.2, big: true, gold: true, hold: 51.2 }] },
  { a: 57.7, b: 61.4, words: [{ w: "laal ni", t: 57.7 }, { w: "MERA", t: 59.0, big: true }, { w: "PIYA", t: 59.6, big: true, gold: true }, { w: "GHAR", t: 60.1, big: true }, { w: "AAYA", t: 60.4, big: true, gold: true, hold: 61.2 }] },
];
const CREDIT: Credit = { title: ["Mera Piya", "Ghar Aaya"], kalam: "KALAM · HAZRAT BABA BULLEH SHAH", artist: "USTAD NUSRAT FATEH ALI KHAN", rights: "AUDIO © OSA · SHARED WITH CREDIT" };

/* ---------- props ---------- */
const BRASS = "#d4a24a";
const Diya: React.FC<{ x: number; y: number; s: number; lit: number; t: number; i: number }> = ({ x, y, s, lit, t, i }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {lit > 0 && <Glow id={`dg${i}${Math.round(x)}`} cx={0} cy={-40} r={150} c="#ffb347" o={lit * 0.75 * flick(t, i)} />}
    <path d="M -46 0 Q 0 40 46 0 Q 30 -14 0 -14 Q -30 -14 -46 0 Z" fill="#b5652c" />
    <path d="M -46 0 Q 0 40 46 0" stroke="#7d3f17" strokeWidth={4} fill="none" />
    <path d="M 30 -10 L 52 -22 L 40 -6 Z" fill="#b5652c" />
    {lit > 0 && <path transform={`scale(${lit})`} d={`M 44 -24 Q ${36 + Math.sin(t * 11 + i) * 3} -50 ${44 + Math.sin(t * 7 + i) * 3} ${-78 * flick(t, i + 2)} Q ${54 + Math.sin(t * 9) * 3} -48 44 -24 Z`} fill="#ffd25e" />}
  </g>
);
const Garland: React.FC<{ y: number; t: number; sag?: number; n?: number }> = ({ y, t, sag = 110, n = 26 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const u = i / (n - 1), x = u * W, yy = y + Math.sin(Math.PI * u) * sag + Math.sin(t * 1.8 + u * 6) * 6;
      return <circle key={i} cx={x} cy={yy} r={15} fill={i % 2 ? "#f29a1d" : "#ffc02e"} />;
    })}
    {Array.from({ length: 7 }, (_, j) => {
      const u = (j + 0.5) / 7, x = u * W, y0 = y + Math.sin(Math.PI * u) * sag;
      return Array.from({ length: 5 }, (_, i) => <circle key={`${j}-${i}`} cx={x + Math.sin(t * 2 + j) * (i * 2)} cy={y0 + 26 + i * 26} r={12} fill={i % 2 ? "#ffc02e" : "#f29a1d"} />);
    })}
  </g>
);
const FairyLights: React.FC<{ y: number; t: number }> = ({ y, t }) => (
  <g>
    <path d={`M 0 ${y} Q 540 ${y + 90} 1080 ${y}`} stroke="#3a2a1a" strokeWidth={3} fill="none" />
    {Array.from({ length: 22 }, (_, i) => {
      const u = i / 21, x = u * W, yy = y + 4 * u * (1 - u) * 90;
      return <circle key={i} cx={x} cy={yy + 10} r={8} fill="#fff1a8" opacity={0.5 + 0.5 * Math.sin(t * 4 + i * 1.7)} />;
    })}
  </g>
);

/* ---------- scenes (t = seconds into the clip) ---------- */
const S_Town: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const stop = k(t, 3.8, 4.6), swing = Math.sin(t * Math.PI * 2 / 1.02) * 22 * (1 - stop);
  const hit = (1 - stop) * pulse;
  const cam = 1 + 0.25 * k(t, 3.6, 6.3);
  return (
    <g transform={`translate(700 1180) scale(${cam}) translate(-700 -1180)`}>
      <defs><linearGradient id="mpsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#070a1f" /><stop offset="70%" stopColor="#262055" /><stop offset="100%" stopColor="#3a2650" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#mpsky)" />
      <Stars t={t} />
      <Glow id="mpm" cx={830} cy={330} r={260} c="#d8e0ff" o={0.4} /><circle cx={830} cy={330} r={70} fill="#f6f2e4" />
      {/* the gong tower */}
      <g transform="translate(250 0)">
        <rect x={-90} y={620} width={180} height={1000} fill="#2e2452" stroke="#6a5a9a" strokeWidth={4} />
        <path d="M -110 640 Q -110 520 0 470 Q 110 520 110 640 Z" fill="#2e2452" stroke="#6a5a9a" strokeWidth={4} />
        <path d="M -60 760 L -60 660 Q -60 600 0 580 Q 60 600 60 660 L 60 760 Z" fill="#120c22" /><Glow id="gongG" cx={0} cy={700} r={200} c="#ffcf6a" o={0.35 + 0.4 * hit} />
        <g transform={`translate(0 640) rotate(${swing * 0.15})`}><circle cx={0} cy={60} r={44} fill={BRASS} /><circle cx={0} cy={60} r={30} fill="#f2c96a" opacity={0.6 + 0.4 * hit} /></g>
        {[0, 1, 2].map((i) => <circle key={i} cx={0} cy={700} r={60 + ((t * 1.96 + i / 3) % 1) * 260} stroke="#f2d79a" strokeWidth={4} fill="none" opacity={(1 - ((t * 1.96 + i / 3) % 1)) * 0.6 * (1 - stop)} />)}
      </g>
      {/* rooftops + one warm window (his house) */}
      <path d="M 0 1300 L 120 1300 L 120 1180 L 300 1180 L 300 1260 L 470 1260 L 470 1120 Q 560 1060 650 1120 L 650 1240 L 820 1240 L 820 1150 L 1080 1150 L 1080 1920 L 0 1920 Z" fill="#120c1e" />
      <rect x={640} y={1290} width={120} height={150} rx={60} fill="#ffcf75" opacity={0.55 + 0.45 * k(t, 4.0, 5.6)} />
      <Glow id="mpwin" cx={700} cy={1370} r={240} c="#ffb35a" o={0.35 + 0.5 * k(t, 4.0, 5.6)} />
    </g>
  );
};

const PendulumClock: React.FC<{ t: number; stop: number }> = ({ t, stop }) => {
  const a = Math.sin(t * Math.PI * 2 / 1.02) * 18 * (1 - stop);
  return (
    <g>
      <rect x={-120} y={-200} width={240} height={620} rx={24} fill="#5a3216" />
      <rect x={-96} y={70} width={192} height={320} rx={14} fill="#2a160a" />
      <circle cx={0} cy={-60} r={104} fill="#f3e6c8" stroke={BRASS} strokeWidth={10} />
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={Math.sin(i * Math.PI / 6) * 80} cy={-60 - Math.cos(i * Math.PI / 6) * 80} r={6} fill="#5a3216" />)}
      <line x1={0} y1={-60} x2={0} y2={-120} stroke="#2a160a" strokeWidth={7} strokeLinecap="round" />
      <line x1={0} y1={-60} x2={46} y2={-40} stroke="#2a160a" strokeWidth={7} strokeLinecap="round" />
      <g transform={`translate(0 80) rotate(${a})`}><line x1={0} y1={0} x2={0} y2={250} stroke={BRASS} strokeWidth={8} /><circle cx={0} cy={262} r={36} fill={BRASS} /></g>
    </g>
  );
};
const S_Clock: React.FC<{ t: number }> = ({ t }) => {
  const reach = k(t, 7.6, 8.3), stop = k(t, 8.3, 8.6), look = k(t, 9.9, 10.5);
  return (
    <g>
      <Room t={t} />
      <g transform="translate(300 860) scale(1.2)"><PendulumClock t={t} stop={stop} /></g>
      <g transform={`translate(${720} 2150) scale(1.9)`}>
        <Seeker uid="m2" t={t} wind={0.1} blink={blinkAt(t, 3)} gazeX={-0.9 + 1.7 * look} gazeY={-0.1} smile={0.3 + 0.6 * k(t, 8.5, 9.2)} wide={look} brow={0.4 * look}
          lArm={[-4 - 92 * reach * (1 - k(t, 9.6, 10.2)), 6 + 40 * reach * (1 - k(t, 9.6, 10.2))]} tilt={-4 * (1 - look) + 3 * look} glow={0.1} />
      </g>
    </g>
  );
};

const DIYAS = Array.from({ length: 7 }, (_, i) => ({ x: 110 + i * 143, y: 640 + (i % 2) * 20, lightAt: 12.6 + i * 0.78 }));
const S_Lamps: React.FC<{ t: number }> = ({ t }) => {
  const nxt = DIYAS.findIndex((d) => t < d.lightAt + 0.2);
  const target = DIYAS[Math.max(0, nxt === -1 ? DIYAS.length - 1 : nxt)];
  const lit = DIYAS.filter((d) => t >= d.lightAt).length;
  const handX = interp(t, DIYAS.map((d) => d.lightAt - 0.4), DIYAS.map((d) => d.x + 50));
  return (
    <g>
      <defs><radialGradient id="lampbg" cx="50%" cy="70%" r="80%"><stop offset="0%" stopColor={`rgb(${70 + lit * 14},${36 + lit * 7},${14 + lit * 3})`} /><stop offset="100%" stopColor="#0c0604" /></radialGradient></defs>
      <rect width={W} height={H} fill="url(#lampbg)" />
      <path d="M 0 672 L 1080 672 L 1080 712 L 0 712 Z" fill="#3a2010" /><Glow id="shelfG" cx={540} cy={600} r={700} c="#ffae4a" o={0.12 * lit} />
      <path d="M 120 1900 L 120 1100 Q 120 900 340 840 Q 560 900 560 1100 L 560 1900 M 600 1900 L 600 1100 Q 600 900 780 840 Q 960 900 960 1100 L 960 1900" fill="none" stroke="#7a4a20" strokeWidth={12} opacity={0.5 + 0.06 * lit} />
      {DIYAS.map((d, i) => <Diya key={i} x={d.x} y={d.y} s={1.55} lit={k(t, d.lightAt, d.lightAt + 0.25)} t={t} i={i} />)}
      {/* his hand carrying a small flame along the row */}
      {t < DIYAS[6].lightAt + 0.6 && (
        <g transform={`translate(${handX} ${540 + Math.sin(t * 8) * 6})`}>
          <path d="M -260 160 Q -120 90 -20 40 L 0 70 Q -110 130 -240 210 Z" fill="#f5f0e6" />
          <ellipse cx={0} cy={40} rx={34} ry={26} fill="#c48d66" />
          <line x1={10} y1={30} x2={50} y2={-30} stroke="#d9c39a" strokeWidth={6} />
          <path d={`M 50 -30 Q 42 -54 ${52 + Math.sin(t * 13) * 3} -76 Q 62 -52 50 -30 Z`} fill="#ffd25e" />
          <Glow id="carry" cx={52} cy={-50} r={90} c="#ffb347" o={0.8} />
        </g>
      )}
      {target && null}
    </g>
  );
};

const S_Petals: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const tosses = BEATS.filter((b, i) => b > 18.4 && b < 24.4 && i % 2 === 0);
  const last = tosses.filter((b) => b <= t).pop() ?? 18.2;
  const throwK = Math.exp(-Math.max(0, t - last) / 0.18);
  return (
    <g>
      <defs><linearGradient id="court" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d0a22" /><stop offset="55%" stopColor="#2a1838" /><stop offset="100%" stopColor="#4a2a1c" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#court)" />
      <Stars t={t} o={0.7} />
      <path d="M 240 1500 L 240 820 Q 240 620 540 560 Q 840 620 840 820 L 840 1500 Z" fill="#3a2214" stroke="#c99140" strokeWidth={14} />
      <rect x={300} y={760} width={480} height={740} fill="#5a3214" />
      <rect y={1500} width={W} height={420} fill="#5e3a22" />
      <FairyLights y={420} t={t} />
      <Garland y={300} t={t} />
      {DIYAS.slice(0, 4).map((d, i) => <Diya key={i} x={140 + i * 270} y={1560} s={0.8} lit={1} t={t} i={i + 10} />)}
      {Array.from({ length: 30 }, (_, i) => { const r = prng(i + 50); return <path key={i} d={PETAL} transform={`translate(${200 + r() * 680} ${1530 + r() * 300}) rotate(${r() * 360}) scale(${0.6 + r() * 0.5},${0.35})`} fill="#c8143c" opacity={k(t, 18.6 + i * 0.18, 19 + i * 0.18)} />; })}
      <g transform="translate(560 1930) scale(1.18)">
        <Seeker uid="m4" t={t} wind={0.4} blink={blinkAt(t, 6)} smile={0.8} gazeX={0.3} gazeY={0.3} rArm={[-30 - 60 * throwK, 30 - 20 * throwK]} lArm={[30, 70]} />
      </g>
      {tosses.map((b, i) => <g key={i}>{burst(t, b, 760, 1050, 18, 70 + i)}</g>)}
    </g>
  );
};

const S_Wait: React.FC<{ t: number }> = ({ t }) => {
  const light = k(t, 25.0, 28.6);
  return (
    <g>
      <rect width={W} height={H} fill="#140b08" />
      <rect x={180} y={280} width={720} height={1400} fill="#5a3214" />
      {[0, 1].map((c) => [0, 1, 2].map((r) => <rect key={`${c}${r}`} x={220 + c * 350} y={340 + r * 440} width={290} height={380} rx={12} fill="none" stroke="#3a1e0a" strokeWidth={12} />))}
      <rect x={536} y={280} width={8} height={1400} fill="#fff3c8" opacity={0.3 + 0.7 * light} />
      <rect x={180} y={1668} width={720} height={14} fill="#fff3c8" opacity={0.2 + 0.8 * light} />
      <Glow id="under" cx={540} cy={1700} r={600} c="#ffd98a" o={0.2 + 0.6 * light} />
      <Glow id="crack" cx={540} cy={900} r={420} c="#ffe6a6" o={0.15 + 0.45 * light} />
      <g transform="translate(860 2230) scale(1.95)">
        <Seeker uid="m5" t={t} wind={0.1} blink={blinkAt(t, 7)} gazeX={-0.9} gazeY={0} wide={k(t, 26.2, 26.8)} brow={0.5 * k(t, 26.2, 26.8)} smile={0.2 + 0.7 * k(t, 27.5, 28.3)} glow={0.15 + 0.4 * light} tilt={-5} />
      </g>
    </g>
  );
};

const S_Open: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const open = k(t, 29.0, 31.4), walk = k(t, 30.5, 36.9);
  return (
    <g transform={`translate(540 960) scale(${1 + 0.15 * k(t, 29, 36.9)}) translate(-540 -960)`}>
      <rect width={W} height={H} fill="#1a0e08" />
      <defs><radialGradient id="beyond2" cx="50%" cy="55%" r="60%"><stop offset="0%" stopColor="#ffffff" /><stop offset="40%" stopColor="#fff0c4" /><stop offset="100%" stopColor="#f0a83c" /></radialGradient></defs>
      <rect x={180} y={280} width={720} height={1400} fill="url(#beyond2)" />
      {Array.from({ length: 14 }, (_, i) => {
        const a = Math.PI / 2 + (i - 6.5) * 0.13, L = 1700;
        return <path key={i} d={`M 540 900 L ${540 + Math.cos(a - 0.03) * L} ${900 + Math.sin(a - 0.03) * L} L ${540 + Math.cos(a + 0.03) * L} ${900 + Math.sin(a + 0.03) * L} Z`} fill="#fff4cf" opacity={open * (0.14 + 0.1 * pulse)} />;
      })}
      {/* doors swing inward: panels narrow toward the hinges, nearer edge grows */}
      {[-1, 1].map((sd) => {
        const w = 360 * (1 - 0.82 * open), x0 = sd < 0 ? 180 : 900 - w, grow = 60 * open;
        return <path key={sd} d={sd < 0 ? `M ${x0} 280 L ${x0 + w} ${280 - grow} L ${x0 + w} ${1680 + grow} L ${x0} 1680 Z` : `M ${x0} ${280 - grow} L ${x0 + w} 280 L ${x0 + w} 1680 L ${x0} ${1680 + grow} Z`} fill="#5a3214" stroke="#3a1e0a" strokeWidth={8} />;
      })}
      <path fillRule="evenodd" d="M -100 1920 L -100 0 L 1180 0 L 1180 1920 Z M 180 280 L 900 280 L 900 1680 L 180 1680 Z" fill="#2b170c" />
      <rect x={0} y={1680} width={W} height={240} fill="#2a180c" />
      <Glow id="flood" cx={540} cy={1500} r={900} c="#ffd38a" o={0.6 * open} />
      <g transform={`translate(540 ${1930 - 120 * walk}) scale(${1.05 - 0.25 * walk})`} style={{ filter: "brightness(0.14)" }}>
        <Seeker uid="m6" t={t} back walk={walk > 0 && walk < 1 ? (t - 30.5) * 3.2 : 0} wind={0.3} />
      </g>
      {Array.from({ length: 30 }, (_, i) => { const r = prng(i + 90), x = 200 + r() * 680, y = ((r() * H - (t - 29) * (40 + r() * 60)) % H + H) % H; return <circle key={i} cx={x} cy={y} r={2 + r() * 4} fill="#fff6d6" opacity={open * 0.7} />; })}
    </g>
  );
};

const S_Joy: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const up = k(t, 36.9, 37.6);
  const bob = -Math.abs(Math.sin(((t - 36.9) * Math.PI) / 1.02)) * 16;
  return (
    <g>
      <LightBg t={t} pulse={pulse} />
      <Garland y={140} t={t} sag={90} />
      <g transform={`translate(540 ${2030 + bob}) scale(1.22)`}>
        <Seeker uid="m7" t={t} wind={0.7 + 0.3 * pulse} closed={k(t, 41, 41.6) * (1 - k(t, 44.4, 44.9))} smile={1} gazeX={0.5} gazeY={-0.8} glow={0.45} brow={0.4}
          lArm={[-4 - 156 * up, 6 - 20 * up + 8 * Math.sin(t * 6)]} rArm={[-4 - 156 * up, 6 - 20 * up + 8 * Math.sin(t * 6 + 1)]} mouthOpen={0.3 * k(t, 37.0, 37.4) * (1 - k(t, 40.5, 41))} />
      </g>
      {Array.from({ length: 70 }, (_, i) => {
        const r = prng(i + 300), x = r() * W, sp = 120 + r() * 220, y = ((r() * H + (t - 36.9) * sp) % (H + 200)) - 100;
        return <path key={i} d={PETAL} transform={`translate(${x + Math.sin(t * 2 + i) * 30} ${y}) rotate(${(t * 90 + i * 40) % 360}) scale(${0.8 + r()})`} fill={i % 3 ? "#c8143c" : "#ff6f8e"} opacity={0.9} />;
      })}
    </g>
  );
};

const S_Tears: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const S = interp(ease((t - 47.5) / 10), [0, 1], [2.3, 3.6]);
  return (
    <g>
      <LightBg t={t} pulse={pulse} o={0.85} />
      <g transform={`translate(540 ${700 + 802 * S}) scale(${S})`}>
        <Seeker uid="m8" t={t} wind={0.3} closed={1 - k(t, 54.6, 55.4)} smile={0.75} tear={k(t, 48.5, 53.5)} glow={0.45 + 0.2 * pulse} gazeX={0.7} gazeY={-0.8} tilt={4} brow={0.3} />
      </g>
    </g>
  );
};

type Shot = { a: number; b: number; r: (t: number, pulse: number) => React.ReactNode };
const SHOTS: Shot[] = [
  { a: 0, b: 6.3, r: (t, p) => <S_Town t={t} pulse={p} /> },
  { a: 6.3, b: 12.4, r: (t) => <S_Clock t={t} /> },
  { a: 12.4, b: 18.2, r: (t) => <S_Lamps t={t} /> },
  { a: 18.2, b: 24.7, r: (t, p) => <S_Petals t={t} pulse={p} /> },
  { a: 24.7, b: 29.0, r: (t) => <S_Wait t={t} /> },
  { a: 29.0, b: 36.9, r: (t, p) => <S_Open t={t} pulse={p} /> },
  { a: 36.9, b: 47.5, r: (t, p) => <S_Joy t={t} pulse={p} /> },
  { a: 47.5, b: 57.7, r: (t, p) => <S_Tears t={t} pulse={p} /> },
  { a: 57.7, b: 66.1, r: (t, p) => <S_Mehfil t={t} pulse={p} a={57.7} b={66} beats={BEATS} dimAt={61.4} /> },
];
const XF = 0.3;
const FLASH = [29.0, 36.9];

export const MeraPiya: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t, BEATS);
  const flash = Math.max(0, ...FLASH.map((f) => interp(t, [f - 0.06, f, f + 0.8], [0, 1, 0])));
  const fade = Math.max(interp(t, [0, 0.6], [1, 0]), interp(t, [MERA_DUR - 1.3, MERA_DUR], [0, 1]));
  return (
    <AbsoluteFill style={{ background: "#07040c" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => {
          if (t < s.a - XF || t > s.b + XF) return null;
          const o = s.a === 0 ? 1 : interp(t, [s.a - XF, s.a + XF], [0, 1]);
          return <g key={i} opacity={o} transform={`translate(540 960) scale(${1 + 0.006 * pulse}) translate(-540 -960)`}>{s.r(t, pulse)}</g>;
        })}
        <defs><radialGradient id="vig2" cx="50%" cy="46%" r="75%"><stop offset="60%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.55} /></radialGradient>
          <linearGradient id="band2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#08040e" stopOpacity={0.45} /><stop offset="20%" stopColor="#08040e" stopOpacity={0} /><stop offset="38%" stopColor="#08040e" stopOpacity={0} /><stop offset="55%" stopColor="#08040e" stopOpacity={0.4} /><stop offset="74%" stopColor="#08040e" stopOpacity={0.62} /><stop offset="90%" stopColor="#08040e" stopOpacity={0.3} /><stop offset="100%" stopColor="#08040e" stopOpacity={0.1} /></linearGradient></defs>
        <rect width={W} height={H} fill="url(#vig2)" />
        <rect width={W} height={H} fill="url(#band2)" />
        <rect width={W} height={H} fill="#fff1c8" opacity={flash * 0.7} />
      </svg>
      <Words t={t} pulse={pulse} groups={GROUPS} />
      <LineCaption t={t} lines={LINES} until={61.4} />
      <EndCard t={t} start={61.8} credit={CREDIT} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
      {withAudio && <Audio src={staticFile("qawwali/mera-piya.m4a")} />}
    </AbsoluteFill>
  );
};
