import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig, OffthreadVideo, Img } from "remotion";
import clips from "./naat1-clips.json";
import { Audio } from "@remotion/media";

/* ---------------------------------------------------------------------------
   Naat template — lyric lines with per-word timings (verse-complete clip).
   Kalam: Ala Hazrat Imam Ahmad Raza Khan (Rahmatullahi Alaih), Hadaiq-e-Bakhshish.
   Recitation: Owais Raza Qadri.  Clip = the complete matla (0 – 61 s).
--------------------------------------------------------------------------- */
type Wd = [string, string, number, number]; // urdu, roman, start, end
const M1R = ["Sab", "se", "Aula", "o", "Aala", "Hamara", "Nabi"];
const M1U = ["سب", "سے", "اولیٰ", "و", "اعلیٰ", "ہمارا", "نبی"];
const M2R = ["Sab", "se", "Bala", "o", "Wala", "Hamara", "Nabi"];
const M2U = ["سب", "سے", "بالا", "و", "والا", "ہمارا", "نبی"];
const mk = (u: string[], r: string[], t: [number, number][]): Wd[] => u.map((w, i) => [w, r[i], t[i][0], t[i][1]]);
const LINES: { start: number; end: number; words: Wd[] }[] = [
  { start: 0.0, end: 9.12, words: mk(M1U, M1R, [[0, 0.56], [0.56, 1.16], [1.16, 3.68], [3.68, 3.7], [3.68, 5.42], [5.42, 7.66], [7.66, 9.12]]) },
  { start: 9.12, end: 27.9, words: mk(M1U, M1R, [[9.12, 9.66], [9.66, 10.16], [10.16, 12.62], [12.62, 12.64], [12.62, 24.92], [24.92, 26.8], [26.8, 27.16]]) },
  { start: 28.5, end: 35.66, words: mk(M1U, M1R, [[28.64, 30.04], [30.04, 30.34], [30.34, 31.92], [31.92, 32.0], [32.0, 33.6], [33.6, 34.5], [34.5, 35.66]]) },
  { start: 35.66, end: 44.04, words: mk(M2U, M2R, [[35.66, 36.48], [36.48, 36.86], [36.86, 38.3], [38.3, 38.66], [38.66, 40.48], [40.48, 42.66], [42.66, 44.04]]) },
  { start: 44.04, end: 52.82, words: mk(M2U, M2R, [[44.04, 44.68], [44.68, 45.2], [45.2, 47.02], [47.02, 47.36], [47.36, 49.06], [49.06, 51.32], [51.32, 52.82]]) },
  { start: 52.82, end: 62.2, words: mk(M1U, M1R, [[52.82, 53.36], [53.36, 53.94], [53.94, 56.3], [56.3, 56.32], [56.3, 57.92], [57.92, 59.9], [59.9, 61.04]]) },
];
export const NAAT_REAL_DUR = 62.6;
const NAAT_DUR = NAAT_REAL_DUR;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INO = Easing.bezier(0.65, 0, 0.35, 1);
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };
const prng = (seed: number) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: 1920 };

/* ---------------- lyric overlay ---------------- */
const Lyric: React.FC<{ t: number }> = ({ t }) => {
  const li = LINES.findIndex((l) => t >= l.start - 0.2 && t < l.end);
  if (li < 0) return null;
  const L = LINES[li];
  const o = interpolate(t, [L.start - 0.2, L.start + 0.3, L.end - 0.35, L.end], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 470, textAlign: "center", opacity: o }}>
      <div dir="rtl" lang="ur" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", fontWeight: 700, fontSize: 64, lineHeight: 2.1, color: "#ffffff", textShadow: "0 4px 22px rgba(0,0,0,0.75)", whiteSpace: "nowrap" }}>
        {L.words.map(([u, , a, b], i) => {
          const on = t >= a - 0.05;
          const cur = t >= a - 0.05 && t < b + 0.1;
          return <span key={i} style={{ display: "inline-block", margin: "0 8px", opacity: on ? 1 : 0.28, color: cur ? "#f3cf6a" : "#ffffff", translate: `0px ${on ? 0 : 10}px` }}>{u}{i === L.words.length - 1 ? <span style={{ fontFamily: "Amiri, serif", fontSize: 50, marginRight: 8 }}>ﷺ</span> : null}</span>;
        })}
      </div>
      <div style={{ marginTop: -8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 34, letterSpacing: "0.08em", color: "#ffffff", textShadow: "0 3px 14px rgba(0,0,0,0.8)", whiteSpace: "nowrap" }}>
        {L.words.map(([, r, a, b], i) => {
          const on = t >= a - 0.05;
          const cur = t >= a - 0.05 && t < b + 0.1;
          return <span key={i} style={{ display: "inline-block", margin: "0 7px", opacity: on ? 1 : 0.3, color: cur ? "#f3cf6a" : "#ffffff" }}>{r.toUpperCase()}{i === L.words.length - 1 ? <span style={{ fontFamily: "Amiri, serif", marginLeft: 8 }}>ﷺ</span> : null}</span>;
        })}
      </div>
    </div>
  );
};

/* grain + vignette + grade */
const Grain: React.FC<{ frame: number }> = ({ frame }) => {
  const r = prng(frame * 7 + 1);
  return (
    <svg viewBox="0 0 270 480" style={{ ...full, opacity: 0.07, mixBlendMode: "overlay" }} preserveAspectRatio="none">
      {Array.from({ length: 900 }, (_, i) => <rect key={i} x={r() * 270} y={r() * 480} width={1} height={1} fill={r() > 0.5 ? "#fff" : "#000"} />)}
    </svg>
  );
};


type Clip = { file: string; a: number; b: number; from: number; pan: number; zoom: [number, number]; credit: string; fx: number };
const SHOTS = clips as unknown as Clip[];

const Shot: React.FC<{ c: Clip; t: number }> = ({ c, t }) => {
  const u = interpolate(t, [c.a, c.b], [0, 1], clamp);
  const z = c.zoom[0] + (c.zoom[1] - c.zoom[0]) * u;
  const x = c.pan * (u - 0.5) * 120;
  return (
    <div style={{ ...full, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(c.file)} muted startFrom={Math.round(c.from * 30)}
        style={{ position: "absolute", height: 1920, width: 3413, left: Math.max(-2333, Math.min(0, -(c.fx * 3413 - 540))) + x, top: 0, objectFit: "cover", transform: `scale(${z})`, filter: "saturate(1.05) contrast(1.04)" }} />
    </div>
  );
};

export const NaatReal: React.FC<{ overlay?: boolean }> = ({ overlay = false }) => {
  const t = useT();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: overlay ? "transparent" : "#000" }}>
      {overlay ? null : <OffthreadVideo src={staticFile("naat1/bg.mp4")} muted style={{ ...full }} />}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.25) 38%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.1) 66%, rgba(0,0,0,0.6) 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)" }} />
      <Lyric t={t} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 28, lineHeight: 1.45, letterSpacing: "0.06em", color: "rgba(255,255,255,0.85)", opacity: interpolate(t, [1, 2], [0, 1], clamp) }}>
        OWAIS RAZA QADRI<br />KALAM: ALA HAZRAT (RAHMATULLAHI ALAIH)
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, opacity: 0.8 }}>
        <Img src={staticFile("day1/mehfil-e-sama.png")} style={{ width: 44, height: 44, borderRadius: 22 }} />
        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: "0.1em", color: "#ffffff" }}>@MEHFIL.E.SAMA</span>
      </div>
      <Grain frame={frame} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(t, [61.3, NAAT_DUR], [0, 1], { ...clamp, easing: OUT }) }} />
      {overlay ? null : <Audio src={staticFile("naat/sab-se-aula.m4a")} />}
    </AbsoluteFill>
  );
};
