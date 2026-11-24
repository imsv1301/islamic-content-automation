import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1124riddle-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, k } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, Captions, Card, Sparkles, Rain, Hand, W, H, rn } from "./AnimKit";

/* Solve by Sunrise · 24 Nov 2026 · Riddle #20 solution (all 12 months have at least 28 days) + Riddle #21
   "a rooster lays an egg on the peak of a barn roof: which way does it roll?" (answer: neither, roosters
   don't lay eggs). Mystery palette (night, amber, rain).
   Ordinary people with faces, named only Person 1/2/3. No salam. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const RIDDLE1124_DUR = TL.total;
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
        <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={AMB}>#21</text>
      </g>
    </g>
  );
};
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/* 12-month board. mode 0: recap (31 amber, 30 blue, FEB "28?"); mode 1: each tile fills a bar up to a green 28 line;
   mode 2: all 12 tiles turn green with a tick */
const Board: React.FC<{ t: number; mode: 0 | 1 | 2 }> = ({ t, mode }) => {
  const a31 = wt(0, "thirtyone"), a30 = wt(0, "thirty", 1), a28 = wt(0, "twentyeight");
  const fillA = wt(1, "every"), tickA = wt(2, "twelve");
  return (
    <g>
      <Night t={t} lamp={0.6} />
      <rect x={70} y={560} width={940} height={880} rx={40} fill="#0b1026" stroke={mode === 2 ? "#2ec27e" : AMB} strokeWidth={6} opacity={0.95} />
      {MONTHS.map((m, i) => {
        const x = 150 + (i % 3) * 300, y = 620 + Math.floor(i / 3) * 200, d = DAYS[i];
        const on = mode > 0 ? 1 : d === 31 ? pop(t, a31 + i * 0.05) : d === 30 ? pop(t, a30 + i * 0.05) : pop(t, a28);
        const fill = mode === 2 && t > tickA + i * 0.06 ? "#2ec27e" : d === 31 ? AMB : d === 30 ? "#7aa2ff" : "#e5383b";
        const sc = mode === 0 && d === 28 && t > a28 ? 1 + 0.08 * Math.sin(t * 10) : mode === 1 && d === 28 && t < fillA ? 1 + 0.06 * Math.sin(t * 10) : 1;
        const bar = mode === 1 ? k(t, fillA + i * 0.12, fillA + 0.8 + i * 0.12) : mode === 2 ? 1 : 0;
        const tick = mode === 2 ? pop(t, tickA + i * 0.06) : 0;
        return <g key={i} transform={`translate(${x + 120} ${y + 75}) scale(${sc})`}>
          <rect x={-120} y={-75} width={240} height={150} rx={24} fill={on > 0 ? fill : "#1f2140"} opacity={on > 0 ? 0.3 + 0.7 * Math.min(1, on) : 1} />
          <text y={-14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#fff">{m}</text>
          {on > 0 && mode === 0 && <text y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52 * Math.min(1, on)} fill="#fff">{d === 28 ? "28?" : d}</text>}
          {bar > 0 && <g><rect x={-95} y={22} width={190} height={30} rx={15} fill="#0b1026" opacity={0.6} /><rect x={-95} y={22} width={190 * bar * (28 / d)} height={30} rx={15} fill="#fff" /><rect x={-95 + 190 * (28 / d) - 3} y={14} width={6} height={46} fill="#2ec27e" />{bar > 0.95 && <text x={70} y={48} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#0b1026">28</text>}</g>}
          {tick > 0 && <path d="M -30 0 L -8 22 L 34 -24" transform={`translate(96 -46) scale(${0.7 * tick})`} stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        </g>;
      })}
      {mode === 2 && pop(t, tickA + 0.9) > 0 && <g transform={`translate(540 470) scale(${pop(t, tickA + 0.9)})`}><rect x={-330} y={-90} width={660} height={180} rx={40} fill="#2ec27e" /><text y={34} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={92} fill="#fff">12 MONTHS</text></g>}
      {mode === 2 && <Sparkles t={t} at={tickA + 0.9} cx={540} cy={470} n={14} />}
    </g>
  );
};
/* a rooster: origin = feet on the ground; walk 0..1 bobs and steps, peck tilts the head */
const Rooster: React.FC<{ x: number; y: number; s?: number; t: number; walk?: number; flip?: boolean; crow?: number }> = ({ x, y, s = 1, t, walk = 0, flip, crow = 0 }) => {
  const st = Math.sin(t * 12) * 18 * walk, bob = Math.abs(Math.sin(t * 12)) * 6 * walk + Math.sin(t * 2.4) * 2;
  const blink = blinkAt(t, 11);
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${flip ? -s : s},${s})`}>
      {[-14, 14].map((lx, i) => <g key={i} transform={`rotate(${i ? st : -st} ${lx} -60)`}><rect x={lx - 4} y={-60} width={8} height={58} fill="#e0a530" /><path d={`M ${lx - 16} 0 L ${lx} -6 L ${lx + 18} 0`} stroke="#e0a530" strokeWidth={7} fill="none" strokeLinecap="round" /></g>)}
      {/* tail */}
      {[["#1d6b4f", -60, -130, -150], ["#2a8a66", -50, -150, -120], ["#13472f", -70, -110, -175]].map(([c, a, b2, r], i) => <path key={i} d={`M -40 -110 Q ${a} ${b2} ${-110 - i * 10} ${-170 - i * 20 + Math.sin(t * 3 + i) * 6} Q -80 -110 -40 -80 Z`} fill={c as string} transform={`rotate(${Math.sin(t * 2 + i) * 3} -40 -100)`} />)}
      <ellipse cx={0} cy={-105} rx={62} ry={50} fill="#b5482b" />
      <path d="M -30 -110 Q 0 -70 40 -100 Q 10 -60 -30 -80 Z" fill="#8a3420" />
      <g transform={`translate(42 ${-150 - 6 * crow}) rotate(${-20 * crow})`}>
        <path d="M -20 30 Q -10 -10 10 -40 Q 30 -10 22 30 Z" fill="#c75a33" />
        <circle cx={10} cy={-40} r={26} fill="#d0663a" />
        <path d="M -8 -62 q 6 -22 14 -2 q 6 -24 14 -2 q 8 -18 12 4 Z" fill="#e5383b" />
        <path d={`M 32 -46 L 56 ${-40 + 6 * crow} L 32 -34 Z`} fill="#f2b632" />
        {crow > 0.2 && <path d="M 32 -36 L 52 -26 L 32 -30 Z" fill="#f2b632" />}
        <path d="M 30 -28 q 4 18 -4 22 q -8 -6 4 -22" fill="#e5383b" />
        <ellipse cx={18} cy={-44} rx={5} ry={6 * (1 - blink)} fill="#111" />
      </g>
    </g>
  );
};
/* the barn: big, centred, peak at (540, 760) */
const PEAK = { x: 540, y: 760 };
const Barn: React.FC<{ t: number; storm?: number }> = ({ t, storm = 0.3 }) => (
  <g>
    <defs><linearGradient id="fm24" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d1230" /><stop offset="100%" stopColor="#3a3350" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#fm24)" />
    <circle cx={880} cy={330} r={60} fill="#f3f0dc" opacity={0.85 * (1 - storm)} />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={((t * (30 + 50 * storm) + i * 380) % 1400) - 150} cy={300 + i * 90} rx={240} ry={70} fill="#2a2f4a" opacity={0.4 + 0.5 * storm} />)}
    <path d="M 0 1200 Q 300 1120 600 1180 T 1080 1150 L 1080 1920 L 0 1920 Z" fill="#23402e" />
    <rect y={1460} width={W} height={460} fill="#1c3326" />
    <rect x={250} y={1000} width={580} height={470} fill="#7a2e2e" />
    <path d={`M 200 1010 L ${PEAK.x} ${PEAK.y} L 880 1010 Z`} fill="#4a1a1a" />
    <path d={`M 200 1010 L ${PEAK.x} ${PEAK.y} L 880 1010`} stroke="#2b1010" strokeWidth={14} fill="none" strokeLinejoin="round" />
    <rect x={460} y={1210} width={160} height={260} fill="#2b1a1a" /><path d="M 460 1210 L 620 1470 M 620 1210 L 460 1470" stroke="#5a2525" strokeWidth={10} />
    <rect x={505} y={1060} width={70} height={70} fill={AMB} opacity={0.5 + 0.1 * Math.sin(t * 3)} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={20 + i * 160} y={1360} width={14} height={110} fill="#6b4630" />)}
    <rect x={0} y={1385} width={W} height={10} fill="#6b4630" />
  </g>
);
/* S4: Person 1 at the barn watches the rooster walk up the roof to the peak */
const S_Climb: React.FC<{ t: number }> = ({ t }) => {
  const a = wt(4, "rooster") - 0.3, z = wt(4, "top");
  const c = k(t, a, z + 0.6);
  /* path: from the right eave (880,1010) up the right slope to the peak */
  const rx = interp(c, [0, 1], [870, PEAK.x + 20]), ry = interp(c, [0, 1], [1010, PEAK.y + 4]);
  return (
    <g>
      <Barn t={t} />
      <Rain t={t} n={35} o={0.25} />
      <Rooster x={rx} y={ry} s={0.62} t={t} walk={c > 0 && c < 1 ? 1 : 0} flip crow={t > z + 0.7 ? k(t, z + 0.7, z + 1.0) * (1 - k(t, z + 1.6, z + 1.9)) : 0} />
      <g transform="translate(170 1700) scale(0.8)"><Seeker uid="p1r" t={t} look={P1} blink={blinkAt(t, 3)} smile={0.4} brow={0.5} gazeX={0.6} gazeY={-0.7} tilt={-4} rArm={[-40 - 60 * k(t, z, z + 0.5), 30]} lArm={[-6, 8]} /></g>
      <Label x={170} y={990} n={1} o={0.9} />
    </g>
  );
};
/* S5: close on the peak: the egg appears, wobbles; on "left"/"right" arrows slide down each slope; "?" */
const Egg: React.FC<{ x: number; y: number; r?: number; s?: number }> = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}><ellipse rx={30} ry={40} cy={-40} fill="#fbf3e2" stroke="#d9cdb4" strokeWidth={4} /><ellipse cx={-10} cy={-55} rx={8} ry={12} fill="#fff" opacity={0.8} /></g>
);
const S_Peak: React.FC<{ t: number }> = ({ t }) => {
  const egg = wt(5, "egg"), lft = wt(5, "left"), rgt = wt(5, "right", 1);
  const e = pop(t, egg - 0.1, 0.5), wob = t > egg ? Math.sin(t * 9) * 10 : 0;
  const la = k(t, lft - 0.2, lft + 0.4), ra = k(t, rgt - 0.2, rgt + 0.4);
  return (
    <g>
      <g transform="translate(540 760) scale(1.7) translate(-540 -760)"><Barn t={t} storm={0.5} /></g>
      <Rain t={t} n={35} o={0.25} />
      <Rooster x={PEAK.x + 140} y={PEAK.y - 10} s={0.95} t={t} flip={false} crow={0} />
      {e > 0 && <Egg x={PEAK.x} y={PEAK.y - 6} r={wob} s={e * 1.3} />}
      {la > 0 && <g opacity={la}><path d={`M ${PEAK.x - 70} ${PEAK.y + 40} L ${PEAK.x - 70 - 300 * la} ${PEAK.y + 40 + 140 * la}`} stroke={AMB} strokeWidth={18} strokeLinecap="round" /><path d="M -40 -30 L 0 0 L -40 30" transform={`translate(${PEAK.x - 70 - 300 * la} ${PEAK.y + 40 + 140 * la}) rotate(155)`} stroke={AMB} strokeWidth={18} fill="none" strokeLinecap="round" /><text x={PEAK.x - 300} y={PEAK.y + 300} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={AMB}>LEFT?</text></g>}
      {ra > 0 && <g opacity={ra}><path d={`M ${PEAK.x + 70} ${PEAK.y + 40} L ${PEAK.x + 70 + 300 * ra} ${PEAK.y + 40 + 140 * ra}`} stroke="#7aa2ff" strokeWidth={18} strokeLinecap="round" /><path d="M -40 -30 L 0 0 L -40 30" transform={`translate(${PEAK.x + 70 + 300 * ra} ${PEAK.y + 40 + 140 * ra}) rotate(25)`} stroke="#7aa2ff" strokeWidth={18} fill="none" strokeLinecap="round" /><text x={PEAK.x + 300} y={PEAK.y + 300} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill="#7aa2ff">RIGHT?</text></g>}
    </g>
  );
};
/* S6: Person 2 points left "LEFT!"; Person 3 points right "RIGHT!" */
const S_Argue: React.FC<{ t: number }> = ({ t }) => {
  const p2 = wt(6, "left"), p3 = wt(6, "right");
  return (
    <g>
      <Night t={t} />
      <Rain t={t} n={40} o={0.3} />
      <g transform="translate(300 1640) scale(0.85)"><Seeker uid="p2r" t={t} look={P2} blink={blinkAt(t, 5)} smile={0.8} brow={0.6} gazeX={-0.6} mouthOpen={t > p2 - 0.3 && t < p2 + 0.5 ? 0.3 : 0} lArm={t > p2 - 0.4 ? [-80, -10] : [-6, 8]} rArm={[-6, 8]} /></g>
      <Label x={300} y={790} n={2} o={0.9} />
      <g transform="translate(790 1640) scale(0.85)"><Seeker uid="p3r" t={t} look={P3} blink={blinkAt(t, 6)} smile={0.7} brow={0.5} gazeX={0.6} mouthOpen={t > p3 - 0.3 && t < p3 + 0.5 ? 0.3 : 0} rArm={t > p3 - 0.4 ? [-80, -10] : [-6, 8]} lArm={[-6, 8]} /></g>
      <Label x={790} y={790} n={3} o={0.9} />
      {pop(t, p2 - 0.3) > 0 && <g transform={`translate(300 560) scale(${pop(t, p2 - 0.3)})`}><rect x={-200} y={-90} width={400} height={170} rx={50} fill="#fff" /><path d="M -20 80 L 10 140 L 40 80 Z" fill="#fff" /><text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={68} fill="#0b1026">⬅ LEFT!</text></g>}
      {pop(t, p3 - 0.2) > 0 && <g transform={`translate(780 560) scale(${pop(t, p3 - 0.2)})`}><rect x={-200} y={-90} width={400} height={170} rx={50} fill="#7aa2ff" /><path d="M -20 80 L 10 140 L 40 80 Z" fill="#7aa2ff" /><text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={68} fill="#fff">RIGHT! ➡</text></g>}
    </g>
  );
};
/* S7: question with Person 1/2/3 thinking; S8: vote ending with sunrise */
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
          <g transform={`translate(${p.x} 1640) scale(0.62)`}><Seeker uid={`q24${i}${vote ? "v" : ""}`} t={t} look={p.l} blink={blinkAt(t, 4 + i)} gazeY={-0.6} gazeX={(1 - i) * 0.4} brow={0.5} smile={0.3} rArm={i === 1 ? [-20 - 10 * Math.sin(t * 3), 120] : [-6, 8]} /></g>
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
    <div style={{ color: AMB, fontSize: 76, fontWeight: 900, lineHeight: 1.1, marginTop: 10 }}>WHICH WAY DOES THE EGG ROLL?</div>
    <div style={{ color: "#fff", fontSize: 40, fontWeight: 700, marginTop: 18 }}>A rooster · the very top of the roof</div>
  </div>;
};
const Vote: React.FC<{ t: number }> = ({ t }) => {
  const a = L(8).start;
  if (t < a - 0.1) return null;
  const opts = ["Left side", "Right side", "Neither"];
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
      {sol ? "RIDDLE #20 · THE ANSWER" : `DAY 21 · 9:${String(10 + Math.floor(Math.max(0, t - L(3).start) / 10)).padStart(2, "0")} PM · THE BARN · RIDDLE #21`}</span>
  </div>;
};

export const RiddleAnim1124: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <Board t={t} mode={0} /> },
    { a: b(0), b: b(1), r: (t) => <Board t={t} mode={1} /> },
    { a: b(1), b: b(2), r: (t) => <Board t={t} mode={2} /> },
    { a: b(2), b: b(3), r: (t) => <S_Title t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Climb t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Peak t={t} /> },
    { a: b(5), b: b(6), r: (t) => <S_Argue t={t} /> },
    { a: b(6), b: b(7), r: (t) => <S_Question t={t} vote={false} /> },
    { a: b(7), b: RIDDLE1124_DUR + 1, r: (t) => <S_Question t={t} vote /> },
  ];
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [RIDDLE1124_DUR - 0.6, RIDDLE1124_DUR], [0, 1]));
  const dip = Math.max(0, ...[1, 2, 3, 4, 5, 6, 7].map((i) => 1 - Math.abs(t - b(i - 1)) / 0.15)) * 0.85;
  const push = 1 + 0.03 * Math.sin(t * 0.4);
  return (
    <AbsoluteFill style={{ background: "#0b1026" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, transform: `scale(${push})` }}>
        {SHOTS.map((s, i) => (t >= s.a && t < s.b ? <g key={i}>{s.r(t)}</g> : null))}
      </svg>
      <HUD t={t} />
      <Card font={FONT} t={t} a={0.4} b={b(0)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={44}>YESTERDAY'S RIDDLE</Card>
      <Card font={FONT} t={t} a={wt(1, "every")} b={b(1)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={44}>EVERY MONTH HAS AT LEAST 28</Card>
      <Card font={FONT} t={t} a={wt(2, "answer")} b={b(2)} top={260} bg="#2ec27e" size={50}>THE ANSWER: 12</Card>
      <Card font={FONT} t={t} a={wt(4, "rooster")} b={b(4)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={42}>CLUE 1 · A ROOSTER</Card>
      <Card font={FONT} t={t} a={wt(5, "peak")} b={b(5)} top={260} bg="#0b1026" fg="#7aa2ff" border="4px solid #7aa2ff" size={42}>CLUE 2 · AN EGG ON THE PEAK</Card>
      <QCard t={t} />
      <Vote t={t} />
      <Captions t={t} TL={TL} font={FONT} hi={AMB} base="#8a90a8" done="#ffffff" bg="rgba(11,16,38,0.88)" size={58} top={1580} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fade, dip) }} />
      {withAudio && <Audio src={staticFile("day1/d1124riddle-mix.m4a")} />}
    </AbsoluteFill>
  );
};
