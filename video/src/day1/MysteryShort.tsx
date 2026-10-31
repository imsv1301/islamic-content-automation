import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "./mystery-timing.json";

/* Solve by Sunrise · story-riddle in the warm cinematic 3D-toon style (stills from Cloudflare Workers AI + camera moves).
   Faceless characters only, named Person 1 / 2 / 3. */
type Tok = [string, number, number];
type Line = { id: string; start: number; end: number; tokens: Tok[] };
const LINES = data.lines as unknown as Line[];
export const MYSTERY_DUR = (data.total as number) + 0.6;
const S = (i: number) => LINES[i].start;
const E = (i: number) => LINES[i].end;
const NEXT = (i: number) => (i + 1 < LINES.length ? LINES[i + 1].start : MYSTERY_DUR);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INO = Easing.bezier(0.65, 0, 0.35, 1);
const pop = (t: number, a: number, d = 0.4) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
const tw = (t: number, a: number, b: number, e = OUT) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const prng = (seed: number) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: 1920 };
const MONT = "Montserrat, sans-serif";
const AMBER = "#ffb347", GOLD = "#ffd166", RED = "#e63946", INK = "#1a0f08";

/* shot list: image, camera move (zoom from→to, focus point), which line(s) it covers */
type Shot = { img: string; from: number; to: number; z0: number; z1: number; fx0: number; fy0: number; fx1: number; fy1: number; vertical?: boolean };
const SHOTS: Shot[] = [
  { img: "b_lucid_room.jpg", from: 0, to: 1, z0: 1.18, z1: 1.04, fx0: 0.42, fy0: 0.62, fx1: 0.5, fy1: 0.55, vertical: true },
  { img: "s1_window_a.jpg", from: 1, to: 2, z0: 1.0, z1: 1.12, fx0: 0.4, fy0: 0.5, fx1: 0.45, fy1: 0.55 },
  { img: "c_lucid_person.jpg", from: 2, to: 3, z0: 1.02, z1: 1.16, fx0: 0.5, fy0: 0.4, fx1: 0.5, fy1: 0.48, vertical: true },
  { img: "s2_kitchen_a.jpg", from: 3, to: 4, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.45, fx1: 0.48, fy1: 0.5 },
  { img: "s3_stairs_a.jpg", from: 4, to: 5, z0: 1.0, z1: 1.14, fx0: 0.55, fy0: 0.5, fx1: 0.55, fy1: 0.42 },
  { img: "s4_book_a.jpg", from: 5, to: 6, z0: 1.05, z1: 1.3, fx0: 0.45, fy0: 0.6, fx1: 0.4, fy1: 0.68 },
  { img: "s5_lineup_a.jpg", from: 6, to: 7, z0: 1.16, z1: 1.04, fx0: 0.5, fy0: 0.45, fx1: 0.5, fy1: 0.5 },
];
const shotStart = (s: Shot) => (s.from === 0 ? 0 : S(s.from) - 0.15);
const shotEnd = (s: Shot) => (s.to >= LINES.length ? MYSTERY_DUR : S(s.to) - 0.15);

const ShotLayer: React.FC<{ s: Shot; t: number }> = ({ s, t }) => {
  const a = shotStart(s), b = shotEnd(s);
  if (t < a - 0.01 || t > b + 0.35) return null;
  const k = interpolate(t, [a, b + 0.35], [0, 1], clamp);
  const e = INO(k);
  const z = s.z0 + (s.z1 - s.z0) * e;
  const fx = s.fx0 + (s.fx1 - s.fx0) * e, fy = s.fy0 + (s.fy1 - s.fy0) * e;
  // square sources are scaled to cover the 9:16 frame
  const w = s.vertical ? 1080 : 1920, h = 1920;
  const W = w * z, H = h * z;
  const x = Math.min(0, Math.max(1080 - W, 540 - fx * W)), y = Math.min(0, Math.max(1920 - H, 960 - fy * H));
  const fadeIn = interpolate(t, [a, a + 0.3], [0, 1], clamp);
  return (
    <div style={{ ...full, overflow: "hidden", opacity: s.from === 0 ? 1 : fadeIn }}>
      <Img src={staticFile("mystery/" + s.img)} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translate(${x}px, ${y}px)` }} />
    </div>
  );
};

/* rain streaks over everything (it is raining all morning: the clue) */
const RR = prng(5);
const DROPS = Array.from({ length: 140 }, () => ({ x: RR() * 1200 - 60, y: RR() * 1920, l: 30 + RR() * 60, v: 1400 + RR() * 900, a: 0.08 + RR() * 0.18 }));
const paintRain = (g: CanvasRenderingContext2D, t: number) => {
  g.clearRect(0, 0, 1080, 1920);
  const o = interpolate(t, [S(1) - 0.2, S(1) + 0.4], [0.25, 1], clamp);
  g.lineCap = "round";
  for (const d of DROPS) {
    const y = ((d.y + t * d.v) % 2000) - 40; const x = d.x - (y * 0.12);
    g.strokeStyle = `rgba(255,236,210,${d.a * o})`; g.lineWidth = 2;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x - d.l * 0.12, y + d.l); g.stroke();
  }
};
const paintGrain = (g: CanvasRenderingContext2D, _t: number, f: number) => {
  const r = prng(f * 7 + 3); g.clearRect(0, 0, 360, 640);
  for (let i = 0; i < 2400; i++) { g.fillStyle = r() > 0.5 ? "#fff" : "#000"; g.fillRect(r() * 360, r() * 640, 1, 1); }
};
const Canvas: React.FC<{ paint: (g: CanvasRenderingContext2D, t: number, f: number) => void; w?: number; h?: number; style?: React.CSSProperties }> = ({ paint, w = 1080, h = 1920, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  useLayoutEffect(() => { const g = ref.current?.getContext("2d"); if (g) paint(g, frame / fps, frame); }, [frame, fps, paint]);
  return <canvas ref={ref} width={w} height={h} style={{ ...full, ...style }} />;
};

/* HUD like a story series: day / clock / place, part tag, clue meter */
const CLOCK = ["6:48", "6:48", "6:49", "6:49", "6:50", "6:51", "6:52"];
const PLACE = ["THE OLD HOUSE", "THE OLD HOUSE", "THE GARDEN?", "THE KITCHEN", "UPSTAIRS", "THE ARMCHAIR", "THE OLD HOUSE"];
const HUD: React.FC<{ t: number }> = ({ t }) => {
  const i = Math.max(0, LINES.findIndex((_, j) => t < NEXT(j)));
  const k = pop(t, S(i) - 0.1, 0.35);
  const clues = t < S(2) ? 0 : t < S(3) ? 1 : t < S(4) ? 2 : 3;
  return (
    <>
      <div style={{ position: "absolute", top: 210, left: 60, fontFamily: MONT, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.12em", opacity: 0.9 }}>● DAY 1</div>
        <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1, transform: `translateY(${(1 - k) * 8}px)` }}>{CLOCK[i]}<span style={{ fontSize: 30, marginLeft: 8 }}>AM</span></div>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.14em", opacity: 0.85 }}>{PLACE[i]}</div>
        <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(20,10,4,0.75)", borderRadius: 30, padding: "6px 16px", border: `2px solid ${GOLD}` }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: GOLD, letterSpacing: "0.1em" }}>STATEMENTS</span>
          {[0, 1, 2].map((j) => <span key={j} style={{ width: 16, height: 16, borderRadius: 8, background: j < clues ? GOLD : "rgba(255,255,255,0.25)" }} />)}
        </div>
      </div>
      <div style={{ position: "absolute", top: 220, right: 60, background: RED, color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 30, borderRadius: 30, padding: "8px 24px", boxShadow: "0 6px 18px rgba(0,0,0,0.35)" }}>RIDDLE #3</div>
    </>
  );
};

/* statement cards (Person N + their claim) */
const CLAIMS: [number, string, string, string][] = [
  [2, "PERSON 1", "“I WAS READING IN THE GARDEN.”", "#3a86ff"],
  [3, "PERSON 2", "“I WAS IN THE KITCHEN, BAKING.”", "#ff8fab"],
  [4, "PERSON 3", "“I WAS ASLEEP UPSTAIRS.”", "#7bd389"],
];
const Claim: React.FC<{ t: number }> = ({ t }) => {
  const c = CLAIMS.find(([li]) => t >= S(li) - 0.1 && t < NEXT(li) - 0.2);
  if (!c) return null;
  const [li, who, txt, col] = c;
  const p = pop(t, S(li) + 0.1, 0.45);
  return (
    <div style={{ position: "absolute", top: 560, left: 60, transform: `translateX(${(1 - p) * -500}px)` }}>
      <div style={{ display: "inline-block", background: col, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 30, borderRadius: 14, padding: "6px 18px" }}>{who}</div>
      <div style={{ marginTop: 10, background: "rgba(20,10,4,0.8)", color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 36, borderRadius: 18, padding: "14px 22px", maxWidth: 760, borderLeft: `8px solid ${col}` }}>{txt}</div>
    </div>
  );
};

/* big uppercase captions, two-line chunks, one gold keyword */
const KEY = /lying|lie|rain|raining|garden|kitchen|asleep|upstairs|closely|away|1|2|3|sunrise|vase/i;
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const line = LINES.find((l) => t >= l.start - 0.1 && t <= l.end + 0.25);
  if (!line) return null;
  // chunk into groups of ~4 words, show the chunk being spoken
  const chunks: Tok[][] = []; let cur: Tok[] = [];
  line.tokens.forEach((tk) => { cur.push(tk); if (cur.length >= 4 || /[.,?!:]$/.test(tk[0])) { chunks.push(cur); cur = []; } });
  if (cur.length) chunks.push(cur);
  const ch = chunks.find((c, i) => t < (chunks[i + 1] ? chunks[i + 1][0][1] : line.end + 0.25)) || chunks[chunks.length - 1];
  const k = pop(t, ch[0][1] - 0.05, 0.22);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1180, textAlign: "center", transform: `scale(${0.85 + 0.15 * k})` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 80, lineHeight: 1.05, color: "#fff", textTransform: "uppercase", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", textShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
        {ch.map(([w], i) => <React.Fragment key={i}><span style={{ color: KEY.test(w) ? GOLD : "#fff" }}>{w.replace(/[“”]/g, "")}</span>{i < ch.length - 1 ? " " : ""}</React.Fragment>)}
      </div>
    </div>
  );
};

/* the vote ending: 1 / 2 / 3 */
const Vote: React.FC<{ t: number }> = ({ t }) => {
  const a = S(6);
  if (t < a - 0.1) return null;
  const opts: [string, string, string][] = [["1", "PERSON 1", "THE READER"], ["2", "PERSON 2", "THE BAKER"], ["3", "PERSON 3", "THE SLEEPER"]];
  const cols = ["#2a9d8f", "#e9c46a", RED];
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 470 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 96, color: "#fff", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>WHO LIED?</div>
      {opts.map(([n, p, d], i) => {
        const k = pop(t, a + 0.5 + i * 0.25, 0.4);
        return (
          <div key={i} style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 18, background: cols[i], borderRadius: 22, padding: "12px 22px", border: `4px solid ${INK}`, transform: `translateX(${(1 - k) * 700}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)" }}>
            <div style={{ width: 70, height: 70, borderRadius: 35, background: "#fff", color: INK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 44 }}>{n}</div>
            <div style={{ fontFamily: MONT, color: INK }}>
              <div style={{ fontWeight: 800, fontSize: 40, lineHeight: 1 }}>{p}</div>
              <div style={{ fontWeight: 700, fontSize: 24, letterSpacing: "0.08em" }}>{d}</div>
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 24, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: tw(t, a + 1.4, a + 1.9) }}>COMMENT 1 · 2 · 3 <span style={{ color: GOLD }}>· ANSWER AT SUNRISE</span></div>
    </div>
  );
};

/* cut flash + vignette + warm grade */
const Flash: React.FC<{ t: number }> = ({ t }) => {
  let o = 0;
  for (let i = 1; i < LINES.length; i++) { const c = S(i) - 0.15; o = Math.max(o, interpolate(t, [c - 0.05, c, c + 0.25], [0, 0.55, 0], clamp)); }
  return <AbsoluteFill style={{ background: "#fff3dc", opacity: o }} />;
};

export const MysteryShort: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = f / fps;
  const shake = t > E(0) - 1.2 && t < E(0) - 0.6 ? 5 * Math.sin(t * 60) : 0;
  return (
    <AbsoluteFill style={{ background: "#120a05", transform: `translate(${shake}px,0)` }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} s={s} t={t} />)}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(40,15,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 52%, rgba(30,10,0,0.7) 100%)", mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "radial-gradient(110% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      <AbsoluteFill style={{ background: AMBER, opacity: 0.08, mixBlendMode: "overlay" }} />
      <Canvas paint={paintRain} />
      <HUD t={t} />
      <Claim t={t} />
      <Vote t={t} />
      <Captions t={t} />
      <div style={{ position: "absolute", bottom: 300, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10, alignItems: "center", opacity: 0.85 }}>
        <Img src={staticFile("day1/solve-by-sunrise.png")} style={{ width: 44, height: 44, borderRadius: 22 }} />
        <span style={{ fontFamily: MONT, fontWeight: 700, fontSize: 24, letterSpacing: "0.14em", color: "#fff" }}>SOLVE BY SUNRISE</span>
      </div>
      <Flash t={t} />
      <Canvas paint={paintGrain} w={360} h={640} style={{ opacity: 0.08, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(t, [0, 0.35, MYSTERY_DUR - 0.5, MYSTERY_DUR], [1, 0, 0, 1], clamp) }} />
      <Audio src={staticFile("day1/mystery-mix.m4a")} />
    </AbsoluteFill>
  );
};
