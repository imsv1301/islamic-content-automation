import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1115riddle-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, k } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, Captions, Card, Sparkles, Rain, Hand, W, H, rn } from "./AnimKit";

/* Solve by Sunrise · 15 Nov 2026 · Riddle #16 solution (20p + 10p) + Riddle #17 "power cut, 10 black + 10 white socks,
   how many to take out to be sure of a matching pair?" (answer: 3). Mystery palette (night, amber, rain).
   Ordinary people with faces, named only Person 1/2/3. No salam. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const RIDDLE1115_DUR = TL.total;
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

/* S0-S2: yesterday's riddle solved on Person 1's open hand */
const S_Coins: React.FC<{ t: number; phase: 0 | 1 | 2 }> = ({ t, phase }) => {
  const f20 = phase === 0 ? 0 : phase === 1 ? k(t, wt(1, "twenty") - 0.3, wt(1, "twenty") + 0.1) : 1;
  const f10 = phase < 2 ? 0 : k(t, wt(2, "ten") - 0.3, wt(2, "ten") + 0.1);
  const one = phase === 1 ? pop(t, wt(1, "one")) : 0;
  return (
    <g>
      <Night t={t} />
      <Rain t={t} n={60} o={0.3} />
      <g transform="translate(250 1600) scale(0.9)"><Seeker uid={`p1s${phase}`} t={t} look={P1} blink={blinkAt(t, 1 + phase)} smile={phase === 2 ? 1 : 0.4} gazeX={0.8} gazeY={0.3} rArm={[-30, 60]} lArm={[-6, 8]} /></g>
      <g transform="translate(720 1330)">
        <Glow id={`hc${phase}`} cx={0} cy={-220} r={360} c={AMB} o={0.35} />
        <Hand x={0} y={0} s={1.8} r={-6} skin="#c99a72" />
        <Coin x={-70} y={-250} r={66} c="#d6dbe2" flip={f10} label="10p" ring={phase === 2 && f10 > 0.5 ? "#7ee0a5" : undefined} />
        <Coin x={80} y={-215} r={74} c="#e8c06a" flip={f20} label="20p" ring={phase >= 1 && f20 > 0.5 ? AMB : undefined} />
      </g>
      {phase === 0 && <><Box t={t} at={wt(0, "thirty")} txt="= 30p" c={AMB} y={620} w={420} /><Box t={t} at={wt(0, "not")} txt="ONE IS NOT A 10p" c="#e5383b" y={820} size={56} /></>}
      {phase === 1 && one > 0 && <g transform={`translate(840 760) scale(${one})`}><rect x={-230} y={-60} width={460} height={120} rx={26} fill="#0b1026" stroke={AMB} strokeWidth={6} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={AMB}>ONLY ONE!</text></g>}
      {phase === 1 && t > wt(1, "twenty") && <g transform={`translate(800 920) scale(${pop(t, wt(1, "twenty") + 0.2)})`}><circle r={44} fill="#2ec27e" /><path d="M -20 2 L -6 18 L 22 -16" stroke="#fff" strokeWidth={11} fill="none" strokeLinecap="round" /></g>}
      {phase === 2 && <Box t={t} at={wt(2, "twenty")} txt="20p + 10p = 30p" c="#7ee0a5" y={640} size={64} w={820} />}
      {phase === 2 && <Sparkles t={t} at={wt(2, "thirty")} cx={720} cy={1080} n={14} />}
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
        <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={AMB}>#17</text>
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
    <Glow id="bulb15" cx={330} cy={330} r={800} c="#ffe7a8" o={0.45 * (1 - dark)} />
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

/* S4: power cut: Person 1 in the bedroom, the bulb dies */
const S_Power: React.FC<{ t: number }> = ({ t }) => {
  const cut = wt(4, "power");
  const flick = t < cut ? 0 : t < cut + 0.5 ? (Math.sin((t - cut) * 60) > 0 ? 0.3 : 1) : 1;
  return (
    <g>
      <Bedroom t={t} dark={flick} />
      <Drawer open={0} />
      <g transform="translate(330 1620) scale(0.95)"><Seeker uid="p1p" t={t} look={P1} blink={blinkAt(t, 2)} wide={flick} brow={flick ? 0.9 : 0} gazeX={0.3} gazeY={-0.6 * flick} mouthOpen={flick ? 0.3 : 0} lArm={flick ? [-60, 60] : [-6, 8]} rArm={flick ? [-60, 60] : [-6, 8]} /></g>
      <DarkVeil dark={flick} />
      <Label x={330} y={560} n={1} o={0.9} />
      {flick > 0.5 && <text x={540} y={880} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110 * pop(t, cut + 0.5)} fill={AMB}>POWER CUT!</text>}
    </g>
  );
};
/* S5: the drawer: 10 black + 10 white socks pop in and shuffle */
const S_Socks: React.FC<{ t: number }> = ({ t }) => {
  const bAt = wt(5, "black"), wAt = wt(5, "white"), mix = k(t, wt(5, "mixed") - 0.2, wt(5, "mixed") + 0.8);
  const socks = Array.from({ length: 20 }, (_, i) => {
    const r = rn(i + 500), black = i < 10, at = (black ? bAt : wAt) + (i % 10) * 0.06;
    const gx = black ? 150 + (i % 5) * 75 : 590 + (i % 5) * 75, gy = 700 + Math.floor((i % 10) / 5) * 170;
    const mx = 170 + r() * 740, my = 680 + r() * 520;
    return { x: interp(mix, [0, 1], [gx, mx]) + 10 * Math.sin(t * 3 + i) * mix, y: interp(mix, [0, 1], [gy, my]), c: black ? "#1d1d22" : "#f4f4f4", p: pop(t, at), r: interp(mix, [0, 1], [0, (r() - 0.5) * 160]) };
  });
  return (
    <g>
      <rect width={W} height={H} fill="#1a1626" />
      <rect x={100} y={580} width={880} height={760} rx={30} fill="#6b4630" /><rect x={130} y={610} width={820} height={700} rx={20} fill="#4e3222" />
      {socks.map((s, i) => s.p > 0 && <Sock key={i} x={s.x} y={s.y} c={s.c} r={s.r} s={0.9 * s.p} />)}
      {pop(t, bAt) > 0 && <g transform={`translate(300 1440) scale(${pop(t, bAt)})`}><rect x={-200} y={-60} width={400} height={120} rx={26} fill="#0b1026" stroke={AMB} strokeWidth={6} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#fff">10 BLACK</text></g>}
      {pop(t, wAt) > 0 && <g transform={`translate(780 1440) scale(${pop(t, wAt)})`}><rect x={-200} y={-60} width={400} height={120} rx={26} fill="#f4f4f4" stroke={AMB} strokeWidth={6} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#0b1026">10 WHITE</text></g>}
    </g>
  );
};
/* S6: in the dark, Person 1 reaches blindly into the drawer */
const S_Blind: React.FC<{ t: number }> = ({ t }) => {
  const reach = 0.5 + 0.5 * Math.sin(t * 2.2);
  const pair = pop(t, wt(6, "pair"));
  return (
    <g>
      <Bedroom t={t} dark={1} />
      <Drawer open={1} />
      {Array.from({ length: 6 }, (_, i) => <Sock key={i} x={480 + i * 34} y={1130 - (i % 2) * 20} c={i % 2 ? "#f4f4f4" : "#1d1d22"} r={-70 + i * 20} s={0.5} />)}
      <g transform="translate(330 1620) scale(0.95)"><Seeker uid="p1b" t={t} look={P1} blink={blinkAt(t, 3)} closed={0.7} brow={0.5} gazeX={0.6} lArm={[-6, 8]} rArm={[-50 - 20 * reach, 40 + 20 * reach]} tilt={4} /></g>
      <DarkVeil dark={1} />
      <Label x={330} y={560} n={1} o={0.9} />
      {pair > 0 && <g transform={`translate(540 960) scale(${pair})`}><rect x={-300} y={-110} width={600} height={220} rx={30} fill="#0b1026" stroke={AMB} strokeWidth={6} /><Sock x={-120} y={-10} c="#1d1d22" s={0.9} /><Sock x={0} y={-10} c="#1d1d22" s={0.9} /><text x={180} y={24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={AMB}>= 1</text></g>}
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
          <g transform={`translate(${p.x} 1640) scale(0.62)`}><Seeker uid={`q15${i}${vote ? "v" : ""}`} t={t} look={p.l} blink={blinkAt(t, 4 + i)} gazeY={-0.6} gazeX={(1 - i) * 0.4} brow={0.5} smile={0.3} rArm={i === 1 ? [-20 - 10 * Math.sin(t * 3), 120] : [-6, 8]} /></g>
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
    <div style={{ color: AMB, fontSize: 80, fontWeight: 900, lineHeight: 1.1, marginTop: 10 }}>HOW MANY SOCKS?</div>
    <div style={{ color: "#fff", fontSize: 40, fontWeight: 700, marginTop: 18 }}>10 black · 10 white · total dark · be SURE of a pair</div>
  </div>;
};
const Vote: React.FC<{ t: number }> = ({ t }) => {
  const a = L(8).start;
  if (t < a - 0.1) return null;
  const opts = ["2 socks", "3 socks", "11 socks"];
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
      {sol ? "RIDDLE #16 · THE ANSWER" : `DAY 17 · 5:${String(40 + Math.floor(Math.max(0, t - L(3).start) / 10)).padStart(2, "0")} AM · BEDROOM · RIDDLE #17`}</span>
  </div>;
};

export const RiddleAnim1115: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Coins t={t} phase={0} /> },
    { a: b(0), b: b(1), r: (t) => <S_Coins t={t} phase={1} /> },
    { a: b(1), b: b(2), r: (t) => <S_Coins t={t} phase={2} /> },
    { a: b(2), b: b(3), r: (t) => <S_Title t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Power t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Socks t={t} /> },
    { a: b(5), b: b(6), r: (t) => <S_Blind t={t} /> },
    { a: b(6), b: b(7), r: (t) => <S_Question t={t} vote={false} /> },
    { a: b(7), b: RIDDLE1115_DUR + 1, r: (t) => <S_Question t={t} vote /> },
  ];
  const XF = 0.2;
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [RIDDLE1115_DUR - 0.6, RIDDLE1115_DUR], [0, 1]));
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
      <Card font={FONT} t={t} a={wt(1, "trick")} b={b(1)} top={260} bg="#e5383b" size={46}>THE TRICK: "ONE OF THEM"</Card>
      <Card font={FONT} t={t} a={wt(2, "other")} b={b(2)} top={260} bg="#2ec27e" size={56}>ANSWER: 20p + 10p</Card>
      <Card font={FONT} t={t} a={wt(5, "drawer")} b={b(5)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={44}>CLUE 1 · 10 BLACK + 10 WHITE</Card>
      <Card font={FONT} t={t} a={wt(6, "cannot")} b={b(6)} top={260} bg="#0b1026" fg={AMB} border={`4px solid ${AMB}`} size={44}>CLUE 2 · NEEDS 1 MATCHING PAIR</Card>
      <QCard t={t} />
      <Vote t={t} />
      <Captions t={t} TL={TL} font={FONT} hi={AMB} base="#8a90a8" done="#ffffff" bg="rgba(11,16,38,0.88)" size={58} top={1580} />
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
      {withAudio && <Audio src={staticFile("day1/d1115riddle-mix.m4a")} />}
    </AbsoluteFill>
  );
};
