import React from "react";
import { AbsoluteFill, staticFile, Img } from "remotion";
import "../fonts";

/* Mehfil-e-Sama title + credit card, rendered as ONE transparent still and overlaid on real footage with ffmpeg.
   Credits stay on screen for the whole clip. No people, no lyrics unless pre-1929 kalam. */
export type MehfilCardProps = { ur: string; roman: string; lines: string[]; kind: string };
export const MehfilCard: React.FC<MehfilCardProps> = ({ ur, roman, lines, kind }) => (
  <AbsoluteFill>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 900, background: "linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.35) 60%, rgba(0,0,0,0))" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 420, background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.55))" }} />
    <div style={{ position: "absolute", top: 250, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: "0.3em", color: "#f3cf6a", border: "2px solid #f3cf6a", borderRadius: 40, padding: "8px 26px" }}>{kind}</div>
      <div dir="rtl" lang="ur" style={{ marginTop: 26, fontFamily: "'Noto Nastaliq Urdu', serif", fontWeight: 700, fontSize: 70, lineHeight: 2.0, color: "#f3cf6a", textShadow: "0 4px 22px rgba(0,0,0,0.8)" }}>{ur}</div>
      <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 40, letterSpacing: "0.06em", color: "#fff", textShadow: "0 3px 14px rgba(0,0,0,0.85)" }}>{roman.toUpperCase()}</div>
      <div style={{ marginTop: 26 }}>
        {lines.map((l, i) => <div key={i} style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 28, lineHeight: 1.55, letterSpacing: "0.06em", color: "rgba(255,255,255,0.92)", textShadow: "0 3px 12px rgba(0,0,0,0.85)" }}>{l.toUpperCase()}</div>)}
      </div>
    </div>
    <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
      <Img src={staticFile("day1/mehfil-e-sama.png")} style={{ width: 54, height: 54, borderRadius: 27 }} onError={() => null} />
      <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 30, letterSpacing: "0.12em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.85)" }}>@MEHFIL.E_SAMA</span>
    </div>
  </AbsoluteFill>
);
