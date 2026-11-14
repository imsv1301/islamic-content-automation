import React from "react";
import { interp } from "../qawwali/anim/Seeker";
import { prng } from "../qawwali/anim/QawwaliAnim";

/* Shared helpers for the daily animated Shorts (14 Nov 2026 onwards). */
export type Tok = [string, number, number];
export type TLine = { id: string; start: number; end: number; tokens: Tok[] };
export type Timing = { total: number; lines: TLine[] };
export const W = 1080, H = 1920;

export const pop = (t: number, at: number, d = 0.35) => { const x = Math.min(1, Math.max(0, (t - at) / d)); return x <= 0 ? 0 : 1 - Math.pow(1 - x, 3) * Math.cos(x * 5); };
export const lin = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));

/* time helpers driven by the timing JSON so scenes stay locked to the voice */
export const mkT = (TL: Timing) => {
  const L = (i: number) => TL.lines[i];
  /* start time of the first token in line i whose text contains `w` (case-insensitive); falls back to line start */
  const wt = (i: number, w: string, nth = 0) => {
    const hits = L(i).tokens.filter((x) => x[0].toLowerCase().replace(/[^a-z0-9£']/g, "").includes(w.toLowerCase()));
    return hits[nth] ? hits[nth][1] : L(i).start;
  };
  const we = (i: number, w: string) => { const h = L(i).tokens.find((x) => x[0].toLowerCase().includes(w.toLowerCase())); return h ? h[2] : L(i).end; };
  return { L, wt, we };
};

/* karaoke captions: window of up to 6 words around the current word */
export const Captions: React.FC<{ t: number; TL: Timing; top?: number; font: string; hi: string; base: string; done: string; bg: string; size?: number; skip?: (w: string) => boolean }> = ({ t, TL, top = 1560, font, hi, base, done, bg, size = 60 }) => {
  const Ln = TL.lines.find((l) => t >= l.start - 0.1 && t <= l.end + 0.35);
  if (!Ln) return null;
  const toks = Ln.tokens;
  const cur = toks.findIndex((x) => t < x[2]);
  const ci = cur === -1 ? toks.length - 1 : cur;
  const per = 6, start = Math.floor(ci / per) * per, win = toks.slice(start, start + per);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top, textAlign: "center" }}>
      <div style={{ display: "inline-block", background: bg, borderRadius: 34, padding: "14px 28px", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
        {win.map((w, i) => {
          const on = t >= w[1] && t < w[2] + 0.05, dn = t >= w[2];
          return <span key={i} style={{ fontFamily: font, fontWeight: 800, fontSize: size, lineHeight: 1.25, margin: "0 9px", color: on ? hi : dn ? done : base, display: "inline-block", transform: `scale(${on ? 1.1 : 1})` }}>{w[0]}</span>;
        })}
      </div>
    </div>
  );
};

export const Card: React.FC<{ t: number; a: number; b: number; top: number; children: React.ReactNode; bg?: string; fg?: string; font: string; size?: number; border?: string }> = ({ t, a, b, top, children, bg = "#2e7d5b", fg = "#fff", font, size = 50, border }) => {
  if (t < a || t > b) return null;
  const p = pop(t, a, 0.4), o = interp(t, [b - 0.3, b], [1, 0]);
  return <div style={{ position: "absolute", left: 40, right: 40, top, textAlign: "center", opacity: o, transform: `scale(${0.6 + 0.4 * p})` }}>
    <div style={{ display: "inline-block", background: bg, color: fg, borderRadius: 30, padding: "18px 34px", fontFamily: font, fontWeight: 800, fontSize: size, letterSpacing: "0.02em", boxShadow: "0 12px 30px rgba(0,0,0,0.3)", border }}>{children}</div></div>;
};

export const Sparkles: React.FC<{ t: number; at: number; cx: number; cy: number; n?: number; c?: string }> = ({ t, at, cx, cy, n = 10, c = "#ffd166" }) => {
  if (t < at || t > at + 1.2) return null;
  const d = t - at, r = rn(Math.round(at * 100) + 3);
  return <g>{Array.from({ length: n }, (_, i) => { const a = r() * 6.28, v = 160 + r() * 220, x = cx + Math.cos(a) * v * Math.min(d, 0.8), y = cy + Math.sin(a) * v * Math.min(d, 0.8); const o = Math.max(0, 1 - d / 1.1); return <path key={i} transform={`translate(${x} ${y}) scale(${0.6 + r()})`} d="M 0 -20 L 6 -6 L 20 0 L 6 6 L 0 20 L -6 6 L -20 0 L -6 -6 Z" fill={i % 2 ? c : "#fff"} opacity={o} />; })}</g>;
};
export const Heart: React.FC<{ x: number; y: number; s: number; o: number; c?: string }> = ({ x, y, s, o, c = "#ff5a7a" }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z" fill={c} opacity={o} />
);
export const Rain: React.FC<{ t: number; n?: number; o?: number }> = ({ t, n = 70, o = 0.35 }) => (
  <g opacity={o}>{Array.from({ length: n }, (_, i) => { const r = rn(i + 300), x = r() * (W + 200) - 100, sp = 1600 + r() * 900, y = ((r() * H + t * sp) % (H + 200)) - 100; return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 46} stroke="#bcd3ff" strokeWidth={2.5} />; })}</g>
);
/* simple drawn hand (palm toward viewer), origin = wrist */
export const Hand: React.FC<{ x: number; y: number; s?: number; r?: number; skin?: string; flip?: boolean; curl?: number }> = ({ x, y, s = 1, r = 0, skin = "#d9a77f", flip, curl = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${flip ? -s : s},${s})`}>
    <path d="M -60 0 Q -70 -90 -50 -150 L 50 -150 Q 70 -90 60 0 Z" fill={skin} />
    {[-42, -14, 14, 42].map((fx, i) => <rect key={i} x={fx - 13} y={-150 - (i === 0 || i === 3 ? 80 : 110) * (1 - curl)} width={26} height={(i === 0 || i === 3 ? 90 : 120) * (1 - curl) + 10} rx={13} fill={skin} />)}
    <rect x={56} y={-120} width={26} height={90} rx={13} fill={skin} transform="rotate(35 60 -80)" />
    <path d="M -60 0 L 60 0" stroke="#00000022" strokeWidth={6} />
  </g>
);
/* seeded random with a warmed-up state (prng's first draw is tiny for small seeds) */
export const rn = (seed: number) => { const r = prng(seed * 7919 + 104729); r(); r(); return r; };
