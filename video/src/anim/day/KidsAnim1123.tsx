import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1123kids-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { k } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, Captions, Card, Sparkles, Heart, W, H, rn } from "./AnimKit";

/* Islam for Little Ones · 23 Nov 2026 "Plant a tree!" (Sahih al-Bukhari 2320, Hazrat Anas bin Malik Radi Allahu Anhu:
   when a Muslim plants a tree or sows seeds and a bird, a person or an animal eats from it, it is a charity for him).
   Cast: an ordinary family (kid, mum in hijab, dad) with faces. When he ﷺ is mentioned: the REAL Green Dome photo only
   (Pixabay 112361, DesignwithRiyas). No music. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const KIDS1123_DUR = TL.total;
const FONT = "'Baloo 2', 'Montserrat', sans-serif";
const KID: Look = { kid: true, beard: false, cap: null, top: "#ff7a00", topD: "#d96400", pants: "#2b3a67", shawl: false, hair: "#24170f" };
const MUM: Look = { beard: false, cap: null, hijab: "#7b61ff", top: "#c9bdff", topD: "#a99cf0", shawl: false, long: true, skin: ["#e6bd98", "#cf9d76", "#ad7b55"] };
const DAD: Look = { beard: true, cap: null, top: "#2a9d8f", topD: "#1f7a6f", pants: "#2b2d42", shawl: false, hair: "#1a120c" };

const Garden: React.FC<{ t: number; sky?: string }> = ({ t, sky = "#a2d2ff" }) => (
  <g>
    <defs><linearGradient id={`gd23${sky.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={sky} /><stop offset="100%" stopColor="#e8f7ff" /></linearGradient></defs>
    <rect width={W} height={H} fill={`url(#gd23${sky.slice(1)})`} />
    <circle cx={880} cy={330} r={80} fill="#ffe066" />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={((t * 25 + i * 420) % 1400) - 150} cy={300 + i * 110} rx={110} ry={36} fill="#fff" opacity={0.95} />)}
    <path d="M 0 1180 Q 280 1080 560 1160 T 1080 1120 L 1080 1920 L 0 1920 Z" fill="#9bd77a" />
    <rect y={1480} width={W} height={440} fill="#7cc35a" />
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={30 + i * 110} y={1180} width={20} height={110} rx={6} fill="#f6e7c8" />)}
    <rect x={0} y={1210} width={W} height={14} fill="#f6e7c8" />
    {Array.from({ length: 12 }, (_, i) => { const r = rn(i + 10); return <circle key={i} cx={r() * W} cy={1520 + r() * 380} r={10} fill={i % 2 ? "#ff8fab" : "#ffd23f"} />; })}
  </g>
);
const Seed: React.FC<{ x: number; y: number; s?: number; glow?: number }> = ({ x, y, s = 1, glow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>{glow > 0 && <circle r={46} fill="#fff3a0" opacity={0.5 * glow} />}<ellipse rx={18} ry={26} fill="#8a5232" transform="rotate(25)" /><ellipse cx={-5} cy={-6} rx={6} ry={10} fill="#b5774a" transform="rotate(25)" /></g>
);
/* a tree that grows: g 0 = sprout, 1 = full tree; apples pop with ap 0..1 */
const APPLES = [[-120, -520], [60, -600], [150, -470], [-40, -420], [-170, -390], [110, -360], [0, -560]];
const Tree: React.FC<{ x: number; y: number; g: number; ap?: number; t: number; gone?: number[] }> = ({ x, y, g, ap = 0, t, gone = [] }) => {
  const sway = Math.sin(t * 1.6) * 2 * g;
  if (g <= 0) return null;
  const sprout = g < 0.25;
  return (
    <g transform={`translate(${x} ${y})`}>
      {sprout ? <g transform={`scale(${g * 4})`}><rect x={-4} y={-60} width={8} height={60} fill="#52b788" /><ellipse cx={-18} cy={-58} rx={18} ry={9} fill="#52b788" transform="rotate(-25 -18 -58)" /><ellipse cx={18} cy={-62} rx={18} ry={9} fill="#52b788" transform="rotate(25 18 -62)" /></g> :
        <g transform={`rotate(${sway}) scale(${0.3 + 0.7 * g})`}>
          <path d="M -40 0 L -26 -330 L 26 -330 L 40 0 Z" fill="#8a5232" />
          <path d="M -20 -260 L -110 -380" stroke="#8a5232" strokeWidth={22} strokeLinecap="round" /><path d="M 20 -280 L 110 -400" stroke="#8a5232" strokeWidth={22} strokeLinecap="round" />
          {[[-140, -440, 150], [0, -540, 190], [140, -430, 150], [-60, -380, 140], [80, -380, 130]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? "#40916c" : "#52b788"} />)}
          {APPLES.map(([ax, ay], i) => { const p = Math.min(1, Math.max(0, ap * 8 - i)); return p > 0 && !gone.includes(i) && <g key={i} transform={`translate(${ax} ${ay}) scale(${p})`}><circle r={30} fill="#e63946" /><rect x={-3} y={-40} width={6} height={14} fill="#6b4630" /><ellipse cx={12} cy={-34} rx={11} ry={5} fill="#52b788" /></g>; })}
        </g>}
    </g>
  );
};
const Bird: React.FC<{ x: number; y: number; t: number; s?: number; flip?: boolean; peck?: number }> = ({ x, y, t, s = 1, flip, peck = 0 }) => {
  const flap = Math.sin(t * 14) * 18 * (1 - peck);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s},${s}) rotate(${peck * 25})`}>
      <ellipse rx={40} ry={28} fill="#3a86ff" /><circle cx={32} cy={-18} r={20} fill="#3a86ff" /><circle cx={38} cy={-22} r={5} fill="#fff" /><circle cx={39} cy={-22} r={2.5} fill="#222" />
      <path d="M 50 -18 L 70 -12 L 50 -8 Z" fill="#ffbe0b" />
      <path d={`M -10 -10 Q -30 ${-50 - flap} -50 ${-20 - flap / 2} Q -30 -5 -10 -10 Z`} fill="#2a6ad6" />
      <path d="M -40 0 L -64 -8 L -60 12 Z" fill="#2a6ad6" />
    </g>
  );
};
const Goat: React.FC<{ x: number; y: number; t: number; s?: number; walk?: number; chew?: number }> = ({ x, y, t, s = 1, walk = 0, chew = 0 }) => {
  const g = Math.sin(t * 10) * 16 * walk;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-60, -30, 30, 60].map((lx, i) => <rect key={i} x={lx - 8} y={-80} width={16} height={80} rx={6} fill="#6d5a4a" transform={`rotate(${i % 2 ? g : -g} ${lx} -80)`} />)}
      <ellipse cy={-110} rx={100} ry={50} fill="#f1ece2" />
      <g transform={`translate(-100 ${-140 + chew * 30 + 4 * Math.sin(t * 12) * chew})`}>
        <ellipse rx={34} ry={42} fill="#f1ece2" /><path d="M -10 -36 Q -30 -80 -40 -70" stroke="#a08c6a" strokeWidth={8} fill="none" /><path d="M 10 -36 Q 0 -80 -8 -76" stroke="#a08c6a" strokeWidth={8} fill="none" />
        <circle cx={-14} cy={-6} r={5} fill="#222" /><path d="M -10 40 L -4 64 L 4 40 Z" fill="#cfc6b4" /><ellipse cx={30} cy={-14} rx={20} ry={8} fill="#e2d8c6" />
      </g>
      <path d="M 100 -120 L 120 -140" stroke="#f1ece2" strokeWidth={10} strokeLinecap="round" />
    </g>
  );
};

/* L0: the kid shows a tiny seed in an open palm; it glows; a "?" on "become" */
const S_Seed: React.FC<{ t: number }> = ({ t }) => {
  const sd = wt(0, "seed"), q = pop(t, wt(0, "become") - 0.2);
  return (
    <g>
      <Garden t={t} />
      <g transform="translate(420 1650) scale(0.95)"><Seeker uid="k23a" t={t} look={KID} blink={blinkAt(t, 1)} smile={0.9} wide={0.3} gazeX={0.6} gazeY={-0.2} rArm={t > sd - 0.4 ? [-90, 10] : [-6, 8]} lArm={[-6, 8]} /></g>
      {t > sd - 0.4 && <g><Seed x={922} y={1172 + 4 * Math.sin(t * 4)} s={1.3 * pop(t, sd - 0.4)} glow={0.6 + 0.4 * Math.sin(t * 5)} /></g>}
      {pop(t, sd) > 0 && <g transform={`translate(760 820) scale(${pop(t, sd)})`}><rect x={-150} y={-56} width={300} height={100} rx={46} fill="#fff" stroke="#8a5232" strokeWidth={6} /><text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#8a5232">A SEED!</text></g>}
      {q > 0 && <text x={360} y={700 - 10 * Math.sin(t * 3)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170 * q} fill="#ff7a00">?</text>}
    </g>
  );
};
/* L1: the real Green Dome photo underneath, soft light + birds on top */
const BIRDS = Array.from({ length: 7 }, (_, i) => ({ y: 260 + i * 55, sp: 90 + i * 12, ph: i * 0.9, s: 0.7 + (i % 3) * 0.2 }));
const S_Dome: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${100 + i * 120} -40 L ${170 + i * 120} -40 L ${260 + i * 130} 1920 L ${40 + i * 110} 1920 Z`} fill="#fff6d0" opacity={0.05 + 0.04 * Math.sin(t * 1.5 + i)} />)}
    {BIRDS.map((b, i) => { const x = ((t - 3) * b.sp + i * 160) % 1300 - 100, flap = Math.sin(t * 9 + b.ph) * 12; return <path key={i} transform={`translate(${x} ${b.y + Math.sin(t + i) * 10}) scale(${b.s})`} d={`M -24 ${flap} Q -12 -6 0 0 Q 12 -6 24 ${flap}`} stroke="#3a3a3a" strokeWidth={5} fill="none" strokeLinecap="round" />; })}
  </g>
);
/* L2: dig a hole with a little spade, drop the seed in, pat the soil over it; Mum kneels nearby smiling */
const S_Plant: React.FC<{ t: number }> = ({ t }) => {
  const dg = wt(2, "dig"), dr = wt(2, "drop"), cv = wt(2, "cover");
  const digging = t > dg - 0.2 && t < dr - 0.2 ? Math.sin(t * 12) : 0;
  const hole = k(t, dg, dr - 0.2), fall = k(t, dr - 0.1, dr + 0.4), mound = k(t, cv - 0.1, cv + 0.5);
  return (
    <g>
      <Garden t={t} />
      <ellipse cx={600} cy={1560} rx={120 * hole} ry={34 * hole} fill="#5a3824" />
      {fall > 0 && fall < 1 && <Seed x={600} y={interp(fall, [0, 1], [1220, 1555])} s={0.9} />}
      {mound > 0 && <path d={`M 470 1565 Q 600 ${1565 - 70 * mound} 730 1565 Z`} fill="#8a5a36" />}
      {Array.from({ length: 6 }, (_, i) => { const d = (t * 2 + i / 6) % 1; return digging !== 0 && <circle key={i} cx={560 + i * 14 + d * 160 * (i % 2 ? 1 : -1)} cy={1540 - Math.sin(d * Math.PI) * 140} r={9} fill="#7a4a2a" />; })}
      <g transform="translate(400 1700) scale(0.82)"><Seeker uid="k23b" t={t} look={KID} blink={blinkAt(t, 2)} smile={0.9} gazeX={0.6} gazeY={0.6} nod={-10} rArm={[10 + 30 * digging, 60 + 20 * digging]} lArm={[-6, 8]} /></g>
      {t < cv + 0.2 && <g transform={`translate(${520 + 10 * digging} ${1480 + 20 * digging}) rotate(${30 + 20 * digging})`}><rect x={-6} y={-120} width={12} height={110} rx={6} fill="#8a5232" /><path d="M -30 -10 L 30 -10 L 20 50 Q 0 70 -20 50 Z" fill="#9aa0ad" /></g>}
      <g transform="translate(850 1700) scale(0.85)"><Seeker uid="m23a" t={t} look={MUM} blink={blinkAt(t, 3)} smile={0.9} gazeX={-0.7} gazeY={0.5} lArm={t > cv ? [-40, 40] : [-6, 8]} rArm={[-6, 8]} /></g>
      {pop(t, wt(2, "plant") - 0.2) > 0 && t < dg && <text x={540} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100 * pop(t, wt(2, "plant") - 0.2)} fill="#2e7d5b">LET'S PLANT!</text>}
      <Sparkles t={t} at={cv + 0.4} cx={600} cy={1520} n={10} />
    </g>
  );
};
/* L3: a watering can tilts and pours on "splash"; days pass (sun up/down, a counter) and a sprout appears */
const S_Water: React.FC<{ t: number }> = ({ t }) => {
  const sp = wt(3, "splash"), ev = wt(3, "every");
  const tilt = k(t, sp - 0.3, sp), days = Math.max(0, Math.min(5, Math.floor((t - ev) / 0.35) + 1));
  const sprout = Math.min(0.24, 0.06 + 0.035 * days);
  return (
    <g>
      <Garden t={t} sky={days % 2 ? "#a2d2ff" : "#bde0fe"} />
      <path d="M 470 1565 Q 600 1495 730 1565 Z" fill="#8a5a36" />
      <Tree x={600} y={1530} g={sprout} t={t} />
      <g transform="translate(330 1700) scale(0.82)"><Seeker uid="k23c" t={t} look={KID} blink={blinkAt(t, 4)} smile={1} gazeX={0.6} gazeY={0.4} rArm={[-60, 10]} lArm={[-6, 8]} /></g>
      <g transform={`translate(520 1250) rotate(${40 * tilt})`}><path d="M -70 -60 L 60 -60 L 50 40 L -60 40 Z" fill="#2ec4b6" /><path d="M 60 -40 L 140 -90 L 146 -78 L 60 -20 Z" fill="#2ec4b6" /><path d="M -70 -50 Q -120 -10 -70 30" stroke="#22a396" strokeWidth={12} fill="none" /></g>
      {tilt > 0.5 && Array.from({ length: 12 }, (_, i) => { const d = ((t * 2.2) + i / 12) % 1; return <path key={i} transform={`translate(${620 + (i % 4) * 8 - d * 20} ${1210 + d * 330})`} d="M 0 -14 Q 9 0 0 7 Q -9 0 0 -14 Z" fill="#4cc9f0" opacity={1 - d * 0.6} />; })}
      {t > sp && t < sp + 1.4 && <text x={780} y={1000} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill="#4cc9f0" opacity={1 - (t - sp) / 1.4}>SPLASH!</text>}
      {days > 0 && <g transform="translate(830 700)"><rect x={-160} y={-70} width={320} height={130} rx={40} fill="#fff" stroke="#2e7d5b" strokeWidth={6} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#2e7d5b">DAY {days}</text></g>}
    </g>
  );
};
/* L4: the sprout shoots up into a big tree; apples pop on "apples"; the kid jumps */
const S_Grow: React.FC<{ t: number }> = ({ t }) => {
  const a = L(4).start, gr = wt(4, "grew"), ap = wt(4, "apples");
  const g = 0.25 + 0.75 * k(t, gr - 0.3, gr + 0.9), apl = k(t, ap - 0.3, ap + 0.6);
  const jump = t > ap ? Math.abs(Math.sin((t - ap) * 9)) * 40 * (1 - k(t, ap + 1, ap + 1.6)) : 0;
  return (
    <g>
      <Garden t={t} />
      <Tree x={640} y={1540} g={g} ap={apl} t={t} />
      <g transform={`translate(250 ${1700 - jump}) scale(0.82)`}><Seeker uid="k23d" t={t} look={KID} blink={blinkAt(t, 5)} smile={1} wide={0.5 * k(t, a, a + 0.4)} gazeX={0.7} gazeY={-0.6} rArm={[-150, -30]} lArm={t > ap ? [-150, -30] : [-6, 8]} /></g>
      {t > a && t < a + 1.2 && <text x={300} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110 * pop(t, a)} fill="#ff7a00">WOW!</text>}
      <Sparkles t={t} at={ap} cx={640} cy={1050} n={14} />
    </g>
  );
};
/* L5: a bird flies in and pecks an apple; a goat trots in and munches a fallen one; a "+1 good deed" star pops each time */
const S_Eat: React.FC<{ t: number }> = ({ t }) => {
  const bd = wt(5, "bird"), gt = wt(5, "goat"), dd = wt(5, "deed");
  const fly = k(t, bd - 0.6, bd + 0.4), peck = t > bd + 0.4 ? Math.abs(Math.sin((t - bd) * 10)) : 0;
  const goatIn = k(t, gt - 0.9, gt + 0.1), fallA = k(t, gt - 0.9, gt - 0.4);
  const T = { x: 640, y: 1540 }; /* apple 2 at tree-space (150,-470) -> screen */
  const ax = T.x + 150, ay = T.y - 470;
  return (
    <g>
      <Garden t={t} />
      <Tree x={T.x} y={T.y} g={1} ap={1} t={t} gone={[2, 5]} />
      <g transform={`translate(${ax} ${ay})`}><circle r={30} fill="#e63946" /><path d={`M 18 -10 A 30 30 0 0 1 22 18 L 10 8 Z`} fill="#fff1d6" opacity={peck > 0 ? 1 : 0} /></g>
      <Bird t={t} x={interp(fly, [0, 1], [1200, ax + 70])} y={interp(fly, [0, 1], [500, ay - 20])} s={1.1} flip peck={peck} />
      {fallA > 0 && <g transform={`translate(${T.x + 110} ${interp(fallA, [0, 1], [T.y - 360, T.y + 60])})`}><circle r={30} fill="#e63946" opacity={t > gt + 1.2 ? 0 : 1} /></g>}
      <Goat t={t} x={interp(goatIn, [0, 1], [-200, T.x + 260])} y={T.y - 30} s={0.9} walk={goatIn > 0 && goatIn < 1 ? 1 : 0} chew={goatIn >= 1 ? 1 : 0} />
      <g transform="translate(180 1720) scale(0.72)"><Seeker uid="k23e" t={t} look={KID} blink={blinkAt(t, 6)} smile={1} gazeX={0.8} gazeY={-0.3} lArm={[-6, 8]} rArm={t > dd - 0.3 ? [-150, -30 + 14 * Math.sin(t * 8)] : [-6, 8]} /></g>
      {[bd + 0.5, gt + 0.3].map((x, i) => { const p = pop(t, x); return p > 0 && <g key={i} transform={`translate(${[ax, T.x + 160][i]} ${[ay - 140, T.y - 120][i] - (t - x) * 60}) scale(${p})`} opacity={Math.max(0, 1 - (t - x) / 2.5)}><path d="M 0 -50 L 14 -16 L 50 -14 L 22 8 L 32 44 L 0 24 L -32 44 L -22 8 L -50 -14 L -14 -16 Z" fill="#ffd23f" /><text x={70} y={14} fontFamily={FONT} fontWeight={900} fontSize={44} fill="#2e7d5b">+1</text></g>; })}
      {t > bd + 0.5 && t < bd + 1.5 && <text x={ax - 40} y={ay - 200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#3a86ff">TWEET!</text>}
      {Array.from({ length: 8 }, (_, i) => { const d = t - dd - i * 0.2; return d > 0 && <Heart key={i} x={540 + (i - 3.5) * 70} y={900 - d * 220} s={0.6} o={Math.max(0, 1 - d / 1.8)} />; })}
    </g>
  );
};
/* L6: the kid holds a little potted plant, Dad beside; the kid waves goodbye (plain linear sky, nothing round behind heads) */
const S_Bye: React.FC<{ t: number }> = ({ t }) => {
  const wave = Math.sin(t * 8) * 18, gr = wt(6, "grownup");
  return (
    <g>
      <defs><linearGradient id="bye23" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#caf0f8" /><stop offset="100%" stopColor="#e9ffe0" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#bye23)" />
      {Array.from({ length: 14 }, (_, i) => { const r = rn(i + 260); const y = ((1900 - (t * (50 + r() * 60) + r() * 1900)) % 1900 + 1900) % 1900; return <path key={i} transform={`translate(${r() * W} ${y}) rotate(${t * 40 + i * 30}) scale(${0.6 + r() * 0.6})`} d="M 0 -18 Q 14 0 0 18 Q -14 0 0 -18 Z" fill={i % 2 ? "#52b788" : "#95d5b2"} opacity={0.6} />; })}
      <rect y={1600} width={W} height={320} fill="#9bd77a" />
      <g transform="translate(230 1760) scale(1.0)"><Seeker uid="d23a" t={t} look={DAD} blink={blinkAt(t, 9)} smile={0.9} gazeX={0.6} lArm={t > gr - 0.4 ? [-40, 40] : [-6, 8]} rArm={[-6, 8]} /></g>
      <g transform="translate(640 1900) scale(1.15)"><Seeker uid="by23" t={t} look={KID} blink={blinkAt(t, 10)} smile={1} wide={0.3} rArm={[-150, -30 + wave]} lArm={[-6, 8]} tilt={3 * Math.sin(t * 2)} /></g>
      <g transform="translate(940 1560)"><path d="M -60 0 L 60 0 L 46 110 L -46 110 Z" fill="#e76f51" /><Tree x={0} y={0} g={0.2} t={t} /></g>
      {pop(t, gr - 0.2) > 0 && <g transform={`translate(540 760) scale(${pop(t, gr - 0.2)})`}><rect x={-300} y={-70} width={600} height={130} rx={60} fill="#fff" stroke="#2e7d5b" strokeWidth={8} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#2e7d5b">Ask your grown-up!</text></g>}
    </g>
  );
};

export const KidsAnim1123: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Seed t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Dome t={t} /> },
    { a: b(1), b: b(2), r: (t) => <S_Plant t={t} /> },
    { a: b(2), b: b(3), r: (t) => <S_Water t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Grow t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Eat t={t} /> },
    { a: b(5), b: KIDS1123_DUR + 1, r: (t) => <S_Bye t={t} /> },
  ];
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [KIDS1123_DUR - 0.6, KIDS1123_DUR], [0, 1]));
  const domeA = b(0), domeB = b(1);
  const dip = Math.max(0, ...[b(0), b(1)].map((x) => 1 - Math.abs(t - x) / 0.18));
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {t >= domeA && t < domeB && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img src={staticFile("d1115/dome_k.jpg")} style={{ width: W, height: H, objectFit: "cover", transformOrigin: "50% 70%", transform: `scale(${1.02 + 0.1 * k(t, domeA, domeB)})` }} />
        </AbsoluteFill>
      )}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => (t >= s.a && t < s.b ? <g key={i}>{s.r(t)}</g> : null))}
      </svg>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ background: "#2e7d5b", color: "#fff", borderRadius: 40, padding: "12px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.08em" }}>ISLAM FOR LITTLE ONES · PLANT A TREE</span>
      </div>
      <Card font={FONT} t={t} a={wt(0, "seed")} b={b(0)} top={300} bg="#8a5232">A tiny seed…</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.3} b={b(1)} top={300}>Sahih al-Bukhari 2320</Card>
      <Card font={FONT} t={t} a={wt(1, "charity")} b={b(1)} top={420} bg="#ff7a00" size={44}>Someone eats = sadaqah for you!</Card>
      <Card font={FONT} t={t} a={L(2).start + 0.3} b={b(2)} top={300} bg="#8a5232">1 · Dig, drop, cover</Card>
      <Card font={FONT} t={t} a={L(3).start} b={b(3)} top={300} bg="#2ec4b6">2 · Water it every day</Card>
      <Card font={FONT} t={t} a={L(4).start + 0.3} b={b(4)} top={300} bg="#e63946">3 · A big apple tree!</Card>
      <Card font={FONT} t={t} a={wt(5, "each")} b={b(5)} top={300} bg="#2e7d5b" size={44}>Each bite = a good deed!</Card>
      <Card font={FONT} t={t} a={L(6).start} b={KIDS1123_DUR} top={300} bg="#ff7a00">Your turn! Plant something</Card>
      <Captions t={t} TL={TL} font={FONT} hi="#ff7a00" base="#9aa0b5" done="#2b2d42" bg="rgba(255,255,255,0.92)" size={62} />
      <AbsoluteFill style={{ background: "#fff6e8", opacity: Math.max(0, ...[b(2), b(3), b(4), b(5)].map((x) => 1 - Math.abs(t - x) / 0.16)) }} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fade, dip) }} />
      {withAudio && <Audio src={staticFile("day1/d1123kids-mix.m4a")} />}
    </AbsoluteFill>
  );
};
