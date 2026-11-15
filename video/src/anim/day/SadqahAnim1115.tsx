import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1115sadqah-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Glow, Stars, k, flick } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, Captions, Card, Sparkles, Heart, Hand, W, H, rn } from "./AnimKit";

/* One More Sadqah · 15 Nov 2026 · Short 17 "Allah shakal aur daulat nahin dekhta" Sahih Muslim 2564c (Hazrat Abu Huraira
   Radi Allahu Anhu): "Allah does not look at your faces and your wealth, but He looks at your hearts and your deeds."
   Warm cinematic palette. Ordinary adults act it out; Abu Huraira (RA) is never shown; when the Prophet ﷺ is mentioned:
   the REAL Green Dome (Pixabay 198164, muhammadarhamamin77800). Allah is never drawn or symbolised (no eye, no face, no light-figure). No music. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const SADQAH1115_DUR = TL.total;
const FONT = "'Montserrat', sans-serif";
const GOLD = "#f2c46b";
const RICH: Look = { beard: false, cap: null, top: "#2d3a6b", topD: "#1f2850", pants: "#1a1f36", shawl: false, hair: "#1a120c", skin: ["#e3b58e", "#c99a72", "#a77850"] };
const PLAIN: Look = { beard: true, top: "#efe6d2", topD: "#cdbf9f", pants: "#d9cdb2", shawl: false, cap: "#f8f4eb" };

const Street: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs><linearGradient id="st15" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#100a18" /><stop offset="100%" stopColor="#3b2416" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#st15)" />
    <Stars t={t} o={0.6} />
    {[[40, 760, 260, 700], [330, 620, 240, 840], [790, 700, 260, 760]].map(([x, y, w, h], i) => <g key={i}><rect x={x} y={y} width={w} height={h} fill="#1c1320" />{Array.from({ length: 6 }, (_, j) => <rect key={j} x={x + 30 + (j % 2) * (w / 2)} y={y + 50 + Math.floor(j / 2) * 140} width={50} height={80} fill="#ffb547" opacity={(i + j) % 3 === 0 ? 0.5 * flick(t, j) : 0.06} />)}</g>)}
    <rect y={1470} width={W} height={450} fill="#2a1a14" />
    <Glow id="sw15" cx={540} cy={1150} r={700} c="#ffb547" o={0.28} />
  </g>
);
const Coins: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    {Array.from({ length: 14 }, (_, i) => { const r = rn(i + 70); return <ellipse key={i} cx={(r() - 0.5) * 200} cy={-((i % 5) * 18) + r() * 10} rx={38} ry={14} fill={i % 2 ? "#e8b94a" : "#f5cf6a"} stroke="#a77a20" strokeWidth={3} />; })}
  </g>
);
const Strike: React.FC<{ x: number; y: number; p: number; w?: number }> = ({ x, y, p, w = 400 }) => p > 0 ? <path d={`M ${x - w / 2} ${y + 120} L ${x - w / 2 + w * p} ${y + 120 - 300 * p}`} stroke="#e5383b" strokeWidth={22} strokeLinecap="round" /> : null;
const Car: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -260 0 L -250 -80 Q -240 -110 -200 -115 L -120 -120 L -60 -190 L 120 -190 L 190 -120 L 250 -110 Q 280 -100 280 -60 L 280 0 Z" fill="#b8292f" />
    <path d="M -40 -175 L 110 -175 L 160 -125 L -90 -125 Z" fill="#cfe4ff" opacity={0.8} />
    <rect x={-270} y={-20} width={560} height={30} rx={14} fill="#7e1a1f" />
    {[-160, 170].map((cx) => <g key={cx} transform={`translate(${cx} 10) rotate(${t * 90})`}><circle r={56} fill="#222" /><circle r={26} fill="#bbb" /><rect x={-4} y={-26} width={8} height={52} fill="#888" /></g>)}
    <circle cx={260} cy={-70} r={14} fill="#fff3b0" />
  </g>
);
const Suit: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -10 -200 Q 0 -230 10 -200 L 120 -150 L -120 -150 Z" stroke="#c9a46a" strokeWidth={8} fill="none" />
    <path d="M -110 -150 L 110 -150 L 140 160 L -140 160 Z" fill="#2d3a6b" />
    <path d="M -40 -150 L 0 -60 L 40 -150 Z" fill="#fff" /><path d="M -12 -120 L 12 -120 L 8 40 L 0 60 L -8 40 Z" fill="#c0392b" />
    {[0, 1, 2].map((i) => <circle key={i} cx={30} cy={-20 + i * 50} r={7} fill={GOLD} />)}
    <rect x={-150} y={-150} width={30} height={20} fill="#00000000" />
  </g>
);

/* S0: a man in an expensive suit admires himself in a hand mirror, a bag of gold and a shiny car behind; "?" */
const S_Who: React.FC<{ t: number }> = ({ t }) => {
  const q = pop(t, wt(0, "dekhta"));
  return (
    <g>
      <Street t={t} />
      <Car x={760} y={1560} s={0.9} t={0} />
      <Coins x={240} y={1520} o={1} />
      <g transform="translate(470 1640) scale(0.95)"><Seeker uid="r15a" t={t} look={RICH} blink={blinkAt(t, 1)} smile={0.7} brow={0.5} gazeX={0.5} gazeY={-0.2} rHold="mirror" rArm={[-40, 100]} lArm={[-6, 8]} tilt={4 * Math.sin(t * 1.4)} /></g>
      {[0, 1, 2].map((i) => <Sparkles key={i} t={t} at={0.4 + i * 1.1} cx={[760, 240, 560][i]} cy={[1420, 1450, 900][i]} n={8} c={GOLD} />)}
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
/* S2: "not your faces, not your wealth": the mirror is struck out on "sooraton", the gold on "maalon" */
const S_NotFace: React.FC<{ t: number }> = ({ t }) => {
  const f = wt(2, "sooraton"), m = wt(2, "maalon");
  const sink = k(t, m + 0.3, m + 1.2);
  return (
    <g>
      <Street t={t} />
      <g transform="translate(300 1640) scale(0.85)"><Seeker uid="r15b" t={t} look={RICH} blink={blinkAt(t, 2)} smile={0.6 * (1 - k(t, f, f + 0.5))} brow={t > f ? -0.3 : 0.4} gazeX={0.4} rHold="mirror" rArm={[-40, 100]} lArm={[-6, 8]} /></g>
      {/* big mirror on the left half */}
      <g transform={`translate(760 900) scale(${1.6 * pop(t, f - 0.3)})`}><circle r={130} fill="#b8893a" /><circle r={110} fill="#cfd8e6" /><path d="M -60 -60 Q -20 -90 30 -80" stroke="#fff" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.6} /></g>
      <Strike x={760} y={780} p={k(t, f + 0.2, f + 0.5)} w={420} />
      <g transform={`translate(760 ${1380 + 120 * sink}) scale(1.5)`}><Coins x={0} y={0} o={pop(t, m - 0.3) * (1 - sink * 0.6)} /></g>
      <Strike x={760} y={1250} p={k(t, m + 0.2, m + 0.5)} w={420} />
    </g>
  );
};
/* S3: "...but He looks at your hearts and your deeds": a plain man, a heart glows on his chest, deeds appear */
const S_Heart: React.FC<{ t: number }> = ({ t }) => {
  const d = wt(3, "dilon"), am = wt(3, "aamaal");
  const hp = pop(t, d - 0.1), beat = 1 + 0.08 * Math.max(0, Math.sin(t * 7));
  const deeds = [{ x: 820, y: 900, ic: "bread" }, { x: 860, y: 1200, ic: "water" }, { x: 230, y: 1100, ic: "hand" }];
  return (
    <g>
      <Street t={t} />
      <g transform="translate(540 1680)">
        <Seeker uid="pl15a" t={t} look={PLAIN} blink={blinkAt(t, 3)} smile={0.7} closed={0.3} gazeY={0.3} lArm={[30, 110]} rArm={[30, 110]} nod={3 * Math.sin(t * 1.6)} />
        {hp > 0 && <g transform={`translate(0 -520) scale(${hp * beat * 1.4})`}><Glow id="hg15" cx={0} cy={0} r={160} c="#ffcf6a" o={0.6} /><Heart x={0} y={0} s={1.1} o={1} c="#ff5a6e" /></g>}
      </g>
      {deeds.map((dd, i) => { const p = pop(t, am + i * 0.25); return p > 0 && <g key={i} transform={`translate(${dd.x} ${dd.y}) scale(${p})`}><circle r={95} fill="#1d1420" stroke={GOLD} strokeWidth={6} />
        {dd.ic === "bread" && <g><ellipse rx={56} ry={32} fill="#d9a05b" /><path d="M -30 -10 Q -20 -24 -10 -10 M 0 -12 Q 10 -26 20 -12" stroke="#a8702f" strokeWidth={5} fill="none" /></g>}
        {dd.ic === "water" && <g><path d="M -26 -46 L 26 -46 L 20 50 L -20 50 Z" fill="#9ad3ff" opacity={0.8} /><rect x={-26} y={-10} width={52} height={60} fill="#5ab0f0" opacity={0.7} /></g>}
        {dd.ic === "hand" && <g transform="scale(0.45)"><Hand x={0} y={110} s={1} skin="#c99a72" /></g>}
      </g>; })}
      <Sparkles t={t} at={am + 0.6} cx={540} cy={1150} n={14} c={GOLD} />
    </g>
  );
};
/* S4: not costly clothes, not a big car... a clean heart and good deeds */
const S_NotCar: React.FC<{ t: number }> = ({ t }) => {
  const kp = wt(4, "kapde"), g = wt(4, "gaadi"), dil = wt(4, "dil");
  const sOut = k(t, g - 0.2, g + 0.1), cOut = k(t, dil - 0.3, dil);
  return (
    <g>
      <Street t={t} />
      {sOut < 1 && <g opacity={1 - sOut}><g transform={`translate(540 1120) scale(${1.6 * pop(t, L(4).start)})`}><Suit x={0} y={0} /></g><Strike x={540} y={1000} p={k(t, kp + 0.1, kp + 0.4)} /></g>}
      {t > g - 0.3 && cOut < 1 && <g opacity={pop(t, g - 0.3) * (1 - cOut)}><g transform={`translate(${540 + 400 * (1 - k(t, g - 0.3, g + 0.2))} 1250)`}><Car x={0} y={0} s={1.3} t={t} /></g><Strike x={540} y={1000} p={k(t, g + 0.2, g + 0.5)} /></g>}
      {t > dil - 0.2 && <g>
        <g transform={`translate(380 1700) scale(0.85)`}><Seeker uid="pl15b" t={t} look={PLAIN} blink={blinkAt(t, 4)} smile={1} gazeX={0.5} lArm={[-4, 8]} rArm={[-40, 80]} /></g>
        <g transform={`translate(380 1250) scale(${pop(t, dil) * (1 + 0.06 * Math.sin(t * 7))})`}><Heart x={0} y={0} s={1} o={1} c="#ff5a6e" /></g>
        <g transform={`translate(760 1150) scale(${pop(t, wt(4, "achhe"))})`}><circle r={120} fill="#1d1420" stroke={GOLD} strokeWidth={6} /><g transform="scale(0.55)"><Hand x={-30} y={110} s={1} r={-10} skin="#c99a72" /><ellipse cx={60} cy={-60} rx={60} ry={34} fill="#d9a05b" /></g></g>
        <Sparkles t={t} at={wt(4, "aamaal")} cx={560} cy={1150} n={14} c={GOLD} />
      </g>}
    </g>
  );
};
/* S5: a secret good deed: at night he leaves a food bag at a neighbour's door and walks away unseen */
const S_Secret: React.FC<{ t: number }> = ({ t }) => {
  const a = L(5).start, put = wt(5, "khamoshi"), leave = k(t, put + 0.5, L(5).end + 0.6);
  const bend = k(t, put - 0.5, put) * (1 - k(t, put + 0.2, put + 0.5));
  const back = t > put + 0.4;
  return (
    <g>
      <rect width={W} height={H} fill="#120b1a" />
      <Stars t={t} o={0.9} />
      <rect x={560} y={700} width={420} height={780} fill="#2a1c24" /><rect x={640} y={900} width={260} height={580} rx={14} fill="#5a3824" /><circle cx={860} cy={1200} r={14} fill={GOLD} />
      <path d="M 600 860 L 940 860" stroke="#5a3b22" strokeWidth={10} /><g transform="translate(770 840)"><path d="M -30 -10 L 30 -10 L 22 60 L -22 60 Z" fill="#8a5a2a" /><path d="M -18 0 L 18 0 L 13 50 L -13 50 Z" fill="#ffe2a0" opacity={0.6 * flick(t, 2)} /><Glow id="dl15" cx={0} cy={30} r={260} c="#ffb547" o={0.35} /></g>
      <rect y={1470} width={W} height={450} fill="#2a1a14" />
      {t > put && <g transform="translate(720 1470)"><path d="M -70 0 L 70 0 L 60 -150 L -60 -150 Z" fill="#c8873c" /><circle cx={-24} cy={-160} r={26} fill="#ff6b6b" /><ellipse cx={24} cy={-160} rx={34} ry={18} fill="#d9a05b" /></g>}
      <g transform={`translate(${interp(leave, [0, 1], [560, 160])} ${1640 - 18 * leave}) scale(${0.9 - 0.2 * leave})`}>
        <Seeker uid="pl15c" t={t} look={PLAIN} blink={blinkAt(t, 5)} smile={0.6} gazeX={0.6} gazeY={0.5 * bend} nod={30 * bend} lArm={[-4, 8]} rArm={back ? [-4, 8] : [20 + 40 * bend, 30 + 40 * bend]} back={back} walk={back ? t * 7 : 0} />
      </g>
      {!back && t < put + 0.3 && <g transform={`translate(${620} ${1250 + 200 * k(t, put - 0.5, put)})`}><path d="M -50 0 L 50 0 L 42 110 L -42 110 Z" fill="#c8873c" /></g>}
      <Sparkles t={t} at={wt(5, "allah")} cx={540} cy={500} n={16} c="#fff3c4" />
    </g>
  );
};
/* S6: hands raised in dua; the comment box types the dua */
const S_Dua: React.FC<{ t: number }> = ({ t }) => {
  const a = L(6).start, txt = "Ya Allah, hamare dil saaf kar de!", n = Math.floor(interp(t, [a + 0.8, L(6).end], [0, txt.length]));
  const up = k(t, a - 0.2, a + 0.5);
  return (
    <g>
      <rect width={W} height={H} fill="#140d1c" />
      <Stars t={t} o={0.8} />
      <Glow id="du15" cx={540} cy={1500} r={700} c="#ffb547" o={0.25} />
      <g transform={`translate(0 ${80 * (1 - up)})`}>
        <Hand x={390} y={1720} s={1.6} r={-12} skin="#c99a72" curl={0.15} />
        <Hand x={690} y={1720} s={1.6} r={12} skin="#c99a72" flip curl={0.15} />
      </g>
      <g transform={`translate(540 800) scale(${pop(t, a + 0.3, 0.4)})`}>
        <rect x={-420} y={-170} width={840} height={340} rx={50} fill="#1d1420" stroke={GOLD} strokeWidth={6} />
        <text x={-360} y={-80} fontFamily={FONT} fontWeight={800} fontSize={40} fill="#cbb98f">Comment</text>
        <rect x={-360} y={-40} width={720} height={150} rx={30} fill="#2c2030" />
        <text x={-330} y={52} fontFamily={FONT} fontWeight={800} fontSize={44} fill="#fff">{txt.slice(0, n)}<tspan fill={GOLD} opacity={Math.sin(t * 10) > 0 ? 1 : 0}>|</tspan></text>
      </g>
    </g>
  );
};
/* S7: share = another sadqah: the lesson travels from lamp to lamp */
const S_Share: React.FC<{ t: number }> = ({ t }) => {
  const a = L(7).start;
  return (
    <g>
      <defs><linearGradient id="sh15" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#120b1a" /><stop offset="100%" stopColor="#2f1d14" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#sh15)" />
      <Stars t={t} />
      {Array.from({ length: 5 }, (_, i) => { const on = k(t, a + 0.3 + i * 0.45, a + 0.6 + i * 0.45); const x = 140 + i * 200, y = 1250 - (i % 2) * 140; return <g key={i} transform={`translate(${x} ${y})`}><line x1={0} y1={-500} x2={0} y2={-90} stroke="#5a3b22" strokeWidth={4} /><path d="M -40 -90 L 40 -90 L 30 0 L -30 0 Z" fill="#8a5a2a" /><path d="M -26 -78 L 26 -78 L 20 -10 L -20 -10 Z" fill="#ffe2a0" opacity={0.15 + 0.85 * on * flick(t, i)} /><Glow id={`sl15${i}`} cx={0} cy={-45} r={200} c="#ffb547" o={0.6 * on} /></g>; })}
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
    <div style={{ fontFamily: "Amiri", fontSize: 54, color: GOLD, direction: "rtl", lineHeight: 1.55 }}>إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ<br /><span style={{ opacity: second ? 1 : 0.35 }}>وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ</span></div>
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: "#fff", marginTop: 8, lineHeight: 1.3 }}>"Allah tumhari sooraton aur maalon ko nahin dekhta, balke tumhare dilon aur aamaal ko dekhta hai."</div>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#cbb98f", marginTop: 12, letterSpacing: "0.08em" }}>SAHIH MUSLIM 2564</div>
  </div>;
};

export const SadqahAnim1115: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Who t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Dome t={t} /> },
    { a: b(1), b: b(2), r: (t) => <S_NotFace t={t} /> },
    { a: b(2), b: b(3), r: (t) => <S_Heart t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_NotCar t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Secret t={t} /> },
    { a: b(5), b: b(6), r: (t) => <S_Dua t={t} /> },
    { a: b(6), b: SADQAH1115_DUR + 1, r: (t) => <S_Share t={t} /> },
  ];
  const XF = 0.25;
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [SADQAH1115_DUR - 0.7, SADQAH1115_DUR], [0, 1]));
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
      <Card font={FONT} t={t} a={wt(0, "shakal")} b={b(0)} top={260} bg="rgba(20,12,24,0.9)" fg={GOLD} border={`4px solid ${GOLD}`} size={48}>Shakal? Daulat?</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.2} b={b(1)} top={260} bg="rgba(20,12,24,0.9)" fg="#fff" border={`4px solid ${GOLD}`} size={38}>Hazrat Abu Huraira (Radi Allahu Anhu)</Card>
      <Card font={FONT} t={t} a={L(1).start + 0.6} b={b(1)} top={370} bg={GOLD} fg="#1d1420" size={44}>Sahih Muslim 2564</Card>
      <HadithCard t={t} />
      <Card font={FONT} t={t} a={wt(4, "kapde")} b={wt(4, "gaadi")} top={300} bg="#e5383b" size={52}>Mehnge kapde? Nahin</Card>
      <Card font={FONT} t={t} a={wt(4, "gaadi")} b={wt(4, "dil") - 0.1} top={300} bg="#e5383b" size={52}>Badi gaadi? Nahin</Card>
      <Card font={FONT} t={t} a={wt(4, "dil") - 0.1} b={b(4)} top={300} bg={GOLD} fg="#1d1420" size={52}>Saaf dil + achhe aamaal</Card>
      <Card font={FONT} t={t} a={wt(5, "kaam")} b={b(5)} top={290} bg="rgba(20,12,24,0.9)" fg={GOLD} border={`4px solid ${GOLD}`} size={44}>Aaj 1 achha kaam, khamoshi se</Card>
      <Card font={FONT} t={t} a={L(7).start + 0.3} b={SADQAH1115_DUR} top={1000} bg={GOLD} fg="#1d1420" size={48}>Aage bhejein = ek aur sadqah</Card>
      <Captions t={t} TL={TL} font={FONT} hi={GOLD} base="#a99b86" done="#ffffff" bg="rgba(20,12,24,0.85)" size={54} top={1600} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fade, dip) }} />
      {withAudio && <Audio src={staticFile("day1/d1115sadqah-mix.m4a")} />}
    </AbsoluteFill>
  );
};
