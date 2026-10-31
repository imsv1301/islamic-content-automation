import React from "react";
import { interpolate } from "remotion";
import { Ball, Bubble, BALOO, Defs, Kid, Lantern, NUN, PopText, S, SC, Stars, WT, clamp, fadeIO, pop, prng, tw, useT, INO } from "./kit";

const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080 };

/* ============================ INTRO ============================ */
export const NightSky: React.FC<{ t: number; lanterns?: boolean }> = ({ t, lanterns = true }) => (
  <svg viewBox="0 0 1920 1080" style={full}>
    <Defs />
    <defs>
      <linearGradient id="nightG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#151a44" /><stop offset="60%" stopColor="#35296b" /><stop offset="100%" stopColor="#6b3f78" /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#nightG)" />
    <Stars t={t} />
    <g transform="translate(1560,190)">
      <circle r={150} fill="url(#softGlow)" opacity={0.5} />
      <path d="M 40 -70 A 80 80 0 1 0 40 70 A 64 64 0 1 1 40 -70 Z" fill="#fff1c1" />
    </g>
    <path d="M 0 960 Q 300 900 620 950 T 1300 940 T 1920 930 L 1920 1080 L 0 1080 Z" fill="#251b4a" />
    <g fill="#1b1438">
      <rect x={240} y={830} width={160} height={140} /><path d="M 230 830 Q 320 740 410 830 Z" />
      <rect x={1420} y={800} width={210} height={170} /><path d="M 1410 800 Q 1525 690 1640 800 Z" />
      <rect x={1660} y={700} width={26} height={270} /><path d="M 1652 700 L 1673 640 L 1694 700 Z" />
    </g>
    {lanterns ? (
      <g>
        <Lantern x={180} t={t} len={160} phase={0} />
        <Lantern x={520} t={t} len={90} phase={1.2} color="#ff9e6b" s={0.85} />
        <Lantern x={1380} t={t} len={120} phase={2.1} color="#9fe0c8" s={0.9} />
        <Lantern x={1760} t={t} len={200} phase={0.6} color="#ffcf5a" s={0.8} />
      </g>
    ) : null}
  </svg>
);

export const Intro: React.FC = () => {
  const t = useT(); // absolute time (scene starts at 0)
  const clueAt = S("l03"), truthAt = WT("l04", "truth");
  const titleUp = tw(t, clueAt - 0.2, 0.7, 0, 1, INO);
  const zoom = interpolate(t, [S("l04b"), SC("intro").end], [1, 1.12], clamp);
  return (
    <div style={{ ...full, overflow: "hidden" }}>
      <div style={{ ...full, scale: String(zoom) }}>
        <NightSky t={t} />
        <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(titleUp, [0, 1], [300, 30]), textAlign: "center", scale: String(1 - 0.35 * titleUp) }}>
          <PopText text="Story Time" t={t} at={0.4} size={170} color="#ffd34d" />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(titleUp, [0, 1], [530, 300]), textAlign: "center", fontFamily: NUN, fontWeight: 900, fontSize: 56, color: "#fff4dc",
          opacity: tw(t, 1.7, 0.5, 0, 1), translate: `0px ${tw(t, 1.7, 0.5, 20, 0)}px` }}>
          Episode 1 · The Truthful One
        </div>
        {/* word puzzle */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", gap: 28, opacity: tw(t, clueAt + 0.3, 0.4, 0, 1) }}>
          {"TRUTH".split("").map((c, i) => {
            const at = truthAt + i * 0.09;
            const flip = tw(t, at, 0.35, 0, 1);
            return (
              <div key={i} style={{ width: 170, height: 200, borderRadius: 30, background: flip > 0.5 ? "#ffd34d" : "#ffffff", border: "8px solid #2b2340",
                display: "flex", alignItems: "center", justifyContent: "center", transform: `rotateY(${(1 - Math.abs(flip - 0.5) * 2) * 90}deg) translateY(${-pop(t, at, 0.5) * 18 + 18 * Math.min(1, flip)}px)`,
                boxShadow: "0 14px 0 rgba(0,0,0,0.25)", scale: String(pop(t, clueAt + 0.3 + i * 0.07, 0.4)) }}>
                <span style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 150, color: "#2b2340", lineHeight: 1 }}>{flip > 0.5 ? c : "?"}</span>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: NUN, fontWeight: 800, fontSize: 50, color: "#fff4dc",
          opacity: fadeIO(t, WT("l03", "clue"), truthAt, 0.3) }}>
          Clue: your tongue can do it every single day!
        </div>
        <Sparkle t={t} at={truthAt + 0.4} x={960} y={520} n={26} />
      </div>
    </div>
  );
};

/** burst of sparkles */
export const Sparkle: React.FC<{ t: number; at: number; x: number; y: number; n?: number; color?: string; spread?: number }> = ({ t, at, x, y, n = 18, color = "#ffe27a", spread = 420 }) => {
  if (t < at || t > at + 1.6) return null;
  const u = (t - at) / 1.6;
  const r = prng(Math.round(at * 100));
  return (
    <svg viewBox="0 0 1920 1080" style={{ ...full, pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + r() * 0.4, d = spread * (0.4 + 0.6 * r()) * (1 - Math.pow(1 - u, 3));
        const s = (1 - u) * (10 + r() * 14);
        const cx = x + Math.cos(a) * d, cy = y + Math.sin(a) * d + 120 * u * u;
        return <path key={i} transform={`translate(${cx},${cy}) rotate(${u * 180 + i * 20}) scale(${s / 10})`} d="M 0 -10 L 3 -3 L 10 0 L 3 3 L 0 10 L -3 3 L -10 0 L -3 -3 Z" fill={i % 3 ? color : "#ffffff"} opacity={1 - u * 0.7} />;
      })}
    </svg>
  );
};

/* ============================ HOME ============================ */
const RAIN = (() => { const r = prng(7); return Array.from({ length: 70 }, () => ({ x: r() * 420, y: r() * 380, sp: 600 + r() * 500, l: 18 + r() * 22 })); })();

const LivingRoom: React.FC<{ t: number; vaseOn: boolean; vaseAng: number; vaseX: number; vaseY: number; clockSpeed: number; ruleAt: number }> = ({ t, vaseOn, vaseAng, vaseX, vaseY, clockSpeed, ruleAt }) => (
  <svg viewBox="0 0 1920 1080" style={full}>
    <defs>
      <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffe9c9" /><stop offset="100%" stopColor="#ffd6a8" /></linearGradient>
      <linearGradient id="skyRain" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7b8ea8" /><stop offset="100%" stopColor="#a9b9cc" /></linearGradient>
      <clipPath id="winClip"><rect x={170} y={170} width={440} height={400} rx={10} /></clipPath>
    </defs>
    <rect width={1920} height={1080} fill="url(#wallG)" />
    {Array.from({ length: 13 }, (_, i) => Array.from({ length: 7 }, (_, j) => <circle key={`${i}-${j}`} cx={80 + i * 150 + (j % 2) * 75} cy={60 + j * 120} r={6} fill="#f2c28e" opacity={0.6} />))}
    {/* floor */}
    <rect y={860} width={1920} height={220} fill="#c98b55" />
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={0} y1={880 + i * 26} x2={1920} y2={880 + i * 26} stroke="#b0763f" strokeWidth={3} opacity={0.6} />)}
    <rect y={846} width={1920} height={18} fill="#a86a38" />
    <ellipse cx={820} cy={960} rx={420} ry={60} fill="#e86f5c" opacity={0.85} />
    <ellipse cx={820} cy={960} rx={340} ry={44} fill="none" stroke="#ffd28a" strokeWidth={8} />
    {/* window with rain */}
    <rect x={150} y={150} width={480} height={440} rx={18} fill="#fff" />
    <rect x={170} y={170} width={440} height={400} rx={10} fill="url(#skyRain)" />
    <g clipPath="url(#winClip)">
      <path d="M 170 470 Q 300 420 420 460 T 610 440 L 610 570 L 170 570 Z" fill="#6d7f95" />
      {RAIN.map((d, i) => {
        const y = 170 + ((d.y + t * d.sp) % 420) - 20;
        return <line key={i} x1={170 + d.x} y1={y} x2={170 + d.x - 6} y2={y + d.l} stroke="#e8f1ff" strokeWidth={3} opacity={0.7} />;
      })}
    </g>
    <rect x={386} y={170} width={8} height={400} fill="#fff" /><rect x={170} y={366} width={440} height={8} fill="#fff" />
    <path d="M 120 140 Q 160 380 110 610 L 190 610 Q 210 380 180 140 Z" fill="#5fb3a3" /><path d="M 660 140 Q 620 380 670 610 L 590 610 Q 570 380 600 140 Z" fill="#5fb3a3" />
    <rect x={110} y={126} width={560} height={20} rx={10} fill="#8a5a3c" />
    {/* rule sign */}
    <g transform={`translate(1310,190) scale(${pop(t, ruleAt, 0.5)})`}>
      <rect x={-200} y={-90} width={400} height={180} rx={20} fill="#fff" stroke="#8a5a3c" strokeWidth={12} />
      <text x={40} y={-14} textAnchor="middle" fontFamily={BALOO} fontWeight={800} fontSize={46} fill="#2b2340">NO FOOTBALL</text>
      <text x={40} y={42} textAnchor="middle" fontFamily={BALOO} fontWeight={800} fontSize={46} fill="#e0473f">INSIDE!</text>
      <g transform="translate(-140,0)"><Ball x={0} y={0} r={40} /><circle r={52} fill="none" stroke="#e0473f" strokeWidth={10} /><line x1={-36} y1={-36} x2={36} y2={36} stroke="#e0473f" strokeWidth={10} /></g>
    </g>
    {/* clock */}
    <g transform="translate(930,190)">
      <circle r={86} fill="#fff" stroke="#8a5a3c" strokeWidth={12} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-66} x2={0} y2={-56} stroke="#2b2340" strokeWidth={5} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={0} x2={0} y2={-44} stroke="#2b2340" strokeWidth={8} strokeLinecap="round" transform={`rotate(${t * 6 * clockSpeed})`} />
      <line x1={0} y1={0} x2={0} y2={-62} stroke="#e0473f" strokeWidth={5} strokeLinecap="round" transform={`rotate(${t * 72 * clockSpeed})`} />
      <circle r={8} fill="#2b2340" />
    </g>
    {/* kitchen doorway */}
    <rect x={1640} y={330} width={240} height={530} rx={14} fill="#fff4c9" />
    <rect x={1640} y={330} width={240} height={530} rx={14} fill="none" stroke="#8a5a3c" strokeWidth={14} />
    <rect x={1700} y={560} width={150} height={20} fill="#e7d39a" /><rect x={1700} y={600} width={150} height={20} fill="#e7d39a" />
    {/* side table + vase */}
    <rect x={1210} y={700} width={200} height={20} rx={8} fill="#8a5a3c" />
    <rect x={1230} y={720} width={16} height={130} fill="#8a5a3c" /><rect x={1374} y={720} width={16} height={130} fill="#8a5a3c" />
    {vaseOn ? <Vase x={vaseX} y={vaseY} ang={vaseAng} /> : null}
    {/* sofa */}
    <g transform="translate(240,640)">
      <rect x={0} y={60} width={420} height={170} rx={40} fill="#6c7fd8" />
      <rect x={-20} y={30} width={70} height={210} rx={34} fill="#5a6cc4" /><rect x={370} y={30} width={70} height={210} rx={34} fill="#5a6cc4" />
      <rect x={30} y={-10} width={360} height={120} rx={40} fill="#7d90e6" />
    </g>
  </svg>
);

export const Vase: React.FC<{ x: number; y: number; ang: number }> = ({ x, y, ang }) => (
  <g transform={`translate(${x},${y}) rotate(${ang})`}>
    <path d="M -22 0 Q -46 -40 -30 -80 Q -18 -104 -16 -126 L 16 -126 Q 18 -104 30 -80 Q 46 -40 22 0 Z" fill="#4a8fe0" stroke="#2b5aa0" strokeWidth={4} />
    <path d="M -38 -60 Q 0 -44 38 -60" stroke="#ffd34d" strokeWidth={8} fill="none" />
    <path d="M -20 -126 L 20 -126 L 24 -138 L -24 -138 Z" fill="#2b5aa0" />
    <path d="M -8 -138 Q -20 -190 -50 -200 M 4 -138 Q 6 -200 30 -214 M 0 -138 Q 30 -170 54 -176" stroke="#4f9a54" strokeWidth={6} fill="none" />
    <circle cx={-50} cy={-200} r={14} fill="#ff8fb1" /><circle cx={30} cy={-214} r={14} fill="#ffd34d" /><circle cx={54} cy={-176} r={13} fill="#ff8fb1" />
  </g>
);

const SHARDS = (() => { const r = prng(21); return Array.from({ length: 12 }, () => ({ dx: (r() - 0.5) * 420, dy: -60 - r() * 90, rot: (r() - 0.5) * 720, s: 0.6 + r() * 0.9, c: r() > 0.3 ? "#4a8fe0" : "#ffd34d" })); })();

export const Home: React.FC = () => {
  const t = useT();
  const sc = SC("home");
  const yx = interpolate(t, [sc.start + 0.3, sc.start + 2.6], [-200, 760], { ...clamp, easing: INO });
  const walking = t > sc.start + 0.3 && t < sc.start + 2.6;
  const ph = t * 9;
  const K0 = S("l09") - 1.45, H = K0 + 0.55, C = H + 0.62;
  // keepy-uppy during l05 tail
  const kuA = WT("l05", "loves"), kuB = S("l06") - 0.2;
  const keepy = t > kuA && t < kuB;
  const kup = keepy ? Math.abs(Math.sin((t - kuA) * Math.PI * 1.6)) : 0;
  // ball position
  let bx = 860, by = 880, brot = 0;
  if (keepy) { by = 880 - 230 * kup; brot = (t - kuA) * 300; }
  if (t < kuA) { bx = yx + 80; brot = t * 400; }
  if (t >= K0 && t < H) { const u = (t - K0) / (H - K0); bx = 860 + (1300 - 860) * u; by = 880 - 4 * 260 * u * (1 - u) - (880 - 640) * u; brot = u * 720; }
  if (t >= H) { const u = Math.min(1, (t - H) / 1.2); bx = 1300 - 380 * u; const b = Math.abs(Math.sin(u * Math.PI * 2.5)) * (1 - u); by = 880 - 180 * b; brot = 720 - u * 900; }
  // vase
  let vAng = 0, vY = 700, vX = 1320;
  if (t >= H && t < H + 0.25) vAng = 10 * Math.sin((t - H) * 60);
  if (t >= H + 0.25 && t < C) { const u = (t - H - 0.25) / (C - H - 0.25); vAng = 95 * u * u; vY = 700 + 160 * u * u; vX = 1320 + 60 * u; }
  const vaseOn = t < C;
  // Yusuf pose
  let pose = { armL: 10 + (walking ? 25 * Math.sin(ph) : 0), armR: -10 - (walking ? 25 * Math.sin(ph) : 0), legL: walking ? 22 * Math.sin(ph) : 0, legR: walking ? -22 * Math.sin(ph) : 0, tilt: 0, lean: 0 };
  if (keepy) pose = { ...pose, legR: 40 * kup, armL: 40, armR: -40 };
  const bored = t > S("l07") && t < S("l08");
  if (bored) pose = { ...pose, armL: 4, armR: -4, tilt: 14 };
  if (t > K0 - 0.35 && t < K0) pose = { ...pose, legR: -35, armL: 30, armR: -30 };
  if (t >= K0 && t < K0 + 0.4) pose = { ...pose, legR: 70, armL: -30, armR: 40, lean: -4 };
  const shock = t > S("l09") - 0.1;
  if (shock) pose = { ...pose, armL: 160, armR: -160, legL: 0, legR: 0, lean: 0, tilt: 0 };
  const lookRain = t > WT("l08", "rain") - 0.1 && t < WT("l08", "thought");
  const jolt = t > WT("l11", "yusuf", 1) && t < WT("l11", "yusuf", 1) + 0.35 ? 26 * Math.sin((t - WT("l11", "yusuf", 1)) / 0.35 * Math.PI) : 0;
  const bob = walking ? 6 * Math.abs(Math.sin(ph)) : 3 * Math.sin(t * 2);
  // camera
  const camS = interpolate(t, [S("l10") - 0.2, S("l10") + 0.6, S("l11") - 0.2, S("l11") + 0.4], [1, 1.25, 1.25, 1], { ...clamp, easing: INO });
  const camX = interpolate(t, [S("l10") - 0.2, S("l10") + 0.6, S("l11") - 0.2, S("l11") + 0.4], [0, -260, -260, 0], { ...clamp, easing: INO });
  const camY = interpolate(t, [S("l10") - 0.2, S("l10") + 0.6, S("l11") - 0.2, S("l11") + 0.4], [0, -120, -120, 0], { ...clamp, easing: INO });
  const camQ = interpolate(t, [S("l14"), S("l14") + 1.2], [1, 1.08], clamp);
  const thumps = [0, 1, 2].map((k) => WT("l12", "thump", k));
  const heart = thumps.reduce((acc, at) => Math.max(acc, t >= at && t < at + 0.4 ? 1 - (t - at) / 0.4 : 0), 0);
  const shake = t >= C && t < C + 0.35 ? 10 * Math.sin((t - C) * 90) * (1 - (t - C) / 0.35) : 0;
  return (
    <div style={{ ...full, overflow: "hidden" }}>
      <div style={{ ...full, scale: String(camS * camQ), translate: `${camX + shake}px ${camY}px`, transformOrigin: "50% 50%" }}>
        <LivingRoom t={t} vaseOn={vaseOn} vaseAng={vAng} vaseX={vX} vaseY={vY} clockSpeed={bored ? 40 : 1} ruleAt={WT("l06", "rule")} />
        <svg viewBox="0 0 1920 1080" style={full}>
          {t >= C ? SHARDS.map((s, i) => {
            const u = Math.min(1, (t - C) / 0.5);
            const x = 1380 + s.dx * u, y = 868 + s.dy * 4 * u * (1 - u);
            return <path key={i} transform={`translate(${x},${y}) rotate(${s.rot * u}) scale(${s.s})`} d="M -16 0 L 0 -14 L 18 -4 L 8 12 Z" fill={s.c} stroke="#2b5aa0" strokeWidth={2} />;
          }) : null}
          {t >= C ? <g transform="translate(1420,880)"><path d="M -8 -138 Q -30 -170 -60 -160" stroke="#4f9a54" strokeWidth={6} fill="none" /><circle cx={-60} cy={-160} r={0} /></g> : null}
          <Ball x={bx} y={by - 30} r={30} rot={brot} />
          <Kid x={yx} y={880 - jolt} s={1.45} pose={pose} bob={bob} flip={lookRain} />
          {heart > 0 ? <g transform={`translate(${yx},${880 - 175 * 1.45}) scale(${1.2 + heart * 1.0})`}><path d="M 0 18 C -40 -10 -30 -42 0 -26 C 30 -42 40 -10 0 18 Z" fill="#ff4d6d" stroke="#2b2340" strokeWidth={4} /></g> : null}
        </svg>
        {/* labels and bubbles */}
        <div style={{ position: "absolute", left: 600, top: 250, width: 320, textAlign: "center", opacity: fadeIO(t, WT("l05", "meet"), S("l06"), 0.3), scale: String(pop(t, WT("l05", "meet"), 0.5)) }}>
          <div style={{ display: "inline-block", background: "#ffd34d", border: "6px solid #2b2340", borderRadius: 30, padding: "8px 30px", fontFamily: BALOO, fontWeight: 800, fontSize: 64, color: "#2b2340" }}>Yusuf, 7</div>
        </div>
        <Bubble x={900} y={330} w={240} text="..." t={t} at={WT("l07", "bored") } until={S("l08")} thought size={70} />
        <Bubble x={900} y={330} w={520} text="Just one little kick..." t={t} at={WT("l08", "just")} until={K0 - 0.3} thought />
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", opacity: fadeIO(t, S("l09") - 0.05, S("l10") + 0.2, 0.1) }}>
          <PopText text="OH NO!" t={t} at={S("l09") - 0.05} size={190} color="#ff6b5b" stagger={0.04} />
        </div>
        <Bubble x={1360} y={190} w={470} text={<>Yusuf! What was<br />that noise?</>} t={t} at={WT("l11", "yusuf", 1) - 0.1} until={S("l12") + 0.4} tail="right" color="#fff4c9" />
        <Bubble x={170} y={300} w={460} text="It was the cat!" t={t} at={WT("l12", "say")} until={SC("home").end} color="#ffd9d9" />
        <div style={{ position: "absolute", left: 230, top: 290, width: 340, height: 140, opacity: t > S("l13") + 0.3 ? 1 : 0 }}>
          <svg viewBox="0 0 340 140" style={{ width: 340, height: 140 }}><line x1={20} y1={20} x2={320} y2={120} stroke="#e0473f" strokeWidth={16} strokeLinecap="round" opacity={tw(t, S("l13") + 0.3, 0.3, 0, 1)} /></svg>
        </div>
        <Bubble x={1060} y={300} w={460} text={<>Tell the truth <span style={{ color: "#e0473f" }}>&#9829;</span></>} t={t} at={S("l13") + 0.1} until={SC("home").end} color="#d9ffe6" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center", opacity: tw(t, S("l14"), 0.4, 0, 1) }}>
          <span style={{ display: "inline-block", background: "#2b2340", color: "#ffd34d", fontFamily: BALOO, fontWeight: 800, fontSize: 78, padding: "14px 50px", borderRadius: 40, scale: String(pop(t, S("l14"), 0.5)) }}>What should Yusuf do?</span>
        </div>
      </div>
    </div>
  );
};

/* ============================ TRAVEL ============================ */
export const Travel: React.FC = () => {
  const t = useT();
  const sc = SC("travel");
  const u = (t - sc.start) / (sc.end - sc.start);
  const years = Math.round(interpolate(u, [0.15, 0.75], [0, 1400], { ...clamp, easing: INO }));
  return (
    <div style={{ ...full, overflow: "hidden", background: "#1b1440" }}>
      <svg viewBox="0 0 1920 1080" style={full}>
        {Array.from({ length: 14 }, (_, i) => {
          const r = ((i * 90 + t * 260) % 1260);
          return <circle key={i} cx={960} cy={540} r={r} fill="none" stroke={["#ffd34d", "#ff8fb1", "#7fd8ff", "#9be38a"][i % 4]} strokeWidth={10 + r / 30} opacity={0.15 + 0.5 * (r / 1260)} strokeDasharray={`${20 + i * 4} ${30 + i * 3}`} transform={`rotate(${-t * 60 * (i % 2 ? 1 : -1)} 960 540)`} />;
        })}
        <g transform="translate(960,540)">
          <circle r={170} fill="#fff4dc" stroke="#2b2340" strokeWidth={12} />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-140} x2={0} y2={-120} stroke="#2b2340" strokeWidth={8} transform={`rotate(${i * 30})`} />)}
          <line x1={0} y1={0} x2={0} y2={-90} stroke="#2b2340" strokeWidth={14} strokeLinecap="round" transform={`rotate(${-t * 400})`} />
          <line x1={0} y1={0} x2={0} y2={-130} stroke="#e0473f" strokeWidth={8} strokeLinecap="round" transform={`rotate(${-t * 1500})`} />
          <circle r={14} fill="#2b2340" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}>
        <PopText text="Back in time..." t={t} at={sc.start + 0.4} size={110} color="#ffd34d" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", fontFamily: BALOO, fontWeight: 800, fontSize: 96, color: "#fff4dc", WebkitTextStroke: "5px #2b2340", paintOrder: "stroke fill", opacity: tw(t, sc.start + 1.0, 0.4, 0, 1) }}>
        {years.toLocaleString("en-US")}{years >= 1400 ? "+" : ""} years ago
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#ffe1a8", opacity: interpolate(t, [sc.end - 0.6, sc.end], [0, 1], clamp) }} />
    </div>
  );
};
