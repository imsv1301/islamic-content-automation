import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing, Audio } from "remotion";
import data from "./solution-timing.json";
import { pop, clamp, prng, Kid, Mum, Person, Defs } from "../kids/kit";

type Tok = [string, number, number];
type Line = { id: string; start: number; end: number; tokens: Tok[] };
const LINES = data.lines as unknown as Line[];
export const SOLUTION_DUR = data.total as number;
const S = (i: number) => LINES[i].start;
const E = (i: number) => LINES[i].end;

const NAVY = "#16213e", CREAM = "#fff4e0", ORANGE = "#ff8c42", GOLD = "#ffc857", RED = "#ff5a4e", GREEN = "#4fd18b";
const MONT = "Montserrat, sans-serif";
const BALOO = "'Baloo 2', Montserrat, sans-serif";
const rs = prng(31);
const STARS = Array.from({ length: 80 }, () => ({ x: rs() * 1080, y: rs() * 900, r: 1 + rs() * 2.6, w: 0.6 + rs() * 2, p: rs() * 6.28 }));

// who is where: 0 = left cliff, 1 = right cliff. Steps happen on lines 2..6.
type Who = "adam" | "zara" | "omar" | "grandad";
const STEPS: { line: number; who: Who[]; dir: 1 | -1; mins: number }[] = [
  { line: 2, who: ["adam", "zara"], dir: 1, mins: 2 },
  { line: 3, who: ["adam"], dir: -1, mins: 1 },
  { line: 4, who: ["omar", "grandad"], dir: 1, mins: 10 },
  { line: 5, who: ["zara"], dir: -1, mins: 2 },
  { line: 6, who: ["adam", "zara"], dir: 1, mins: 2 },
];
const SLOT: Record<Who, number> = { adam: 0, zara: 1, omar: 2, grandad: 3 };
const LEFT_X = [70, 140, 210, 280], RIGHT_X = [1010, 940, 870, 800];

const progress = (t: number, line: number) => interpolate(t, [S(line) + 0.25, E(line) - 0.1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

const posOf = (who: Who, t: number) => {
  let side = 0; let x = LEFT_X[SLOT[who]]; let y = 760; let moving = false; let carry = false;
  for (const st of STEPS) {
    const inStep = st.who.includes(who);
    if (!inStep) continue;
    const p = progress(t, st.line);
    if (t < S(st.line) + 0.25) break;
    const from = side === 0 ? LEFT_X[SLOT[who]] : RIGHT_X[SLOT[who]];
    const to = st.dir === 1 ? RIGHT_X[SLOT[who]] : LEFT_X[SLOT[who]];
    x = from + (to - from) * p;
    const u = Math.min(1, Math.max(0, (x - 300) / 480));
    y = x > 300 && x < 780 ? 760 + 4 * 60 * u * (1 - u) : 760;
    moving = p > 0 && p < 1;
    carry = moving && (st.who[0] === who);
    if (p >= 1) side = st.dir === 1 ? 1 : 0; else break;
  }
  return { x, y, moving, carry };
};

const elapsed = (t: number) => {
  let m = 0;
  for (const st of STEPS) m += st.mins * progress(t, st.line);
  return m;
};

const Gorge: React.FC = () => (
  <g>
    <path d="M -10 760 L 300 760 L 330 800 L 290 1100 L -10 1100 Z" fill="#3b2f4a" />
    <path d="M 1090 760 L 780 760 L 750 800 L 790 1100 L 1090 1100 Z" fill="#3b2f4a" />
    <path d="M 300 700 Q 540 760 780 700" stroke="#c9a46a" strokeWidth={8} fill="none" />
    {Array.from({ length: 14 }, (_, i) => { const x = 304 + i * 34; const u = (x - 300) / 480; const y = 762 + 240 * u * (1 - u); return <rect key={i} x={x} y={y - 6} width={28} height={14} rx={3} fill="#a77b45" />; })}
    <path d="M 300 764 Q 540 884 780 764" stroke="#8a6436" strokeWidth={6} fill="none" />
  </g>
);

const Torch: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const fl = 1 + 0.08 * Math.sin(t * 17) + 0.05 * Math.sin(t * 29);
  return (
    <g transform={`translate(${x},${y}) scale(0.42)`}>
      <circle cy={-150} r={240} fill="url(#torchGlow)" opacity={0.85} />
      <rect x={-16} y={-120} width={32} height={230} rx={10} fill="#7a4f2a" />
      <g transform={`translate(0,-130) scale(${fl})`}>
        <path d="M 0 -150 C 40 -100 54 -60 40 -20 C 30 6 -30 6 -40 -20 C -54 -60 -30 -90 0 -150 Z" fill={ORANGE} />
        <path d="M 0 -96 C 20 -70 26 -46 18 -24 C 12 -8 -12 -8 -18 -24 C -26 -46 -14 -64 0 -96 Z" fill="#ffe08a" />
      </g>
    </g>
  );
};

const Crew: React.FC<{ t: number }> = ({ t }) => {
  const a = posOf("adam", t), z = posOf("zara", t), o = posOf("omar", t), g = posOf("grandad", t);
  const bob = (p: { moving: boolean }, ph: number) => (p.moving ? 8 * Math.abs(Math.sin(t * 9 + ph)) : 0);
  const people = [
    { p: a, el: <Kid x={a.x} y={a.y} s={0.5} bob={bob(a, 0)} shirt="#2bb3a3" pants="#2b4a7d" flip={a.x > 540} />, name: "ADAM" },
    { p: z, el: <Mum x={z.x} y={z.y} s={0.42} bob={bob(z, 1)} dress="#c0507a" hijab="#f0a6c0" flip={z.x > 540} />, name: "ZARA" },
    { p: o, el: <Kid x={o.x} y={o.y} s={0.5} bob={bob(o, 2)} shirt="#ff8c42" pants="#4a3a6d" cap={false} flip={o.x > 540} />, name: "OMAR" },
    { p: g, el: <g><Person x={g.x} y={g.y} s={0.62} robe="#8a8f9a" cloth="#f2f2ea" skin="#d6a77e" bob={bob(g, 3)} flip={g.x > 540} /><line x1={g.x + (g.x > 540 ? -28 : 28)} y1={g.y - 100} x2={g.x + (g.x > 540 ? -40 : 40)} y2={g.y} stroke="#6b4a2a" strokeWidth={6} strokeLinecap="round" /></g>, name: "GRANDAD" },
  ];
  const carrier = [a, z, o, g].find((p) => p.carry);
  // torch rests with whoever last carried it: before any step on the left, after final step on the right
  let tx = 330, ty = 700;
  if (carrier) { tx = carrier.x + 30; ty = carrier.y - 120; }
  else {
    const done = STEPS.filter((st) => t >= E(st.line) - 0.1);
    if (done.length) { const last = done[done.length - 1]; tx = last.dir === 1 ? 760 : 320; ty = 700; }
  }
  return (
    <g>
      {people.map((x, i) => <g key={i}>{x.el}<text x={x.p.x} y={x.p.y - (i === 3 ? 165 : 150)} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={18} fill={CREAM}>{x.name}</text></g>)}
      <Torch x={tx} y={ty} t={t} />
    </g>
  );
};

const Counter: React.FC<{ t: number }> = ({ t }) => {
  const m = elapsed(t);
  const show = t > S(2) - 0.2 && t < S(10) - 0.1;
  const done = t > E(6);
  if (!show) return null;
  return (
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "rgba(10,16,40,0.8)", border: `6px solid ${done ? GREEN : CREAM}`, borderRadius: 30, padding: "6px 34px", fontFamily: MONT, fontWeight: 800, fontSize: 86, color: done ? GREEN : CREAM }}>
        {Math.round(m)} / 17 MIN
      </div>
    </div>
  );
};

const Ledger: React.FC<{ t: number }> = ({ t }) => {
  const rows = [["ADAM + ZARA →", "2"], ["ADAM ←", "1"], ["OMAR + GRANDAD →", "10"], ["ZARA ←", "2"], ["ADAM + ZARA →", "2"]];
  if (t < S(2)) return null;
  const o = interpolate(t, [E(7) + 0.2, E(7) + 0.5], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 1040, left: 150, right: 150, opacity: o, background: "rgba(255,244,224,0.95)", borderRadius: 22, border: `5px solid ${NAVY}`, padding: "12px 26px", fontFamily: MONT, fontWeight: 800, color: NAVY }}>
      {rows.map((r, i) => {
        const on = t >= S(STEPS[i].line);
        const big = i === 2;
        return (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 30, lineHeight: 1.4, opacity: on ? 1 : 0.15, color: big && on ? "#c0392b" : NAVY }}>
            <span>{r[0]}</span><span style={{ color: ORANGE }}>{r[1]}</span>
          </div>
        );
      })}
    </div>
  );
};

const Captions: React.FC<{ t: number }> = ({ t }) => {
  const line = LINES.find((l) => t >= l.start - 0.15 && t <= l.end + 0.3);
  if (!line) return null;
  const o = interpolate(t, [line.start - 0.15, line.start, line.end + 0.1, line.end + 0.3], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1310, height: 220, display: "flex", alignItems: "center", justifyContent: "center", opacity: o }}>
      <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 64, lineHeight: 1.12, textAlign: "center", color: CREAM }}>
        {line.tokens.map(([w, a], i) => {
          const on = t >= a - 0.02;
          const num = /\d|lion|truth|lies|seventeen|nineteen|thirteen|fifteen|three|one|two|ten|minute/i.test(w);
          const k = pop(t, a - 0.02, 0.28);
          return <span key={i} style={{ display: "inline-block", margin: "0 10px", color: on ? (num ? GOLD : CREAM) : "rgba(255,244,224,0.3)", transform: `translateY(${(1 - k) * 12}px)`, WebkitTextStroke: "3px #0b1230", paintOrder: "stroke fill" }}>{w}</span>;
        })}
      </div>
    </div>
  );
};


/* ---------- Riddle #2: two doors, two guards (Person 1 truth, Person 2 lies) ---------- */
const R0 = 10; // first line index of riddle 2
const Door: React.FC<{ x: number; t: number; glow: string; knock: number; q?: number }> = ({ x, t, glow, knock, q = 1 }) => (
  <g transform={`translate(${x + knock},0)`}>
    <path d={`M ${-150} 1160 L ${-150} 720 A 150 150 0 0 1 150 720 L 150 1160 Z`} fill="#2a1d14" />
    <path d={`M ${-128} 1160 L ${-128} 726 A 128 128 0 0 1 128 726 L 128 1160 Z`} fill="#6b4226" />
    {[-64, 0, 64].map((dx) => <rect key={dx} x={dx - 3} y={640} width={6} height={520} fill="#4e2f1a" opacity={0.6} />)}
    <rect x={-128} y={860} width={256} height={14} fill="#3a2414" /><rect x={-128} y={1040} width={256} height={14} fill="#3a2414" />
    <circle cx={88} cy={950} r={12} fill={GOLD} />
    <rect x={-128} y={1150} width={256} height={10} fill={glow} opacity={0.5 + 0.3 * Math.sin(t * 5)} />
    <text x={0} y={800} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={120} fill={CREAM} opacity={0.9 * q}>?</text>
  </g>
);
const SunIcon: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${t * 30})`}>
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-6} y={-78} width={12} height={26} rx={6} fill={GOLD} transform={`rotate(${i * 36})`} />)}
    <circle r={44} fill={GOLD} stroke="#0b1230" strokeWidth={6} />
  </g>
);
const LionIcon: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x},${y}) scale(${s * (1 + 0.04 * Math.sin(t * 9))})`}>
    {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={Math.cos((i / 14) * 6.28) * 54} cy={Math.sin((i / 14) * 6.28) * 54} r={24} fill="#c0652b" stroke="#0b1230" strokeWidth={5} />)}
    <circle r={50} fill="#e8a04a" stroke="#0b1230" strokeWidth={6} />
    <circle cx={-18} cy={-8} r={6} fill="#0b1230" /><circle cx={18} cy={-8} r={6} fill="#0b1230" />
    <path d="M -10 14 L 10 14 L 0 26 Z" fill="#0b1230" />
  </g>
);
const Guard: React.FC<{ x: number; y: number; color: string; t: number; ph: number }> = ({ x, y, color, t, ph }) => {
  const br = 3 * Math.sin(t * 2.4 + ph);
  return (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={0} cy={6} rx={80} ry={14} fill="#000" opacity={0.3} />
      <line x1={70} y1={10} x2={70} y2={-430} stroke="#8a8f9a" strokeWidth={10} strokeLinecap="round" />
      <path d="M 70 -470 L 88 -425 L 52 -425 Z" fill="#c8ccd4" />
      <path d={`M -70 0 L -58 ${-250 - br} Q 0 ${-290 - br} 58 ${-250 - br} L 70 0 Z`} fill={color} />
      <rect x={-62} y={-150} width={124} height={22} fill="#0b1230" opacity={0.35} />
      <circle cx={70} cy={-200} r={18} fill="#d6a77e" />
      <g transform={`translate(0,${-318 - br})`}>
        <circle r={54} fill="#d6a77e" />
        <path d="M -58 6 A 58 62 0 0 1 58 6 L 58 -6 Q 0 -10 -58 -6 Z" fill="#9aa1ad" stroke="#0b1230" strokeWidth={5} />
        <path d="M -6 -64 L 6 -64 L 0 -94 Z" fill={color} />
      </g>
    </g>
  );
};
const Riddle2: React.FC<{ t: number }> = ({ t }) => {
  if (t < S(R0) - 0.3) return null;
  const s0 = S(R0);
  const reveal = interpolate(t, [s0 + 0.15, s0 + 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  // sun & lion shuffle above the doors during line R0+1
  const l1 = R0 + 1, l2 = R0 + 2;
  const iconsIn = pop(t, S(l1) + 0.9, 0.5) * interpolate(t, [E(l1) + 0.6, E(l1) + 1.0], [1, 0], clamp);
  const sh = interpolate(t, [S(l1) + 2.2, E(l1) + 0.4], [0, 3], clamp);
  const swap = (Math.floor(sh) % 2 === 0 ? 0 : 1) + (sh % 1) * (Math.floor(sh) % 2 === 0 ? 1 : -1);
  const sx = 300 + 480 * Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, swap)));
  const lx = 780 - 480 * Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, swap)));
  const knock = t > S(l1) + 2 && t < E(l1) ? 4 * Math.sin(t * 60) * Math.max(0, Math.sin((t - S(l1)) * 3)) : 0;
  // guards
  const gIn = interpolate(t, [S(l2), S(l2) + 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const wTruth = tokAt(l2, /truth/i), wLies = tokAt(l2, /lies/i), wBut = tokAt(l2, /^but$/i);
  const mix = interpolate(t, [wBut + 0.2, wBut + 1.6], [0, 1], clamp);
  const gSwap = Math.sin(mix * Math.PI * 2) * 0.5 * (1 - mix) + 0; // wobble shuffle
  const g1x = 300 + 480 * (0.5 - 0.5 * Math.cos(mix * Math.PI * 2)) * 0 + 220 * gSwap;
  const g2x = 780 - 220 * gSwap;
  const blur = mix > 0 && mix < 1 ? 6 * Math.sin(mix * Math.PI) : 0;
  const hidden = t > wBut + 0.9;
  const tagO = (at: number) => pop(t, at, 0.4);
  const out = interpolate(t, [S(R0 + 3) - 0.1, S(R0 + 3) + 0.4], [1, 0.28], clamp);
  const qO = 1 - gIn;
  return (
    <g opacity={reveal}>
      <rect y={480} width={1080} height={700} fill="#2c2238" />
      {Array.from({ length: 9 }, (_, r) => Array.from({ length: 7 }, (_, c) => <rect key={`${r}-${c}`} x={c * 160 + (r % 2) * 80 - 60} y={480 + r * 78} width={152} height={70} rx={6} fill="#352a44" />))}
      <rect y={1160} width={1080} height={30} fill="#1d1626" />
      <g opacity={out}>
        <Door x={300} t={t} glow={GOLD} knock={0} q={qO} />
        <Door x={780} t={t} glow={GOLD} knock={knock} q={qO} />
      </g>
      {iconsIn > 0 ? <g opacity={iconsIn}><SunIcon x={sx} y={505} s={iconsIn} t={t} /><LionIcon x={lx} y={505} s={iconsIn * 0.9} t={t} /></g> : null}
      {gIn > 0 ? (
        <g opacity={out} style={{ filter: blur ? `blur(${blur}px)` : undefined }}>
          <g transform={`translate(0,${(1 - gIn) * 300})`}>
            <Guard x={g1x} y={1180} color="#3a7bd5" t={t} ph={0} />
            <Guard x={g2x} y={1180} color="#d5543a" t={t} ph={1.5} />
          </g>
          {[{ x: g1x, n: "PERSON 1", tag: "ALWAYS TRUTH", c: GREEN, at: wTruth }, { x: g2x, n: "PERSON 2", tag: "ALWAYS LIES", c: RED, at: wLies }].map((g, i) => (
            <g key={i} transform={`translate(${g.x},0)`}>
              <rect x={-110} y={636} width={220} height={56} rx={28} fill={CREAM} stroke="#0b1230" strokeWidth={5} />
              <text y={676} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={32} fill={NAVY}>{g.n}</text>
              {t > g.at - 0.05 ? (
                <g transform={`translate(0,1060) scale(${tagO(g.at)})`}>
                  <rect x={-140} y={-40} width={280} height={64} rx={20} fill={hidden ? "#6b6f80" : g.c} stroke="#0b1230" strokeWidth={5} />
                  <text y={6} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={hidden ? 40 : 30} fill={NAVY}>{hidden ? "? ? ?" : g.tag}</text>
                </g>
              ) : null}
            </g>
          ))}
        </g>
      ) : null}
    </g>
  );
};
const tokAt = (li: number, re: RegExp) => { const k = LINES[li].tokens.find((x) => re.test(x[0].replace(/[^\w]/g, ""))); return k ? k[1] : LINES[li].start + 1; };
const Riddle2Cards: React.FC<{ t: number }> = ({ t }) => {
  if (t < S(R0) - 0.3) return null;
  const wipe = interpolate(t, [S(R0) - 0.35, S(R0) + 0.25, S(R0) + 1.0, S(R0 + 1)], [0, 1, 1, 0], clamp);
  const q3 = R0 + 3, q4 = R0 + 4, q5 = R0 + 5;
  return (
    <>
      {wipe > 0 ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "absolute", width: 4400 * wipe, height: 4400 * wipe, borderRadius: "50%", background: `radial-gradient(circle, #fff1c1 0%, ${GOLD} 30%, ${ORANGE} 62%, rgba(255,140,66,0) 71%)`, top: 1920 - 2200 * wipe, left: 540 - 2200 * wipe, opacity: Math.min(1, wipe * 1.4) }} />
          <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 130, color: NAVY, transform: `scale(${pop(t, S(R0), 0.5)})`, opacity: wipe }}>RIDDLE #2</div>
        </AbsoluteFill>
      ) : null}
      {t > S(R0 + 1) - 0.1 && t < S(q3) ? (
        <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(R0 + 1), 0.45)})` }}>
          <span style={{ background: CREAM, color: NAVY, fontFamily: MONT, fontWeight: 800, fontSize: 52, borderRadius: 22, padding: "8px 28px", border: `6px solid ${NAVY}` }}>{t < S(R0 + 2) ? "2 DOORS · 1 WAY OUT" : "2 GUARDS · 1 LIAR"}</span>
        </div>
      ) : null}
      {t > S(q3) - 0.1 ? (
        <div style={{ position: "absolute", top: 340, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <div style={{ transform: `scale(${pop(t, S(q3), 0.5)})`, display: "flex", alignItems: "center", gap: 22, background: GOLD, border: `7px solid ${NAVY}`, borderRadius: 40, padding: "14px 40px" }}>
            <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 120, color: NAVY, lineHeight: 1 }}>1</span>
            <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 50, color: NAVY, lineHeight: 1.05 }}>QUESTION<br />1 GUARD</span>
          </div>
          {t > S(q4) - 0.1 ? <div style={{ transform: `scale(${pop(t, S(q4), 0.5) * (1 + 0.04 * Math.sin(t * 6))})`, fontFamily: MONT, fontWeight: 800, fontSize: 92, color: CREAM, WebkitTextStroke: "6px #0b1230", paintOrder: "stroke fill", textAlign: "center", lineHeight: 1.05 }}>WHAT WOULD<br />YOU ASK?</div> : null}
          {t > S(q5) - 0.1 ? (
            <>
              <div style={{ transform: `scale(${pop(t, S(q5), 0.5)})`, display: "flex", alignItems: "center", gap: 18, background: ORANGE, borderRadius: 60, padding: "14px 36px", border: `6px solid ${NAVY}` }}>
                <span style={{ fontSize: 56 }}>💬</span><span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 46, color: NAVY }}>COMMENT YOUR QUESTION</span>
              </div>
              <div style={{ transform: `scale(${pop(t, tokAt(q5, /answer/i), 0.5)})`, fontFamily: MONT, fontWeight: 800, fontSize: 46, color: GOLD, textAlign: "center" }}>ANSWER TOMORROW AT SUNRISE 🌅</div>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export const SolutionShort: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const hookA = pop(t, 0, 0.35), strike = interpolate(t, [0.5, 0.9], [0, 1], clamp), hookB = pop(t, W17(), 0.45);
  const hookO = interpolate(t, [E(1), E(1) + 0.4], [1, 0], clamp);
  const sceneO = interpolate(t, [S(1), S(1) + 0.6], [0.15, 1], clamp) * interpolate(t, [S(9) - 0.2, S(9) + 0.3], [1, 0.3], clamp) * interpolate(t, [S(R0) - 0.2, S(R0) + 0.3], [1, 0], clamp);
  const win = pop(t, S(7), 0.5);
  const end = E(LINES.length - 1) + 0.6, endP = pop(t, end, 0.5);
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Defs />
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1230" /><stop offset="0.6" stopColor="#24345f" /><stop offset="1" stopColor="#1a2547" /></linearGradient>
          <radialGradient id="torchGlow"><stop offset="0" stopColor="#ffd27a" stopOpacity={0.85} /><stop offset="1" stopColor="#ff8c42" stopOpacity={0} /></radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#sky)" />
        {STARS.map((s, i) => <circle key={i} cx={s.x} cy={s.y + 120} r={s.r} fill="#fff8e1" opacity={0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.w + s.p))} />)}
        <circle cx={880} cy={330} r={70} fill="#f4ecd0" opacity={0.9} /><circle cx={905} cy={315} r={62} fill="#24345f" opacity={0.95} />
        <g opacity={sceneO}><Gorge /><Crew t={t} /></g>
        <Riddle2 t={t} />
      </svg>
      {t < E(1) + 0.4 ? (
        <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60, opacity: hookO, fontFamily: MONT, fontWeight: 800 }}>
          <div style={{ position: "relative", fontSize: 240, color: RED, transform: `scale(${hookA})`, WebkitTextStroke: "8px #0b1230", paintOrder: "stroke fill" }}>
            19<div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 22, background: CREAM, transform: `scaleX(${strike}) rotate(-12deg)`, transformOrigin: "left" }} />
          </div>
          <div style={{ fontSize: 240, color: GREEN, transform: `scale(${hookB})`, WebkitTextStroke: "8px #0b1230", paintOrder: "stroke fill" }}>17</div>
        </div>
      ) : null}
      <Counter t={t} />
      <Ledger t={t} />
      {t > S(7) && t < E(8) + 0.3 ? (
        <div style={{ position: "absolute", top: 450, left: 0, right: 0, textAlign: "center", transform: `scale(${win})` }}>
          <span style={{ background: GREEN, color: NAVY, fontFamily: MONT, fontWeight: 800, fontSize: 60, borderRadius: 24, padding: "10px 32px", border: `6px solid ${NAVY}` }}>ALL ACROSS IN 17 ✓</span>
        </div>
      ) : null}
      {t > S(8) && t < E(8) + 0.3 ? (
        <div style={{ position: "absolute", top: 580, left: 90, right: 90, textAlign: "center", transform: `scale(${pop(t, S(8) + 0.3, 0.5)})` }}>
          <span style={{ background: CREAM, color: NAVY, fontFamily: MONT, fontWeight: 800, fontSize: 44, borderRadius: 20, padding: "8px 24px", border: `5px solid ${NAVY}` }}>SLOWEST TWO GO TOGETHER</span>
        </div>
      ) : null}
      {t > S(9) - 0.1 && t < S(R0) ? (
        <div style={{ position: "absolute", top: 520, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <div style={{ transform: `scale(${pop(t, S(9), 0.5)})`, display: "flex", alignItems: "center", gap: 18, background: ORANGE, borderRadius: 60, padding: "14px 36px" }}>
            <span style={{ fontSize: 56 }}>💬</span>
            <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 46, color: NAVY }}>DID YOU GET IT?</span>
          </div>
        </div>
      ) : null}
      <div style={{ position: "absolute", top: 222, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        <Img src={staticFile("day1/solve-by-sunrise.png")} style={{ width: 62, height: 62, borderRadius: 31 }} />
        <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 32, color: CREAM, letterSpacing: "0.05em" }}>{t < S(R0) ? "SOLVE BY SUNRISE · RIDDLE #1 SOLUTION" : "SOLVE BY SUNRISE · RIDDLE #2"}</span>
      </div>
      <Riddle2Cards t={t} />
      <Captions t={t} />
      {t >= end ? (
        <AbsoluteFill style={{ background: `rgba(11,18,48,${0.9 * Math.min(1, (t - end) / 0.3)})`, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
          <Img src={staticFile("day1/solve-by-sunrise.png")} style={{ width: 300, height: 300, borderRadius: 150, transform: `scale(${endP})` }} />
          <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, color: CREAM, opacity: endP }}>Solve by Sunrise</div>
          <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 38, color: GOLD, opacity: endP }}>One riddle a day · answer tomorrow</div>
        </AbsoluteFill>
      ) : null}
      <Audio src={staticFile("day1/solution-mix.m4a")} />
    </AbsoluteFill>
  );
};

function W17() {
  const k = LINES[0].tokens.find((x) => /seventeen/i.test(x[0]));
  return k ? k[1] : 1.6;
}
