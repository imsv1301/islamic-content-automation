import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import beats from "../qawwali/aula-beats.json";
import { Words, LineCaption, EndCard, pulseAt, G, QL, Credit } from "../qawwali/QawwaliStory";

/* Mehfil-e-Sama naat · 24 Nov 2026 · "Sab Se Aula o Aala Hamara Nabi" (kalam of Ala Hazrat Imam Ahmad Raza Khan Rahmatullahi Alaih,
   Hadaiq-e-Bakhshish, pre-1929 -> lyrics allowed), recited by Hafiz Ahmed Raza Qadri (QedVXycj7Sk, clip 0.0–67.4 s: the matla twice
   + "Apne Maula ka pyara..." / "Dono aalam ka dulha..." twice; ends on the verse end before the next repeat at 67.4 s).
   REAL Madinah / lantern footage only (Pixabay, credited), no characters. Silent render; audio is added in naat.yml. */
export const NAAT1124_DUR = 67.4;
const BEATS = (beats as { beats: number[] }).beats;
const GROUPS: G[] = [
  { a: 0.0, b: 8.0, words: [{ w: "SAB SE", t: 0.0 }, { w: "AULA", t: 1.44, big: true, gold: true }, { w: "O AALA", t: 3.0, big: true }, { w: "HAMARA", t: 5.0 }, { w: "NABI", t: 7.2, big: true, gold: true, hold: 7.9 }] },
  { a: 8.1, b: 16.6, words: [{ w: "SAB SE", t: 8.14 }, { w: "BALA O WALA", t: 9.54, big: true }, { w: "HAMARA", t: 11.84 }, { w: "NABI", t: 15.72, big: true, gold: true, hold: 16.5 }] },
  { a: 16.7, b: 25.1, words: [{ w: "SAB SE", t: 16.74 }, { w: "AULA", t: 18.4, big: true, gold: true }, { w: "O AALA", t: 19.78, big: true }, { w: "HAMARA", t: 22.12 }, { w: "NABI", t: 24.36, big: true, gold: true, hold: 25.0 }] },
  { a: 32.8, b: 34.4, words: [{ w: "NABI", t: 32.94, big: true, gold: true, hold: 34.2 }] },
  { a: 34.7, b: 42.3, words: [{ w: "APNE", t: 34.78 }, { w: "MAULA", t: 35.48, big: true }, { w: "KA PYARA", t: 37.4, big: true, gold: true }, { w: "HAMARA", t: 39.14 }, { w: "NABI", t: 41.48, big: true, gold: true, hold: 42.2 }] },
  { a: 42.5, b: 50.9, words: [{ w: "APNE", t: 42.52 }, { w: "MAULA", t: 44.0, big: true }, { w: "KA PYARA", t: 45.96, big: true, gold: true }, { w: "HAMARA", t: 47.7 }, { w: "NABI", t: 50.0, big: true, gold: true, hold: 50.8 }] },
  { a: 52.4, b: 56.8, words: [{ w: "AALAM", t: 52.54, big: true }] },
  { a: 58.4, b: 63.0, words: [{ w: "DONO", t: 58.48 }, { w: "AALAM", t: 60.76, big: true }] },
];
const A = { ur: "سب سے اَولیٰ و اَعلیٰ ہمارا نبی ﷺ", roman: "", en: "Sab se aula o aala hamara Nabi · the highest of all is our Prophet" };
const B = { ur: "سب سے بالا و والا ہمارا نبی ﷺ", roman: "", en: "Sab se bala o wala hamara Nabi · the most exalted is our Prophet" };
const LINES: QL[] = [
  { id: "a", start: 0.0, end: 8.0, ...A }, { id: "b", start: 8.1, end: 16.6, ...B },
  { id: "c", start: 16.7, end: 25.1, ...A }, { id: "d", start: 25.2, end: 34.0, ...B },
  { id: "e", start: 34.7, end: 51.0, ur: "اپنے مولیٰ کا پیارا ہمارا نبی ﷺ", roman: "", en: "Apne Maula ka pyara hamara Nabi · the beloved of his Lord" },
  { id: "f", start: 51.0, end: 63.4, ur: "دونوں عالَم کا دولہا ہمارا نبی ﷺ", roman: "", en: "Dono aalam ka dulha hamara Nabi · the bridegroom of both worlds" },
];
const CREDIT: Credit = { title: ["Sab Se Aula o Aala", "Hamara Nabi ﷺ"], kalam: "KALAM-E-ALA HAZRAT", artist: "HAFIZ AHMED RAZA QADRI", rights: "AUDIO © ORIGINAL PUBLISHER · SHARED WITH CREDIT" };

export const Naat1124: React.FC<{ withAudio?: boolean; noBg?: boolean }> = ({ noBg = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t, BEATS);
  const fade = Math.max(interpolate(t, [0, 0.6], [1, 0], { extrapolateRight: "clamp" }), interpolate(t, [NAAT1124_DUR - 0.8, NAAT1124_DUR], [0, 1], { extrapolateLeft: "clamp" }));
  return (
    <AbsoluteFill style={{ background: noBg ? "transparent" : "#000" }}>
      {!noBg && <OffthreadVideo src={staticFile("d1124/naat_bg.mp4")} muted style={{ width: 1080, height: 1920 }} />}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,4,14,0.5) 0%, rgba(8,4,14,0) 20%, rgba(8,4,14,0) 34%, rgba(8,4,14,0.35) 50%, rgba(8,4,14,0.55) 72%, rgba(8,4,14,0.3) 90%, rgba(8,4,14,0.25) 100%)", opacity: 0.85 + 0.15 * pulse }} />
      <Words t={t} pulse={pulse} groups={GROUPS} />
      <LineCaption t={t} lines={LINES} until={63.4} />
      <EndCard t={t} start={63.6} credit={CREDIT} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "0.12em", color: "rgba(255,245,232,0.8)", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>KALAM-E-ALA HAZRAT · HAFIZ AHMED RAZA QADRI</div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
