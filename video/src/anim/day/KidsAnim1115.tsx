import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1115kids-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, k } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, lin, Captions, Card, Sparkles, Heart, W, H, rn } from "./AnimKit";

/* Islam for Little Ones · 15 Nov 2026 "Be kind to people!" (Sahih al-Bukhari 7376, Jarir bin Abdullah Radi Allahu Anhu:
   Allah will not be merciful to those who are not merciful to people). Cast: an ordinary family (kid, grandpa, mum in hijab,
   little brother) with faces. When he ﷺ is mentioned: the REAL Green Dome photo only (Pixabay 112361, DesignwithRiyas). No music. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const KIDS1115_DUR = TL.total;
const FONT = "'Baloo 2', 'Montserrat', sans-serif";
const KID: Look = { kid: true, beard: false, cap: null, top: "#ff8c42", topD: "#e06d22", pants: "#2b3a67", shawl: false, hair: "#24170f" };
const BRO: Look = { kid: true, beard: false, cap: null, top: "#7bd389", topD: "#55b066", pants: "#3a5a8c", shawl: false, hair: "#2a1a10", skin: ["#f0c9a4", "#d9a982", "#b8865f"] };
const GPA: Look = { beard: true, beardC: "#e9e9e9", hair: "#d9d9d9", cap: "#ffffff", top: "#8fa6c2", topD: "#6d85a3", pants: "#5d6f88", shawl: false, skin: ["#e3b58e", "#c99a72", "#a77850"] };
const MUM: Look = { beard: false, cap: null, hijab: "#9b5de5", top: "#c9a7f0", topD: "#a885d6", shawl: false, long: true, skin: ["#e6bd98", "#cf9d76", "#ad7b55"] };
const UMB = "#ffd23f";

const Street: React.FC<{ t: number; wet?: number; sun?: number }> = ({ t, wet = 1, sun = 0 }) => (
  <g>
    <defs><linearGradient id="sky15" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7d8fa8" /><stop offset="100%" stopColor="#c9d4e2" /></linearGradient>
      <linearGradient id="sun15" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8fd3ff" /><stop offset="100%" stopColor="#e6f6ff" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#sky15)" />
    <rect width={W} height={H} fill="url(#sun15)" opacity={sun} />
    {/* rain clouds drift */}
    {[0, 1, 2, 3].map((i) => <g key={i} opacity={1 - sun} transform={`translate(${((t * 18 + i * 330) % 1400) - 200} ${170 + (i % 2) * 90})`}><ellipse rx={150} ry={55} fill="#8d99ab" /><ellipse cx={70} cy={-34} rx={95} ry={55} fill="#9aa6b8" /><ellipse cx={-70} cy={-20} rx={80} ry={45} fill="#97a3b5" /></g>)}
    {/* houses */}
    {[[20, 700, 300, 760, "#e9b872"], [360, 600, 330, 860, "#d98e73"], [730, 680, 330, 780, "#9fc3a4"]].map(([x, y, w, h, c], i) => (
      <g key={i}><rect x={x as number} y={y as number} width={w as number} height={h as number} fill={c as string} /><rect x={x as number} y={(y as number) - 20} width={w as number} height={30} fill="#00000022" />
        {Array.from({ length: 4 }, (_, j) => <rect key={j} x={(x as number) + 40 + (j % 2) * ((w as number) / 2)} y={(y as number) + 70 + Math.floor(j / 2) * 210} width={90} height={120} rx={10} fill="#fff6d6" opacity={0.85} />)}</g>))}
    <rect y={1440} width={W} height={480} fill="#8b8f98" />
    <rect y={1440} width={W} height={20} fill="#a7abb3" />
    {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={120 + i * 220} cy={1620 + (i % 2) * 140} rx={90} ry={14} fill="#c9d8ee" opacity={0.5 * wet} />)}
  </g>
);
/* rain that stops under the umbrella (x0..x1 below y) */
const RainX: React.FC<{ t: number; n?: number; o?: number; gap?: [number, number, number] | null }> = ({ t, n = 80, o = 0.5, gap = null }) => (
  <g opacity={o}>{Array.from({ length: n }, (_, i) => {
    const r = rn(i + 300), x = r() * (W + 200) - 100, sp = 1500 + r() * 900, y = ((r() * H + t * sp) % (H + 200)) - 100;
    if (gap && x > gap[0] && x < gap[1] && y > gap[2]) return null;
    return <line key={i} x1={x} y1={y} x2={x - 12} y2={y + 44} stroke="#e8f1ff" strokeWidth={3} />;
  })}</g>
);
const Umbrella: React.FC<{ x: number; y: number; s?: number; r?: number; open?: number }> = ({ x, y, s = 1, r = 0, open = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s}) translate(0 -250)`}>
    <path d={`M ${-230 * open} 0 Q ${-200 * open} -170 0 -180 Q ${200 * open} -170 ${230 * open} 0 Q ${172 * open} -30 ${115 * open} 0 Q ${57 * open} -30 0 0 Q ${-57 * open} -30 ${-115 * open} 0 Q ${-172 * open} -30 ${-230 * open} 0 Z`} fill={UMB} />
    <path d={`M 0 -180 Q ${-60 * open} -90 ${-115 * open} 0 M 0 -180 Q ${60 * open} -90 ${115 * open} 0`} stroke="#e0a800" strokeWidth={5} fill="none" />
    <rect x={-6} y={-200} width={12} height={24} rx={5} fill="#5b3a22" />
    <rect x={-6} y={-10} width={12} height={290} fill="#5b3a22" />
    <path d="M 0 278 Q 0 318 -34 318 Q -56 318 -56 296" stroke="#5b3a22" strokeWidth={12} fill="none" strokeLinecap="round" />
  </g>
);
const Bag: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#c8873c" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -40 0 Q -40 -60 0 -60 Q 40 -60 40 0" stroke="#7a4a20" strokeWidth={10} fill="none" />
    <path d="M -80 0 L 80 0 L 70 170 L -70 170 Z" fill={c} /><rect x={-80} y={0} width={160} height={20} fill="#00000022" />
    <circle cx={-30} cy={-6} r={26} fill="#ff6b6b" /><circle cx={20} cy={-14} r={22} fill="#ffd23f" /><path d="M 40 -20 l 20 -40 l 10 4 l -18 38 Z" fill="#7bd389" />
  </g>
);
const Teddy: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <circle cx={-46} cy={-120} r={26} fill="#a86b3c" /><circle cx={46} cy={-120} r={26} fill="#a86b3c" />
    <ellipse cx={0} cy={20} rx={70} ry={80} fill="#b97a45" /><circle cx={0} cy={-80} r={62} fill="#b97a45" />
    <ellipse cx={0} cy={-62} rx={26} ry={20} fill="#e2b98c" /><circle cx={0} cy={-70} r={8} fill="#3a2414" />
    <circle cx={-22} cy={-96} r={7} fill="#3a2414" /><circle cx={22} cy={-96} r={7} fill="#3a2414" />
    <ellipse cx={0} cy={30} rx={38} ry={44} fill="#e2b98c" />
  </g>
);
const Drops: React.FC<{ t: number; x: number; y: number; o: number }> = ({ t, x, y, o }) => (
  <g opacity={o}>{Array.from({ length: 6 }, (_, i) => { const ph = (t * 1.4 + i / 6) % 1; return <path key={i} transform={`translate(${x - 90 + i * 36} ${y + ph * 260})`} d="M 0 -14 Q 9 0 0 8 Q -9 0 0 -14 Z" fill="#cfe4ff" opacity={1 - ph} />; })}</g>
);

/* L0: rain, Grandpa with no umbrella, the kid with a yellow umbrella notices */
const S_Rain: React.FC<{ t: number }> = ({ t }) => {
  const notice = k(t, wt(0, "grandpa") - 0.2, wt(0, "grandpa") + 0.3);
  const q = pop(t, wt(0, "what"));
  const shiver = Math.sin(t * 40) * 3;
  return (
    <g>
      <Street t={t} />
      <RainX t={t} />
      <g transform={`translate(${300 + shiver} 1600) scale(0.92)`}>
        <Seeker uid="g15a" t={t} look={GPA} blink={blinkAt(t, 1)} brow={-0.3} smile={0} gazeY={-0.6} lArm={[40, 120]} rArm={[40, 120]} nod={6} />
      </g>
      <Drops t={t} x={300} y={760} o={1} />
      <g transform="translate(800 1640) scale(0.8)">
        <Seeker uid="k15a" t={t} look={KID} blink={blinkAt(t, 3)} wide={notice * 0.8} brow={0.6 * notice} gazeX={-0.9 * notice} mouthOpen={q * 0.4} rArm={[-150, -40]} lArm={[-6, 10]} />
      </g>
      <Umbrella x={800 + 200} y={1640 - 610} s={0.8} r={-4} />
      {q > 0 && <text x={560} y={720 - 12 * Math.sin(t * 4)} fontFamily={FONT} fontWeight={800} fontSize={200 * q} fill="#ff7a00" textAnchor="middle">?</text>}
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

/* L2: the kid walks over and holds the umbrella over Grandpa; the rain stops on them; Grandpa smiles on "dry" */
const S_Share: React.FC<{ t: number }> = ({ t }) => {
  const a = L(2).start, walk = k(t, a + 0.1, wt(2, "share") + 0.2), over = k(t, wt(2, "share"), wt(2, "umbrella") + 0.3);
  const dry = t > wt(2, "dry") - 0.1;
  const kx = interp(walk, [0, 1], [900, 470]);
  return (
    <g>
      <Street t={t} />
      <RainX t={t} gap={over > 0.6 ? [250, 760, 820] : null} />
      <g transform="translate(330 1600) scale(0.92)">
        <Seeker uid="g15b" t={t} look={GPA} blink={blinkAt(t, 2)} smile={dry ? 1 : 0.3 * over} brow={dry ? 0.5 : 0} gazeX={0.6} gazeY={-0.4} lArm={[40, 120]} rArm={dry ? [-20, 60] : [40, 120]} />
      </g>
      {over < 0.6 && <Drops t={t} x={330} y={760} o={1 - over} />}
      <g transform={`translate(${kx} ${1640 - Math.abs(Math.sin(t * 10)) * 14 * (1 - walk)}) scale(0.8)`}>
        <Seeker uid="k15b" t={t} look={KID} blink={blinkAt(t, 4)} smile={0.9} gazeX={-0.7} gazeY={-0.3} rArm={[-150, -40]} lArm={[-6, 10]} />
      </g>
      <Umbrella x={kx + 200} y={1640 - 610 - Math.abs(Math.sin(t * 10)) * 14 * (1 - walk)} s={0.8 + 0.25 * over} r={-40 * over} />
      <Sparkles t={t} at={wt(2, "dry")} cx={420} cy={700} n={12} />
    </g>
  );
};

/* L3: carrying the shopping up the steps: one, two, up we go */
const S_Bags: React.FC<{ t: number }> = ({ t }) => {
  const s1 = wt(3, "one"), s2 = wt(3, "two"), s3 = wt(3, "up");
  const step = Math.min(3, (t > s1 ? 1 : 0) + (t > s2 ? 1 : 0) + (t > s3 ? 1 : 0));
  const lift = (at: number) => pop(t, at, 0.3);
  const rise = -70 * ((t > s1 ? lift(s1) : 0) + (t > s2 ? lift(s2) : 0) + (t > s3 ? lift(s3) : 0));
  const xGo = -60 * step;
  const heavy = pop(t, wt(3, "heavy"));
  return (
    <g>
      <Street t={t} wet={0.6} />
      <RainX t={t} n={40} o={0.25} />
      {/* door with three steps */}
      <rect x={560} y={760} width={380} height={680} rx={30} fill="#7a4a2a" /><rect x={600} y={800} width={300} height={600} rx={20} fill="#9c6236" /><circle cx={860} cy={1120} r={16} fill="#ffd23f" />
      {[0, 1, 2].map((i) => <rect key={i} x={360 + i * 60} y={1440 + (2 - i) * 70 - 210} width={720 - i * 60} height={72} fill={["#b9b2a6", "#c9c2b6", "#d8d1c5"][i]} />)}
      <g transform={`translate(${380 + xGo * 0.6} ${1600 + rise * 0.6}) scale(0.88)`}>
        <Seeker uid="g15c" t={t} look={GPA} blink={blinkAt(t, 3)} smile={0.8} gazeX={0.5} lArm={[-4, 8]} rArm={[-4, 8]} />
      </g>
      <Bag x={380 + xGo * 0.6 - 120} y={1600 + rise * 0.6 - 300} s={0.85} c="#c8873c" />
      <g transform={`translate(${740 + xGo} ${1640 + rise}) scale(0.78)`}>
        <Seeker uid="k15c" t={t} look={KID} blink={blinkAt(t, 5)} smile={1} wide={heavy * 0.3} gazeX={-0.5} lArm={[-4, 8]} rArm={[-4, 8]} />
      </g>
      <Bag x={740 + xGo + 110} y={1640 + rise - 260 - 8 * Math.abs(Math.sin(t * 6))} s={0.75} c="#6fb3e0" />
      {[s1, s2, s3].map((at, i) => { const p = pop(t, at); return p > 0 && t < at + 1 ? <text key={i} x={240 + i * 300} y={560} fontFamily={FONT} fontWeight={900} fontSize={140 * p} fill="#ff7a00" textAnchor="middle" opacity={1 - lin(t, at + 0.6, at + 1)}>{["1", "2", "UP!"][i]}</text> : null; })}
    </g>
  );
};

/* L4: little brother is crying; a big hug; the teddy goes into his hands; he smiles */
const S_Brother: React.FC<{ t: number }> = ({ t }) => {
  const hugT = wt(4, "hug"), toyT = wt(4, "toy");
  const move = k(t, hugT - 0.6, hugT), hold = k(t, hugT, hugT + 0.3) * (1 - k(t, toyT - 0.5, toyT - 0.2));
  const toy = k(t, toyT - 0.3, toyT + 0.2);
  const happy = t > toyT + 0.1;
  const cry = happy ? 0 : 1;
  return (
    <g>
      <rect width={W} height={H} fill="#fff1d6" />
      <rect y={1480} width={W} height={440} fill="#f0c48a" />
      <rect x={140} y={360} width={340} height={380} rx={20} fill="#9fb3c8" stroke="#fff" strokeWidth={18} />
      {Array.from({ length: 10 }, (_, i) => { const r = rn(i + 700), x = 160 + r() * 300, y = 380 + ((r() * 340 + t * 700) % 340); return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 26} stroke="#eef5ff" strokeWidth={3} />; })}
      {/* sofa */}
      <rect x={560} y={1150} width={480} height={300} rx={60} fill="#e76f51" /><rect x={520} y={1300} width={560} height={200} rx={50} fill="#d65a3c" />
      <g transform={`translate(700 ${1640 - (happy ? Math.abs(Math.sin(t * 8)) * 18 : 0)}) scale(0.58)`}>
        <Seeker uid="br15" t={t} look={BRO} blink={blinkAt(t, 7)} closed={cry * 0.6} brow={cry ? -0.6 : 0.6} smile={happy ? 1 : 0} mouthOpen={cry * (0.4 + 0.2 * Math.sin(t * 14))} tear={cry ? (t * 0.8) % 1 : 0}
          lArm={happy ? [-60, 120] : [20, 150]} rArm={happy ? [-60, 120] : [20, 150]} />
      </g>
      <g transform={`translate(${interp(move, [0, 1], [240, 520])} 1640) scale(0.78)`}>
        <Seeker uid="k15d" t={t} look={KID} blink={blinkAt(t, 6)} smile={0.8} gazeX={0.7} gazeY={0.5} lArm={[-60 * hold - 10 * (1 - hold), 90 * hold + 10]} rArm={[-60 * hold - 10 * (1 - hold), 90 * hold + 10]} />
      </g>
      {toy > 0 && <Teddy x={interp(toy, [0, 1], [420, 700])} y={interp(toy, [0, 1], [1260, 1370]) - 120 * Math.sin(toy * Math.PI)} s={0.8} r={-10 + 10 * toy} />}
      {hold > 0.5 && Array.from({ length: 5 }, (_, i) => { const d = t - hugT - i * 0.2; return d > 0 && <Heart key={i} x={560 + (i - 2) * 60} y={900 - d * 200} s={0.6} o={Math.max(0, 1 - d / 1.5)} />; })}
      <Sparkles t={t} at={toyT + 0.1} cx={700} cy={1200} n={12} />
    </g>
  );
};

/* L5: the sun comes out, a rainbow, the whole family together; hearts on "kind" */
const S_Kind: React.FC<{ t: number }> = ({ t }) => {
  const a = L(5).start, sun = k(t, a, a + 1.4), bow = k(t, a + 0.6, a + 2);
  return (
    <g>
      <Street t={t} wet={1 - sun} sun={sun} />
      <circle cx={880} cy={300} r={100 * sun} fill="#ffe066" />
      <g opacity={bow}>{["#ff595e", "#ff924c", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"].map((c, i) => <path key={i} d={`M ${60 + i * 26} 1000 A ${480 - i * 26} ${480 - i * 26} 0 0 1 ${1020 - i * 26} 1000`} stroke={c} strokeWidth={26} fill="none" strokeDasharray={1600} strokeDashoffset={1600 * (1 - bow)} />)}</g>
      {[{ x: 200, l: GPA, s: 0.82 }, { x: 430, l: MUM, s: 0.8 }, { x: 650, l: KID, s: 0.7 }, { x: 860, l: BRO, s: 0.56 }].map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${1640 - Math.abs(Math.sin(t * 6 + i)) * 10}) scale(${p.s})`}><Seeker uid={`f15${i}`} t={t} look={p.l} blink={blinkAt(t, 10 + i)} smile={1} gazeX={(1.5 - i) * 0.3} lArm={[-20, 30]} rArm={[-20, 30]} /></g>
      ))}
      {Array.from({ length: 10 }, (_, i) => { const r = rn(i + 60), at = wt(5, "kind") + i * 0.15, d = t - at; return d > 0 && <Heart key={i} x={150 + r() * 780} y={700 - d * 200} s={0.6 + r() * 0.6} o={Math.max(0, 1 - d / 1.8)} />; })}
    </g>
  );
};

/* L6: goodbye wave under the umbrella */
const S_Bye: React.FC<{ t: number }> = ({ t }) => {
  const wave = Math.sin(t * 8) * 18;
  return (
    <g>
      <defs><linearGradient id="bye15" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8fd3ff" /><stop offset="100%" stopColor="#e6f6ff" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#bye15)" />
      {Array.from({ length: 14 }, (_, i) => { const r = rn(i + 140); const y = ((1900 - (t * (50 + r() * 60) + r() * 1900)) % 1900 + 1900) % 1900; return <Heart key={i} x={r() * W} y={y} s={0.4 + r() * 0.4} o={0.5} c={i % 2 ? "#ff8fab" : "#ffd23f"} />; })}
      <g transform="translate(540 2050) scale(1.6)">
        <Seeker uid="by15" t={t} look={KID} blink={blinkAt(t, 8)} smile={1} wide={0.3} rArm={[-150, -30 + wave]} tilt={3 * Math.sin(t * 2)} />
      </g>
    </g>
  );
};

export const KidsAnim1115: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Rain t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Dome t={t} /> },
    { a: b(1), b: b(2), r: (t) => <S_Share t={t} /> },
    { a: b(2), b: b(3), r: (t) => <S_Bags t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Brother t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Kind t={t} /> },
    { a: b(5), b: KIDS1115_DUR + 1, r: (t) => <S_Bye t={t} /> },
  ];
  const XF = 0.22;
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [KIDS1115_DUR - 0.6, KIDS1115_DUR], [0, 1]));
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
        {SHOTS.map((s, i) => {
          /* hard cuts (with a dip to dark) in and out of the real Dome shot: no character ever cross-fades over the Dome */
          const xa = s.a === b(0) || s.a === b(1) ? 0 : XF, xb = s.b === b(0) || s.b === b(1) ? 0 : XF;
          if (t < s.a - xa || t >= s.b + xb) return null;
          const o = s.a === 0 || xa === 0 ? 1 : interp(t, [s.a - XF, s.a + XF], [0, 1]);
          return <g key={i} opacity={o}>{s.r(t)}</g>;
        })}
      </svg>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ background: "#2e7d5b", color: "#fff", borderRadius: 40, padding: "12px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.08em" }}>ISLAM FOR LITTLE ONES · BE KIND</span>
      </div>
      <Card font={FONT} t={t} a={wt(0, "umbrella")} b={b(0)} top={300} bg="#ff7a00">No umbrella? Oh no!</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.3} b={b(1)} top={300}>Sahih al-Bukhari 7376</Card>
      <Card font={FONT} t={t} a={wt(1, "merciful")} b={b(1)} top={420} bg="#ff7a00" size={46}>Be merciful to people!</Card>
      <Card font={FONT} t={t} a={wt(2, "share")} b={b(2)} top={300} bg="#2ec4b6">1 · Share your umbrella</Card>
      <Card font={FONT} t={t} a={L(3).start} b={b(3)} top={300} bg="#7b61ff">2 · Help carry the bags</Card>
      <Card font={FONT} t={t} a={wt(4, "hug")} b={b(4)} top={300} bg="#ff5a7a">3 · A hug + share your toy</Card>
      <Card font={FONT} t={t} a={L(5).start + 0.2} b={b(5)} top={300} bg="#2e7d5b" size={46}>Kind to people = Allah is kind to us</Card>
      <Card font={FONT} t={t} a={L(6).start} b={KIDS1115_DUR} top={300} bg="#ff7a00">Your turn! Who will you help?</Card>
      <Captions t={t} TL={TL} font={FONT} hi="#ff7a00" base="#9aa0b5" done="#2b2d42" bg="rgba(255,255,255,0.92)" size={62} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fade, dip) }} />
      {withAudio && <Audio src={staticFile("day1/d1115kids-mix.m4a")} />}
    </AbsoluteFill>
  );
};
