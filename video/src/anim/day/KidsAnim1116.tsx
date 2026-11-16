import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1116kids-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { k } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, lin, Captions, Card, Sparkles, Heart, W, H, rn } from "./AnimKit";

/* Islam for Little Ones · 16 Nov 2026 "Gentle hands!" (Sahih Muslim 2593, Hazrat Aisha Radi Allahu Anha:
   Allah is gentle (Rafiq) and loves gentleness, and gives for gentleness what He does not give for harshness).
   Cast: an ordinary family (kid, little sister in hijab, mum in hijab) with faces + a kitten. When he ﷺ is mentioned:
   the REAL Green Dome photo only (Pixabay 198164, muhammadarhamamin77800). No music. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const KIDS1116_DUR = TL.total;
const FONT = "'Baloo 2', 'Montserrat', sans-serif";
const KID: Look = { kid: true, beard: false, cap: null, top: "#3a86ff", topD: "#2a6ad6", pants: "#2b3a67", shawl: false, hair: "#24170f" };
const SIS: Look = { kid: true, beard: false, cap: null, hijab: "#ff70a6", top: "#ffd6e7", topD: "#f5b3cf", shawl: false, long: true, skin: ["#f0c9a4", "#d9a982", "#b8865f"] };
const MUM: Look = { beard: false, cap: null, hijab: "#2ec4b6", top: "#a8e6df", topD: "#86cfc6", shawl: false, long: true, skin: ["#e6bd98", "#cf9d76", "#ad7b55"] };

/* the kitten: origin = between the paws on the floor. scared 0..1 (arched + puffed), happy 0..1 (eyes closed, purring) */
const Kitty: React.FC<{ t: number; x: number; y: number; s?: number; scared?: number; happy?: number; flip?: boolean }> = ({ t, x, y, s = 1, scared = 0, happy = 0, flip }) => {
  const arch = 40 * scared, puff = 1 + 0.18 * scared, purr = happy * Math.sin(t * 30) * 1.5;
  const tail = Math.sin(t * (2 + 6 * scared)) * (18 - 10 * scared);
  const eyeR = 9 + 6 * scared;
  return (
    <g transform={`translate(${x} ${y + purr}) scale(${flip ? -s : s},${s})`}>
      <path d={`M 70 -60 Q ${140 + tail} ${-150 - 40 * scared} ${110 + tail * 2} ${-230 - 30 * scared}`} stroke="#f4a259" strokeWidth={26 * puff} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-70 - arch} rx={110 * puff} ry={(62 + arch * 0.4) * puff} fill="#f4a259" />
      {[-30, 10, 50].map((sx, i) => <path key={i} d={`M ${sx} ${-120 - arch} q 10 20 0 40`} stroke="#d9823c" strokeWidth={8} fill="none" />)}
      {[-70, -30, 40, 80].map((lx, i) => <rect key={i} x={lx - 14} y={-60 - arch * (i % 3 === 0 ? 0.3 : 0.6)} width={28} height={60 + arch * (i % 3 === 0 ? 0.3 : 0.6)} rx={14} fill="#f4a259" />)}
      <g transform={`translate(-110 ${-130 - arch * 0.6}) rotate(${-8 * scared + 4 * happy * Math.sin(t * 2)})`}>
        <path d="M -55 -30 L -45 -95 L -12 -55 Z" fill="#f4a259" /><path d="M 55 -30 L 45 -95 L 12 -55 Z" fill="#f4a259" />
        <path d="M -46 -40 L -42 -80 L -22 -55 Z" fill="#ffb3c1" /><path d="M 46 -40 L 42 -80 L 22 -55 Z" fill="#ffb3c1" />
        <circle r={66 * (1 + 0.06 * scared)} fill="#f4a259" />
        <ellipse cx={0} cy={22} rx={34} ry={24} fill="#fde2c2" />
        {happy > 0.5
          ? <><path d="M -36 -8 q 12 -12 24 0" stroke="#3a2414" strokeWidth={6} fill="none" strokeLinecap="round" /><path d="M 12 -8 q 12 -12 24 0" stroke="#3a2414" strokeWidth={6} fill="none" strokeLinecap="round" /></>
          : <><circle cx={-24} cy={-8} r={eyeR} fill="#2b2d42" /><circle cx={24} cy={-8} r={eyeR} fill="#2b2d42" /><circle cx={-21} cy={-12} r={3} fill="#fff" /><circle cx={27} cy={-12} r={3} fill="#fff" /></>}
        <path d="M -7 12 L 7 12 L 0 20 Z" fill="#ff8fab" />
        <path d={scared > 0.5 ? "M -14 34 Q 0 24 14 34" : "M -14 28 Q -7 36 0 28 Q 7 36 14 28"} stroke="#3a2414" strokeWidth={4} fill="none" />
        {[-1, 1].map((d) => [0, 12].map((o) => <line key={`${d}${o}`} x1={d * 30} y1={18 + o} x2={d * 80} y2={10 + o * 1.6} stroke="#fff" strokeWidth={3} />))}
      </g>
    </g>
  );
};
const Room: React.FC<{ t: number; tint?: string }> = ({ t, tint = "#fff1d6" }) => (
  <g>
    <rect width={W} height={H} fill={tint} />
    <rect x={120} y={380} width={360} height={400} rx={20} fill="#bde0fe" stroke="#fff" strokeWidth={18} />
    <circle cx={390} cy={480} r={46} fill="#ffe066" opacity={0.9} />
    {[0, 1].map((i) => <ellipse key={i} cx={((t * 20 + i * 200) % 460) + 120} cy={560 + i * 80} rx={60} ry={22} fill="#fff" opacity={0.9} />)}
    <rect x={640} y={420} width={300} height={200} rx={14} fill="#ffd6a5" stroke="#e09f5a" strokeWidth={10} />
    <path d="M 690 580 L 760 500 L 810 550 L 850 510 L 900 580 Z" fill="#7bd389" />
    <rect y={1480} width={W} height={440} fill="#f0c48a" />
    <ellipse cx={560} cy={1640} rx={420} ry={70} fill="#e76f51" opacity={0.35} />
  </g>
);
const Block: React.FC<{ x: number; y: number; c: string; p?: number; r?: number }> = ({ x, y, c, p = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${p})`}><rect x={-60} y={-90} width={120} height={90} rx={12} fill={c} /><rect x={-60} y={-90} width={120} height={16} rx={8} fill="#ffffff55" /><circle cx={0} cy={-45} r={16} fill="#ffffff66" /></g>
);
const COLS = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff924c", "#2ec4b6"];

/* L0: the kid runs in grabbing at the kitten; it arches, puffs up and leaps onto the sofa */
const S_Rough: React.FC<{ t: number }> = ({ t }) => {
  const a = L(0).start, slow = wt(0, "slow"), sc = wt(0, "scared");
  const run = 1 - k(t, a, slow + 0.2);
  const kx = interp(k(t, a, slow + 0.2), [0, 1], [-60, 380]);
  const fright = k(t, slow - 0.3, slow);
  const jump = k(t, sc, sc + 0.6);
  const cx = interp(jump, [0, 1], [700, 860]), cy = interp(jump, [0, 1], [1500, 1270]) - 220 * Math.sin(jump * Math.PI);
  const grab = Math.sin(t * 9) * 25 * (1 - jump * 0.5);
  return (
    <g>
      <Room t={t} />
      <rect x={720} y={1180} width={360} height={140} rx={40} fill="#e76f51" /><rect x={700} y={1280} width={400} height={210} rx={40} fill="#d65a3c" />
      <g transform={`translate(${kx} ${1650 - Math.abs(Math.sin(t * 12)) * 30 * run}) scale(0.8)`}>
        <Seeker uid="k16a" t={t} look={KID} blink={blinkAt(t, 1)} smile={0.9 - 0.9 * jump} wide={0.5} brow={jump * -0.2} gazeX={0.8} mouthOpen={0.35 * run}
          rArm={[-80 + grab, -10]} lArm={[-70 - grab, -10]} />
      </g>
      <Kitty t={t} x={cx} y={cy} s={0.85} scared={fright} />
      {fright > 0.5 && jump < 0.5 && <text x={760} y={1120} fontFamily={FONT} fontWeight={900} fontSize={110 * pop(t, slow)} fill="#e5383b" textAnchor="middle">!!</text>}
      {t > slow && <g opacity={1 - lin(t, slow + 1.2, slow + 1.6)} transform={`translate(330 760) scale(${pop(t, slow)})`}><rect x={-180} y={-70} width={360} height={130} rx={60} fill="#fff" stroke="#e5383b" strokeWidth={8} /><text y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#e5383b">SLOW!</text></g>}
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

/* L2: soft and slow: the kid strokes the kitten gently; it closes its eyes and purrs, hearts float */
const S_Gentle: React.FC<{ t: number }> = ({ t }) => {
  const soft = wt(2, "soft"), happyT = wt(2, "happy");
  const stroke = Math.sin((t - soft) * 2.6);
  const calm = k(t, L(2).start, soft + 0.4), happy = k(t, happyT - 0.3, happyT);
  return (
    <g>
      <Room t={t} />
      <g transform="translate(420 1650) scale(0.8)">
        <Seeker uid="k16b" t={t} look={KID} blink={blinkAt(t, 2)} smile={0.7 + 0.3 * happy} closed={0.25} gazeX={0.7} gazeY={0.6} nod={6}
          rArm={[-40 + 10 * stroke * calm, 20 + 8 * stroke]} lArm={[-6, 8]} />
      </g>
      <Kitty t={t} x={720} y={1520} s={0.85} scared={0.6 * (1 - calm)} happy={happy} flip />
      {happy > 0 && <text x={850} y={1150 - 10 * Math.sin(t * 3)} fontFamily={FONT} fontWeight={800} fontSize={56} fill="#e09f5a" opacity={happy}>purr…</text>}
      {Array.from({ length: 6 }, (_, i) => { const d = t - happyT - i * 0.3; return d > 0 && <Heart key={i} x={700 + (i - 2.5) * 50} y={1180 - d * 220} s={0.55} o={Math.max(0, 1 - d / 1.6)} />; })}
      {[0, 1].map((i) => { const at = wt(2, i ? "slow" : "soft"); const p = pop(t, at); return p > 0 && <text key={i} x={i ? 760 : 300} y={800} fontFamily={FONT} fontWeight={900} fontSize={96 * p} fill={i ? "#2ec4b6" : "#ff70a6"} textAnchor="middle" opacity={1 - lin(t, at + 1, at + 1.4)}>{i ? "SLOW" : "SOFT"}</text>; })}
    </g>
  );
};

/* L3: little sister's block tower: the kid stops before knocking it, then helps it grow higher */
const S_Tower: React.FC<{ t: number }> = ({ t }) => {
  const a = L(3).start, dont = wt(3, "don"), help = wt(3, "help"), hi = wt(3, "higher");
  const come = k(t, a - 0.2, dont);
  const stop = t > dont - 0.1;
  const kx = interp(come, [0, 1], [1000, 760]);
  const base = 3, extra = (t > help ? 1 : 0) + (t > help + 0.5 ? 1 : 0) + (t > hi ? 1 : 0) + (t > hi + 0.35 ? 1 : 0);
  const wob = stop ? 0 : Math.sin(t * 8) * 4 * come;
  const cheer = t > hi + 0.3;
  return (
    <g>
      <Room t={t} tint="#eaf4ff" />
      {Array.from({ length: base + extra }, (_, i) => { const at = i < base ? -1 : [help, help + 0.5, hi, hi + 0.35][i - base]; const p = i < base ? 1 : pop(t, at); return <Block key={i} x={540 + (i % 2 ? 6 : -6)} y={1480 - i * 92} c={COLS[i % COLS.length]} p={p} r={i < base ? wob : 0} />; })}
      <g transform={`translate(270 ${1650 - (cheer ? Math.abs(Math.sin(t * 8)) * 22 : 0)}) scale(0.6)`}>
        <Seeker uid="s16a" t={t} look={SIS} blink={blinkAt(t, 3)} smile={cheer ? 1 : stop ? 0.6 : 0.2} brow={stop ? 0.3 : -0.4} wide={stop && !cheer ? 0 : 0.3 * (1 - come)} gazeX={0.6}
          rArm={cheer ? [-150, -30] : [-40, 40]} lArm={cheer ? [-150, -30] : [-6, 8]} />
      </g>
      <g transform={`translate(${kx} ${1650 - Math.abs(Math.sin(t * 11)) * 20 * (1 - (stop ? 1 : 0))}) scale(0.8)`}>
        <Seeker uid="k16c" t={t} look={KID} blink={blinkAt(t, 4)} smile={stop ? 0.9 : 0.5} wide={stop && t < help ? 0.6 : 0} brow={stop ? 0.5 : 0} gazeX={-0.8}
          lArm={t > help - 0.2 ? [-55 + 10 * Math.sin(t * 5), -10] : [-6, 8]} rArm={[-6, 8]} />
      </g>
      {stop && t < help && <g transform={`translate(760 820) scale(${pop(t, dont)})`}><circle r={90} fill="#fff" stroke="#e5383b" strokeWidth={14} /><path d="M -60 60 L 60 -60" stroke="#e5383b" strokeWidth={14} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#2b2d42">BOOM</text></g>}
      {t > hi && <g transform={`translate(540 ${1480 - (base + extra) * 92 - 60})`}><text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80 * pop(t, hi)} fill="#ff7a00">↑ HIGHER!</text></g>}
      <Sparkles t={t} at={hi + 0.4} cx={540} cy={900} n={14} />
    </g>
  );
};

/* L4: closing the door softly ("shh"), then passing a plate gently to Mum */
const S_Soft: React.FC<{ t: number }> = ({ t }) => {
  const a = L(4).start, plateT = wt(4, "plate"), bang = wt(4, "banging");
  const doorClose = k(t, a, plateT - 0.2);
  const doorPart = t < plateT - 0.15;
  const pass = k(t, wt(4, "gently") - 0.4, wt(4, "gently") + 0.6);
  return (
    <g>
      <Room t={t} tint="#fff6e8" />
      {doorPart ? (
        <g>
          <rect x={480} y={700} width={460} height={790} fill="#5a3824" />
          <g transform={`translate(480 700) scale(${interp(doorClose, [0, 1], [0.35, 1])},1)`}><rect width={460} height={790} fill="#9c6236" /><rect x={30} y={30} width={400} height={330} rx={14} fill="#b0763f" /><rect x={30} y={420} width={400} height={330} rx={14} fill="#b0763f" /><circle cx={410} cy={420} r={18} fill="#ffd23f" /></g>
          <g transform="translate(300 1650) scale(0.8)">
            <Seeker uid="k16d" t={t} look={KID} blink={blinkAt(t, 5)} smile={0.6} closed={0.2} gazeX={0.8} rArm={[-80 + 30 * doorClose, -10]} lArm={[-6, 8]} />
          </g>
          <text x={150} y={820 - 6 * Math.sin(t * 3)} fontFamily={FONT} fontWeight={900} fontSize={80 * pop(t, a + 0.2)} fill="#2ec4b6">shh…</text>
        </g>
      ) : (
        <g>
          <rect x={80} y={1300} width={920} height={40} rx={10} fill="#a5673f" /><rect x={120} y={1340} width={30} height={160} fill="#8a5232" /><rect x={930} y={1340} width={30} height={160} fill="#8a5232" />
          <g transform="translate(300 1650) scale(0.8)">
            <Seeker uid="k16e" t={t} look={KID} blink={blinkAt(t, 6)} smile={0.8} gazeX={0.8} gazeY={0.2} rArm={[-45 + 10 * pass, -10]} lArm={[-6, 8]} />
          </g>
          <g transform="translate(800 1650) scale(0.92)">
            <Seeker uid="m16a" t={t} look={MUM} blink={blinkAt(t, 7)} smile={0.5 + 0.5 * pass} gazeX={-0.7} gazeY={0.2} lArm={[-35 * pass - 6, 8]} rArm={[-6, 8]} />
          </g>
          <g transform={`translate(${interp(pass, [0, 1], [450, 640])} ${1285 - 30 * Math.sin(pass * Math.PI)})`}><ellipse rx={110} ry={30} fill="#fff" stroke="#cfd8e6" strokeWidth={6} /><ellipse rx={70} ry={16} fill="#eef3fa" /><circle cx={-20} cy={-14} r={18} fill="#ff6b6b" /><circle cx={16} cy={-12} r={16} fill="#8ac926" /></g>
          {t > bang - 0.1 && <g transform={`translate(540 860) scale(${pop(t, bang - 0.1)})`} opacity={1 - lin(t, bang + 1.2, bang + 1.6)}><text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#2b2d42">BANG!</text><path d="M -220 40 L 220 -90" stroke="#e5383b" strokeWidth={20} strokeLinecap="round" /></g>}
        </g>
      )}
    </g>
  );
};

/* L5: gentleness brings so much good: the family + kitten together, hearts and stars shower down */
const S_Good: React.FC<{ t: number }> = ({ t }) => {
  const g = wt(5, "good");
  return (
    <g>
      <defs><linearGradient id="gd16" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8fd3ff" /><stop offset="100%" stopColor="#fff1d6" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#gd16)" />
      <rect y={1480} width={W} height={440} fill="#9bd77a" />
      {[{ x: 250, l: MUM, s: 0.86, u: "m" }, { x: 520, l: KID, s: 0.76, u: "k" }, { x: 760, l: SIS, s: 0.6, u: "s" }].map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${1650 - Math.abs(Math.sin(t * 6 + i)) * 10}) scale(${p.s})`}><Seeker uid={`g16${p.u}`} t={t} look={p.l} blink={blinkAt(t, 10 + i)} smile={1} gazeX={(1 - i) * 0.3} lArm={[-20, 30]} rArm={[-20, 30]} /></g>
      ))}
      <Kitty t={t} x={930} y={1560} s={0.6} happy={1} flip />
      {Array.from({ length: 16 }, (_, i) => { const r = rn(i + 90), at = g - 0.4 + i * 0.12, d = t - at; if (d <= 0) return null; const x = 80 + r() * 920, y = -60 + d * (260 + r() * 120);
        return i % 2 ? <Heart key={i} x={x} y={y} s={0.5 + r() * 0.5} o={Math.max(0, 1 - d / 3)} c={i % 4 === 1 ? "#ff5a7a" : "#ff8fab"} /> : <path key={i} transform={`translate(${x} ${y}) rotate(${d * 90}) scale(${0.8 + r()})`} d="M 0 -26 L 8 -8 L 26 -6 L 12 6 L 16 26 L 0 15 L -16 26 L -12 6 L -26 -6 L -8 -8 Z" fill="#ffd23f" opacity={Math.max(0, 1 - d / 3)} />; })}
      <Sparkles t={t} at={g} cx={540} cy={900} n={16} />
    </g>
  );
};

/* L6: goodbye wave with the kitten (plain linear sky, nothing round behind the head) */
const S_Bye: React.FC<{ t: number }> = ({ t }) => {
  const wave = Math.sin(t * 8) * 18;
  return (
    <g>
      <defs><linearGradient id="bye16" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffd6e7" /><stop offset="100%" stopColor="#fff6e8" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#bye16)" />
      {Array.from({ length: 14 }, (_, i) => { const r = rn(i + 160); const y = ((1900 - (t * (50 + r() * 60) + r() * 1900)) % 1900 + 1900) % 1900; return <Heart key={i} x={r() * W} y={y} s={0.4 + r() * 0.4} o={0.5} c={i % 2 ? "#ff8fab" : "#ffd23f"} />; })}
      <g transform="translate(470 2050) scale(1.6)">
        <Seeker uid="by16" t={t} look={KID} blink={blinkAt(t, 8)} smile={1} wide={0.3} rArm={[-150, -30 + wave]} tilt={3 * Math.sin(t * 2)} />
      </g>
      <Kitty t={t} x={900} y={1900} s={0.9} happy={1} flip />
    </g>
  );
};

export const KidsAnim1116: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Rough t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Dome t={t} /> },
    { a: b(1), b: b(2), r: (t) => <S_Gentle t={t} /> },
    { a: b(2), b: b(3), r: (t) => <S_Tower t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Soft t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Good t={t} /> },
    { a: b(5), b: KIDS1116_DUR + 1, r: (t) => <S_Bye t={t} /> },
  ];
  const XF = 0;
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [KIDS1116_DUR - 0.6, KIDS1116_DUR], [0, 1]));
  const domeA = b(0), domeB = b(1);
  const dip = Math.max(0, ...[b(0), b(1)].map((x) => 1 - Math.abs(t - x) / 0.18));
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {t >= domeA && t < domeB && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img src={staticFile("d1116/dome_k.jpg")} style={{ width: W, height: H, objectFit: "cover", transformOrigin: "50% 70%", transform: `scale(${1.02 + 0.1 * k(t, domeA, domeB)})` }} />
        </AbsoluteFill>
      )}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => {
          /* hard cuts (with a dip to dark) in and out of the real Dome shot: no character ever cross-fades over the Dome */
          const xa = s.a === b(0) || s.a === b(1) ? 0 : XF, xb = s.b === b(0) || s.b === b(1) ? 0 : XF;
          if (t < s.a - xa || t >= s.b + xb) return null;
          const o = s.a === 0 || xa === 0 ? 1 : interp(t, [s.a - XF, s.a + XF], [0, 1]);
          return <g key={i} opacity={o}>{s.r(t)}</g>;
        })}
      </svg>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ background: "#2e7d5b", color: "#fff", borderRadius: 40, padding: "12px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.08em" }}>ISLAM FOR LITTLE ONES · GENTLE HANDS</span>
      </div>
      <Card font={FONT} t={t} a={wt(0, "rough")} b={b(0)} top={300} bg="#ff7a00">Too rough! Kitty is scared</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.3} b={b(1)} top={300}>Sahih Muslim 2593</Card>
      <Card font={FONT} t={t} a={wt(1, "gentle")} b={b(1)} top={420} bg="#ff7a00" size={46}>Allah loves gentleness!</Card>
      <Card font={FONT} t={t} a={wt(2, "gentle")} b={b(2)} top={300} bg="#2ec4b6">1 · Gentle with animals</Card>
      <Card font={FONT} t={t} a={L(3).start} b={b(3)} top={300} bg="#7b61ff">2 · Help, don't knock it down</Card>
      <Card font={FONT} t={t} a={L(4).start} b={b(4)} top={300} bg="#ff5a7a">3 · Soft doors, gentle hands</Card>
      <Card font={FONT} t={t} a={L(5).start + 0.2} b={b(5)} top={300} bg="#2e7d5b" size={46}>Gentle = so much good!</Card>
      <Card font={FONT} t={t} a={L(6).start} b={KIDS1116_DUR} top={300} bg="#ff7a00">Your turn! Gentle hands today</Card>
      <Captions t={t} TL={TL} font={FONT} hi="#ff7a00" base="#9aa0b5" done="#2b2d42" bg="rgba(255,255,255,0.92)" size={62} />
      <AbsoluteFill style={{ background: "#fff6e8", opacity: Math.max(0, ...[b(2), b(3), b(4), b(5)].map((x) => 1 - Math.abs(t - x) / 0.16)) }} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fade, dip) }} />
      {withAudio && <Audio src={staticFile("day1/d1116kids-mix.m4a")} />}
    </AbsoluteFill>
  );
};
