import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import data from "./chhap-timing.json";
import beats from "./chhap-beats.json";

/* Mehfil-e-Sama · story style. Illustrated scenes that act out each line, with big words that land on the singer's
   syllables and pulse on the beat.
   Rules: never show Allah, the Prophet ﷺ, any prophet, Sahaba, Ahl-e-Bait, Awliya (so not Khusrau or Nizamuddin), or any
   deity/idol/religious mark of another faith; the Beloved ("Piya") is only ever light. No wine, no tilak drawn.
   No spinning/rotating text, no tool branding. */
export const STORY_DUR = data.total as number;
export type QL = { id: string; start: number; end: number; ur: string; roman: string; en: string };
const LINES = data.lines as QL[];
const BEATS = beats.beats as number[];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INO = Easing.bezier(0.65, 0, 0.35, 1);
const GOLD = "#f6d27a", CREAM = "#fff5e8";
const PLAY = "'Playfair Display', serif", GAR = "'EB Garamond', serif", MONT = "Montserrat, sans-serif", NAST = "'Noto Nastaliq Urdu', serif";
const img = (n: string) => staticFile(`qawwali/story/${n}.jpg`);

/* ---------- scenes: [image, from, to, camera] ---------- */
type Cam = { s: [number, number]; x: [number, number]; y: [number, number] };
type Scene = { n: string; a: number; b: number; cam: Cam };
const SC: Scene[] = [
  { n: "q0_river", a: 0, b: 5.6, cam: { s: [1.08, 1.2], x: [0, 0], y: [40, -60] } },
  { n: "q0_seeker", a: 5.6, b: 11.3, cam: { s: [1.18, 1.06], x: [-20, 10], y: [0, 0] } },
  { n: "q1_enter", a: 11.3, b: 13.0, cam: { s: [1.05, 1.14], x: [0, 0], y: [0, 30] } },
  { n: "q1_sink", a: 13.0, b: 15.5, cam: { s: [1.1, 1.2], x: [0, 0], y: [-40, 60] } },
  { n: "q1_paar", a: 15.5, b: 18.6, cam: { s: [1.2, 1.06], x: [0, 0], y: [30, -20] } },
  { n: "q2_mirror", a: 18.6, b: 24.9, cam: { s: [1.06, 1.18], x: [10, -10], y: [0, 0] } },
  { n: "q2_lane", a: 24.9, b: 33.0, cam: { s: [1.04, 1.32], x: [0, 0], y: [0, -40] } },
  { n: "q3_door", a: 33.0, b: 40.0, cam: { s: [1.06, 1.38], x: [0, 0], y: [0, 0] } },
  { n: "q3_light", a: 40.0, b: 43.6, cam: { s: [1.16, 1.06], x: [0, 0], y: [0, 0] } },
  { n: "q3_light_b", a: 43.6, b: 47.7, cam: { s: [1.06, 1.16], x: [0, 0], y: [0, -20] } },
  { n: "q4_petals", a: 47.7, b: 51.8, cam: { s: [1.06, 1.2], x: [0, 0], y: [20, -40] } },
  { n: "q4_eyes", a: 51.8, b: 56.3, cam: { s: [1.04, 1.18], x: [0, 0], y: [0, 0] } },
  { n: "q4_eyes_b", a: 56.3, b: 61.8, cam: { s: [1.16, 1.04], x: [0, 0], y: [0, 0] } },
  { n: "q4_mehfil", a: 61.8, b: 74.5, cam: { s: [1.18, 1.04], x: [0, 0], y: [-30, 10] } },
];
const XF = 0.45; // cross-dissolve length
const FLASH = [16.1, 40.0, 47.8]; // light blooms: reaching the shore, seeing the Beloved, "chhap tilak"

/* ---------- big words (times are the singer's syllable onsets) ---------- */
export type W = { w: string; t: number; big?: boolean; gold?: boolean; hold?: number };
export type G = { a: number; b: number; words: W[] };
const GROUPS: G[] = [
  { a: 2.9, b: 10.9, words: [{ w: "Khusrau", t: 2.98 }, { w: "DARIYA", t: 4.34, big: true }, { w: "PREM", t: 5.2, big: true, gold: true }, { w: "ka", t: 5.86 }, { w: "ULTI", t: 6.48, big: true, hold: 8.1 }, { w: "wa ki", t: 8.16 }, { w: "DHAAR", t: 9.08, big: true, gold: true, hold: 10.7 }] },
  { a: 11.3, b: 16.95, words: [{ w: "jo", t: 11.42 }, { w: "UTRA", t: 11.6, big: true }, { w: "so", t: 12.32 }, { w: "DOOB", t: 13.0, big: true }, { w: "GAYA", t: 13.66, big: true }, { w: "jo", t: 14.08 }, { w: "DOOBA", t: 14.82, big: true }, { w: "so", t: 15.58 }, { w: "PAAR", t: 16.1, big: true, gold: true }] },
  { a: 16.72, b: 24.95, words: [{ w: "APNI", t: 16.72, big: true, hold: 18.6 }, { w: "CHHAB", t: 18.72, big: true, gold: true }, { w: "BANAIKE", t: 19.16, big: true }, { w: "jo main", t: 20.36 }, { w: "PI KE", t: 21.44, big: true }, { w: "PAAS", t: 22.16, big: true, gold: true }, { w: "gayi", t: 22.9 }] },
  { a: 25.0, b: 40.0, words: [{ w: "APNI", t: 25.06, big: true }, { w: "CHHAB", t: 25.7, big: true, gold: true, hold: 34.8 }, { w: "BANAIKE", t: 34.84, big: true }, { w: "jo main", t: 36.14 }, { w: "PI KE PAAS", t: 37.16, big: true, gold: true }, { w: "gayi", t: 38.94 }] },
  { a: 40.0, b: 47.7, words: [{ w: "CHHAB", t: 40.02, big: true }, { w: "DEKHI", t: 41.18, big: true }, { w: "jab", t: 41.9 }, { w: "PIYA KI", t: 42.52, big: true, gold: true }, { w: "main", t: 43.58 }, { w: "APNI", t: 44.48, big: true }, { w: "BHOOL GAYI", t: 45.36, big: true, gold: true, hold: 47.5 }] },
  { a: 47.8, b: 51.8, words: [{ w: "CHHAP", t: 47.82, big: true, gold: true }, { w: "TILAK", t: 48.44, big: true, gold: true }, { w: "SAB", t: 49.16, big: true }, { w: "CHHEEN LI", t: 49.68, big: true, hold: 51.0 }, { w: "re", t: 51.34 }] },
  { a: 51.84, b: 59.2, words: [{ w: "MOSE", t: 51.84, big: true, hold: 56.3 }, { w: "NAINA", t: 56.4, big: true, gold: true }, { w: "MILAIKE", t: 57.38, big: true, hold: 58.6 }] },
];

/* beat pulse 0..1, decays ~150ms after each beat */
export const pulseAt = (t: number, beatList: number[] = BEATS) => {
  let p = 0;
  for (const b of beatList) { if (b > t) break; const d = t - b; if (d < 0.35) p = Math.max(p, Math.exp(-d / 0.12)); }
  return p;
};

const SceneLayer: React.FC<{ s: Scene; t: number; pulse: number }> = ({ s, t, pulse }) => {
  const o = interpolate(t, [s.a - XF / 2, s.a + XF / 2, s.b - XF / 2, s.b + XF / 2], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const k = interpolate(t, [s.a, s.b], [0, 1], { ...clamp, easing: INO });
  const sc = s.cam.s[0] + (s.cam.s[1] - s.cam.s[0]) * k + 0.012 * pulse;
  const x = s.cam.x[0] + (s.cam.x[1] - s.cam.x[0]) * k, y = s.cam.y[0] + (s.cam.y[1] - s.cam.y[0]) * k;
  return (
    <AbsoluteFill style={{ opacity: s.a === 0 ? 1 : o, overflow: "hidden" }}>
      <Img src={img(s.n)} style={{ position: "absolute", width: 1080, height: 1920, objectFit: "cover", transform: `translate(${x}px, ${y}px) scale(${sc})`, filter: `brightness(${0.94 + 0.08 * pulse}) saturate(1.06)` }} />
    </AbsoluteFill>
  );
};

/* golden dust drifting up, a few more on each beat */
const prng = (seed: number) => { let v = seed; return () => { v = (v * 16807) % 2147483647; return (v - 1) / 2147483646; }; };
const R = prng(7);
const MOTES = Array.from({ length: 90 }, () => ({ x: R() * 1080, y: R() * 1920, v: 18 + R() * 50, r: 1.2 + R() * 3.2, ph: R() * 6.28, a: 0.25 + R() * 0.6 }));
const Motes: React.FC<{ pulse: number }> = ({ pulse }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  useLayoutEffect(() => {
    const g = ref.current?.getContext("2d"); if (!g) return;
    g.clearRect(0, 0, 1080, 1920);
    for (const m of MOTES) {
      const y = (((m.y - t * m.v) % 1920) + 1920) % 1920, x = m.x + Math.sin(t * 0.7 + m.ph) * 18;
      const a = m.a * (0.55 + 0.45 * Math.sin(t * 2 + m.ph)) * (0.8 + 0.5 * pulse);
      const gr = g.createRadialGradient(x, y, 0, x, y, m.r * 4);
      gr.addColorStop(0, `rgba(255,226,150,${a})`); gr.addColorStop(1, "rgba(255,226,150,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, m.r * 4, 0, 6.283); g.fill();
    }
  }, [t, pulse]);
  return <canvas ref={ref} width={1080} height={1920} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }} />;
};

const Word: React.FC<{ w: W; t: number; newest: boolean; pulse: number }> = ({ w, t, newest, pulse }) => {
  const d = t - w.t;
  if (d < -0.02) return null;
  const k = interpolate(d, [0, 0.38], [0, 1], { ...clamp, easing: OUT });
  const op = interpolate(d, [0, 0.12], [0, 1], clamp);
  const size = w.big ? 132 : 64;
  const stretch = w.hold ? interpolate(t, [w.t + 0.25, w.hold], [0, 0.28], { ...clamp, easing: INO }) : 0;
  const scale = (1.45 - 0.45 * k) * (newest ? 1 + 0.045 * pulse : 0.9);
  const base: React.CSSProperties = {
    display: "inline-block", margin: w.big ? "0 18px" : "0 12px", opacity: op * (newest ? 1 : 0.78),
    transform: `translateY(${(1 - k) * 34}px) scale(${scale})`, filter: `blur(${(1 - k) * 10}px)`, transformOrigin: "50% 60%",
    letterSpacing: `${0.02 + stretch}em`, lineHeight: w.big ? 1.02 : 1.4, verticalAlign: "baseline", whiteSpace: "nowrap",
  };
  if (!w.big) return <span style={{ ...base, fontFamily: GAR, fontStyle: "italic", fontWeight: 600, fontSize: size, color: CREAM, textShadow: "0 4px 24px rgba(0,0,0,0.9)" }}>{w.w}</span>;
  const fill = w.gold
    ? { background: "linear-gradient(180deg,#fff3c4 0%,#f6d27a 45%,#c9902a 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
    : { color: CREAM };
  const glow = w.gold ? `drop-shadow(0 0 ${18 + 26 * (newest ? pulse : 0)}px rgba(255,200,90,0.75)) drop-shadow(0 6px 18px rgba(0,0,0,0.85))` : "drop-shadow(0 6px 20px rgba(0,0,0,0.9))";
  return <span style={{ ...base, fontFamily: PLAY, fontWeight: 700, fontSize: size, ...fill, filter: `${base.filter} ${glow}` }}>{w.w}</span>;
};

export const Words: React.FC<{ t: number; pulse: number; groups?: G[] }> = ({ t, pulse, groups = GROUPS }) => {
  const g = groups.find((x) => t >= x.a - 0.05 && t < x.b + 0.5);
  if (!g) return null;
  const out = interpolate(t, [g.b, g.b + 0.45], [0, 1], { ...clamp, easing: INO });
  const shown = g.words.filter((w) => t >= w.t - 0.02);
  const newest = shown[shown.length - 1];
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 760, height: 560, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - out, transform: `translateY(${-30 * out}px)`, filter: `blur(${8 * out}px)` }}>
      <div style={{ textAlign: "center", textWrap: "balance" as React.CSSProperties["textWrap"] }}>
        {g.words.map((w, i) => <Word key={i} w={w} t={t} newest={w === newest} pulse={pulse} />)}
      </div>
    </div>
  );
};

export const LineCaption: React.FC<{ t: number; lines?: QL[]; until?: number }> = ({ t, lines = LINES, until = 60.5 }) => {
  const L = lines.find((l, i) => t >= l.start - 0.3 && t < (lines[i + 1]?.start ?? until) - 0.3);
  if (!L || t > until) return null;
  const nextStart = lines[lines.indexOf(L) + 1]?.start ?? until;
  const o = interpolate(t, [L.start - 0.3, L.start + 0.3, nextStart - 0.7, nextStart - 0.3], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1340, textAlign: "center", opacity: o }}>
      <div dir="rtl" lang="ur" style={{ fontFamily: NAST, fontWeight: 700, fontSize: 40, lineHeight: 1.9, color: CREAM, textShadow: "0 3px 18px rgba(0,0,0,0.95)" }}>{L.ur}</div>
      <div style={{ marginTop: 2, fontFamily: GAR, fontStyle: "italic", fontSize: 33, lineHeight: 1.25, color: "rgba(255,245,232,0.9)", textShadow: "0 3px 14px rgba(0,0,0,0.95)" }}>“{L.en}”</div>
    </div>
  );
};

export type Credit = { title: [string, string]; kalam: string; artist: string; rights: string };
const CHHAP_CREDIT: Credit = { title: ["Chhap", "Tilak"], kalam: "KALAM · HAZRAT AMIR KHUSRAU", artist: "USTAD NUSRAT FATEH ALI KHAN", rights: "AUDIO © OSA · SHARED WITH CREDIT" };
export const EndCard: React.FC<{ t: number; start?: number; credit?: Credit }> = ({ t, start = 62.4, credit = CHHAP_CREDIT }) => {
  const k = interpolate(t, [start, start + 1.2], [0, 1], { ...clamp, easing: OUT });
  if (k <= 0) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", opacity: k }}>
      <div style={{ transform: `translateY(${(1 - k) * 30}px)`, marginTop: -260 }}>
        <div style={{ fontFamily: PLAY, fontWeight: 700, fontSize: credit.title.join(" ").length > 12 ? 104 : 118, lineHeight: 1.05, color: CREAM, textShadow: "0 10px 40px rgba(0,0,0,0.75)" }}>{credit.title[0]}{credit.title.join(" ").length > 12 ? <br /> : " "}<span style={{ fontStyle: "italic", background: "linear-gradient(180deg,#fff3c4,#f6d27a 45%,#c9902a)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{credit.title[1]}</span></div>
        <div style={{ marginTop: 22, fontFamily: MONT, fontWeight: 600, fontSize: 28, letterSpacing: "0.14em", color: CREAM, lineHeight: 1.7, textShadow: "0 3px 14px rgba(0,0,0,0.9)" }}>
          {credit.kalam} <span style={{ fontSize: 22 }}>(RAH)</span><br />
          <span style={{ color: GOLD, fontWeight: 700, fontSize: 31 }}>{credit.artist}</span><br />
          <span style={{ fontSize: 22, opacity: 0.85 }}>{credit.rights}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const QawwaliStory: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t);
  const flash = Math.max(0, ...FLASH.map((f) => interpolate(t, [f - 0.08, f, f + 0.9], [0, 1, 0], { ...clamp, easing: OUT })));
  const fadeIn = interpolate(t, [0, 0.8], [1, 0], clamp), fadeOut = interpolate(t, [STORY_DUR - 1.4, STORY_DUR], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#0b0612" }}>
      {SC.map((s) => <SceneLayer key={s.n} s={s} t={t} pulse={pulse} />)}
      {/* legibility: dark band behind the words and captions, soft vignette */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,4,14,0.55) 0%, rgba(8,4,14,0) 22%, rgba(8,4,14,0) 34%, rgba(8,4,14,0.5) 52%, rgba(8,4,14,0.72) 72%, rgba(8,4,14,0.45) 88%, rgba(8,4,14,0.2) 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      <Motes pulse={pulse} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(255,226,160,1) 0%, rgba(255,200,110,0.6) 35%, rgba(255,200,110,0) 75%)", opacity: flash * 0.75, mixBlendMode: "screen" }} />
      <Words t={t} pulse={pulse} />
      <LineCaption t={t} />
      <EndCard t={t} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fadeIn, fadeOut) }} />
      {withAudio && <Audio src={staticFile("qawwali/chhap-tilak.m4a")} />}
    </AbsoluteFill>
  );
};
