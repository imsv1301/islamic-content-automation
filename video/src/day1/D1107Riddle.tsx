import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, RED, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1107riddle-timing.json";

/* Solve by Sunrise, 7 Nov 2026: Riddle #8 solution (only three people: grandfather, father, grandson; the father is both a father and a son)
   then Riddle #9 (a clock tower strikes 6 times in 5 seconds; how long for 12 strikes? answer: 11 seconds, 11 equal gaps of 1 s).
   No salam. No names. People faceless (back views). */
const TM = data as unknown as Timing;
export const D1107_RIDDLE_DUR = houseDur(TM);
const R9 = 5;
const PLACE = ["THE LAKE", "THE TWIST", "THE FAMILY", "THE MIDDLE ONE", "SOLVED", "", "THE TOWER", "PERSON 1", "THE RULE", "THE QUESTION", "THE TRAP", "YOUR MOVE"];

const card: React.CSSProperties = { background: "rgba(20,10,4,0.82)", color: "#fff", fontFamily: MONT, fontWeight: 800, borderRadius: 18, padding: "14px 22px" };
const big = (col: string, sz: number, stroke = 11): React.CSSProperties => ({ fontFamily: MONT, fontWeight: 800, fontSize: sz, lineHeight: 1, color: col, WebkitTextStroke: `${stroke}px ${INK}`, paintOrder: "stroke fill" });

const Hud = (c: Ctx) => {
  const { t, S, idx } = c;
  if (idx === R9) return null;
  if (idx < R9) return <HudBlock t={t} at={S(idx)} day="YESTERDAY'S MYSTERY" big={<>ANSWER</>} place={PLACE[idx]} tag="RIDDLE #8" tagBg="#2a9d8f" />;
  return <HudBlock t={t} at={S(idx)} day="DAY 9" big={<>6:00<span style={{ fontSize: 30, marginLeft: 8 }}>PM</span></>} place={PLACE[idx]} tag="RIDDLE #9" tagBg={RED} />;
};

const FAM: [string, string][] = [["👴", "GRANDFATHER"], ["👨", "FATHER"], ["👦", "SON"]];
const Family: React.FC<{ c: Ctx }> = ({ c }) => {
  const { t, S, idx } = c;
  const hiMid = idx >= 3 ? pop(t, S(3) + 0.3, 0.5) : 0;
  return <div style={{ position: "absolute", top: 440, left: 150, right: 150 }}>
    {FAM.map(([e, n], i) => {
      const k = idx === 2 ? pop(t, S(2) + 0.2 + i * 0.7, 0.45) : 1;
      const mid = i === 1;
      return <div key={i} style={{ textAlign: "center" }}>
        {i > 0 ? <div style={{ fontSize: 50, color: GOLD, lineHeight: 1, margin: "4px 0", opacity: k, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>⬇</div> : null}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: mid && hiMid > 0 ? GOLD : "rgba(255,245,230,0.95)", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 50, borderRadius: 24, padding: "10px 28px", border: `5px solid ${INK}`, transform: `scale(${k * (mid ? 1 + 0.08 * hiMid : 1)})`, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>
          <span style={{ fontSize: 76 }}>{e}</span><span>{n}</span>
        </div>
        {mid && hiMid > 0 ? <div style={{ marginTop: 10, display: "inline-block", background: RED, color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 40, borderRadius: 18, padding: "6px 22px", border: `4px solid ${INK}`, transform: `scale(${hiMid})` }}>FATHER + SON</div> : null}
      </div>;
    })}
  </div>;
};

/* 6 bell strikes appear one by one, evenly spaced (no labels on the gaps, so the answer is not given away) */
const Strikes: React.FC<{ t: number; a: number; n: number }> = ({ t, a, n }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
    {Array.from({ length: n }).map((_, i) => { const k = pop(t, a + i * 0.32, 0.3); return <div key={i} style={{ fontSize: 84, lineHeight: 1, transform: `scale(${k}) rotate(${Math.sin(t * 9 + i) * 10 * k}deg)` }}>🔔</div>; })}
  </div>
);

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="re" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ display: "inline-block", ...card, fontSize: 56, border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(0) + 0.3, 0.45)})` }}>2 👨 + 2 👦 = <span style={{ color: GOLD }}>3 🐟</span></div>
  </div>);
  if (idx === 1) out.push(<div key="only" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(1) + 0.5, 0.5)}) rotate(-3deg)` }}>
    <div style={{ ...big("#fff", 70, 9) }}>ONLY</div>
    <div style={{ ...big(GOLD, 170) }}>3 PEOPLE</div>
  </div>);
  if (idx === 2 || idx === 3) out.push(<Family key="fam" c={c} />);
  if (idx === 4) {
    const rows: [string, string, number][] = [["FATHERS", "👴 👨", 0.2], ["SONS", "👨 👦", 1.0]];
    out.push(<div key="tally" style={{ position: "absolute", top: 500, left: 110, right: 110 }}>
      {rows.map(([a, b, d], i) => { const k = pop(t, S(4) + d, 0.4); return <div key={i} style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,245,230,0.95)", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 52, borderRadius: 24, padding: "10px 30px", border: `5px solid ${INK}`, transform: `translateX(${(1 - k) * -1100}px)` }}><span>{a}</span><span style={{ fontSize: 70 }}>{b}</span></div>; })}
      <div style={{ marginTop: 26, textAlign: "center" }}><div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 56, borderRadius: 22, padding: "12px 32px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(4) + 2.0, 0.45)})` }}>✅ 3 PEOPLE · 3 FISH</div></div>
    </div>);
  }
  if (idx === R9) {
    const p = pop(t, S(R9), 0.5);
    out.push(<div key="t" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.2em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>A BRAND NEW MYSTERY</div>
      <div style={{ ...big(RED, 190, 12) }}>#9</div>
    </div>);
  }
  if (idx === 6) out.push(<div key="six" style={{ position: "absolute", top: 520, left: 40, right: 40, textAlign: "center" }}>
    <Strikes t={t} a={S(6) + 0.6} n={6} />
    <div style={{ marginTop: 24, display: "inline-block", ...card, fontSize: 58, border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(6) + 2.6, 0.45)})` }}>6 STRIKES = <span style={{ color: GOLD }}>5 SECONDS</span></div>
  </div>);
  if (idx === 7) {
    const n = Math.min(6, Math.max(0, Math.floor((t - S(7) - 0.4) / 0.38) + 1));
    out.push(<div key="cnt" style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ display: "inline-block", background: "rgba(255,245,230,0.95)", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 44, borderRadius: 20, padding: "8px 26px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(7) + 0.1, 0.4)})` }}>PERSON 1 COUNTS</div>
      <div style={{ marginTop: 18, ...big(GOLD, 220, 12), transform: `scale(${1 + 0.06 * Math.sin((t - S(7)) * 16.5)})` }}>{n}</div>
    </div>);
  }
  if (idx === 8) out.push(<div key="rule" style={{ position: "absolute", top: 540, left: 80, right: 80 }}>
    <div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 30, borderRadius: 14, padding: "6px 18px" }}>THE RULE</div>
    <div style={{ ...card, marginTop: 10, fontSize: 48, borderLeft: `8px solid ${GOLD}`, transform: `scale(${pop(t, S(8) + 0.2, 0.4)})` }}>⚡ EACH STRIKE = <span style={{ color: GOLD }}>INSTANT</span></div>
    <div style={{ ...card, marginTop: 14, fontSize: 48, borderLeft: `8px solid ${GOLD}`, transform: `scale(${pop(t, S(8) + 1.6, 0.4)})` }}>⏱ GAPS = <span style={{ color: GOLD }}>ALWAYS EQUAL</span></div>
  </div>);
  if (idx === 9) out.push(<div key="q" style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ display: "inline-block", ...card, fontSize: 60, border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(9) + 0.2, 0.45)})` }}>🔔 × 12 = <span style={{ color: GOLD }}>? SECONDS</span></div>
    <div style={{ marginTop: 26, ...big(GOLD, 200), transform: `scale(${pop(t, S(9) + 1.2, 0.45)})` }}>?</div>
  </div>);
  if (idx === 10) {
    const k = pop(t, S(10) + 0.5, 0.4);
    out.push(<div key="trap" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ display: "inline-block", position: "relative", transform: `scale(${pop(t, S(10) + 0.1, 0.4)})` }}>
        <div style={{ ...big("#fff", 190) }}>10s</div>
        <div style={{ position: "absolute", left: -30, right: -30, top: "48%", height: 22, background: RED, borderRadius: 11, border: `4px solid ${INK}`, transform: `rotate(-12deg) scaleX(${k})` }} />
      </div>
      <div style={{ marginTop: 24 }}><div style={{ display: "inline-block", background: RED, color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 52, borderRadius: 20, padding: "8px 28px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(10) + 1.0, 0.4)})` }}>⚠ IT'S A TRAP</div></div>
    </div>);
  }
  if (idx >= 11) {
    const a = S(11);
    out.push(<div key="vote" style={{ position: "absolute", left: 60, right: 60, top: 470 }}>
      <div style={{ textAlign: "center", fontSize: 110, lineHeight: 1, transform: `scale(${pop(t, a + 0.1, 0.45)})` }}>🕰️</div>
      <div style={{ marginTop: 26, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 62, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a + 0.8, 0.45)})` }}>COMMENT YOUR SECONDS</div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: GOLD, textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: tw(t, a + 1.4, a + 1.9) }}>ANSWER AT SUNRISE</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1107riddle-mix.m4a",
  imgDir: "d1107",
  logo: "day1/solve-by-sunrise.png",
  brand: "SOLVE BY SUNRISE",
  keyword: /fathers?|sons?|fish|three|grandfather|grandson|middle|same|clock|tower|six|five|seconds|strikes?|instant|equal|twelve|ten|careful|sunrise|answer/i,
  particles: (c) => (c.idx >= R9 ? "dust" : "sparkle"),
  captionTop: (c) => (c.idx === 2 || c.idx === 3 ? 1330 : c.idx === 4 ? 1300 : 1180),
  shakeAt: [1, 5, 10],
  shots: [
    { img: "r8_fish.jpg", from: 0, to: 1, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r8_pier3.jpg", from: 1, to: 2, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r8_pier3.jpg", from: 2, to: 3, z0: 1.0, z1: 1.12, fx0: 0.4, fy0: 0.5, fx1: 0.6, fy1: 0.5 },
    { img: "r8_home.jpg", from: 3, to: 4, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r8_home.jpg", from: 4, to: 5, z0: 1.0, z1: 1.1, fx0: 0.55, fy0: 0.5, fx1: 0.45, fy1: 0.5 },
    { img: "r9_question.jpg", from: 5, to: 6, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r9_tower.jpg", from: 6, to: 7, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.4, fx1: 0.5, fy1: 0.5 },
    { img: "r9_person.jpg", from: 7, to: 8, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.6, fx1: 0.5, fy1: 0.4 },
    { img: "r9_bell.jpg", from: 8, to: 9, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r9_face.jpg", from: 9, to: 10, z0: 1.0, z1: 1.15, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r9_bell.jpg", from: 10, to: 11, z0: 1.15, z1: 1.02, fx0: 0.6, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r9_question.jpg", from: 11, to: 999, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1107Riddle: React.FC = () => <HouseShort cfg={CFG} />;
