import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1114kids-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, prng, k } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, lin, Captions, Card, Sparkles, Heart, Hand, W, H, rn } from "./AnimKit";

/* Islam for Little Ones · 14 Nov 2026 "Muddy hands? Let's get clean!" (Sahih Muslim 223: cleanliness is half of faith).
   Cast: ordinary family (kid, mum in hijab, dad) with faces. When he ﷺ is mentioned: the REAL Green Dome photo only
   (Pixabay 112361, DesignwithRiyas). No music. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const KIDS1114_DUR = TL.total;
const FONT = "'Baloo 2', 'Montserrat', sans-serif";
const KID: Look = { kid: true, beard: false, cap: null, top: "#3d8fe0", topD: "#2c6db3", pants: "#2b3a67", shawl: false, hair: "#24170f" };
const KIDCLEAN: Look = { ...KID, top: "#ffb703", topD: "#e09400" };
const MUM: Look = { beard: false, cap: null, hijab: "#2a9d8f", top: "#7fc8be", topD: "#5aa79c", shawl: false, long: true, skin: ["#e6bd98", "#cf9d76", "#ad7b55"] };
const DAD: Look = { beard: true, top: "#e9eef5", topD: "#c3cfdd", pants: "#c9d4e2", shawl: false };
const MUD = "#7a4a26";

const Garden: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs><linearGradient id="sky14" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8fd3ff" /><stop offset="100%" stopColor="#dff4ff" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#sky14)" />
    <circle cx={880} cy={260} r={90} fill="#ffe066" />
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${((t * 30 + i * 420) % 1400) - 200} ${220 + i * 120})`}><ellipse rx={110} ry={40} fill="#fff" /><ellipse cx={50} cy={-24} rx={70} ry={40} fill="#fff" /></g>)}
    <path d="M 0 1100 Q 300 1020 600 1080 Q 850 1130 1080 1060 L 1080 1920 L 0 1920 Z" fill="#7dc95e" />
    <rect y={1380} width={W} height={540} fill="#69b84c" />
    {Array.from({ length: 22 }, (_, i) => { const r = rn(i + 90); const x = r() * W, y = 1150 + r() * 700; return <path key={i} d={`M ${x} ${y} l -8 -26 M ${x} ${y} l 0 -32 M ${x} ${y} l 8 -26`} stroke="#4f9a35" strokeWidth={5} strokeLinecap="round" transform={`rotate(${3 * Math.sin(t * 2 + i)} ${x} ${y})`} />; })}
    {/* fence */}
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 95 + 5} y={1000} width={50} height={170} rx={10} fill="#f4e1c1" />)}
    <rect y={1040} width={W} height={20} fill="#e6cfa6" /><rect y={1120} width={W} height={20} fill="#e6cfa6" />
  </g>
);
const Puddle: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse rx={260} ry={60} fill="#8a5a33" /><ellipse cx={-30} cy={-6} rx={180} ry={34} fill="#9c6a40" /><ellipse cx={-80} cy={-14} rx={50} ry={10} fill="#c08a5a" opacity={0.6} /></g>
);

/* L0: kid jumps in a puddle, mud splashes, looks at his hands */
const S_Mud: React.FC<{ t: number }> = ({ t }) => {
  const jumpA = 0.2, land = 0.75;
  const jy = t < land ? -Math.sin(lin(t, jumpA, land) * Math.PI) * 220 : 0;
  const splash = t > land ? t - land : -1;
  const look = k(t, wt(0, "hands") - 0.2, wt(0, "hands") + 0.2);
  const huh = pop(t, wt(0, "what"));
  return (
    <g>
      <Garden t={t} />
      <Puddle x={540} y={1560} />
      {/* soccer ball rolling away */}
      <g transform={`translate(${860 + 60 * k(t, 0.8, 2.5)} ${1520}) rotate(${t * 120})`}><circle r={46} fill="#fff" stroke="#333" strokeWidth={4} /><path d="M 0 -18 L 17 -6 L 11 15 L -11 15 L -17 -6 Z" fill="#333" /></g>
      <g transform={`translate(540 ${1560 + jy}) scale(0.95)`}>
        <Seeker uid="m14" t={t} look={KID} blink={blinkAt(t, 3)} smile={t < land ? 1 : 0.1 * (1 - look)} wide={t > land ? 0.8 : 0} brow={t > land ? 0.8 : 0.3}
          gazeY={look * 0.9} mouthOpen={t > land && t < land + 0.8 ? 0.7 : huh * 0.3}
          lArm={t < land ? [-120, 20] : [interp(look, [0, 1], [-60, 40]), interp(look, [0, 1], [10, 110])]}
          rArm={t < land ? [-120, 20] : [interp(look, [0, 1], [-60, 40]), interp(look, [0, 1], [10, 110])]} />
        {/* mud spots on shirt and trousers appear after the splash */}
        {t > land && [[-60, -420], [40, -360], [90, -480], [-30, -200], [50, -120], [-70, -90]].map(([x, y], i) => <circle key={i} cx={x} cy={y * 0.78} r={14 + (i % 3) * 7} fill={MUD} opacity={Math.min(1, (t - land) * 4)} />)}
      </g>
      {splash >= 0 && splash < 1.2 && Array.from({ length: 16 }, (_, i) => { const r = rn(i + 5); const a = Math.PI + r() * Math.PI, v = 500 + r() * 500; const x = 540 + Math.cos(a) * v * splash, y = 1540 + Math.sin(a) * v * splash + 900 * splash * splash; return <circle key={i} cx={x} cy={y} r={12 + r() * 16} fill={MUD} opacity={1 - splash / 1.2} />; })}
      {huh > 0 && <text x={800} y={760 - 10 * Math.sin(t * 4)} fontFamily={FONT} fontWeight={800} fontSize={200 * huh} fill="#ff7a00" textAnchor="middle">?</text>}
    </g>
  );
};

/* L1: the real Green Dome photo (HTML layer underneath), light rays + birds on top */
const BIRDS = Array.from({ length: 7 }, (_, i) => ({ y: 260 + i * 55, sp: 90 + i * 12, ph: i * 0.9, s: 0.7 + (i % 3) * 0.2 }));
const S_Dome: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${100 + i * 120} -40 L ${170 + i * 120} -40 L ${260 + i * 130} 1920 L ${40 + i * 110} 1920 Z`} fill="#fff6d0" opacity={0.05 + 0.04 * Math.sin(t * 1.5 + i)} />)}
    {BIRDS.map((b, i) => { const x = ((t - 3) * b.sp + i * 160) % 1300 - 100, flap = Math.sin(t * 9 + b.ph) * 12; return <path key={i} transform={`translate(${x} ${b.y + Math.sin(t + i) * 10}) scale(${b.s})`} d={`M -24 ${flap} Q -12 -6 0 0 Q 12 -6 24 ${flap}`} stroke="#3a3a3a" strokeWidth={5} fill="none" strokeLinecap="round" />; })}
  </g>
);

/* L2: close-up sink: tap runs, hands rub, soap pops in on "soap", bubbles burst on "Bubbles", mud washes off */
const Bubble: React.FC<{ x: number; y: number; r: number; o: number }> = ({ x, y, r, o }) => (
  <g opacity={o}><circle cx={x} cy={y} r={r} fill="#bfe8ff66" stroke="#4aa8e0" strokeWidth={4} /><circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.22} fill="#fff" /></g>
);
const S_Wash: React.FC<{ t: number }> = ({ t }) => {
  const a = L(2).start, soapT = wt(2, "soap"), bubT = wt(2, "bubbles");
  const tapOn = k(t, a + 0.1, a + 0.5), rub = t > wt(2, "wash") ? Math.sin(t * 14) : 0;
  const clean = k(t, soapT + 0.2, bubT + 0.6);
  const soap = pop(t, soapT);
  return (
    <g>
      <rect width={W} height={H} fill="#d9f1ff" />
      {Array.from({ length: 8 }, (_, r) => Array.from({ length: 6 }, (_, c) => <rect key={`${r}${c}`} x={c * 180 + 4} y={r * 140 + 4} width={172} height={132} rx={10} fill="#eaf8ff" />))}
      <rect y={1200} width={W} height={720} fill="#f4f7fb" />
      <path d="M 120 1180 L 960 1180 L 900 1420 Q 540 1480 180 1420 Z" fill="#ffffff" stroke="#c9d6e3" strokeWidth={8} />
      <ellipse cx={540} cy={1260} rx={340} ry={60} fill="#cfe6f5" />
      {/* tap */}
      <rect x={510} y={700} width={60} height={200} rx={20} fill="#b8c4d0" /><path d="M 540 720 L 540 640 Q 540 600 600 600 L 700 600" stroke="#b8c4d0" strokeWidth={44} fill="none" strokeLinecap="round" />
      <rect x={480} y={880} width={120} height={40} rx={14} fill="#9aa8b6" />
      {tapOn > 0 && <rect x={524} y={915} width={32} height={340 * tapOn} rx={14} fill="#7cc8ff" opacity={0.75} />}
      {tapOn > 0 && Array.from({ length: 6 }, (_, i) => { const ph = (t * 2 + i / 6) % 1; return <circle key={i} cx={540 + (i % 2 ? 1 : -1) * 30 * ph} cy={1240 - 40 * ph} r={6} fill="#7cc8ff" opacity={1 - ph} />; })}
      {/* hands */}
      <g transform={`translate(${rub * 26} 0)`}><Hand x={400} y={1280} s={1.5} r={14} curl={0.1} /></g>
      <g transform={`translate(${-rub * 26} 0)`}><Hand x={680} y={1280} s={1.5} r={-14} flip curl={0.1} /></g>
      {[[400, 1080], [470, 1010], [640, 1060], [700, 1000], [560, 1120], [380, 1160]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={20 + (i % 3) * 8} fill={MUD} opacity={1 - clean} />)}
      {/* soap bar */}
      {soap > 0 && <g transform={`translate(${830} ${1150 - 40 * soap}) scale(${soap}) rotate(-8)`}><rect x={-90} y={-50} width={180} height={100} rx={40} fill="#ff9ec7" /><rect x={-60} y={-30} width={120} height={40} rx={20} fill="#ffc4dd" /></g>}
      {/* bubbles: a few on "soap", a storm on "Bubbles" */}
      {Array.from({ length: 34 }, (_, i) => { const r = rn(i + 20); const at = i < 8 ? soapT + 0.3 + i * 0.12 : bubT + (i - 8) * 0.04; if (t < at) return null; const d = t - at; const x = 540 + (r() - 0.5) * 900 + Math.sin(t * 2 + i) * 30, y = 1150 - d * (180 + r() * 220); return <Bubble key={i} x={x} y={y} r={18 + r() * 40} o={Math.max(0, 1 - d / 3.5)} />; })}
    </g>
  );
};

/* L3: brushing teeth at the mirror, up and down, then a sparkle */
const S_Brush: React.FC<{ t: number }> = ({ t }) => {
  const ud = t > wt(3, "up") ? Math.sin(t * 16) : Math.sin(t * 10) * 0.5;
  const spark = wt(3, "sparkle");
  const smile = t > spark ? 1 : 0.3;
  return (
    <g>
      <rect width={W} height={H} fill="#e5f6f0" />
      <rect y={1450} width={W} height={470} fill="#bfe3d6" />
      {/* mirror */}
      <rect x={190} y={260} width={700} height={560} rx={60} fill="#cfeeff" stroke="#ffffff" strokeWidth={20} />
      <path d="M 260 360 L 360 300 M 260 440 L 450 320" stroke="#fff" strokeWidth={14} strokeLinecap="round" opacity={0.7} />
      {/* cup with toothpaste */}
      <g transform="translate(900 1300)"><rect x={-50} y={-110} width={100} height={110} rx={16} fill="#8ecae6" /><rect x={-6} y={-200} width={12} height={110} fill="#ffb703" /></g>
      <g transform="translate(540 1720) scale(1.35)">
        <Seeker uid="b14" t={t} look={KIDCLEAN} blink={blinkAt(t, 5)} smile={smile} mouthOpen={t < spark ? 0.45 : 0} gazeX={-0.2} gazeY={0.2}
          rArm={[20 + ud * 3, 150]} lArm={[-6, 10]} />
        {/* toothbrush at the mouth, moving up and down */}
        {t < spark + 0.1 && <g transform={`translate(${-2} ${-566 + ud * 14}) rotate(58)`}><rect x={0} y={-9} width={190} height={18} rx={9} fill="#ff6b6b" /><rect x={-8} y={-26} width={44} height={20} rx={6} fill="#fff" stroke="#9ad" strokeWidth={3} /></g>}
      </g>
      {t > spark && <g>{[[480, 860], [600, 840], [540, 820]].map(([x, y], i) => <path key={i} transform={`translate(${x} ${y}) scale(${0.8 + 0.4 * Math.sin(t * 8 + i)})`} d="M 0 -26 L 7 -7 L 26 0 L 7 7 L 0 26 L -7 7 L -26 0 L -7 -7 Z" fill="#fff" />)}</g>}
      <Sparkles t={t} at={spark} cx={540} cy={860} n={14} />
    </g>
  );
};

/* L4: comb swipes across his hair; on "clean clothes" a fresh shirt flies in and his top turns fresh */
const S_Dress: React.FC<{ t: number }> = ({ t }) => {
  const combA = wt(4, "comb"), clothes = wt(4, "clothes");
  const comb = t < clothes - 0.2 ? Math.sin((t - combA) * 7) : 0;
  const fly = k(t, clothes - 0.35, clothes + 0.15);
  const fresh = t > clothes + 0.1;
  return (
    <g>
      <rect width={W} height={H} fill="#fff1d6" />
      <rect y={1500} width={W} height={420} fill="#e7b57d" />
      {/* wardrobe */}
      <rect x={720} y={420} width={300} height={1090} rx={20} fill="#c98f55" /><line x1={870} y1={440} x2={870} y2={1490} stroke="#a8703f" strokeWidth={8} />
      <circle cx={850} cy={960} r={12} fill="#ffd166" /><circle cx={890} cy={960} r={12} fill="#ffd166" />
      <g transform="translate(430 1560) scale(1.15)">
        <Seeker uid="d14" t={t} look={fresh ? KIDCLEAN : KID} blink={blinkAt(t, 6)} smile={fresh ? 1 : 0.6} gazeY={-0.5} rArm={t < clothes ? [-150 + comb * 8, -60] : [-30, 40]} />
        {t < clothes + 0.1 && <g transform={`translate(${70 + comb * 30} ${-805}) rotate(-8)`}><rect x={-60} y={-14} width={120} height={28} rx={8} fill="#7b61ff" />{Array.from({ length: 10 }, (_, i) => <rect key={i} x={-55 + i * 11.5} y={10} width={6} height={22} fill="#7b61ff" />)}</g>}
        {!fresh && [[-60, -420], [40, -360], [90, -480]].map(([x, y], i) => <circle key={i} cx={x} cy={y * 0.78} r={16} fill={MUD} />)}
      </g>
      {fly < 1 && t > clothes - 0.4 && <g transform={`translate(${interp(fly, [0, 1], [870, 430])} ${interp(fly, [0, 1], [700, 1160]) - 200 * Math.sin(fly * Math.PI)}) rotate(${360 * fly}) scale(${1 - 0.3 * fly})`}><path d="M -70 -60 L -30 -80 Q 0 -66 30 -80 L 70 -60 L 100 -20 L 70 0 L 60 -20 L 60 80 L -60 80 L -60 -20 L -70 0 L -100 -20 Z" fill="#ffb703" /></g>}
      <Sparkles t={t} at={clothes + 0.1} cx={430} cy={1160} n={14} />
    </g>
  );
};

/* L5: mum and dad open their arms, the clean kid runs in for a hug; hearts */
const S_Hug: React.FC<{ t: number }> = ({ t }) => {
  const hugT = wt(5, "hug"), run = k(t, wt(5, "everyone") - 0.3, hugT);
  const close = k(t, hugT - 0.1, hugT + 0.3);
  return (
    <g>
      <rect width={W} height={H} fill="#fff4dc" />
      <rect y={1500} width={W} height={420} fill="#f0c48a" />
      <rect x={120} y={330} width={300} height={360} rx={20} fill="#bfe3ff" stroke="#fff" strokeWidth={18} />
      <Glow id="hugG" cx={540} cy={900} r={600} c="#fff3c4" o={0.6} />
      <g transform={`translate(${250 + 70 * close} 1500) scale(0.86)`}><Seeker uid="hd" t={t} look={DAD} blink={blinkAt(t, 1)} smile={1} gazeX={0.6} gazeY={0.5} lArm={[-70 + 120 * close, 30]} rArm={[-70 + 120 * close, 30]} /></g>
      <g transform={`translate(${830 - 70 * close} 1500) scale(0.82)`}><Seeker uid="hm" t={t} look={MUM} blink={blinkAt(t, 2)} smile={1} gazeX={-0.6} gazeY={0.5} lArm={[-70 + 120 * close, 30]} rArm={[-70 + 120 * close, 30]} /></g>
      <g transform={`translate(${interp(run, [0, 1], [-200, 540])} ${1580 - Math.abs(Math.sin(t * 12)) * 20 * (1 - close)}) scale(0.82)`}>
        <Seeker uid="hk" t={t} look={KIDCLEAN} blink={blinkAt(t, 3)} smile={1} wide={0.3} lArm={[-60 * (1 - close) - 120 * close, 20]} rArm={[-60 * (1 - close) - 120 * close, 20]} />
      </g>
      {Array.from({ length: 10 }, (_, i) => { const r = rn(i + 60), at = hugT + i * 0.18, d = t - at; return d > 0 && <Heart key={i} x={200 + r() * 680} y={720 - d * 220} s={0.7 + r() * 0.6} o={Math.max(0, 1 - d / 1.8)} />; })}
      <Sparkles t={t} at={wt(5, "clean")} cx={540} cy={700} />
    </g>
  );
};

/* L6: goodbye wave */
const S_Bye: React.FC<{ t: number }> = ({ t }) => {
  const wave = Math.sin(t * 8) * 18;
  return (
    <g>
      <defs><radialGradient id="bye14" cx="50%" cy="40%" r="75%"><stop offset="0%" stopColor="#fff7d6" /><stop offset="100%" stopColor="#8fd3ff" /></radialGradient></defs>
      <rect width={W} height={H} fill="url(#bye14)" />
      {Array.from({ length: 16 }, (_, i) => { const r = rn(i + 140); const y = ((1900 - (t * (60 + r() * 60) + r() * 1900)) % 1900 + 1900) % 1900; return <Bubble key={i} x={r() * W} y={y} r={14 + r() * 30} o={0.8} />; })}
      <g transform="translate(540 2050) scale(1.6)">
        <Seeker uid="by14" t={t} look={KIDCLEAN} blink={blinkAt(t, 8)} smile={1} wide={0.3} rArm={[-150, -30 + wave]} tilt={3 * Math.sin(t * 2)} />
      </g>
    </g>
  );
};

export const KidsAnim1114: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Mud t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Dome t={t} /> },
    { a: b(1), b: b(2), r: (t) => <S_Wash t={t} /> },
    { a: b(2), b: b(3), r: (t) => <S_Brush t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Dress t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Hug t={t} /> },
    { a: b(5), b: KIDS1114_DUR + 1, r: (t) => <S_Bye t={t} /> },
  ];
  const XF = 0.22;
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [KIDS1114_DUR - 0.6, KIDS1114_DUR], [0, 1]));
  const domeA = b(0) - XF, domeB = b(1) + XF;
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {t > domeA && t < domeB && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img src={staticFile("d1114/dome_k.jpg")} style={{ width: W, height: H, objectFit: "cover", transformOrigin: "50% 75%", transform: `scale(${1.02 + 0.1 * k(t, domeA, domeB)})` }} />
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
        <span style={{ background: "#2e7d5b", color: "#fff", borderRadius: 40, padding: "12px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.08em" }}>ISLAM FOR LITTLE ONES · LET'S GET CLEAN</span>
      </div>
      <Card font={FONT} t={t} a={wt(0, "muddy")} b={b(0)} top={300} bg="#ff7a00">Muddy hands? Oh no!</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.3} b={b(1)} top={300}>Sahih Muslim 223</Card>
      <Card font={FONT} t={t} a={wt(1, "cleanliness")} b={b(1)} top={420} bg="#ff7a00" size={56}>Cleanliness is half of faith!</Card>
      <Card font={FONT} t={t} a={wt(2, "wash")} b={b(2)} top={300} bg="#2ec4b6">1 · Wash with soap</Card>
      <Card font={FONT} t={t} a={L(3).start} b={b(3)} top={300} bg="#7b61ff">2 · Brush your teeth</Card>
      <Card font={FONT} t={t} a={L(4).start} b={wt(4, "clothes")} top={300} bg="#ff7a00">3 · Comb your hair</Card>
      <Card font={FONT} t={t} a={wt(4, "clothes")} b={b(4)} top={300} bg="#2e7d5b">4 · Clean clothes</Card>
      <Card font={FONT} t={t} a={L(5).start + 0.2} b={b(5)} top={300} bg="#ff5a7a">Allah loves those who keep clean</Card>
      <Card font={FONT} t={t} a={L(6).start} b={KIDS1114_DUR} top={300} bg="#ff7a00">Your turn! What will you keep clean?</Card>
      <Captions t={t} TL={TL} font={FONT} hi="#ff7a00" base="#9aa0b5" done="#2b2d42" bg="rgba(255,255,255,0.92)" size={62} />
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
      {withAudio && <Audio src={staticFile("day1/d1114kids-mix.m4a")} />}
    </AbsoluteFill>
  );
};
