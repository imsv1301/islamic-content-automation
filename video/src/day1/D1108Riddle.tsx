import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, RED, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1108riddle-timing.json";

/* Solve by Sunrise, Sun 8 Nov 2026: Riddle #9 solution (11 seconds: 6 strikes = 5 gaps of 1 s; 12 strikes = 11 gaps)
   then Riddle #10 (a 3-litre and a 5-litre jug, no markings, plenty of water; measure exactly 4 litres).
   Answer (next video): fill the 5, pour into the 3 (2 left), empty the 3, pour the 2 in, fill the 5, top up the 3 (uses 1) = 4 left.
   No salam. No names. People faceless (back views). */
const TM = data as unknown as Timing;
export const D1108_RIDDLE_DUR = houseDur(TM);
const R10 = 5;
const PLACE = ["THE TOWER", "THE ANSWER", "THE GAPS", "ONE SECOND", "SOLVED", "", "THE WELL", "THE JUGS", "THE RULES", "THE GOAL", "THE CATCH", "YOUR MOVE"];

const card: React.CSSProperties = { background: "rgba(20,10,4,0.82)", color: "#fff", fontFamily: MONT, fontWeight: 800, borderRadius: 18, padding: "14px 22px" };
const big = (col: string, sz: number, stroke = 11): React.CSSProperties => ({ fontFamily: MONT, fontWeight: 800, fontSize: sz, lineHeight: 1, color: col, WebkitTextStroke: `${stroke}px ${INK}`, paintOrder: "stroke fill" });
const WATER = "#4cc9f0";

const Hud = (c: Ctx) => {
  const { t, S, idx } = c;
  if (idx === R10) return null;
  if (idx < R10) return <HudBlock t={t} at={S(idx)} day="YESTERDAY'S MYSTERY" big={<>ANSWER</>} place={PLACE[idx]} tag="RIDDLE #9" tagBg="#2a9d8f" />;
  return <HudBlock t={t} at={S(idx)} day="DAY 10" big={<>7:00<span style={{ fontSize: 30, marginLeft: 8 }}>AM</span></>} place={PLACE[idx]} tag="RIDDLE #10" tagBg={RED} />;
};

/* bells with numbered gap markers between them (solution part only) */
const Gaps: React.FC<{ t: number; a: number; n: number; step: number }> = ({ t, a, n, step }) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    {Array.from({ length: n }).map((_, i) => {
      const k = pop(t, a + i * step, 0.3);
      const g = i > 0 ? pop(t, a + (i - 0.5) * step + 0.15, 0.3) : 0;
      return <React.Fragment key={i}>
        {i > 0 ? <div style={{ width: n > 6 ? 22 : 54, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: n > 6 ? 18 : 34, color: INK, background: GOLD, borderRadius: 10, border: `3px solid ${INK}`, flexShrink: 0, transform: `scale(${g})` }}>{i}</div> : null}
        <div style={{ fontSize: n > 6 ? 46 : 84, lineHeight: 1, transform: `scale(${k})` }}>🔔</div>
      </React.Fragment>;
    })}
  </div>
);

/* a plain jug drawn in CSS with a water level (0..1) */
const Jug: React.FC<{ cap: string; fill: number; k: number; w: number; h: number; q?: boolean }> = ({ cap, fill, k, w, h, q }) => (
  <div style={{ textAlign: "center", transform: `scale(${k})` }}>
    <div style={{ position: "relative", width: w, height: h, margin: "0 auto", background: "rgba(255,245,230,0.35)", border: `8px solid ${INK}`, borderRadius: "22px 22px 40px 40px", overflow: "hidden", boxShadow: "0 10px 0 rgba(0,0,0,0.25)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: `linear-gradient(${WATER}, #1d8fb8)` }} />
      {q ? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...big(GOLD, 120, 9) }}>?</div> : null}
    </div>
    <div style={{ marginTop: 14, display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 52, borderRadius: 18, padding: "6px 22px", border: `5px solid ${INK}` }}>{cap}</div>
  </div>
);

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="re" style={{ position: "absolute", top: 540, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ display: "inline-block", ...card, fontSize: 54, border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(0) + 0.3, 0.45)})` }}>🔔 × 6 = <span style={{ color: GOLD }}>5 s</span></div>
    <div style={{ marginTop: 18 }}><div style={{ display: "inline-block", ...card, fontSize: 54, border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(0) + 2.4, 0.45)})` }}>🔔 × 12 = <span style={{ color: GOLD }}>?</span></div></div>
  </div>);
  if (idx === 1) {
    const k = pop(t, S(1) + 1.4, 0.4);
    out.push(<div key="ans" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...big(GOLD, 220, 12), transform: `scale(${pop(t, S(1) + 0.3, 0.5)}) rotate(-3deg)` }}>11 s</div>
      <div style={{ marginTop: 20, display: "inline-block", position: "relative", transform: `scale(${pop(t, S(1) + 1.1, 0.4)})` }}>
        <div style={{ ...big("#fff", 100) }}>NOT 10</div>
        <div style={{ position: "absolute", left: -20, right: -20, top: "46%", height: 16, background: RED, borderRadius: 8, border: `3px solid ${INK}`, transform: `rotate(-8deg) scaleX(${k})` }} />
      </div>
    </div>);
  }
  if (idx === 2) out.push(<div key="g6" style={{ position: "absolute", top: 580, left: 30, right: 30, textAlign: "center" }}>
    <Gaps t={t} a={S(2) + 0.3} n={6} step={0.4} />
    <div style={{ marginTop: 26, display: "inline-block", ...card, fontSize: 54, border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(2) + 2.6, 0.45)})` }}>6 STRIKES = <span style={{ color: GOLD }}>5 GAPS</span></div>
  </div>);
  if (idx === 3) out.push(<div key="div" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ display: "inline-block", ...card, fontSize: 58, border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(3) + 0.2, 0.45)})` }}>5 s ÷ 5 GAPS</div>
    <div style={{ marginTop: 22, ...big(GOLD, 150), transform: `scale(${pop(t, S(3) + 1.6, 0.45)})` }}>= 1 s EACH</div>
  </div>);
  if (idx === 4) out.push(<div key="g12" style={{ position: "absolute", top: 560, left: 10, right: 10, textAlign: "center" }}>
    <Gaps t={t} a={S(4) + 0.2} n={12} step={0.17} />
    <div style={{ marginTop: 26, display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 58, borderRadius: 22, padding: "12px 32px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(4) + 2.2, 0.45)})` }}>✅ 11 GAPS = 11 SECONDS</div>
  </div>);
  if (idx === R10) {
    const p = pop(t, S(R10), 0.5);
    out.push(<div key="t" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.2em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>A BRAND NEW MYSTERY</div>
      <div style={{ ...big(RED, 190, 12) }}>#10</div>
    </div>);
  }
  if (idx === 6) out.push(<div key="well" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ display: "inline-block", background: "rgba(255,245,230,0.95)", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 48, borderRadius: 20, padding: "10px 28px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(6) + 0.2, 0.4)})` }}>PERSON 1 · 🪣 WELL</div>
    <div style={{ marginTop: 18 }}><div style={{ display: "inline-block", ...card, fontSize: 52, border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(6) + 1.6, 0.45)})` }}>2 <span style={{ color: GOLD }}>EMPTY</span> JUGS</div></div>
  </div>);
  if (idx === 7) out.push(<div key="jugs" style={{ position: "absolute", top: 460, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 90 }}>
    <Jug cap="3 L" fill={0} k={pop(t, S(7) + 0.4, 0.45)} w={190} h={260} />
    <Jug cap="5 L" fill={0} k={pop(t, S(7) + 2.2, 0.45)} w={240} h={400} />
  </div>);
  if (idx === 8) out.push(<div key="rules" style={{ position: "absolute", top: 540, left: 80, right: 80 }}>
    <div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 30, borderRadius: 14, padding: "6px 18px" }}>THE RULES</div>
    <div style={{ ...card, marginTop: 10, fontSize: 48, borderLeft: `8px solid ${GOLD}`, transform: `scale(${pop(t, S(8) + 0.2, 0.4)})` }}>❌ NO <span style={{ color: GOLD }}>MARKINGS</span></div>
    <div style={{ ...card, marginTop: 14, fontSize: 48, borderLeft: `8px solid ${GOLD}`, transform: `scale(${pop(t, S(8) + 1.9, 0.4)})` }}>💧 PLENTY OF <span style={{ color: GOLD }}>WATER</span></div>
  </div>);
  if (idx === 9) {
    const f = tw(t, S(9) + 0.3, S(9) + 2.2);
    out.push(<div key="goal" style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center" }}>
      <Jug cap="EXACTLY 4 L" fill={0.8 * f} k={pop(t, S(9) + 0.1, 0.45)} w={240} h={400} q />
    </div>);
  }
  if (idx === 10) out.push(<div key="catch" style={{ position: "absolute", top: 540, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ display: "inline-block", background: RED, color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 50, borderRadius: 20, padding: "8px 28px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(10) + 0.1, 0.4)})` }}>❌ NO GUESSING</div>
    <div style={{ marginTop: 16 }}><div style={{ display: "inline-block", background: RED, color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 50, borderRadius: 20, padding: "8px 28px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(10) + 0.9, 0.4)})` }}>❌ NO HALFWAY</div></div>
    <div style={{ marginTop: 24, ...big(GOLD, 170), transform: `scale(${pop(t, S(10) + 2.0, 0.45)})` }}>HOW?</div>
  </div>);
  if (idx >= 11) {
    const a = S(11);
    out.push(<div key="vote" style={{ position: "absolute", left: 60, right: 60, top: 470 }}>
      <div style={{ textAlign: "center", fontSize: 110, lineHeight: 1, transform: `scale(${pop(t, a + 0.1, 0.45)})` }}>🫙 💧</div>
      <div style={{ marginTop: 26, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 62, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a + 0.8, 0.45)})` }}>COMMENT YOUR STEPS</div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: GOLD, textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: tw(t, a + 1.4, a + 1.9) }}>ANSWER AT SUNRISE</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1108riddle-mix.m4a",
  imgDir: "d1108",
  logo: "day1/solve-by-sunrise.png",
  brand: "SOLVE BY SUNRISE",
  keyword: /clock|tower|twelve|eleven|ten|gaps?|second|well|jugs?|three|five|four|litres|markings|water|guessing|halfway|sunrise|answer/i,
  particles: (c) => (c.idx >= R10 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx === 7 || c.idx === 9 ? 1330 : 1180),
  shakeAt: [1, 5, 10],
  shots: [
    { img: "r9_tower.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.45, fx1: 0.5, fy1: 0.5 },
    { img: "r9_face.jpg", from: 1, to: 2, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r9_bell.jpg", from: 2, to: 3, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r9_bell.jpg", from: 3, to: 4, z0: 1.18, z1: 1.06, fx0: 0.45, fy0: 0.55, fx1: 0.55, fy1: 0.5 },
    { img: "r9_tower.jpg", from: 4, to: 5, z0: 1.0, z1: 1.12, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.45 },
    { img: "r10_question.jpg", from: 5, to: 6, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r10_person.jpg", from: 6, to: 7, z0: 1.3, z1: 1.22, fx0: 0.5, fy0: 0.75, fx1: 0.5, fy1: 0.72 },
    { img: "r10_jugs.jpg", from: 7, to: 8, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r10_well.jpg", from: 8, to: 9, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r10_pour.jpg", from: 9, to: 10, z0: 1.0, z1: 1.15, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r10_jugs.jpg", from: 10, to: 11, z0: 1.15, z1: 1.02, fx0: 0.55, fy0: 0.5, fx1: 0.45, fy1: 0.5 },
    { img: "r10_question.jpg", from: 11, to: 999, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1108Riddle: React.FC = () => <HouseShort cfg={CFG} />;
