import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1122sadqah-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, Stars, k, flick } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, lin, Captions, Card, Sparkles, Heart, Hand, W, H, rn } from "./AnimKit";

/* One More Sadqah · 22 Nov 2026 · Short 19 "Sachcha Musalmaan kaun?" Sahih al-Bukhari 10 (Hazrat Abdullah bin Amr
   Radi Allahu Anhuma): "The Muslim is the one from whose tongue and hand the Muslims are safe."
   Warm cinematic palette. Ordinary adults act it out; the Sahabi is never shown; when the Prophet ﷺ is mentioned:
   the REAL Green Dome (Pixabay 198164, muhammadarhamamin77800). No music. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const SADQAH1122_DUR = TL.total;
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

const P_A: Look = { beard: true, top: "#efe6d2", topD: "#cdbf9f", pants: "#d9cdb2", shawl: false, cap: "#f8f4eb" };
const P_B: Look = { beard: false, cap: null, top: "#3d5a80", topD: "#2c4260", pants: "#1a1f36", shawl: false, hair: "#1a120c", skin: ["#e3b58e", "#c99a72", "#a77850"] };
const P_C: Look = { beard: true, cap: null, top: "#6b4c3b", topD: "#4f372a", pants: "#2a2018", shawl: false, hair: "#24170f", beardC: "#9a9a9a", skin: ["#c99a72", "#ad7c55", "#8a5d3a"] };
const P_D: Look = { beard: false, cap: null, hijab: "#6d4c8a", top: "#b59ad0", topD: "#9479b3", shawl: false, long: true, skin: ["#e6bd98", "#cf9d76", "#ad7b55"] };

const Bubble: React.FC<{ x: number; y: number; txt: string; p: number; cross: number; c?: string }> = ({ x, y, txt, p, cross, c = "#fff" }) => p > 0 ? (
  <g transform={`translate(${x} ${y}) scale(${p})`} opacity={1 - 0.45 * cross}>
    <rect x={-(60 + txt.length * 17)} y={-62} width={2 * (60 + txt.length * 17)} height={110} rx={50} fill={c} />
    <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill="#7a2e3a">{txt}</text>
    {cross > 0 && <line x1={-(40 + txt.length * 17)} y1={30} x2={-(40 + txt.length * 17) + 2 * (40 + txt.length * 17) * cross} y2={-40} stroke="#e5383b" strokeWidth={14} strokeLinecap="round" />}
  </g>) : null;

/* S0: a man at prayer on his mat, then fasting (dates at sunset) ... "and one big sign!" a gold star badge with "?" */
const S_Sign: React.FC<{ t: number }> = ({ t }) => {
  const nm = wt(0, "namaz"), rz = wt(0, "roza"), ns = wt(0, "nishani");
  const bow = t > nm && t < rz ? Math.sin(k(t, nm, nm + 0.8) * Math.PI) : 0;
  const badge = pop(t, ns - 0.2);
  return (
    <g>
      <Street t={t} />
      <rect x={180} y={1560} width={420} height={90} rx={10} fill="#2e6b4f" /><rect x={200} y={1575} width={380} height={60} rx={6} fill="none" stroke={GOLD} strokeWidth={4} />
      <g transform="translate(390 1640) scale(0.95)"><Seeker uid="a22a" t={t} look={P_A} blink={blinkAt(t, 1)} closed={0.5} smile={0.4} nod={-30 * bow} gazeY={0.6} lArm={[20 + 20 * bow, 110]} rArm={[20 + 20 * bow, 110]} /></g>
      {[{ at: nm, lb: "NAMAZ" }, { at: rz, lb: "ROZA" }].map((d, i) => { const p = pop(t, d.at); return p > 0 && <g key={i} transform={`translate(${780} ${760 + i * 220}) scale(${p})`}>
        <rect x={-170} y={-70} width={340} height={140} rx={30} fill="#1d1420" stroke={GOLD} strokeWidth={6} />
        <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#fff">{d.lb}</text>
        <text x={130} y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#7ee0a5">✓</text></g>; })}
      {badge > 0 && <g transform={`translate(780 1260) scale(${badge}) rotate(${4 * Math.sin(t * 3)})`}>
        <path d="M 0 -120 L 30 -40 L 115 -38 L 48 14 L 72 98 L 0 50 L -72 98 L -48 14 L -115 -38 L -30 -40 Z" fill={GOLD} />
        <text y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill="#1d1420">?</text></g>}
      <Sparkles t={t} at={ns} cx={780} cy={1260} n={14} c={GOLD} />
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
/* S2: neighbours around one man; a warm ring of SAFETY spreads out from his tongue (speech) and his hands to everyone */
const S_Safe: React.FC<{ t: number }> = ({ t }) => {
  const zb = wt(2, "zabaan"), ht = wt(2, "haath"), mf = wt(2, "mehfooz");
  const ring = k(t, mf - 0.4, mf + 0.8);
  return (
    <g>
      <Street t={t} />
      {[{ x: 150, l: P_B, u: "b" }, { x: 930, l: P_D, u: "d" }].map((p, i) => <g key={i} transform={`translate(${p.x} 1700) scale(0.62)`}><Seeker uid={`n22${p.u}`} t={t} look={p.l} blink={blinkAt(t, 3 + i)} smile={0.3 + 0.7 * ring} gazeX={i ? -0.6 : 0.6} lArm={[-6, 8]} rArm={[-6, 8]} /></g>)}
      <g transform="translate(540 1690) scale(0.68)"><Seeker uid="a22b" t={t} look={P_A} blink={blinkAt(t, 2)} smile={0.6} gazeX={Math.sin(t * 1.5) * 0.6} lArm={t > ht ? [-40, 60] : [-6, 8]} rArm={t > ht ? [-40, 60] : [-6, 8]} /></g>
      {pop(t, zb) > 0 && <g transform={`translate(300 820) scale(${pop(t, zb)})`}><rect x={-150} y={-60} width={300} height={110} rx={50} fill="#fff" /><text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#1d1420">ZABAAN</text></g>}
      {pop(t, ht) > 0 && <g transform={`translate(790 820) scale(${pop(t, ht)})`}><rect x={-130} y={-50} width={260} height={96} rx={44} fill={GOLD} /><text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#1d1420">HAATH</text></g>}
      {ring > 0 && [0, 1, 2].map((i) => { const r = (ring * 520 + i * 170) % 620; return <ellipse key={i} cx={540} cy={1560} rx={r} ry={r * 0.28} fill="none" stroke={GOLD} strokeWidth={8} opacity={(1 - r / 620) * 0.8} />; })}
      {ring > 0.3 && <text x={540} y={730} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80 * pop(t, mf)} fill="#7ee0a5">MEHFOOZ</text>}
    </g>
  );
};
/* S3: the tongue: three hurtful words pop up in bubbles and get struck out one by one */
const S_Tongue: React.FC<{ t: number }> = ({ t }) => {
  const w = ["gaali", "taana", "gheebat"].map((x) => wt(3, x));
  return (
    <g>
      <Street t={t} />
      <g transform="translate(330 1700) scale(0.9)"><Seeker uid="b22a" t={t} look={P_B} blink={blinkAt(t, 5)} smile={t > w[2] ? 0.6 : 0} brow={t > w[0] ? 0.2 : -0.4} gazeX={0.6} lArm={[-6, 8]} rArm={t > w[0] ? [30, 150] : [-6, 8]} /></g>
      <g transform="translate(820 1700) scale(0.8)"><Seeker uid="c22a" t={t} look={P_C} blink={blinkAt(t, 6)} smile={k(t, w[2], w[2] + 0.8)} brow={0.3} gazeX={-0.6} lArm={[-6, 8]} rArm={[-6, 8]} /></g>
      {["GAALI", "TAANA", "GHEEBAT"].map((x, i) => <Bubble key={i} x={540} y={560 + i * 128} txt={x} p={pop(t, w[i] - 0.25)} cross={k(t, w[i] + 0.1, w[i] + 0.45)} />)}
      <text x={540} y={450} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70 * pop(t, L(3).start)} fill={GOLD}>ZABAAN SE</text>
    </g>
  );
};
/* S4: the hand: a man about to shove someone in a queue stops, opens his palm and lets him go first; struck-out cards */
const S_Hand: React.FC<{ t: number }> = ({ t }) => {
  const w = ["dhakka", "zulm", "haq"].map((x) => wt(4, x));
  const push = t < w[0] + 0.4 ? k(t, L(4).start, w[0]) : 1 - k(t, w[0] + 0.4, w[0] + 1);
  const kind = k(t, w[1], w[2]);
  return (
    <g>
      <Street t={t} />
      <rect x={840} y={1100} width={300} height={380} rx={12} fill="#3a2716" stroke="#8a5a2a" strokeWidth={8} /><text x={960} y={1180} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={GOLD}>DUKAAN</text>
      <g transform={`translate(${280 + 60 * push} 1700) scale(0.8)`}><Seeker uid="b22b" t={t} look={P_B} blink={blinkAt(t, 7)} brow={-0.4 * push + 0.4 * kind} smile={0.8 * kind} gazeX={0.6} rArm={[-70 * push - 6 - 30 * kind, 30 * push + 8 + 40 * kind]} lArm={[-6, 8]} /></g>
      <g transform={`translate(${700 + 30 * push} 1700) scale(0.78)`}><Seeker uid="c22b" t={t} look={P_C} blink={blinkAt(t, 8)} smile={0.7 * kind} wide={0.4 * push} gazeX={-0.6} tilt={6 * push} lArm={[-6, 8]} rArm={[-6, 8]} /></g>
      {["DHAKKA", "ZULM", "HAQ MAARNA"].map((x, i) => <Bubble key={i} x={540} y={560 + i * 140} txt={x} p={pop(t, w[i] - 0.25)} cross={k(t, w[i] + 0.1, w[i] + 0.45)} c={GOLD} />)}
      <text x={540} y={440} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70 * pop(t, L(4).start)} fill={GOLD}>HAATH SE</text>
    </g>
  );
};
/* S5: a phone: a hurtful comment is typed, deleted letter by letter, and replaced with a kind one; a heart stays whole */
const S_Phone: React.FC<{ t: number }> = ({ t }) => {
  const a = L(5).start, e = L(5).end;
  const bad = "Tum bekaar ho!", good = "Allah aap ko khush rakhe";
  const t1 = interp(t, [a + 0.2, a + 1.0], [0, bad.length]), del = interp(t, [a + 1.4, a + 2.0], [0, bad.length]);
  const t2 = interp(t, [a + 2.2, e], [0, good.length]);
  const txt = t < a + 2.2 ? bad.slice(0, Math.max(0, Math.floor(t1 - del))) : good.slice(0, Math.floor(t2));
  const heart = wt(5, "dil");
  return (
    <g>
      <rect width={W} height={H} fill="#140d1c" />
      <Stars t={t} o={0.6} />
      <Glow id="ph22" cx={540} cy={900} r={700} c="#ffb547" o={0.2} />
      <g transform="translate(540 980)">
        <rect x={-300} y={-560} width={600} height={1120} rx={70} fill="#1b1b1f" stroke="#444" strokeWidth={10} />
        <rect x={-270} y={-500} width={540} height={1000} rx={36} fill="#f4efe6" />
        <rect x={-230} y={-440} width={460} height={110} rx={24} fill="#e3d9c6" /><text x={-200} y={-372} fontFamily={FONT} fontWeight={800} fontSize={34} fill="#5a4a3a">Comment</text>
        <rect x={-230} y={-300} width={460} height={190} rx={30} fill="#fff" stroke={t < a + 2.2 ? "#e5383b" : "#2ec27e"} strokeWidth={6} />
        <text x={-200} y={-220} fontFamily={FONT} fontWeight={800} fontSize={38} fill="#1d1420">{txt.slice(0, 18)}</text>
        <text x={-200} y={-160} fontFamily={FONT} fontWeight={800} fontSize={38} fill="#1d1420">{txt.slice(18)}<tspan fill="#e5383b" opacity={Math.sin(t * 10) > 0 ? 1 : 0}>|</tspan></text>
        <g transform={`translate(0 160) scale(${2.4 + 0.15 * Math.sin(t * 6)})`}><Heart x={0} y={0} s={1} o={1} c="#ff5a7a" /></g>
        {t > a + 0.8 && t < a + 1.6 && <path d="M -10 60 L 20 120 L -10 170 L 15 230" stroke="#140d1c" strokeWidth={10} fill="none" opacity={0.8} />}
        {t > heart && <text y={420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46 * pop(t, heart)} fill="#2e6b4f">DIL NA DUKHE</text>}
      </g>
      <Sparkles t={t} at={a + 2.3} cx={540} cy={1140} n={12} c={GOLD} />
    </g>
  );
};
/* S6: hands raised in dua; the comment box types the dua */
const S_Dua: React.FC<{ t: number }> = ({ t }) => {
  const a = L(6).start, txt = "Ya Allah, hamein sachcha Musalmaan bana de!", n = Math.floor(interp(t, [a + 0.8, L(6).end], [0, txt.length]));
  const up = k(t, a - 0.2, a + 0.5);
  return (
    <g>
      <rect width={W} height={H} fill="#140d1c" />
      <Stars t={t} o={0.8} />
      <Glow id="du22" cx={540} cy={1500} r={700} c="#ffb547" o={0.25} />
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
  const a = L(7).start;
  return (
    <g>
      <defs><linearGradient id="sh22" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#120b1a" /><stop offset="100%" stopColor="#2f1d14" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#sh22)" />
      <Stars t={t} />
      {Array.from({ length: 5 }, (_, i) => { const on = k(t, a + 0.3 + i * 0.45, a + 0.6 + i * 0.45); const x = 140 + i * 200, y = 1250 - (i % 2) * 140; return <g key={i} transform={`translate(${x} ${y})`}><line x1={0} y1={-500} x2={0} y2={-90} stroke="#5a3b22" strokeWidth={4} /><path d="M -40 -90 L 40 -90 L 30 0 L -30 0 Z" fill="#8a5a2a" /><path d="M -26 -78 L 26 -78 L 20 -10 L -20 -10 Z" fill="#ffe2a0" opacity={0.15 + 0.85 * on * flick(t, i)} /><Glow id={`sl22${i}`} cx={0} cy={-45} r={200} c="#ffb547" o={0.6 * on} /></g>; })}
      <g transform={`translate(540 760) scale(${1.5 * pop(t, a + 0.2)})`}><circle r={110} fill={GOLD} /><path d="M -40 30 Q -30 -40 30 -40 L 30 -70 L 80 -20 L 30 30 L 30 0 Q -20 -5 -40 30 Z" fill="#1d1420" /></g>
    </g>
  );
};

const HadithCard: React.FC<{ t: number }> = ({ t }) => {
  const a = L(2).start - 0.2, b = (L(2).end + L(3).start) / 2;
  if (t < a || t > b + 0.2) return null;
  const p = pop(t, a, 0.5), o = interp(t, [b - 0.2, b + 0.2], [1, 0]);
  return <div style={{ position: "absolute", left: 50, right: 50, top: 250, opacity: o * p, transform: `translateY(${(1 - p) * 40}px)`, background: "rgba(20,12,24,0.9)", border: `4px solid ${GOLD}`, borderRadius: 36, padding: "26px 26px 22px", textAlign: "center" }}>
    <div style={{ fontFamily: "Amiri", fontSize: 62, color: GOLD, direction: "rtl", lineHeight: 1.55 }}>الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ<br />مِنْ لِسَانِهِ وَيَدِهِ</div>
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: "#fff", marginTop: 8, lineHeight: 1.3 }}>"Musalmaan woh hai jis ki zabaan aur haath se doosre Musalmaan mehfooz rahein."</div>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#cbb98f", marginTop: 12, letterSpacing: "0.08em" }}>SAHIH AL-BUKHARI 10</div>
  </div>;
};

export const SadqahAnim1122: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Sign t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Dome t={t} /> },
    { a: b(1), b: b(2), r: (t) => <S_Safe t={t} /> },
    { a: b(2), b: b(3), r: (t) => <S_Tongue t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Hand t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Phone t={t} /> },
    { a: b(5), b: b(6), r: (t) => <S_Dua t={t} /> },
    { a: b(6), b: SADQAH1122_DUR + 1, r: (t) => <S_Share t={t} /> },
  ];
  const XF = 0.25;
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [SADQAH1122_DUR - 0.7, SADQAH1122_DUR], [0, 1]));
  const domeA = b(0), domeB = b(1);
  const dip = Math.max(0, ...[b(0), b(1)].map((x) => 1 - Math.abs(t - x) / 0.18));
  const push = 1 + 0.04 * ((t % 6) / 6);
  return (
    <AbsoluteFill style={{ background: "#140d1c" }}>
      {t >= domeA && t < domeB && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img src={staticFile("d1115/dome_s.jpg")} style={{ width: W, height: H, objectFit: "cover", transformOrigin: "50% 50%", transform: `scale(${1.03 + 0.12 * k(t, domeA, domeB)})`, filter: "saturate(1.05) sepia(0.12)" }} />
        </AbsoluteFill>
      )}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => {
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
      <Card font={FONT} t={t} a={L(0).start + 0.2} b={wt(0, "nishani") - 0.2} top={260} bg="rgba(20,12,24,0.9)" fg={GOLD} border={`4px solid ${GOLD}`} size={48}>Sachcha Musalmaan kaun?</Card>
      <Card font={FONT} t={t} a={wt(0, "nishani") - 0.2} b={b(0)} top={260} bg={GOLD} fg="#1d1420" size={46}>…aur ek badi nishani!</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.2} b={b(1)} top={260} bg="rgba(20,12,24,0.9)" fg="#fff" border={`4px solid ${GOLD}`} size={36}>Hazrat Abdullah bin Amr (Radi Allahu Anhuma)</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.6} b={b(1)} top={370} bg={GOLD} fg="#1d1420" size={44}>Sahih al-Bukhari 10</Card>
      <HadithCard t={t} />
      <Card font={FONT} t={t} a={L(5).start} b={b(5)} top={260} bg={GOLD} fg="#1d1420" size={42}>Online bhi: zabaan = keyboard</Card>
      <Card font={FONT} t={t} a={L(7).start + 0.3} b={SADQAH1122_DUR} top={1000} bg={GOLD} fg="#1d1420" size={48}>Aage bhejein = ek aur sadqah</Card>
      <Captions t={t} TL={TL} font={FONT} hi={GOLD} base="#a99b86" done="#ffffff" bg="rgba(20,12,24,0.85)" size={54} top={1600} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fade, dip) }} />
      {withAudio && <Audio src={staticFile("day1/d1122sadqah-mix.m4a")} />}
    </AbsoluteFill>
  );
};
