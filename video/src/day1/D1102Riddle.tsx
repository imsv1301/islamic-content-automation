import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, RED, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1102riddle-timing.json";

/* Solve by Sunrise, 2 Nov 2026: Riddle #3 solution (the broken vase: Person 1 lied, it rained all morning)
   then Riddle #4 (three boxes, every label wrong, one fruit from one box). No salam. Only Person 1 / 2 / 3, faceless. */
const TM = data as unknown as Timing;
export const D1102_RIDDLE_DUR = houseDur(TM);
const R4 = 5; // transition line; Riddle #4 starts at 6
const PLACE = ["THE OLD HOUSE", "PERSON 1", "THE GARDEN", "THE GARDEN", "THE LIAR", "", "THE WORKSHOP", "THE LABELS", "THE LABELS", "THE RULE", "THE RULE", "THE CHOICE", "THE CHOICE", "THE CHOICE"];

const card: React.CSSProperties = { background: "rgba(20,10,4,0.82)", color: "#fff", fontFamily: MONT, fontWeight: 800, borderRadius: 18, padding: "14px 22px" };
const Badge: React.FC<{ txt: string; col: string }> = ({ txt, col }) => <div style={{ display: "inline-block", background: col, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 30, borderRadius: 14, padding: "6px 18px" }}>{txt}</div>;
const BOXES: [string, string, string][] = [["1", "APPLES", "#e63946"], ["2", "ORANGES", "#f4a261"], ["3", "MIXED", "#e9c46a"]];

const Hud = (c: Ctx) => {
  const { t, S, idx } = c;
  if (idx === R4) return null;
  if (idx < R4) return <HudBlock t={t} at={S(idx)} day="YESTERDAY'S MYSTERY" big={<>ANSWER</>} place={PLACE[idx]} tag="RIDDLE #3" tagBg="#2a9d8f" />;
  return <HudBlock t={t} at={S(idx)} day="DAY 4" big={<>7:15<span style={{ fontSize: 30, marginLeft: 8 }}>AM</span></>} place={PLACE[idx]} tag="RIDDLE #4" tagBg={RED} />;
};

const Label: React.FC<{ n: string; txt: string; col: string; k: number; wrong?: number }> = ({ n, txt, col, k, wrong = 0 }) => (
  <div style={{ position: "relative", width: 290, background: "#f3e2c0", borderRadius: 16, border: `5px solid ${INK}`, padding: "10px 8px 14px", textAlign: "center", transform: `scale(${k}) rotate(${(Number(n) - 2) * 3}deg)`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 24, color: "#6b4b2a", letterSpacing: "0.1em" }}>BOX {n}</div>
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 48, color: col, WebkitTextStroke: `2px ${INK}` }}>{txt}</div>
    {wrong > 0 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 150, color: RED, opacity: wrong, transform: `scale(${1.6 - 0.6 * wrong})`, WebkitTextStroke: `6px ${INK}` }}>✕</div>}
  </div>
);

const Cards = (c: Ctx) => {
  const { t, S, NEXT, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) {
    const p = pop(t, S(0) + 0.3, 0.45);
    out.push(<div key="re" style={{ position: "absolute", top: 540, left: 60, right: 60, transform: `scale(${0.7 + 0.3 * p})`, opacity: p }}>
      <Badge txt="RECAP" col={GOLD} />
      <div style={{ ...card, marginTop: 10, fontSize: 38, lineHeight: 1.2, borderLeft: `8px solid ${GOLD}` }}>A BROKEN VASE · HEAVY RAIN · <span style={{ color: RED }}>ONE LIAR</span></div>
    </div>);
  }
  if (idx === 1) {
    const p = pop(t, S(1) + 0.1, 0.45);
    out.push(<div key="c1" style={{ position: "absolute", top: 560, left: 60, transform: `translateX(${(1 - p) * -500}px)` }}>
      <Badge txt="PERSON 1" col="#3a86ff" />
      <div style={{ ...card, marginTop: 10, fontSize: 36, maxWidth: 780, borderLeft: "8px solid #3a86ff" }}>“I WAS READING IN THE GARDEN THE WHOLE TIME.”</div>
    </div>);
  }
  if (idx === 2 || idx === 3) {
    const p = pop(t, S(2) + 0.2, 0.45);
    out.push(<div key="rain" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "#457b9d", color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 54, borderRadius: 24, padding: "16px 32px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>☔ RAIN SINCE SUNRISE</div>
    </div>);
    if (idx === 3) {
      const k = pop(t, S(3) + 0.4, 0.45);
      out.push(<div key="no" style={{ position: "absolute", top: 720, left: 0, right: 0, textAlign: "center", transform: `scale(${k})` }}>
        <div style={{ display: "inline-block", ...card, fontSize: 40, border: `4px solid ${GOLD}` }}>READING OUTSIDE? <span style={{ color: RED }}>IMPOSSIBLE</span></div>
      </div>);
    }
  }
  if (idx === 4) {
    const p = pop(t, S(4) + 0.3, 0.4);
    out.push(<div key="liar" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${2.2 - 1.2 * p}) rotate(-6deg)`, opacity: p }}>
      <div style={{ display: "inline-block", border: `10px solid ${RED}`, borderRadius: 20, padding: "10px 34px", fontFamily: MONT, fontWeight: 800, fontSize: 92, color: RED, background: "rgba(255,245,230,0.9)" }}>PERSON 1 LIED</div>
    </div>);
  }
  if (idx === R4) {
    const p = pop(t, S(R4), 0.5);
    out.push(<div key="t" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.2em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>A BRAND NEW MYSTERY</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: RED, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>#4</div>
    </div>);
  }
  if (idx === 6) {
    const rows: [string, string][] = [["🍎🍎🍎", "ONLY APPLES"], ["🍊🍊🍊", "ONLY ORANGES"], ["🍎🍊🍎", "BOTH"]];
    out.push(<div key="cont" style={{ position: "absolute", top: 500, left: 80, right: 80 }}>
      {rows.map(([e, s], i) => {
        const k = pop(t, S(6) + 0.6 + i * 0.9, 0.4);
        return <div key={i} style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 20, ...card, fontSize: 40, transform: `translateX(${(1 - k) * -700}px)`, borderLeft: `8px solid ${GOLD}` }}><span style={{ fontSize: 46 }}>{e}</span>{s}</div>;
      })}
    </div>);
  }
  if (idx >= 7 && idx <= 8) {
    out.push(<div key="labels" style={{ position: "absolute", top: 520, left: 40, right: 40, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 26 }}>
      {BOXES.map(([n, s, col], i) => <Label key={i} n={n} txt={s} col={col} k={pop(t, S(7) + 0.5 + i * 0.6, 0.4)} wrong={idx === 8 ? tw(t, S(8) + 0.6 + i * 0.25, S(8) + 0.9 + i * 0.25) : 0} />)}
    </div>);
    if (idx === 8) {
      const k = pop(t, S(8) + 1.6, 0.45);
      out.push(<div key="ew" style={{ position: "absolute", top: 980, left: 0, right: 0, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 66, color: GOLD, WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${k})` }}>EVERY LABEL IS WRONG</div>);
    }
  }
  if (idx === 9 || idx === 10) {
    const rules = ["1 FRUIT", "FROM 1 BOX", "NO PEEKING"];
    out.push(<div key="rules" style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {rules.map((s, i) => <div key={i} style={{ background: ["#2a9d8f", "#e9c46a", RED][i], color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 50, borderRadius: 24, padding: "10px 34px", border: `5px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)", transform: `scale(${pop(t, S(9) + 0.4 + i * 0.7, 0.4)})` }}>{s}</div>)}
    </div>);
    if (idx === 10) {
      const k = pop(t, S(10) + 0.5, 0.45);
      out.push(<div key="fix" style={{ position: "absolute", top: 900, left: 0, right: 0, textAlign: "center", transform: `scale(${k})` }}>
        <div style={{ display: "inline-block", ...card, fontSize: 52, border: `5px solid ${GOLD}` }}>→ FIX <span style={{ color: GOLD }}>ALL 3</span> LABELS</div>
      </div>);
    }
  }
  if (idx === 11) {
    const p = pop(t, S(11) + 0.1, 0.45);
    out.push(<div key="wb" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 104, color: "#fff", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", transform: `scale(${p})` }}>WHICH BOX?</div>);
  }
  if (idx >= 12) {
    const a = S(12);
    out.push(<div key="vote" style={{ position: "absolute", left: 90, right: 90, top: 470 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 84, color: "#fff", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>PICK FROM...</div>
      {BOXES.map(([n, s, col], i) => {
        const k = pop(t, a + 0.4 + i * 0.7, 0.4);
        return <div key={i} style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 18, background: col, borderRadius: 22, padding: "12px 22px", border: `4px solid ${INK}`, transform: `translateX(${(1 - k) * 700}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)" }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: "#fff", color: INK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 44 }}>{n}</div>
          <div style={{ fontFamily: MONT, color: INK }}><div style={{ fontWeight: 800, fontSize: 40, lineHeight: 1 }}>BOX {n}</div><div style={{ fontWeight: 700, fontSize: 24, letterSpacing: "0.08em" }}>LABELLED “{s}”</div></div>
        </div>;
      })}
      <div style={{ marginTop: 24, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: idx >= 13 ? tw(t, S(13), S(13) + 0.5) : 0 }}>COMMENT 1 · 2 · 3 <span style={{ color: GOLD }}>· ANSWER AT SUNRISE</span></div>
    </div>);
  }
  void NEXT;
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1102riddle-mix.m4a",
  imgDir: "d1102",
  logo: "day1/solve-by-sunrise.png",
  brand: "SOLVE BY SUNRISE",
  keyword: /liar|lie|rain|raining|garden|sunrise|vase|boxes|box|apples|oranges|mixed|wrong|label|labels|labelled|one|fruit|three|1|2|3/i,
  particles: (c) => (c.idx >= 1 && c.idx <= 4 ? "rain" : "dust"),
  captionTop: (c) => (c.idx >= 12 ? 1290 : 1180),
  shakeAt: [4, 5, 8],
  shots: [
    { img: "r4_vase.jpg", from: 0, to: 1, z0: 1.15, z1: 1.03, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "c_lucid_person.jpg", from: 1, to: 2, z0: 1.02, z1: 1.14, fx0: 0.5, fy0: 0.4, fx1: 0.5, fy1: 0.48, vertical: true },
    { img: "r4_rain_garden.jpg", from: 2, to: 3, z0: 1.0, z1: 1.14, fx0: 0.4, fy0: 0.5, fx1: 0.55, fy1: 0.5 },
    { img: "s1_window_a.jpg", from: 3, to: 4, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.45, fy1: 0.5 },
    { img: "r4_liar.jpg", from: 4, to: 5, z0: 1.0, z1: 1.16, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.45 },
    { img: "r4_three.jpg", from: 5, to: 6, z0: 1.18, z1: 1.04, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r4_boxes.jpg", from: 6, to: 7, z0: 1.0, z1: 1.14, fx0: 0.42, fy0: 0.5, fx1: 0.58, fy1: 0.5 },
    { img: "r4_labelling.jpg", from: 7, to: 8, z0: 1.14, z1: 1.02, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r4_wrong.jpg", from: 8, to: 9, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r4_reach.jpg", from: 9, to: 10, z0: 1.04, z1: 1.18, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.55 },
    { img: "r4_onefruit.jpg", from: 10, to: 11, z0: 1.16, z1: 1.02, fx0: 0.5, fy0: 0.45, fx1: 0.5, fy1: 0.5 },
    { img: "r4_oranges.jpg", from: 11, to: 12, z0: 1.0, z1: 1.14, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.5 },
    { img: "r4_apples.jpg", from: 12, to: 13, z0: 1.12, z1: 1.0, fx0: 0.55, fy0: 0.5, fx1: 0.45, fy1: 0.5 },
    { img: "r4_sunrise.jpg", from: 13, to: 999, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.45 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1102Riddle: React.FC = () => <HouseShort cfg={CFG} />;
