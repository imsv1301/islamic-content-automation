import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Kid, Ball } from "../kids/kit";
import { Vase } from "../kids/scenes1";

export const KidsThumb: React.FC = () => (
  <AbsoluteFill style={{ background: "#ffe9c7" }}>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <rect width={1280} height={720} fill="#ffe2b8" />
      <rect y={560} width={1280} height={160} fill="#c98b55" />
      <rect y={556} width={1280} height={10} fill="#a86e3e" />
      <rect x={860} y={420} width={170} height={20} rx={6} fill="#a86e3e" />
      <rect x={880} y={440} width={14} height={120} fill="#a86e3e" /><rect x={996} y={440} width={14} height={120} fill="#a86e3e" />
      <Vase x={1080} y={600} ang={78} />
      {[[-60, -10, 40], [40, -6, -30], [90, -4, 60], [-110, -2, -50]].map(([dx, dy, r], i) => (
        <path key={i} d="M 0 -14 L 16 10 L -14 10 Z" fill={i % 2 ? "#ffd34d" : "#4a8fe0"} transform={`translate(${1080 + dx},${600 + dy}) rotate(${r})`} />
      ))}
      <Ball x={1210} y={590} r={30} rot={30} />
      <Kid x={760} y={600} s={1.25} pose={{ armL: 30, armR: -150, tilt: -8, lean: -4 }} />
      <text x={760} y={150} textAnchor="middle" fontFamily="'Baloo 2'" fontWeight={800} fontSize={120} fill="#e8505b" stroke="#2b2340" strokeWidth={8} paintOrder="stroke">!</text>
    </svg>
    <div style={{ position: "absolute", left: 40, top: 110, fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 128, lineHeight: 0.95, color: "#ffd23f", WebkitTextStroke: "10px #2b2340", paintOrder: "stroke fill", transform: "rotate(-4deg)" }}>WHO<br />BROKE IT?</div>
    <div style={{ position: "absolute", left: 50, top: 410, fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 52, color: "#fff", background: "#2b2340", padding: "4px 22px", borderRadius: 18, transform: "rotate(-2deg)" }}>A story about the truth</div>
    <Img src={staticFile("day1/islam-for-little-ones.png")} style={{ position: "absolute", right: 26, top: 22, width: 116, height: 116, borderRadius: 58, border: "6px solid #fff" }} />
  </AbsoluteFill>
);
