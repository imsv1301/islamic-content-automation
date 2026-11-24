import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import timing from "../../day1/d1124kids-timing.json";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { k } from "../qawwali/anim/QawwaliAnim";
import { Timing, mkT, pop, Captions, Card, Sparkles, Heart, W, H, rn } from "./AnimKit";

/* Islam for Little Ones · 24 Nov 2026 "Share your lunch!" (Sahih al-Bukhari 5392, Hazrat Abu Huraira Radi Allahu Anhu:
   the food of two is enough for three, and the food of three is enough for four). Cast: ordinary kids at school + Mum, with
   faces. When he ﷺ is mentioned: the REAL Green Dome photo only (Pixabay 198164 aerial, d1110/dome_a1). No music. */
const TL = timing as unknown as Timing;
const { L, wt } = mkT(TL);
export const KIDS1124_DUR = TL.total;
const FONT = "'Baloo 2', 'Montserrat', sans-serif";
const KID: Look = { kid: true, beard: false, cap: null, top: "#ff7a00", topD: "#d96400", pants: "#2b3a67", shawl: false, hair: "#24170f" };
const MUM: Look = { beard: false, cap: null, hijab: "#7b61ff", top: "#c9bdff", topD: "#a99cf0", shawl: false, long: true, skin: ["#e6bd98", "#cf9d76", "#ad7b55"] };
const FR1: Look = { kid: true, beard: false, cap: null, top: "#3a86ff", topD: "#2a6ad6", pants: "#3d405b", shawl: false, hair: "#120c08", skin: ["#c99a72", "#ad7c55", "#8a5d3a"] };
const FR2: Look = { kid: true, beard: false, cap: null, hijab: "#ff5d8f", top: "#ffd23f", topD: "#e0b520", shawl: false, long: true, skin: ["#f0c9a4", "#d9a982", "#b8865f"] };
const DAD: Look = { beard: true, cap: null, top: "#2a9d8f", topD: "#1f7a6f", pants: "#2b2d42", shawl: false, hair: "#1a120c" };

/* L1: the real Green Dome photo underneath, soft light + birds on top */
const BIRDS = Array.from({ length: 7 }, (_, i) => ({ y: 260 + i * 55, sp: 90 + i * 12, ph: i * 0.9, s: 0.7 + (i % 3) * 0.2 }));
const S_Dome: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${100 + i * 120} -40 L ${170 + i * 120} -40 L ${260 + i * 130} 1920 L ${40 + i * 110} 1920 Z`} fill="#fff6d0" opacity={0.05 + 0.04 * Math.sin(t * 1.5 + i)} />)}
    {BIRDS.map((b, i) => { const x = ((t - 3) * b.sp + i * 160) % 1300 - 100, flap = Math.sin(t * 9 + b.ph) * 12; return <path key={i} transform={`translate(${x} ${b.y + Math.sin(t + i) * 10}) scale(${b.s})`} d={`M -24 ${flap} Q -12 -6 0 0 Q 12 -6 24 ${flap}`} stroke="#3a3a3a" strokeWidth={5} fill="none" strokeLinecap="round" />; })}
  </g>
);

/* a sunny school yard with a bench (seat top y=1430) */
const Yard: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs><linearGradient id="yd24" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a2d2ff" /><stop offset="100%" stopColor="#e8f7ff" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#yd24)" />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={((t * 25 + i * 420) % 1400) - 150} cy={260 + i * 110} rx={110} ry={36} fill="#fff" opacity={0.95} />)}
    <rect x={0} y={700} width={W} height={520} fill="#ffd6a5" /><rect x={0} y={680} width={W} height={30} fill="#e76f51" />
    {[0, 1, 2, 3].map((i) => <g key={i}><rect x={60 + i * 260} y={780} width={180} height={150} rx={12} fill="#bde0fe" stroke="#fff" strokeWidth={10} /><line x1={150 + i * 260} y1={780} x2={150 + i * 260} y2={930} stroke="#fff" strokeWidth={8} /></g>)}
    <rect y={1220} width={W} height={700} fill="#9bd77a" />
    <rect x={120} y={1420} width={840} height={36} rx={14} fill="#c77d3a" /><rect x={160} y={1456} width={26} height={150} fill="#8a5232" /><rect x={894} y={1456} width={26} height={150} fill="#8a5232" />
    {Array.from({ length: 10 }, (_, i) => { const r = rn(i + 30); return <circle key={i} cx={r() * W} cy={1640 + r() * 260} r={10} fill={i % 2 ? "#ff8fab" : "#ffd23f"} />; })}
  </g>
);
const Lunchbox: React.FC<{ x: number; y: number; s?: number; open?: number; empty?: boolean }> = ({ x, y, s = 1, open = 0, empty }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-90} y={-60} width={180} height={70} rx={14} fill={empty ? "#adb5bd" : "#2ec4b6"} />
    {open < 0.5 ? <rect x={-90} y={-80} width={180} height={26} rx={10} fill={empty ? "#ced4da" : "#7ce0d6"} /> : <rect x={-90} y={-60} width={180} height={14} rx={6} fill="#7ce0d6" />}
    {!empty && open >= 0.5 && <g transform={`scale(${Math.min(1, (open - 0.5) * 2)})`} style={{ transformBox: "fill-box" }}><path d="M -76 -52 L 0 -52 L 0 -96 L -76 -96 Q -82 -74 -76 -52 Z" fill="#f4d58d" stroke="#c99a3c" strokeWidth={4} /><rect x={-78} y={-76} width={78} height={8} fill="#52b788" /><circle cx={44} cy={-80} r={28} fill="#e63946" /><rect x={42} y={-118} width={5} height={14} fill="#6b4630" /></g>}
  </g>
);
/* a sandwich; split 0..1 moves the halves apart (dx each) */
const Sandwich: React.FC<{ x: number; y: number; s?: number; split?: number; dx?: number }> = ({ x, y, s = 1, split = 0, dx = 140 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 1].map((d) => <g key={d} transform={`translate(${d * dx * split} ${-30 * Math.sin(split * Math.PI)}) rotate(${d * 8 * split})`}>
      <path d={d < 0 ? "M -100 -20 L -4 -20 L -4 40 L -100 40 Q -110 10 -100 -20 Z" : "M 4 -20 L 100 -20 Q 110 10 100 40 L 4 40 Z"} fill="#f4d58d" stroke="#c99a3c" strokeWidth={5} />
      <rect x={d < 0 ? -104 : 4} y={2} width={100} height={10} fill="#52b788" />
      <rect x={d < 0 ? -104 : 4} y={12} width={100} height={8} fill="#e63946" />
    </g>)}
  </g>
);
const Slice: React.FC<{ x: number; y: number; r?: number; s?: number }> = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}><path d="M -34 0 A 34 34 0 0 1 34 0 Z" fill="#fff4d6" stroke="#e63946" strokeWidth={8} /><circle cx={-4} cy={-12} r={3} fill="#6b4630" /></g>
);
/* L0: on the school bench: our kid opens a full lunchbox; the friend turns his empty one over, sad; a "?" on "is it" */
const S_Forgot: React.FC<{ t: number }> = ({ t }) => {
  const fg = wt(0, "forgot"), lu = wt(0, "lunch", 1), q = pop(t, wt(0, "is") - 0.2);
  const sad = k(t, fg - 0.3, fg + 0.3), open = k(t, lu - 0.3, lu + 0.3);
  return (
    <g>
      <Yard t={t} />
      <g transform="translate(330 1700) scale(0.9)"><Seeker uid="k24a" t={t} look={KID} blink={blinkAt(t, 1)} smile={0.8 - 0.6 * k(t, lu, lu + 0.5)} brow={0.3} gazeX={t > fg ? 0.7 : 0.3} gazeY={0.3} rArm={[-30, 70]} lArm={[-6, 8]} /></g>
      <g transform="translate(760 1700) scale(0.9)"><Seeker uid="f24a" t={t} look={FR1} blink={blinkAt(t, 2)} smile={0.4 - 1 * sad} brow={0.4 - 1.2 * sad} gazeX={-0.3} gazeY={0.6 * sad} tilt={5 * sad} lArm={[-30, 70]} rArm={[-6, 8]} /></g>
      <g transform={`translate(640 1415) rotate(${180 * sad})`}><Lunchbox x={0} y={0} s={0.8} empty /></g>
      <Lunchbox x={400} y={1330} s={1.1} open={open} />
      {sad > 0.5 && <g transform={`translate(800 820) scale(${pop(t, fg + 0.1)})`}><rect x={-200} y={-56} width={400} height={100} rx={46} fill="#fff" stroke="#adb5bd" strokeWidth={6} /><text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill="#6c757d">NO LUNCH!</text></g>}
      {q > 0 && <text x={330} y={760 - 10 * Math.sin(t * 3)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170 * q} fill="#ff7a00">?</text>}
    </g>
  );
};
/* L2: the kid breaks the sandwich in half on "break"/"half" and hands one half to the friend on "you" */
const S_Split: React.FC<{ t: number }> = ({ t }) => {
  const br = wt(2, "break"), me = wt(2, "me"), yu = wt(2, "you");
  const split = k(t, br - 0.1, br + 0.5), give = k(t, yu - 0.5, yu + 0.2);
  return (
    <g>
      <Yard t={t} />
      <g transform="translate(330 1700) scale(0.9)"><Seeker uid="k24b" t={t} look={KID} blink={blinkAt(t, 3)} smile={1} gazeX={0.4} gazeY={0.3} rArm={[-40 - 20 * give, 40 - 30 * give]} lArm={[-30, 70]} /></g>
      <g transform="translate(760 1700) scale(0.9)"><Seeker uid="f24b" t={t} look={FR1} blink={blinkAt(t, 4)} smile={-0.4 + 1.4 * give} brow={-0.4 + 0.9 * give} wide={0.4 * give} gazeX={-0.6} gazeY={0.3} lArm={give > 0.5 ? [-40, 50] : [-6, 8]} rArm={[-6, 8]} /></g>
      {/* left half stays with our kid, right half travels to the friend */}
      <g transform="translate(0 0)">
        <g transform={`translate(${540 - 120 * split} ${1390 - 30 * Math.sin(split * Math.PI)}) rotate(${-8 * split}) scale(1.2)`}><path d="M -100 -20 L -4 -20 L -4 40 L -100 40 Q -110 10 -100 -20 Z" fill="#f4d58d" stroke="#c99a3c" strokeWidth={5} /><rect x={-104} y={2} width={100} height={10} fill="#52b788" /><rect x={-104} y={12} width={100} height={8} fill="#e63946" /></g>
        <g transform={`translate(${540 + 120 * split + 180 * give} ${1390 - 30 * Math.sin(split * Math.PI) + 60 * give}) rotate(${8 * split}) scale(1.2)`}><path d="M 4 -20 L 100 -20 Q 110 10 100 40 L 4 40 Z" fill="#f4d58d" stroke="#c99a3c" strokeWidth={5} /><rect x={4} y={2} width={100} height={10} fill="#52b788" /><rect x={4} y={12} width={100} height={8} fill="#e63946" /></g>
      </g>
      {split > 0.3 && t < me + 1.2 && <text x={540} y={980} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill="#c99a3c" opacity={1 - Math.max(0, t - me) / 1.2}>CRUNCH!</text>}
      {pop(t, me - 0.1) > 0 && <g transform={`translate(260 760) scale(${pop(t, me - 0.1)})`}><rect x={-150} y={-56} width={300} height={100} rx={46} fill="#ff7a00" /><text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill="#fff">FOR ME</text></g>}
      {pop(t, yu - 0.1) > 0 && <g transform={`translate(800 760) scale(${pop(t, yu - 0.1)})`}><rect x={-170} y={-56} width={340} height={100} rx={46} fill="#3a86ff" /><text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill="#fff">FOR YOU!</text></g>}
      <Sparkles t={t} at={yu + 0.2} cx={760} cy={1390} n={10} />
    </g>
  );
};
/* L3: another friend walks in and sits; apple slices fan out into three little piles */
const S_Third: React.FC<{ t: number }> = ({ t }) => {
  const an = wt(3, "another"), ap = wt(3, "apple");
  const walk = k(t, an - 0.6, an + 0.9), fan = k(t, ap - 0.2, ap + 0.8);
  const piles = [380, 560, 740];
  return (
    <g>
      <Yard t={t} />
      <g transform="translate(250 1700) scale(0.82)"><Seeker uid="k24c" t={t} look={KID} blink={blinkAt(t, 5)} smile={1} gazeX={0.6} gazeY={0.3} rArm={fan > 0 && fan < 1 ? [-50, 30] : [-6, 8]} lArm={[-6, 8]} /></g>
      <g transform="translate(560 1700) scale(0.82)"><Seeker uid="f24c" t={t} look={FR1} blink={blinkAt(t, 6)} smile={1} gazeX={0.6} gazeY={0.2} lArm={[-6, 8]} rArm={[-6, 8]} /></g>
      <g transform={`translate(${interp(walk, [0, 1], [1250, 860])} 1700) scale(0.82)`}><g transform={`translate(0 ${-Math.abs(Math.sin(t * 9)) * 14 * (walk > 0 && walk < 1 ? 1 : 0)})`}><Seeker uid="g24c" t={t} look={FR2} blink={blinkAt(t, 7)} smile={0.9} gazeX={-0.7} lArm={walk >= 1 ? [-40, 30 + 15 * Math.sin(t * 7)] : [20 * Math.sin(t * 9), 20]} rArm={[-20 * Math.sin(t * 9), 20]} /></g></g>
      <ellipse cx={560} cy={1450} rx={300} ry={40} fill="#fff" stroke="#e9ecef" strokeWidth={6} />
      {Array.from({ length: 9 }, (_, i) => { const p = piles[i % 3], j = Math.floor(i / 3); const x = interp(fan, [0, 1], [560, p + (j - 1) * 34]), y = interp(fan, [0, 1], [1430, 1440 - j * 6]); return <Slice key={i} x={x} y={y} r={(j - 1) * 20} s={0.9} />; })}
      {pop(t, ap - 0.1) > 0 && <g transform={`translate(560 820) scale(${pop(t, ap - 0.1)})`}><rect x={-260} y={-56} width={520} height={100} rx={46} fill="#e63946" /><text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill="#fff">APPLES FOR ALL!</text></g>}
    </g>
  );
};
/* L4: the three eat together, bobbing and smiling; hearts float up; "ENOUGH FOR EVERYONE" */
const S_Enough: React.FC<{ t: number }> = ({ t }) => {
  const a = L(4).start, sm = wt(4, "smiling");
  const chew = (s: number) => Math.max(0, Math.sin(t * 9 + s)) * 0.25;
  return (
    <g>
      <Yard t={t} />
      {[{ x: 250, l: KID, s: 1 }, { x: 540, l: FR1, s: 2 }, { x: 830, l: FR2, s: 3 }].map((p, i) => <g key={i} transform={`translate(${p.x} ${1700 - Math.abs(Math.sin(t * 4 + i)) * 8}) scale(0.82)`}><Seeker uid={`e24${i}`} t={t} look={p.l} blink={blinkAt(t, 8 + i)} smile={t > sm - 0.3 ? 1 : 0.7} mouthOpen={t < sm - 0.3 ? chew(p.s) : 0} gazeX={(1 - i) * 0.4} rArm={[-40 + 10 * Math.sin(t * 5 + i), 50]} lArm={[-6, 8]} /></g>)}
      {pop(t, a + 0.3) > 0 && <g transform={`translate(540 800) scale(${pop(t, a + 0.3)})`}><rect x={-380} y={-60} width={760} height={110} rx={50} fill="#2e7d5b" /><text y={18} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#fff">ENOUGH FOR EVERYONE!</text></g>}
      {Array.from({ length: 9 }, (_, i) => { const d = t - sm - i * 0.18; return d > 0 && <Heart key={i} x={200 + i * 85} y={1100 - d * 220} s={0.6} o={Math.max(0, 1 - d / 1.8)} />; })}
    </g>
  );
};
/* L5: blessing: the shared food on one plate sparkles and looks MORE, not less: a meter swings from LESS to MORE */
const S_Barakah: React.FC<{ t: number }> = ({ t }) => {
  const bl = wt(5, "blessing"), mo = wt(5, "more");
  const sw = k(t, mo - 0.6, mo + 0.2);
  return (
    <g>
      <Yard t={t} />
      <ellipse cx={540} cy={1260} rx={360} ry={56} fill="#fff" stroke="#e9ecef" strokeWidth={6} />
      <Sandwich x={420} y={1220} s={1.1} split={0.25} dx={60} />
      {Array.from({ length: 6 }, (_, i) => <Slice key={i} x={640 + (i % 3) * 50} y={1240 - Math.floor(i / 3) * 24} r={(i - 2) * 10} s={0.9} />)}
      {Array.from({ length: 14 }, (_, i) => { const r = rn(i + 400), d = ((t - bl) * 0.6 + r()) % 1; return t > bl - 0.2 && <path key={i} transform={`translate(${300 + r() * 480} ${1240 - d * 360}) scale(${0.6 + r() * 0.6})`} d="M 0 -16 L 4 -4 L 16 0 L 4 4 L 0 16 L -4 4 L -16 0 L -4 -4 Z" fill="#ffd23f" opacity={(1 - d) * 0.9} />; })}
      <g transform="translate(540 820)">
        <path d="M -220 0 A 220 220 0 0 1 220 0" stroke="#e9ecef" strokeWidth={40} fill="none" />
        <path d="M -220 0 A 220 220 0 0 1 0 -220" stroke="#adb5bd" strokeWidth={40} fill="none" />
        <path d="M 0 -220 A 220 220 0 0 1 220 0" stroke="#52b788" strokeWidth={40} fill="none" />
        <text x={-230} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#6c757d">LESS</text>
        <text x={230} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#2e7d5b">MORE</text>
        <g transform={`rotate(${interp(sw, [0, 1], [-70, 70])})`}><rect x={-8} y={-200} width={16} height={200} rx={8} fill="#2b2d42" /></g><circle r={26} fill="#2b2d42" />
      </g>
      <Sparkles t={t} at={mo + 0.1} cx={760} cy={700} n={12} />
    </g>
  );
};
/* L6: goodbye at the school gate: kid and friends wave; Mum (in hijab) waits beside them */
const S_Bye: React.FC<{ t: number }> = ({ t }) => {
  const wave = Math.sin(t * 8) * 18, gr = wt(6, "grownup");
  return (
    <g>
      <defs><linearGradient id="bye24" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffe5b4" /><stop offset="100%" stopColor="#fff6e8" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#bye24)" />
      {Array.from({ length: 14 }, (_, i) => { const r = rn(i + 270); const y = ((1900 - (t * (50 + r() * 60) + r() * 1900)) % 1900 + 1900) % 1900; return <g key={i} transform={`translate(${r() * W} ${y}) rotate(${t * 40 + i * 30}) scale(${0.5 + r() * 0.5})`} opacity={0.7}><Heart x={0} y={0} s={0.5} o={1} /></g>; })}
      <rect y={1600} width={W} height={320} fill="#9bd77a" />
      <g transform="translate(180 1760) scale(0.95)"><Seeker uid="m24c" t={t} look={MUM} blink={blinkAt(t, 12)} smile={0.9} gazeX={0.6} lArm={t > gr - 0.4 ? [-40, 40] : [-6, 8]} rArm={[-6, 8]} /></g>
      <g transform="translate(520 1880) scale(1.05)"><Seeker uid="by24" t={t} look={KID} blink={blinkAt(t, 13)} smile={1} wide={0.3} rArm={[-150, -30 + wave]} lArm={[-6, 8]} tilt={3 * Math.sin(t * 2)} /></g>
      <g transform="translate(870 1880) scale(0.95)"><Seeker uid="bf24" t={t} look={FR1} blink={blinkAt(t, 14)} smile={1} rArm={[-150, -30 - wave]} lArm={[-6, 8]} /></g>
      {pop(t, gr - 0.2) > 0 && <g transform={`translate(540 760) scale(${pop(t, gr - 0.2)})`}><rect x={-300} y={-70} width={600} height={130} rx={60} fill="#fff" stroke="#2e7d5b" strokeWidth={8} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#2e7d5b">Tell your grown-up!</text></g>}
    </g>
  );
};
export const KidsAnim1124: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const b = (i: number) => (L(i).end + (L(i + 1)?.start ?? L(i).end + 0.4)) / 2;
  const SHOTS: { a: number; b: number; r: (t: number) => React.ReactNode }[] = [
    { a: 0, b: b(0), r: (t) => <S_Forgot t={t} /> },
    { a: b(0), b: b(1), r: (t) => <S_Dome t={t} /> },
    { a: b(1), b: b(2), r: (t) => <S_Split t={t} /> },
    { a: b(2), b: b(3), r: (t) => <S_Third t={t} /> },
    { a: b(3), b: b(4), r: (t) => <S_Enough t={t} /> },
    { a: b(4), b: b(5), r: (t) => <S_Barakah t={t} /> },
    { a: b(5), b: KIDS1124_DUR + 1, r: (t) => <S_Bye t={t} /> },
  ];
  const fade = Math.max(interp(t, [0, 0.25], [1, 0]), interp(t, [KIDS1124_DUR - 0.6, KIDS1124_DUR], [0, 1]));
  const domeA = b(0), domeB = b(1);
  const dip = Math.max(0, ...[b(0), b(1)].map((x) => 1 - Math.abs(t - x) / 0.18));
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {t >= domeA && t < domeB && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img src={staticFile("d1110/dome_a1.jpg")} style={{ width: W, height: H, objectFit: "cover", transformOrigin: "50% 70%", transform: `scale(${1.02 + 0.1 * k(t, domeA, domeB)})` }} />
        </AbsoluteFill>
      )}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => (t >= s.a && t < s.b ? <g key={i}>{s.r(t)}</g> : null))}
      </svg>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ background: "#2e7d5b", color: "#fff", borderRadius: 40, padding: "12px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.08em" }}>ISLAM FOR LITTLE ONES · SHARE YOUR LUNCH</span>
      </div>
      <Card font={FONT} t={t} a={L(1).start + 0.3} b={b(1)} top={300}>Sahih al-Bukhari 5392</Card>
      <Card font={FONT} t={t} a={wt(1, "three")} b={b(1)} top={420} bg="#ff7a00" size={44}>Food for 2 = enough for 3!</Card>
      <Card font={FONT} t={t} a={L(2).start + 0.3} b={b(2)} top={300} bg="#c99a3c">1 · Break it in half</Card>
      <Card font={FONT} t={t} a={L(3).start + 0.2} b={b(3)} top={300} bg="#e63946">2 · Share the apples too</Card>
      <Card font={FONT} t={t} a={wt(5, "blessing")} b={b(5)} top={300} bg="#2e7d5b" size={44}>Sharing = blessing (barakah)</Card>
      <Card font={FONT} t={t} a={L(6).start} b={KIDS1124_DUR} top={300} bg="#ff7a00">Your turn! Share tomorrow</Card>
      <Captions t={t} TL={TL} font={FONT} hi="#ff7a00" base="#9aa0b5" done="#2b2d42" bg="rgba(255,255,255,0.92)" size={62} />
      <AbsoluteFill style={{ background: "#fff6e8", opacity: Math.max(0, ...[b(2), b(3), b(4), b(5)].map((x) => 1 - Math.abs(t - x) / 0.16)) }} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fade, dip) }} />
      {withAudio && <Audio src={staticFile("day1/d1124kids-mix.m4a")} />}
    </AbsoluteFill>
  );
};
