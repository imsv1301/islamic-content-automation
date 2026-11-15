import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import beats from "../qawwali/taiba-beats.json";
import { Words, EndCard, pulseAt, G, Credit } from "../qawwali/QawwaliStory";
import { Seeker, Look, interp, blinkAt } from "../qawwali/anim/Seeker";
import { Stars, Glow, flick, PETAL, prng, k, ease } from "../qawwali/anim/QawwaliAnim";
import { Hand } from "./AnimKit";

/* Mehfil-e-Sama qawwali · 15 Nov 2026 · "Taiba Ke Jaane Wale" (Sabri Brothers; ZElKozOdTPc, clip 135.5–204.0 s:
   the refrain three times + "kehna ke Ya Muhammad…" couplet, all complete).
   Modern kalam -> NO lyrics on screen, title + credits only; the animation acts out the meaning:
   a young seeker sees pilgrims off to Madinah, bows with respect, writes his story of sorrow, hands it to a traveller,
   the caravan goes toward a far light (the city is ONLY light, never a drawn dome), he prays alone at night, and dawn and
   a bright star answer him. Ordinary people only; no protected figure; no halo behind any head; no spinning text. Silent render. */
export const TAIBA_DUR = 68.5;
const BEATS = (beats as { beats: number[] }).beats;
const W = 1080, H = 1920;
const SEEK: Look = { beard: false, cap: "#f8f4eb", top: "#e9dcc3", topD: "#c8b89a", shawl: true, hair: "#1f1510" };
const PIL = (i: number): Look => ({ beard: i !== 1, cap: i === 1 ? null : "#ffffff", hijab: i === 1 ? "#f4f1ea" : null, long: i === 1, top: "#f7f5ef", topD: "#dcd8cc", pants: "#ece8dc", shawl: i === 0, hair: "#2a1d14", skin: [["#e3b58e", "#c99a72", "#a77850"], ["#f0c9a4", "#d9a982", "#b8865f"], ["#c99a72", "#ad7c55", "#8a5d3a"]][i] as [string, string, string] });
const GROUPS: G[] = [{ a: 0.0, b: 4.4, words: [{ w: "TAIBA", t: 0.05, big: true, gold: true }, { w: "KE JAANE", t: 1.42, big: true }, { w: "WALE", t: 2.62, big: true, gold: true, hold: 4.3 }] }];
const CREDIT: Credit = { title: ["Taiba Ke", "Jaane Wale"], kalam: "QAWWALI", artist: "SABRI BROTHERS", rights: "AUDIO © ORIGINAL PUBLISHER · SHARED WITH CREDIT" };

const Desert: React.FC<{ t: number; dawn: number; light?: number }> = ({ t, dawn, light = 0.6 }) => (
  <g>
    <defs><linearGradient id="ds15" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={dawn > 0.5 ? "#f6b26b" : "#1b1430"} /><stop offset="55%" stopColor={dawn > 0.5 ? "#ffd8a0" : "#4a2f4a"} /><stop offset="100%" stopColor="#c98a4a" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#ds15)" />
    <Stars t={t} o={1 - dawn} />
    <Glow id="far15" cx={540} cy={960} r={300} c="#fff1c8" o={light} />
    <path d="M 0 1060 Q 270 1000 540 1040 Q 810 1080 1080 1010 L 1080 1920 L 0 1920 Z" fill="#b8763d" />
    <path d="M 0 1300 Q 300 1220 600 1290 Q 860 1340 1080 1260 L 1080 1920 L 0 1920 Z" fill="#a2652f" />
    {/* road narrowing to the light */}
    <path d="M 520 1040 L 560 1040 L 900 1920 L 180 1920 Z" fill="#d9a46b" opacity={0.55} />
  </g>
);
const Pilgrim: React.FC<{ t: number; i: number; x: number; y: number; s: number; back?: boolean; walk?: number; gx?: number; rArm?: [number, number]; nod?: number }> = ({ t, i, x, y, s, back = true, walk = 0, gx = 0, rArm, nod }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><Seeker uid={`pg${i}${back ? "b" : "f"}`} t={t} look={PIL(i)} blink={blinkAt(t, 20 + i)} back={back} walk={walk} gazeX={gx} smile={0.5} rArm={rArm} nod={nod} wind={0.3} /></g>
);
const Letter: React.FC<{ x: number; y: number; s?: number; r?: number; fold?: number }> = ({ x, y, s = 1, r = 0, fold = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-70} y={-50 - 40 * (1 - fold)} width={140} height={100 + 80 * (1 - fold)} rx={6} fill="#f6ecd4" stroke="#c9b48a" strokeWidth={4} />
    {fold < 0.5 ? Array.from({ length: 5 }, (_, i) => <path key={i} d={`M -50 ${-60 + i * 26} Q 0 ${-66 + i * 26} 50 ${-60 + i * 26}`} stroke="#6b4a2a" strokeWidth={3} fill="none" opacity={0.7} />) : <path d="M -70 -50 L 0 10 L 70 -50" stroke="#c9b48a" strokeWidth={4} fill="none" />}
    {fold >= 0.5 && <circle cx={0} cy={10} r={14} fill="#a8322e" />}
  </g>
);
const Lamp: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Glow id={`ql${x}`} cx={0} cy={-30} r={300} c="#ffb547" o={0.55 * flick(t, x)} />
    <path d="M -40 0 Q 0 30 40 0 Q 26 -12 0 -12 Q -26 -12 -40 0 Z" fill="#b5652c" />
    <path d={`M 0 -12 Q ${-8 + Math.sin(t * 11) * 3} -40 ${Math.sin(t * 7) * 3} ${-64 * flick(t, 3)} Q ${10 + Math.sin(t * 9) * 3} -40 0 -12 Z`} fill="#ffd25e" />
  </g>
);
const Petals: React.FC<{ t: number; a: number; n?: number; seed?: number }> = ({ t, a, n = 40, seed = 7 }) => (
  <g>{Array.from({ length: n }, (_, i) => { const r = prng(i + seed * 100), x = r() * W, sp = 90 + r() * 160, y = ((r() * H + (t - a) * sp) % (H + 200)) - 100; return <path key={i} d={PETAL} transform={`translate(${x + Math.sin(t * 2 + i) * 30} ${y}) rotate(${i * 40 + (t - a) * 30}) scale(${0.7 + r()})`} fill={i % 3 ? "#c8143c" : "#ff6f8e"} opacity={0.85} />; })}</g>
);

/* A 0–8.5: the caravan of pilgrims walks away toward the far light; he watches from the roadside */
const S_Caravan: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const go = ease(t / 9);
  return (
    <g>
      <Desert t={t} dawn={0} light={0.5 + 0.1 * pulse} />
      {[0, 1, 2].map((i) => <Pilgrim key={i} t={t} i={i} x={430 + i * 110 + 20 * go} y={1640 - 120 * go - i * 20} s={0.45 - 0.12 * go} walk={t * 6 + i} />)}
      <g transform="translate(860 1880) scale(0.9)"><Seeker uid="sk1" t={t} look={SEEK} blink={blinkAt(t, 1)} gazeX={-0.8} gazeY={-0.2} smile={0.2} brow={0.4} lArm={[-4, 8]} rArm={[40, 110]} wind={0.4} /></g>
    </g>
  );
};
/* B 8.5–17: he runs up to the last traveller and bows with adab, hand on heart */
const S_Adab: React.FC<{ t: number; pulse: number }> = ({ t }) => {
  const bow = k(t, 10.5, 11.6) * (1 - k(t, 15.2, 16.2));
  return (
    <g>
      <Desert t={t} dawn={0} light={0.45} />
      <Pilgrim t={t} i={0} x={380} y={1720} s={0.85} back={false} gx={0.7} rArm={[-4, 8]} nod={6 * bow} />
      <g transform={`translate(${interp(k(t, 8.5, 10.4), [0, 1], [1200, 760])} 1760) scale(0.88)`}>
        <Seeker uid="sk2" t={t} look={SEEK} blink={blinkAt(t, 2)} gazeX={-0.8} gazeY={0.4 * bow} closed={0.4 * bow} smile={0.4} nod={34 * bow} tilt={-6 * bow} lArm={[-4, 8]} rArm={[20 + 40 * bow, 120 + 30 * bow]} wind={0.4} />
      </g>
    </g>
  );
};
/* C 17–25.5: by lamplight he writes his story of sorrow; a tear; he folds the letter */
const S_Write: React.FC<{ t: number; pulse: number }> = ({ t }) => {
  const fold = k(t, 23.6, 24.8);
  return (
    <g>
      <rect width={W} height={H} fill="#140d1c" />
      <Stars t={t} o={0.6} />
      <rect y={1380} width={W} height={540} fill="#3a2418" />
      <Lamp x={820} y={1380} t={t} s={1.3} />
      <g transform="translate(470 1860) scale(1.15)"><Seeker uid="sk3" t={t} look={SEEK} blink={blinkAt(t, 3)} gazeX={0.5} gazeY={0.8} closed={0.2} brow={-0.2} tear={k(t, 19, 24)} rArm={[30 + 4 * Math.sin(t * 9), 120]} lArm={[30, 120]} wind={0.2} /></g>
      <Letter x={600} y={1360} s={1.4} r={-4} fold={fold} />
    </g>
  );
};
/* D 25.5–34.5: he hands the folded letter to the traveller, who presses it to his heart and nods */
const S_Give: React.FC<{ t: number; pulse: number }> = ({ t }) => {
  const give = k(t, 26.3, 28.3), keep = k(t, 29.2, 30.4);
  const lx = interp(give, [0, 1], [700, 470]), ly = interp(keep, [0, 1], [1180, 1110]);
  return (
    <g>
      <Desert t={t} dawn={0} light={0.55} />
      <Pilgrim t={t} i={0} x={330} y={1760} s={0.9} back={false} gx={0.7} rArm={keep > 0.2 ? [20, 130] : [-20, 60]} nod={6 * Math.sin(t * 2) * keep} />
      <g transform="translate(780 1780) scale(0.9)"><Seeker uid="sk4" t={t} look={SEEK} blink={blinkAt(t, 4)} gazeX={-0.8} smile={0.3 + 0.4 * keep} rArm={[-60 + 40 * keep, 40]} lArm={[-4, 8]} wind={0.4} /></g>
      <Letter x={lx} y={ly} s={0.7} r={-8} fold={1} />
    </g>
  );
};
/* E 34.5–42.5: the caravan goes; a gold thread runs from his heart to the far light; petals */
const S_Thread: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const p = k(t, 35, 41.5);
  return (
    <g>
      <Desert t={t} dawn={0} light={0.55 + 0.3 * p + 0.1 * pulse} />
      {[0, 1, 2].map((i) => <Pilgrim key={i} t={t} i={i} x={470 + i * 70} y={1360 - 60 * p} s={0.3 - 0.1 * p} walk={t * 6 + i} />)}
      <path d={`M 860 1240 Q 700 ${1120 - 60 * Math.sin(t)} 540 1030`} stroke="#ffe7a0" strokeWidth={6} fill="none" strokeDasharray="900" strokeDashoffset={900 * (1 - p)} opacity={0.9} />
      <g transform="translate(860 1880) scale(0.9)"><Seeker uid="sk5" t={t} look={SEEK} blink={blinkAt(t, 5)} back walk={0} lArm={[-4, 8]} rArm={[-4, 8]} wind={0.5} /></g>
      <Petals t={t} a={34.5} n={30} />
    </g>
  );
};
/* F 42.5–51.5: night, alone, he raises his hands in dua under the stars */
const S_Dua: React.FC<{ t: number; pulse: number }> = ({ t }) => {
  const up = k(t, 43, 44.2);
  return (
    <g>
      <rect width={W} height={H} fill="#0d0a1c" />
      <Stars t={t} o={1} />
      <Glow id="moon15" cx={800} cy={420} r={260} c="#fff3cf" o={0.35} />
      <circle cx={800} cy={420} r={70} fill="#fff3cf" /><circle cx={828} cy={406} r={64} fill="#0d0a1c" />
      <rect y={1500} width={W} height={420} fill="#2a1a24" />
      <g transform="translate(540 1900) scale(1.05)"><Seeker uid="sk6" t={t} look={SEEK} blink={blinkAt(t, 6)} gazeY={-0.5} closed={0.5 * k(t, 46, 47)} lArm={[-30 * up, 120 * up + 8]} rArm={[-30 * up, 120 * up + 8]} wind={0.3} /></g>
      <g opacity={up}><Hand x={430} y={1250} s={0.9} r={-14} skin="#c48d66" curl={0.15} /><Hand x={650} y={1250} s={0.9} r={14} skin="#c48d66" flip curl={0.15} /></g>
    </g>
  );
};
/* G 51.5–60: close-up, head bowed, helpless; one small lamp; a tear */
const S_Bekas: React.FC<{ t: number; pulse: number }> = ({ t }) => {
  const S = interp(ease((t - 51.5) / 8.5), [0, 1], [1.9, 2.4]);
  return (
    <g>
      <rect width={W} height={H} fill="#120b18" />
      <Lamp x={830} y={1500} t={t} s={1.1} />
      <g transform={`translate(520 ${640 + 790 * S}) scale(${S})`}><Seeker uid="sk7" t={t} look={SEEK} blink={blinkAt(t, 7)} closed={0.7} nod={14} tilt={-5} brow={-0.4} tear={(t - 51.5) / 7 % 1} wind={0.15} /></g>
    </g>
  );
};
/* H 60–68.5: "whose star of fate has sunk": a lone star slips down behind the dunes; he watches it go, a tear; only a faint glow of hope stays on the horizon */
const S_Star: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const sink = k(t, 60.4, 66.2);
  return (
    <g>
      <Desert t={t} dawn={0} light={0.35 + 0.1 * pulse} />
      <g transform={`translate(${520 + 60 * sink} ${420 + 600 * sink}) scale(${0.9 - 0.3 * sink})`} opacity={1 - 0.8 * sink}><path d="M 0 -60 L 14 -14 L 60 0 L 14 14 L 0 60 L -14 14 L -60 0 L -14 -14 Z" fill="#fff6d0" /><Glow id="st15" cx={0} cy={0} r={160} c="#fff1c8" o={0.5} /></g>
      <path d="M 0 1060 Q 270 1000 540 1040 Q 810 1080 1080 1010 L 1080 1100 L 0 1100 Z" fill="#b8763d" />
      <g transform="translate(860 1880) scale(0.9)"><Seeker uid="sk8" t={t} look={SEEK} blink={blinkAt(t, 8)} gazeX={-0.4} gazeY={-0.6 + 0.6 * sink} brow={-0.3} tear={k(t, 61, 66)} rArm={[30, 110]} lArm={[30, 110]} wind={0.4} /></g>
    </g>
  );
};

type Shot = { a: number; b: number; r: (t: number, pulse: number) => React.ReactNode };
const SHOTS: Shot[] = [
  { a: 0, b: 8.5, r: (t, p) => <S_Caravan t={t} pulse={p} /> },
  { a: 8.5, b: 17.0, r: (t, p) => <S_Adab t={t} pulse={p} /> },
  { a: 17.0, b: 25.5, r: (t, p) => <S_Write t={t} pulse={p} /> },
  { a: 25.5, b: 34.5, r: (t, p) => <S_Give t={t} pulse={p} /> },
  { a: 34.5, b: 42.5, r: (t, p) => <S_Thread t={t} pulse={p} /> },
  { a: 42.5, b: 51.5, r: (t, p) => <S_Dua t={t} pulse={p} /> },
  { a: 51.5, b: 60.0, r: (t, p) => <S_Bekas t={t} pulse={p} /> },
  { a: 60.0, b: TAIBA_DUR + 1, r: (t, p) => <S_Star t={t} pulse={p} /> },
];
const XF = 0.35;

export const Qawwali1115: React.FC<{ withAudio?: boolean }> = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t, BEATS);
  const fade = Math.max(interp(t, [0, 0.6], [1, 0]), interp(t, [TAIBA_DUR - 1.2, TAIBA_DUR], [0, 1]));
  return (
    <AbsoluteFill style={{ background: "#07040c" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => {
          if (t < s.a - XF || t > s.b + XF) return null;
          const o = s.a === 0 ? 1 : interp(t, [s.a - XF, s.a + XF], [0, 1]);
          return <g key={i} opacity={o} transform={`translate(540 960) scale(${1 + 0.006 * pulse}) translate(-540 -960)`}>{s.r(t, pulse)}</g>;
        })}
        <defs><radialGradient id="vig15" cx="50%" cy="46%" r="75%"><stop offset="60%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.5} /></radialGradient></defs>
        <rect width={W} height={H} fill="url(#vig15)" />
      </svg>
      <Words t={t} pulse={pulse} groups={GROUPS} />
      <EndCard t={t} start={65.6} credit={CREDIT} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "0.12em", color: "rgba(255,245,232,0.8)", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>SABRI BROTHERS · TAIBA KE JAANE WALE</div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
