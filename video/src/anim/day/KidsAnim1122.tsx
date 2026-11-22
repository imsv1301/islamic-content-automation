import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1122kids-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { k } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, lin, Captions, Card, Sparkles, Heart, W, H, rn } from "./AnimKit";

/* Islam for Little Ones · 22 Nov 2026 "Visit a sick friend!" (Sahih Muslim 2568c, Hazrat Thawban Radi Allahu Anhu:
   when a Muslim visits his sick brother he remains in the fruit garden (khurfah) of Paradise until he returns).
   Cast: an ordinary family (kid, mum in hijab) + a sick friend, all with faces. When he ﷺ is mentioned:
   the REAL Green Dome photo only (Pixabay 112361, DesignwithRiyas). No music. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const KIDS1122_DUR = TL.total;
const FONT = "'Baloo 2', 'Montserrat', sans-serif";
const KID: Look = { kid: true, beard: false, cap: null, top: "#3a86ff", topD: "#2a6ad6", pants: "#2b3a67", shawl: false, hair: "#24170f" };
const SIS: Look = { kid: true, beard: false, cap: null, hijab: "#ff70a6", top: "#ffd6e7", topD: "#f5b3cf", shawl: false, long: true, skin: ["#f0c9a4", "#d9a982", "#b8865f"] };
const MUM: Look = { beard: false, cap: null, hijab: "#2ec4b6", top: "#a8e6df", topD: "#86cfc6", shawl: false, long: true, skin: ["#e6bd98", "#cf9d76", "#ad7b55"] };

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
const PAL: Look = { kid: true, beard: false, cap: null, top: "#ffbe0b", topD: "#e0a200", pants: "#3d405b", shawl: false, hair: "#3a2414", skin: ["#c99a72", "#ad7c55", "#8a5d3a"] };

/* a bed with a blanket; the friend stands behind it so the blanket covers him to the chest. origin = bed front-centre on the floor */
const Bed: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-300} y={-420} width={40} height={420} rx={10} fill="#8a5232" />
    <rect x={260} y={-260} width={40} height={260} rx={10} fill="#8a5232" />
    <rect x={-300} y={-200} width={600} height={120} rx={20} fill="#a5673f" />
  </g>
);
const Blanket: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M -290 -190 Q -280 ${-300 + 4 * Math.sin(t * 2)} -120 -330 L 290 -300 L 290 -190 Z`} fill="#8ecae6" />
    {[-200, -60, 80, 220].map((sx, i) => <circle key={i} cx={sx} cy={-240} r={16} fill="#ffffff88" />)}
    <rect x={-300} y={-200} width={600} height={30} rx={12} fill="#6fb3d2" />
    <rect x={-300} y={-175} width={600} height={255} rx={14} fill="#a5673f" /><rect x={-270} y={-140} width={540} height={190} rx={10} fill="#b8794c" />
  </g>
);
const Thermo: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`} opacity={o}><rect x={-10} y={-80} width={20} height={90} rx={10} fill="#fff" stroke="#aaa" strokeWidth={3} /><circle cy={14} r={16} fill="#e5383b" /><rect x={-4} y={-60} width={8} height={70} fill="#e5383b" /></g>
);
const Fruit: React.FC<{ kind: number; x: number; y: number; s?: number }> = ({ kind, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {kind === 0 && <g><circle r={34} fill="#e63946" /><rect x={-3} y={-46} width={6} height={16} fill="#6b4630" /><ellipse cx={12} cy={-40} rx={12} ry={6} fill="#52b788" /></g>}
    {kind === 1 && <path d="M -40 0 Q 0 40 44 -10 Q 30 16 -36 -10 Z" fill="#ffd60a" stroke="#d4a017" strokeWidth={3} />}
    {kind === 2 && <g>{[[0, 0], [-16, -18], [16, -18], [-8, -36], [8, -36], [0, 18]].map(([gx, gy], i) => <circle key={i} cx={gx} cy={gy} r={14} fill="#7b2cbf" />)}</g>}
    {kind === 3 && <g><circle r={32} fill="#fb8500" /><ellipse cx={8} cy={-34} rx={10} ry={5} fill="#52b788" /></g>}
  </g>
);

/* L0: the kid looks out of the window at the friend's house: the friend sits in bed with a thermometer; "?" over the kid */
const S_Sick: React.FC<{ t: number }> = ({ t }) => {
  const sick = wt(0, "sick"), q = pop(t, wt(0, "what"));
  return (
    <g>
      <Room t={t} />
      <rect x={560} y={760} width={420} height={420} rx={20} fill="#bde0fe" stroke="#fff" strokeWidth={18} />
      <g transform="translate(770 1150)"><rect x={-150} y={-300} width={300} height={300} fill="#ffcad4" /><path d="M -170 -300 L 0 -400 L 170 -300 Z" fill="#e5383b" /><rect x={-70} y={-220} width={140} height={110} fill="#fff6d0" stroke="#fff" strokeWidth={8} />
        <circle cx={-10} cy={-160} r={26} fill="#c99a72" /><rect x={-50} y={-136} width={80} height={26} fill="#8ecae6" />
        {t > sick && <Thermo x={16} y={-160} r={50} />}</g>
      <g transform={`translate(330 1650) scale(0.85)`}><Seeker uid="k22a" t={t} look={KID} blink={blinkAt(t, 1)} smile={0.1} brow={t > sick ? 0.7 : 0} gazeX={0.8} gazeY={-0.2} tilt={t > sick ? -5 : 0}
        rArm={q > 0 ? [20, 150] : [-6, 8]} lArm={[-6, 8]} /></g>
      {t > sick && <g transform={`translate(770 700) scale(${pop(t, sick)})`}><rect x={-120} y={-56} width={240} height={100} rx={46} fill="#fff" stroke="#e5383b" strokeWidth={6} /><text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#e5383b">SICK!</text></g>}
      {q > 0 && <text x={330} y={760 - 10 * Math.sin(t * 3)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170 * q} fill="#ff7a00">?</text>}
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
/* L2: at the table: a get-well card gets a big heart drawn on it; fruit hops into a basket */
const S_Card: React.FC<{ t: number }> = ({ t }) => {
  const card = wt(2, "card"), fruit = wt(2, "fruit"), go = wt(2, "go");
  const draw = k(t, card - 0.2, card + 0.8);
  return (
    <g>
      <Room t={t} tint="#eaf4ff" />
      <rect x={60} y={1290} width={960} height={40} rx={10} fill="#a5673f" /><rect x={100} y={1330} width={30} height={170} fill="#8a5232" /><rect x={950} y={1330} width={30} height={170} fill="#8a5232" />
      <g transform={`translate(200 ${1650 - (t < card ? Math.abs(Math.sin(t * 9)) * 18 : 0)}) scale(0.72)`}><Seeker uid="k22b" t={t} look={KID} blink={blinkAt(t, 2)} smile={0.9} wide={t < card ? 0.4 : 0} gazeX={0.7} gazeY={0.3}
        rArm={t < card ? [-150, -30] : [-40 + 8 * Math.sin(t * 9) * (1 - draw), 30]} lArm={[-6, 8]} /></g>
      <g transform="translate(870 1650) scale(0.88)"><Seeker uid="m22a" t={t} look={MUM} blink={blinkAt(t, 3)} smile={0.8} gazeX={-0.7} gazeY={0.2} lArm={t > fruit - 0.5 ? [-40, 40] : [-6, 8]} rArm={[-6, 8]} /></g>
      {pop(t, card - 0.3) > 0 && <g transform={`translate(440 1170) scale(${pop(t, card - 0.3)}) rotate(-6)`}>
        <rect x={-130} y={-110} width={260} height={200} rx={10} fill="#fff" stroke="#ffbe0b" strokeWidth={6} />
        <Heart x={0} y={-30} s={1.6 * draw} o={1} />
        <text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#2b2d42" opacity={draw}>Get well soon!</text></g>}
      <g transform="translate(700 1290)"><path d="M -110 0 L 110 0 L 90 -90 L -90 -90 Z" fill="#c8873c" /><path d="M -90 -90 Q 0 -200 90 -90" stroke="#a0662a" strokeWidth={10} fill="none" />
        {[0, 1, 2, 3].map((i) => { const at = fruit - 0.2 + i * 0.18, p = k(t, at, at + 0.35); return p > 0 && <Fruit key={i} kind={i} x={-60 + i * 40} y={interp(p, [0, 1], [-560, -110])} s={0.9} />; })}</g>
      {t > go - 0.2 && t < card - 0.3 && <text x={540} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100 * pop(t, go - 0.2)} fill="#ff7a00">LET'S GO!</text>}
      <Sparkles t={t} at={card + 0.6} cx={440} cy={1140} n={10} />
    </g>
  );
};
/* L3: at the friend's door: the door shakes on each "knock", then opens; a salam bubble */
const S_Door: React.FC<{ t: number }> = ({ t }) => {
  const k1 = wt(3, "knock", 0), k2 = wt(3, "knock", 1), sal = wt(3, "assalamu");
  const shake = [k1, k2].reduce((m, x) => m + (t > x && t < x + 0.25 ? Math.sin((t - x) * 60) * 6 : 0), 0);
  const open = k(t, sal - 0.3, sal + 0.4);
  return (
    <g>
      <defs><linearGradient id="dr22" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a2d2ff" /><stop offset="100%" stopColor="#fff1d6" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#dr22)" />
      <rect x={380} y={500} width={640} height={1000} fill="#ffcad4" /><path d="M 340 520 L 700 300 L 1060 520 Z" fill="#e5383b" />
      <rect x={560} y={880} width={300} height={600} fill="#3a2a2a" />
      <g transform={`translate(${560 + shake} 880) scale(${interp(open, [0, 1], [1, 0.25])},1)`}><rect width={300} height={600} fill="#2a9d8f" /><rect x={30} y={30} width={240} height={250} rx={12} fill="#38b2a3" /><rect x={30} y={320} width={240} height={250} rx={12} fill="#38b2a3" /><circle cx={260} cy={320} r={16} fill="#ffd23f" /></g>
      <rect y={1480} width={W} height={440} fill="#9bd77a" />
      <g transform="translate(420 1650) scale(0.8)"><Seeker uid="k22c" t={t} look={KID} blink={blinkAt(t, 4)} smile={0.9} gazeX={0.8} rArm={t < sal ? [-110 + 30 * Math.abs(Math.sin(t * 10)), -20] : [-150, -30 + 14 * Math.sin(t * 8)]} lArm={[-6, 8]} /></g>
      <g transform="translate(150 1650) scale(0.92)"><Seeker uid="m22b" t={t} look={MUM} blink={blinkAt(t, 5)} smile={0.7} gazeX={0.8} lArm={[-6, 8]} rArm={[-30, 60]} /></g>
      <g transform="translate(250 1420)"><path d="M -60 0 L 60 0 L 50 -60 L -50 -60 Z" fill="#c8873c" /><Fruit kind={0} x={-20} y={-66} s={0.6} /><Fruit kind={3} x={20} y={-64} s={0.6} /></g>
      {[k1, k2].map((x, i) => t > x && t < x + 0.8 && <text key={i} x={820 + i * 20} y={860 - i * 70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill="#2b2d42" opacity={1 - (t - x) / 0.8}>KNOCK!</text>)}
      {pop(t, sal) > 0 && <g transform={`translate(540 760) scale(${pop(t, sal)})`}><rect x={-300} y={-70} width={600} height={130} rx={60} fill="#fff" stroke="#2e7d5b" strokeWidth={8} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#2e7d5b">Assalamu alaikum!</text></g>}
    </g>
  );
};
/* L4: in the friend's room: the kid sits by the bed, smiles, and raises little hands in dua; soft sparkles rise */
const S_Dua: React.FC<{ t: number }> = ({ t }) => {
  const sm = wt(4, "smile"), pr = wt(4, "prayer");
  const up = k(t, pr - 0.4, pr + 0.2);
  return (
    <g>
      <Room t={t} tint="#fff6e8" />
      <Bed x={620} y={1500} />
      <g transform="translate(560 1560) scale(0.78)"><Seeker uid="f22a" t={t} look={PAL} blink={blinkAt(t, 6)} closed={0.4} smile={0.1 + 0.3 * k(t, sm, sm + 0.6)} brow={0.5} tilt={-6} gazeX={-0.6} lArm={[-6, 8]} rArm={[-6, 8]} /></g>
      <Blanket x={620} y={1500} t={t} />
      <Thermo x={760} y={1060} r={40} />
      <rect x={60} y={1360} width={200} height={30} rx={8} fill="#a5673f" /><rect x={70} y={1390} width={20} height={110} fill="#8a5232" /><rect x={230} y={1390} width={20} height={110} fill="#8a5232" />
      <g transform="translate(160 1560) scale(0.72)"><Seeker uid="k22d" t={t} look={KID} blink={blinkAt(t, 7)} smile={t > sm ? 1 : 0.5} closed={up * 0.6} gazeX={0.8} gazeY={-0.2 * up}
        lArm={[-6 - 40 * up, 8 + 110 * up]} rArm={[-6 - 40 * up, 8 + 110 * up]} /></g>
      {up > 0.5 && Array.from({ length: 10 }, (_, i) => { const r = rn(i + 40), d = t - pr - i * 0.15; if (d <= 0) return null; return <circle key={i} cx={260 + r() * 120 + Math.sin(t * 2 + i) * 10} cy={1100 - d * 260} r={5 + r() * 6} fill="#ffd166" opacity={Math.max(0, 1 - d / 2.2)} />; })}
      {pop(t, wt(4, "better")) > 0 && <g transform={`translate(540 760) scale(${pop(t, wt(4, "better"))})`}><rect x={-330} y={-70} width={660} height={130} rx={60} fill="#fff" stroke="#ff7a00" strokeWidth={8} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#ff7a00">May Allah make you better!</text></g>}
    </g>
  );
};
/* L5: the friend sits up and smiles; the thermometer drops away; hearts float up */
const S_Better: React.FC<{ t: number }> = ({ t }) => {
  const sm = wt(5, "smiling"), bt = wt(5, "better");
  const sit = k(t, sm - 0.5, sm + 0.2), drop = k(t, sm, sm + 0.7);
  return (
    <g>
      <Room t={t} tint="#fff1d6" />
      <Bed x={620} y={1500} />
      <g transform={`translate(560 ${1560 - 80 * sit}) scale(0.78)`}><Seeker uid="f22b" t={t} look={PAL} blink={blinkAt(t, 8)} smile={0.2 + 0.8 * sit} wide={0.3 * sit} gazeX={-0.6} lArm={[-6, 8]} rArm={sit > 0.9 ? [-150, -30 + 14 * Math.sin(t * 8)] : [-6, 8]} /></g>
      <Blanket x={620} y={1500} t={t} />
      <Thermo x={760 + 120 * drop} y={1060 + 500 * drop * drop} r={40 + 200 * drop} o={1 - drop} />
      <g transform={`translate(160 ${1560 - Math.abs(Math.sin(t * 7)) * 14 * k(t, bt, bt + 0.3)}) scale(0.72)`}><Seeker uid="k22e" t={t} look={KID} blink={blinkAt(t, 9)} smile={1} wide={0.3} gazeX={0.8} lArm={[-6, 8]} rArm={t > bt ? [-150, -30] : [-6, 8]} /></g>
      {Array.from({ length: 8 }, (_, i) => { const d = t - bt - i * 0.25; return d > 0 && <Heart key={i} x={620 + (i - 3.5) * 60} y={820 - d * 220} s={0.6} o={Math.max(0, 1 - d / 1.8)} />; })}
      <Sparkles t={t} at={bt} cx={560} cy={1000} n={14} />
    </g>
  );
};
/* L6: your turn: the kid calls Grandma on a phone, then waves goodbye (plain linear sky, nothing round behind the head) */
const S_Bye: React.FC<{ t: number }> = ({ t }) => {
  const wave = Math.sin(t * 8) * 18, call = wt(6, "call");
  return (
    <g>
      <defs><linearGradient id="bye22" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#caf0f8" /><stop offset="100%" stopColor="#fff6e8" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#bye22)" />
      {Array.from({ length: 14 }, (_, i) => { const r = rn(i + 260); const y = ((1900 - (t * (50 + r() * 60) + r() * 1900)) % 1900 + 1900) % 1900; return <Heart key={i} x={r() * W} y={y} s={0.4 + r() * 0.4} o={0.45} c={i % 2 ? "#ff8fab" : "#ffd23f"} />; })}
      <g transform="translate(470 2050) scale(1.6)">
        <Seeker uid="by22" t={t} look={KID} blink={blinkAt(t, 10)} smile={1} wide={0.3} rArm={[-150, -30 + wave]} tilt={3 * Math.sin(t * 2)} />
      </g>
      {pop(t, call) > 0 && <g transform={`translate(200 900) scale(${pop(t, call)}) rotate(${8 * Math.sin(t * 12) * (t < call + 1 ? 1 : 0)})`}>
        <rect x={-70} y={-120} width={140} height={240} rx={22} fill="#2b2d42" /><rect x={-56} y={-100} width={112} height={180} rx={10} fill="#8ecae6" />
        <Heart x={0} y={-10} s={0.7} o={1} /><text y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#2b2d42">CALL</text></g>}
    </g>
  );
};

export const KidsAnim1122: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Sick t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Dome t={t} /> },
    { a: b(1), b: b(2), r: (t) => <S_Card t={t} /> },
    { a: b(2), b: b(3), r: (t) => <S_Door t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Dua t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Better t={t} /> },
    { a: b(5), b: KIDS1122_DUR + 1, r: (t) => <S_Bye t={t} /> },
  ];
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [KIDS1122_DUR - 0.6, KIDS1122_DUR], [0, 1]));
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
        <span style={{ background: "#2e7d5b", color: "#fff", borderRadius: 40, padding: "12px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.08em" }}>ISLAM FOR LITTLE ONES · VISIT THE SICK</span>
      </div>
      <Card font={FONT} t={t} a={wt(0, "sick")} b={b(0)} top={300} bg="#ff7a00">My friend is sick…</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.3} b={b(1)} top={300}>Sahih Muslim 2568</Card>
      <Card font={FONT} t={t} a={wt(1, "fruit")} b={b(1)} top={420} bg="#ff7a00" size={44}>Visiting = fruits of Jannah!</Card>
      <Card font={FONT} t={t} a={L(2).start + 0.3} b={b(2)} top={300} bg="#2ec4b6">1 · Make a card, take fruit</Card>
      <Card font={FONT} t={t} a={L(3).start} b={b(3)} top={300} bg="#7b61ff">2 · Knock and say salam</Card>
      <Card font={FONT} t={t} a={L(4).start} b={b(4)} top={300} bg="#ff5a7a">3 · Smile and make dua</Card>
      <Card font={FONT} t={t} a={L(5).start + 0.2} b={b(5)} top={300} bg="#2e7d5b" size={46}>Your visit helps!</Card>
      <Card font={FONT} t={t} a={L(6).start} b={KIDS1122_DUR} top={300} bg="#ff7a00">Your turn! Visit or call</Card>
      <Captions t={t} TL={TL} font={FONT} hi="#ff7a00" base="#9aa0b5" done="#2b2d42" bg="rgba(255,255,255,0.92)" size={62} />
      <AbsoluteFill style={{ background: "#fff6e8", opacity: Math.max(0, ...[b(2), b(3), b(4), b(5)].map((x) => 1 - Math.abs(t - x) / 0.16)) }} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fade, dip) }} />
      {withAudio && <Audio src={staticFile("day1/d1122kids-mix.m4a")} />}
    </AbsoluteFill>
  );
};
