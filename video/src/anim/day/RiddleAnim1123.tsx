import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1123riddle-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, k } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, Captions, Card, Sparkles, Rain, Hand, W, H, rn } from "./AnimKit";

/* Solve by Sunrise · 23 Nov 2026 · Riddle #19 solution (9 sheep: "all but 9" = 9 stay) + Riddle #20
   "how many months have 28 days?" (answer: all 12). Mystery palette (night, amber, rain).
   Ordinary people with faces, named only Person 1/2/3. No salam. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const RIDDLE1123_DUR = TL.total;
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
        <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={AMB}>#20</text>
      </g>
    </g>
  );
};

/* a sheep: origin = between the hooves on the ground; run 0..1 makes it gallop */
const Sheep: React.FC<{ x: number; y: number; s?: number; t: number; run?: number; flip?: boolean; seed?: number }> = ({ x, y, s = 1, t, run = 0, flip, seed = 0 }) => {
  const g = Math.sin(t * 16 + seed) * 20 * run, hop = Math.abs(Math.sin(t * 16 + seed)) * 16 * run, bob = Math.sin(t * 2 + seed) * 3;
  return (
    <g transform={`translate(${x} ${y - hop}) scale(${flip ? -s : s},${s})`}>
      {[-40, -14, 18, 44].map((lx, i) => <rect key={i} x={lx - 8} y={-50} width={16} height={50} rx={6} fill="#2b2b33" transform={`rotate(${i % 2 ? g : -g} ${lx} -50)`} />)}
      {[[-40, -80], [0, -96], [40, -82], [-20, -60], [24, -60], [-56, -60], [56, -62]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy + bob} r={34} fill="#f4f1ea" />)}
      <g transform={`translate(70 ${-92 + bob})`}><ellipse rx={26} ry={32} fill="#2b2b33" /><ellipse cx={-18} cy={-18} rx={14} ry={7} fill="#2b2b33" transform="rotate(-30 -18 -18)" /><circle cx={8} cy={-6} r={4} fill="#fff" /></g>
    </g>
  );
};
const FLOCK = Array.from({ length: 17 }, (_, i) => { const r = rn(i + 700); return { x: 340 + (i % 5) * 150 + r() * 30, y: 1160 + Math.floor(i / 5) * 105 + r() * 20, s: 0.85 + r() * 0.12 }; });
const Farm: React.FC<{ t: number; storm: number }> = ({ t, storm }) => (
  <g>
    <defs><linearGradient id="fm22" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={storm > 0.5 ? "#070a1a" : "#1a2244"} /><stop offset="100%" stopColor="#3a3350" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#fm22)" />
    <circle cx={850} cy={360} r={60} fill="#f3f0dc" opacity={0.85 * (1 - storm)} />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={((t * (30 + 50 * storm) + i * 380) % 1400) - 150} cy={320 + i * 90} rx={240} ry={70} fill="#2a2f4a" opacity={0.4 + 0.5 * storm} />)}
    <path d="M 0 1000 Q 300 900 600 980 T 1080 940 L 1080 1920 L 0 1920 Z" fill="#23402e" />
    <rect y={1460} width={W} height={460} fill="#1c3326" />
    {Array.from({ length: 9 }, (_, i) => <g key={i}><rect x={20 + i * 130} y={1030} width={16} height={130} fill="#6b4630" /></g>)}
    <rect x={0} y={1060} width={W} height={12} fill="#6b4630" /><rect x={0} y={1110} width={W} height={12} fill="#6b4630" />
    <g transform="translate(900 1000)"><rect x={-110} y={-200} width={220} height={200} fill="#7a2e2e" /><path d="M -130 -200 L 0 -300 L 130 -200 Z" fill="#5a1f1f" /><rect x={-40} y={-110} width={80} height={110} fill="#2b1a1a" /></g>
  </g>
);
const NINE = [0, 2, 4, 6, 8, 10, 12, 14, 16]; /* which of the 17 stay */
/* S0: recap: 17 sheep with a counter; on "run" the 8 others gallop off; "?" on "left" */
const S_Recap: React.FC<{ t: number }> = ({ t }) => {
  const run = wt(0, "run") - 0.2, q = pop(t, wt(0, "left") - 0.2);
  return (
    <g>
      <Farm t={t} storm={0.6} />
      {FLOCK.map((s, i) => { const stay = NINE.includes(i); const go = stay ? 0 : k(t, run + i * 0.03, run + 1.1 + i * 0.03); return <Sheep key={i} t={t} x={s.x - go * (1300 + i * 30)} y={s.y} s={s.s * pop(t, 0.2 + i * 0.05)} run={go > 0 && go < 1 ? 1 : 0} seed={i} flip={!stay || i % 3 === 0} />; })}
      <g transform="translate(700 700)"><rect x={-170} y={-90} width={340} height={170} rx={34} fill="#0b1026" stroke={AMB} strokeWidth={6} /><text y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={AMB}>17</text></g>
      {q > 0 && <text x={300} y={760 - 10 * Math.sin(t * 3)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={180 * q} fill={AMB}>?</text>}
    </g>
  );
};
/* S1: replay: every sheep but nine runs away; the nine that stay get a green ring and a number 1..9 */
const S_Except: React.FC<{ t: number }> = ({ t }) => {
  const ev = wt(1, "every") - 0.1, ex = wt(1, "except");
  return (
    <g>
      <Farm t={t} storm={0.3} />
      {FLOCK.map((s, i) => { const stay = NINE.includes(i); const go = stay ? 0 : k(t, ev + i * 0.03, ev + 1.0 + i * 0.03); return <Sheep key={i} t={t} x={s.x - go * (1300 + i * 30)} y={s.y} s={s.s} run={go > 0 && go < 1 ? 1 : 0} seed={i} flip={!stay} />; })}
      {NINE.map((idx, j) => { const s = FLOCK[idx], p = pop(t, ex + j * 0.09); return p > 0 && <g key={j} transform={`translate(${s.x} ${s.y - 190}) scale(${p})`}><circle r={34} fill="#2ec27e" /><text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#fff">{j + 1}</text></g>; })}
    </g>
  );
};
/* S2: the nine stay, bobbing happily; big "9 SHEEP" answer */
const S_Nine: React.FC<{ t: number }> = ({ t }) => {
  const ans = pop(t, wt(2, "answer"));
  return (
    <g>
      <Farm t={t} storm={0} />
      {NINE.map((idx, j) => { const s = FLOCK[idx]; return <Sheep key={j} t={t} x={s.x - 40} y={s.y - Math.abs(Math.sin(t * 5 + j)) * 10} s={s.s} seed={j} flip={j % 2 === 0} />; })}
      {pop(t, wt(2, "stay")) > 0 && <g transform={`translate(700 700) scale(${pop(t, wt(2, "stay"))})`}><rect x={-170} y={-90} width={340} height={170} rx={34} fill="#0b1026" stroke="#2ec27e" strokeWidth={6} /><text y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#2ec27e">9</text></g>}
      {ans > 0 && <g transform={`translate(540 1000) scale(${ans})`}><rect x={-300} y={-90} width={600} height={180} rx={40} fill="#2ec27e" /><text y={34} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill="#fff">9 SHEEP</text></g>}
      <Sparkles t={t} at={wt(2, "answer")} cx={540} cy={1000} n={14} />
    </g>
  );
};
/* a wall calendar; origin = top hook */
const Calendar: React.FC<{ x: number; y: number; s?: number; r?: number; flip?: number }> = ({ x, y, s = 1, r = 0, flip = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <circle r={10} fill="#cfd3e6" />
    <rect x={-150} y={10} width={300} height={320} rx={16} fill="#fdfbf5" stroke="#cfd3e6" strokeWidth={4} />
    <rect x={-150} y={10} width={300} height={80} rx={16} fill="#e5383b" />
    <text y={68} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#fff">{["JAN", "FEB", "MAR", "APR"][Math.floor(flip) % 4]}</text>
    {Array.from({ length: 28 }, (_, i) => <rect key={i} x={-130 + (i % 7) * 38} y={110 + Math.floor(i / 7) * 52} width={28} height={36} rx={5} fill="#d9dce8" />)}
  </g>
);
/* S4: Person 1 under the street lamp holds up a calendar (pages flip), a "?" pops on "question" */
const S_Cal: React.FC<{ t: number }> = ({ t }) => {
  const cal = wt(4, "calendar") - 0.2, q = pop(t, wt(4, "question") - 0.2);
  const up = k(t, cal - 0.3, cal + 0.2);
  return (
    <g>
      <Night t={t} />
      <Rain t={t} n={40} o={0.3} />
      <g transform="translate(400 1660) scale(0.9)"><Seeker uid="p1c" t={t} look={P1} blink={blinkAt(t, 3)} smile={0.6} brow={0.4} gazeX={0.7} gazeY={-0.3} rArm={[-6 - 130 * up, 8 - 40 * up]} lArm={[-6, 8]} /></g>
      {up > 0 && <Calendar x={730} y={interp(up, [0, 1], [1500, 820])} s={1.1} r={4 * Math.sin(t * 2)} flip={Math.max(0, (t - cal) * 2.5)} />}
      <Label x={400} y={870} n={1} o={0.9} />
      {q > 0 && <text x={850} y={720 - 10 * Math.sin(t * 3)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170 * q} fill={AMB}>?</text>}
    </g>
  );
};
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/* S5: a 12-month board: 31-day months light up on "thirty-one", 30-day months on "thirty", FEB pulses "28?" on "twenty-eight" */
const S_Board: React.FC<{ t: number }> = ({ t }) => {
  const a31 = wt(5, "thirtyone"), a30 = wt(5, "thirty", 1), a28 = wt(5, "twentyeight");
  return (
    <g>
      <Night t={t} lamp={0.6} />
      <rect x={70} y={560} width={940} height={880} rx={40} fill="#0b1026" stroke={AMB} strokeWidth={6} opacity={0.95} />
      {MONTHS.map((m, i) => {
        const x = 150 + (i % 3) * 300, y = 620 + Math.floor(i / 3) * 200, d = DAYS[i];
        const on = d === 31 ? pop(t, a31 + i * 0.05) : d === 30 ? pop(t, a30 + i * 0.05) : pop(t, a28);
        const fill = d === 31 ? AMB : d === 30 ? "#7aa2ff" : "#e5383b";
        const sc = d === 28 && t > a28 ? 1 + 0.08 * Math.sin(t * 10) : 1;
        return <g key={i} transform={`translate(${x + 120} ${y + 75}) scale(${sc})`}>
          <rect x={-120} y={-75} width={240} height={150} rx={24} fill={on > 0 ? fill : "#1f2140"} opacity={on > 0 ? 0.3 + 0.7 * Math.min(1, on) : 1} />
          <text y={-14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#fff">{m}</text>
          {on > 0 && <text y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52 * Math.min(1, on)} fill="#fff">{d === 28 ? "28?" : d}</text>}
        </g>;
      })}
    </g>
  );
};
/* S6: Person 2 says "Only one!"; Person 3 shakes their head "No way!" */
const S_Argue: React.FC<{ t: number }> = ({ t }) => {
  const p2 = wt(6, "only"), p3 = wt(6, "way");
  const shake = t > p3 - 0.3 ? Math.sin(t * 14) * 8 * (1 - k(t, p3 + 0.6, p3 + 1.2)) : 0;
  return (
    <g>
      <Night t={t} />
      <Rain t={t} n={40} o={0.3} />
      <g transform="translate(300 1640) scale(0.85)"><Seeker uid="p2b" t={t} look={P2} blink={blinkAt(t, 5)} smile={0.8} brow={0.6} gazeX={0.6} mouthOpen={t > p2 - 0.4 && t < p2 + 0.5 ? 0.3 : 0} rArm={[-150, -30]} lArm={[-6, 8]} /></g>
      <Label x={300} y={790} n={2} o={0.9} />
      <g transform="translate(790 1640) scale(0.85)"><Seeker uid="p3b" t={t} look={P3} blink={blinkAt(t, 6)} smile={0} brow={-0.5} tilt={shake} gazeX={-0.6} lArm={t > p3 - 0.3 ? [40, 140] : [-6, 8]} rArm={t > p3 - 0.3 ? [40, 140] : [-6, 8]} /></g>
      <Label x={790} y={790} n={3} o={0.9} />
      {pop(t, p2 - 0.3) > 0 && <g transform={`translate(330 560) scale(${pop(t, p2 - 0.3)})`}><rect x={-220} y={-90} width={440} height={170} rx={50} fill="#fff" /><path d="M -40 80 L -10 140 L 20 80 Z" fill="#fff" /><text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#0b1026">ONLY 1!</text></g>}
      {pop(t, p3 - 0.2) > 0 && <g transform={`translate(780 560) scale(${pop(t, p3 - 0.2)})`}><rect x={-220} y={-90} width={440} height={170} rx={50} fill="#e5383b" /><path d="M -20 80 L 10 140 L 40 80 Z" fill="#e5383b" /><text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={68} fill="#fff">NO WAY!</text></g>}
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
          <g transform={`translate(${p.x} 1640) scale(0.62)`}><Seeker uid={`q23${i}${vote ? "v" : ""}`} t={t} look={p.l} blink={blinkAt(t, 4 + i)} gazeY={-0.6} gazeX={(1 - i) * 0.4} brow={0.5} smile={0.3} rArm={i === 1 ? [-20 - 10 * Math.sin(t * 3), 120] : [-6, 8]} /></g>
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
    <div style={{ color: AMB, fontSize: 76, fontWeight: 900, lineHeight: 1.1, marginTop: 10 }}>HOW MANY MONTHS HAVE 28 DAYS?</div>
    <div style={{ color: "#fff", fontSize: 40, fontWeight: 700, marginTop: 18 }}>Some have 31 · some have 30</div>
  </div>;
};
const Vote: React.FC<{ t: number }> = ({ t }) => {
  const a = L(8).start;
  if (t < a - 0.1) return null;
  const opts = ["1 month", "2 months", "12 months"];
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
      {sol ? "RIDDLE #19 · THE ANSWER" : `DAY 20 · 9:${String(10 + Math.floor(Math.max(0, t - L(3).start) / 10)).padStart(2, "0")} PM · THE CALENDAR · RIDDLE #20`}</span>
  </div>;
};

export const RiddleAnim1123: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Recap t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Except t={t} /> },
    { a: b(1), b: b(2), r: (t) => <S_Nine t={t} /> },
    { a: b(2), b: b(3), r: (t) => <S_Title t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Cal t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Board t={t} /> },
    { a: b(5), b: b(6), r: (t) => <S_Argue t={t} /> },
    { a: b(6), b: b(7), r: (t) => <S_Question t={t} vote={false} /> },
    { a: b(7), b: RIDDLE1123_DUR + 1, r: (t) => <S_Question t={t} vote /> },
  ];
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [RIDDLE1123_DUR - 0.6, RIDDLE1123_DUR], [0, 1]));
  const dip = Math.max(0, ...[1, 2, 3, 4, 5, 6, 7].map((i) => 1 - Math.abs(t - b(i - 1)) / 0.15)) * 0.85;
  const push = 1 + 0.03 * Math.sin(t * 0.4);
  return (
    <AbsoluteFill style={{ background: "#0b1026" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, transform: `scale(${push})` }}>
        {SHOTS.map((s, i) => (t >= s.a && t < s.b ? <g key={i}>{s.r(t)}</g> : null))}
      </svg>
      <HUD t={t} />
      <Card font={FONT} t={t} a={0.4} b={b(0)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={44}>YESTERDAY'S RIDDLE</Card>
      <Card font={FONT} t={t} a={wt(1, "means")} b={b(1)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={46}>ALL BUT 9 = 9 STAY</Card>
      <Card font={FONT} t={t} a={wt(2, "answer")} b={b(2)} top={260} bg="#2ec27e" size={50}>THE ANSWER: 9</Card>
      <Card font={FONT} t={t} a={wt(5, "thirtyone")} b={b(5)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={42}>CLUE 1 · SOME MONTHS = 31 DAYS</Card>
      <Card font={FONT} t={t} a={wt(5, "thirty", 1)} b={b(5)} top={380} bg="#0b1026" fg="#7aa2ff" border="4px solid #7aa2ff" size={42}>CLUE 2 · SOME = 30 DAYS</Card>
      <QCard t={t} />
      <Vote t={t} />
      <Captions t={t} TL={TL} font={FONT} hi={AMB} base="#8a90a8" done="#ffffff" bg="rgba(11,16,38,0.88)" size={58} top={1580} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fade, dip) }} />
      {withAudio && <Audio src={staticFile("day1/d1123riddle-mix.m4a")} />}
    </AbsoluteFill>
  );
};
