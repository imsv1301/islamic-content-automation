import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import beats from "../qawwali/rukh-beats.json";
import { Words, EndCard, pulseAt, G, Credit } from "../qawwali/QawwaliStory";

/* Mehfil-e-Sama naat · 22 Nov 2026 · "Rukh Se Parda Ab Apne Hata Do" recited by Owais Raza Qadri (PrxG7huEoAc, clip 0.0–70.0 s:
   "Rukh se parda ab apne hata do / jaaliyon par nigahen jami hain / faasilon ko khudara mita do / jaaliyon par nigahen jami hain").
   Modern kalam -> title + credits only (no lyric lines). REAL footage only (Pixabay 258846/207118/258844 lanterns, 112360 courtyard,
   198163 plaza, 205172 lamp, 200756 lantern), no characters. Silent render; audio is added in naat.yml. */
export const NAAT1122_DUR = 70.0;
const BEATS = (beats as { beats: number[] }).beats;
const GROUPS: G[] = [
  { a: 0.2, b: 4.4, words: [{ w: "RUKH SE", t: 0.3, big: true }, { w: "PARDA", t: 1.78, big: true, gold: true }] },
  { a: 4.4, b: 11.0, words: [{ w: "AB APNE", t: 4.4 }, { w: "HATA DO", t: 8.16, big: true, gold: true, hold: 10.8 }] },
];
const CREDIT: Credit = { title: ["Rukh Se Parda", "Ab Apne Hata Do"], kalam: "NAAT", artist: "OWAIS RAZA QADRI", rights: "AUDIO © ORIGINAL PUBLISHER · SHARED WITH CREDIT" };

export const Naat1122: React.FC<{ withAudio?: boolean; noBg?: boolean }> = ({ noBg = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t, BEATS);
  const fade = Math.max(interpolate(t, [0, 0.6], [1, 0], { extrapolateRight: "clamp" }), interpolate(t, [NAAT1122_DUR - 0.8, NAAT1122_DUR], [0, 1], { extrapolateLeft: "clamp" }));
  return (
    <AbsoluteFill style={{ background: noBg ? "transparent" : "#000" }}>
      {!noBg && <OffthreadVideo src={staticFile("d1122/naat_bg.mp4")} muted style={{ width: 1080, height: 1920 }} />}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,4,14,0.5) 0%, rgba(8,4,14,0) 20%, rgba(8,4,14,0) 34%, rgba(8,4,14,0.35) 50%, rgba(8,4,14,0.5) 72%, rgba(8,4,14,0.3) 90%, rgba(8,4,14,0.25) 100%)", opacity: 0.85 + 0.15 * pulse }} />
      <Words t={t} pulse={pulse} groups={GROUPS} />
      <EndCard t={t} start={63.0} credit={CREDIT} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "0.12em", color: "rgba(255,245,232,0.8)", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>OWAIS RAZA QADRI · RUKH SE PARDA</div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
