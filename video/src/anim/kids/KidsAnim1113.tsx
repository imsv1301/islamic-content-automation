import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../kids-d1113-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, prng, k, ease } from "../qawwali/anim/QawwaliAnim";

/* Islam for Little Ones · 13 Nov 2026 "Help at home!" (Sahih al-Bukhari 676), re-made as full animation on the same voice track.
   Cast: ordinary family (kid, mum in hijab, dad) with faces (Sahil, 13 Nov). NEVER shown: the Prophet ﷺ, Hazrat Aisha (RA), any
   Sahabi; when he ﷺ is mentioned we show the REAL Green Dome photo (Pixabay) only, and his home is shown empty. No music. */
type Tok = [string, number, number];
type Line = { id: string; start: number; end: number; tokens: Tok[] };
const TL = (timing as unknown as { total: number; lines: Line[] });
export const KIDS1113_DUR = 33.2;
const W = 1080, H = 1920;
const FONT = "'Baloo 2', 'Montserrat', sans-serif";
const KID: Look = { kid: true, beard: false, cap: null, top: "#3d8fe0", topD: "#2c6db3", pants: "#2b3a67", shawl: false, hair: "#24170f" };
const MUM: Look = { beard: false, cap: null, hijab: "#8c4f8f", top: "#b67ab3", topD: "#8f5a8d", shawl: false, long: true, skin: ["#e6bd98", "#cf9d76", "#ad7b55"] };
const DAD: Look = { beard: true, top: "#dbe7f3", topD: "#b7c8db", pants: "#c9d4e2", shawl: false };
const pop = (t: number, at: number, d = 0.35) => { const x = Math.min(1, Math.max(0, (t - at) / d)); return x <= 0 ? 0 : 1 - Math.pow(1 - x, 3) * Math.cos(x * 5); };

/* ---------- props ---------- */
const Room: React.FC<{ wall?: string; floor?: string }> = ({ wall = "#ffe9c7", floor = "#e7b57d" }) => (
  <g>
    <rect width={W} height={H} fill={wall} />
    <rect y={1500} width={W} height={420} fill={floor} />
    <rect y={1490} width={W} height={16} fill="#c98f55" />
    <rect x={640} y={330} width={300} height={380} rx={20} fill="#bfe3ff" stroke="#fff" strokeWidth={18} />
    <line x1={790} y1={330} x2={790} y2={710} stroke="#fff" strokeWidth={12} /><line x1={640} y1={520} x2={940} y2={520} stroke="#fff" strokeWidth={12} />
    <circle cx={720} cy={420} r={34} fill="#fff6c9" />
  </g>
);
const Table: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 520 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={0} width={w} height={34} rx={10} fill="#a8683a" />
    <rect x={-w / 2 + 30} y={34} width={26} height={220} fill="#8a5330" /><rect x={w / 2 - 56} y={34} width={26} height={220} fill="#8a5330" />
  </g>
);
const Plate: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}><ellipse rx={56} ry={16} fill="#fff" stroke="#d9e2ec" strokeWidth={4} /><ellipse rx={30} ry={8} fill="#eef3f8" /></g>
);
const Cup: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}><path d="M -20 -44 L 20 -44 L 16 0 L -16 0 Z" fill="#ff8a65" /><path d="M 20 -34 Q 36 -26 18 -12" stroke="#ff8a65" strokeWidth={6} fill="none" /></g>
);
const Ball: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><circle r={34} fill="#ff5a5f" /><path d="M -34 0 Q 0 -18 34 0" stroke="#fff" strokeWidth={8} fill="none" /></g>
);
const Block: React.FC<{ x: number; y: number; c: string; s?: number; r?: number }> = ({ x, y, c, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}><rect x={-28} y={-28} width={56} height={56} rx={8} fill={c} /><rect x={-16} y={-16} width={32} height={32} rx={4} fill="#ffffff55" /></g>
);
const Car: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-60} y={-40} width={120} height={36} rx={12} fill="#2ec4b6" /><rect x={-34} y={-66} width={64} height={30} rx={10} fill="#2ec4b6" /><circle cx={-34} cy={-2} r={16} fill="#333" /><circle cx={34} cy={-2} r={16} fill="#333" /></g>
);
const Shirt: React.FC<{ x: number; y: number; fold: number; c?: string }> = ({ x, y, fold, c = "#ffd166" }) => (
  <g transform={`translate(${x} ${y}) scale(${1 - 0.45 * fold},${1 - 0.55 * fold})`}>
    <path d="M -70 -60 L -30 -80 Q 0 -66 30 -80 L 70 -60 L 100 -20 L 70 0 L 60 -20 L 60 80 L -60 80 L -60 -20 L -70 0 L -100 -20 Z" fill={c} stroke="#e0b44a" strokeWidth={4} />
  </g>
);
const Pot: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-150} y={0} width={300} height={260} rx={14} fill="#d6dde6" /><rect x={-150} y={0} width={300} height={24} fill="#b8c2cf" />
    <path d="M -90 -90 L 90 -90 L 80 0 L -80 0 Z" fill="#6c7a89" /><rect x={-104} y={-104} width={208} height={20} rx={8} fill="#55606d" />
    {[0, 1, 2].map((i) => { const ph = (t * 0.7 + i / 3) % 1; return <path key={i} d={`M ${-40 + i * 40} ${-110 - ph * 160} q 16 -20 0 -40 q -16 -20 0 -40`} stroke="#ffffff" strokeWidth={8} fill="none" opacity={(1 - ph) * 0.7} />; })}
  </g>
);
const Basket: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}><path d="M -110 0 L 110 0 L 90 120 L -90 120 Z" fill="#d9a35f" /><path d="M -110 0 L 110 0" stroke="#a87436" strokeWidth={10} />
    <circle cx={-40} cy={-14} r={30} fill="#7ec8e3" /><circle cx={20} cy={-20} r={34} fill="#ffb3c1" /><circle cx={70} cy={-8} r={24} fill="#c7f0a8" /></g>
);
const ToyBox: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}><rect x={-130} y={-120} width={260} height={160} rx={16} fill="#ff9f1c" /><rect x={-130} y={-140} width={260} height={30} rx={10} fill="#ffbf69" />
    <text x={0} y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill="#fff">TOYS</text></g>
);
const Sparkles: React.FC<{ t: number; at: number; cx: number; cy: number; n?: number }> = ({ t, at, cx, cy, n = 10 }) => {
  if (t < at) return null;
  const d = t - at, r = prng(Math.round(at * 100));
  return <g>{Array.from({ length: n }, (_, i) => { const a = r() * 6.28, v = 160 + r() * 220, x = cx + Math.cos(a) * v * Math.min(d, 0.8), y = cy + Math.sin(a) * v * Math.min(d, 0.8); const o = Math.max(0, 1 - d / 1.1); return <path key={i} transform={`translate(${x} ${y}) scale(${0.6 + r()})`} d="M 0 -20 L 6 -6 L 20 0 L 6 6 L 0 20 L -6 6 L -20 0 L -6 -6 Z" fill={i % 2 ? "#ffd166" : "#fff"} opacity={o} />; })}</g>;
};
const Heart: React.FC<{ x: number; y: number; s: number; o: number }> = ({ x, y, s, o }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z" fill="#ff5a7a" opacity={o} />
);

/* ---------- scenes ---------- */
const S_Messy: React.FC<{ t: number }> = ({ t }) => {
  const kidIn = pop(t, 2.65, 0.45);
  return (
    <g>
      <Room />
      <Pot x={850} y={1240} t={t} />
      <g transform="translate(860 1500) scale(0.82)"><Seeker uid="km1" t={t} look={MUM} blink={blinkAt(t, 1)} gazeX={-0.4} gazeY={0.6} smile={0.3} rArm={[40, 70 + 18 * Math.sin(t * 7)]} lArm={[10, 20]} /></g>
      <g transform={`translate(${170 + 30 * Math.sin(t * 1.4)} 1500) scale(0.86)`}><Seeker uid="kd1" t={t} look={DAD} blink={blinkAt(t, 2)} gazeX={0.6} smile={0.2} lArm={[34, 86]} rArm={[34, 86]} /></g>
      <Basket x={170 + 30 * Math.sin(t * 1.4)} y={1080} />
      <Table x={520} y={1250} />
      <Plate x={400} y={1240} r={-14} /><Plate x={560} y={1236} r={9} /><Cup x={660} y={1250} r={40} /><Cup x={470} y={1250} />
      <Ball x={330} y={1530} /><Block x={620} y={1560} c="#7b61ff" r={20} /><Block x={700} y={1540} c="#3ddc97" r={-12} /><Car x={480} y={1590} s={0.8} />
      <g transform={`translate(540 ${2800 - 1290 * kidIn}) scale(0.9)`}>
        <Seeker uid="kk1" t={t} look={KID} blink={blinkAt(t, 3)} smile={1} wide={0.6 * k(t, 3.3, 3.6)} lArm={[-172 * k(t, 3.3, 3.55), 4 * k(t, 3.3, 3.55)]} brow={0.5} />
      </g>
      <Sparkles t={t} at={3.4} cx={700} cy={1080} />
    </g>
  );
};

const Book: React.FC<{ t: number }> = ({ t }) => {
  const flip = (t * 1.3) % 1;
  return (
    <g transform="translate(540 980)">
      <Glow id="bookG" cx={0} cy={-40} r={520} c="#fff1b8" o={0.8} />
      <path d="M -330 0 Q -170 -50 0 0 L 0 300 Q -170 250 -330 300 Z" fill="#fffaf0" stroke="#d8c39a" strokeWidth={6} />
      <path d="M 330 0 Q 170 -50 0 0 L 0 300 Q 170 250 330 300 Z" fill="#fffaf0" stroke="#d8c39a" strokeWidth={6} />
      <path d="M -340 10 L -340 320 Q -170 270 0 320 Q 170 270 340 320 L 340 10" fill="none" stroke="#2e7d5b" strokeWidth={22} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M -290 ${50 + i * 46} Q -160 ${30 + i * 46} -40 ${50 + i * 46}`} stroke="#c9b48a" strokeWidth={6} fill="none" />)}
      {[0, 1, 2, 3, 4].map((i) => <path key={`r${i}`} d={`M 40 ${50 + i * 46} Q 160 ${30 + i * 46} 290 ${50 + i * 46}`} stroke="#c9b48a" strokeWidth={6} fill="none" />)}
      <path d={`M 0 0 Q ${170 * Math.cos(flip * Math.PI)} -60 ${330 * Math.cos(flip * Math.PI)} 0 L ${330 * Math.cos(flip * Math.PI)} 300 Q ${170 * Math.cos(flip * Math.PI)} 250 0 300 Z`} fill="#fff" stroke="#d8c39a" strokeWidth={4} opacity={0.95} />
      <text x={0} y={-160 + Math.sin(t * 3) * 10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={190} fill="#2e7d5b">?</text>
    </g>
  );
};
const S_Question: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs><radialGradient id="qbg" cx="50%" cy="45%" r="70%"><stop offset="0%" stopColor="#fff6dc" /><stop offset="100%" stopColor="#ffd59a" /></radialGradient></defs>
    <rect width={W} height={H} fill="url(#qbg)" />
    {Array.from({ length: 16 }, (_, i) => { const r = prng(i + 7), x = r() * W, y = ((r() * H - t * (30 + r() * 40)) % H + H) % H; return <circle key={i} cx={x} cy={y} r={4 + r() * 8} fill="#ffffff" opacity={0.7} />; })}
    <Book t={t} />
  </g>
);

const BIRDS = Array.from({ length: 7 }, (_, i) => ({ y: 260 + i * 55, sp: 90 + i * 12, ph: i * 0.9, s: 0.7 + (i % 3) * 0.2 }));
const S_Dome: React.FC<{ t: number }> = ({ t }) => {
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${100 + i * 100} -40 L ${170 + i * 100} -40 L ${260 + i * 120} 1920 L ${40 + i * 90} 1920 Z`} fill="#fff6d0" opacity={0.05 + 0.04 * Math.sin(t * 1.5 + i)} />)}
      {BIRDS.map((b, i) => { const x = ((t - 7) * b.sp + i * 160) % 1300 - 100, flap = Math.sin(t * 9 + b.ph) * 12; return <path key={i} transform={`translate(${x} ${b.y + Math.sin(t + i) * 10}) scale(${b.s})`} d={`M -24 ${flap} Q -12 -6 0 0 Q 12 -6 24 ${flap}`} stroke="#3a3a3a" strokeWidth={5} fill="none" strokeLinecap="round" />; })}
      <rect width={W} height={H} fill="#ffe6b0" opacity={0.08} />
    </g>
  );
};

const S_Home: React.FC<{ t: number }> = ({ t }) => {
  const pan = k(t, 15.0, 17.6);
  return (
    <g transform={`translate(${-90 * pan} 0)`}>
      <rect x={-100} width={W + 300} height={H} fill="#e9cfa2" />
      <rect x={-100} y={1460} width={W + 300} height={460} fill="#c9a06a" />
      {Array.from({ length: 30 }, (_, i) => <line key={i} x1={-100 + i * 50} y1={1470} x2={-120 + i * 50} y2={1900} stroke="#b88c55" strokeWidth={6} />)}
      <rect x={160} y={420} width={260} height={320} rx={8} fill="#7ab8e8" stroke="#a87a45" strokeWidth={20} />
      <path d="M 250 740 Q 260 560 300 470 Q 320 560 330 740 Z" fill="#3c7a3a" /><path d="M 300 480 Q 220 440 180 480 M 300 480 Q 380 430 420 480 M 300 480 Q 250 400 210 410 M 300 480 Q 360 400 400 410" stroke="#3c7a3a" strokeWidth={20} fill="none" strokeLinecap="round" />
      <Glow id="homeSun" cx={290} cy={580} r={420} c="#fff2c0" o={0.5} />
      <g transform="translate(720 1300)"><path d="M -70 160 Q -100 40 -50 -20 L 50 -20 Q 100 40 70 160 Z" fill="#b5652c" /><rect x={-34} y={-60} width={68} height={44} rx={10} fill="#9a5222" /></g>
      <g transform={`translate(980 1050) rotate(${-12 + 3 * Math.sin(t * 2)})`}><rect x={-8} y={-280} width={16} height={340} fill="#8a5a2c" /><path d="M -60 60 L 60 60 L 40 200 L -40 200 Z" fill="#d9b25f" /></g>
      <g transform="translate(560 900)"><line x1={0} y1={-240} x2={0} y2={-120} stroke="#5a3a1a" strokeWidth={6} /><path d="M -40 -120 L 40 -120 L 30 -40 L -30 -40 Z" fill="#c98a3a" /><Glow id="homeLamp" cx={0} cy={-80} r={160} c="#ffcf6a" o={0.6 + 0.2 * Math.sin(t * 9)} /></g>
      <rect x={300} y={1520} width={560} height={240} rx={20} fill="#b2763d" /><path d="M 320 1540 L 840 1540 M 320 1600 L 840 1600 M 320 1660 L 840 1660 M 320 1720 L 840 1720" stroke="#9a6532" strokeWidth={8} />
    </g>
  );
};

const S_Pray: React.FC<{ t: number }> = ({ t }) => {
  const un = k(t, 18.1, 19.4), dusk = k(t, 17.4, 20);
  return (
    <g>
      <defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b3a7a" /><stop offset="55%" stopColor="#f08a5d" /><stop offset="100%" stopColor="#ffd59a" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#dusk)" />
      <circle cx={540} cy={900 + 140 * dusk} r={120} fill="#ffe08a" />
      <path d="M 820 300 A 70 70 0 1 0 880 420 A 56 56 0 1 1 820 300 Z" fill="#fff6d8" opacity={0.4 + 0.6 * dusk} />
      <path d="M 0 1100 L 120 1100 L 120 1010 L 260 1010 L 260 1060 L 380 1060 L 380 960 Q 540 820 700 960 L 700 1060 L 820 1060 L 820 1000 L 1080 1000 L 1080 1920 L 0 1920 Z" fill="#40284a" />
      <rect x={515} y={860} width={50} height={110} fill="#40284a" /><path d="M 540 860 L 540 820" stroke="#40284a" strokeWidth={8} />
      <rect y={1100} width={W} height={820} fill="#e7b57d" />
      <g transform="translate(540 1230) scale(1.25)">
        <rect x={-260} y={-120} width={520 * un} height={240} rx={14} fill="#2e7d5b" transform={`translate(${-260 * (1 - un) * 0} 0)`} />
        <rect x={-240} y={-100} width={Math.max(0, 480 * un)} height={200} rx={10} fill="none" stroke="#ffd166" strokeWidth={8} />
        <path d={`M ${-260 + 520 * un} -120 m 0 0 a 40 120 0 1 0 0 240`} fill="#256b4c" opacity={1 - un * 0.6} />
        {un > 0.6 && <path d="M 150 -60 L 200 -60 L 200 0 Q 175 -40 150 0 Z" fill="#ffd166" opacity={k(t, 19.0, 19.4)} />}
      </g>
    </g>
  );
};

const TOYS = [{ c: "ball", x: 150, y: 1460, at: 21.39 }, { c: "#7b61ff", x: 260, y: 1470, at: 21.55 }, { c: "car", x: 360, y: 1490, at: 21.7 }, { c: "#3ddc97", x: 440, y: 1470, at: 21.85 }];
const S_Jobs: React.FC<{ t: number }> = ({ t }) => {
  const box = { x: 870, y: 1470 };
  const plates = [22.12, 22.3, 22.48];
  const fold = k(t, 22.96, 23.6);
  const phase = t < 22.1 ? 0 : t < 22.95 ? 1 : 2;
  return (
    <g>
      <Room wall="#e7f6ff" floor="#f2c890" />
      <Table x={540} y={1240} w={560} />
      {plates.map((p, i) => { const q = ease(Math.min(1, Math.max(0, (t - p) / 0.35))); return t > p - 0.05 && <Plate key={i} x={interp(q, [0, 1], [1200, 380 + i * 160])} y={1236 - 140 * Math.sin(q * Math.PI)} />; })}
      <ToyBox x={box.x} y={box.y} />
      {TOYS.map((ty, i) => {
        const q = ease(Math.min(1, Math.max(0, (t - ty.at) / 0.45)));
        const x = interp(q, [0, 1], [ty.x, box.x]), y = interp(q, [0, 1], [ty.y, box.y - 120]) - 260 * Math.sin(q * Math.PI);
        const s = 1 - 0.5 * q;
        if (q >= 1) return null;
        return ty.c === "ball" ? <Ball key={i} x={x} y={y} s={s} /> : ty.c === "car" ? <Car key={i} x={x} y={y} s={0.8 * s} /> : <Block key={i} x={x} y={y} c={ty.c} s={s} r={q * 180} />;
      })}
      <Shirt x={200} y={1300} fold={fold} />
      <g transform={`translate(${interp(phase, [0, 1, 2], [560, 640, 360])} ${1500 - Math.abs(Math.sin(t * 9)) * 12}) scale(0.9)`}>
        <Seeker uid="kk5" t={t} look={KID} blink={blinkAt(t, 4)} smile={1} gazeX={phase === 2 ? -0.9 : 0.8}
          rArm={phase === 0 ? [-60 - 40 * Math.sin(t * 10), 40] : phase === 1 ? [-80, 20 + 20 * Math.sin(t * 12)] : [-20, 60]}
          lArm={phase === 2 ? [-70 + 30 * Math.sin(t * 10), 50] : [10, 30]} />
      </g>
      <Sparkles t={t} at={22.0} cx={box.x} cy={box.y - 140} />
      <Sparkles t={t} at={23.6} cx={200} cy={1300} />
    </g>
  );
};

const S_Family: React.FC<{ t: number }> = ({ t }) => {
  const jump = t > 27.2 && t < 27.9 ? -Math.sin(((t - 27.2) / 0.7) * Math.PI) * 70 : 0;
  return (
    <g>
      <Room wall="#fff1d6" />
      <Table x={540} y={1260} w={600} />
      <Plate x={380} y={1256} /><Plate x={540} y={1256} /><Plate x={700} y={1256} /><Cup x={460} y={1262} /><Cup x={620} y={1262} />
      <g transform="translate(250 1500) scale(0.86)"><Seeker uid="kd6" t={t} look={DAD} blink={blinkAt(t, 5)} smile={0.9} gazeX={0.7} gazeY={0.4} rArm={[30, 40]} /></g>
      <g transform="translate(830 1500) scale(0.82)"><Seeker uid="km6" t={t} look={MUM} blink={blinkAt(t, 6)} smile={1} gazeX={-0.7} gazeY={0.4} lArm={[30, 40]} /></g>
      <g transform={`translate(540 ${1560 + jump}) scale(0.88)`}><Seeker uid="kk6" t={t} look={KID} blink={blinkAt(t, 7)} smile={1} wide={0.4} rArm={[-4 - 168 * k(t, 27.1, 27.3), 6]} lArm={[-4 - 168 * k(t, 27.1, 27.3), 6]} /></g>
      {Array.from({ length: 9 }, (_, i) => { const r = prng(i + 40), at = 25.4 + i * 0.25, d = t - at; return d > 0 && <Heart key={i} x={200 + r() * 680} y={640 - d * 200} s={0.7 + r() * 0.6} o={Math.max(0, 1 - d / 1.8)} />; })}
      <Sparkles t={t} at={27.3} cx={540} cy={560} n={14} />
    </g>
  );
};

const S_Bye: React.FC<{ t: number }> = ({ t }) => {
  const wave = Math.sin(t * 8) * 18;
  return (
    <g>
      <defs><radialGradient id="byebg" cx="50%" cy="40%" r="75%"><stop offset="0%" stopColor="#fff7d6" /><stop offset="100%" stopColor="#ffc27a" /></radialGradient></defs>
      <rect width={W} height={H} fill="url(#byebg)" />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(i * 173) % W} cy={(i * 291) % 900 + 200} r={10 + (i % 4) * 6} fill={["#ffd166", "#ff8fab", "#8ecae6", "#b5e48c"][i % 4]} opacity={0.6 + 0.4 * Math.sin(t * 3 + i)} />)}
      <g transform="translate(540 2050) scale(1.6)">
        <Seeker uid="kk7" t={t} look={KID} blink={blinkAt(t, 8)} smile={1} gazeX={0} gazeY={0.1} wide={0.3} rArm={[-150, -30 + wave]} mouthOpen={0.4 * k(t, 29.3, 29.5) * (1 - k(t, 30.2, 30.5))} tilt={3 * Math.sin(t * 2)} />
      </g>
    </g>
  );
};

/* big friendly karaoke captions + cards */
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const L = TL.lines.find((l) => t >= l.start - 0.1 && t <= l.end + 0.35);
  if (!L) return null;
  const toks = L.tokens;
  // show a window of ~6 words around the current word
  const cur = Math.max(0, toks.findIndex((x) => t < x[2]));
  const ci = cur === -1 ? toks.length - 1 : cur;
  const start = Math.floor(ci / 6) * 6, win = toks.slice(start, start + 6);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1560, textAlign: "center" }}>
      <div style={{ display: "inline-block", background: "rgba(255,255,255,0.92)", borderRadius: 34, padding: "16px 30px", boxShadow: "0 10px 30px rgba(0,0,0,0.18)" }}>
        {win.map((w, i) => {
          const on = t >= w[1] && t < w[2] + 0.05, done = t >= w[2];
          return <span key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 62, lineHeight: 1.25, margin: "0 9px", color: on ? "#ff7a00" : done ? "#2b2d42" : "#9aa0b5", display: "inline-block", transform: `scale(${on ? 1.12 : 1})` }}>{w[0]}</span>;
        })}
      </div>
    </div>
  );
};
const Card: React.FC<{ t: number; a: number; b: number; top: number; children: React.ReactNode; bg?: string }> = ({ t, a, b, top, children, bg = "#2e7d5b" }) => {
  const p = pop(t, a, 0.4), o = interp(t, [b - 0.3, b], [1, 0]);
  if (t < a || t > b) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", opacity: o, transform: `scale(${0.6 + 0.4 * p})` }}>
    <div style={{ display: "inline-block", background: bg, color: "#fff", borderRadius: 30, padding: "18px 34px", fontFamily: FONT, fontWeight: 800, fontSize: 50, letterSpacing: "0.02em", boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}>{children}</div></div>;
};

type Shot = { a: number; b: number; r: (t: number) => React.ReactNode };
const SHOTS: Shot[] = [
  { a: 0, b: 4.25, r: (t) => <S_Messy t={t} /> },
  { a: 4.25, b: 7.3, r: (t) => <S_Question t={t} /> },
  { a: 7.3, b: 15.05, r: (t) => <S_Dome t={t} /> },
  { a: 15.05, b: 17.4, r: (t) => <S_Home t={t} /> },
  { a: 17.4, b: 20.1, r: (t) => <S_Pray t={t} /> },
  { a: 20.1, b: 24.25, r: (t) => <S_Jobs t={t} /> },
  { a: 24.25, b: 27.95, r: (t) => <S_Family t={t} /> },
  { a: 27.95, b: 33.3, r: (t) => <S_Bye t={t} /> },
];
const XF = 0.25;

export const KidsAnim1113: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const fade = Math.max(interp(t, [0, 0.3], [1, 0]), interp(t, [KIDS1113_DUR - 0.6, KIDS1113_DUR], [0, 1]));
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {t > 7.0 && t < 15.4 && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img src={staticFile("d1113/dome_k.jpg")} style={{ width: W, height: H, objectFit: "cover", transformOrigin: "50% 40%", transform: `scale(${1 + 0.08 * k(t, 7.0, 15.0)})` }} />
        </AbsoluteFill>
      )}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => {
          if (t < s.a - XF || t > s.b + XF) return null;
          const o = s.a === 0 ? 1 : interp(t, [s.a - XF, s.a + XF], [0, 1]);
          return <g key={i} opacity={o}>{s.r(t)}</g>;
        })}
      </svg>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ background: "#2e7d5b", color: "#fff", borderRadius: 40, padding: "12px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.08em" }}>ISLAM FOR LITTLE ONES · HELP AT HOME</span>
      </div>
      <Card t={t} a={2.75} b={4.2} top={330} bg="#ff7a00">Who can help? You can!</Card>
      <Card t={t} a={7.4} b={15.0} top={300}>Sahih al-Bukhari 676</Card>
      <Card t={t} a={15.3} b={17.4} top={300} bg="#ff7a00">He helped his family!</Card>
      <Card t={t} a={17.6} b={20.0} top={300}>Then he went to pray</Card>
      <Card t={t} a={21.3} b={22.1} top={300} bg="#7b61ff">Tidy your toys</Card>
      <Card t={t} a={22.1} b={22.95} top={300} bg="#ff7a00">Set the table</Card>
      <Card t={t} a={22.95} b={24.2} top={300} bg="#2ec4b6">Fold your clothes</Card>
      <Card t={t} a={24.5} b={27.9} top={300}>A beautiful sunnah</Card>
      <Card t={t} a={28.1} b={33.2} top={300} bg="#ff7a00">Your turn! What will you help with?</Card>
      <Captions t={t} />
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
      {withAudio && <Audio src={staticFile("day1/d1113kids-mix.m4a")} />}
    </AbsoluteFill>
  );
};
