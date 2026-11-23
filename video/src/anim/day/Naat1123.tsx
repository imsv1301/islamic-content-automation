import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import beats from "../qawwali/madina-beats.json";
import { Words, EndCard, pulseAt, G, Credit } from "../qawwali/QawwaliStory";

/* Mehfil-e-Sama naat · 23 Nov 2026 (Monday) · "Kya Bataun Ke Kya Madina Hai" recited by Zohaib Ashrafi (6gxoqYOOA6Q, clip 55.3–110.5 s:
   the refrain, "bas mera muddaa Madina hai" x2, the refrain again; ends on the verse end before the next repeat).
   Modern kalam -> title words + credits only (no lyric lines). REAL Madinah / lantern footage only (Pixabay, credited), no characters.
   Silent render; audio is added in naat.yml. */
export const NAAT1123_DUR = 55.2;
const BEATS = (beats as { beats: number[] }).beats;
const GROUPS: G[] = [
  { a: 0.0, b: 7.6, words: [{ w: "KYA BATAUN", t: 0.0, big: true }, { w: "KE KYA", t: 2.24 }, { w: "MADINA", t: 4.34, big: true, gold: true, hold: 6.7 }, { w: "HAI", t: 6.72 }] },
];
const CREDIT: Credit = { title: ["Kya Bataun Ke", "Kya Madina Hai"], kalam: "NAAT", artist: "ZOHAIB ASHRAFI", rights: "AUDIO © ORIGINAL PUBLISHER · SHARED WITH CREDIT" };

export const Naat1123: React.FC<{ withAudio?: boolean; noBg?: boolean }> = ({ noBg = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t, BEATS);
  const fade = Math.max(interpolate(t, [0, 0.6], [1, 0], { extrapolateRight: "clamp" }), interpolate(t, [NAAT1123_DUR - 0.8, NAAT1123_DUR], [0, 1], { extrapolateLeft: "clamp" }));
  return (
    <AbsoluteFill style={{ background: noBg ? "transparent" : "#000" }}>
      {!noBg && <OffthreadVideo src={staticFile("d1123/naat_bg.mp4")} muted style={{ width: 1080, height: 1920 }} />}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,4,14,0.5) 0%, rgba(8,4,14,0) 20%, rgba(8,4,14,0) 34%, rgba(8,4,14,0.35) 50%, rgba(8,4,14,0.5) 72%, rgba(8,4,14,0.3) 90%, rgba(8,4,14,0.25) 100%)", opacity: 0.85 + 0.15 * pulse }} />
      <Words t={t} pulse={pulse} groups={GROUPS} />
      <EndCard t={t} start={48.5} credit={CREDIT} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "0.12em", color: "rgba(255,245,232,0.8)", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>ZOHAIB ASHRAFI · KYA BATAUN KE KYA MADINA HAI</div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
