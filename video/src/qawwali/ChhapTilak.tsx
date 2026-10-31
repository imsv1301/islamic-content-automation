import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import data from "./chhap-timing.json";

/* Mehfil-e-Sama · qawwali sample: "Chhap Tilak" (kalam of Hazrat Amir Khusrau Rahmatullahi Alaih, 13th-14th c., public domain).
   Every line is shown literally; rose petals carry the transitions. No people's faces, no Awliya depicted. */
type QL = { id: string; start: number; end: number; ur: string; roman: string; en: string };
const LINES = data.lines as QL[];
export const CHHAP_DUR = data.total as number;
const HAS_AUDIO = !(data as { placeholder?: boolean }).placeholder;
const S = (i: number) => LINES[i].start;
const NEXT = (i: number) => (i + 1 < LINES.length ? LINES[i + 1].start : CHHAP_DUR);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INO = Easing.bezier(0.65, 0, 0.35, 1);
const tw = (t: number, a: number, b: number, e = OUT) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const prng = (seed: number) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: 1920 };
const GOLD = "#f3cf6a", ROSE = "#c2183c", CREAM = "#fff3e6", PLUM = "#2a0b1e";
const PLAY = "'Playfair Display', serif", GAR = "'EB Garamond', serif", MONT = "Montserrat, sans-serif", NAST = "'Noto Nastaliq Urdu', serif";

/* scene visibility: each scene lives from its line start (minus a beat) until the next line starts */
const vis = (t: number, i: number) => interpolate(t, [S(i) - 0.8, S(i) + 0.2, NEXT(i) - 0.6, NEXT(i) + 0.2], [0, 1, 1, 0], clamp);
const local = (t: number, i: number) => (t - S(i)) / Math.max(1, NEXT(i) - S(i)); // 0..1 through the scene

const Canvas: React.FC<{ paint: (g: CanvasRenderingContext2D, t: number, f: number) => void; w?: number; h?: number; style?: React.CSSProperties }> = ({ paint, w = 1080, h = 1920, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  useLayoutEffect(() => { const g = ref.current?.getContext("2d"); if (g) paint(g, frame / fps, frame); }, [frame, fps, paint]);
  return <canvas ref={ref} width={w} height={h} style={{ ...full, ...style }} />;
};

/* ---------- rose petals: ambient fall + a gust that sweeps across at every line change ---------- */
const R = prng(11);
const PET = Array.from({ length: 150 }, () => ({ x: R() * 1300 - 110, y: R() * 1920, v: 40 + R() * 90, s: 0.5 + R() * 1.1, rot: R() * 6.28, spin: (R() - 0.5) * 2.4, sw: R() * 6.28, hue: R(), g: R() }));
const gustAt = (t: number) => {
  let g = 0;
  for (let i = 1; i < LINES.length; i++) { const c = S(i) - 0.3; g = Math.max(g, interpolate(t, [c - 0.9, c, c + 1.1], [0, 1, 0], { ...clamp, easing: INO })); }
  g = Math.max(g, interpolate(t, [CHHAP_DUR - 3.2, CHHAP_DUR - 1.6], [0, 1], clamp));
  return g;
};
const petal = (g: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, hue: number, a: number) => {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s * (0.55 + 0.45 * Math.abs(Math.cos(rot * 1.7))));
  const gr = g.createLinearGradient(0, -22, 0, 22);
  const c1 = hue < 0.7 ? `rgba(214,28,66,${a})` : `rgba(255,120,150,${a})`;
  gr.addColorStop(0, hue < 0.7 ? `rgba(255,96,124,${a})` : `rgba(255,200,210,${a})`); gr.addColorStop(1, c1);
  g.fillStyle = gr;
  g.beginPath(); g.moveTo(0, 22); g.bezierCurveTo(-24, 8, -20, -20, 0, -24); g.bezierCurveTo(20, -20, 24, 8, 0, 22); g.fill();
  g.strokeStyle = `rgba(120,0,30,${a * 0.35})`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, 18); g.quadraticCurveTo(2, 0, 0, -18); g.stroke();
  g.restore();
};
const paintPetals = (front: boolean) => (g: CanvasRenderingContext2D, t: number) => {
  g.clearRect(0, 0, 1080, 1920);
  const gust = gustAt(t);
  PET.forEach((p, i) => {
    if ((i % 3 === 0) !== front) return;
    const fall = ((p.y + t * p.v * (1 + 2 * gust)) % 2100) - 90;
    const drift = t * (14 + 40 * p.g) + gust * 900 * (0.6 + p.g) * Math.min(1, t / 3);
    const x = ((p.x + drift + 40 * Math.sin(t * 0.9 + p.sw)) % 1300 + 1300) % 1300 - 110;
    const ambient = front ? 0.18 + 0.75 * gust : 0.5;
    const show = front ? p.g < 0.25 + 0.75 * gust : true;
    if (!show) return;
    petal(g, x, fall, p.s * (front ? 1.8 : 0.9), p.rot + t * p.spin * (1 + gust), p.hue, ambient);
  });
};

/* ---------- background: plum night that warms into dawn by the last line ---------- */
const BK = prng(4);
const BOKEH = Array.from({ length: 40 }, () => ({ x: BK() * 1080, y: BK() * 1920, r: 20 + BK() * 70, p: BK() * 6.28, w: 0.2 + BK() * 0.5 }));
const paintBg = (g: CanvasRenderingContext2D, t: number) => {
  const dawn = interpolate(t, [S(LINES.length - 1) - 0.6, S(LINES.length - 1) + 3], [0, 1], clamp);
  const mix = (a: number[], b: number[]) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * dawn)).join(",")})`;
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, mix([22, 4, 16], [58, 20, 40])); gr.addColorStop(0.55, mix([52, 10, 30], [182, 76, 64])); gr.addColorStop(1, mix([30, 6, 18], [245, 170, 110]));
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  const rg = g.createRadialGradient(540, 860, 40, 540, 860, 900);
  rg.addColorStop(0, `rgba(255,90,110,${0.22 + 0.06 * Math.sin(t * 0.7)})`); rg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rg; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) {
    const y = ((b.y - t * 12 * b.w) % 1920 + 1920) % 1920;
    const a = 0.05 + 0.05 * Math.sin(t * b.w * 2 + b.p);
    const bg = g.createRadialGradient(b.x, y, 0, b.x, y, b.r);
    bg.addColorStop(0, `rgba(255,200,170,${a})`); bg.addColorStop(1, "rgba(255,200,170,0)");
    g.fillStyle = bg; g.beginPath(); g.arc(b.x, y, b.r, 0, 6.29); g.fill();
  }
  g.globalCompositeOperation = "source-over";
};
const paintGrain = (g: CanvasRenderingContext2D, _t: number, f: number) => {
  const r = prng(f * 7 + 3); g.clearRect(0, 0, 360, 640);
  for (let i = 0; i < 2200; i++) { g.fillStyle = r() > 0.5 ? "#fff" : "#000"; g.fillRect(r() * 360, r() * 640, 1, 1); }
};

/* ---------- scene 0: "chhap tilak sab chheen li ... naina milaike" — two eye-lights meet, the mark scatters into petals ---------- */
const EyeLight: React.FC<{ x: number; y: number; o: number; flip?: boolean; open: number }> = ({ x, y, o, flip, open }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -1 : 1},1)`} opacity={o}>
    <path d={`M -120 0 Q 0 ${-78 * open} 120 0 Q 0 ${78 * open} -120 0 Z`} fill="url(#eyeGlow)" />
    <path d={`M -120 0 Q 0 ${-78 * open} 120 0`} fill="none" stroke={GOLD} strokeWidth={5} strokeLinecap="round" />
    <path d={`M -120 0 Q 0 ${78 * open} 120 0`} fill="none" stroke={GOLD} strokeWidth={2.5} strokeOpacity={0.6} strokeLinecap="round" />
    <path d={`M -120 0 L -150 -10`} stroke={GOLD} strokeWidth={4} strokeLinecap="round" />
  </g>
);
const Scene0: React.FC<{ t: number }> = ({ t }) => {
  const o = vis(t, 0);
  if (o <= 0) return null;
  const k = local(t, 0);
  const meet = tw(k, 0.35, 0.62, INO);
  const shatter = tw(k, 0.6, 0.85);
  const open = 0.25 + 0.75 * tw(k, 0.05, 0.3);
  const lx = 540 - 300 + 160 * meet, rx = 540 + 300 - 160 * meet;
  const r2 = prng(21);
  const shards = Array.from({ length: 26 }, () => ({ a: r2() * 6.28, d: 120 + r2() * 420, s: 0.6 + r2(), rr: r2() * 6 }));
  return (
    <svg width={1080} height={1920} style={{ ...full, opacity: o }}>
      <defs>
        <radialGradient id="eyeGlow"><stop offset="0" stopColor="#ffe9b0" stopOpacity={0.9} /><stop offset="0.6" stopColor={GOLD} stopOpacity={0.25} /><stop offset="1" stopColor={GOLD} stopOpacity={0} /></radialGradient>
        <radialGradient id="tilak"><stop offset="0" stopColor="#ff5a6e" /><stop offset="0.7" stopColor={ROSE} /><stop offset="1" stopColor="#7a0a22" /></radialGradient>
      </defs>
      {/* the "chhap" seal: a gold ring stamp, and the "tilak" mark inside it */}
      <g transform={`translate(540,880) scale(${1 + 0.03 * Math.sin(t * 2)})`} opacity={1 - shatter}>
        <circle r={150} fill="none" stroke={GOLD} strokeWidth={3} strokeDasharray="6 10" transform={`rotate(${t * 8})`} />
        <circle r={118} fill="none" stroke={GOLD} strokeOpacity={0.6} strokeWidth={2} />
        <path d="M 0 -80 C 34 -30 34 40 0 84 C -34 40 -34 -30 0 -80 Z" fill="url(#tilak)" />
      </g>
      {shatter > 0 && shatter < 1 ? shards.map((s, i) => {
        const e = Easing.out(Easing.cubic)(shatter);
        const x = 540 + Math.cos(s.a) * s.d * e, y = 880 + Math.sin(s.a) * s.d * e + 160 * shatter * shatter;
        return <path key={i} transform={`translate(${x},${y}) rotate(${(s.rr + shatter * 4) * 57}) scale(${s.s * (1 - 0.5 * shatter)})`} d="M 0 18 C -20 6 -16 -16 0 -20 C 16 -16 20 6 0 18 Z" fill={i % 3 ? ROSE : "#ff7d96"} opacity={1 - shatter} />;
      }) : null}
      <EyeLight x={lx} y={640} o={tw(k, 0.02, 0.2)} open={open} />
      <EyeLight x={rx} y={640} o={tw(k, 0.02, 0.2)} flip open={open} />
      {meet > 0.95 ? <circle cx={540} cy={640} r={60 + 400 * shatter} fill="#ffe9b0" opacity={0.35 * (1 - shatter)} /> : null}
    </svg>
  );
};

/* ---------- scene 1: "prem bhatee ka madhva pilaike, matvaari kar leeni" — love's kiln pours liquid light into a clay cup; the world sways ---------- */
const Scene1: React.FC<{ t: number }> = ({ t }) => {
  const o = vis(t, 1);
  if (o <= 0) return null;
  const k = local(t, 1);
  const pour = tw(k, 0.18, 0.45, INO);
  const fill = tw(k, 0.3, 0.6, INO);
  const sway = tw(k, 0.55, 0.75) * (1 - tw(k, 0.95, 1.05));
  const rot = sway * 3.2 * Math.sin(t * 1.3);
  const fl = 1 + 0.08 * Math.sin(t * 13) + 0.05 * Math.sin(t * 23);
  const stream = pour * (1 - tw(k, 0.62, 0.7));
  return (
    <div style={{ ...full, opacity: o, transform: `rotate(${rot}deg) scale(${1 + 0.02 * sway})`, filter: sway > 0.05 ? `blur(${0.8 * sway}px)` : undefined }}>
      <svg width={1080} height={1920} style={full}>
        <defs>
          <radialGradient id="kiln"><stop offset="0" stopColor="#ffd27a" /><stop offset="0.5" stopColor="#ff7a3c" /><stop offset="1" stopColor="#a8241a" stopOpacity={0} /></radialGradient>
          <linearGradient id="liquid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff1c4" /><stop offset="1" stopColor={GOLD} /></linearGradient>
          <linearGradient id="clay" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6e2f1c" /><stop offset="0.5" stopColor="#b0603a" /><stop offset="1" stopColor="#5a2414" /></linearGradient>
        </defs>
        {/* bhatee: a brick kiln arch with fire, upper right */}
        <g transform="translate(760,560)">
          <path d="M -170 160 L -170 0 A 170 170 0 0 1 170 0 L 170 160 Z" fill="#3a1410" />
          {Array.from({ length: 6 }, (_, r) => <line key={r} x1={-170} x2={170} y1={20 + r * 26} y2={20 + r * 26} stroke="#2a0c08" strokeWidth={3} />)}
          <path d="M -90 160 L -90 40 A 90 90 0 0 1 90 40 L 90 160 Z" fill="#120404" />
          <ellipse cx={0} cy={110} rx={120 * fl} ry={100 * fl} fill="url(#kiln)" />
          <path d={`M -50 160 C -40 ${90 - 20 * fl} -10 ${70 - 30 * fl} 0 ${40 - 30 * fl} C 12 ${80 - 20 * fl} 44 ${90 - 10 * fl} 50 160 Z`} fill="#ffb347" opacity={0.9} />
          {/* spout */}
          <path d="M 90 120 L 150 140 L 150 156 L 90 150 Z" fill="#6e2f1c" />
        </g>
        {/* pour stream: from spout arcing down into the cup */}
        {stream > 0 ? <path d={`M 910 700 C 960 760 640 ${780} 560 ${780 + 300 * stream}`} fill="none" stroke="url(#liquid)" strokeWidth={14 * stream + 2} strokeLinecap="round" strokeDasharray={`${900 * pour} 2000`} opacity={0.95} /> : null}
        {/* the cup (pyala) */}
        <g transform="translate(540,1160)">
          <ellipse cx={0} cy={60} rx={210} ry={30} fill="#000" opacity={0.3} />
          <path d="M -170 -110 Q -160 40 -60 60 L 60 60 Q 160 40 170 -110 Z" fill="url(#clay)" />
          <ellipse cx={0} cy={-110} rx={170} ry={36} fill="#3a160c" />
          <clipPath id="cupTop"><ellipse cx={0} cy={-110} rx={160} ry={32} /></clipPath>
          <ellipse cx={0} cy={-110} rx={160 * fill} ry={32 * fill} fill="url(#liquid)" opacity={0.95} />
          {fill > 0.5 ? <circle cx={0} cy={-120} r={260 * fill} fill={GOLD} opacity={0.12 * fill * (0.8 + 0.2 * Math.sin(t * 3))} /> : null}
          <path d="M -150 -60 Q 0 -20 150 -60" stroke={GOLD} strokeWidth={3} fill="none" opacity={0.55} />
        </g>
      </svg>
      {sway > 0.05 ? <div style={{ ...full, opacity: 0.25 * sway, transform: `translate(${14 * Math.sin(t * 1.7)}px,0)` }} /> : null}
    </div>
  );
};

/* ---------- scene 2: "gori gori bayyan, hari hari chudiyan" — a fair forearm with green glass bangles that catch the light ---------- */
const Arm: React.FC<{ t: number; reach: number; grip: number }> = ({ t, reach, grip }) => {
  const fingers: [number, number, number][] = [[-30, -9, 118], [-10, -2, 134], [10, 5, 126], [29, 12, 98]];
  const bangles = [372, 390, 408, 426, 444, 462];
  const curl = 4 * Math.sin(t * 1.4);
  return (
    <g transform={`translate(${250 + 40 * reach},${1820 - 380 * reach}) rotate(-62)`}>
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f8dcc6" /><stop offset="0.6" stopColor="#efc4a6" /><stop offset="1" stopColor="#d9a487" /></linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#065a30" /><stop offset="0.45" stopColor="#2fd07c" /><stop offset="0.55" stopColor="#c8ffd8" /><stop offset="1" stopColor="#065a30" /></linearGradient>
        <linearGradient id="goldB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8a6418" /><stop offset="0.5" stopColor="#ffe38a" /><stop offset="1" stopColor="#8a6418" /></linearGradient>
      </defs>
      {/* forearm, tapering to the wrist */}
      <path d="M -40 -54 C 150 -54 300 -38 440 -31 L 440 31 C 300 38 150 54 -40 54 Z" fill="url(#skin)" />
      {/* thumb */}
      <g transform={`translate(478,-30) rotate(${-48 + curl})`}><rect x={0} y={-13} width={86} height={26} rx={13} fill="url(#skin)" /></g>
      {/* palm */}
      <path d="M 434 -31 C 480 -40 530 -46 566 -42 L 570 42 C 530 46 480 40 434 31 Z" fill="url(#skin)" />
      {/* fingers, softly fanned */}
      {fingers.map(([y, ang, len], i) => (
        <g key={i} transform={`translate(560,${y}) rotate(${ang + curl * (i - 1.5) * 0.5})`}>
          <rect x={-6} y={-11} width={len} height={22} rx={11} fill="url(#skin)" />
          <rect x={len - 34} y={-11} width={28} height={22} rx={11} fill="#a33a1c" opacity={0.55} />
        </g>
      ))}
      {/* mehndi on the back of the hand */}
      <g fill="none" stroke="#a33a1c" strokeOpacity={0.6} strokeWidth={2.4}>
        <circle cx={512} cy={0} r={18} /><circle cx={512} cy={0} r={8} />
        {[0, 60, 120, 180, 240, 300].map((r) => <path key={r} transform={`translate(512,0) rotate(${r})`} d="M 22 0 Q 30 -6 36 0 Q 30 6 22 0" />)}
        <path d="M 540 -28 Q 556 -20 560 -30 M 540 28 Q 556 20 560 30" />
      </g>
      {/* green glass bangles with two gold ones */}
      {bangles.map((x, i) => {
        const gold = i === 0 || i === bangles.length - 1;
        const sh = 0.5 + 0.5 * Math.sin(t * 3 + i * 0.9);
        return (
          <g key={i}>
            <ellipse cx={x} cy={0} rx={9} ry={44 - (x - 372) * 0.05} fill="none" stroke={gold ? "url(#goldB)" : "url(#glass)"} strokeWidth={gold ? 7 : 10} />
            <ellipse cx={x - 2} cy={-22 + 16 * sh} rx={2.5} ry={8} fill="#fff" opacity={0.85 * sh} />
          </g>
        );
      })}
      {grip > 0 ? (
        <g opacity={grip}>
          {/* the other hand, drawn as a line of light curling round the wrist */}
          <path d={`M 400 ${-150 + 60 * (1 - grip)} C 430 -110 452 -70 436 -30 C 420 10 440 40 470 60 C 500 74 520 60 516 40`} fill="none" stroke={GOLD} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${460 * grip} 700`} />
          <circle cx={430} cy={0} r={130 * grip} fill={GOLD} opacity={0.12} />
        </g>
      ) : null}
    </g>
  );
};
const Scene2: React.FC<{ t: number; idx: number; gripIdx?: boolean }> = ({ t, idx, gripIdx }) => {
  const o = vis(t, idx);
  if (o <= 0) return null;
  const k = local(t, idx);
  const reach = gripIdx ? 1 : tw(k, 0.0, 0.4, INO);
  const grip = gripIdx ? tw(k, 0.15, 0.5, INO) : 0;
  const lift = gripIdx ? tw(k, 0.55, 0.9, INO) : 0;
  const r3 = prng(8);
  const glints = Array.from({ length: 18 }, () => ({ x: 300 + r3() * 600, y: 700 + r3() * 600, p: r3() * 6.28 }));
  return (
    <svg width={1080} height={1920} style={{ ...full, opacity: o }}>
      <g transform={`translate(${60 * lift},${-120 * lift})`}>
        <Arm t={t} reach={reach} grip={grip} />
      </g>
      {glints.map((g, i) => { const a = Math.max(0, Math.sin(t * 2.2 + g.p)); return <path key={i} transform={`translate(${g.x},${g.y}) scale(${a})`} d="M 0 -14 L 3 -3 L 14 0 L 3 3 L 0 14 L -3 3 L -14 0 L -3 -3 Z" fill="#c8ffd8" opacity={0.7 * a} />; })}
    </svg>
  );
};

const DR = prng(17);
const DYE = Array.from({ length: 14 }, (_, j) => ({ x: 160 + DR() * 760, y: 620 + DR() * 520, r: 220 + DR() * 260, d: j === 0 ? 0 : DR() * 0.45 }));
/* ---------- scene 4: "bal bal jaaun main tore rang rajwa, apni si rang leeni" — white cloth dyed in the dyer's colour ---------- */
const Scene4: React.FC<{ t: number }> = ({ t }) => {
  const i = 4;
  const o = vis(t, i);
  if (o <= 0) return null;
  const k = local(t, i);
  const dye = tw(k, 0.42, 0.85, INO);
  const pts = (yOff: number) => {
    const N = 24; const top: string[] = [];
    for (let j = 0; j <= N; j++) { const x = 90 + (900 / N) * j; const y = 560 + yOff + 40 * Math.sin(t * 1.6 + j * 0.45) + 18 * Math.sin(t * 2.7 + j * 0.9); top.push(`${x.toFixed(1)},${y.toFixed(1)}`); }
    return top;
  };
  const top = pts(0), bot = pts(560).reverse();
  const d = `M ${top.join(" L ")} L ${bot.join(" L ")} Z`;
  return (
    <svg width={1080} height={1920} style={{ ...full, opacity: o }}>
      <defs>
        <radialGradient id="dye" cx="0.5" cy="0.5" r="0.75"><stop offset="0" stopColor="#ff9a3c" /><stop offset="0.55" stopColor="#e23a5a" /><stop offset="1" stopColor="#9c0f3a" /></radialGradient>
        <clipPath id="cloth"><path d={d} /></clipPath>
        <radialGradient id="dyeSoft"><stop offset="0" stopColor="#ff8f3c" /><stop offset="0.45" stopColor="#e2345a" /><stop offset="0.8" stopColor="#b3123e" stopOpacity={0.85} /><stop offset="1" stopColor="#b3123e" stopOpacity={0} /></radialGradient>
        <linearGradient id="fold" x1="0" y1="0" x2="1" y2="0">{Array.from({ length: 9 }, (_, j) => <stop key={j} offset={j / 8} stopColor="#000" stopOpacity={j % 2 ? 0.12 : 0} />)}</linearGradient>
      </defs>
      {/* the dyer's vat below */}
      <ellipse cx={540} cy={1320} rx={300} ry={60} fill="#5a0f22" />
      <ellipse cx={540} cy={1312} rx={270} ry={46} fill="url(#dye)" opacity={0.9} />
      <path d={d} fill="#fbf4ea" />
      <g clipPath="url(#cloth)">
        {DYE.map((b, j) => { const p = interpolate(dye, [b.d, Math.min(1, b.d + 0.55)], [0, 1], clamp); return p > 0 ? <circle key={j} cx={b.x} cy={b.y + 40 * Math.sin(t + j)} r={b.r * Easing.out(Easing.cubic)(p)} fill="url(#dyeSoft)" opacity={0.9} /> : null; })}
        <rect x={0} y={500} width={1080} height={700} fill="url(#fold)" />
        <path d={`M ${top.join(" L ")}`} fill="none" stroke={GOLD} strokeWidth={10} opacity={0.8} transform="translate(0,22)" />
      </g>
    </svg>
  );
};

/* ---------- scene 5: "khusrau nijam ke bal bal jaiye, mohe suhaagan keeni" — dawn over a distant dome; a bridal veil drifts down ---------- */
const Scene5: React.FC<{ t: number }> = ({ t }) => {
  const i = 5;
  const o = vis(t, i);
  if (o <= 0) return null;
  const k = local(t, i);
  const veil = tw(k, 0.35, 0.9, INO);
  const sun = tw(k, 0, 0.8);
  const N = 18; const top: string[] = []; const bot: string[] = [];
  for (let j = 0; j <= N; j++) {
    const x = 80 + (920 / N) * j;
    const y0 = -700 + 1220 * veil + 50 * Math.sin(t * 1.3 + j * 0.5);
    top.push(`${x.toFixed(1)},${y0.toFixed(1)}`);
    bot.push(`${(x + 30 * Math.sin(t + j)).toFixed(1)},${(y0 + 520 + 60 * Math.sin(t * 1.1 + j * 0.7)).toFixed(1)}`);
  }
  const d = `M ${top.join(" L ")} L ${bot.reverse().join(" L ")} Z`;
  return (
    <svg width={1080} height={1920} style={{ ...full, opacity: o }}>
      <defs>
        <radialGradient id="sun5"><stop offset="0" stopColor="#fff3c4" /><stop offset="0.4" stopColor="#ffc070" stopOpacity={0.7} /><stop offset="1" stopColor="#ff8a5a" stopOpacity={0} /></radialGradient>
        <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d4143e" stopOpacity={0.85} /><stop offset="1" stopColor="#8c0a2c" stopOpacity={0.75} /></linearGradient>
      </defs>
      <circle cx={540} cy={1160 - 200 * sun} r={520} fill="url(#sun5)" />
      {/* a distant domed shrine and minarets in silhouette (architecture only) */}
      <g transform="translate(540,1240)" fill="#3a1424">
        <rect x={-260} y={-40} width={520} height={120} />
        <path d="M -150 -40 Q -150 -230 0 -270 Q 150 -230 150 -40 Z" />
        <rect x={-6} y={-330} width={12} height={70} />
        <circle cx={0} cy={-340} r={14} />
        {[-300, 300].map((x) => <g key={x}><rect x={x - 16} y={-260} width={32} height={340} /><path d={`M ${x - 24} -260 L ${x} -320 L ${x + 24} -260 Z`} /></g>)}
        {[-180, -90, 0, 90, 180].map((x) => <path key={x} d={`M ${x - 26} 80 L ${x - 26} 10 A 26 26 0 0 1 ${x + 26} 10 L ${x + 26} 80 Z`} fill="#ffcf8a" opacity={0.5 + 0.3 * Math.sin(t * 3 + x)} />)}
      </g>
      <rect x={0} y={1320} width={1080} height={600} fill="#2a0c18" />
      <path d={d} fill="url(#veil)" />
      <path d={`M ${bot.join(" L ")}`} fill="none" stroke={GOLD} strokeWidth={12} strokeDasharray="2 16" strokeLinecap="round" />
      <path d={`M ${bot.join(" L ")}`} fill="none" stroke={GOLD} strokeWidth={4} transform="translate(0,-18)" />
    </svg>
  );
};

/* ---------- lyric block: Nastaliq + Roman, plus the literal meaning in English ---------- */
const Lyric: React.FC<{ t: number }> = ({ t }) => {
  const i = LINES.findIndex((l, j) => t >= l.start - 0.5 && t < NEXT(j) - 0.3);
  if (i < 0) return null;
  const L = LINES[i];
  const o = interpolate(t, [L.start - 0.5, L.start, NEXT(i) - 0.9, NEXT(i) - 0.3], [0, 1, 1, 0], clamp);
  const k = tw(t, L.start - 0.5, L.start + 0.6);
  const en = tw(t, L.start + 0.8, L.start + 1.6);
  const words = L.roman.split(" ");
  const span = Math.max(1, L.end - L.start);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1440, textAlign: "center", opacity: o }}>
      <div dir="rtl" lang="ur" style={{ fontFamily: NAST, fontWeight: 700, fontSize: 48, lineHeight: 1.95, textWrap: "balance", color: CREAM, textShadow: "0 4px 22px rgba(0,0,0,0.8)", transform: `translateY(${(1 - k) * 24}px)` }}>{L.ur}</div>
      <div style={{ marginTop: 4, fontFamily: PLAY, fontStyle: "italic", fontWeight: 600, fontSize: 44, lineHeight: 1.2, textWrap: "balance", color: CREAM, textShadow: "0 4px 18px rgba(0,0,0,0.8)" }}>
        {words.map((w, j) => {
          const on = t >= L.start + (j / words.length) * span;
          return <span key={j} style={{ display: "inline-block", margin: "0 7px", color: on ? GOLD : CREAM, opacity: on ? 1 : 0.55 }}>{w}</span>;
        })}
      </div>
      <div style={{ marginTop: 14, fontFamily: GAR, fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "rgba(255,243,230,0.85)", opacity: en, transform: `translateY(${(1 - en) * 10}px)` }}>“{L.en}”</div>
    </div>
  );
};

const Header: React.FC<{ t: number }> = ({ t }) => {
  const o = tw(t, 0.4, 1.6);
  return (
    <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", opacity: o }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
        <Img src={staticFile("day1/mehfil-e-sama.png")} style={{ width: 58, height: 58, borderRadius: 29 }} />
        <span style={{ fontFamily: MONT, fontWeight: 700, fontSize: 28, letterSpacing: "0.16em", color: CREAM }}>@MEHFIL.E.SAMA</span>
      </div>
    </div>
  );
};

const Intro: React.FC<{ t: number }> = ({ t }) => {
  const o = interpolate(t, [0.2, 1.0, S(0) - 0.8, S(0)], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const k = tw(t, 0.3, 1.8);
  return (
    <div style={{ position: "absolute", top: 640, left: 60, right: 60, textAlign: "center", opacity: o }}>
      <div style={{ fontFamily: PLAY, fontWeight: 700, fontSize: 120, color: CREAM, letterSpacing: "0.02em", transform: `scale(${0.92 + 0.08 * k})`, textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>Chhap <span style={{ fontStyle: "italic", color: GOLD }}>Tilak</span></div>
      <div style={{ marginTop: 18, fontFamily: MONT, fontWeight: 600, fontSize: 28, letterSpacing: "0.14em", color: "rgba(255,243,230,0.9)", lineHeight: 1.6 }}>
        KALAM · HAZRAT AMIR KHUSRAU<br /><span style={{ fontSize: 24 }}>RAHMATULLAHI ALAIH</span>
      </div>
      <div style={{ marginTop: 12, fontFamily: MONT, fontWeight: 700, fontSize: 30, letterSpacing: "0.12em", color: GOLD }}>USTAD NUSRAT FATEH ALI KHAN</div>
    </div>
  );
};

export const ChhapTilak: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const drift = 1.03 + 0.02 * Math.sin(t * 0.15);
  return (
    <AbsoluteFill style={{ background: PLUM }}>
      <Canvas paint={paintBg} />
      <Canvas paint={paintPetals(false)} style={{ opacity: 0.7 }} />
      <div style={{ ...full, transform: `scale(${drift}) translateY(${-10 * Math.sin(t * 0.2)}px)` }}>
        <Scene0 t={t} />
        <Scene1 t={t} />
        <Scene2 t={t} idx={2} />
        <Scene2 t={t} idx={3} gripIdx />
        <Scene4 t={t} />
        <Scene5 t={t} />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(20,3,12,0.78) 80%, rgba(20,3,12,0.9) 100%)" }} />
      <Intro t={t} />
      <Lyric t={t} />
      <Header t={t} />
      <Canvas paint={paintPetals(true)} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      <Canvas paint={paintGrain} w={360} h={640} style={{ opacity: 0.07, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(t, [0, 0.5, CHHAP_DUR - 1.2, CHHAP_DUR], [1, 0, 0, 1], clamp) }} />
      {HAS_AUDIO ? <Audio src={staticFile("qawwali/chhap-tilak.m4a")} /> : null}
    </AbsoluteFill>
  );
};
