import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Words, LineCaption, EndCard, pulseAt, G, QL, Credit } from "../qawwali/QawwaliStory";

/* Mehfil-e-Sama naat · 15 Nov 2026 · "Lam Yati Nazeeruka Fi Nazarin" (kalam of Ala Hazrat Imam Ahmad Raza Khan, Rahmatullahi Alaih,
   Hadaiq-e-Bakhshish), recited by Qari Syed Muhammad Fasihuddin Soharwardi (XvURxcWSkJ8, clip 0.0-41.2 s = the matla, both lines complete;
   the clip stops before the repeat starts at 41.4 s). REAL footage only (Pixabay 207117 lanterns, 112360 Madinah courtyard,
   198164 aerial Green Dome, 112361 Masjid an-Nabawi), no characters. Big words on the reciter's syllables (whisper ur/hi word onsets) + beat pulse.
   Silent render; audio is added in naat.yml. */
export const NAAT1115_DUR = 41.2;
const BEATS = [1.6, 2.272, 2.88, 3.488, 4.128, 4.736, 5.344, 5.92, 6.496, 7.072, 7.68, 8.256, 8.832, 9.408, 10.08, 10.72, 11.36, 11.968, 12.608, 13.216, 13.824, 14.4, 15.008, 15.616, 16.16, 16.768, 17.344, 17.92, 18.464, 19.008, 19.616, 20.224, 20.768, 21.28, 21.856, 22.368, 22.976, 23.552, 24.128, 24.736, 25.376, 26.08, 26.688, 27.264, 27.936, 28.544, 29.152, 29.76, 30.368, 30.944, 31.552, 32.256, 32.896, 33.536, 34.144, 34.816, 35.456, 36.096, 36.64, 37.216, 37.792, 38.4, 39.008, 39.616, 40.256, 40.896];
const L1 = { ur: "لَمْ یَاتِ نَظِیرُکَ فِی نَظَرٍ، مثلِ تو نہ شُد پیدا جانا", roman: "Lam yati nazeeruka fi nazarin, misl-e-tu na shud paida jaana", en: "No eye has ever seen your equal; none like you was ever born, beloved" };
const L2 = { ur: "جگ راج کو تاج تورے سر سو ہے، تجھ کو شہِ دوسرا جانا", roman: "Jag raaj ko taaj tore sar so hai, tujh ko shah-e-dosara jaana", en: "The crown of the world's kingdom is on your head; I know you as king of both worlds" };
const LINES: QL[] = [{ id: "a", start: 3.6, end: 19.5, ...L1 }, { id: "b", start: 19.5, end: 41.0, ...L2 }];
const GROUPS: G[] = [
  { a: 3.7, b: 12.7, words: [{ w: "LAM YATI", t: 3.74, big: true, gold: true }, { w: "NAZEERUKA", t: 5.14, big: true }, { w: "FI NAZARIN", t: 8.12, big: true, gold: true, hold: 9.7 }, { w: "MISL-E-TU", t: 9.82, big: true }] },
  { a: 12.86, b: 19.4, words: [{ w: "na", t: 12.86 }, { w: "SHUD", t: 13.66, big: true }, { w: "PAIDA", t: 14.98, big: true }, { w: "JAANA", t: 17.0, big: true, gold: true, hold: 19.2 }] },
  { a: 19.56, b: 22.9, words: [{ w: "JAG RAAJ", t: 19.56, big: true }, { w: "ko", t: 22.34 }] },
  { a: 23.06, b: 33.3, words: [{ w: "JAG RAAJ", t: 23.06, big: true }, { w: "ko", t: 26.1 }, { w: "TAAJ", t: 26.78, big: true, gold: true, hold: 28.4 }, { w: "TORE", t: 28.54, big: true }, { w: "SAR", t: 30.38, big: true, gold: true }, { w: "so hai", t: 31.4 }] },
  { a: 33.44, b: 40.9, words: [{ w: "tujh ko", t: 33.44 }, { w: "SHAH-E", t: 35.34, big: true, gold: true }, { w: "DOSARA", t: 37.2, big: true, gold: true, hold: 39.4 }, { w: "JAANA", t: 39.6, big: true, gold: true, hold: 40.8 }] },
];
const CREDIT: Credit = { title: ["Lam Yati", "Nazeeruka"], kalam: "KALAM · ALA HAZRAT IMAM AHMAD RAZA KHAN", artist: "QARI SYED FASIHUDDIN SOHARWARDI", rights: "AUDIO © ORIGINAL PUBLISHER · SHARED WITH CREDIT" };

export const Naat1115: React.FC<{ withAudio?: boolean; noBg?: boolean }> = ({ noBg = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t, BEATS);
  const intro = interpolate(t, [0.4, 1.2, 3.0, 3.6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fade = Math.max(interpolate(t, [0, 0.6], [1, 0], { extrapolateRight: "clamp" }), interpolate(t, [NAAT1115_DUR - 0.8, NAAT1115_DUR], [0, 1], { extrapolateLeft: "clamp" }));
  return (
    <AbsoluteFill style={{ background: noBg ? "transparent" : "#000" }}>
      {!noBg && <OffthreadVideo src={staticFile("d1115/naat_bg.mp4")} muted style={{ width: 1080, height: 1920, filter: `brightness(${0.97 + 0.05 * pulse})` }} />}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,4,14,0.5) 0%, rgba(8,4,14,0) 20%, rgba(8,4,14,0) 34%, rgba(8,4,14,0.45) 50%, rgba(8,4,14,0.65) 72%, rgba(8,4,14,0.4) 90%, rgba(8,4,14,0.25) 100%)" }} />
      {intro > 0 && <AbsoluteFill style={{ opacity: intro }}><EndCard t={t + 2} start={0} credit={CREDIT} /></AbsoluteFill>}
      <Words t={t} pulse={pulse} groups={GROUPS} />
      <LineCaption t={t} lines={LINES} until={41.0} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "0.12em", color: "rgba(255,245,232,0.8)", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>ALA HAZRAT (RAH) · QARI FASIHUDDIN SOHARWARDI</div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
