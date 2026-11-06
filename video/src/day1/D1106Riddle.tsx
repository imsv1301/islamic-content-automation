import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, RED, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1106riddle-timing.json";

/* Solve by Sunrise, 6 Nov 2026: Riddle #7 solution (goat over; back alone; wolf over, goat back; cabbage over; back alone; goat over)
   then Riddle #8 (two fathers and two sons catch exactly 3 fish, each takes home one whole fish; answer: grandfather, father, son).
   No salam. No names. People faceless (back views). */
const TM = data as unknown as Timing;
export const D1106_RIDDLE_DUR = houseDur(TM);
const R8 = 6;
const PLACE = ["THE RIVER", "TRIPS 1-2", "TRIPS 3-4", "TRIP 5", "TRIPS 6-7", "ALL SAFE", "", "THE LAKE", "THE CATCH", "THE RULE", "THE QUESTION", "YOUR MOVE"];

const card: React.CSSProperties = { background: "rgba(20,10,4,0.82)", color: "#fff", fontFamily: MONT, fontWeight: 800, borderRadius: 18, padding: "14px 22px" };
const Badge: React.FC<{ txt: string; col: string }> = ({ txt, col }) => <div style={{ display: "inline-block", background: col, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 30, borderRadius: 14, padding: "6px 18px" }}>{txt}</div>;

const Hud = (c: Ctx) => {
  const { t, S, idx } = c;
  if (idx === R8) return null;
  if (idx < R8) return <HudBlock t={t} at={S(idx)} day="YESTERDAY'S MYSTERY" big={<>ANSWER</>} place={PLACE[idx]} tag="RIDDLE #7" tagBg="#2a9d8f" />;
  return <HudBlock t={t} at={S(idx)} day="DAY 8" big={<>6:05<span style={{ fontSize: 30, marginLeft: 8 }}>AM</span></>} place={PLACE[idx]} tag="RIDDLE #8" tagBg={RED} />;
};

/* river board: side of each item after each line (0 = near bank, 1 = far bank) */
const ITEMS = ["🐺", "🐐", "🥬"];
const SIDE: number[][] = [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 0, 1], [1, 1, 1], [1, 1, 1]];
const STEP = ["START", "🐐 OVER · BACK ALONE", "🐺 OVER · 🐐 BACK", "🥬 OVER (🐺 + 🥬 = SAFE)", "BACK ALONE · 🐐 OVER", "✅ 7 TRIPS · ALL SAFE"];
const River: React.FC<{ c: Ctx }> = ({ c }) => {
  const { t, S, idx } = c;
  const prev = SIDE[Math.max(0, idx - 1)], cur = SIDE[idx];
  const k = idx === 0 ? 1 : tw(t, S(idx) + 0.4, S(idx) + 1.6);
  const appear = idx === 0 ? pop(t, S(0) + 0.3, 0.5) : 1;
  return (
    <div style={{ position: "absolute", top: 470, left: 50, right: 50, transform: `scale(${appear})` }}>
      <div style={{ position: "relative", height: 470, borderRadius: 30, overflow: "hidden", border: `5px solid ${INK}`, boxShadow: "0 14px 0 rgba(0,0,0,0.3)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 280, background: "#e9c46a" }} />
        <div style={{ position: "absolute", left: 280, right: 280, top: 0, bottom: 0, background: "linear-gradient(90deg,#2a9d8f,#4cc9f0,#2a9d8f)" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 280, background: "#9bd27a" }} />
        <div style={{ position: "absolute", left: 20, top: 14, fontFamily: MONT, fontWeight: 800, fontSize: 28, color: INK }}>START</div>
        <div style={{ position: "absolute", right: 20, top: 14, fontFamily: MONT, fontWeight: 800, fontSize: 28, color: INK }}>OTHER SIDE</div>
        {ITEMS.map((e, i) => {
          const a = prev[i] ? 830 : 90, b = cur[i] ? 830 : 90;
          const moving = prev[i] !== cur[i];
          const x = a + (b - a) * k;
          const lift = moving ? Math.sin(Math.PI * k) * -40 : 0;
          return <div key={i} style={{ position: "absolute", left: x, top: 80 + i * 125 + lift, fontSize: 96, lineHeight: 1 }}>{e}</div>;
        })}
        <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center", fontSize: 70, transform: `translateX(${(Math.sin(t * 1.3) * 120)}px)` }}>🚣</div>
      </div>
      <div style={{ marginTop: 18, textAlign: "center" }}>
        <div style={{ display: "inline-block", background: idx === 5 ? GOLD : "rgba(20,10,4,0.86)", color: idx === 5 ? INK : "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 44, borderRadius: 20, padding: "10px 26px", border: `4px solid ${idx === 5 ? INK : GOLD}`, transform: `scale(${pop(t, S(idx) + 0.3, 0.4)})` }}>{STEP[idx]}</div>
      </div>
    </div>
  );
};

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx <= 5) out.push(<River key="rv" c={c} />);
  if (idx === R8) {
    const p = pop(t, S(R8), 0.5);
    out.push(<div key="t" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.2em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>A BRAND NEW MYSTERY</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: RED, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>#8</div>
    </div>);
  }
  if (idx === 7) {
    const rows: [string, string, number][] = [["👨 FATHERS", "× 2", 0.4], ["👦 SONS", "× 2", 1.4]];
    out.push(<div key="fs" style={{ position: "absolute", top: 520, left: 90, right: 90 }}>
      {rows.map(([a, b, d], i) => { const k = pop(t, S(7) + d, 0.4); return <div key={i} style={{ marginTop: 18, display: "flex", justifyContent: "space-between", background: "rgba(255,245,230,0.95)", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 56, borderRadius: 24, padding: "12px 30px", border: `5px solid ${INK}`, transform: `translateX(${(1 - k) * -1100}px)` }}><span>{a}</span><span style={{ color: RED }}>{b}</span></div>; })}
    </div>);
  }
  if (idx === 8) {
    out.push(<div key="fish" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 30 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ fontSize: 140, lineHeight: 1, transform: `scale(${pop(t, S(8) + 0.3 + i * 0.35, 0.4)}) rotate(${Math.sin(t * 3 + i) * 8}deg)` }}>🐟</div>)}
      </div>
      <div style={{ marginTop: 16, display: "inline-block", ...card, fontSize: 56, border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(8) + 1.4, 0.45)})` }}>EXACTLY <span style={{ color: GOLD }}>3 FISH</span></div>
    </div>);
  }
  if (idx === 9) {
    out.push(<div key="rule" style={{ position: "absolute", top: 540, left: 70, right: 70 }}>
      <Badge txt="THE RULE" col={GOLD} />
      <div style={{ ...card, marginTop: 10, fontSize: 48, lineHeight: 1.25, borderLeft: `8px solid ${GOLD}`, transform: `scale(${pop(t, S(9) + 0.2, 0.4)})` }}>EACH ONE = <span style={{ color: GOLD }}>1 WHOLE FISH</span></div>
      <div style={{ marginTop: 16, display: "inline-block", background: RED, color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 48, borderRadius: 20, padding: "8px 26px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(9) + 1.8, 0.4)})` }}>✖ NO SHARING</div>
    </div>);
  }
  if (idx === 10) out.push(<div key="q" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ display: "inline-block", ...card, fontSize: 58, border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(10) + 0.1, 0.45)})` }}>2 👨 + 2 👦 … <span style={{ color: GOLD }}>3 🐟 ?</span></div>
    <div style={{ marginTop: 26, fontFamily: MONT, fontWeight: 800, fontSize: 150, lineHeight: 1, color: GOLD, WebkitTextStroke: `11px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, S(10) + 0.7, 0.45)})` }}>HOW?</div>
  </div>);
  if (idx >= 11) {
    const a = S(11);
    out.push(<div key="vote" style={{ position: "absolute", left: 60, right: 60, top: 470 }}>
      <div style={{ textAlign: "center", fontSize: 110, lineHeight: 1, transform: `scale(${pop(t, a + 0.1, 0.45)})` }}>🎣</div>
      <div style={{ marginTop: 26, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a + 0.8, 0.45)})` }}>COMMENT WHO THEY ARE</div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: GOLD, textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: tw(t, a + 1.4, a + 1.9) }}>ANSWER AT SUNRISE</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1106riddle-mix.m4a",
  imgDir: "d1106",
  logo: "day1/solve-by-sunrise.png",
  brand: "SOLVE BY SUNRISE",
  keyword: /wolf|goat|cabbage|river|alone|safe|trick|fathers?|sons|fish|exactly|three|whole|shares|possible|sunrise|answer/i,
  particles: (c) => (c.idx >= 7 ? "dust" : "rain"),
  captionTop: (c) => (c.idx <= 5 ? 1300 : 1180),
  shakeAt: [5, 6, 10],
  shots: [
    { img: "r7_trio.jpg", from: 0, to: 1, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.55, fx1: 0.5, fy1: 0.5 },
    { img: "r7_boat.jpg", from: 1, to: 2, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r7_danger.jpg", from: 2, to: 3, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r7_river.jpg", from: 3, to: 4, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r7_question.jpg", from: 4, to: 5, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r7_far.jpg", from: 5, to: 6, z0: 1.0, z1: 1.06, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r8_question.jpg", from: 6, to: 7, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r8_rods.jpg", from: 7, to: 8, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r8_fish.jpg", from: 8, to: 9, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r8_rods.jpg", from: 9, to: 10, z0: 1.15, z1: 1.05, fx0: 0.65, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r8_fish.jpg", from: 10, to: 11, z0: 1.15, z1: 1.0, fx0: 0.45, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r8_question.jpg", from: 11, to: 999, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1106Riddle: React.FC = () => <HouseShort cfg={CFG} />;
