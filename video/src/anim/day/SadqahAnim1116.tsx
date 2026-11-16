import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1116sadqah-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, Stars, k, flick } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, lin, Captions, Card, Sparkles, Heart, Hand, W, H, rn } from "./AnimKit";

/* One More Sadqah · 16 Nov 2026 · Short 18 "Amal ka daromadar niyyat par" Sahih al-Bukhari 1 (Hazrat Umar bin al-Khattab
   Radi Allahu Anhu): "Actions are only by intentions, and every person gets only what he intended."
   Warm cinematic palette. Ordinary adults act it out; Hazrat Umar (RA) is never shown; when the Prophet ﷺ is mentioned:
   the REAL Green Dome (Pixabay 112361, DesignwithRiyas). Allah is never drawn or symbolised. No music. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const SADQAH1116_DUR = TL.total;
const FONT = "'Montserrat', sans-serif";
const GOLD = "#f2c46b";
const SHOW: Look = { beard: false, cap: null, top: "#7a2e3a", topD: "#5a1f29", pants: "#1a1f36", shawl: false, hair: "#1a120c", skin: ["#e3b58e", "#c99a72", "#a77850"] };
const SINC: Look = { beard: true, top: "#efe6d2", topD: "#cdbf9f", pants: "#d9cdb2", shawl: false, cap: "#f8f4eb" };
const WIFE: Look = { beard: false, cap: null, hijab: "#6d4c8a", top: "#b59ad0", topD: "#9479b3", shawl: false, long: true, skin: ["#e6bd98", "#cf9d76", "#ad7b55"] };
const SON: Look = { kid: true, beard: false, cap: "#ffffff", top: "#4f8a6b", topD: "#3a6b52", pants: "#2b3a4a", shawl: false, hair: "#24170f" };

const Street: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs><linearGradient id="st16" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#100a18" /><stop offset="100%" stopColor="#3b2416" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#st16)" />
    <Stars t={t} o={0.6} />
    {[[40, 760, 260, 700], [330, 620, 240, 840], [790, 700, 260, 760]].map(([x, y, w, h], i) => <g key={i}><rect x={x} y={y} width={w} height={h} fill="#1c1320" />{Array.from({ length: 6 }, (_, j) => <rect key={j} x={x + 30 + (j % 2) * (w / 2)} y={y + 50 + Math.floor(j / 2) * 140} width={50} height={80} fill="#ffb547" opacity={(i + j) % 3 === 0 ? 0.5 * flick(t, j) : 0.06} />)}</g>)}
    <rect y={1470} width={W} height={450} fill="#2a1a14" />
    <Glow id="sw16" cx={540} cy={1150} r={700} c="#ffb547" o={0.28} />
  </g>
);
/* donation box with a slot; origin = bottom centre */
const DBox: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-260} width={240} height={260} rx={18} fill="#5a3824" stroke="#8a5a2a" strokeWidth={8} />
    <rect x={-60} y={-250} width={120} height={14} rx={7} fill="#140d1c" />
    <text y={-110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={GOLD}>SADQAH</text>
    <rect x={-120} y={-30} width={240} height={30} fill="#00000033" />
  </g>
);
const Pouch: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}><path d="M -34 -10 Q -46 40 0 46 Q 46 40 34 -10 Q 20 -24 0 -22 Q -20 -24 -34 -10 Z" fill="#c8973c" /><path d="M -18 -22 L 18 -22 L 10 -36 L -10 -36 Z" fill="#a77a20" /><text y={24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#5a3b10">£</text></g>
);
const Phone: React.FC<{ x: number; y: number; flash: number; r?: number }> = ({ x, y, flash, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x={-36} y={-64} width={72} height={128} rx={12} fill="#222" stroke="#555" strokeWidth={4} />
    <rect x={-28} y={-54} width={56} height={100} rx={6} fill="#5ab0f0" opacity={0.8} />
    <circle cx={0} cy={-56} r={6} fill="#fff" opacity={flash} />
    {flash > 0.1 && <Glow id={`fl${Math.round(x)}`} cx={0} cy={-56} r={260} c="#ffffff" o={0.7 * flash} />}
  </g>
);

/* S0: two men drop the same pouch into the same box... one glances around for an audience; a big "?" */
const S_Two: React.FC<{ t: number }> = ({ t }) => {
  const a = L(0).start, drop1 = wt(0, "sadqah") - 0.3, q = pop(t, wt(0, "kyun"));
  const d1 = k(t, drop1, drop1 + 0.5), d2 = k(t, drop1 + 0.35, drop1 + 0.85);
  const scale = k(t, wt(0, "farq") - 0.2, wt(0, "farq") + 0.5);
  return (
    <g>
      <Street t={t} />
      <DBox x={540} y={1480} s={1} />
      <g transform="translate(260 1660) scale(0.9)"><Seeker uid="sh16a" t={t} look={SHOW} blink={blinkAt(t, 1)} smile={0.7} brow={0.4} gazeX={Math.sin(t * 2.2) * 0.9} rArm={[-50 + 30 * d1, 60]} lArm={[-6, 8]} /></g>
      <g transform="translate(820 1660) scale(0.9)"><Seeker uid="si16a" t={t} look={SINC} blink={blinkAt(t, 2)} smile={0.4} closed={0.3} gazeX={-0.4} gazeY={0.4} rArm={[-6, 8]} lArm={[-50 + 30 * d2, 60]} /></g>
      <Pouch x={interp(d1, [0, 1], [420, 520])} y={interp(d1, [0, 1], [1040, 1240])} s={0.9} o={1 - lin(t, drop1 + 0.45, drop1 + 0.55)} />
      <Pouch x={interp(d2, [0, 1], [660, 560])} y={interp(d2, [0, 1], [1040, 1240])} s={0.9} o={1 - lin(t, drop1 + 0.8, drop1 + 0.9)} />
      {scale > 0 && <g transform={`translate(540 600) scale(${scale})`}>
        <rect x={-6} y={-120} width={12} height={240} fill={GOLD} /><rect x={-80} y={110} width={160} height={20} rx={8} fill={GOLD} />
        <g transform={`rotate(${-14 * scale})`}><rect x={-300} y={-126} width={600} height={10} rx={5} fill={GOLD} />
          <path d="M -300 -120 L -350 0 L -250 0 Z" fill="none" stroke={GOLD} strokeWidth={4} /><path d="M -360 0 Q -300 50 -240 0 Z" fill={GOLD} />
          <path d="M 300 -120 L 250 0 L 350 0 Z" fill="none" stroke={GOLD} strokeWidth={4} /><path d="M 240 0 Q 300 50 360 0 Z" fill={GOLD} /></g>
      </g>}
      {q > 0 && <text x={540} y={440 - 12 * Math.sin(t * 3)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={180 * q} fill={GOLD}>?</text>}
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
/* S2: "aamaal ka daromadar niyyaton par": a house of deeds rises on a glowing foundation labelled NIYYAT */
const S_Found: React.FC<{ t: number }> = ({ t }) => {
  const a = L(2).start, am = wt(2, "aamaal"), ni = wt(2, "niyyaton");
  const found = pop(t, ni - 0.4, 0.5), rise = k(t, am, ni + 0.6);
  return (
    <g>
      <Street t={t} />
      <g transform="translate(540 1460)">
        <g transform={`scale(${found})`}><rect x={-380} y={-10} width={760} height={110} rx={14} fill="#3a2716" stroke={GOLD} strokeWidth={8} />
          <Glow id="fd16" cx={0} cy={40} r={500} c="#ffcf6a" o={0.45 * (0.85 + 0.15 * Math.sin(t * 4))} />
          <text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={GOLD}>NIYYAT</text></g>
        {[0, 1, 2, 3].map((i) => { const p = k(t, am + i * 0.25, am + 0.4 + i * 0.25) * found; return p > 0 && <g key={i} transform={`translate(0 ${-10 - i * 150 - 150 * (1 - p)})`} opacity={p}>
          <rect x={-300 + i * 30} y={-150} width={600 - i * 60} height={150} fill={["#8a5a2a", "#7a4e24", "#6b4420", "#5d3a1c"][i]} stroke="#2a1a10" strokeWidth={4} />
          {Array.from({ length: 3 }, (_, j) => <rect key={j} x={-220 + i * 25 + j * (170 - i * 15)} y={-115} width={70} height={80} fill="#ffb547" opacity={0.7 * flick(t, i + j)} />)}</g>; })}
        {rise > 0.95 && <path d="M -280 -610 L 0 -800 L 280 -610 Z" fill="#4a2f18" stroke="#2a1a10" strokeWidth={4} />}
      </g>
      <text x={540} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80 * pop(t, am)} fill="#fff">AMAL</text>
      <Sparkles t={t} at={ni + 0.2} cx={540} cy={1500} n={16} c={GOLD} />
    </g>
  );
};
/* S3: "har shakhs ko wohi milega jis ki niyyat ki": show-off man gets claps that crumble to dust; the sincere man's deed rises as light */
const S_Get: React.FC<{ t: number }> = ({ t }) => {
  const mil = wt(3, "milega"), ni = wt(3, "niyyat");
  const dust = k(t, ni - 0.2, ni + 0.8);
  return (
    <g>
      <Street t={t} />
      <rect x={538} y={600} width={4} height={1000} fill={GOLD} opacity={0.5} />
      <g transform="translate(330 1660) scale(0.85)"><Seeker uid="sh16b" t={t} look={SHOW} blink={blinkAt(t, 3)} smile={0.8 * (1 - dust)} brow={dust > 0.5 ? -0.4 : 0.5} gazeX={0.3} gazeY={-0.3} lArm={[-6, 8]} rArm={[-6, 8]} /></g>
      {["WAH!", "SHABASH", "WOW"].map((w, i) => { const p = pop(t, mil + i * 0.2); if (p <= 0) return null; const r = rn(i + 30);
        return <g key={i} opacity={1 - dust} transform={`translate(100 ${1060 + i * 130 + dust * 200})`}>
          <rect x={-80} y={-50} width={160} height={90} rx={40} fill="#fff" opacity={0.9} transform={`scale(${p})`} />
          <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#7a2e3a" transform={`scale(${p})`}>{w}</text>
          {dust > 0.1 && Array.from({ length: 8 }, (_, j) => <circle key={j} cx={(r() - 0.5) * 160} cy={dust * 120 * r()} r={5} fill="#a99b86" opacity={1 - dust} />)}</g>; })}
      <g transform="translate(810 1660) scale(0.85)"><Seeker uid="si16b" t={t} look={SINC} blink={blinkAt(t, 4)} smile={0.7} closed={0.5} gazeY={-0.3} lArm={[30, 110]} rArm={[30, 110]} /></g>
      {Array.from({ length: 12 }, (_, i) => { const r = rn(i + 50), d = t - mil - i * 0.12; if (d <= 0) return null; return <circle key={i} cx={960 + r() * 60 + Math.sin(t * 2 + i) * 10} cy={1350 - d * 300} r={6 + r() * 6} fill="#ffe8b0" opacity={Math.max(0, 1 - d / 2.4)} />; })}
    </g>
  );
};
/* S4: split: the left man gives in front of a phone flash; the right man gives secretly, at night, nobody watching */
const S_Split: React.FC<{ t: number }> = ({ t }) => {
  const dk = wt(4, "dikhawe"), al = wt(4, "allah");
  const flash = t > dk - 0.2 && t < dk + 1.2 ? Math.max(0, Math.sin((t - dk) * 18)) : 0;
  const give2 = k(t, al - 0.6, al);
  return (
    <g>
      <rect width={W} height={H} fill="#120b1a" />
      <Stars t={t} o={0.9} />
      <rect x={0} y={0} width={540} height={H} fill="#3a2230" opacity={0.6} />
      <rect y={1470} width={W} height={450} fill="#2a1a14" />
      <rect x={536} y={0} width={8} height={H} fill={GOLD} />
      <g transform="translate(250 1660) scale(0.8)"><Seeker uid="sh16c" t={t} look={SHOW} blink={blinkAt(t, 5)} smile={1} brow={0.6} gazeX={0.6} rArm={[-70, 40]} lArm={[-80, -20]} /></g>
      <Phone x={130} y={1020} flash={flash} r={-10} />
      <DBox x={420} y={1480} s={0.7} />
      <text x={270} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64 * pop(t, dk)} fill="#ff8fa3">DIKHAWA</text>
      <DBox x={940} y={1480} s={0.7} />
      <g transform="translate(760 1660) scale(0.8)"><Seeker uid="si16c" t={t} look={SINC} blink={blinkAt(t, 6)} smile={0.5} closed={0.4} gazeX={0.5} gazeY={0.5} rArm={[-40 * give2 - 6, 40 * give2 + 8]} lArm={[-6, 8]} /></g>
      {give2 > 0 && give2 < 1 && <Pouch x={interp(give2, [0, 1], [840, 935])} y={interp(give2, [0, 1], [1180, 1310])} s={0.7} />}
      <text x={810} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60 * pop(t, al)} fill={GOLD}>SIRF ALLAH</text>
      <text x={810} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60 * pop(t, al + 0.1)} fill={GOLD}>KE LIYE</text>
      <Sparkles t={t} at={al + 0.2} cx={900} cy={1250} n={12} c={GOLD} />
    </g>
  );
};
/* S5: everyday deeds with a good intention: groceries for the family, work, a meal; each earns a gold "+ sawab" */
const S_Daily: React.FC<{ t: number }> = ({ t }) => {
  const kh = wt(5, "kharch"), ka = wt(5, "kaam"), kn = wt(5, "khana"), sw = wt(5, "sawab");
  const walk = k(t, L(5).start - 0.2, kh + 0.4);
  return (
    <g>
      <rect width={W} height={H} fill="#2a1a20" />
      <rect x={0} y={0} width={W} height={1470} fill="#3b2a2c" />
      <rect x={760} y={560} width={260} height={360} rx={14} fill="#120b1a" stroke="#5a3b22" strokeWidth={14} /><Stars t={t} o={0.5} />
      <rect y={1470} width={W} height={450} fill="#4a3022" />
      <Glow id="dl16" cx={540} cy={900} r={800} c="#ffb547" o={0.25} />
      <g transform={`translate(${interp(walk, [0, 1], [-80, 300])} 1660) scale(0.85)`}><Seeker uid="si16d" t={t} look={SINC} blink={blinkAt(t, 7)} smile={0.9} gazeX={0.6} lArm={[-6, 8]} rArm={[-30, 70]} /></g>
      <g transform={`translate(${interp(walk, [0, 1], [-80, 300]) + 120} 1290)`}><path d="M -70 0 L 70 0 L 60 -150 L -60 -150 Z" fill="#c8873c" /><circle cx={-24} cy={-160} r={26} fill="#ff6b6b" /><ellipse cx={24} cy={-160} rx={34} ry={18} fill="#d9a05b" /></g>
      <g transform="translate(700 1660) scale(0.8)"><Seeker uid="wf16" t={t} look={WIFE} blink={blinkAt(t, 8)} smile={0.6 + 0.4 * walk} gazeX={-0.7} lArm={[-6, 8]} rArm={[-6, 8]} /></g>
      <g transform={`translate(900 ${1660 - (walk > 0.9 ? Math.abs(Math.sin(t * 8)) * 16 : 0)}) scale(0.55)`}><Seeker uid="sn16" t={t} look={SON} blink={blinkAt(t, 9)} smile={1} gazeX={-0.8} lArm={walk > 0.9 ? [-150, -30] : [-6, 8]} rArm={walk > 0.9 ? [-150, -30] : [-6, 8]} /></g>
      {[{ at: kh, ic: "bag", lb: "Ghar walon par kharch" }, { at: ka, ic: "work", lb: "Kaam" }, { at: kn, ic: "food", lb: "Khana" }].map((d, i) => { const p = pop(t, d.at); return p > 0 && <g key={i} transform={`translate(${200 + i * 340} 560) scale(${p})`}>
        <circle r={110} fill="#1d1420" stroke={GOLD} strokeWidth={6} />
        {d.ic === "bag" && <g><path d="M -45 30 L 45 30 L 38 -50 L -38 -50 Z" fill="#c8873c" /><circle cx={-14} cy={-58} r={16} fill="#ff6b6b" /></g>}
        {d.ic === "work" && <g><rect x={-55} y={-40} width={110} height={70} rx={8} fill="#5ab0f0" /><rect x={-70} y={34} width={140} height={14} rx={6} fill="#aaa" /></g>}
        {d.ic === "food" && <g><ellipse rx={60} ry={20} cy={20} fill="#fff" /><path d="M -50 20 Q 0 -60 50 20 Z" fill="#d9a05b" /></g>}
        <text y={160} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={i ? 36 : 28} fill="#fff">{d.lb}</text>
        {t > sw && <text y={-130} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40 * pop(t, sw + i * 0.15)} fill={GOLD}>+ SAWAB</text>}
      </g>; })}
      <Sparkles t={t} at={sw} cx={540} cy={560} n={18} c={GOLD} />
    </g>
  );
};
/* S6: hands raised in dua; the comment box types the dua */
const S_Dua: React.FC<{ t: number }> = ({ t }) => {
  const a = L(6).start, txt = "Ya Allah, hamari niyyatein khaalis kar de!", n = Math.floor(interp(t, [a + 0.8, L(6).end], [0, txt.length]));
  const up = k(t, a - 0.2, a + 0.5);
  return (
    <g>
      <rect width={W} height={H} fill="#140d1c" />
      <Stars t={t} o={0.8} />
      <Glow id="du16" cx={540} cy={1500} r={700} c="#ffb547" o={0.25} />
      <g transform={`translate(0 ${80 * (1 - up)})`}>
        <Hand x={390} y={1720} s={1.6} r={-12} skin="#c99a72" curl={0.15} />
        <Hand x={690} y={1720} s={1.6} r={12} skin="#c99a72" flip curl={0.15} />
      </g>
      <g transform={`translate(540 800) scale(${pop(t, a + 0.3, 0.4)})`}>
        <rect x={-450} y={-170} width={900} height={360} rx={50} fill="#1d1420" stroke={GOLD} strokeWidth={6} />
        <text x={-390} y={-80} fontFamily={FONT} fontWeight={800} fontSize={40} fill="#cbb98f">Comment</text>
        <rect x={-390} y={-40} width={780} height={180} rx={30} fill="#2c2030" />
        <text x={-360} y={40} fontFamily={FONT} fontWeight={800} fontSize={42} fill="#fff">{txt.slice(0, Math.min(n, 21))}</text>
        <text x={-360} y={100} fontFamily={FONT} fontWeight={800} fontSize={42} fill="#fff">{n > 21 ? txt.slice(21, n) : ""}<tspan fill={GOLD} opacity={Math.sin(t * 10) > 0 ? 1 : 0}>|</tspan></text>
      </g>
    </g>
  );
};
/* S7: share = another sadqah: the lesson travels from lamp to lamp */
const S_Share: React.FC<{ t: number }> = ({ t }) => {
  const a = L(7).start;
  return (
    <g>
      <defs><linearGradient id="sh16" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#120b1a" /><stop offset="100%" stopColor="#2f1d14" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#sh16)" />
      <Stars t={t} />
      {Array.from({ length: 5 }, (_, i) => { const on = k(t, a + 0.3 + i * 0.45, a + 0.6 + i * 0.45); const x = 140 + i * 200, y = 1250 - (i % 2) * 140; return <g key={i} transform={`translate(${x} ${y})`}><line x1={0} y1={-500} x2={0} y2={-90} stroke="#5a3b22" strokeWidth={4} /><path d="M -40 -90 L 40 -90 L 30 0 L -30 0 Z" fill="#8a5a2a" /><path d="M -26 -78 L 26 -78 L 20 -10 L -20 -10 Z" fill="#ffe2a0" opacity={0.15 + 0.85 * on * flick(t, i)} /><Glow id={`sl16${i}`} cx={0} cy={-45} r={200} c="#ffb547" o={0.6 * on} /></g>; })}
      <g transform={`translate(540 760) scale(${1.5 * pop(t, a + 0.2)})`}><circle r={110} fill={GOLD} /><path d="M -40 30 Q -30 -40 30 -40 L 30 -70 L 80 -20 L 30 30 L 30 0 Q -20 -5 -40 30 Z" fill="#1d1420" /></g>
    </g>
  );
};

const HadithCard: React.FC<{ t: number }> = ({ t }) => {
  const a = L(2).start - 0.2, b = (L(3).end + L(4).start) / 2;
  if (t < a || t > b + 0.2) return null;
  const p = pop(t, a, 0.5), o = interp(t, [b - 0.2, b + 0.2], [1, 0]);
  const second = t > L(3).start - 0.1;
  return <div style={{ position: "absolute", left: 50, right: 50, top: 250, opacity: o * p, transform: `translateY(${(1 - p) * 40}px)`, background: "rgba(20,12,24,0.9)", border: `4px solid ${GOLD}`, borderRadius: 36, padding: "26px 26px 22px", textAlign: "center" }}>
    <div style={{ fontFamily: "Amiri", fontSize: 60, color: GOLD, direction: "rtl", lineHeight: 1.55 }}>إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ<br /><span style={{ opacity: second ? 1 : 0.35 }}>وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى</span></div>
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: "#fff", marginTop: 8, lineHeight: 1.3 }}>"Aamaal ka daromadar niyyaton par hai, aur har shakhs ko wohi milega jis ki us ne niyyat ki."</div>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#cbb98f", marginTop: 12, letterSpacing: "0.08em" }}>SAHIH AL-BUKHARI 1</div>
  </div>;
};

export const SadqahAnim1116: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Two t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Dome t={t} /> },
    { a: b(1), b: b(2), r: (t) => <S_Found t={t} /> },
    { a: b(2), b: b(3), r: (t) => <S_Get t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Split t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Daily t={t} /> },
    { a: b(5), b: b(6), r: (t) => <S_Dua t={t} /> },
    { a: b(6), b: SADQAH1116_DUR + 1, r: (t) => <S_Share t={t} /> },
  ];
  const XF = 0.25;
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [SADQAH1116_DUR - 0.7, SADQAH1116_DUR], [0, 1]));
  const domeA = b(0), domeB = b(1);
  const dip = Math.max(0, ...[b(0), b(1)].map((x) => 1 - Math.abs(t - x) / 0.18));
  const push = 1 + 0.04 * ((t % 6) / 6);
  return (
    <AbsoluteFill style={{ background: "#140d1c" }}>
      {t >= domeA && t < domeB && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img src={staticFile("d1116/dome_s.jpg")} style={{ width: W, height: H, objectFit: "cover", transformOrigin: "50% 50%", transform: `scale(${1.03 + 0.12 * k(t, domeA, domeB)})`, filter: "saturate(1.05) sepia(0.12)" }} />
        </AbsoluteFill>
      )}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => {
          /* hard cuts (with a dip to dark) in and out of the real Dome shot: no character ever cross-fades over the Dome */
          const xa = s.a === b(0) || s.a === b(1) ? 0 : XF, xb = s.b === b(0) || s.b === b(1) ? 0 : XF;
          if (t < s.a - xa || t >= s.b + xb) return null;
          const o = s.a === 0 || xa === 0 ? 1 : interp(t, [s.a - XF, s.a + XF], [0, 1]);
          const sc = i === 1 ? 1 : push;
          return <g key={i} opacity={o} transform={`translate(540 960) scale(${sc}) translate(-540 -960)`}>{s.r(t)}</g>;
        })}
      </svg>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ background: "rgba(20,12,24,0.85)", color: GOLD, border: `3px solid ${GOLD}`, borderRadius: 40, padding: "10px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: "0.1em" }}>ONE MORE SADQAH · HADITH</span>
      </div>
      <Card font={FONT} t={t} a={wt(0, "jaisa")} b={wt(0, "farq") - 0.2} top={260} bg="rgba(20,12,24,0.9)" fg={GOLD} border={`4px solid ${GOLD}`} size={48}>Ek jaisa sadqah…</Card>
      <Card font={FONT} t={t} a={wt(0, "farq") - 0.2} b={b(0)} top={260} bg={GOLD} fg="#1d1420" size={44}>…farq zameen aasmaan ka!</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.2} b={b(1)} top={260} bg="rgba(20,12,24,0.9)" fg="#fff" border={`4px solid ${GOLD}`} size={36}>Hazrat Umar bin Khattab (Radi Allahu Anhu)</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.6} b={b(1)} top={370} bg={GOLD} fg="#1d1420" size={44}>Sahih al-Bukhari 1</Card>
      <HadithCard t={t} />
      <Card font={FONT} t={t} a={wt(5, "niyyat")} b={b(5)} top={260} bg={GOLD} fg="#1d1420" size={44}>Achhi niyyat = har kaam mein sawab</Card>
      <Card font={FONT} t={t} a={L(7).start + 0.3} b={SADQAH1116_DUR} top={1000} bg={GOLD} fg="#1d1420" size={48}>Aage bhejein = ek aur sadqah</Card>
      <Captions t={t} TL={TL} font={FONT} hi={GOLD} base="#a99b86" done="#ffffff" bg="rgba(20,12,24,0.85)" size={54} top={1600} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fade, dip) }} />
      {withAudio && <Audio src={staticFile("day1/d1116sadqah-mix.m4a")} />}
    </AbsoluteFill>
  );
};
