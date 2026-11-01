import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

/* House style engine (approved 31 Oct 2026): warm amber 3D-toon stills + slow camera moves, HUD, info cards,
   big uppercase captions with one gold keyword, particles, grain, cut flashes, CTA/vote ending.
   Each daily video passes its own timing JSON, shot list and overlay cards. Faceless characters only. */
export type Tok = [string, number, number];
export type Line = { id: string; start: number; end: number; tokens: Tok[] };
export type Timing = { total: number; lines: Line[] };
export type Shot = { img: string; from: number; to: number; z0: number; z1: number; fx0: number; fy0: number; fx1: number; fy1: number; vertical?: boolean };
export type Ctx = { t: number; S: (i: number) => number; E: (i: number) => number; NEXT: (i: number) => number; idx: number; dur: number };
export type HouseCfg = {
  timing: Timing;
  mix: string;
  imgDir: string;
  shots: Shot[];
  hud: (c: Ctx) => React.ReactNode;
  cards: (c: Ctx) => React.ReactNode;
  keyword: RegExp;
  logo: string;
  brand: string;
  particles: (c: Ctx) => "rain" | "dust" | "sparkle";
  captionTop?: (c: Ctx) => number;
  captionSize?: number;
  bright?: boolean;
  shakeAt?: number[];
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INO = Easing.bezier(0.65, 0, 0.35, 1);
export const pop = (t: number, a: number, d = 0.4) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
export const tw = (t: number, a: number, b: number, e = OUT) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const prng = (seed: number) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
export const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: 1920 };
export const MONT = "Montserrat, sans-serif";
export const AMBER = "#ffb347", GOLD = "#ffd166", RED = "#e63946", INK = "#1a0f08";

export const houseDur = (tm: Timing) => tm.total + 0.6;

const ShotLayer: React.FC<{ s: Shot; c: Ctx; dir: string; first: boolean }> = ({ s, c, dir, first }) => {
  const { t, S, dur } = c;
  const a = first ? 0 : S(s.from) - 0.15;
  const b = s.to >= 999 ? dur : S(s.to) - 0.15;
  if (t < a - 0.01 || t > b + 0.4) return null;
  const k = interpolate(t, [a, b + 0.4], [0, 1], clamp);
  const e = INO(k);
  const z = s.z0 + (s.z1 - s.z0) * e;
  const fx = s.fx0 + (s.fx1 - s.fx0) * e, fy = s.fy0 + (s.fy1 - s.fy0) * e;
  const w = s.vertical ? 1080 : 1920, h = 1920;
  const W = w * z, H = h * z;
  const x = Math.min(0, Math.max(1080 - W, 540 - fx * W)), y = Math.min(0, Math.max(1920 - H, 960 - fy * H));
  const fadeIn = interpolate(t, [a, a + 0.3], [0, 1], clamp);
  return (
    <div style={{ ...full, overflow: "hidden", opacity: first ? 1 : fadeIn }}>
      <Img src={staticFile(dir + "/" + s.img)} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translate(${x}px, ${y}px)` }} />
    </div>
  );
};

const RR = prng(5);
const DROPS = Array.from({ length: 140 }, () => ({ x: RR() * 1200 - 60, y: RR() * 1920, l: 30 + RR() * 60, v: 1400 + RR() * 900, a: 0.08 + RR() * 0.18 }));
const RD = prng(11);
const MOTES = Array.from({ length: 70 }, () => ({ x: RD() * 1080, y: RD() * 1920, r: 1.5 + RD() * 3.5, vx: -12 + RD() * 24, vy: -18 - RD() * 30, ph: RD() * 6.28, a: 0.25 + RD() * 0.5 }));

const Canvas: React.FC<{ paint: (g: CanvasRenderingContext2D, t: number, f: number) => void; w?: number; h?: number; style?: React.CSSProperties }> = ({ paint, w = 1080, h = 1920, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  useLayoutEffect(() => { const g = ref.current?.getContext("2d"); if (g) paint(g, frame / fps, frame); }, [frame, fps, paint]);
  return <canvas ref={ref} width={w} height={h} style={{ ...full, ...style }} />;
};
const paintGrain = (g: CanvasRenderingContext2D, _t: number, f: number) => {
  const r = prng(f * 7 + 3); g.clearRect(0, 0, 360, 640);
  for (let i = 0; i < 2400; i++) { g.fillStyle = r() > 0.5 ? "#fff" : "#000"; g.fillRect(r() * 360, r() * 640, 1, 1); }
};

export const HouseShort: React.FC<{ cfg: HouseCfg }> = ({ cfg }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = f / fps;
  const L = cfg.timing.lines;
  const dur = houseDur(cfg.timing);
  const S = (i: number) => L[Math.min(i, L.length - 1)].start;
  const E = (i: number) => L[Math.min(i, L.length - 1)].end;
  const NEXT = (i: number) => (i + 1 < L.length ? L[i + 1].start : dur);
  const idx = Math.max(0, L.findIndex((_, j) => t < NEXT(j)));
  const c: Ctx = { t, S, E, NEXT, idx, dur };
  const mode = cfg.particles(c);

  const paintFx = React.useCallback((g: CanvasRenderingContext2D, tt: number) => {
    g.clearRect(0, 0, 1080, 1920);
    if (mode === "rain") {
      g.lineCap = "round";
      for (const d of DROPS) {
        const y = ((d.y + tt * d.v) % 2000) - 40; const x = d.x - y * 0.12;
        g.strokeStyle = `rgba(255,236,210,${d.a})`; g.lineWidth = 2;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x - d.l * 0.12, y + d.l); g.stroke();
      }
    } else {
      for (const m of MOTES) {
        const y = (((m.y + tt * m.vy) % 1920) + 1920) % 1920;
        const x = (((m.x + tt * m.vx + Math.sin(tt * 0.8 + m.ph) * 20) % 1080) + 1080) % 1080;
        const tw2 = 0.6 + 0.4 * Math.sin(tt * 2 + m.ph);
        const col = mode === "sparkle" ? `rgba(255,250,220,${m.a * tw2})` : `rgba(255,214,150,${m.a * tw2 * 0.7})`;
        const gr = g.createRadialGradient(x, y, 0, x, y, m.r * 3);
        gr.addColorStop(0, col); gr.addColorStop(1, "rgba(255,214,150,0)");
        g.fillStyle = gr; g.beginPath(); g.arc(x, y, m.r * 3, 0, 6.29); g.fill();
      }
    }
  }, [mode]);

  // cut flash on every line change
  let flash = 0;
  for (let i = 1; i < L.length; i++) { const cc = S(i) - 0.15; flash = Math.max(flash, interpolate(t, [cc - 0.05, cc, cc + 0.25], [0, cfg.bright ? 0.35 : 0.5, 0], clamp)); }
  let shake = 0;
  for (const i of cfg.shakeAt || []) if (t > S(i) && t < S(i) + 0.45) shake = 6 * Math.sin(t * 60) * (1 - (t - S(i)) / 0.45);

  // captions: chunks of up to 4 words, one gold keyword
  const line = L.find((l) => t >= l.start - 0.1 && t <= l.end + 0.25);
  let caption: React.ReactNode = null;
  if (line) {
    const chunks: Tok[][] = []; let cur: Tok[] = [];
    line.tokens.forEach((tk) => { cur.push(tk); if (cur.length >= 4 || /[.,?!:]$/.test(tk[0])) { chunks.push(cur); cur = []; } });
    if (cur.length) chunks.push(cur);
    const ch = chunks.find((_, i) => t < (chunks[i + 1] ? chunks[i + 1][0][1] : line.end + 0.25)) || chunks[chunks.length - 1];
    const k = pop(t, ch[0][1] - 0.05, 0.22);
    const top = cfg.captionTop ? cfg.captionTop(c) : 1180;
    const size = cfg.captionSize || 78;
    caption = (
      <div style={{ position: "absolute", left: 50, right: 50, top, textAlign: "center", transform: `scale(${0.85 + 0.15 * k})` }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: size, lineHeight: 1.06, color: "#fff", textTransform: "uppercase", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", textShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
          {ch.map(([w], i) => <React.Fragment key={i}><span style={{ color: cfg.keyword.test(w) ? GOLD : "#fff" }}>{w.replace(/[“”]/g, "")}</span>{i < ch.length - 1 ? " " : ""}</React.Fragment>)}
        </div>
      </div>
    );
  }

  return (
    <AbsoluteFill style={{ background: "#120a05", transform: `translate(${shake}px,0)` }}>
      {cfg.shots.map((s, i) => <ShotLayer key={i} s={s} c={c} dir={cfg.imgDir} first={i === 0} />)}
      <AbsoluteFill style={{ background: cfg.bright ? "linear-gradient(180deg, rgba(60,25,0,0.35) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(40,15,0,0.5) 100%)" : "linear-gradient(180deg, rgba(40,15,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 52%, rgba(30,10,0,0.7) 100%)", mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: `radial-gradient(110% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,${cfg.bright ? 0.3 : 0.55}) 100%)` }} />
      <AbsoluteFill style={{ background: AMBER, opacity: 0.08, mixBlendMode: "overlay" }} />
      <Canvas paint={paintFx} />
      {cfg.hud(c)}
      {cfg.cards(c)}
      {caption}
      <div style={{ position: "absolute", bottom: 300, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10, alignItems: "center", opacity: 0.85 }}>
        <Img src={staticFile(cfg.logo)} style={{ width: 44, height: 44, borderRadius: 22 }} />
        <span style={{ fontFamily: MONT, fontWeight: 700, fontSize: 24, letterSpacing: "0.14em", color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>{cfg.brand}</span>
      </div>
      <AbsoluteFill style={{ background: "#fff3dc", opacity: flash }} />
      <Canvas paint={paintGrain} w={360} h={640} style={{ opacity: 0.08, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(t, [0, 0.35, dur - 0.5, dur], [1, 0, 0, 1], clamp) }} />
      <Audio src={staticFile(cfg.mix)} />
    </AbsoluteFill>
  );
};

/* shared HUD block: dot+day, big heading, sub place, optional pill; plus a tag on the right */
export const HudBlock: React.FC<{ t: number; at: number; day: string; big: React.ReactNode; place: string; pill?: React.ReactNode; tag: string; tagBg: string; tagFg?: string }> = ({ t, at, day, big, place, pill, tag, tagBg, tagFg = "#fff" }) => {
  const k = pop(t, at - 0.1, 0.35);
  return (
    <>
      <div style={{ position: "absolute", top: 210, left: 60, fontFamily: MONT, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.12em", opacity: 0.9 }}>● {day}</div>
        <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1, transform: `translateY(${(1 - k) * 8}px)` }}>{big}</div>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.14em", opacity: 0.85 }}>{place}</div>
        {pill}
      </div>
      <div style={{ position: "absolute", top: 220, right: 60, background: tagBg, color: tagFg, fontFamily: MONT, fontWeight: 800, fontSize: 30, borderRadius: 30, padding: "8px 24px", boxShadow: "0 6px 18px rgba(0,0,0,0.35)" }}>{tag}</div>
    </>
  );
};
