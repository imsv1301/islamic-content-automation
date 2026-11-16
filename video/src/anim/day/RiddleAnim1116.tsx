import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1116riddle-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, k } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, Captions, Card, Sparkles, Rain, Hand, W, H, rn } from "./AnimKit";

/* Solve by Sunrise · 16 Nov 2026 · Riddle #17 solution (3 socks: only two colours, so any 3 socks contain a pair) + Riddle #18
   "3 tablets, one every half hour starting now: how many minutes until all are taken?" (answer: 60). Mystery palette (night, amber, rain).
   Ordinary people with faces, named only Person 1/2/3. No salam. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const RIDDLE1116_DUR = TL.total;
const FONT = "'Montserrat', sans-serif";
const AMB = "#ffb547";
const P1: Look = { beard: true, cap: null, top: "#5b6b8c", topD: "#45526d", pants: "#2c3446", shawl: false, hair: "#2a1d14" };
const P2: Look = { beard: false, cap: null, hijab: "#8a3b4f", top: "#c0788a", topD: "#9b5a6b", shawl: false, long: true, skin: ["#f0c9a4", "#d9a982", "#b8865f"] };
const P3: Look = { beard: false, cap: null, top: "#3f7d6b", topD: "#2f5f51", pants: "#22262e", shawl: false, hair: "#120c08", skin: ["#c99a72", "#ad7c55", "#8a5d3a"] };

const Night: React.FC<{ t: number; lamp?: number }> = ({ t, lamp = 1 }) => (
  <g>
    <defs><linearGradient id="n15" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0b1026" /><stop offset="70%" stopColor="#1f2140" /><stop offset="100%" stopColor="#3a2a2a" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#n15)" />
    {[[60, 700, 220, 760], [300, 560, 200, 900], [820, 640, 260, 820]].map(([x, y, w, h], i) => <g key={i}><rect x={x} y={y} width={w} height={h} fill="#151833" />{Array.from({ length: 8 }, (_, j) => <rect key={j} x={x + 26 + (j % 2) * (w / 2)} y={y + 40 + Math.floor(j / 2) * 120} width={50} height={70} fill={AMB} opacity={(j + i) % 3 === 0 ? (0.55 + 0.1 * Math.sin(t * 2 + j)) * lamp : 0.06} />)}</g>)}
    <rect y={1460} width={W} height={460} fill="#24202a" />
    <rect y={1460} width={W} height={10} fill="#3a3340" />
    <g transform="translate(900 0)"><rect x={-10} y={420} width={20} height={1050} fill="#2d2d38" /><path d="M -10 430 Q -10 380 -90 380 L -130 380" stroke="#2d2d38" strokeWidth={20} fill="none" /><path d="M -170 380 L -90 380 L -110 420 L -150 420 Z" fill="#40404c" />
      <Glow id="lamp15" cx={-130} cy={430} r={360} c={AMB} o={0.45 * lamp * (0.92 + 0.08 * Math.sin(t * 17))} /></g>
  </g>
);
const Label: React.FC<{ x: number; y: number; n: number; o?: number }> = ({ x, y, n, o = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}><rect x={-120} y={-34} width={240} height={64} rx={32} fill="#0b1026" stroke={AMB} strokeWidth={4} /><text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={AMB}>PERSON {n}</text></g>
);
/* a coin that can flip from "?" to its value (flip 0..1) */
const Coin: React.FC<{ x: number; y: number; r: number; c: string; flip: number; label: string; ring?: string }> = ({ x, y, r, c, flip, label, ring }) => {
  const sx = Math.abs(Math.cos(flip * Math.PI)), shown = flip > 0.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.max(0.05, sx)},1)`}>
      {ring && <circle r={r + 16} fill="none" stroke={ring} strokeWidth={10} />}
      <circle r={r} fill={c} stroke="#00000033" strokeWidth={6} /><circle r={r * 0.78} fill="none" stroke="#ffffff55" strokeWidth={4} />
      <text y={r * 0.28} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={shown ? r * 0.72 : r * 0.9} fill="#0b1026aa">{shown ? label : "?"}</text>
    </g>
  );
};
const Box: React.FC<{ t: number; at: number; txt: string; c: string; y?: number; size?: number; w?: number }> = ({ t, at, txt, c, y = 640, size = 70, w = 760 }) => {
  const p = pop(t, at); if (p <= 0) return null;
  return <g transform={`translate(540 ${y}) scale(${p})`}><rect x={-w / 2} y={-80} width={w} height={160} rx={30} fill="#0b1026" stroke={c} strokeWidth={8} /><text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={c}>{txt}</text></g>;
};

/* S3: thunder + title */
const S_Title: React.FC<{ t: number }> = ({ t }) => {
  const a = L(3).start, flash = Math.max(0, 1 - Math.abs(t - a - 0.15) * 6) + Math.max(0, 1 - Math.abs(t - a - 0.5) * 8) * 0.6;
  const p = pop(t, a + 0.3, 0.5);
  return (
    <g>
      <Night t={t} />
      <Rain t={t} n={90} o={0.45} />
      <path d="M 700 0 L 640 220 L 700 220 L 600 480" stroke="#fff8d0" strokeWidth={10} fill="none" opacity={flash} />
      <rect width={W} height={H} fill="#fff" opacity={flash * 0.35} />
      <g transform={`translate(540 900) scale(${p})`}>
        <text y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={60} fill="#cfd3e6" letterSpacing={10}>NEW MYSTERY</text>
        <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={AMB}>#18</text>
      </g>
    </g>
  );
};

/* bedroom used by S4-S6: the light goes out on "Power cut" */
const Bedroom: React.FC<{ t: number; dark: number }> = ({ t, dark }) => (
  <g>
    <rect width={W} height={H} fill="#2b2a3f" />
    <rect x={600} y={360} width={360} height={480} rx={16} fill="#121a3a" stroke="#4a4058" strokeWidth={16} />
    <circle cx={860} cy={480} r={40} fill="#f3f0dc" opacity={0.9} /><circle cx={878} cy={470} r={36} fill="#121a3a" />
    <Rain t={t} n={20} o={0.4} />
    <rect y={1460} width={W} height={460} fill="#3b2f3a" />
    {/* ceiling bulb */}
    <line x1={330} y1={0} x2={330} y2={300} stroke="#555" strokeWidth={5} /><circle cx={330} cy={330} r={40} fill={dark > 0.5 ? "#4a4a55" : "#fff3c4"} />
    <Glow id="bulb16" cx={330} cy={330} r={800} c="#ffe7a8" o={0.45 * (1 - dark)} />
  </g>
);
const DarkVeil: React.FC<{ dark: number }> = ({ dark }) => <rect width={W} height={H} fill="#03040c" opacity={0.62 * dark} />;
const Drawer: React.FC<{ open: number }> = ({ open }) => (
  <g>
    <rect x={580} y={1060} width={420} height={420} rx={14} fill="#6b4630" />
    <rect x={600} y={1090 + 0} width={380} height={160} rx={8} fill="#7d5539" transform={`translate(${-140 * open} 0)`} />
    <rect x={600} y={1280} width={380} height={170} rx={8} fill="#7d5539" />
    <rect x={760} y={1350} width={60} height={16} rx={8} fill="#c9a46a" />
    <rect x={760 - 140 * open} y={1160} width={60} height={16} rx={8} fill="#c9a46a" />
  </g>
);
const Sock: React.FC<{ x: number; y: number; c: string; r?: number; s?: number }> = ({ x, y, c, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M -22 -70 L 22 -70 L 22 20 Q 22 40 44 44 L 70 50 Q 92 56 86 76 Q 80 92 56 88 L 0 78 Q -22 74 -22 50 Z" fill={c} stroke={c === "#f4f4f4" ? "#bbb" : "#000"} strokeWidth={4} />
    <rect x={-22} y={-78} width={44} height={20} rx={5} fill={c === "#f4f4f4" ? "#dcdcdc" : "#333"} />
  </g>
);

/* S0: yesterday's drawer of mixed socks in the dark, "how many to be sure?" */
const MIXED = Array.from({ length: 20 }, (_, i) => { const r = rn(i + 500); return { x: 170 + r() * 740, y: 680 + r() * 520, r: (r() - 0.5) * 160, c: i % 2 ? "#f4f4f4" : "#1d1d22" }; });
const SockDrawer: React.FC<{ t: number; hide?: number }> = ({ t, hide = 0 }) => (
  <g>
    <rect width={W} height={H} fill="#1a1626" />
    <rect x={100} y={580} width={880} height={760} rx={30} fill="#6b4630" /><rect x={130} y={610} width={820} height={700} rx={20} fill="#4e3222" />
    {MIXED.slice(hide).map((s, i) => <Sock key={i} x={s.x + 6 * Math.sin(t * 2 + i)} y={s.y} c={s.c} r={s.r} s={0.85} />)}
  </g>
);
const S_Recap: React.FC<{ t: number }> = ({ t }) => {
  const q = pop(t, wt(0, "sure"));
  return (
    <g>
      <SockDrawer t={t} />
      <DarkVeil dark={0.5} />
      {pop(t, wt(0, "black")) > 0 && <g transform={`translate(300 1440) scale(${pop(t, wt(0, "black"))})`}><rect x={-200} y={-60} width={400} height={120} rx={26} fill="#0b1026" stroke={AMB} strokeWidth={6} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#fff">10 BLACK</text></g>}
      {pop(t, wt(0, "white")) > 0 && <g transform={`translate(780 1440) scale(${pop(t, wt(0, "white"))})`}><rect x={-200} y={-60} width={400} height={120} rx={26} fill="#f4f4f4" stroke={AMB} strokeWidth={6} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#0b1026">10 WHITE</text></g>}
      {q > 0 && <text x={540} y={560 - 10 * Math.sin(t * 3)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={200 * q} fill={AMB}>?</text>}
    </g>
  );
};
/* S1-S2: socks come out one by one onto the table: black, white (no pair), then the third matches one of them */
const S_Pick: React.FC<{ t: number; phase: 1 | 2 }> = ({ t, phase }) => {
  const t1 = phase === 1 ? wt(1, "black") - 0.2 : -9, t2 = phase === 1 ? wt(1, "white") - 0.2 : -9, t3 = phase === 2 ? wt(2, "third") - 0.1 : 1e9;
  const third = k(t, t3, t3 + 0.6), thirdBlack = Math.floor(t * 2.5) % 2 === 0 && third < 1;
  const tc = third >= 1 ? "#1d1d22" : thirdBlack ? "#1d1d22" : "#f4f4f4";
  const fly = (at: number) => k(t, at, at + 0.5);
  const no = phase === 1 ? pop(t, wt(1, "pair")) : 0;
  const match = phase === 2 && t > wt(2, "match") + 0.2;
  const ans = phase === 2 ? pop(t, wt(2, "three")) : 0;
  return (
    <g>
      <Night t={t} />
      <rect x={60} y={1180} width={960} height={40} rx={12} fill="#6b4630" /><rect x={100} y={1220} width={30} height={250} fill="#4e3222" /><rect x={950} y={1220} width={30} height={250} fill="#4e3222" />
      <g transform="translate(200 1620) scale(0.8)"><Seeker uid={`p1k${phase}`} t={t} look={P1} blink={blinkAt(t, 1 + phase)} smile={match ? 1 : 0.3} brow={no > 0 ? -0.3 : 0.4} gazeX={0.8} gazeY={0.4} rArm={[-60 + 10 * Math.sin(t * 4), 30]} lArm={[-6, 8]} /></g>
      <Label x={200} y={560} n={1} o={0.9} />
      <Sock x={interp(phase === 1 ? fly(t1) : 1, [0, 1], [300, 470])} y={interp(phase === 1 ? fly(t1) : 1, [0, 1], [1000, 1100])} c="#1d1d22" s={1.1} r={-10} />
      <Sock x={interp(phase === 1 ? fly(t2) : 1, [0, 1], [300, 680])} y={interp(phase === 1 ? fly(t2) : 1, [0, 1], [1000, 1100])} c="#f4f4f4" s={1.1} r={10} />
      {phase === 2 && t > t3 && <Sock x={interp(third, [0, 1], [300, 880])} y={interp(third, [0, 1], [900, 1100])} c={tc} s={1.1} r={0} />}
      {phase === 1 && no > 0 && <g transform={`translate(575 840) scale(${no})`}><rect x={-240} y={-70} width={480} height={140} rx={30} fill="#0b1026" stroke="#e5383b" strokeWidth={8} /><text y={24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={66} fill="#e5383b">NO PAIR!</text></g>}
      {phase === 2 && third > 0 && third < 1 && <text x={880} y={860} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill="#cfd3e6">black or white…</text>}
      {match && <path d={`M 470 1010 Q 675 ${880 - 20 * Math.sin(t * 4)} 880 1010`} stroke="#7ee0a5" strokeWidth={10} fill="none" strokeDasharray="20 14" />}
      {ans > 0 && <g transform={`translate(540 700) scale(${ans})`}><circle r={130} fill="#2ec27e" /><text y={56} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill="#fff">3</text></g>}
      {phase === 2 && <Sparkles t={t} at={wt(2, "three")} cx={540} cy={700} n={14} />}
    </g>
  );
};
/* S4: Person 1 is ill (thermometer, sneeze); a box of three tablets pops open */
const Tablet: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}><rect x={-46} y={-22} width={92} height={44} rx={22} fill="#ffffff" stroke="#cfd8e6" strokeWidth={4} /><rect x={0} y={-22} width={46} height={44} rx={0} fill="#ff6b6b" /><rect x={24} y={-22} width={22} height={44} rx={22} fill="#ff6b6b" /></g>
);
const S_Ill: React.FC<{ t: number }> = ({ t }) => {
  const ill = wt(4, "ill"), tabs = wt(4, "tablets"), three = wt(4, "three");
  const sneeze = t > ill && t < ill + 0.6 ? Math.sin((t - ill) / 0.6 * Math.PI) : 0;
  const box = pop(t, three - 0.4);
  return (
    <g>
      <Bedroom t={t} dark={0} />
      <rect x={60} y={1260} width={520} height={220} rx={30} fill="#5b6b8c" /><rect x={60} y={1200} width={160} height={110} rx={30} fill="#f4f4f4" />
      <g transform={`translate(330 ${1640}) scale(0.95)`}><Seeker uid="p1i" t={t} look={P1} blink={blinkAt(t, 2)} closed={0.45 - 0.45 * sneeze} brow={-0.4} smile={0} tilt={-6 + 8 * sneeze} nod={-20 * sneeze} mouthOpen={0.5 * sneeze} gazeX={0.6} lArm={[-6, 8]} rArm={[20, 150]} /></g>
      {sneeze > 0.3 && <text x={540} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill="#cfd3e6">ACHOO!</text>}
      <Label x={330} y={560} n={1} o={0.9} />
      {box > 0 && <g transform={`translate(800 1180) scale(${box})`}>
        <rect x={-170} y={-60} width={340} height={150} rx={20} fill="#f4f4f4" stroke={AMB} strokeWidth={6} />
        <path d="M -170 -60 L 170 -60 L 140 -110 L -140 -110 Z" fill="#e8e8e8" transform={`rotate(${-30 * k(t, tabs, tabs + 0.5)} -170 -60)`} />
        {[0, 1, 2].map((i) => { const p = pop(t, three + 0.1 + i * 0.25); return p > 0 && <Tablet key={i} x={-100 + i * 100} y={10 - 120 * p} s={p} />; })}
      </g>}
    </g>
  );
};
/* S5: a big clock; the first tablet goes at "now" (no more is shown, so the answer isn't given away) */
const S_Clock: React.FC<{ t: number }> = ({ t }) => {
  const a = L(5).start, half = wt(5, "half"), now = wt(5, "now");
  const sweep = k(t, half - 0.2, half + 0.9);
  const first = k(t, now, now + 0.5);
  return (
    <g>
      <Night t={t} />
      <g transform="translate(540 980)">
        <circle r={330} fill="#0b1026" stroke={AMB} strokeWidth={14} />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-6} y={-310} width={12} height={i % 3 ? 26 : 50} fill={AMB} transform={`rotate(${i * 30})`} />)}
        <path d={`M 0 0 L 0 -290 A 290 290 0 ${sweep > 0.5 ? 1 : 0} 1 ${290 * Math.sin(sweep * Math.PI)} ${-290 * Math.cos(sweep * Math.PI)} Z`} fill={AMB} opacity={0.25} />
        <rect x={-8} y={-260} width={16} height={270} rx={8} fill="#fff" transform={`rotate(${180 * sweep})`} />
        <rect x={-10} y={-160} width={20} height={170} rx={10} fill="#cfd3e6" transform={`rotate(${15 * sweep})`} />
        <circle r={22} fill={AMB} />
        {sweep > 0.2 && <text y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={AMB}>30 MIN</text>}
      </g>
      {[0, 1, 2].map((i) => <Tablet key={i} x={360 + i * 180} y={1460} s={1.3} o={i === 0 ? 1 - first : 1} />)}
      {first > 0 && first < 1 && <Tablet x={360} y={1460 - 260 * first} s={1.3 * (1 - first * 0.6)} />}
      {t > now && <g transform={`translate(360 1600) scale(${pop(t, now)})`}><rect x={-110} y={-44} width={220} height={88} rx={22} fill="#2ec27e" /><text y={18} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#fff">NOW</text></g>}
    </g>
  );
};
/* S6: Person 2 says "90 minutes"; Person 3 shakes their head: "No way!" */
const S_Argue: React.FC<{ t: number }> = ({ t }) => {
  const p2 = wt(6, "ninety"), p3 = wt(6, "way");
  const shake = t > p3 - 0.3 ? Math.sin(t * 14) * 8 * (1 - k(t, p3 + 0.6, p3 + 1.2)) : 0;
  return (
    <g>
      <Night t={t} />
      <Rain t={t} n={40} o={0.3} />
      <g transform="translate(300 1640) scale(0.85)"><Seeker uid="p2a" t={t} look={P2} blink={blinkAt(t, 5)} smile={0.8} brow={0.6} gazeX={0.6} mouthOpen={t > p2 - 0.4 && t < p2 + 0.5 ? 0.3 : 0} rArm={[-130, -40]} lArm={[-6, 8]} /></g>
      <Label x={300} y={790} n={2} o={0.9} />
      <g transform="translate(790 1640) scale(0.85)"><Seeker uid="p3a" t={t} look={P3} blink={blinkAt(t, 6)} smile={0} brow={-0.5} tilt={shake} gazeX={-0.6} lArm={t > p3 - 0.3 ? [40, 140] : [-6, 8]} rArm={t > p3 - 0.3 ? [40, 140] : [-6, 8]} /></g>
      <Label x={790} y={790} n={3} o={0.9} />
      {pop(t, p2 - 0.3) > 0 && <g transform={`translate(330 560) scale(${pop(t, p2 - 0.3)})`}><rect x={-220} y={-90} width={440} height={170} rx={50} fill="#fff" /><path d="M -40 80 L -10 140 L 20 80 Z" fill="#fff" /><text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={72} fill="#0b1026">90 MIN!</text></g>}
      {pop(t, p3 - 0.2) > 0 && <g transform={`translate(780 560) scale(${pop(t, p3 - 0.2)})`}><rect x={-220} y={-90} width={440} height={170} rx={50} fill="#e5383b" /><path d="M -20 80 L 10 140 L 40 80 Z" fill="#e5383b" /><text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={68} fill="#fff">NO WAY!</text></g>}
    </g>
  );
};
/* S7: question card with Person 1/2/3 thinking; S8: vote ending with sunrise */
const S_Question: React.FC<{ t: number; vote: boolean }> = ({ t, vote }) => {
  const a = vote ? L(8).start : L(7).start;
  const sun = vote ? k(t, a, a + 2.5) : 0;
  return (
    <g>
      <Night t={t} lamp={1 - sun} />
      <Rain t={t} n={40} o={0.25 * (1 - sun)} />
      <rect y={1200} width={W} height={720} fill="#ff9a3c" opacity={0.25 * sun} />
      <rect y={1000} width={W} height={920} fill="#ffcf6a" opacity={0.18 * sun} />
      {[{ x: 200, l: P1, n: 1 }, { x: 540, l: P2, n: 2 }, { x: 880, l: P3, n: 3 }].map((p, i) => (
        <g key={i}>
          <g transform={`translate(${p.x} 1640) scale(0.62)`}><Seeker uid={`q16${i}${vote ? "v" : ""}`} t={t} look={p.l} blink={blinkAt(t, 4 + i)} gazeY={-0.6} gazeX={(1 - i) * 0.4} brow={0.5} smile={0.3} rArm={i === 1 ? [-20 - 10 * Math.sin(t * 3), 120] : [-6, 8]} /></g>
          <Label x={p.x} y={1030} n={p.n} o={0.9} />
        </g>
      ))}
    </g>
  );
};
const QCard: React.FC<{ t: number }> = ({ t }) => {
  const a = L(7).start, p = pop(t, a, 0.45);
  if (t < a || t > L(8).start + 0.2) return null;
  return <div style={{ position: "absolute", left: 70, right: 70, top: 470, transform: `scale(${0.7 + 0.3 * p})`, opacity: p, background: "rgba(11,16,38,0.92)", border: `6px solid ${AMB}`, borderRadius: 40, padding: "40px 30px", textAlign: "center", fontFamily: FONT }}>
    <div style={{ color: "#cfd3e6", fontSize: 40, fontWeight: 800, letterSpacing: 6 }}>QUESTION</div>
    <div style={{ color: AMB, fontSize: 80, fontWeight: 900, lineHeight: 1.1, marginTop: 10 }}>HOW MANY MINUTES?</div>
    <div style={{ color: "#fff", fontSize: 40, fontWeight: 700, marginTop: 18 }}>3 tablets · 1 every 30 min · starting NOW</div>
  </div>;
};
const Vote: React.FC<{ t: number }> = ({ t }) => {
  const a = L(8).start;
  if (t < a - 0.1) return null;
  const opts = ["90 minutes", "60 minutes", "30 minutes"];
  return <div style={{ position: "absolute", left: 90, right: 90, top: 330, fontFamily: FONT, textAlign: "center" }}>
    <div style={{ color: "#fff", fontSize: 60, fontWeight: 900, marginBottom: 24, opacity: pop(t, a) }}>COMMENT <span style={{ color: AMB }}>1 · 2 · 3</span></div>
    {opts.map((o, i) => { const p = pop(t, a + 0.25 + i * 0.25); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, background: "rgba(11,16,38,0.9)", border: `4px solid ${AMB}`, borderRadius: 30, padding: "18px 30px", margin: "18px 0", transform: `translateX(${(1 - p) * 600}px)`, opacity: p }}>
      <div style={{ width: 80, height: 80, borderRadius: 40, background: AMB, color: "#0b1026", fontSize: 50, fontWeight: 900, lineHeight: "80px" }}>{i + 1}</div>
      <div style={{ color: "#fff", fontSize: 60, fontWeight: 800 }}>{o}</div></div>; })}
    <div style={{ color: "#cfd3e6", fontSize: 40, fontWeight: 700, marginTop: 20, opacity: pop(t, a + 1.2) }}>Answer drops tomorrow, at sunrise ☀️</div>
  </div>;
};

const HUD: React.FC<{ t: number }> = ({ t }) => {
  const sol = t < L(3).start;
  return <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", fontFamily: FONT }}>
    <span style={{ background: "rgba(11,16,38,0.85)", color: AMB, border: `3px solid ${AMB}`, borderRadius: 40, padding: "12px 28px", fontWeight: 800, fontSize: 32, letterSpacing: "0.08em" }}>
      {sol ? "RIDDLE #17 · THE ANSWER" : `DAY 18 · 7:${String(10 + Math.floor(Math.max(0, t - L(3).start) / 10)).padStart(2, "0")} AM · SICK DAY · RIDDLE #18`}</span>
  </div>;
};

export const RiddleAnim1116: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Recap t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Pick t={t} phase={1} /> },
    { a: b(1), b: b(2), r: (t) => <S_Pick t={t} phase={2} /> },
    { a: b(2), b: b(3), r: (t) => <S_Title t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Ill t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Clock t={t} /> },
    { a: b(5), b: b(6), r: (t) => <S_Argue t={t} /> },
    { a: b(6), b: b(7), r: (t) => <S_Question t={t} vote={false} /> },
    { a: b(7), b: RIDDLE1116_DUR + 1, r: (t) => <S_Question t={t} vote /> },
  ];
  const XF = 0.2;
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [RIDDLE1116_DUR - 0.6, RIDDLE1116_DUR], [0, 1]));
  const push = 1 + 0.03 * Math.sin(t * 0.4);
  return (
    <AbsoluteFill style={{ background: "#0b1026" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, transform: `scale(${push})` }}>
        {SHOTS.map((s, i) => {
          if (t < s.a - XF || t > s.b + XF) return null;
          const o = s.a === 0 ? 1 : interp(t, [s.a - XF, s.a + XF], [0, 1]);
          return <g key={i} opacity={o}>{s.r(t)}</g>;
        })}
      </svg>
      <HUD t={t} />
      <Card font={FONT} t={t} a={0.4} b={b(0)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={44}>YESTERDAY'S RIDDLE</Card>
      <Card font={FONT} t={t} a={wt(1, "two")} b={b(1)} top={260} bg="#e5383b" size={46}>2 SOCKS? COULD BE 1 + 1</Card>
      <Card font={FONT} t={t} a={wt(2, "answer")} b={b(2)} top={260} bg="#2ec27e" size={56}>ANSWER: 3 SOCKS</Card>
      <Card font={FONT} t={t} a={wt(4, "three")} b={b(4)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={44}>CLUE 1 · 3 TABLETS</Card>
      <Card font={FONT} t={t} a={wt(5, "half")} b={b(5)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={44}>CLUE 2 · 1 EVERY 30 MIN, FROM NOW</Card>
      <QCard t={t} />
      <Vote t={t} />
      <Captions t={t} TL={TL} font={FONT} hi={AMB} base="#8a90a8" done="#ffffff" bg="rgba(11,16,38,0.88)" size={58} top={1580} />
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
      {withAudio && <Audio src={staticFile("day1/d1116riddle-mix.m4a")} />}
    </AbsoluteFill>
  );
};
