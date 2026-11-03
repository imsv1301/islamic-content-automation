import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, RED, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1103riddle-timing.json";

/* Solve by Sunrise, 3 Nov 2026: Riddle #4 solution (three boxes, every label wrong: pick from box 3, labelled MIXED)
   then Riddle #5 (three switches, one lamp behind a closed door, open the door only once). No salam. Only Person 1, faceless. */
const TM = data as unknown as Timing;
export const D1103_RIDDLE_DUR = houseDur(TM);
const R5 = 5; // transition line; Riddle #5 starts at 6
const PLACE = ["THE WORKSHOP", "THE ANSWER", "THE LOGIC", "ONE FRUIT", "ALL 3 FIXED", "", "THE HALLWAY", "THE OTHER ROOM", "THE RULES", "THE DOOR", "THE RULES", "THE QUESTION", "YOUR MOVE"];

const card: React.CSSProperties = { background: "rgba(20,10,4,0.82)", color: "#fff", fontFamily: MONT, fontWeight: 800, borderRadius: 18, padding: "14px 22px" };
const Badge: React.FC<{ txt: string; col: string }> = ({ txt, col }) => <div style={{ display: "inline-block", background: col, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 30, borderRadius: 14, padding: "6px 18px" }}>{txt}</div>;

const Hud = (c: Ctx) => {
  const { t, S, idx } = c;
  if (idx === R5) return null;
  if (idx < R5) return <HudBlock t={t} at={S(idx)} day="YESTERDAY'S MYSTERY" big={<>ANSWER</>} place={PLACE[idx]} tag="RIDDLE #4" tagBg="#2a9d8f" />;
  return <HudBlock t={t} at={S(idx)} day="DAY 5" big={<>9:40<span style={{ fontSize: 30, marginLeft: 8 }}>PM</span></>} place={PLACE[idx]} tag="RIDDLE #5" tagBg={RED} />;
};

const Switch: React.FC<{ n: number; k: number; up?: number }> = ({ n, k, up = 0 }) => (
  <div style={{ width: 200, transform: `scale(${k})`, textAlign: "center" }}>
    <div style={{ margin: "0 auto", width: 150, height: 230, borderRadius: 22, background: "#e9d8b4", border: `6px solid ${INK}`, boxShadow: "0 12px 0 rgba(0,0,0,0.3)", position: "relative" }}>
      <div style={{ position: "absolute", left: 45, width: 60, height: 90, top: 30 + 80 * (1 - up), borderRadius: 14, background: "#b8893c", border: `5px solid ${INK}` }} />
    </div>
    <div style={{ marginTop: 10, fontFamily: MONT, fontWeight: 800, fontSize: 60, color: "#fff", WebkitTextStroke: `7px ${INK}`, paintOrder: "stroke fill" }}>{n}</div>
  </div>
);

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) {
    const p = pop(t, S(0) + 0.3, 0.45);
    out.push(<div key="re" style={{ position: "absolute", top: 540, left: 60, right: 60, transform: `scale(${0.7 + 0.3 * p})`, opacity: p }}>
      <Badge txt="RECAP" col={GOLD} />
      <div style={{ ...card, marginTop: 10, fontSize: 38, lineHeight: 1.2, borderLeft: `8px solid ${GOLD}` }}>3 BOXES · 1 FRUIT · <span style={{ color: RED }}>EVERY LABEL WRONG</span></div>
    </div>);
  }
  if (idx === 1) {
    const p = pop(t, S(1) + 0.3, 0.4);
    out.push(<div key="ans" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${2.2 - 1.2 * p}) rotate(-5deg)`, opacity: p }}>
      <div style={{ display: "inline-block", border: `10px solid #2a9d8f`, borderRadius: 20, padding: "10px 34px", fontFamily: MONT, fontWeight: 800, fontSize: 84, lineHeight: 1.05, color: INK, background: "rgba(255,245,230,0.94)" }}>BOX 3<br /><span style={{ color: "#2a9d8f", fontSize: 60 }}>LABELLED “MIXED”</span></div>
    </div>);
  }
  if (idx === 2) {
    const p1 = pop(t, S(2) + 0.2, 0.45), p2 = pop(t, S(2) + 1.4, 0.45);
    out.push(<div key="logic" style={{ position: "absolute", top: 540, left: 70, right: 70 }}>
      <div style={{ ...card, fontSize: 46, transform: `translateX(${(1 - p1) * -700}px)`, borderLeft: `8px solid ${RED}` }}>“MIXED” <span style={{ color: RED }}>✕ WRONG</span></div>
      <div style={{ ...card, marginTop: 16, fontSize: 46, transform: `translateX(${(1 - p2) * 700}px)`, borderLeft: `8px solid ${GOLD}` }}>→ <span style={{ color: GOLD }}>ONE KIND</span> ONLY</div>
    </div>);
  }
  if (idx === 3) {
    const p = pop(t, S(3) + 0.3, 0.5);
    out.push(<div key="ap" style={{ position: "absolute", top: 580, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "#e63946", color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 64, borderRadius: 26, padding: "16px 36px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>🍎 = BOX 3 IS APPLES</div>
    </div>);
  }
  if (idx === 4) {
    const rows: [string, string, string][] = [["BOX 3 “MIXED”", "APPLES", "#e63946"], ["BOX 2 “ORANGES”", "MIXED", "#e9c46a"], ["BOX 1 “APPLES”", "ORANGES", "#f4a261"]];
    out.push(<div key="fix" style={{ position: "absolute", top: 520, left: 60, right: 60 }}>
      {rows.map(([a, b, col], i) => {
        const k = pop(t, S(4) + 0.3 + i * 0.9, 0.4);
        return <div key={i} style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", background: col, borderRadius: 22, padding: "14px 24px", border: `4px solid ${INK}`, transform: `translateX(${(1 - k) * 700}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)", fontFamily: MONT, fontWeight: 800, color: INK }}>
          <span style={{ fontSize: 32 }}>{a}</span><span style={{ fontSize: 42 }}>→ {b}</span></div>;
      })}
    </div>);
  }
  if (idx === R5) {
    const p = pop(t, S(R5), 0.5);
    out.push(<div key="t" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.2em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>A BRAND NEW MYSTERY</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: RED, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>#5</div>
    </div>);
  }
  if (idx === 6) {
    out.push(<div key="sw" style={{ position: "absolute", top: 500, left: 40, right: 40, display: "flex", justifyContent: "center", gap: 20 }}>
      {[1, 2, 3].map((n, i) => <Switch key={n} n={n} k={pop(t, S(6) + 0.4 + i * 0.4, 0.4)} />)}
    </div>);
    const k = pop(t, S(6) + 2.0, 0.45);
    out.push(<div key="one" style={{ position: "absolute", top: 900, left: 0, right: 0, textAlign: "center", transform: `scale(${k})` }}>
      <div style={{ display: "inline-block", ...card, fontSize: 46, border: `4px solid ${GOLD}` }}>ONLY <span style={{ color: GOLD }}>ONE</span> WORKS THE LAMP</div>
    </div>);
  }
  if (idx === 7) {
    const p = pop(t, S(7) + 0.4, 0.45);
    out.push(<div key="lamp" style={{ position: "absolute", top: 580, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "#457b9d", color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 52, borderRadius: 24, padding: "16px 32px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>💡 OUT OF SIGHT</div>
    </div>);
  }
  if (idx === 8) {
    const p = pop(t, S(8) + 0.1, 0.45);
    out.push(<div key="p1" style={{ position: "absolute", top: 560, left: 60, transform: `translateX(${(1 - p) * -500}px)` }}>
      <Badge txt="PERSON 1" col="#3a86ff" />
      <div style={{ ...card, marginTop: 10, fontSize: 38, maxWidth: 800, borderLeft: "8px solid #3a86ff" }}>“FLIP THEM AS MANY TIMES AS YOU LIKE.”</div>
    </div>);
  }
  if (idx === 9) {
    const p = pop(t, S(9) + 0.3, 0.4);
    out.push(<div key="once" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${2.2 - 1.2 * p}) rotate(-6deg)`, opacity: p }}>
      <div style={{ display: "inline-block", border: `10px solid ${RED}`, borderRadius: 20, padding: "10px 34px", fontFamily: MONT, fontWeight: 800, fontSize: 80, color: RED, background: "rgba(255,245,230,0.92)" }}>DOOR: OPEN ONCE</div>
    </div>);
  }
  if (idx === 10) {
    const rules = ["NO HELPERS", "NO CAMERAS", "ONE VISIT"];
    out.push(<div key="rules" style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {rules.map((s, i) => <div key={i} style={{ background: ["#2a9d8f", "#e9c46a", RED][i], color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 50, borderRadius: 24, padding: "10px 34px", border: `5px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)", transform: `scale(${pop(t, S(10) + 0.2 + i * 0.45, 0.4)})` }}>{s}</div>)}
    </div>);
  }
  if (idx === 11) {
    const p = pop(t, S(11) + 0.1, 0.45);
    out.push(<div key="wb" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 100, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", transform: `scale(${p})` }}>WHICH<br /><span style={{ color: GOLD }}>SWITCH?</span></div>);
  }
  if (idx >= 12) {
    const a = S(12);
    out.push(<div key="vote" style={{ position: "absolute", left: 60, right: 60, top: 470 }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        {[1, 2, 3].map((n, i) => <Switch key={n} n={n} k={pop(t, a + 0.2 + i * 0.3, 0.4)} />)}
      </div>
      <div style={{ marginTop: 26, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a + 1.0, 0.45)})` }}>COMMENT HOW</div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: GOLD, textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: tw(t, a + 1.6, a + 2.1) }}>ANSWER AT SUNRISE</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1103riddle-mix.m4a",
  imgDir: "d1103",
  logo: "day1/solve-by-sunrise.png",
  brand: "SOLVE BY SUNRISE",
  keyword: /wrong|mixed|apple|apples|oranges|box|switches|switch|lamp|door|once|person|visit|how|sunrise|three|one/i,
  particles: () => "dust",
  captionTop: (c) => (c.idx >= 12 ? 1290 : c.idx === 6 ? 1240 : 1180),
  shakeAt: [1, 5, 9],
  shots: [
    { img: "r4_wrong.jpg", from: 0, to: 1, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r4_boxes.jpg", from: 1, to: 2, z0: 1.14, z1: 1.02, fx0: 0.6, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r4_labelling.jpg", from: 2, to: 3, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r4_apples.jpg", from: 3, to: 4, z0: 1.14, z1: 1.0, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.5 },
    { img: "r4_oranges.jpg", from: 4, to: 5, z0: 1.0, z1: 1.12, fx0: 0.55, fy0: 0.5, fx1: 0.45, fy1: 0.5 },
    { img: "r_doors.jpg", from: 5, to: 6, z0: 1.12, z1: 1.02, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r5_switches.jpg", from: 6, to: 7, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r5_lamp.jpg", from: 7, to: 8, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s3_stairs_a.jpg", from: 8, to: 9, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r_exit.jpg", from: 9, to: 10, z0: 1.02, z1: 1.14, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r5_hand.jpg", from: 10, to: 11, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r5_switches.jpg", from: 11, to: 12, z0: 1.16, z1: 1.04, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s4_book_a.jpg", from: 12, to: 999, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1103Riddle: React.FC = () => <HouseShort cfg={CFG} />;
