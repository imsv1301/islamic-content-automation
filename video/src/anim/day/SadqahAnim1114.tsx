import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1114sadqah-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, Stars, k, flick } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, Captions, Card, Sparkles, W, H, rn } from "./AnimKit";

/* One More Sadqah · 14 Nov 2026 · Short 16 "Sab se behtar kaun?" Sahih al-Bukhari 5027 (Hazrat Usman-e-Ghani Radi Allahu Anhu):
   "The best of you is the one who learns the Quran and teaches it." Warm cinematic palette (night, amber, gold).
   Ordinary adults + a child act it out; Hazrat Usman (RA) is never shown; when the Prophet ﷺ is mentioned: the REAL Green Dome
   (Pixabay 198164, muhammadarhamamin77800). The Quran is drawn only as a closed / open book on a rehal, no text. No music. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const SADQAH1114_DUR = TL.total;
const FONT = "'Montserrat', sans-serif";
const GOLD = "#f2c46b";
const RICH: Look = { beard: false, cap: null, top: "#3b3f5c", topD: "#2a2d44", pants: "#1f2233", shawl: false, hair: "#1a120c" };
const BOSS: Look = { beard: true, cap: null, top: "#6b4b2e", topD: "#4f3620", pants: "#2c2118", shawl: false, hair: "#2a1d14", skin: ["#e3b58e", "#c99a72", "#a77850"] };
const TEACH: Look = { beard: true, top: "#efe6d2", topD: "#cdbf9f", pants: "#d9cdb2", shawl: true };
const CHILD: Look = { kid: true, beard: false, cap: "#ffffff", top: "#d9e8f5", topD: "#b5c9dc", pants: "#b5c9dc", shawl: false, hair: "#1d140d" };

const NightRoom: React.FC<{ t: number; lampX?: number }> = ({ t, lampX = 820 }) => (
  <g>
    <defs><linearGradient id="nr14" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#140d1c" /><stop offset="60%" stopColor="#2a1a22" /><stop offset="100%" stopColor="#3a2418" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#nr14)" />
    {/* arched window with moon + stars */}
    <path d="M 160 980 L 160 560 Q 160 380 340 380 Q 520 380 520 560 L 520 980 Z" fill="#0d1430" stroke="#5a3b22" strokeWidth={18} />
    <circle cx={400} cy={540} r={46} fill="#fff3cf" /><circle cx={420} cy={530} r={42} fill="#0d1430" />
    {Array.from({ length: 12 }, (_, i) => { const r = rn(i + 400); return <circle key={i} cx={190 + r() * 300} cy={420 + r() * 520} r={2 + r() * 3} fill="#fff8e6" opacity={0.4 + 0.6 * Math.abs(Math.sin(t * (1 + r()) + i))} />; })}
    <rect y={1440} width={W} height={480} fill="#3a2418" />
    {/* rug */}
    <path d="M 120 1520 L 960 1520 L 1040 1860 L 40 1860 Z" fill="#7a2e2a" /><path d="M 160 1550 L 920 1550 L 990 1830 L 90 1830 Z" fill="none" stroke={GOLD} strokeWidth={6} opacity={0.6} />
    {/* hanging lamp */}
    <g transform={`translate(${lampX} 0)`}><line x1={0} y1={0} x2={0} y2={430} stroke="#5a3b22" strokeWidth={5} /><path d="M -50 430 L 50 430 L 36 540 L -36 540 Z" fill="#c98a3a" /><path d="M -30 450 L 30 450 L 22 525 L -22 525 Z" fill="#ffe2a0" opacity={flick(t, 1)} />
      <Glow id={`lamp${lampX}`} cx={0} cy={490} r={520} c="#ffb547" o={0.45 * flick(t, 2)} /></g>
  </g>
);
/* closed Quran: green cover with gold geometric border, no text */
const Mushaf: React.FC<{ x: number; y: number; s?: number; open?: number; hi?: number; glow?: number }> = ({ x, y, s = 1, open = 0, hi = -1, glow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* rehal (X stand) */}
    <path d="M -170 120 L 170 -10 M 170 120 L -170 -10" stroke="#8a5530" strokeWidth={26} strokeLinecap="round" />
    {glow > 0 && <Glow id={`mg${x}`} cx={0} cy={-40} r={330} c="#ffe7a8" o={glow} />}
    {open < 0.5 ? (
      <g><rect x={-130} y={-120} width={260} height={150} rx={10} fill="#1f5e3f" transform="skewX(-8)" /><rect x={-110} y={-104} width={220} height={118} rx={6} fill="none" stroke={GOLD} strokeWidth={6} transform="skewX(-8)" /><circle cx={-10} cy={-45} r={26} fill="none" stroke={GOLD} strokeWidth={5} /></g>
    ) : (
      <g>
        <path d="M -230 -110 Q -115 -140 0 -110 L 0 40 Q -115 10 -230 40 Z" fill="#fbf4e3" stroke="#c9b48a" strokeWidth={5} />
        <path d="M 230 -110 Q 115 -140 0 -110 L 0 40 Q 115 10 230 40 Z" fill="#fbf4e3" stroke="#c9b48a" strokeWidth={5} />
        <path d="M -240 -100 L -240 50 Q -115 20 0 50 Q 115 20 240 50 L 240 -100" fill="none" stroke="#1f5e3f" strokeWidth={14} />
        {Array.from({ length: 5 }, (_, i) => <g key={i}><path d={`M -205 ${-85 + i * 25} Q -110 ${-100 + i * 25} -25 ${-85 + i * 25}`} stroke={i === hi ? GOLD : "#cdbb92"} strokeWidth={i === hi ? 12 : 5} fill="none" /><path d={`M 25 ${-85 + i * 25} Q 110 ${-100 + i * 25} 205 ${-85 + i * 25}`} stroke="#cdbb92" strokeWidth={5} fill="none" /></g>)}
      </g>
    )}
  </g>
);
const Coins: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    {Array.from({ length: 14 }, (_, i) => { const r = rn(i + 70); return <ellipse key={i} cx={(r() - 0.5) * 200} cy={-((i % 5) * 18) + r() * 10} rx={38} ry={14} fill={i % 2 ? "#e8b94a" : "#f5cf6a"} stroke="#a77a20" strokeWidth={3} />; })}
    <path d="M 60 -160 Q 140 -170 150 -60 Q 160 20 60 20 Q -20 20 -10 -60 Q -6 -150 60 -160 Z" fill="#b0823a" /><path d="M 30 -160 L 90 -160 L 80 -190 L 40 -190 Z" fill="#8a6228" />
  </g>
);
const Strike: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => p > 0 ? <path d={`M ${x - 200} ${y + 120} L ${x - 200 + 400 * p} ${y + 120 - 300 * p}`} stroke="#e5383b" strokeWidth={22} strokeLinecap="round" /> : null;

/* S0: three men under the street lamp; who is the best? */
const S_Who: React.FC<{ t: number }> = ({ t }) => {
  const q = pop(t, wt(0, "behtar"));
  return (
    <g>
      <defs><linearGradient id="st14" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#100a18" /><stop offset="100%" stopColor="#3b2416" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#st14)" />
      <Stars t={t} o={0.6} />
      {[[40, 760, 260, 700], [330, 620, 240, 840], [790, 700, 260, 760]].map(([x, y, w, h], i) => <g key={i}><rect x={x} y={y} width={w} height={h} fill="#1c1320" />{Array.from({ length: 6 }, (_, j) => <rect key={j} x={x + 30 + (j % 2) * (w / 2)} y={y + 50 + Math.floor(j / 2) * 140} width={50} height={80} fill="#ffb547" opacity={(i + j) % 3 === 0 ? 0.5 * flick(t, j) : 0.06} />)}</g>)}
      <rect y={1470} width={W} height={450} fill="#2a1a14" />
      <Glow id="sw" cx={540} cy={1100} r={700} c="#ffb547" o={0.3} />
      {[{ x: 210, l: RICH, gx: 0.6 }, { x: 540, l: BOSS, gx: 0 }, { x: 870, l: TEACH, gx: -0.6 }].map((p, i) => (
        <g key={i} transform={`translate(${p.x} 1600) scale(0.78)`}><Seeker uid={`w${i}`} t={t} look={p.l} blink={blinkAt(t, i + 1)} gazeX={p.gx * Math.sin(t * 0.8 + i)} brow={0.4} smile={0.2} lArm={i === 0 ? [-10, 80] : [-4, 8]} rArm={i === 1 ? [20, 90] : [-4, 8]} /></g>
      ))}
      {q > 0 && <text x={540} y={620 - 12 * Math.sin(t * 3)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={260 * q} fill={GOLD}>?</text>}
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
/* S2: the teacher reads; on "sikhaaye" the child sits beside him and he points to the page */
const S_Teach: React.FC<{ t: number; line: number }> = ({ t, line }) => {
  const childIn = line === 2 ? k(t, wt(2, "doosron") - 0.3, wt(2, "sikhaaye")) : 1;
  const point = line === 2 ? k(t, wt(2, "sikhaaye") - 0.1, wt(2, "sikhaaye") + 0.4) : 1;
  const hiLine = line === 4 ? (t > wt(4, "aayat", 1) ? 2 : t > wt(4, "aayat") ? 1 : -1) : (t > wt(2, "seekhe") ? 1 : -1);
  return (
    <g>
      <NightRoom t={t} />
      <g transform="translate(330 1640) scale(0.95)"><Seeker uid={`te${line}`} t={t} look={TEACH} blink={blinkAt(t, 2)} gazeX={0.5 + 0.3 * point} gazeY={0.7} smile={0.5 + 0.4 * point} nod={4 * Math.sin(t * 2.2)} rArm={[30 + 25 * point, 70 + 20 * point]} lArm={[-6, 10]} /></g>
      <Mushaf x={590} y={1400} s={0.85} open={1} hi={hiLine} glow={0.35} />
      <g transform={`translate(${interp(childIn, [0, 1], [1250, 880])} 1700) scale(0.85)`} opacity={childIn > 0 ? 1 : 0}>
        <Seeker uid={`ch${line}`} t={t} look={CHILD} blink={blinkAt(t, 5)} gazeX={-0.7} gazeY={0.6} smile={0.8} nod={line === 4 ? 6 * Math.sin(t * 5) : 0} lArm={[-4, 8]} rArm={[-4, 8]} />
      </g>
      {line === 4 && <Sparkles t={t} at={wt(4, "aayat", 1)} cx={560} cy={1300} />}
    </g>
  );
};
/* S3: not wealth, not rank... the Quran */
const S_Not: React.FC<{ t: number }> = ({ t }) => {
  const d = wt(3, "daulat"), o = wt(3, "ohda"), q = wt(3, "quran");
  const showD = pop(t, d - 0.1) * (1 - k(t, o - 0.1, o + 0.2)), showO = pop(t, o - 0.1) * (1 - k(t, q - 0.2, q + 0.1));
  const qp = pop(t, q - 0.1);
  return (
    <g>
      <NightRoom t={t} lampX={900} />
      {showD > 0 && <g><g transform="translate(540 1250) scale(1.8) translate(-540 -1250)"><Coins x={540} y={1300} o={showD} /></g><Strike x={540} y={1150} p={k(t, d + 0.3, d + 0.6)} /></g>}
      {showO > 0 && <g opacity={showO}><g transform="translate(540 1300) scale(1.6)"><rect x={-130} y={-360} width={260} height={300} rx={40} fill="#4a2c1a" /><rect x={-150} y={-80} width={300} height={70} rx={20} fill="#5b3622" /><rect x={-20} y={-10} width={40} height={140} fill="#2d1b10" /><rect x={-260} y={-240} width={180} height={70} rx={10} fill={GOLD} /><text x={-170} y={-193} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#3a2418">OHDA</text></g><Strike x={540} y={1100} p={k(t, o + 0.3, o + 0.6)} /></g>}
      {qp > 0 && <g transform={`translate(540 ${1350}) scale(${qp * 1.3})`}><Mushaf x={0} y={0} glow={0.7 * qp} /></g>}
      <Sparkles t={t} at={q + 0.1} cx={540} cy={1250} n={14} c={GOLD} />
    </g>
  );
};
/* S5: comment box types "In sha Allah" */
const S_Comment: React.FC<{ t: number }> = ({ t }) => {
  const a = L(5).start, txt = "In sha Allah!", n = Math.floor(interp(t, [a + 0.6, a + 1.6], [0, txt.length]));
  return (
    <g>
      <NightRoom t={t} lampX={200} />
      <g transform={`translate(540 1150) scale(${pop(t, a, 0.4)})`}>
        <rect x={-380} y={-180} width={760} height={360} rx={50} fill="#1d1420" stroke={GOLD} strokeWidth={6} />
        <text x={-320} y={-90} fontFamily={FONT} fontWeight={800} fontSize={40} fill="#cbb98f">Comment</text>
        <rect x={-320} y={-50} width={640} height={130} rx={30} fill="#2c2030" />
        <text x={-290} y={35} fontFamily={FONT} fontWeight={800} fontSize={64} fill="#fff">{txt.slice(0, n)}<tspan fill={GOLD} opacity={Math.sin(t * 10) > 0 ? 1 : 0}>|</tspan></text>
        {n >= txt.length && <g transform={`translate(300 120) scale(${pop(t, a + 1.7)})`}><circle r={50} fill={GOLD} /><path d="M -18 -22 L 22 0 L -18 22 Z" fill="#1d1420" /></g>}
      </g>
    </g>
  );
};
/* S6: share = another sadqah: the lesson travels from lamp to lamp */
const S_Share: React.FC<{ t: number }> = ({ t }) => {
  const a = L(6).start;
  return (
    <g>
      <defs><linearGradient id="sh14" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#120b1a" /><stop offset="100%" stopColor="#2f1d14" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#sh14)" />
      <Stars t={t} />
      {Array.from({ length: 5 }, (_, i) => { const on = k(t, a + 0.3 + i * 0.45, a + 0.6 + i * 0.45); const x = 140 + i * 200, y = 1250 - (i % 2) * 140; return <g key={i} transform={`translate(${x} ${y})`}><line x1={0} y1={-500} x2={0} y2={-90} stroke="#5a3b22" strokeWidth={4} /><path d="M -40 -90 L 40 -90 L 30 0 L -30 0 Z" fill="#8a5a2a" /><path d="M -26 -78 L 26 -78 L 20 -10 L -20 -10 Z" fill="#ffe2a0" opacity={0.15 + 0.85 * on * flick(t, i)} /><Glow id={`sl${i}`} cx={0} cy={-45} r={200} c="#ffb547" o={0.6 * on} /></g>; })}
      <g transform={`translate(540 760) scale(${1.5 * pop(t, a + 0.2)})`}><circle r={110} fill={GOLD} /><path d="M -40 30 Q -30 -40 30 -40 L 30 -70 L 80 -20 L 30 30 L 30 0 Q -20 -5 -40 30 Z" fill="#1d1420" /></g>
    </g>
  );
};

const HadithCard: React.FC<{ t: number }> = ({ t }) => {
  const a = L(2).start - 0.2, b = (L(2).end + L(3).start) / 2;
  if (t < a || t > b + 0.2) return null;
  const p = pop(t, a, 0.5), o = interp(t, [b - 0.2, b + 0.2], [1, 0]);
  return <div style={{ position: "absolute", left: 60, right: 60, top: 260, opacity: o * p, transform: `translateY(${(1 - p) * 40}px)`, background: "rgba(20,12,24,0.88)", border: `4px solid ${GOLD}`, borderRadius: 36, padding: "30px 30px 26px", textAlign: "center" }}>
    <div style={{ fontFamily: "Amiri", fontSize: 76, color: GOLD, direction: "rtl", lineHeight: 1.5 }}>خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</div>
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: "#fff", marginTop: 10, lineHeight: 1.3 }}>"Tum mein sab se behtar woh hai, jo Quran seekhe aur sikhaaye."</div>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#cbb98f", marginTop: 14, letterSpacing: "0.08em" }}>SAHIH AL-BUKHARI 5027</div>
  </div>;
};

export const SadqahAnim1114: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Who t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Dome t={t} /> },
    { a: b(1), b: b(2), r: (t) => <S_Teach t={t} line={2} /> },
    { a: b(2), b: b(3), r: (t) => <S_Not t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Teach t={t} line={4} /> },
    { a: b(4), b: b(5), r: (t) => <S_Comment t={t} /> },
    { a: b(5), b: SADQAH1114_DUR + 1, r: (t) => <S_Share t={t} /> },
  ];
  const XF = 0.25;
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [SADQAH1114_DUR - 0.7, SADQAH1114_DUR], [0, 1]));
  const domeA = b(0) - XF, domeB = b(1) + XF;
  const push = 1 + 0.04 * ((t % 6) / 6);
  return (
    <AbsoluteFill style={{ background: "#140d1c" }}>
      {t > domeA && t < domeB && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img src={staticFile("d1114/dome_s.jpg")} style={{ width: W, height: H, objectFit: "cover", transformOrigin: "50% 50%", transform: `scale(${1.03 + 0.12 * k(t, domeA, domeB)})`, filter: "saturate(1.05) sepia(0.12)" }} />
        </AbsoluteFill>
      )}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => {
          if (t < s.a - XF || t > s.b + XF) return null;
          const o = s.a === 0 ? 1 : interp(t, [s.a - XF, s.a + XF], [0, 1]);
          const sc = i === 1 ? 1 : push;
          return <g key={i} opacity={o} transform={`translate(540 960) scale(${sc}) translate(-540 -960)`}>{s.r(t)}</g>;
        })}
      </svg>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ background: "rgba(20,12,24,0.85)", color: GOLD, border: `3px solid ${GOLD}`, borderRadius: 40, padding: "10px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: "0.1em" }}>ONE MORE SADQAH · HADITH</span>
      </div>
      <Card font={FONT} t={t} a={wt(0, "behtar")} b={b(0)} top={260} bg="rgba(20,12,24,0.9)" fg={GOLD} border={`4px solid ${GOLD}`} size={52}>Sab se behtar kaun?</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.2} b={b(1)} top={260} bg="rgba(20,12,24,0.9)" fg="#fff" border={`4px solid ${GOLD}`} size={36}>Hazrat Usman-e-Ghani (Radi Allahu Anhu)</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.6} b={b(1)} top={370} bg={GOLD} fg="#1d1420" size={44}>Sahih al-Bukhari 5027</Card>
      <HadithCard t={t} />
      <Card font={FONT} t={t} a={wt(3, "daulat")} b={wt(3, "ohda")} top={300} bg="#e5383b" size={56}>Daulat? Nahin</Card>
      <Card font={FONT} t={t} a={wt(3, "ohda")} b={wt(3, "quran") - 0.1} top={300} bg="#e5383b" size={56}>Ohda? Nahin</Card>
      <Card font={FONT} t={t} a={wt(3, "quran") - 0.1} b={b(3)} top={300} bg={GOLD} fg="#1d1420" size={60}>Balke QURAN</Card>
      <Card font={FONT} t={t} a={wt(4, "aayat")} b={b(4)} top={290} bg="rgba(20,12,24,0.9)" fg={GOLD} border={`4px solid ${GOLD}`} size={44}>1 aayat khud seekhein</Card>
      <Card font={FONT} t={t} a={wt(4, "aayat", 1)} b={b(4)} top={400} bg={GOLD} fg="#1d1420" size={44}>1 aayat bachon ko sikhaayein</Card>
      <Card font={FONT} t={t} a={L(6).start + 0.3} b={SADQAH1114_DUR} top={1000} bg={GOLD} fg="#1d1420" size={48}>Aage bhejein = ek aur sadqah</Card>
      <Captions t={t} TL={TL} font={FONT} hi={GOLD} base="#a99b86" done="#ffffff" bg="rgba(20,12,24,0.85)" size={54} top={1600} />
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
      {withAudio && <Audio src={staticFile("day1/d1114sadqah-mix.m4a")} />}
    </AbsoluteFill>
  );
};
