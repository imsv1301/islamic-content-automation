import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1124sadqah-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, Stars, k, flick } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, lin, Captions, Card, Sparkles, Heart, Hand, W, H, rn } from "./AnimKit";

/* One More Sadqah · 24 Nov 2026 · Short 21 "Achhi baat kaho ya khamosh raho" Sahih al-Bukhari 6018 (Hazrat Abu Huraira
   Radi Allahu Anhu): "Whoever believes in Allah and the Last Day should not harm his neighbour; ... should honour his guest;
   ... should say what is good or keep quiet." Warm cinematic palette. Ordinary people act it out (a quarrel on the street,
   neighbours, a guest, a man who stops before a harsh reply); the Sahabi is never shown; when the Prophet ﷺ is mentioned:
   the REAL Green Dome (Pixabay 112360 courtyard frame d1110/dome_b1). No music. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const SADQAH1124_DUR = TL.total;
const FONT = "'Montserrat', sans-serif";
const GOLD = "#f2c46b";
const SHOW: Look = { beard: false, cap: null, top: "#7a2e3a", topD: "#5a1f29", pants: "#1a1f36", shawl: false, hair: "#1a120c", skin: ["#e3b58e", "#c99a72", "#a77850"] };
const SINC: Look = { beard: true, top: "#efe6d2", topD: "#cdbf9f", pants: "#d9cdb2", shawl: false, cap: "#f8f4eb" };
const WIFE: Look = { beard: false, cap: null, hijab: "#6d4c8a", top: "#b59ad0", topD: "#9479b3", shawl: false, long: true, skin: ["#e6bd98", "#cf9d76", "#ad7b55"] };
const SON: Look = { kid: true, beard: false, cap: "#ffffff", top: "#4f8a6b", topD: "#3a6b52", pants: "#2b3a4a", shawl: false, hair: "#24170f" };

const Street: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs><linearGradient id="st22" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#100a18" /><stop offset="100%" stopColor="#3b2416" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#st22)" />
    <Stars t={t} o={0.6} />
    {[[40, 760, 260, 700], [330, 620, 240, 840], [790, 700, 260, 760]].map(([x, y, w, h], i) => <g key={i}><rect x={x} y={y} width={w} height={h} fill="#1c1320" />{Array.from({ length: 6 }, (_, j) => <rect key={j} x={x + 30 + (j % 2) * (w / 2)} y={y + 50 + Math.floor(j / 2) * 140} width={50} height={80} fill="#ffb547" opacity={(i + j) % 3 === 0 ? 0.5 * flick(t, j) : 0.06} />)}</g>)}
    <rect y={1470} width={W} height={450} fill="#2a1a14" />
    <Glow id="sw22" cx={540} cy={1150} r={700} c="#ffb547" o={0.28} />
  </g>
);
const Phone: React.FC<{ x: number; y: number; flash: number; r?: number }> = ({ x, y, flash, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x={-36} y={-64} width={72} height={128} rx={12} fill="#222" stroke="#555" strokeWidth={4} />
    <rect x={-28} y={-54} width={56} height={100} rx={6} fill="#5ab0f0" opacity={0.8} />
    <circle cx={0} cy={-56} r={6} fill="#fff" opacity={flash} />
    {flash > 0.1 && <Glow id={`fl${Math.round(x)}`} cx={0} cy={-56} r={260} c="#ffffff" o={0.7 * flash} />}
  </g>
);

const P_A: Look = { beard: true, top: "#efe6d2", topD: "#cdbf9f", pants: "#d9cdb2", shawl: false, cap: "#f8f4eb" };
const P_B: Look = { beard: false, cap: null, top: "#3d5a80", topD: "#2c4260", pants: "#1a1f36", shawl: false, hair: "#1a120c", skin: ["#e3b58e", "#c99a72", "#a77850"] };
const P_C: Look = { beard: true, cap: null, top: "#6b4c3b", topD: "#4f372a", pants: "#2a2018", shawl: false, hair: "#24170f", beardC: "#9a9a9a", skin: ["#c99a72", "#ad7c55", "#8a5d3a"] };
const P_D: Look = { beard: false, cap: null, hijab: "#6d4c8a", top: "#b59ad0", topD: "#9479b3", shawl: false, long: true, skin: ["#e6bd98", "#cf9d76", "#ad7b55"] };


/* jagged speech bubble (harsh words) flying from (x0,y0) to (x1,y1) as d goes 0..1 */
const Harsh: React.FC<{ d: number; x0: number; y0: number; x1: number; y1: number; label: string }> = ({ d, x0, y0, x1, y1, label }) => d <= 0 || d >= 1 ? null : (
  <g transform={`translate(${interp(d, [0, 1], [x0, x1])} ${interp(d, [0, 1], [y0, y1]) - Math.sin(d * Math.PI) * 120}) rotate(${(d - 0.5) * 20})`}>
    <path d="M -130 -50 L -90 -70 L -60 -50 L -20 -80 L 10 -52 L 60 -78 L 80 -48 L 130 -60 L 112 -16 L 140 20 L 100 40 L 116 76 L 60 60 L 20 86 L -10 56 L -60 80 L -76 46 L -130 56 L -110 10 Z" fill="#e5383b" stroke="#7a1010" strokeWidth={6} />
    <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#fff">{label}</text>
  </g>
);
const BrokenHeart: React.FC<{ x: number; y: number; s: number; crack: number }> = ({ x, y, s, crack }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`translate(${-14 * crack} ${6 * crack}) rotate(${-8 * crack})`}><path d="M 0 -20 C -10 -60 -80 -60 -80 -10 C -80 30 -30 60 0 90 L 10 40 L -12 18 L 8 -4 Z" fill="#ff5a7a" /></g>
    <g transform={`translate(${14 * crack} ${6 * crack}) rotate(${8 * crack})`}><path d="M 0 -20 C 10 -60 80 -60 80 -10 C 80 30 30 60 0 90 L 10 40 L -12 18 L 8 -4 Z" fill="#ff5a7a" /></g>
  </g>
);
/* S0: on the night street a man snaps; red jagged words fly at a friend; on "dil dukhaya" a heart cracks over the friend */
const S_Hurt: React.FC<{ t: number }> = ({ t }) => {
  const zb = wt(0, "zabaan"), kb = wt(0, "kitni"), dl = wt(0, "dil");
  const crack = k(t, dl - 0.1, dl + 0.4), sad = k(t, dl - 0.3, dl + 0.5);
  return (
    <g>
      <Street t={t} />
      <g transform="translate(300 1720) scale(0.85)"><Seeker uid="h24a" t={t} look={P_B} blink={blinkAt(t, 1)} smile={-0.4} brow={-0.8} gazeX={0.7} mouthOpen={t > kb - 0.2 && t < dl ? 0.35 + 0.15 * Math.sin(t * 14) : 0} rArm={t > kb - 0.3 && t < dl + 0.4 ? [-70 + 15 * Math.sin(t * 9), -20] : [-6, 8]} lArm={[-6, 8]} /></g>
      <g transform="translate(800 1720) scale(0.85)"><Seeker uid="h24b" t={t} look={P_C} blink={blinkAt(t, 2)} smile={-0.6 * sad} brow={0.5 - 1.2 * sad} gazeX={-0.6} gazeY={0.4 * sad} tilt={6 * sad} tear={sad > 0.6 ? sad : 0} rArm={[-6, 8]} lArm={t > dl ? [20 * crack, 120 * crack] : [-6, 8]} /></g>
      {["GAALI", "TAANA", "JHOOT"].map((w, i) => <Harsh key={i} d={k(t, kb + i * 0.45, kb + 0.9 + i * 0.45)} x0={420} y0={760} x1={700} y1={720} label={w} />)}
      {crack > 0 && <BrokenHeart x={800} y={760} s={1.3 * pop(t, dl - 0.15)} crack={crack} />}
      {pop(t, zb - 0.1) > 0 && t < kb + 0.3 && <g transform={`translate(540 760) scale(${pop(t, zb - 0.1)})`}><text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={140} fill={GOLD}>ZABAAN</text></g>}
    </g>
  );
};
/* two houses side by side under the night sky; wall between them at x=540 */
const Houses: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs><linearGradient id="hs24" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#120b1a" /><stop offset="100%" stopColor="#3b2416" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#hs24)" />
    <Stars t={t} o={0.6} />
    {[[60, "#5a3824"], [560, "#4a3a5a"]].map(([x, c], i) => <g key={i}><rect x={x as number} y={820} width={460} height={660} fill={c as string} /><path d={`M ${(x as number) - 20} 830 L ${(x as number) + 230} 640 L ${(x as number) + 480} 830 Z`} fill="#2a1a14" /><rect x={(x as number) + 60} y={920} width={120} height={140} fill="#ffcf6a" opacity={0.55 * flick(t, i)} /><rect x={(x as number) + 280} y={920} width={120} height={140} fill="#ffcf6a" opacity={0.4 * flick(t, i + 3)} /><rect x={(x as number) + 170} y={1220} width={120} height={260} fill="#2b1a12" /></g>)}
    <rect y={1480} width={W} height={440} fill="#2a1a14" />
  </g>
);
/* S2: neighbour: harms (SHOR / KACHRA / RAASTA BAND) pop at the neighbour's door and are struck out on "takleef na de"; a man carries the neighbour's shopping instead */
const S_Neighbour: React.FC<{ t: number }> = ({ t }) => {
  const pd = wt(2, "padosi"), tk = wt(2, "takleef");
  const help = k(t, tk + 0.3, L(2).end + 0.3);
  return (
    <g>
      <Houses t={t} />
      {["SHOR", "KACHRA", "RAASTA BAND"].map((w, i) => { const p = pop(t, pd - 0.3 + i * 0.25), x = pop(t, tk + 0.1 + i * 0.12); return p > 0 && <g key={i} transform={`translate(${780} ${560 + i * 120}) scale(${p})`} opacity={1 - 0.5 * Math.min(1, x)}><rect x={-200} y={-46} width={400} height={92} rx={30} fill="#2c2030" stroke="#e5383b" strokeWidth={5} /><text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#fff">{w}</text>{x > 0 && <line x1={-190} y1={0} x2={-190 + 380 * Math.min(1, x)} y2={0} stroke="#e5383b" strokeWidth={12} strokeLinecap="round" />}</g>; })}
      <g transform={`translate(${260 + 380 * help} 1720) scale(0.75)`}><g transform={`translate(0 ${-Math.abs(Math.sin(t * 9)) * 12 * (help > 0 && help < 1 ? 1 : 0)})`}><Seeker uid="n24a" t={t} look={P_A} blink={blinkAt(t, 3)} smile={0.8} gazeX={0.6} rArm={[-30, 70]} lArm={[-30, 70]} /></g>
        <rect x={-70} y={-470} width={140} height={110} rx={14} fill="#c8a46a" /><path d="M -50 -470 q 50 -50 100 0" stroke="#8a6a3a" strokeWidth={8} fill="none" /><circle cx={-30} cy={-480} r={16} fill="#e76f51" /><rect x={10} y={-500} width={20} height={40} fill="#2a9d8f" /></g>
      <g transform="translate(900 1720) scale(0.7)"><Seeker uid="n24b" t={t} look={{ ...P_C, beardC: "#d0d0d0" }} blink={blinkAt(t, 4)} smile={0.2 + 0.8 * help} gazeX={-0.7} rArm={[-6, 8]} lArm={help > 0.8 ? [-60, 40] : [-6, 8]} /></g>
      {help > 0.85 && <Heart x={760} y={1050 - 40 * Math.sin(t * 2)} s={1.2} o={k(t, L(2).end - 0.2, L(2).end + 0.3)} />}
    </g>
  );
};
/* S3: a guest knocks; the host opens the door, hand on heart, a tray of tea and dates pops on "izzat" */
const S_Guest: React.FC<{ t: number }> = ({ t }) => {
  const mh = wt(3, "mehmaan"), iz = wt(3, "izzat");
  const open = k(t, mh - 0.4, mh + 0.3), tray = pop(t, iz - 0.2);
  return (
    <g>
      <defs><linearGradient id="gs24" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a1810" /><stop offset="100%" stopColor="#5a3420" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#gs24)" />
      <Glow id="gw24" cx={540} cy={900} r={700} c="#ffb547" o={0.25} />
      <rect x={380} y={700} width={320} height={800} fill="#ffcf6a" opacity={0.35} />
      <path d={`M 380 700 L ${380 + 320 * (1 - open)} ${700 + 40 * open} L ${380 + 320 * (1 - open)} ${1500 - 40 * open} L 380 1500 Z`} fill="#6b4630" stroke="#4f3322" strokeWidth={8} />
      <rect y={1500} width={W} height={420} fill="#3a2418" />
      <g transform="translate(280 1740) scale(0.8)"><Seeker uid="g24a" t={t} look={P_A} blink={blinkAt(t, 5)} smile={0.9} gazeX={0.7} rArm={t > mh ? [10, 140] : [-6, 8]} lArm={tray > 0 ? [-40, 70] : [-6, 8]} /></g>
      <g transform={`translate(${880 - 120 * open} 1740) scale(0.8)`}><Seeker uid="g24b" t={t} look={P_B} blink={blinkAt(t, 6)} smile={0.3 + 0.6 * tray} gazeX={-0.7} rArm={t < mh - 0.4 ? [-120, -40 + 30 * Math.sin(t * 10)] : [-6, 8]} lArm={[-6, 8]} /></g>
      {tray > 0 && <g transform={`translate(470 ${1290}) scale(${tray})`}><ellipse rx={150} ry={30} fill="#c9a14a" /><rect x={-80} y={-60} width={44} height={52} rx={8} fill="#fff8e8" /><rect x={-20} y={-60} width={44} height={52} rx={8} fill="#fff8e8" />{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={60 + (i % 2) * 30} cy={-18 - Math.floor(i / 2) * 18} rx={16} ry={10} fill="#5a2a14" />)}{Array.from({ length: 3 }, (_, i) => { const d = (t * 0.6 + i * 0.33) % 1; return <path key={i} d={`M ${-70 + i * 30} ${-70 - d * 90} q 10 -24 0 -48`} stroke="#fff" strokeWidth={4} fill="none" opacity={(1 - d) * 0.5} />; })}</g>}
      {pop(t, iz - 0.2) > 0 && <g transform={`translate(540 560) scale(${pop(t, iz - 0.2)})`}><rect x={-300} y={-70} width={600} height={130} rx={60} fill={GOLD} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#1d1420">IZZAT</text></g>}
    </g>
  );
};
/* S4: the choice: a big ACHHI BAAT bubble (green, with a heart) or KHAMOSHI (a closed mouth with a zip) */
const S_Choice: React.FC<{ t: number }> = ({ t }) => {
  const ac = wt(4, "achhi"), kh = wt(4, "khamosh");
  const pa = pop(t, ac - 0.2), pk = pop(t, kh - 0.2);
  return (
    <g>
      <Street t={t} />
      <g transform="translate(540 1760) scale(0.95)"><Seeker uid="c24" t={t} look={P_B} blink={blinkAt(t, 7)} smile={0.5} brow={0.3} gazeX={t < kh ? -0.5 : 0.5} gazeY={-0.3} rArm={t < kh ? [-60, 20] : [-6, 8]} lArm={t >= kh ? [-60, 20] : [-6, 8]} /></g>
      {pa > 0 && <g transform={`translate(290 760) scale(${pa})`}><rect x={-220} y={-110} width={440} height={220} rx={60} fill="#2ec27e" /><path d="M 60 100 L 110 170 L 120 100 Z" fill="#2ec27e" /><text y={-6} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill="#fff">ACHHI</text><text y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill="#fff">BAAT</text><Heart x={170} y={-90} s={0.9} o={1} /></g>}
      {pk > 0 && <g transform={`translate(800 760) scale(${pk})`}><rect x={-220} y={-110} width={440} height={220} rx={60} fill="#1d1420" stroke={GOLD} strokeWidth={6} /><path d="M -80 0 Q 0 30 80 0" stroke="#e8a090" strokeWidth={18} fill="none" strokeLinecap="round" />{Array.from({ length: 7 }, (_, i) => <line key={i} x1={-66 + i * 22} y1={-2 + Math.sin(i) * 4} x2={-66 + i * 22} y2={22} stroke={GOLD} strokeWidth={6} />)}<text y={84} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={GOLD}>KHAMOSHI</text></g>}
      {pk > 0 && <text x={545} y={780} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#fff" opacity={pk}>YA</text>}
    </g>
  );
};
/* S5: the same man gets angry (red glow on the phone, steam), a STOP sign on "rukein", he closes his eyes, a "?" thought bubble */
const S_Stop: React.FC<{ t: number }> = ({ t }) => {
  const gh = wt(5, "ghusse"), rk = wt(5, "rukein"), so = wt(5, "sochein");
  const angry = k(t, gh - 0.3, gh + 0.4) * (1 - k(t, rk, rk + 0.5)), stop = pop(t, rk - 0.15, 0.25), think = pop(t, so - 0.2);
  return (
    <g>
      <rect width={W} height={H} fill="#1a0f14" />
      <rect width={W} height={H} fill="#e5383b" opacity={0.18 * angry} />
      <g transform="translate(540 2150) scale(1.45)"><Seeker uid="s24" t={t} look={P_B} blink={blinkAt(t, 8)} closed={t > rk + 0.2 ? 0.9 : 0} smile={-0.6 * angry} brow={-1 * angry + 0.3 * (1 - angry)} gazeY={0.3} lArm={[10, 140]} rArm={[-6, 8]} /></g>
      <g transform="translate(470 1420) rotate(-8)"><rect x={-60} y={-110} width={120} height={220} rx={16} fill="#222" stroke="#555" strokeWidth={5} /><rect x={-50} y={-96} width={100} height={180} rx={8} fill="#5ab0f0" opacity={0.85} />{angry > 0.2 && <rect x={-44} y={-40} width={88} height={14} rx={7} fill="#e5383b" opacity={angry} />}{angry > 0.2 && <rect x={-44} y={-16} width={60} height={14} rx={7} fill="#e5383b" opacity={angry} />}</g>
      {angry > 0.1 && [0, 1, 2].map((i) => { const d = (t * 0.9 + i * 0.33) % 1; return <path key={i} d={`M ${470 + i * 70} ${820 - d * 160} q 18 -30 0 -60 q -18 -30 0 -60`} stroke="#ddd" strokeWidth={8} fill="none" opacity={(1 - d) * angry * 0.7} />; })}
      {stop > 0 && <g transform={`translate(800 680) scale(${stop})`}><path d="M -80 -193 L 80 -193 L 193 -80 L 193 80 L 80 193 L -80 193 L -193 80 L -193 -80 Z" fill="#e5383b" stroke="#fff" strokeWidth={12} /><text y={30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill="#fff">RUKEIN</text></g>}
      {think > 0 && <g transform={`translate(280 620) scale(${think})`}><ellipse rx={230} ry={130} fill="#fff" /><circle cx={120} cy={170} r={26} fill="#fff" /><circle cx={160} cy={230} r={16} fill="#fff" /><text y={-10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#1d1420">ACHHI</text><text y={56} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#1d1420">HAI?</text></g>}
    </g>
  );
};
/* S6: he stays quiet and smiles; the harsh red words melt into rose petals; the friend calms down */
const S_Calm: React.FC<{ t: number }> = ({ t }) => {
  const a = L(6).start, bh = wt(6, "behtar");
  const melt = k(t, a + 0.2, a + 1.4);
  return (
    <g>
      <Street t={t} />
      <g transform="translate(300 1720) scale(0.85)"><Seeker uid="m24a" t={t} look={P_B} blink={blinkAt(t, 9)} smile={0.7} brow={0.4} gazeX={0.7} rArm={t > bh - 0.4 ? [10, 140] : [-6, 8]} lArm={[-6, 8]} /></g>
      <g transform="translate(800 1720) scale(0.85)"><Seeker uid="m24b" t={t} look={P_C} blink={blinkAt(t, 10)} smile={0.8 * melt} brow={0.4 * melt} gazeX={-0.6} rArm={[-6, 8]} lArm={t > bh ? [-70, 30] : [-6, 8]} /></g>
      {Array.from({ length: 14 }, (_, i) => { const r = rn(i + 240), d = melt; const x = 450 + r() * 200 + d * (r() - 0.5) * 300, y = 1000 + r() * 60 + d * 500; return <path key={i} transform={`translate(${x} ${y}) rotate(${r() * 360 + t * 60})`} d={d < 0.35 ? "M -22 -16 L 20 -12 L 14 18 L -18 14 Z" : "M 0 -14 Q 14 0 0 14 Q -14 0 0 -14 Z"} fill={d < 0.35 ? "#e5383b" : "#ff8fa3"} opacity={1 - 0.6 * Math.max(0, d - 0.7)} />; })}
      {pop(t, bh - 0.2) > 0 && <g transform={`translate(540 700) scale(${pop(t, bh - 0.2)})`}><rect x={-380} y={-70} width={760} height={130} rx={60} fill={GOLD} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#1d1420">KHAMOSHI BEHTAR HAI</text></g>}
    </g>
  );
};
/* S1: light over the real Green Dome photo */
const S_Dome: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={W} height={H} fill="#2a1408" opacity={0.18} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${80 + i * 130} -40 L ${150 + i * 130} -40 L ${250 + i * 140} 1920 L ${30 + i * 120} 1920 Z`} fill="#ffe8b0" opacity={0.04 + 0.03 * Math.sin(t * 1.3 + i)} />)}
  </g>
);
/* S6: hands raised in dua; the comment box types the dua */
const S_Dua: React.FC<{ t: number }> = ({ t }) => {
  const a = L(7).start, txt = "Ya Allah, hamari zabaan ko khair ka zariya bana!", n = Math.floor(interp(t, [a + 0.8, L(7).end], [0, txt.length]));
  const up = k(t, a - 0.2, a + 0.5);
  return (
    <g>
      <rect width={W} height={H} fill="#140d1c" />
      <Stars t={t} o={0.8} />
      <Glow id="du23" cx={540} cy={1500} r={700} c="#ffb547" o={0.25} />
      <g transform={`translate(0 ${80 * (1 - up)})`}>
        <Hand x={390} y={1720} s={1.6} r={-12} skin="#c99a72" curl={0.15} />
        <Hand x={690} y={1720} s={1.6} r={12} skin="#c99a72" flip curl={0.15} />
      </g>
      <g transform={`translate(540 800) scale(${pop(t, a + 0.3, 0.4)})`}>
        <rect x={-450} y={-170} width={900} height={360} rx={50} fill="#1d1420" stroke={GOLD} strokeWidth={6} />
        <text x={-390} y={-80} fontFamily={FONT} fontWeight={800} fontSize={40} fill="#cbb98f">Comment</text>
        <rect x={-390} y={-40} width={780} height={180} rx={30} fill="#2c2030" />
        <text x={-360} y={40} fontFamily={FONT} fontWeight={800} fontSize={42} fill="#fff">{txt.slice(0, Math.min(n, 24))}</text>
        <text x={-360} y={100} fontFamily={FONT} fontWeight={800} fontSize={42} fill="#fff">{n > 24 ? txt.slice(24, n) : ""}<tspan fill={GOLD} opacity={Math.sin(t * 10) > 0 ? 1 : 0}>|</tspan></text>
      </g>
    </g>
  );
};
/* S7: share = another sadqah: the lesson travels from lamp to lamp */
const S_Share: React.FC<{ t: number }> = ({ t }) => {
  const a = L(8).start;
  return (
    <g>
      <defs><linearGradient id="sh23" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#120b1a" /><stop offset="100%" stopColor="#2f1d14" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#sh23)" />
      <Stars t={t} />
      {Array.from({ length: 5 }, (_, i) => { const on = k(t, a + 0.3 + i * 0.45, a + 0.6 + i * 0.45); const x = 140 + i * 200, y = 1250 - (i % 2) * 140; return <g key={i} transform={`translate(${x} ${y})`}><line x1={0} y1={-500} x2={0} y2={-90} stroke="#5a3b22" strokeWidth={4} /><path d="M -40 -90 L 40 -90 L 30 0 L -30 0 Z" fill="#8a5a2a" /><path d="M -26 -78 L 26 -78 L 20 -10 L -20 -10 Z" fill="#ffe2a0" opacity={0.15 + 0.85 * on * flick(t, i)} /><Glow id={`sl23${i}`} cx={0} cy={-45} r={200} c="#ffb547" o={0.6 * on} /></g>; })}
      <g transform={`translate(540 760) scale(${1.5 * pop(t, a + 0.2)})`}><circle r={110} fill={GOLD} /><path d="M -40 30 Q -30 -40 30 -40 L 30 -70 L 80 -20 L 30 30 L 30 0 Q -20 -5 -40 30 Z" fill="#1d1420" /></g>
    </g>
  );
};

const HadithCard: React.FC<{ t: number }> = ({ t }) => {
  const a = L(4).start - 0.2, b = (L(4).end + L(5).start) / 2;
  if (t < a || t > b + 0.2) return null;
  const p = pop(t, a, 0.5), o = interp(t, [b - 0.2, b + 0.2], [1, 0]);
  return <div style={{ position: "absolute", left: 50, right: 50, top: 250, opacity: o * p, transform: `translateY(${(1 - p) * 40}px)`, background: "rgba(20,12,24,0.9)", border: `4px solid ${GOLD}`, borderRadius: 36, padding: "26px 26px 22px", textAlign: "center" }}>
    <div style={{ fontFamily: "Amiri", fontSize: 54, color: GOLD, direction: "rtl", lineHeight: 1.55 }}>وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ<br />فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ</div>
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: "#fff", marginTop: 8, lineHeight: 1.3 }}>"Jo Allah aur aakhirat ke din par imaan rakhta hai, woh achhi baat kahe, ya khamosh rahe."</div>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#cbb98f", marginTop: 12, letterSpacing: "0.08em" }}>SAHIH AL-BUKHARI 6018</div>
  </div>;
};

export const SadqahAnim1124: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Hurt t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Dome t={t} /> },
    { a: b(1), b: b(2), r: (t) => <S_Neighbour t={t} /> },
    { a: b(2), b: b(3), r: (t) => <S_Guest t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Choice t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Stop t={t} /> },
    { a: b(5), b: b(6), r: (t) => <S_Calm t={t} /> },
    { a: b(6), b: b(7), r: (t) => <S_Dua t={t} /> },
    { a: b(7), b: SADQAH1124_DUR + 1, r: (t) => <S_Share t={t} /> },
  ];
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [SADQAH1124_DUR - 0.7, SADQAH1124_DUR], [0, 1]));
  const domeA = b(0), domeB = b(1);
  /* hard cuts only (no cross-fades), each through a short dip to black */
  const dip = Math.max(0, ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => 1 - Math.abs(t - b(i)) / 0.16));
  const push = 1 + 0.04 * ((t % 6) / 6);
  return (
    <AbsoluteFill style={{ background: "#140d1c" }}>
      {t >= domeA && t < domeB && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img src={staticFile("d1110/dome_b1.jpg")} style={{ width: W, height: H, objectFit: "cover", transformOrigin: "50% 50%", transform: `scale(${1.03 + 0.12 * k(t, domeA, domeB)})`, filter: "saturate(1.05) sepia(0.12)" }} />
        </AbsoluteFill>
      )}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => (t >= s.a && t < s.b ? <g key={i} transform={`translate(540 960) scale(${i === 1 ? 1 : push}) translate(-540 -960)`}>{s.r(t)}</g> : null))}
      </svg>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ background: "rgba(20,12,24,0.85)", color: GOLD, border: `3px solid ${GOLD}`, borderRadius: 40, padding: "10px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: "0.1em" }}>ONE MORE SADQAH · HADITH</span>
      </div>
      <Card font={FONT} t={t} a={L(0).start + 0.2} b={b(0)} top={260} bg="rgba(20,12,24,0.9)" fg={GOLD} border={`4px solid ${GOLD}`} size={48}>Zabaan ek, zakhm kitne?</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.2} b={b(1)} top={260} bg="rgba(20,12,24,0.9)" fg="#fff" border={`4px solid ${GOLD}`} size={40}>Hazrat Abu Huraira (Radi Allahu Anhu)</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.6} b={b(1)} top={370} bg={GOLD} fg="#1d1420" size={44}>Sahih al-Bukhari 6018</Card>
      <Card font={FONT} t={t} a={wt(2, "padosi") - 0.2} b={b(2)} top={260} bg="rgba(20,12,24,0.9)" fg={GOLD} border={`4px solid ${GOLD}`} size={42}>1 · Padosi ko takleef na do</Card>
      <Card font={FONT} t={t} a={wt(3, "mehmaan") - 0.2} b={b(3)} top={260} bg="rgba(20,12,24,0.9)" fg={GOLD} border={`4px solid ${GOLD}`} size={42}>2 · Mehmaan ki izzat karo</Card>
      <HadithCard t={t} />
      <Card font={FONT} t={t} a={L(8).start + 0.3} b={SADQAH1124_DUR} top={1000} bg={GOLD} fg="#1d1420" size={48}>Aage bhejein = ek aur sadqah</Card>
      <Captions t={t} TL={TL} font={FONT} hi={GOLD} base="#a99b86" done="#ffffff" bg="rgba(20,12,24,0.85)" size={54} top={1600} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fade, dip) }} />
      {withAudio && <Audio src={staticFile("day1/d1124sadqah-mix.m4a")} />}
    </AbsoluteFill>
  );
};
