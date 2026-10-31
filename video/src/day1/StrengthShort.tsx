import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing, Audio } from "remotion";
import data from "./strength-timing.json";

/* One More Sadqah · Short 2 — "Who is truly strong?" (Bukhari 6114, Muslim 2609)
   Locked-hadith quality bar: painted canvas scenes, serif kinetic type, flash cuts, grain. Roman Urdu subtitles. */
type Tok = [string, number, number];
type Line = { id: string; start: number; end: number; tokens: Tok[] };
const LINES = data.lines as unknown as Line[];
export const STRENGTH_DUR = data.total as number;
const S = (i: number) => LINES[i].start;
const E = (i: number) => LINES[i].end;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const GAR = "'EB Garamond', serif", PLAY = "'Playfair Display', serif", MONT = "Montserrat, sans-serif", AMIRI = "Amiri, serif";
const GOLD = "#f0c96a", CREAM = "#fff6e6";
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: 1920 };
const pop = (t: number, a: number, d = 0.45) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
const prng = (seed: number) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };

/* calm factor: 0 = rage (lines 0-4 build heat), 1 = calm (from line 5) */
const calmAt = (t: number) => interpolate(t, [S(4) + 0.6, E(4) + 0.6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

const FrameCanvas: React.FC<{ paint: (g: CanvasRenderingContext2D, t: number, f: number) => void; w?: number; h?: number; style?: React.CSSProperties }> = ({ paint, w = 1080, h = 1920, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  useLayoutEffect(() => { const g = ref.current?.getContext("2d"); if (g) paint(g, t, frame); }, [t, frame, paint]);
  return <canvas ref={ref} width={w} height={h} style={{ ...full, ...style }} />;
};

/* ember field that turns into a calm dawn */
const R = prng(5);
const EMB = Array.from({ length: 260 }, () => ({ x: R() * 1080, y: R() * 1920, v: 60 + R() * 220, r: 1 + R() * 3.6, p: R() * 6.28, d: R() }));
const paintSky = (g: CanvasRenderingContext2D, t: number) => {
  const c = calmAt(t);
  const mix = (a: number[], b: number[]) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * c)).join(",")})`;
  const grd = g.createLinearGradient(0, 0, 0, 1920);
  grd.addColorStop(0, mix([18, 4, 6], [10, 22, 40]));
  grd.addColorStop(0.55, mix([92, 14, 10], [24, 70, 92]));
  grd.addColorStop(1, mix([200, 60, 18], [236, 186, 120]));
  g.fillStyle = grd; g.fillRect(0, 0, 1080, 1920);
  // heat haze glow
  const rg = g.createRadialGradient(540, 1500, 50, 540, 1500, 1100);
  rg.addColorStop(0, `rgba(255,${Math.round(120 + 100 * c)},${Math.round(40 + 150 * c)},${0.55 - 0.2 * c})`);
  rg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rg; g.fillRect(0, 0, 1080, 1920);
  // embers rise fast in rage, slow to drifting motes in calm
  for (const e of EMB) {
    const sp = e.v * (1 - 0.85 * c);
    const y = ((e.y - t * sp) % 1920 + 1920) % 1920;
    const x = e.x + Math.sin(t * (1.5 - c) + e.p) * (30 - 20 * c);
    const a = (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 4 + e.p))) * (0.9 - 0.5 * c);
    g.fillStyle = c < 0.5 ? `rgba(255,${Math.round(140 + 80 * e.d)},60,${a})` : `rgba(255,245,220,${a * 0.6})`;
    g.beginPath(); g.arc(x, y, e.r * (1 - 0.3 * c), 0, 6.283); g.fill();
  }
};
const paintGrain = (g: CanvasRenderingContext2D, _t: number, f: number) => {
  const r = prng(f * 13 + 7);
  g.clearRect(0, 0, 360, 640);
  for (let i = 0; i < 2400; i++) { g.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)"; g.fillRect(r() * 360, r() * 640, 1, 1); }
};

/* two faceless wrestlers (silhouettes) — one throws the other on line 1 */
const Wrestlers: React.FC<{ t: number }> = ({ t }) => {
  const a = S(1), throwP = interpolate(t, [a + 0.3, a + 1.3], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const o = interpolate(t, [S(0) + 0.4, S(0) + 0.9, S(2) - 0.1, S(2) + 0.2], [0, 1, 1, 0], clamp);
  const fig = (x: number, y: number, rot: number, s = 1) => (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <circle cx={0} cy={-250} r={44} fill="#120607" />
      <path d="M -60 -200 Q -80 -100 -50 0 L 50 0 Q 80 -100 60 -200 Q 0 -230 -60 -200 Z" fill="#120607" />
      <rect x={-46} y={-10} width={34} height={170} rx={14} fill="#120607" /><rect x={12} y={-10} width={34} height={170} rx={14} fill="#120607" />
    </g>
  );
  return (
    <svg width={1080} height={1920} style={{ ...full, opacity: o }}>
      <ellipse cx={540} cy={1360} rx={420} ry={60} fill="#000" opacity={0.35} />
      {fig(430 + 40 * throwP, 1200, -8 + 20 * throwP)}
      {fig(650 + 160 * throwP, 1200 + 120 * throwP * throwP, 10 + 95 * throwP, 0.96)}
      {throwP > 0.85 ? <circle cx={820} cy={1330} r={140 * (throwP - 0.85) * 6} fill="#ffcf8a" opacity={0.25 * (1 - (throwP - 0.85) * 6)} /> : null}
    </svg>
  );
};

/* calm figure breathing — a faceless person sitting still while the flame shrinks to a candle */
const Calm: React.FC<{ t: number }> = ({ t }) => {
  const o = interpolate(t, [S(5) - 0.3, S(5) + 0.4, E(6) + 0.2, E(6) + 0.6], [0, 1, 1, 0], clamp);
  const br = 0.5 + 0.5 * Math.sin((t - S(5)) * 1.6);
  return (
    <svg width={1080} height={1920} style={{ ...full, opacity: o }}>
      <circle cx={540} cy={1050} r={260 + 50 * br} fill="none" stroke={CREAM} strokeOpacity={0.35} strokeWidth={4} />
      <circle cx={540} cy={1050} r={190 + 35 * br} fill="none" stroke={GOLD} strokeOpacity={0.5} strokeWidth={3} />
      <g transform="translate(540,1180)">
        <circle cx={0} cy={-230} r={46} fill="#13202c" />
        <path d="M -70 -180 Q -90 -60 -150 30 L 150 30 Q 90 -60 70 -180 Q 0 -210 -70 -180 Z" fill="#13202c" />
      </g>
      <text x={540} y={720} textAnchor="middle" fontFamily={MONT} fontWeight={700} fontSize={34} letterSpacing="0.3em" fill={CREAM} opacity={0.75}>{br > 0.5 ? "SAANS LEIN" : "CHHORIEN"}</text>
    </svg>
  );
};

/* hadith card with Arabic + Roman Urdu meaning, word by word */
const HadithCard: React.FC<{ t: number }> = ({ t }) => {
  const a = S(2) - 0.1, b = E(4) + 0.4;
  const o = interpolate(t, [a, a + 0.35, b - 0.3, b], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const ar = "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ";
  return (
    <div style={{ position: "absolute", left: 130, right: 130, top: 520, opacity: o, textAlign: "center" }}>
      <div style={{ fontFamily: AMIRI, fontSize: 54, lineHeight: 1.7, color: CREAM, direction: "rtl", whiteSpace: "normal", wordBreak: "keep-all", textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
        {ar.split(" ").map((w, i, arr) => {
          const k = interpolate(t, [S(3) + (i / arr.length) * (E(4) - S(3)), S(3) + (i / arr.length) * (E(4) - S(3)) + 0.3], [0.25, 1], clamp);
          return <span key={i} style={{ display: "inline-block", opacity: k, margin: "0 6px", color: k > 0.9 && i >= 4 ? GOLD : CREAM }}>{w}</span>;
        })}
      </div>
      <div style={{ marginTop: 24, fontFamily: MONT, fontWeight: 600, fontSize: 24, letterSpacing: "0.16em", color: GOLD }}>SAHIH AL-BUKHARI 6114 · SAHIH MUSLIM 2609</div>
    </div>
  );
};


const tokAt = (li: number, re: RegExp) => { const k = LINES[li].tokens.find((x) => re.test(x[0])); return k ? k[1] : LINES[li].start + 0.8; };

/* line 3: ghosted wrestlers, crossed out on "nahin" */
const NotThis: React.FC<{ t: number }> = ({ t }) => {
  const o = interpolate(t, [S(3) - 0.1, S(3) + 0.3, E(3) + 0.1, E(3) + 0.4], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const n = tokAt(3, /nahin/i);
  const thr = interpolate(t, [S(3) + 0.2, n + 0.1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const strike = interpolate(t, [n, n + 0.35], [0, 1], { ...clamp, easing: OUT });
  const fig = (x: number, y: number, rot: number) => (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(0.72)`}>
      <circle cx={0} cy={-250} r={44} fill="#120607" />
      <path d="M -60 -200 Q -80 -100 -50 0 L 50 0 Q 80 -100 60 -200 Q 0 -230 -60 -200 Z" fill="#120607" />
      <rect x={-46} y={-10} width={34} height={170} rx={14} fill="#120607" /><rect x={12} y={-10} width={34} height={170} rx={14} fill="#120607" />
    </g>
  );
  return (
    <svg width={1080} height={1920} style={{ ...full, opacity: o }}>
      <g opacity={1 - 0.55 * strike} style={{ filter: `blur(${2 * strike}px)` }}>
        {fig(460 + 30 * thr, 1150, -8 + 16 * thr)}
        {fig(620 + 120 * thr, 1150 + 90 * thr * thr, 10 + 85 * thr)}
      </g>
      <line x1={330} y1={1150} x2={330 + 420 * strike} y2={1150 - 260 * strike} stroke="#ff5a4e" strokeWidth={14} strokeLinecap="round" />
    </svg>
  );
};

/* line 4: one figure, anger flames that get gathered inward into a steady gold glow on "qaabu" */
const FR = prng(77);
const FL = Array.from({ length: 300 }, () => ({ a: FR() * Math.PI * 2, r: 0.5 + FR() * 0.6, v: 120 + FR() * 260, p: FR(), s: 3 + FR() * 9 }));
const paintAnger = (g: CanvasRenderingContext2D, t: number) => {
  g.clearRect(0, 0, 1080, 1920);
  const o = interpolate(t, [S(4) - 0.1, S(4) + 0.3, E(4) + 0.5, E(4) + 0.9], [0, 1, 1, 0], clamp);
  if (o <= 0) return;
  const q = interpolate(t, [tokAt(4, /qaabu/i) - 0.5, tokAt(4, /qaabu/i) + 0.7], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const cx = 540, cy = 1010;
  g.globalCompositeOperation = "lighter";
  for (const e of FL) {
    const life = ((t * e.v) / 420 + e.p) % 1;
    // anger: flames licking up around the body
    const ax = cx + Math.cos(e.a) * 120 * e.r + Math.sin(t * 9 + e.p * 20) * 14;
    const ay = cy + 120 - life * 380 * e.r;
    // control: particles orbit a calm ring around the figure
    const ang = e.a + t * (0.25 + e.p * 0.2);
    const bx = cx + Math.cos(ang) * (175 + 14 * Math.sin(e.p * 30));
    const by = cy - 20 + Math.sin(ang) * (175 + 14 * Math.sin(e.p * 30));
    const x = ax + (bx - ax) * q, y = ay + (by - ay) * q;
    const al = o * ((1 - q) * (1 - life) * 0.8 + q * (0.35 + 0.35 * Math.sin(t * 2 + e.p * 9)));
    const col = q < 0.5 ? `rgba(255,${Math.round(70 + 120 * life)},40,${al})` : `rgba(240,201,106,${al})`;
    g.fillStyle = col;
    g.beginPath(); g.arc(x, y, e.s * (1 - 0.5 * q) * (q > 0 ? 1 : 1 - life * 0.5), 0, Math.PI * 2); g.fill();
  }
  g.globalCompositeOperation = "source-over";
};
const Figure: React.FC<{ t: number }> = ({ t }) => {
  const o = interpolate(t, [S(4) - 0.1, S(4) + 0.3, E(4) + 0.5, E(4) + 0.9], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const q = interpolate(t, [tokAt(4, /qaabu/i) - 0.5, tokAt(4, /qaabu/i) + 0.7], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const trem = (1 - q) * 3 * Math.sin(t * 41);
  const fist = 1 - q;
  return (
    <svg width={1080} height={1920} style={{ ...full, opacity: o }}>
      <circle cx={540} cy={1000} r={230} fill="#ff3b1f" opacity={0.16 * (1 - q) * (0.8 + 0.2 * Math.sin(t * 13))} /><circle cx={540} cy={990} r={170} fill={GOLD} opacity={0.12 * q} />
      <g transform={`translate(${540 + trem},1200)`}>
        <circle cx={0} cy={-300} r={46} fill="#120607" />
        <path d="M -70 -250 Q -86 -120 -64 0 L 64 0 Q 86 -120 70 -250 Q 0 -280 -70 -250 Z" fill="#120607" />
        {/* arms: clenched fists down (anger) -> hands opening, resting on chest (control) */}
        <g transform={`translate(-70,-236) rotate(${14 - 34 * q})`}><rect x={-14} y={0} width={28} height={150 - 40 * q} rx={14} fill="#120607" /><circle cy={150 - 40 * q} r={18 + 6 * fist} fill="#120607" /></g>
        <g transform={`translate(70,-236) rotate(${-14 + 34 * q})`}><rect x={-14} y={0} width={28} height={150 - 40 * q} rx={14} fill="#120607" /><circle cy={150 - 40 * q} r={18 + 6 * fist} fill="#120607" /></g>
      </g>
    </svg>
  );
};

/* geometric gold frame drawn around the hadith */
const Frame8: React.FC<{ t: number }> = ({ t }) => {
  const a = S(2) - 0.1, b = E(4) + 0.4;
  const o = interpolate(t, [a, a + 0.35, b - 0.3, b], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const d = interpolate(t, [a, a + 1.4], [0, 1], { ...clamp, easing: OUT });
  const L = 2 * (900 + 400);
  const star = (x: number, y: number, r: number) => {
    const pts = Array.from({ length: 16 }, (_, i) => { const rr = i % 2 ? r * 0.55 : r; const an = (Math.PI / 8) * i + t * 0.3; return `${(x + rr * Math.cos(an)).toFixed(1)},${(y + rr * Math.sin(an)).toFixed(1)}`; }).join(" ");
    return <polygon points={pts} fill="none" stroke={GOLD} strokeWidth={3} opacity={0.9 * d} />;
  };
  return (
    <svg width={1080} height={1920} style={{ ...full, opacity: o }}>
      <rect x={90} y={470} width={900} height={400} rx={30} fill="rgba(10,4,4,0.35)" stroke={GOLD} strokeWidth={3} strokeDasharray={`${L * d} ${L}`} />
      <rect x={106} y={486} width={868} height={368} rx={22} fill="none" stroke={GOLD} strokeOpacity={0.4} strokeWidth={1.5} strokeDasharray={`${L * d} ${L}`} />
      {star(90, 470, 26)}{star(990, 470, 26)}{star(90, 870, 26)}{star(990, 870, 26)}
    </svg>
  );
};

/* light beam sweep when the Prophet ﷺ is mentioned (line 2) */
const Beam: React.FC<{ t: number }> = ({ t }) => {
  const k = interpolate(t, [S(2) - 0.1, S(2) + 1.6], [0, 1], clamp);
  if (k <= 0 || k >= 1) return null;
  return <AbsoluteFill style={{ background: `linear-gradient(${100 + 20 * k}deg, rgba(255,230,170,0) ${-30 + 120 * k}%, rgba(255,230,170,0.22) ${-15 + 120 * k}%, rgba(255,230,170,0) ${0 + 120 * k}%)`, mixBlendMode: "screen" }} />;
};

/* big serif kinetic title per beat (top band) */
const Title: React.FC<{ t: number }> = ({ t }) => {
  const beats: { at: number; until: number; text: string; size: number }[] = [
    { at: S(0), until: S(2) - 0.15, text: "Taqatwar kaun?", size: 128 },
    { at: S(5), until: E(6) + 0.3, text: "Asal taqat", size: 132 },
    { at: S(7), until: STRENGTH_DUR, text: "Share karein", size: 110 },
  ];
  return (
    <>
      {beats.map((b, i) => {
        const o = interpolate(t, [b.at, b.at + 0.25, b.until - 0.3, b.until], [0, 1, 1, 0], clamp);
        if (o <= 0) return null;
        const words = b.text.split(" ");
        return (
          <div key={i} style={{ position: "absolute", left: 60, right: 60, top: 400, textAlign: "center", opacity: o, fontFamily: PLAY, fontWeight: 700, fontSize: b.size, lineHeight: 1.02, color: CREAM, textShadow: "0 8px 40px rgba(0,0,0,0.55)" }}>
            {words.map((w, k) => {
              const p = pop(t, b.at + k * 0.18, 0.5);
              return <span key={k} style={{ display: "inline-block", margin: "0 14px", transform: `translateY(${(1 - p) * 40}px) scale(${0.8 + 0.2 * p})`, opacity: p, fontStyle: k === words.length - 1 ? "italic" : "normal", color: k === words.length - 1 ? GOLD : CREAM }}>{w}</span>;
            })}
          </div>
        );
      })}
    </>
  );
};

/* Roman Urdu subtitles (rule: always English letters) */
const Subs: React.FC<{ t: number }> = ({ t }) => {
  const line = LINES.find((l) => t >= l.start - 0.12 && t <= l.end + 0.3);
  if (!line) return null;
  const o = interpolate(t, [line.start - 0.12, line.start + 0.05, line.end + 0.1, line.end + 0.3], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 1250, minHeight: 240, display: "flex", alignItems: "center", justifyContent: "center", opacity: o }}>
      <div style={{ fontFamily: GAR, fontWeight: 600, fontStyle: "italic", fontSize: 62, lineHeight: 1.18, textAlign: "center", color: CREAM, textShadow: "0 4px 18px rgba(0,0,0,0.7)" }}>
        {line.tokens.map(([w, a], i) => {
          const on = t >= a - 0.03;
          const key = /taqat|ghuss|qaabu|kamzori|khamosh|Rasool|Allah|Sallallahu|Alaihi|Alihi|Wasallam/i.test(w);
          return <span key={i} style={{ display: "inline-block", margin: "0 9px", opacity: on ? 1 : 0.3, color: on && key ? GOLD : CREAM, transform: `translateY(${on ? 0 : 8}px)` }}>{w}</span>;
        })}
      </div>
    </div>
  );
};

const Flash: React.FC<{ t: number }> = ({ t }) => {
  const cuts = [S(2) - 0.05, S(5) - 0.05, S(7) - 0.05];
  let o = 0;
  for (const c of cuts) {
    if (t >= c - 0.06 && t < c) o = Math.max(o, interpolate(t, [c - 0.06, c], [0, 0.9], clamp));
    if (t >= c && t < c + 0.3) o = Math.max(o, interpolate(t, [c, c + 0.3], [0.9, 0], { ...clamp, easing: OUT }));
  }
  return <AbsoluteFill style={{ background: t < S(5) ? "#5a1212" : "#f6e6c8", opacity: o }} />;
};

const Share: React.FC<{ t: number }> = ({ t }) => {
  const p = pop(t, S(7) + 0.3, 0.5);
  if (t < S(7)) return null;
  return (
    <div style={{ position: "absolute", top: 820, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${p})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, background: "rgba(255,246,230,0.95)", borderRadius: 80, padding: "18px 40px" }}>
        <Img src={staticFile("day1/one-more-sadqah.png")} style={{ width: 90, height: 90, borderRadius: 45 }} />
        <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, color: "#0f5132" }}>+1 Sadqah</span>
      </div>
    </div>
  );
};

export const StrengthShort: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const shake = t < S(2) ? 6 * Math.sin(t * 37) * interpolate(t, [S(1) + 0.9, S(1) + 1.3, S(1) + 1.8], [0, 1, 0], clamp) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
      <FrameCanvas paint={paintSky} />
      <Wrestlers t={t} />
      <Calm t={t} />
      <NotThis t={t} />
      <FrameCanvas paint={paintAnger} />
      <Figure t={t} />
      <Beam t={t} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 85% at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)" }} />
      <div style={{ position: "absolute", top: 228, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, opacity: 0.9 }}>
        <Img src={staticFile("day1/one-more-sadqah.png")} style={{ width: 56, height: 56, borderRadius: 28 }} />
        <span style={{ fontFamily: MONT, fontWeight: 700, fontSize: 30, letterSpacing: "0.16em", color: CREAM }}>ONE MORE SADQAH</span>
      </div>
      <Title t={t} />
      <Frame8 t={t} />
      <HadithCard t={t} />
      <Share t={t} />
      <Subs t={t} />
      <Flash t={t} />
      <FrameCanvas paint={paintGrain} w={360} h={640} style={{ opacity: 0.08, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(t, [STRENGTH_DUR - 0.6, STRENGTH_DUR], [0, 1], clamp) }} />
      <Audio src={staticFile("day1/strength-mix.m4a")} />
    </AbsoluteFill>
  );
};
