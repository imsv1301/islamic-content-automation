import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1123sadqah-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, Stars, k, flick } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, lin, Captions, Card, Sparkles, Heart, Hand, W, H, rn } from "./AnimKit";

/* One More Sadqah · 23 Nov 2026 · Short 20 "Sab se behtareen khana?" Sahih al-Bukhari 2072 (Hazrat Miqdam Radi Allahu Anhu):
   "Nobody has ever eaten a better meal than what he earned with his own hands; and Allah's Prophet Dawud (Alaihis Salam)
   used to eat from the earnings of his own hands." Warm cinematic palette. Ordinary working people act it out; Hazrat Dawud
   (Alaihis Salam) and the Sahabi are never shown (an empty workshop only); when the Prophet ﷺ is mentioned: the REAL Green
   Dome (Pixabay 198164, muhammadarhamamin77800). No music. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const SADQAH1123_DUR = TL.total;
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

/* S0: a five-star hotel table under a chandelier: a silver cloche lifts on "khana", a HOTEL ★★★★★ sign on "hotel", a red NAHIN stamp */
const S_Hotel: React.FC<{ t: number }> = ({ t }) => {
  const kh = wt(0, "khana"), ht = wt(0, "hotel"), nh = wt(0, "nahin");
  const lift = k(t, kh - 0.2, kh + 0.5), stamp = pop(t, nh - 0.15, 0.25);
  return (
    <g>
      <defs><linearGradient id="ht23" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a0f14" /><stop offset="100%" stopColor="#3b2416" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#ht23)" />
      <g transform="translate(540 300)">{Array.from({ length: 7 }, (_, i) => <g key={i}><line x1={0} y1={-300} x2={(i - 3) * 60} y2={40} stroke="#c9a14a" strokeWidth={3} /><path d={`M ${(i - 3) * 60 - 10} 40 L ${(i - 3) * 60 + 10} 40 L ${(i - 3) * 60} 80 Z`} fill="#fff3c4" opacity={flick(t, i)} /></g>)}
        <Glow id="ch23" cx={0} cy={60} r={380} c="#ffcf6a" o={0.35} /></g>
      {pop(t, ht - 0.2) > 0 && <g transform={`translate(540 640) scale(${pop(t, ht - 0.2)})`}><rect x={-260} y={-80} width={520} height={160} rx={30} fill="#1d1420" stroke={GOLD} strokeWidth={6} /><text y={-6} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#fff">HOTEL</text><text y={56} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={GOLD}>★★★★★</text></g>}
      <ellipse cx={540} cy={1330} rx={460} ry={90} fill="#f4efe6" />
      <ellipse cx={540} cy={1310} rx={260} ry={50} fill="#d8d2c4" />
      <ellipse cx={540} cy={1290} rx={180} ry={34} fill="#c07a3a" />
      {Array.from({ length: 5 }, (_, i) => { const d = (t * 0.6 + i * 0.2) % 1; return lift > 0.5 && <path key={i} d={`M ${480 + i * 30} ${1250 - d * 200} q 12 -30 0 -60`} stroke="#fff" strokeWidth={5} fill="none" opacity={(1 - d) * 0.5} />; })}
      <g transform={`translate(540 ${1300 - 260 * lift}) rotate(${-14 * lift})`}><path d="M -200 0 Q -200 -200 0 -210 Q 200 -200 200 0 Z" fill="#cfd3dc" stroke="#9aa0ad" strokeWidth={6} /><circle cy={-226} r={18} fill="#9aa0ad" /></g>
      {[[260, 1360], [820, 1360]].map(([x, y], i) => <g key={i}><rect x={x - 6} y={y - 120} width={12} height={110} fill="#d8d2c4" /><path d={`M ${x - 30} ${y - 200} L ${x + 30} ${y - 200} L ${x + 10} ${y - 120} L ${x - 10} ${y - 120} Z`} fill="#d8d2c4" /></g>)}
      {stamp > 0 && <g transform={`translate(540 980) rotate(-12) scale(${2 - stamp})`} opacity={Math.min(1, stamp)}><rect x={-280} y={-90} width={560} height={180} rx={20} fill="none" stroke="#e5383b" strokeWidth={14} /><text y={36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill="#e5383b">NAHIN!</text></g>}
    </g>
  );
};
const Roti: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse rx={200} ry={44} fill="#e8e1d2" /><ellipse cx={-70} cy={-10} rx={70} ry={22} fill="#d9a25a" /><ellipse cx={-70} cy={-14} rx={54} ry={14} fill="#e8b874" /><ellipse cx={80} cy={-12} rx={70} ry={24} fill="#7a4a1e" /><ellipse cx={80} cy={-16} rx={56} ry={15} fill="#c8862f" /></g>
);
/* S2: a worker comes home in the evening: wages drop into his palm on "kamaai", then the simple roti + daal at home with his family */
const S_Home: React.FC<{ t: number }> = ({ t }) => {
  const km = wt(2, "kamaai"), kh = wt(2, "khana");
  const coins = k(t, km - 0.3, km + 0.3), eat = k(t, kh - 0.4, kh + 0.3);
  return (
    <g>
      <Street t={t} />
      <rect x={60} y={1360} width={960} height={36} rx={10} fill="#5a3824" />
      <Roti x={540} y={1340} s={0.9 * eat + 0.001} />
      <g transform="translate(250 1720) scale(0.78)"><Seeker uid="w23a" t={t} look={P_B} blink={blinkAt(t, 1)} smile={0.4 + 0.6 * eat} gazeX={0.6} gazeY={0.3} lArm={[-6, 8]} rArm={t < kh ? [-50, 70] : [-20, 90]} /></g>
      <g transform="translate(820 1720) scale(0.74)"><Seeker uid="w23b" t={t} look={P_D} blink={blinkAt(t, 2)} smile={0.8 * eat} gazeX={-0.6} gazeY={0.3} lArm={[-6, 8]} rArm={[-6, 8]} /></g>
      <g transform="translate(640 1720) scale(0.5)"><Seeker uid="w23c" t={t} look={SON} blink={blinkAt(t, 3)} smile={0.9 * eat} gazeX={-0.4} gazeY={0.4} lArm={[-6, 8]} rArm={[-6, 8]} /></g>
      {Array.from({ length: 4 }, (_, i) => { const d = k(t, km - 0.3 + i * 0.12, km + i * 0.12); return d > 0 && d < 1 && <g key={i} transform={`translate(${360 + i * 6} ${interp(d, [0, 1], [700, 1240])})`}><circle r={26} fill={GOLD} stroke="#a77a20" strokeWidth={4} /></g>; })}
      {coins > 0.9 && t < kh && <g transform="translate(370 1240)"><circle r={30} fill={GOLD} /><circle cx={24} cy={-10} r={30} fill={GOLD} /></g>}
      {pop(t, km - 0.2) > 0 && <g transform={`translate(540 760) scale(${pop(t, km - 0.2)})`}><rect x={-340} y={-60} width={680} height={110} rx={50} fill={GOLD} /><text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#1d1420">APNE HAATH KI KAMAAI</text></g>}
      <Sparkles t={t} at={kh} cx={540} cy={1300} n={12} c={GOLD} />
    </g>
  );
};
/* S3: an empty craftsman's workshop in lamplight: tools on a bench, a ring of metal links gleams (nobody is shown) */
const S_Shop: React.FC<{ t: number }> = ({ t }) => {
  const a = L(3).start, gl = k(t, wt(3, "kamaai") - 0.3, wt(3, "kamaai") + 0.4);
  return (
    <g>
      <defs><linearGradient id="ws23" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#140c10" /><stop offset="100%" stopColor="#3a2414" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#ws23)" />
      <rect x={120} y={500} width={300} height={360} rx={16} fill="#2a1a20" stroke="#5a3824" strokeWidth={10} /><rect x={140} y={520} width={260} height={320} fill="#ffcf6a" opacity={0.12 + 0.05 * Math.sin(t)} />
      <Glow id="lp23" cx={760} cy={720} r={520} c="#ffb547" o={0.4 * flick(t, 2)} />
      <g transform="translate(760 620)"><line x1={0} y1={-300} x2={0} y2={-40} stroke="#5a3b22" strokeWidth={4} /><path d="M -40 -40 L 40 -40 L 30 40 L -30 40 Z" fill="#8a5a2a" /><path d="M -26 -28 L 26 -28 L 20 30 L -20 30 Z" fill="#ffe2a0" opacity={flick(t, 1)} /></g>
      <rect x={80} y={1200} width={920} height={50} rx={10} fill="#6b4630" /><rect x={120} y={1250} width={40} height={300} fill="#4f3322" /><rect x={920} y={1250} width={40} height={300} fill="#4f3322" />
      <g transform={`translate(300 1180) rotate(${-20 + 3 * Math.sin(t * 1.5)})`}><rect x={-8} y={-200} width={16} height={200} rx={6} fill="#8a5a2a" /><rect x={-50} y={-230} width={100} height={46} rx={8} fill="#7a7f8a" /></g>
      <g transform="translate(470 1190)"><rect x={-90} y={-30} width={180} height={30} rx={8} fill="#5a5f6a" /><rect x={-50} y={-80} width={100} height={50} rx={8} fill="#6a707b" /></g>
      <g transform={`translate(760 1090) scale(${1 + 0.05 * gl})`}>
        {Array.from({ length: 14 }, (_, i) => { const a2 = (i / 14) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a2) * 110} cy={Math.sin(a2) * 70} rx={26} ry={16} fill="none" stroke={gl > 0.2 ? "#e9d8a6" : "#8a8f99"} strokeWidth={8} transform={`rotate(${(a2 * 180) / Math.PI + 90} ${Math.cos(a2) * 110} ${Math.sin(a2) * 70})`} />; })}
      </g>
      <Sparkles t={t} at={wt(3, "kamaai")} cx={760} cy={1090} n={12} c={GOLD} />
      {Array.from({ length: 10 }, (_, i) => { const r = rn(i + 90), d = ((t - a) * 0.4 + r()) % 1; return <circle key={i} cx={200 + r() * 700} cy={1180 - d * 600} r={3 + r() * 3} fill="#ffcf6a" opacity={(1 - d) * 0.7} />; })}
    </g>
  );
};
const Brick: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-60} y={-26} width={120} height={52} rx={6} fill="#b5532f" stroke="#7a3520" strokeWidth={4} /></g>;
/* S4: three honest workers pop in on their words: a labourer with a hard hat + bricks, a shopkeeper at his counter, a taxi driver at the wheel */
const S_Workers: React.FC<{ t: number }> = ({ t }) => {
  const m = wt(4, "mazdoor"), d = wt(4, "dukaandaar"), dr = wt(4, "driver"), sh = wt(4, "sharam");
  const pm = pop(t, m - 0.2), pd = pop(t, d - 0.2), pr = pop(t, dr - 0.2);
  return (
    <g>
      <Street t={t} />
      {pm > 0 && <g transform={`translate(180 ${1480 + 300 * (1 - Math.min(1, pm))})`}>
        <g transform="scale(0.62)"><Seeker uid="lb23" t={t} look={{ ...P_C, cap: "#ffbe0b" }} blink={blinkAt(t, 4)} smile={0.6} gazeX={0.4} lArm={[-6, 8]} rArm={[-120, -60]} /></g>
        <Brick x={40} y={-640 + 4 * Math.sin(t * 4)} s={0.7} /><Brick x={40} y={-676 + 4 * Math.sin(t * 4)} s={0.7} /></g>}
      {pd > 0 && <g transform={`translate(540 ${1480 + 300 * (1 - Math.min(1, pd))})`}>
        <g transform="scale(0.62)"><Seeker uid="sk23" t={t} look={P_A} blink={blinkAt(t, 5)} smile={0.8} gazeX={0} lArm={[-30, 60]} rArm={[-30, 60]} /></g>
        <rect x={-170} y={-260} width={340} height={260} rx={12} fill="#5a3824" stroke="#8a5a2a" strokeWidth={6} />
        {[0, 1, 2].map((i) => <rect key={i} x={-130 + i * 95} y={-300} width={70} height={44} rx={8} fill={["#e76f51", "#2a9d8f", "#e9c46a"][i]} />)}
        <text y={-120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={GOLD}>DUKAAN</text></g>}
      {pr > 0 && <g transform={`translate(880 ${1400 + 300 * (1 - Math.min(1, pr))})`}>
        <rect x={-180} y={-420} width={360} height={230} rx={40} fill="#ffbe0b" />
        <rect x={-150} y={-400} width={300} height={130} rx={24} fill="#9ed0f0" opacity={0.6} />
        <g transform="translate(0 -40) scale(0.5)"><Seeker uid="dr23" t={t} look={P_B} blink={blinkAt(t, 6)} smile={0.8} gazeX={-0.4} lArm={[-40, 60]} rArm={[-40, 60]} /></g>
        <rect x={-180} y={-260} width={360} height={150} rx={20} fill="#ffbe0b" />
        <circle cx={0} cy={-230} r={46} fill="none" stroke="#333" strokeWidth={10} transform={`rotate(${20 * Math.sin(t * 2)} 0 -230)`} />
        <rect x={-60} y={-470} width={120} height={50} rx={10} fill="#222" /><text y={-434} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={GOLD}>TAXI</text>
        {[-120, 120].map((wx, i) => <circle key={i} cx={wx} cy={-100} r={44} fill="#222" />)}</g>}
      {pop(t, sh - 0.2) > 0 && <g transform={`translate(540 700) scale(${pop(t, sh - 0.2)})`}><rect x={-370} y={-70} width={740} height={130} rx={60} fill={GOLD} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#1d1420">HALAAL MEHNAT = IZZAT</text></g>}
    </g>
  );
};
/* S5: close on the labourer: he wipes his brow, the drops of sweat fall and turn to gold light on "izzat" */
const S_Sweat: React.FC<{ t: number }> = ({ t }) => {
  const ps = wt(5, "paseene"), bd = wt(5, "boond"), iz = wt(5, "izzat");
  const wipe = Math.sin(k(t, ps - 0.2, ps + 0.8) * Math.PI);
  return (
    <g>
      <defs><linearGradient id="sw23b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a1f14" /><stop offset="100%" stopColor="#c26a2a" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#sw23b)" />
      <rect y={1560} width={W} height={360} fill="#5a2f1a" />
      <g transform="translate(540 2200) scale(1.5)"><Seeker uid="sw23" t={t} look={{ ...P_C, cap: "#ffbe0b" }} blink={blinkAt(t, 7)} closed={0.2} smile={0.3 + 0.6 * k(t, iz - 0.3, iz + 0.3)} brow={0.2} gazeY={-0.2} lArm={[-6, 8]} rArm={[-120 + 30 * wipe, -80 + 20 * wipe]} /></g>
      {Array.from({ length: 6 }, (_, i) => { const at = bd - 0.2 + i * 0.25, d = t - at; if (d < 0) return null; const y = 980 + d * 520, gold = t > iz - 0.2; return y < 1560 && <path key={i} transform={`translate(${i % 2 ? 330 - (i % 3) * 30 : 750 + (i % 3) * 30} ${y})`} d="M 0 -26 Q 18 0 0 14 Q -18 0 0 -26 Z" fill={gold ? GOLD : "#bfe3ff"} opacity={0.9} />; })}
      {pop(t, iz - 0.2) > 0 && <text x={540} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130 * pop(t, iz - 0.2)} fill={GOLD}>IZZAT</text>}
      <Sparkles t={t} at={iz} cx={540} cy={1200} n={16} c={GOLD} />
    </g>
  );
};
/* S6: dawn at the front door: hand on heart for the niyyat, his wife and son wave, he walks off to work */
const S_Niyyat: React.FC<{ t: number }> = ({ t }) => {
  const ny = wt(6, "niyyat"), gh = wt(6, "ghar");
  const go = k(t, gh, L(6).end + 0.3);
  return (
    <g>
      <defs><linearGradient id="dn23" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a2350" /><stop offset="60%" stopColor="#e88a4a" /><stop offset="100%" stopColor="#f6c27a" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#dn23)" />
      <rect x={640} y={820} width={380} height={700} fill="#5a3824" /><rect x={740} y={1050} width={180} height={470} fill="#2b1a12" /><rect x={760} y={1070} width={140} height={430} fill="#ffcf6a" opacity={0.5} />
      <rect y={1500} width={W} height={420} fill="#6b4a32" />
      <g transform="translate(860 1700) scale(0.7)"><Seeker uid="nw23" t={t} look={P_D} blink={blinkAt(t, 8)} smile={0.9} gazeX={-0.8} lArm={[-6, 8]} rArm={t > gh - 0.6 ? [-150, -30 + 18 * Math.sin(t * 8)] : [-6, 8]} /></g>
      <g transform="translate(700 1700) scale(0.46)"><Seeker uid="ns23" t={t} look={SON} blink={blinkAt(t, 9)} smile={1} gazeX={-0.8} lArm={[-6, 8]} rArm={t > gh - 0.6 ? [-150, -30 + 18 * Math.sin(t * 9)] : [-6, 8]} /></g>
      <g transform={`translate(${440 - 420 * go} 1720) scale(0.8)`}><g transform={`translate(0 ${-Math.abs(Math.sin(t * 9)) * 14 * (go > 0.02 ? 1 : 0)})`}><Seeker uid="nh23" t={t} look={P_B} blink={blinkAt(t, 10)} closed={t > ny && t < gh ? 0.6 : 0} smile={0.7} gazeX={go > 0.02 ? -0.7 : 0.6} rArm={go > 0.02 ? [-30 * Math.sin(t * 9), 20] : t > ny - 0.3 ? [10, 140] : [-6, 8]} lArm={go > 0.02 ? [30 * Math.sin(t * 9), 20] : [-6, 8]} /></g></g>
      {pop(t, ny - 0.2) > 0 && <g transform={`translate(380 760) scale(${pop(t, ny - 0.2)})`}><rect x={-230} y={-70} width={460} height={130} rx={60} fill="#1d1420" stroke={GOLD} strokeWidth={6} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={GOLD}>NIYYAT</text></g>}
      {pop(t, gh - 0.2) > 0 && <g transform={`translate(540 560) scale(${pop(t, gh - 0.2)})`}><rect x={-490} y={-60} width={980} height={110} rx={50} fill={GOLD} /><text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#1d1420">HALAAL ROZI, GHAR WAALON KE LIYE</text></g>}
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
  const a = L(7).start, txt = "Ya Allah, hamein halaal rizq ata farma!", n = Math.floor(interp(t, [a + 0.8, L(7).end], [0, txt.length]));
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
        <text x={-360} y={40} fontFamily={FONT} fontWeight={800} fontSize={42} fill="#fff">{txt.slice(0, Math.min(n, 17))}</text>
        <text x={-360} y={100} fontFamily={FONT} fontWeight={800} fontSize={42} fill="#fff">{n > 17 ? txt.slice(17, n) : ""}<tspan fill={GOLD} opacity={Math.sin(t * 10) > 0 ? 1 : 0}>|</tspan></text>
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
      <rect width={W} height={H} fill="url(#sh22)" />
      <Stars t={t} />
      {Array.from({ length: 5 }, (_, i) => { const on = k(t, a + 0.3 + i * 0.45, a + 0.6 + i * 0.45); const x = 140 + i * 200, y = 1250 - (i % 2) * 140; return <g key={i} transform={`translate(${x} ${y})`}><line x1={0} y1={-500} x2={0} y2={-90} stroke="#5a3b22" strokeWidth={4} /><path d="M -40 -90 L 40 -90 L 30 0 L -30 0 Z" fill="#8a5a2a" /><path d="M -26 -78 L 26 -78 L 20 -10 L -20 -10 Z" fill="#ffe2a0" opacity={0.15 + 0.85 * on * flick(t, i)} /><Glow id={`sl23${i}`} cx={0} cy={-45} r={200} c="#ffb547" o={0.6 * on} /></g>; })}
      <g transform={`translate(540 760) scale(${1.5 * pop(t, a + 0.2)})`}><circle r={110} fill={GOLD} /><path d="M -40 30 Q -30 -40 30 -40 L 30 -70 L 80 -20 L 30 30 L 30 0 Q -20 -5 -40 30 Z" fill="#1d1420" /></g>
    </g>
  );
};

const HadithCard: React.FC<{ t: number }> = ({ t }) => {
  const a = L(2).start - 0.2, b = (L(2).end + L(3).start) / 2;
  if (t < a || t > b + 0.2) return null;
  const p = pop(t, a, 0.5), o = interp(t, [b - 0.2, b + 0.2], [1, 0]);
  return <div style={{ position: "absolute", left: 50, right: 50, top: 250, opacity: o * p, transform: `translateY(${(1 - p) * 40}px)`, background: "rgba(20,12,24,0.9)", border: `4px solid ${GOLD}`, borderRadius: 36, padding: "26px 26px 22px", textAlign: "center" }}>
    <div style={{ fontFamily: "Amiri", fontSize: 56, color: GOLD, direction: "rtl", lineHeight: 1.55 }}>مَا أَكَلَ أَحَدٌ طَعَامًا قَطُّ خَيْرًا<br />مِنْ أَنْ يَأْكُلَ مِنْ عَمَلِ يَدِهِ</div>
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: "#fff", marginTop: 8, lineHeight: 1.3 }}>"Kisi ne kabhi apne haath ki kamaai se behtar khana nahin khaya."</div>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#cbb98f", marginTop: 12, letterSpacing: "0.08em" }}>SAHIH AL-BUKHARI 2072</div>
  </div>;
};

export const SadqahAnim1123: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Hotel t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Dome t={t} /> },
    { a: b(1), b: b(2), r: (t) => <S_Home t={t} /> },
    { a: b(2), b: b(3), r: (t) => <S_Shop t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Workers t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Sweat t={t} /> },
    { a: b(5), b: b(6), r: (t) => <S_Niyyat t={t} /> },
    { a: b(6), b: b(7), r: (t) => <S_Dua t={t} /> },
    { a: b(7), b: SADQAH1123_DUR + 1, r: (t) => <S_Share t={t} /> },
  ];
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [SADQAH1123_DUR - 0.7, SADQAH1123_DUR], [0, 1]));
  const domeA = b(0), domeB = b(1);
  /* hard cuts only (no cross-fades), each through a short dip to black */
  const dip = Math.max(0, ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => 1 - Math.abs(t - b(i)) / 0.16));
  const push = 1 + 0.04 * ((t % 6) / 6);
  return (
    <AbsoluteFill style={{ background: "#140d1c" }}>
      {t >= domeA && t < domeB && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img src={staticFile("d1115/dome_s.jpg")} style={{ width: W, height: H, objectFit: "cover", transformOrigin: "50% 50%", transform: `scale(${1.03 + 0.12 * k(t, domeA, domeB)})`, filter: "saturate(1.05) sepia(0.12)" }} />
        </AbsoluteFill>
      )}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => (t >= s.a && t < s.b ? <g key={i} transform={`translate(540 960) scale(${i === 1 ? 1 : push}) translate(-540 -960)`}>{s.r(t)}</g> : null))}
      </svg>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ background: "rgba(20,12,24,0.85)", color: GOLD, border: `3px solid ${GOLD}`, borderRadius: 40, padding: "10px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: "0.1em" }}>ONE MORE SADQAH · HADITH</span>
      </div>
      <Card font={FONT} t={t} a={L(0).start + 0.2} b={wt(0, "hotel") - 0.2} top={260} bg="rgba(20,12,24,0.9)" fg={GOLD} border={`4px solid ${GOLD}`} size={48}>Sab se behtareen khana?</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.2} b={b(1)} top={260} bg="rgba(20,12,24,0.9)" fg="#fff" border={`4px solid ${GOLD}`} size={40}>Hazrat Miqdam (Radi Allahu Anhu)</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.6} b={b(1)} top={370} bg={GOLD} fg="#1d1420" size={44}>Sahih al-Bukhari 2072</Card>
      <HadithCard t={t} />
      <Card font={FONT} t={t} a={wt(3, "dawood") - 0.2} b={b(3)} top={260} bg="rgba(20,12,24,0.9)" fg={GOLD} border={`4px solid ${GOLD}`} size={40}>Hazrat Dawood (Alaihis Salam)</Card>
      <Card font={FONT} t={t} a={wt(3, "kamaai") - 0.2} b={b(3)} top={370} bg={GOLD} fg="#1d1420" size={40}>bhi apne haath se kamaate thay</Card>
      <Card font={FONT} t={t} a={L(8).start + 0.3} b={SADQAH1123_DUR} top={1000} bg={GOLD} fg="#1d1420" size={48}>Aage bhejein = ek aur sadqah</Card>
      <Captions t={t} TL={TL} font={FONT} hi={GOLD} base="#a99b86" done="#ffffff" bg="rgba(20,12,24,0.85)" size={54} top={1600} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fade, dip) }} />
      {withAudio && <Audio src={staticFile("day1/d1123sadqah-mix.m4a")} />}
    </AbsoluteFill>
  );
};
