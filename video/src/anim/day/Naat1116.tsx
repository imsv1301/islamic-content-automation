import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Words, LineCaption, EndCard, pulseAt, G, QL, Credit } from "../qawwali/QawwaliStory";

/* Mehfil-e-Sama naat · 16 Nov 2026 · "Woh Kamal-e-Husn-e-Huzoor Hai" album track, recited by Owais Raza Qadri (VNXkJN8gVWA,
   clip 0.0-81.0 s): opens with "Balaghal ula bi kamalihi, kashafad duja bi jamalihi" (Shaikh Saadi Shirazi, Rahmatullahi Alaih)
   then the matla "Woh kamal-e-husn-e-Huzoor hai, ke gumaan-e-naqs jahan nahin" (Ala Hazrat Imam Ahmad Raza Khan, Rahmatullahi Alaih).
   Both pre-1929 -> lyrics allowed, but big words only where whisper heard them clearly (p >= 0.5); nothing shown for unclear parts.
   REAL footage only (Pixabay 207117/258846/258844/207118 lanterns, 198164 aerial Green Dome, 112360 courtyard, 198163 plaza,
   112361 Masjid an-Nabawi), no characters. Silent render; audio is added in naat.yml. */
export const NAAT1116_DUR = 81.0;
const BEATS = [1.472, 2.016, 2.56, 3.136, 3.648, 4.256, 4.8, 5.344, 5.856, 6.432, 6.976, 7.52, 8.096, 8.64, 9.248, 9.792, 10.368, 10.912, 11.488, 12.032, 12.608, 13.152, 13.728, 14.272, 14.848, 15.424, 15.968, 16.544, 17.088, 17.664, 18.24, 18.784, 19.328, 19.872, 20.448, 21.024, 21.6, 22.176, 22.72, 23.296, 23.872, 24.416, 24.992, 25.568, 26.112, 26.688, 27.232, 27.776, 28.32, 28.896, 29.44, 29.984, 30.56, 31.104, 31.68, 32.224, 32.768, 33.344, 33.888, 34.464, 35.008, 35.584, 36.128, 36.672, 37.216, 37.792, 38.368, 38.912, 39.488, 40.032, 40.576, 41.152, 41.728, 42.304, 42.848, 43.424, 44.0, 44.544, 45.12, 45.664, 46.24, 46.784, 47.36, 47.936, 48.512, 49.056, 49.632, 50.208, 50.752, 51.296, 51.872, 52.448, 52.992, 53.536, 54.112, 54.656, 55.2, 55.808, 56.352, 56.928, 57.472, 58.048, 58.592, 59.168, 59.712, 60.256, 60.832, 61.376, 61.92, 62.464, 63.008, 63.552, 64.128, 64.672, 65.216, 65.792, 66.336, 66.88, 67.456, 68.032, 68.576, 69.12, 69.664, 70.208, 70.752, 71.296, 71.84, 72.384, 72.928, 73.472, 74.048, 74.592, 75.136, 75.68, 76.256, 76.8, 77.312, 77.856, 78.304, 78.784, 79.296, 79.84, 80.384];
const L1 = { ur: "بَلَغَ العُلٰی بِکَمَالِہٖ، کَشَفَ الدُّجٰی بِجَمَالِہٖ", roman: "Balaghal ula bi kamalihi, kashafad duja bi jamalihi", en: "He reached the highest heights by his perfection; he lifted the darkness by his beauty" };
const L2 = { ur: "وہ کمالِ حُسنِ حضور ہے کہ گمانِ نقص جہاں نہیں", roman: "Woh kamal-e-husn-e-Huzoor hai, ke gumaan-e-naqs jahan nahin", en: "Such is the perfect beauty of the Beloved that no flaw can even be imagined" };
const LINES: QL[] = [{ id: "a", start: 4.0, end: 18.6, ...L1 }, { id: "b", start: 49.4, end: 61.0, ...L2 }];
const GROUPS: G[] = [
  { a: 10.3, b: 14.5, words: [{ w: "BALAGHAL", t: 10.38, big: true, gold: true }, { w: "ULA", t: 11.9, big: true }, { w: "bi", t: 12.28 }, { w: "KAMALIHI", t: 12.6, big: true, gold: true }] },
  { a: 14.6, b: 18.4, words: [{ w: "KASHAFAD", t: 14.64, big: true }, { w: "DUJA", t: 15.5, big: true }, { w: "bi", t: 16.72 }, { w: "JAMALIHI", t: 17.0, big: true, gold: true }] },
  { a: 49.5, b: 55.0, words: [{ w: "woh", t: 49.52 }, { w: "KAMAL-E", t: 50.92, big: true, gold: true }, { w: "HUSN-E", t: 52.04, big: true }, { w: "HUZOOR", t: 52.86, big: true, gold: true }] },
  { a: 55.1, b: 59.2, words: [{ w: "ke", t: 55.1 }, { w: "GUMAAN-E", t: 55.34, big: true }, { w: "NAQS", t: 56.52, big: true }, { w: "JAHAN", t: 57.4, big: true, gold: true }, { w: "NAHIN", t: 58.1, big: true, gold: true }] },
];
const CREDIT: Credit = { title: ["Woh Kamal-e-", "Husn-e-Huzoor"], kalam: "KALAM · SHAIKH SAADI & ALA HAZRAT", artist: "OWAIS RAZA QADRI", rights: "AUDIO © ORIGINAL PUBLISHER · SHARED WITH CREDIT" };

export const Naat1116: React.FC<{ withAudio?: boolean; noBg?: boolean }> = ({ noBg = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t, BEATS);
  const intro = interpolate(t, [0.4, 1.2, 3.0, 3.6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fade = Math.max(interpolate(t, [0, 0.6], [1, 0], { extrapolateRight: "clamp" }), interpolate(t, [NAAT1116_DUR - 0.8, NAAT1116_DUR], [0, 1], { extrapolateLeft: "clamp" }));
  return (
    <AbsoluteFill style={{ background: noBg ? "transparent" : "#000" }}>
      {!noBg && <OffthreadVideo src={staticFile("d1116/naat_bg.mp4")} muted style={{ width: 1080, height: 1920, filter: `brightness(${0.97 + 0.05 * pulse})` }} />}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,4,14,0.5) 0%, rgba(8,4,14,0) 20%, rgba(8,4,14,0) 34%, rgba(8,4,14,0.45) 50%, rgba(8,4,14,0.65) 72%, rgba(8,4,14,0.4) 90%, rgba(8,4,14,0.25) 100%)" }} />
      {intro > 0 && <AbsoluteFill style={{ opacity: intro }}><EndCard t={t + 2} start={0} credit={CREDIT} /></AbsoluteFill>}
      <Words t={t} pulse={pulse} groups={GROUPS} />
      <LineCaption t={t} lines={LINES} until={61.0} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "0.12em", color: "rgba(255,245,232,0.8)", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>SAADI (RAH) · ALA HAZRAT (RAH) · OWAIS RAZA QADRI</div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
