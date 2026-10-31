import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing, Audio } from "remotion";
import data from "./sadqah-timing.json";
import { tw, pop, clamp, OUT, prng } from "../kids/kit";

type Tok = [string, number, number];
type Line = { id: string; start: number; end: number; tokens: Tok[] };
const LINES = data.lines as unknown as Line[];
export const SADQAH_DUR = data.total as number;
const S = (i: number) => LINES[i].start;
const E = (i: number) => LINES[i].end;

const GOLD = "#e9c46a";
const CREAM = "#fff3dc";
const DEEP = "#0a3a28";
const NASTA = "'Noto Nastaliq Urdu', serif";
const MONT = "Montserrat, sans-serif";

const rs = prng(7);
const DUST = Array.from({ length: 46 }, () => ({ x: rs() * 1080, y: rs() * 1920, r: 1.5 + rs() * 3.5, v: 8 + rs() * 22, p: rs() * 6.28 }));

const star8 = (cx: number, cy: number, r: number) => {
  const s = r / Math.SQRT2;
  return (
    <g>
      <rect x={cx - s} y={cy - s} width={2 * s} height={2 * s} />
      <rect x={cx - s} y={cy - s} width={2 * s} height={2 * s} transform={`rotate(45 ${cx} ${cy})`} />
    </g>
  );
};

const Background: React.FC<{ t: number }> = ({ t }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="bgG" cx="50%" cy="34%" r="80%">
        <stop offset="0" stopColor="#1f8a5c" />
        <stop offset="0.55" stopColor="#0f5a3c" />
        <stop offset="1" stopColor="#062519" />
      </radialGradient>
      <radialGradient id="glowG"><stop offset="0" stopColor="#fff3c4" stopOpacity={0.9} /><stop offset="1" stopColor="#ffd27a" stopOpacity={0} /></radialGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#bgG)" />
    <g fill="none" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={5} transform={`rotate(${t * 3} 540 760)`}>{star8(540, 760, 520)}</g>
    <g fill="none" stroke="#ffffff" strokeOpacity={0.04} strokeWidth={4} transform={`rotate(${-t * 2} 540 760)`}>{star8(540, 760, 760)}</g>
    {DUST.map((d, i) => {
      const y = (d.y - t * d.v + 1920 * 4) % 1920;
      return <circle key={i} cx={d.x + 12 * Math.sin(t * 0.6 + d.p)} cy={y} r={d.r} fill={GOLD} opacity={0.18 + 0.2 * Math.sin(t * 1.4 + d.p)} />;
    })}
  </svg>
);

/* ---------- small drawing helpers ---------- */
const Faceless: React.FC<{ x: number; y: number; s?: number; robe?: string; flip?: boolean; armUp?: number; bob?: number }> = ({ x, y, s = 1, robe = "#c9d6c3", flip = false, armUp = 0, bob = 0 }) => (
  <g transform={`translate(${x},${y - bob}) scale(${flip ? -s : s},${s})`}>
    <ellipse cx={0} cy={4} rx={46} ry={9} fill="#000" opacity={0.18} />
    <g transform={`translate(30,-176) rotate(${-armUp})`}><rect x={-9} y={-9} width={18} height={84} rx={9} fill={robe} /><circle cy={80} r={11} fill="#e2b48e" /></g>
    <path d="M -38 -190 Q -46 -90 -50 0 L 50 0 Q 46 -90 38 -190 Q 0 -206 -38 -190 Z" fill={robe} />
    <circle cx={0} cy={-226} r={36} fill="#e2b48e" />
    <path d="M -38 -236 Q 0 -280 38 -236 L 40 -222 L -40 -222 Z" fill="#fbfbf5" />
  </g>
);

const Coin: React.FC<{ t: number; x: number; y: number; r: number; strike: number }> = ({ t, x, y, r, strike }) => {
  const sx = Math.cos(t * 5.2);
  return (
    <g transform={`translate(${x},${y})`}>
      <g transform={`scale(${Math.max(0.12, Math.abs(sx))},1)`}>
        <circle r={r} fill="#d9a93c" stroke="#a8781e" strokeWidth={10} />
        <circle r={r * 0.78} fill="none" stroke="#f3d27a" strokeWidth={6} />
        <text y={r * 0.2} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={r * 0.62} fill="#8a5f12">Rs</text>
      </g>
      <line x1={-r * 1.25} y1={-r * 1.25} x2={-r * 1.25 + 2.5 * r * strike} y2={-r * 1.25 + 2.5 * r * strike} stroke="#ff5a4e" strokeWidth={26} strokeLinecap="round" />
    </g>
  );
};

/* ---------- scenes (all drawn in a 1080 x 820 box placed at y=360) ---------- */
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const n = Math.min(5, Math.floor(interpolate(t, [0, 1.15], [0, 5.99], clamp)));
  const lock = pop(t, 1.15, 0.5);
  const strikeAt = LINES[0].tokens[5] ? LINES[0].tokens[5][1] : 2.2;
  return (
    <g>
      <circle cx={540} cy={330} r={300 + 20 * Math.sin(t * 2)} fill="url(#glowG)" opacity={0.35} />
      <text x={540} y={470} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={360 + 60 * lock * (1 - lock)} fill={CREAM} stroke={DEEP} strokeWidth={14} paintOrder="stroke">{n}</text>
      <text x={540} y={600} textAnchor="middle" fontFamily={NASTA} fontWeight={700} fontSize={84} fill={GOLD} opacity={lock}>صدقے</text>
      <Coin t={t} x={540} y={760} r={70} strike={tw(t, strikeAt, 0.4, 0, 1)} />
    </g>
  );
};

const INSAAN = (() => { const k = LINES[1].tokens.findIndex((x) => x[0].includes("انسان")); return k >= 0 ? LINES[1].tokens[k][1] : LINES[1].start + 3; })();
const Sunrise: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const u = t - t0;
  const fig = pop(t, INSAAN - 0.15, 0.5);
  const sunY = tw(u, 0, 2.2, 640, 430);
  const joints = [[-34, -176], [34, -176], [-44, -120], [44, -120], [-30, -70], [30, -70], [-18, -10], [18, -10], [0, -190], [0, -150], [0, -100]];
  return (
    <g>
      <circle cx={540} cy={sunY} r={330} fill="url(#glowG)" opacity={0.75} />
      <circle cx={540} cy={sunY} r={130} fill="#ffd27a" />
      <path d="M -40 700 Q 270 600 540 640 Q 820 600 1120 700 L 1120 900 L -40 900 Z" fill="#073020" />
      <g transform={`translate(540,700) scale(${1.6 * fig})`} opacity={fig}>
        <Faceless x={0} y={0} robe="#14402e" />
        {joints.map(([jx, jy], i) => {
          const p = pop(t, INSAAN + 0.4 + i * 0.12, 0.35);
          return <circle key={i} cx={jx} cy={jy} r={7 * p + 2 * p * Math.sin(t * 4 + i)} fill={GOLD} opacity={p} />;
        })}
      </g>
    </g>
  );
};

const Tracker: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {[2, 3, 4, 5, 6].map((li, i) => {
      const on = pop(t, S(li), 0.4);
      const cx = 540 + (i - 2) * 150;
      return (
        <g key={i}>
          <circle cx={cx} cy={40} r={46} fill={on > 0 ? GOLD : "none"} fillOpacity={on} stroke={GOLD} strokeWidth={6} />
          <text x={cx} y={62} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={54} fill={on > 0.5 ? DEEP : GOLD}>{i + 1}</text>
        </g>
      );
    })}
  </g>
);

const Justice: React.FC<{ u: number; t: number }> = ({ u, t }) => {
  const ang = tw(u, 0.3, 1.6, 16, 0, Easing.out(Easing.elastic(1)));
  return (
    <g transform="translate(540,470)">
      <rect x={-12} y={-150} width={24} height={320} rx={10} fill={GOLD} />
      <rect x={-90} y={160} width={180} height={26} rx={10} fill={GOLD} />
      <g transform={`translate(0,-150) rotate(${ang})`}>
        <rect x={-300} y={-10} width={600} height={20} rx={10} fill={GOLD} />
        {[-280, 280].map((px) => (
          <g key={px} transform={`translate(${px},0) rotate(${-ang})`}>
            <path d="M 0 0 L -60 120 M 0 0 L 60 120" stroke={GOLD} strokeWidth={6} />
            <path d="M -90 120 Q 0 170 90 120 Z" fill={GOLD} />
          </g>
        ))}
      </g>
      <Faceless x={-380} y={330} s={0.9} robe="#2f6b8f" />
      <Faceless x={380} y={330} s={0.9} robe="#8f5a2f" flip />
    </g>
  );
};

const Camel: React.FC<{ u: number; t: number }> = ({ u, t }) => {
  const lift = tw(u, 0.6, 1.4, 0, 1);
  const bx = interpolate(lift, [0, 1], [150, 30]);
  const by = interpolate(lift, [0, 0.6, 1], [600, 330, 390]);
  return (
    <g>
      <g transform="translate(560,620)">
        <ellipse cx={0} cy={8} rx={250} ry={22} fill="#000" opacity={0.18} />
        {[-150, -90, 90, 150].map((lx, i) => (
          <rect key={i} x={lx - 14} y={-150} width={28} height={158} rx={12} fill="#c79a5b" transform={`rotate(${3 * Math.sin(t * 1.5 + i)} ${lx} -150)`} />
        ))}
        <path d="M -200 -150 Q -210 -260 -90 -270 Q -40 -380 30 -270 Q 120 -270 170 -200 Q 210 -150 170 -130 L -190 -130 Z" fill="#d8aa69" />
        <path d="M 160 -210 Q 230 -250 250 -360 Q 262 -400 300 -396 Q 340 -392 330 -360 Q 300 -350 290 -320 Q 270 -240 190 -170 Z" fill="#d8aa69" />
        <circle cx={316} cy={-376} r={6} fill="#5a3d1e" />
        <path d="M -40 -262 L 60 -262 L 70 -240 L -50 -240 Z" fill="#b83a3a" />
      </g>
      <Faceless x={300} y={640} s={1.05} robe="#3f7f66" armUp={interpolate(lift, [0, 1], [10, 150])} />
      <g transform={`translate(${bx + 260},${by})`}>
        <rect x={-62} y={-50} width={124} height={92} rx={16} fill="#7a4f2a" stroke="#4d3018" strokeWidth={6} />
        <rect x={-62} y={-14} width={124} height={14} fill="#4d3018" />
      </g>
    </g>
  );
};

const GoodWord: React.FC<{ u: number; t: number }> = ({ u, t }) => {
  const p = pop(u, 0.2, 0.5);
  return (
    <g>
      <Faceless x={250} y={720} s={1.2} robe="#5e8f3f" />
      <Faceless x={850} y={720} s={1.2} robe="#8f3f6b" flip />
      <g transform={`translate(560,330) scale(${p})`}>
        <path d="M -260 -170 Q -260 -220 -210 -220 L 210 -220 Q 260 -220 260 -170 L 260 90 Q 260 140 210 140 L -90 140 L -170 220 L -150 140 L -210 140 Q -260 140 -260 90 Z" fill={CREAM} stroke={GOLD} strokeWidth={10} />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const q = pop(u, 0.6 + i * 0.12, 0.4);
          return <ellipse key={i} cx={0} cy={-90} rx={34 * q} ry={70 * q} fill="#e86a8a" transform={`rotate(${i * 60 + t * 20} 0 -40)`} />;
        })}
        <circle cx={0} cy={-40} r={34 * pop(u, 1.3, 0.4)} fill={GOLD} />
        <path d="M 0 10 Q -10 70 0 110" stroke="#3f8f4f" strokeWidth={12} fill="none" opacity={pop(u, 0.5, 0.4)} />
      </g>
    </g>
  );
};

const Steps: React.FC<{ u: number; t: number }> = ({ u, t }) => {
  const steps = 8;
  return (
    <g>
      <g transform="translate(820,160)">
        <path d="M -150 420 L -150 120 Q -150 -10 0 -60 Q 150 -10 150 120 L 150 420 Z" fill="#0a3a28" stroke={GOLD} strokeWidth={12} />
        <path d="M -70 420 L -70 200 Q -70 130 0 105 Q 70 130 70 200 L 70 420 Z" fill="#ffe7a8" opacity={0.85 + 0.15 * Math.sin(t * 3)} />
        <path d="M -40 -64 Q 0 -150 40 -64 Z" fill={GOLD} />
        <line x1={0} y1={-150} x2={0} y2={-190} stroke={GOLD} strokeWidth={8} />
      </g>
      {Array.from({ length: steps }, (_, i) => {
        const p = pop(u, 0.25 + i * 0.32, 0.3);
        const x = 120 + i * 82;
        const y = 760 - i * 28 + (i % 2 ? -36 : 36);
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${-70}) scale(${p})`} opacity={p}>
            <ellipse cx={0} cy={0} rx={22} ry={36} fill={CREAM} />
            {[-14, -5, 4, 13].map((tx, k) => <circle key={k} cx={tx} cy={-44} r={6} fill={CREAM} />)}
            <text x={0} y={-80} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={40} fill={GOLD} transform="rotate(70)" opacity={interpolate(u - 0.25 - i * 0.32, [0, 0.2, 0.7, 1], [0, 1, 1, 0], clamp)}>+1</text>
          </g>
        );
      })}
    </g>
  );
};

const RemoveHarm: React.FC<{ u: number; t: number }> = ({ u, t }) => {
  const pick = tw(u, 0.9, 1.2, 0, 1);
  const glow = tw(u, 1.8, 0.8, 0, 1);
  return (
    <g>
      <path d="M 380 820 L 700 820 L 620 200 L 460 200 Z" fill="#c9b48a" />
      <path d="M 380 820 L 700 820 L 620 200 L 460 200 Z" fill={GOLD} opacity={0.45 * glow} />
      <g transform={`translate(${interpolate(pick, [0, 1], [540, 860])},${interpolate(pick, [0, 0.5, 1], [600, 420, 470])}) rotate(${pick * 90})`}>
        <path d="M -70 30 Q -80 -30 -20 -50 Q 50 -64 74 -10 Q 90 40 30 52 Q -40 62 -70 30 Z" fill="#6f6a63" stroke="#4a4640" strokeWidth={6} />
        {[-50, -10, 30].map((sx, i) => <path key={i} d={`M ${sx} -40 l 10 -30 l 10 30`} fill="#4a4640" />)}
      </g>
      <Faceless x={260} y={760} s={1.15} robe="#2f5f8f" armUp={interpolate(pick, [0, 0.4, 1], [10, 120, 60])} />
      {glow > 0 ? [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={420 + i * 60} cy={250 + ((t * 120 + i * 90) % 560)} r={6} fill={CREAM} opacity={0.6 * glow} />) : null}
    </g>
  );
};

const Payoff: React.FC<{ u: number; t: number }> = ({ u, t }) => {
  const a = pop(u, 0.2, 0.45), b = pop(u, 1.4, 0.45), c = pop(u, 1.9, 0.45);
  return (
    <g>
      <g transform={`translate(270,420) scale(${a})`}>
        <path d="M -140 -120 L 140 -120 L 120 120 Q 0 190 -120 120 Z" fill="#4c6b8a" stroke="#2c4a66" strokeWidth={10} />
        <path d="M -140 -120 Q 0 -40 140 -120" fill="none" stroke="#2c4a66" strokeWidth={10} />
        <line x1={-170} y1={-170} x2={170} y2={170} stroke="#ff5a4e" strokeWidth={22} strokeLinecap="round" opacity={pop(u, 0.8, 0.3)} />
        <text y={270} textAnchor="middle" fontFamily={NASTA} fontWeight={700} fontSize={56} fill={CREAM}>جیب</text>
      </g>
      <g transform={`translate(620,420) scale(${b})`}>
        <circle r={150} fill="url(#glowG)" opacity={0.6 + 0.2 * Math.sin(t * 3)} />
        <path d="M -90 60 Q -110 -40 -70 -120 M -50 70 Q -60 -40 -30 -140 M -10 70 Q -10 -40 10 -140 M 30 70 Q 40 -30 60 -110 M -100 60 Q 0 140 80 40 Q 120 -10 140 -40" stroke={CREAM} strokeWidth={24} strokeLinecap="round" fill="none" />
        <text y={270} textAnchor="middle" fontFamily={NASTA} fontWeight={700} fontSize={56} fill={GOLD}>ہاتھ</text>
      </g>
      <g transform={`translate(890,420) scale(${c})`}>
        <circle r={140} fill="url(#glowG)" opacity={0.6 + 0.2 * Math.sin(t * 3 + 1)} />
        <path d="M -110 -70 Q -110 -110 -70 -110 L 70 -110 Q 110 -110 110 -70 L 110 30 Q 110 70 70 70 L -20 70 L -70 120 L -60 70 L -70 70 Q -110 70 -110 30 Z" fill={CREAM} />
        <path d="M -50 -30 L -10 10 L 60 -60" stroke={GOLD} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text y={270} textAnchor="middle" fontFamily={NASTA} fontWeight={700} fontSize={56} fill={GOLD}>زبان</text>
      </g>
    </g>
  );
};

const Share: React.FC<{ u: number; t: number }> = ({ u, t }) => {
  const fly = tw(u, 0.6, 1.2, 0, 1, Easing.inOut(Easing.cubic));
  const plus = pop(u, 1.9, 0.5);
  return (
    <g>
      <g transform="translate(300,460)">
        <rect x={-120} y={-230} width={240} height={460} rx={40} fill="#0a2a1d" stroke={CREAM} strokeWidth={10} />
        <rect x={-96} y={-190} width={192} height={360} rx={16} fill="#1f8a5c" />
        <image href={staticFile("day1/one-more-sadqah.png")} x={-70} y={-150} width={140} height={140} clipPath="circle(70px at 70px 70px)" />
        <g transform="translate(0,90)"><circle cx={-40} cy={0} r={16} fill={CREAM} /><circle cx={40} cy={-40} r={16} fill={CREAM} /><circle cx={40} cy={40} r={16} fill={CREAM} /><path d="M -40 0 L 40 -40 M -40 0 L 40 40" stroke={CREAM} strokeWidth={8} /></g>
      </g>
      <g transform={`translate(${interpolate(fly, [0, 1], [300, 760])},${interpolate(fly, [0, 0.5, 1], [460, 260, 400])}) rotate(${fly * 20})`} opacity={fly > 0 && fly < 1 ? 1 : fly >= 1 ? 0 : 0}>
        <path d="M -60 20 L 60 -30 L 20 70 L 5 25 Z" fill={GOLD} />
      </g>
      <Faceless x={800} y={640} s={1.1} robe="#8f6b3f" flip bob={plus > 0 ? 12 * Math.abs(Math.sin(t * 6)) * (1 - Math.min(1, (u - 1.9) / 1.2)) : 0} />
      <g transform={`translate(800,250) scale(${plus})`}>
        <circle r={110} fill={GOLD} />
        <text y={40} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={110} fill={DEEP}>+1</text>
      </g>
    </g>
  );
};

/* ---------- captions (Urdu, word by word) ---------- */
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const line = LINES.find((l) => t >= l.start - 0.15 && t <= l.end + 0.35);
  if (!line) return null;
  const o = interpolate(t, [line.start - 0.15, line.start, line.end + 0.15, line.end + 0.35], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1214, height: 320, display: "flex", alignItems: "center", justifyContent: "center", opacity: o }}>
      <div dir="rtl" style={{ fontFamily: NASTA, fontWeight: 700, fontSize: 60, lineHeight: 2.05, textAlign: "center", color: CREAM, textShadow: "0 4px 0 rgba(0,0,0,0.35)" }}>
        {line.tokens.map(([w, a], i) => {
          const on = t >= a - 0.02;
          const k = pop(t, a - 0.02, 0.3);
          return (
            <span key={i} style={{ display: "inline-block", margin: "0 9px", color: on ? (w.includes("صدق") ? GOLD : CREAM) : "rgba(255,243,220,0.35)", transform: `translateY(${(1 - k) * 10}px)` }}>{w}</span>
          );
        })}
      </div>
    </div>
  );
};

const RefTag: React.FC<{ t: number }> = ({ t }) => {
  const o = interpolate(t, [S(1), S(1) + 0.4, E(6) + 0.2, E(6) + 0.6], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 304, left: 0, right: 0, textAlign: "center", opacity: o }}>
      <span dir="rtl" style={{ fontFamily: NASTA, fontSize: 34, color: DEEP, background: GOLD, borderRadius: 40, padding: "4px 26px 14px" }}>صحیح بخاری ۲۹۸۹ · صحیح مسلم ۱۰۰۹</span>
    </div>
  );
};

const Header: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", top: 222, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: tw(t, 0, 0.3, 0.85, 1) }}>
    <Img src={staticFile("day1/one-more-sadqah.png")} style={{ width: 70, height: 70, borderRadius: 35 }} />
    <span style={{ fontFamily: MONT, fontWeight: 700, fontSize: 34, color: CREAM, letterSpacing: "0.04em" }}>ONE MORE SADQAH</span>
  </div>
);

const EndCard: React.FC<{ t: number }> = ({ t }) => {
  const at = E(8) + 0.2;
  const p = pop(t, at, 0.5);
  if (t < at) return null;
  return (
    <AbsoluteFill style={{ background: `rgba(6,37,25,${0.88 * Math.min(1, (t - at) / 0.3)})`, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
      <Img src={staticFile("day1/one-more-sadqah.png")} style={{ width: 300, height: 300, borderRadius: 150, transform: `scale(${p})` }} />
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, color: CREAM, opacity: p }}>One More Sadqah</div>
      <div dir="rtl" style={{ fontFamily: NASTA, fontSize: 40, color: GOLD, opacity: p }}>صحیح بخاری ۲۹۸۹ · صحیح مسلم ۱۰۰۹</div>
      <div style={{ fontFamily: MONT, fontSize: 30, color: CREAM, opacity: 0.8 * p }}>sunnah.com/bukhari:2989</div>
    </AbsoluteFill>
  );
};

export const SadqahShort: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const scene = (i: number, el: (u: number) => React.ReactNode, next: number) => {
    const a = i === 0 ? 0 : S(i) - 0.2;
    const b = next;
    if (t < a - 0.3 || t > b + 0.3) return null;
    const o = i === 0 ? interpolate(t, [b - 0.1, b + 0.25], [1, 0], clamp) : interpolate(t, [a - 0.1, a + 0.25, b - 0.1, b + 0.25], [0, 1, 1, 0], clamp);
    const s = i === 0 ? 1 : interpolate(t, [a - 0.1, a + 0.4], [0.94, 1], { ...clamp, easing: OUT });
    return <g opacity={o} transform={`translate(540,410) scale(${s}) translate(-540,-410)`}>{el(t - a)}</g>;
  };
  const end = E(8) + 0.2;
  return (
    <AbsoluteFill style={{ background: DEEP }}>
      <Background t={t} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="glowG"><stop offset="0" stopColor="#fff3c4" stopOpacity={0.9} /><stop offset="1" stopColor="#ffd27a" stopOpacity={0} /></radialGradient>
        </defs>
        <g transform="translate(43,388) scale(0.92)">
          {scene(0, () => <Hook t={t} />, S(1) - 0.2)}
          {scene(1, (u) => <Sunrise t={t} t0={t - u} />, S(2) - 0.2)}
          {t > S(2) - 0.4 && t < E(6) + 0.4 ? <g opacity={interpolate(t, [S(2) - 0.4, S(2), E(6) + 0.1, E(6) + 0.4], [0, 1, 1, 0], clamp)}><Tracker t={t} /></g> : null}
          <g transform="translate(0,90)">
            {scene(2, (u) => <Justice u={u} t={t} />, S(3) - 0.2)}
            {scene(3, (u) => <Camel u={u} t={t} />, S(4) - 0.2)}
            {scene(4, (u) => <GoodWord u={u} t={t} />, S(5) - 0.2)}
            {scene(5, (u) => <Steps u={u} t={t} />, S(6) - 0.2)}
            {scene(6, (u) => <RemoveHarm u={u} t={t} />, S(7) - 0.2)}
          </g>
          {scene(7, (u) => <Payoff u={u} t={t} />, S(8) - 0.2)}
          {scene(8, (u) => <Share u={u} t={t} />, end)}
        </g>
      </svg>
      <Header t={t} />
      <RefTag t={t} />
      <Captions t={t} />
      <EndCard t={t} />
      <Audio src={staticFile("day1/sadqah-mix.m4a")} />
    </AbsoluteFill>
  );
};
