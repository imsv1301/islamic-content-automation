import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, RED, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1101riddle-timing.json";

/* Solve by Sunrise, 1 Nov 2026: Riddle #2 solution (two doors, one lion) then Riddle #3 (the broken vase).
   No salam. Characters are only Person 1 / 2 / 3, all faceless (back views, silhouettes, blank egg heads). */
const TM = data as unknown as Timing;
export const D1101_RIDDLE_DUR = houseDur(TM);
const R3 = 8; // first line of Riddle #3

const CLOCK = ["", "", "", "", "", "", "", "", "6:48", "6:48", "6:49", "6:49", "6:50", "6:51", "6:52"];
const PLACE = ["THE TWO DOORS", "THE TWO DOORS", "THE QUESTION", "PERSON 1 · TRUTH", "PERSON 2 · LIES", "THE LION DOOR", "THE WAY OUT", "", "THE OLD HOUSE", "THE OLD HOUSE", "THE GARDEN?", "THE KITCHEN", "UPSTAIRS", "THE ARMCHAIR", "THE OLD HOUSE"];

const Hud = (c: Ctx) => {
  const { t, S, idx } = c;
  if (idx === 7) return null;
  if (idx < R3) return <HudBlock t={t} at={S(idx)} day="YESTERDAY'S RIDDLE" big={<>ANSWER</>} place={PLACE[idx]} tag="RIDDLE #2" tagBg="#2a9d8f" />;
  const clues = t < S(10) ? 0 : t < S(11) ? 1 : t < S(12) ? 2 : 3;
  return (
    <HudBlock t={t} at={S(idx)} day="DAY 3" big={<>{CLOCK[idx]}<span style={{ fontSize: 30, marginLeft: 8 }}>AM</span></>} place={PLACE[idx]} tag="RIDDLE #3" tagBg={RED}
      pill={<div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(20,10,4,0.75)", borderRadius: 30, padding: "6px 16px", border: `2px solid ${GOLD}` }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: GOLD, letterSpacing: "0.1em" }}>STATEMENTS</span>
        {[0, 1, 2].map((j) => <span key={j} style={{ width: 16, height: 16, borderRadius: 8, background: j < clues ? GOLD : "rgba(255,255,255,0.25)" }} />)}
      </div>} />
  );
};

const card: React.CSSProperties = { background: "rgba(20,10,4,0.82)", color: "#fff", fontFamily: MONT, fontWeight: 800, borderRadius: 18, padding: "14px 22px" };
const Badge: React.FC<{ txt: string; col: string }> = ({ txt, col }) => <div style={{ display: "inline-block", background: col, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 30, borderRadius: 14, padding: "6px 18px" }}>{txt}</div>;

const Cards = (c: Ctx) => {
  const { t, S, NEXT, idx } = c;
  const out: React.ReactNode[] = [];
  // the magic question
  if (idx === 2) {
    const p = pop(t, S(2) + 0.1, 0.45);
    out.push(<div key="q" style={{ position: "absolute", top: 520, left: 60, right: 60, transform: `scale(${0.6 + 0.4 * p})`, opacity: p }}>
      <Badge txt="ASK EITHER GUARD" col={GOLD} />
      <div style={{ ...card, marginTop: 10, fontSize: 40, lineHeight: 1.15, borderLeft: `8px solid ${GOLD}` }}>“IF I ASKED THE OTHER GUARD WHICH DOOR LEADS OUTSIDE, WHICH DOOR WOULD HE POINT TO?”</div>
    </div>);
  }
  // the two cases
  const cases: [number, string, string, string][] = [[3, "PERSON 1 · TRUTH-TELLER", "REPEATS THE LIAR'S LIE", "#3a86ff"], [4, "PERSON 2 · LIAR", "LIES ABOUT THE TRUTH", "#ff6b6b"]];
  for (const [li, who, txt, col] of cases) {
    if (idx < li || idx > 5) continue;
    const p = pop(t, S(li) + 0.1, 0.45);
    out.push(<div key={li} style={{ position: "absolute", top: li === 3 ? 520 : 720, left: 60, transform: `translateX(${(1 - p) * -600}px)` }}>
      <Badge txt={who} col={col} />
      <div style={{ ...card, marginTop: 8, fontSize: 36, borderLeft: `8px solid ${col}` }}>{txt} <span style={{ color: GOLD }}>→ LION DOOR</span></div>
    </div>);
  }
  if (idx === 5) {
    const p = pop(t, S(5) + 0.3, 0.5);
    out.push(<div key="both" style={{ position: "absolute", top: 930, left: 0, right: 0, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: GOLD, WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${p})` }}>BOTH SAY: LION</div>);
  }
  if (idx === 6) {
    const p = pop(t, S(6) + 0.2, 0.5);
    out.push(<div key="other" style={{ position: "absolute", top: 560, left: 90, right: 90, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "#2a9d8f", color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 58, borderRadius: 24, padding: "18px 34px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>TAKE THE OTHER DOOR</div>
    </div>);
  }
  // transition title
  if (idx === 7) {
    const p = pop(t, S(7), 0.5);
    out.push(<div key="t" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.2em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>A BRAND NEW MYSTERY</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: RED, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>#3</div>
    </div>);
  }
  // Riddle #3 statements
  const claims: [number, string, string, string][] = [[10, "PERSON 1", "“I WAS READING IN THE GARDEN.”", "#3a86ff"], [11, "PERSON 2", "“I WAS IN THE KITCHEN, BAKING.”", "#ff8fab"], [12, "PERSON 3", "“I WAS ASLEEP UPSTAIRS.”", "#7bd389"]];
  for (const [li, who, txt, col] of claims) {
    if (!(t >= S(li) - 0.1 && t < NEXT(li) - 0.2)) continue;
    const p = pop(t, S(li) + 0.1, 0.45);
    out.push(<div key={"c" + li} style={{ position: "absolute", top: 560, left: 60, transform: `translateX(${(1 - p) * -500}px)` }}>
      <Badge txt={who} col={col} />
      <div style={{ ...card, marginTop: 10, fontSize: 36, maxWidth: 760, borderLeft: `8px solid ${col}` }}>{txt}</div>
    </div>);
  }
  // vote ending
  if (idx === 14) {
    const a = S(14);
    const opts: [string, string, string][] = [["1", "PERSON 1", "THE READER"], ["2", "PERSON 2", "THE BAKER"], ["3", "PERSON 3", "THE SLEEPER"]];
    const cols = ["#2a9d8f", "#e9c46a", RED];
    out.push(<div key="vote" style={{ position: "absolute", left: 90, right: 90, top: 470 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 96, color: "#fff", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>WHO LIED?</div>
      {opts.map(([n, p, d], i) => {
        const k = pop(t, a + 0.5 + i * 0.25, 0.4);
        return <div key={i} style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 18, background: cols[i], borderRadius: 22, padding: "12px 22px", border: `4px solid ${INK}`, transform: `translateX(${(1 - k) * 700}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)" }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: "#fff", color: INK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 44 }}>{n}</div>
          <div style={{ fontFamily: MONT, color: INK }}><div style={{ fontWeight: 800, fontSize: 40, lineHeight: 1 }}>{p}</div><div style={{ fontWeight: 700, fontSize: 24, letterSpacing: "0.08em" }}>{d}</div></div>
        </div>;
      })}
      <div style={{ marginTop: 24, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: tw(t, a + 1.4, a + 1.9) }}>COMMENT 1 · 2 · 3 <span style={{ color: GOLD }}>· ANSWER AT SUNRISE</span></div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1101riddle-mix.m4a",
  imgDir: "d1101",
  logo: "day1/solve-by-sunrise.png",
  brand: "SOLVE BY SUNRISE",
  keyword: /lion|door|other|truth|liar|lie|lying|question|free|rain|raining|garden|kitchen|asleep|upstairs|closely|away|sunrise|vase|1|2|3/i,
  particles: (c) => (c.idx >= 9 ? "rain" : "dust"),
  captionTop: (c) => (c.idx === 2 ? 1250 : 1180),
  shakeAt: [5, 8],
  shots: [
    { img: "r_doors.jpg", from: 0, to: 1, z0: 1.15, z1: 1.02, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r_guards.jpg", from: 1, to: 2, z0: 1.0, z1: 1.12, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.5, vertical: true },
    { img: "r_traveller.jpg", from: 2, to: 3, z0: 1.02, z1: 1.18, fx0: 0.5, fy0: 0.55, fx1: 0.5, fy1: 0.45, vertical: true },
    { img: "r_guard_truth.jpg", from: 3, to: 4, z0: 1.12, z1: 1.0, fx0: 0.4, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r_guard_lie.jpg", from: 4, to: 5, z0: 1.0, z1: 1.12, fx0: 0.6, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r_lion.jpg", from: 5, to: 6, z0: 1.0, z1: 1.2, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.45, vertical: true },
    { img: "r_exit.jpg", from: 6, to: 8, z0: 1.18, z1: 1.0, fx0: 0.5, fy0: 0.45, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "b_lucid_room.jpg", from: 8, to: 9, z0: 1.18, z1: 1.04, fx0: 0.42, fy0: 0.62, fx1: 0.5, fy1: 0.55, vertical: true },
    { img: "s1_window_a.jpg", from: 9, to: 10, z0: 1.0, z1: 1.12, fx0: 0.4, fy0: 0.5, fx1: 0.45, fy1: 0.55 },
    { img: "c_lucid_person.jpg", from: 10, to: 11, z0: 1.02, z1: 1.16, fx0: 0.5, fy0: 0.4, fx1: 0.5, fy1: 0.48, vertical: true },
    { img: "s2_kitchen_a.jpg", from: 11, to: 12, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.45, fx1: 0.48, fy1: 0.5 },
    { img: "s3_stairs_a.jpg", from: 12, to: 13, z0: 1.0, z1: 1.14, fx0: 0.55, fy0: 0.5, fx1: 0.55, fy1: 0.42 },
    { img: "s4_book_a.jpg", from: 13, to: 14, z0: 1.05, z1: 1.2, fx0: 0.45, fy0: 0.6, fx1: 0.4, fy1: 0.66 },
    { img: "s5_lineup_a.jpg", from: 14, to: 999, z0: 1.16, z1: 1.04, fx0: 0.5, fy0: 0.45, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1101Riddle: React.FC = () => <HouseShort cfg={CFG} />;
