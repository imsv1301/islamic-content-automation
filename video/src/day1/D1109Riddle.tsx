import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, RED, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1109riddle-timing.json";

/* Solve by Sunrise, Mon 9 Nov 2026: Riddle #10 solution (fill 5, pour into 3 -> 2 left; empty 3; pour the 2 in; fill 5; top up the 3 with 1 -> 4 left),
   animated jugs show every step with real levels. Then Riddle #11: 8 identical balls, one slightly heavier, a balance scale, only 2 weighings.
   Answer (next video): weigh 3 vs 3. Level -> weigh the last 2 against each other. Not level -> take the heavier 3, weigh 1 vs 1; level -> the 3rd ball.
   No salam. No names. People faceless (back views). The heavy ball is never marked on screen. */
const TM = data as unknown as Timing;
export const D1109_RIDDLE_DUR = houseDur(TM);
const R11 = 5;
const PLACE = ["THE JUGS", "STEP 1", "STEP 2", "STEP 3", "SOLVED", "", "THE BALLS", "THE CATCH", "THE RULES", "THE GOAL", "YOUR MOVE"];

const card: React.CSSProperties = { background: "rgba(20,10,4,0.82)", color: "#fff", fontFamily: MONT, fontWeight: 800, borderRadius: 18, padding: "14px 22px" };
const big = (col: string, sz: number, stroke = 11): React.CSSProperties => ({ fontFamily: MONT, fontWeight: 800, fontSize: sz, lineHeight: 1, color: col, WebkitTextStroke: `${stroke}px ${INK}`, paintOrder: "stroke fill" });
const WATER = "#4cc9f0";

const Hud = (c: Ctx) => {
  const { t, S, idx } = c;
  if (idx === R11) return null;
  if (idx < R11) return <HudBlock t={t} at={S(idx)} day="YESTERDAY'S MYSTERY" big={<>ANSWER</>} place={PLACE[idx]} tag="RIDDLE #10" tagBg="#2a9d8f" />;
  return <HudBlock t={t} at={S(idx)} day="DAY 11" big={<>7:00<span style={{ fontSize: 30, marginLeft: 8 }}>AM</span></>} place={PLACE[idx]} tag="RIDDLE #11" tagBg={RED} />;
};

/* CSS jug with a live water level in litres */
const Jug: React.FC<{ cap: number; litres: number; k?: number; glow?: boolean }> = ({ cap, litres, k = 1, glow }) => {
  const h = cap === 5 ? 420 : 260, w = cap === 5 ? 250 : 200;
  return (
    <div style={{ textAlign: "center", transform: `scale(${k})` }}>
      <div style={{ ...big(glow ? GOLD : "#fff", 64, 9), marginBottom: 10 }}>{Math.round(litres)} L</div>
      <div style={{ position: "relative", width: w, height: h, margin: "0 auto", background: "rgba(255,245,230,0.35)", border: `8px solid ${glow ? GOLD : INK}`, borderRadius: "22px 22px 40px 40px", overflow: "hidden", boxShadow: glow ? `0 0 50px ${GOLD}` : "0 10px 0 rgba(0,0,0,0.25)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${(litres / cap) * 100}%`, background: `linear-gradient(${WATER}, #1d8fb8)` }} />
        {Array.from({ length: cap - 1 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, width: 26, bottom: `${((i + 1) / cap) * 100}%`, height: 4, background: "rgba(26,15,8,0.35)" }} />)}
      </div>
      <div style={{ marginTop: 12, display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 44, borderRadius: 16, padding: "4px 18px", border: `5px solid ${INK}` }}>{cap}-LITRE</div>
    </div>
  );
};

/* water levels (small, big) through the solution, by line and phase */
const levels = (c: Ctx): [number, number] => {
  const { t, S, E, idx } = c;
  const ph = (i: number, a: number, b: number) => tw(t, S(i) + (E(i) - S(i)) * a, S(i) + (E(i) - S(i)) * b);
  if (idx === 1) { const f = ph(1, 0.02, 0.4), p = ph(1, 0.45, 0.8); return [3 * p, 5 * f - 3 * p]; }
  if (idx === 2) { const e = ph(2, 0.05, 0.45), p = ph(2, 0.55, 0.95); return [3 * (1 - e) + 2 * p, 2 - 2 * p]; }
  if (idx === 3) { const f = ph(3, 0.02, 0.4), p = ph(3, 0.5, 0.85); return [2 + p, 5 * f - p]; }
  return [3, 4];
};
const STEP = ["", "FILL 5 → POUR INTO 3", "EMPTY 3 → POUR THE 2 IN", "FILL 5 → TOP UP THE 3", ""];

const Ball: React.FC<{ k: number; q?: boolean }> = ({ k, q }) => (
  <div style={{ width: 96, height: 96, borderRadius: 48, background: "radial-gradient(circle at 35% 30%, #ffe2b0, #c97a2b 60%, #7a3e10)", border: `5px solid ${INK}`, transform: `scale(${k})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 0 rgba(0,0,0,0.3)", ...big("#fff", 44, 6) }}>{q ? "?" : ""}</div>
);
const Balls: React.FC<{ t: number; a: number; q?: boolean; step?: number }> = ({ t, a, q, step = 0.18 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 96px)", gap: 26, justifyContent: "center" }}>
    {Array.from({ length: 8 }).map((_, i) => <Ball key={i} k={pop(t, a + i * step, 0.35)} q={q} />)}
  </div>
);

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="re" style={{ position: "absolute", top: 480, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 80 }}>
    <Jug cap={3} litres={0} k={pop(t, S(0) + 0.3, 0.45)} />
    <Jug cap={5} litres={0} k={pop(t, S(0) + 1.2, 0.45)} />
    <div style={{ position: "absolute", top: -110, left: 0, right: 0, textAlign: "center" }}><div style={{ display: "inline-block", ...card, fontSize: 54, border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(0) + 2.6, 0.45)})` }}>GOAL: EXACTLY <span style={{ color: GOLD }}>4 L</span></div></div>
  </div>);
  if (idx >= 1 && idx <= 4) {
    const [s, b] = levels(c);
    out.push(<div key="sim" style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 80 }}>
      <Jug cap={3} litres={Math.max(0, s)} />
      <Jug cap={5} litres={Math.max(0, b)} glow={idx === 4} />
    </div>);
    if (STEP[idx]) out.push(<div key="st" style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 44, borderRadius: 18, padding: "8px 24px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(idx) + 0.05, 0.35)})` }}>{STEP[idx]}</div>
    </div>);
    if (idx === 4) out.push(<div key="ok" style={{ position: "absolute", top: 1120, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 60, borderRadius: 22, padding: "12px 32px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(4) + 0.6, 0.45)}) rotate(-2deg)` }}>✅ EXACTLY 4 LITRES</div>
    </div>);
  }
  if (idx === R11) {
    const p = pop(t, S(R11), 0.5);
    out.push(<div key="t" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.2em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>A BRAND NEW MYSTERY</div>
      <div style={{ ...big(RED, 190, 12) }}>#11</div>
    </div>);
  }
  if (idx === 6) out.push(<div key="balls" style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ display: "inline-block", background: "rgba(255,245,230,0.95)", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 48, borderRadius: 20, padding: "10px 28px", border: `5px solid ${INK}`, marginBottom: 30, transform: `scale(${pop(t, S(6) + 0.1, 0.4)})` }}>PERSON 1 · 8 BALLS</div>
    <Balls t={t} a={S(6) + 0.6} />
  </div>);
  if (idx === 7) out.push(<div key="heavy" style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
    <Balls t={t} a={S(7) - 2} q />
    <div style={{ marginTop: 34, display: "inline-block", background: RED, color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 54, borderRadius: 20, padding: "10px 30px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(7) + 0.8, 0.45)})` }}>1 IS A BIT HEAVIER</div>
  </div>);
  if (idx === 8) {
    const u1 = pop(t, S(8) + 1.4, 0.4), u2 = pop(t, S(8) + 2.0, 0.4);
    out.push(<div key="rules" style={{ position: "absolute", top: 500, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ fontSize: 200, lineHeight: 1, transform: `scale(${pop(t, S(8) + 0.1, 0.5)})` }}>⚖️</div>
      <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 24 }}>
        {[u1, u2].map((k, i) => <div key={i} style={{ background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 52, borderRadius: 20, padding: "10px 28px", border: `5px solid ${INK}`, transform: `scale(${k})` }}>USE {i + 1}</div>)}
      </div>
      <div style={{ marginTop: 22, display: "inline-block", ...card, fontSize: 48, border: `5px solid ${RED}`, transform: `scale(${pop(t, S(8) + 2.8, 0.4)})` }}>❌ NO 3RD TRY</div>
    </div>);
  }
  if (idx === 9) out.push(<div key="goal" style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
    <Balls t={t} a={S(9) - 2} q />
    <div style={{ marginTop: 30, ...big(GOLD, 170), transform: `scale(${pop(t, S(9) + 0.8, 0.45)})` }}>WHICH ONE?</div>
  </div>);
  if (idx >= 10) {
    const a = S(10);
    out.push(<div key="vote" style={{ position: "absolute", left: 60, right: 60, top: 470 }}>
      <div style={{ textAlign: "center", fontSize: 110, lineHeight: 1, transform: `scale(${pop(t, a + 0.1, 0.45)})` }}>⚖️ 🟠</div>
      <div style={{ marginTop: 26, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 62, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a + 0.8, 0.45)})` }}>COMMENT YOUR PLAN</div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: GOLD, textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: tw(t, a + 1.4, a + 1.9) }}>ANSWER AT SUNRISE</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1109riddle-mix.m4a",
  imgDir: "d1109",
  logo: "day1/solve-by-sunrise.png",
  brand: "SOLVE BY SUNRISE",
  keyword: /jugs?|three|five|four|two|one|litres?|empty|fill|eight|balls?|heavier|heavy|scale|times|sure|sunrise|answer/i,
  particles: (c) => (c.idx >= R11 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx <= 4 ? 1360 : c.idx === 8 ? 1300 : 1180),
  captionSize: 74,
  shakeAt: [4, 5, 7],
  shots: [
    { img: "r10_jugs.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r10_pour.jpg", from: 1, to: 2, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r10_well.jpg", from: 2, to: 3, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r10_pour.jpg", from: 3, to: 4, z0: 1.18, z1: 1.06, fx0: 0.45, fy0: 0.55, fx1: 0.55, fy1: 0.5 },
    { img: "r10_jugs.jpg", from: 4, to: 5, z0: 1.0, z1: 1.12, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.45 },
    { img: "r11_question.jpg", from: 5, to: 6, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r11_person.jpg", from: 6, to: 7, z0: 1.12, z1: 1.02, fx0: 0.5, fy0: 0.55, fx1: 0.5, fy1: 0.5 },
    { img: "r11_balls.jpg", from: 7, to: 8, z0: 1.0, z1: 1.12, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.5 },
    { img: "r11_scale.jpg", from: 8, to: 9, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r11_scale.jpg", from: 9, to: 10, z0: 1.2, z1: 1.05, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r11_question.jpg", from: 10, to: 999, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1109Riddle: React.FC = () => <HouseShort cfg={CFG} />;
