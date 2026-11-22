import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1122riddle-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, k } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, Captions, Card, Sparkles, Rain, Hand, W, H, rn } from "./AnimKit";

/* Solve by Sunrise · 22 Nov 2026 · Riddle #18 solution (60 minutes: tablets at 0, 30, 60; only two gaps) + Riddle #19
   "17 sheep, all but 9 run away: how many are left?" (answer: 9). Mystery palette (night, amber, rain).
   Ordinary people with faces, named only Person 1/2/3. No salam. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const RIDDLE1122_DUR = TL.total;
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
        <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={AMB}>#19</text>
      </g>
    </g>
  );
};

const Tablet: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}><rect x={-46} y={-22} width={92} height={44} rx={22} fill="#ffffff" stroke="#cfd8e6" strokeWidth={4} /><rect x={0} y={-22} width={46} height={44} rx={0} fill="#ff6b6b" /><rect x={24} y={-22} width={22} height={44} rx={22} fill="#ff6b6b" /></g>
);

/* S0: recap: clock + three tablets + "?" ; S1-S2: a 0 / 30 / 60 timeline, tablets drop on their minute, two gap arcs */
const S_Recap: React.FC<{ t: number }> = ({ t }) => {
  const a = L(0).start, q = pop(t, wt(0, "minutes"));
  const sweep = (t - a) * 0.35 % 1;
  return (
    <g>
      <Night t={t} />
      <g transform="translate(540 900)">
        <circle r={300} fill="#0b1026" stroke={AMB} strokeWidth={14} />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-6} y={-282} width={12} height={i % 3 ? 24 : 46} fill={AMB} transform={`rotate(${i * 30})`} />)}
        <rect x={-8} y={-240} width={16} height={250} rx={8} fill="#fff" transform={`rotate(${360 * sweep})`} />
        <circle r={20} fill={AMB} />
      </g>
      {[0, 1, 2].map((i) => { const p = pop(t, wt(0, "tablets") + i * 0.2); return p > 0 && <Tablet key={i} x={360 + i * 180} y={1400 + 8 * Math.sin(t * 3 + i)} s={1.3 * p} />; })}
      {q > 0 && <text x={540} y={560 - 10 * Math.sin(t * 3)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={180 * q} fill={AMB}>?</text>}
    </g>
  );
};
const S_Line: React.FC<{ t: number; phase: 1 | 2 }> = ({ t, phase }) => {
  const xs = [200, 540, 880], y = 1000;
  const at = phase === 1 ? [wt(1, "zero"), 1e9, 1e9] : [-9, wt(2, "thirty"), wt(2, "sixty")];
  const gaps = phase === 2 ? pop(t, wt(2, "gaps") - 0.2) : 0;
  const ans = phase === 2 ? pop(t, wt(2, "answer")) : 0;
  return (
    <g>
      <Night t={t} />
      <rect x={140} y={y - 6} width={800} height={12} rx={6} fill="#cfd3e6" />
      {xs.map((x, i) => <g key={i}><rect x={x - 5} y={y - 40} width={10} height={80} fill={AMB} /><text x={x} y={y + 110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill={AMB}>{[0, 30, 60][i]}</text><text x={x} y={y + 160} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#cfd3e6">MIN</text></g>)}
      {xs.map((x, i) => { const d = k(t, at[i] - 0.3, at[i] + 0.2); return d > 0 && <Tablet key={i} x={x} y={interp(d, [0, 1], [500, y - 90])} s={1.4} />; })}
      {gaps > 0 && [0, 1].map((i) => <g key={i} opacity={gaps}>
        <path d={`M ${xs[i] + 20} ${y - 160} Q ${(xs[i] + xs[i + 1]) / 2} ${y - 300} ${xs[i + 1] - 20} ${y - 160}`} stroke="#7ee0a5" strokeWidth={10} fill="none" strokeDasharray="22 14" strokeDashoffset={-t * 60} />
        <text x={(xs[i] + xs[i + 1]) / 2} y={y - 310} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#7ee0a5">GAP {i + 1}</text></g>)}
      {ans > 0 && <g transform={`translate(540 1400) scale(${ans})`}><rect x={-300} y={-90} width={600} height={180} rx={40} fill="#2ec27e" /><text y={34} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100} fill="#fff">60 MIN</text></g>}
      {phase === 2 && <Sparkles t={t} at={wt(2, "answer")} cx={540} cy={1400} n={14} />}
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
/* S4: Person 1 on the farm, 17 sheep pop in with a counter */
const S_Flock: React.FC<{ t: number }> = ({ t }) => {
  const sev = wt(4, "seventeen") - 0.3;
  const n = Math.min(17, Math.max(0, Math.floor((t - sev) / 0.07) + 1));
  return (
    <g>
      <Farm t={t} storm={0} />
      {FLOCK.slice(0, n).map((s, i) => <Sheep key={i} t={t} x={s.x} y={s.y} s={s.s * pop(t, sev + i * 0.07)} flip={i % 3 === 0} seed={i} />)}
      <g transform="translate(150 1700) scale(0.75)"><Seeker uid="p1f" t={t} look={P1} blink={blinkAt(t, 7)} smile={0.9} gazeX={0.8} rArm={[-150, -30 + 16 * Math.sin(t * 7)]} lArm={[-6, 8]} /></g>
      <Label x={150} y={890} n={1} o={0.9} />
      {n > 0 && <g transform="translate(700 700)"><rect x={-170} y={-90} width={340} height={170} rx={34} fill="#0b1026" stroke={AMB} strokeWidth={6} /><text y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={AMB}>{n}</text></g>}
    </g>
  );
};
/* S5: storm: lightning, rain; the frightened flock bolts off-screen (nobody is counted, so the answer isn't shown) */
const S_Storm: React.FC<{ t: number }> = ({ t }) => {
  const a = L(5).start, run = wt(5, "run") - 0.3;
  const fl = Math.max(0, 1 - Math.abs(t - a - 0.2) * 6) + Math.max(0, 1 - Math.abs(t - a - 0.7) * 8) * 0.6;
  return (
    <g>
      <Farm t={t} storm={1} />
      <Rain t={t} n={110} o={0.55} />
      {FLOCK.map((s, i) => { const go = k(t, run + i * 0.05, run + 1.2 + i * 0.05); return <Sheep key={i} t={t} x={s.x - go * (1300 + i * 40)} y={s.y} s={s.s} run={go > 0 && go < 1 ? 1 : 0} seed={i} flip />; })}
      <rect width={W} height={H} fill="#03040c" opacity={0.35} />
      <path d="M 640 0 L 560 260 L 640 260 L 520 560" stroke="#fff8d0" strokeWidth={12} fill="none" opacity={fl} />
      <rect width={W} height={H} fill="#fff" opacity={fl * 0.35} />
      {pop(t, wt(5, "nine") - 0.2) > 0 && <g transform={`translate(540 700) scale(${pop(t, wt(5, "nine") - 0.2)})`}><rect x={-330} y={-90} width={660} height={170} rx={40} fill="#0b1026" stroke={AMB} strokeWidth={8} /><text y={34} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill={AMB}>ALL BUT 9…</text></g>}
    </g>
  );
};
/* S6: Person 2 says "8 left"; Person 3 shakes their head "No way!" */
const S_Argue: React.FC<{ t: number }> = ({ t }) => {
  const p2 = wt(6, "eight"), p3 = wt(6, "way");
  const shake = t > p3 - 0.3 ? Math.sin(t * 14) * 8 * (1 - k(t, p3 + 0.6, p3 + 1.2)) : 0;
  return (
    <g>
      <Night t={t} />
      <Rain t={t} n={40} o={0.3} />
      <g transform="translate(300 1640) scale(0.85)"><Seeker uid="p2a" t={t} look={P2} blink={blinkAt(t, 5)} smile={0.8} brow={0.6} gazeX={0.6} mouthOpen={t > p2 - 0.4 && t < p2 + 0.5 ? 0.3 : 0} rArm={[-130, -40]} lArm={[-6, 8]} /></g>
      <Label x={300} y={790} n={2} o={0.9} />
      <g transform="translate(790 1640) scale(0.85)"><Seeker uid="p3a" t={t} look={P3} blink={blinkAt(t, 6)} smile={0} brow={-0.5} tilt={shake} gazeX={-0.6} lArm={t > p3 - 0.3 ? [40, 140] : [-6, 8]} rArm={t > p3 - 0.3 ? [40, 140] : [-6, 8]} /></g>
      <Label x={790} y={790} n={3} o={0.9} />
      {pop(t, p2 - 0.3) > 0 && <g transform={`translate(330 560) scale(${pop(t, p2 - 0.3)})`}><rect x={-220} y={-90} width={440} height={170} rx={50} fill="#fff" /><path d="M -40 80 L -10 140 L 20 80 Z" fill="#fff" /><text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={68} fill="#0b1026">8 LEFT!</text></g>}
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
          <g transform={`translate(${p.x} 1640) scale(0.62)`}><Seeker uid={`q22${i}${vote ? "v" : ""}`} t={t} look={p.l} blink={blinkAt(t, 4 + i)} gazeY={-0.6} gazeX={(1 - i) * 0.4} brow={0.5} smile={0.3} rArm={i === 1 ? [-20 - 10 * Math.sin(t * 3), 120] : [-6, 8]} /></g>
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
    <div style={{ color: AMB, fontSize: 80, fontWeight: 900, lineHeight: 1.1, marginTop: 10 }}>HOW MANY SHEEP ARE LEFT?</div>
    <div style={{ color: "#fff", fontSize: 40, fontWeight: 700, marginTop: 18 }}>17 sheep · all but 9 run away</div>
  </div>;
};
const Vote: React.FC<{ t: number }> = ({ t }) => {
  const a = L(8).start;
  if (t < a - 0.1) return null;
  const opts = ["8 sheep", "9 sheep", "17 sheep"];
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
      {sol ? "RIDDLE #18 · THE ANSWER" : `DAY 19 · 11:${String(40 + Math.floor(Math.max(0, t - L(3).start) / 10)).padStart(2, "0")} PM · THE FARM · RIDDLE #19`}</span>
  </div>;
};

export const RiddleAnim1122: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Recap t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Line t={t} phase={1} /> },
    { a: b(1), b: b(2), r: (t) => <S_Line t={t} phase={2} /> },
    { a: b(2), b: b(3), r: (t) => <S_Title t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Flock t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Storm t={t} /> },
    { a: b(5), b: b(6), r: (t) => <S_Argue t={t} /> },
    { a: b(6), b: b(7), r: (t) => <S_Question t={t} vote={false} /> },
    { a: b(7), b: RIDDLE1122_DUR + 1, r: (t) => <S_Question t={t} vote /> },
  ];
  const XF = 0.2;
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [RIDDLE1122_DUR - 0.6, RIDDLE1122_DUR], [0, 1]));
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
      <Card font={FONT} t={t} a={0.4} b={b(0)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={44}>LAST RIDDLE</Card>
      <Card font={FONT} t={t} a={wt(1, "first")} b={b(1)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={46}>TABLET 1 = RIGHT NOW</Card>
      <Card font={FONT} t={t} a={wt(2, "gaps")} b={b(2)} top={260} bg="#2ec27e" size={50}>3 TABLETS = ONLY 2 GAPS</Card>
      <Card font={FONT} t={t} a={wt(4, "sheep")} b={b(4)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={44}>CLUE 1 · 17 SHEEP</Card>
      <Card font={FONT} t={t} a={wt(5, "all")} b={b(5)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={44}>CLUE 2 · ALL BUT 9 RUN AWAY</Card>
      <QCard t={t} />
      <Vote t={t} />
      <Captions t={t} TL={TL} font={FONT} hi={AMB} base="#8a90a8" done="#ffffff" bg="rgba(11,16,38,0.88)" size={58} top={1580} />
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
      {withAudio && <Audio src={staticFile("day1/d1122riddle-mix.m4a")} />}
    </AbsoluteFill>
  );
};
