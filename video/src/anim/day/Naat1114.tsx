import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Words, LineCaption, EndCard, pulseAt, G, QL, Credit } from "../qawwali/QawwaliStory";

/* Mehfil-e-Sama naat · 14 Nov 2026 · "Woh Soo-e-Lalazar Phirte Hain" (kalam of Ala Hazrat Imam Ahmad Raza Khan, Rahmatullahi Alaih),
   recited by Owais Raza Qadri (8-0C3YfcrrM, clip 0.0-59.4 s = the matla, both lines complete).
   REAL footage only (Pixabay: Madinah courtyard, Green Dome, aerial Masjid an-Nabawi, lanterns), no characters.
   Big words on the reciter's syllables (whisper word timings, only where prob >= 0.5) + beat pulse. Silent render; audio is added in naat.yml. */
export const NAAT1114_DUR = 59.4;
const BEATS = [0.352, 0.736, 1.152, 1.536, 1.952, 2.336, 2.752, 3.168, 3.584, 4.0, 4.416, 4.8, 5.184, 5.6, 5.984, 6.368, 6.752, 7.168, 7.52, 7.904, 8.256, 8.64, 9.024, 9.408, 9.792, 10.176, 10.528, 10.88, 11.264, 11.648, 12.032, 12.416, 12.8, 13.216, 13.632, 14.016, 14.4, 14.816, 15.2, 15.584, 15.968, 16.384, 16.8, 17.184, 17.568, 17.952, 18.336, 18.688, 19.04, 19.392, 19.744, 20.128, 20.48, 20.864, 21.248, 21.632, 22.016, 22.4, 22.816, 23.232, 23.616, 24.032, 24.416, 24.832, 25.216, 25.6, 25.984, 26.368, 26.752, 27.136, 27.488, 27.872, 28.256, 28.672, 29.056, 29.472, 29.856, 30.24, 30.592, 30.976, 31.36, 31.744, 32.128, 32.512, 32.896, 33.28, 33.664, 34.048, 34.432, 34.816, 35.2, 35.584, 35.968, 36.352, 36.736, 37.12, 37.504, 37.888, 38.272, 38.656, 39.008, 39.392, 39.808, 40.192, 40.576, 40.96, 41.344, 41.728, 42.112, 42.496, 42.88, 43.264, 43.648, 44.032, 44.416, 44.8, 45.184, 45.6, 45.984, 46.368, 46.72, 47.104, 47.488, 47.872, 48.224, 48.608, 48.992, 49.376, 49.76, 50.144, 50.528, 50.912, 51.296, 51.68, 52.032, 52.416, 52.768, 53.184, 53.568, 53.984, 54.368, 54.752, 55.136, 55.52, 55.904, 56.288, 56.64, 57.024, 57.408, 57.792, 58.144];
const L1 = { ur: "وہ سوئے لالہ زار پھرتے ہیں", roman: "Woh soo-e-lalazar phirte hain", en: "He strolls toward the garden in bloom" };
const L2 = { ur: "تیرے دن اے بہار پھرتے ہیں", roman: "Tere din ae bahaar phirte hain", en: "O springtime, your days have turned bright" };
const LINES: QL[] = [{ id: "a", start: 0.1, end: 30.4, ...L1 }, { id: "b", start: 44.6, end: 59.2, ...L2 }];
const GROUPS: G[] = [
  { a: 0.0, b: 9.7, words: [{ w: "woh", t: 0.05 }, { w: "SOO-E", t: 0.62, big: true }, { w: "LALAZAR", t: 3.52, big: true, gold: true, hold: 5.0 }, { w: "PHIRTE", t: 5.14, big: true }, { w: "HAIN", t: 6.88, big: true, gold: true, hold: 9.4 }] },
  { a: 9.88, b: 20.3, words: [{ w: "woh", t: 9.88 }, { w: "SOO-E", t: 10.64, big: true }, { w: "LALAZAR", t: 13.22, big: true, gold: true, hold: 14.6 }, { w: "PHIRTE", t: 14.76, big: true }, { w: "HAIN", t: 16.58, big: true, gold: true, hold: 20.0 }] },
  { a: 20.52, b: 30.3, words: [{ w: "woh", t: 20.52 }, { w: "SOO-E", t: 22.96, big: true }, { w: "LALAZAR", t: 25.36, big: true, gold: true, hold: 26.9 }, { w: "PHIRTE HAIN", t: 27.04, big: true, hold: 30.0 }] },
  { a: 51.98, b: 59.2, words: [{ w: "TERE DIN", t: 51.98, big: true }, { w: "AE BAHAAR", t: 53.1, big: true, gold: true, hold: 56.4 }, { w: "PHIRTE", t: 56.52, big: true }, { w: "HAIN", t: 57.3, big: true, gold: true, hold: 59.0 }] },
];
const CREDIT: Credit = { title: ["Woh Soo-e-Lalazar", "Phirte Hain"], kalam: "KALAM · ALA HAZRAT IMAM AHMAD RAZA KHAN", artist: "OWAIS RAZA QADRI", rights: "AUDIO © ORIGINAL PUBLISHER · SHARED WITH CREDIT" };

export const Naat1114: React.FC<{ withAudio?: boolean; noBg?: boolean }> = ({ noBg = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t, BEATS);
  const gap = t > 30.6 && t < 44.3;
  const endO = interpolate(t, [30.4, 31.2, 43.4, 44.3], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fade = Math.max(interpolate(t, [0, 0.6], [1, 0], { extrapolateRight: "clamp" }), interpolate(t, [NAAT1114_DUR - 1.0, NAAT1114_DUR], [0, 1], { extrapolateLeft: "clamp" }));
  return (
    <AbsoluteFill style={{ background: noBg ? "transparent" : "#000" }}>
      {!noBg && <OffthreadVideo src={staticFile("d1114/naat_bg.mp4")} muted style={{ width: 1080, height: 1920, filter: `brightness(${0.97 + 0.05 * pulse})` }} />}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,4,14,0.5) 0%, rgba(8,4,14,0) 20%, rgba(8,4,14,0) 34%, rgba(8,4,14,0.45) 50%, rgba(8,4,14,0.65) 72%, rgba(8,4,14,0.4) 90%, rgba(8,4,14,0.25) 100%)" }} />
      <Words t={t} pulse={pulse} groups={GROUPS} />
      {!gap && <LineCaption t={t} lines={LINES} until={59.3} />}
      {endO > 0 && <AbsoluteFill style={{ opacity: endO }}><EndCard t={t} start={30.4} credit={CREDIT} /></AbsoluteFill>}
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "0.12em", color: "rgba(255,245,232,0.8)", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>ALA HAZRAT (RAH) · OWAIS RAZA QADRI</div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
