import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1114riddle-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, k } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, Captions, Card, Sparkles, Rain, Hand, W, H, rn } from "./AnimKit";

/* Solve by Sunrise · 14 Nov 2026 · Riddle #15 solution (5p) + Riddle #16 "two coins make 30p, one of them is not a 10p".
   Mystery palette (night, amber, rain). Ordinary people with faces, named only Person 1/2/3. No salam. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const RIDDLE1114_DUR = TL.total;
const FONT = "'Montserrat', sans-serif";
const AMB = "#ffb547";
const P1: Look = { beard: true, cap: null, top: "#5b6b8c", topD: "#45526d", pants: "#2c3446", shawl: false, hair: "#2a1d14" };
const P2: Look = { beard: false, cap: null, hijab: "#8a3b4f", top: "#c0788a", topD: "#9b5a6b", shawl: false, long: true, skin: ["#f0c9a4", "#d9a982", "#b8865f"] };
const P3: Look = { beard: false, cap: null, top: "#3f7d6b", topD: "#2f5f51", pants: "#22262e", shawl: false, hair: "#120c08", skin: ["#c99a72", "#ad7c55", "#8a5d3a"] };

const Night: React.FC<{ t: number; lamp?: number }> = ({ t, lamp = 1 }) => (
  <g>
    <defs><linearGradient id="n14" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0b1026" /><stop offset="70%" stopColor="#1f2140" /><stop offset="100%" stopColor="#3a2a2a" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#n14)" />
    {[[60, 700, 220, 760], [300, 560, 200, 900], [820, 640, 260, 820]].map(([x, y, w, h], i) => <g key={i}><rect x={x} y={y} width={w} height={h} fill="#151833" />{Array.from({ length: 8 }, (_, j) => <rect key={j} x={x + 26 + (j % 2) * (w / 2)} y={y + 40 + Math.floor(j / 2) * 120} width={50} height={70} fill={AMB} opacity={(j + i) % 3 === 0 ? 0.55 + 0.1 * Math.sin(t * 2 + j) : 0.08} />)}</g>)}
    <rect y={1460} width={W} height={460} fill="#24202a" />
    <rect y={1460} width={W} height={10} fill="#3a3340" />
    {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={100 + i * 190} cy={1600 + (i % 2) * 120} rx={80} ry={10} fill={AMB} opacity={0.12} />)}
    <g transform="translate(900 0)"><rect x={-10} y={420} width={20} height={1050} fill="#2d2d38" /><path d="M -10 430 Q -10 380 -90 380 L -130 380" stroke="#2d2d38" strokeWidth={20} fill="none" /><path d="M -170 380 L -90 380 L -110 420 L -150 420 Z" fill="#40404c" />
      <Glow id="lamp14" cx={-130} cy={430} r={360} c={AMB} o={0.45 * lamp * (0.92 + 0.08 * Math.sin(t * 17))} /></g>
  </g>
);
const Label: React.FC<{ x: number; y: number; n: number; o?: number }> = ({ x, y, n, o = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}><rect x={-120} y={-34} width={240} height={64} rx={32} fill="#0b1026" stroke={AMB} strokeWidth={4} /><text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={AMB}>PERSON {n}</text></g>
);
const Tag: React.FC<{ x: number; y: number; txt: string; c?: string; s?: number; r?: number }> = ({ x, y, txt, c = AMB, s = 1, r = -6 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M -110 -46 L 90 -46 L 130 0 L 90 46 L -110 46 Z" fill={c} /><circle cx={92} cy={0} r={10} fill="#0b1026" />
    <text x={-10} y={18} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#0b1026">{txt}</text>
  </g>
);
const Pen: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(-20) scale(${s})`}><rect x={-140} y={-14} width={250} height={28} rx={10} fill="#3d7bd9" /><path d="M 110 -14 L 160 0 L 110 14 Z" fill="#f2d3a0" /><path d="M 145 -4 L 160 0 L 145 4 Z" fill="#222" /><rect x={-150} y={-16} width={30} height={32} rx={6} fill="#1e3f73" /><rect x={-100} y={-24} width={90} height={10} rx={4} fill="#c9d4e6" /></g>
);
const Notebook: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(6) scale(${s})`}><rect x={-130} y={-170} width={260} height={340} rx={16} fill="#d94f3d" /><rect x={-100} y={-120} width={200} height={70} rx={8} fill="#f6e7c8" />{Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-130} cy={-150 + i * 37} r={9} fill="#ddd" />)}</g>
);
const Counter: React.FC = () => (
  <g><rect x={40} y={1180} width={1000} height={60} rx={10} fill="#6b4630" /><rect x={60} y={1240} width={960} height={260} fill="#4e3222" /><rect x={60} y={1240} width={960} height={18} fill="#3b2418" /></g>
);
const Total: React.FC<{ t: number; at: number; txt: string; c: string; mark?: "x" | "tick"; markAt?: number }> = ({ t, at, txt, c, mark, markAt = 1e9 }) => {
  const p = pop(t, at); if (p <= 0) return null;
  const m = pop(t, markAt);
  return (
    <g transform={`translate(540 960) scale(${p})`}>
      <rect x={-260} y={-90} width={520} height={180} rx={30} fill="#0b1026" stroke={c} strokeWidth={8} />
      <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#cfd3e6">TOTAL</text>
      <text y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={0} fill={c}>.</text>
      <text y={74} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={76} fill={c}>{txt}</text>
      {mark === "x" && m > 0 && <g transform={`translate(230 -80) scale(${m})`}><circle r={60} fill="#e5383b" /><path d="M -26 -26 L 26 26 M 26 -26 L -26 26" stroke="#fff" strokeWidth={14} strokeLinecap="round" /></g>}
      {mark === "tick" && m > 0 && <g transform={`translate(230 -80) scale(${m})`}><circle r={60} fill="#2ec27e" /><path d="M -28 2 L -8 24 L 30 -22" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" /></g>}
    </g>
  );
};

/* S0 recap / S1 the trap / S2 the answer, all at the shop counter */
const S_Shop: React.FC<{ t: number; phase: 0 | 1 | 2 }> = ({ t, phase }) => {
  const shake = phase === 1 && t > wt(1, "twenty") ? Math.sin(t * 60) * 6 * Math.max(0, 1 - (t - wt(1, "twenty")) * 2) : 0;
  return (
    <g transform={`translate(${shake} 0)`}>
      <Night t={t} lamp={0.6} />
      <rect x={80} y={300} width={920} height={880} rx={20} fill="#1a1b30" stroke="#3a3350" strokeWidth={14} />
      <Rain t={t} n={50} o={0.3} />
      <Glow id={`shopG${phase}`} cx={540} cy={1180} r={700} c={AMB} o={0.35} />
      <Counter />
      <Pen x={300} y={1150} s={1.1} /><Notebook x={760} y={1020} />
      {phase === 0 && <>
        {pop(t, wt(0, "pen")) > 0 && <Tag x={300} y={1340} txt="PEN" s={pop(t, wt(0, "pen"))} c="#cfd3e6" />}
        {pop(t, wt(0, "notebook")) > 0 && <Tag x={770} y={1340} txt="BOOK" s={pop(t, wt(0, "notebook"))} c="#cfd3e6" r={4} />}
        <Total t={t} at={wt(0, "ten")} txt="£1.10" c={AMB} />
        {pop(t, wt(0, "more")) > 0 && <g opacity={pop(t, wt(0, "more"))}><path d="M 360 1100 Q 540 760 690 860" stroke="#7ee0a5" strokeWidth={10} fill="none" strokeDasharray="20 14" /><text x={560} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill="#7ee0a5" transform="translate(0 -60)">+ £1.00</text></g>}
      </>}
      {phase === 1 && <>
        <Tag x={300} y={1340} txt="10p?" s={pop(t, wt(1, "ten"))} />
        <Tag x={770} y={1340} txt="£1.10" s={pop(t, wt(1, "notebook"))} r={4} />
        <Total t={t} at={wt(1, "total")} txt="£1.20" c="#e5383b" mark="x" markAt={wt(1, "twenty") + 0.2} />
      </>}
      {phase === 2 && <>
        <Tag x={300} y={1340} txt="5p" s={pop(t, wt(2, "five"))} c="#7ee0a5" />
        <Tag x={770} y={1340} txt="£1.05" s={pop(t, wt(2, "notebook"))} c="#7ee0a5" r={4} />
        <Total t={t} at={wt(2, "together")} txt="£1.10" c="#7ee0a5" mark="tick" markAt={wt(2, "together") + 0.5} />
        <Sparkles t={t} at={wt(2, "together") + 0.5} cx={540} cy={960} n={14} />
      </>}
    </g>
  );
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
        <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={AMB}>#16</text>
      </g>
    </g>
  );
};

const Coin: React.FC<{ x: number; y: number; r: number; c: string; hide: number; label?: string }> = ({ x, y, r, c, hide, label }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={c} stroke="#00000033" strokeWidth={6} /><circle r={r * 0.78} fill="none" stroke="#ffffff55" strokeWidth={4} />
    {hide > 0.5 ? <text y={r * 0.32} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={r * 0.9} fill="#0b1026aa">?</text> : <text y={r * 0.25} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={r * 0.7} fill="#0b1026aa">{label}</text>}
  </g>
);

/* S4: Person 1 opens a hand, two coins */
const S_P1: React.FC<{ t: number }> = ({ t }) => {
  const open = k(t, wt(4, "shows") - 0.1, wt(4, "coins") + 0.2);
  const thirty = pop(t, wt(4, "thirty"));
  return (
    <g>
      <Night t={t} />
      <Rain t={t} n={60} o={0.3} />
      <g transform="translate(300 1560) scale(0.95)"><Seeker uid="p1a" t={t} look={P1} blink={blinkAt(t, 1)} smile={0.4} gazeX={0.8} gazeY={0.3} rArm={[-30, 60]} lArm={[-6, 8]} /></g>
      <Label x={300} y={560} n={1} />
      {/* close-up hand */}
      <g transform="translate(760 1260)">
        <Glow id="handG" cx={0} cy={-200} r={330} c={AMB} o={0.35 * open} />
        <Hand x={0} y={0} s={1.7} r={-8} skin="#c99a72" curl={1 - open} />
        {open > 0.6 && <><Coin x={-60} y={-230} r={62} c="#d6dbe2" hide={1} /><Coin x={70} y={-200} r={52} c="#e8c06a" hide={1} /></>}
      </g>
      {thirty > 0 && <g transform={`translate(740 640) scale(${thirty})`}><rect x={-200} y={-80} width={400} height={160} rx={30} fill="#0b1026" stroke={AMB} strokeWidth={8} /><text y={30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill={AMB}>= 30p</text></g>}
    </g>
  );
};

/* S5: Person 2 inspects with a magnifying glass */
const S_P2: React.FC<{ t: number }> = ({ t }) => {
  const lean = k(t, L(5).start, L(5).start + 0.6), not = pop(t, wt(5, "not"));
  return (
    <g>
      <Night t={t} />
      <Rain t={t} n={50} o={0.25} />
      <g transform={`translate(${380 + 60 * lean} 1560) scale(0.95) rotate(${6 * lean} 0 -400)`}><Seeker uid="p2a" t={t} look={P2} blink={blinkAt(t, 2)} brow={0.6} gazeX={0.9} gazeY={0.5} rArm={[-70, 60]} /></g>
      <Label x={380} y={460} n={2} />
      <g transform="translate(800 1180)"><Coin x={-60} y={0} r={62} c="#d6dbe2" hide={1} /><Coin x={70} y={30} r={52} c="#e8c06a" hide={1} /></g>
      <g transform={`translate(${700 + 60 * Math.sin(t * 2)} ${1120 + 20 * Math.cos(t * 2.4)})`}><circle r={110} fill="#cfe8ff22" stroke="#c9a46a" strokeWidth={18} /><rect x={70} y={70} width={30} height={170} rx={12} fill="#5b3a22" transform="rotate(-45 85 85)" /></g>
      {not > 0 && <g transform={`translate(540 600) scale(${not})`}><rect x={-400} y={-80} width={800} height={160} rx={30} fill="#0b1026" stroke="#e5383b" strokeWidth={8} /><text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill="#fff">ONE IS <tspan fill="#e5383b">NOT</tspan> A 10p</text></g>}
    </g>
  );
};

/* S6: Person 3: "impossible!" */
const S_P3: React.FC<{ t: number }> = ({ t }) => {
  const a = L(6).start, shout = t < wt(6, "or") ? 1 : 0;
  const arms = k(t, a, a + 0.3) * (1 - k(t, wt(6, "or") - 0.1, wt(6, "or") + 0.3));
  const stamp = pop(t, wt(6, "impossible"), 0.3);
  return (
    <g>
      <Night t={t} />
      <Rain t={t} n={70} o={0.35} />
      <g transform={`translate(540 ${1600 + Math.sin(t * 30) * 4 * shout}) scale(1.05)`}>
        <Seeker uid="p3a" t={t} look={P3} blink={blinkAt(t, 3)} wide={shout} brow={shout ? 1 : -0.4} mouthOpen={shout * (0.5 + 0.3 * Math.sin(t * 20))} smile={shout ? 0 : 0.2}
          gazeX={shout ? 0 : -0.7} lArm={[-150 * arms, 20]} rArm={[-150 * arms - 4 * (1 - arms), 20]} tilt={shout ? 0 : -8 * k(t, wt(6, "or"), wt(6, "or") + 0.4)} />
      </g>
      <Label x={540} y={380} n={3} />
      {stamp > 0 && <g transform={`translate(540 540) rotate(-8) scale(${stamp * (1.6 - 0.6 * stamp)})`} opacity={1 - k(t, wt(6, "or"), wt(6, "or") + 0.3) * 0.7}><rect x={-330} y={-70} width={660} height={140} rx={16} fill="none" stroke="#e5383b" strokeWidth={12} /><text y={28} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill="#e5383b">IMPOSSIBLE?!</text></g>}
    </g>
  );
};

/* S7: question card with all three; S8: vote ending with sunrise */
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
          <g transform={`translate(${p.x} 1640) scale(0.62)`}><Seeker uid={`q${i}${vote ? "v" : ""}`} t={t} look={p.l} blink={blinkAt(t, 4 + i)} gazeY={-0.6} gazeX={(1 - i) * 0.4} brow={0.5} smile={0.3} rArm={i === 1 ? [-20 - 10 * Math.sin(t * 3), 120] : [-6, 8]} /></g>
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
    <div style={{ color: AMB, fontSize: 84, fontWeight: 900, lineHeight: 1.1, marginTop: 10 }}>WHICH TWO COINS?</div>
    <div style={{ color: "#fff", fontSize: 40, fontWeight: 700, marginTop: 18 }}>Total 30p · one is NOT a 10p</div>
  </div>;
};
const Vote: React.FC<{ t: number }> = ({ t }) => {
  const a = L(8).start;
  if (t < a - 0.1) return null;
  const opts = ["15p + 15p", "20p + 10p", "25p + 5p"];
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
      {sol ? "RIDDLE #15 · THE ANSWER" : `DAY 16 · 6:${String(12 + Math.floor(Math.max(0, t - L(3).start) / 10)).padStart(2, "0")} AM · RAINY STREET · RIDDLE #16`}</span>
  </div>;
};

export const RiddleAnim1114: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Shop t={t} phase={0} /> },
    { a: b(0), b: b(1), r: (t) => <S_Shop t={t} phase={1} /> },
    { a: b(1), b: b(2), r: (t) => <S_Shop t={t} phase={2} /> },
    { a: b(2), b: b(3), r: (t) => <S_Title t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_P1 t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_P2 t={t} /> },
    { a: b(5), b: b(6), r: (t) => <S_P3 t={t} /> },
    { a: b(6), b: b(7), r: (t) => <S_Question t={t} vote={false} /> },
    { a: b(7), b: RIDDLE1114_DUR + 1, r: (t) => <S_Question t={t} vote /> },
  ];
  const XF = 0.2;
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [RIDDLE1114_DUR - 0.6, RIDDLE1114_DUR], [0, 1]));
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
      <Card font={FONT} t={t} a={wt(1, "most")} b={b(1)} top={260} bg="#e5383b" size={48}>THE TRAP: 10p</Card>
      <Card font={FONT} t={t} a={wt(2, "pen")} b={b(2)} top={260} bg="#2ec27e" size={56}>ANSWER: 5p</Card>
      <Card font={FONT} t={t} a={wt(4, "coins")} b={b(4)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={44}>CLUE 1 · TWO COINS, 30p</Card>
      <Card font={FONT} t={t} a={wt(5, "says")} b={b(5)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={44}>CLUE 2 · ONE IS NOT A 10p</Card>
      <QCard t={t} />
      <Vote t={t} />
      <Captions t={t} TL={TL} font={FONT} hi={AMB} base="#8a90a8" done="#ffffff" bg="rgba(11,16,38,0.88)" size={58} top={1580} />
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
      {withAudio && <Audio src={staticFile("day1/d1114riddle-mix.m4a")} />}
    </AbsoluteFill>
  );
};
