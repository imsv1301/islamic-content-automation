import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, RED, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1113riddle-timing.json";

/* Solve by Sunrise, Fri 13 Nov 2026: Riddle #14 solution (ages): when Person 1 was 6, Person 2 was half as old = 3,
   so Person 2 is always 3 years younger; 70 - 3 = 67 (not 35). Animated age cards with a fixed "GAP 3" bar.
   Then Riddle #15: a pen and a notebook cost £1.10 together; the notebook costs exactly £1 more than the pen;
   how much is the pen? Answer (next video): 5p (pen 5p + notebook £1.05 = £1.10; not 10p).
   Vote options shown, answer never confirmed on screen. No salam. No names. Person 1/2 only, back views. */
const TM = data as unknown as Timing;
export const D1113_RIDDLE_DUR = houseDur(TM);
const R15 = 4;
const PLACE = ["THE AGES", "BACK THEN", "THE GAP", "SOLVED", "", "THE SHOP", "THE CLUE", "THE QUESTION", "YOUR VOTE"];

const big = (col: string, sz: number, stroke = 11): React.CSSProperties => ({ fontFamily: MONT, fontWeight: 800, fontSize: sz, lineHeight: 1, color: col, WebkitTextStroke: `${stroke}px ${INK}`, paintOrder: "stroke fill" });
const chip = (bg: string, col: string, sz = 48): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 18, padding: "8px 24px", border: `5px solid ${INK}` });
const lin = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / Math.max(0.01, b - a)));

const Hud = (c: Ctx) => {
  const { t, S, idx } = c;
  if (idx === R15) return null;
  if (idx < R15) return <HudBlock t={t} at={S(idx)} day="YESTERDAY'S MYSTERY" big={<>ANSWER</>} place={PLACE[idx]} tag="RIDDLE #14" tagBg="#2a9d8f" />;
  return <HudBlock t={t} at={S(idx)} day="DAY 15" big={<>5:40<span style={{ fontSize: 30, marginLeft: 8 }}>PM</span></>} place={PLACE[idx]} tag="RIDDLE #15" tagBg={RED} />;
};

const Age: React.FC<{ label: string; n: React.ReactNode; col: string; k: number }> = ({ label, n, col, k }) => (
  <div style={{ width: 400, background: "rgba(20,10,4,0.84)", borderRadius: 30, border: `5px solid ${col}`, padding: "20px 10px", transform: `scale(${k})` }}>
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 40, color: "#fff" }}>{label}</div>
    <div style={{ ...big(col, 150, 10), marginTop: 10 }}>{n}</div>
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 30, color: "#fff", opacity: 0.85 }}>YEARS OLD</div>
  </div>
);

/* price tag card */
const Tag: React.FC<{ icon: string; label: string; price: React.ReactNode; col: string; k: number }> = ({ icon, label, price, col, k }) => (
  <div style={{ width: 420, background: "rgba(20,10,4,0.86)", borderRadius: 30, border: `5px solid ${col}`, padding: "18px 10px", textAlign: "center", transform: `scale(${k})` }}>
    <div style={{ fontSize: 110, lineHeight: 1.1 }}>{icon}</div>
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 40, color: "#fff", marginTop: 6 }}>{label}</div>
    <div style={{ ...big(col, 96, 9), marginTop: 10 }}>{price}</div>
  </div>
);

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const L = (i: number) => E(i) - S(i);
  const at = (i: number, a: number) => S(i) + L(i) * a;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="re" style={{ position: "absolute", top: 440, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip("rgba(255,245,230,0.95)", INK, 46), marginBottom: 30, transform: `scale(${pop(t, S(0) + 0.1, 0.4)})` }}>⏪ THEN: 6 & HALF AS OLD</div>
    <div style={{ display: "flex", justifyContent: "center", gap: 30 }}>
      <Age label="PERSON 1" n="70" col={GOLD} k={pop(t, at(0, 0.55), 0.45)} />
      <Age label="PERSON 2" n="?" col="#4cc9f0" k={pop(t, at(0, 0.7), 0.45)} />
    </div>
  </div>);
  if (idx === 1) out.push(<div key="s1" style={{ position: "absolute", top: 440, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip(GOLD, INK, 46), marginBottom: 30, transform: `scale(${pop(t, S(1) + 0.1, 0.4)})` }}>½ × 6 = 3</div>
    <div style={{ display: "flex", justifyContent: "center", gap: 30 }}>
      <Age label="PERSON 1" n="6" col={GOLD} k={pop(t, at(1, 0.15), 0.45)} />
      <Age label="PERSON 2" n="3" col="#4cc9f0" k={pop(t, at(1, 0.5), 0.45)} />
    </div>
  </div>);
  if (idx === 2) { const u = lin(t, at(2, 0.1), at(2, 0.85)); const a1 = Math.round(6 + 64 * u);
    out.push(<div key="s2" style={{ position: "absolute", top: 440, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...chip("#2a9d8f", "#fff", 46), marginBottom: 30, transform: `scale(${pop(t, S(2) + 0.1, 0.4)})` }}>EVERY YEAR, BOTH GET +1</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 30 }}>
        <Age label="PERSON 1" n={a1} col={GOLD} k={1} />
        <Age label="PERSON 2" n={a1 - 3} col="#4cc9f0" k={1} />
      </div>
      <div style={{ marginTop: 30, ...chip(RED, "#fff", 56), transform: `scale(${1 + 0.05 * Math.sin(t * 6)})` }}>GAP = 3 YEARS, ALWAYS</div>
    </div>); }
  if (idx === 3) out.push(<div key="s3" style={{ position: "absolute", top: 450, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...big(GOLD, 130), transform: `scale(${pop(t, S(3) + 0.1, 0.45)}) rotate(-3deg)` }}>70 − 3</div>
    <div style={{ marginTop: 20, ...big("#fff", 190), transform: `scale(${pop(t, at(3, 0.3), 0.45)}) rotate(-3deg)` }}>= 67 ✅</div>
    <div style={{ marginTop: 40, ...chip("#3a4a8a", "#fff", 50), transform: `scale(${pop(t, at(3, 0.6), 0.45)})` }}>NOT 35 ❌</div>
  </div>);
  if (idx === R15) {
    const p = pop(t, S(R15), 0.5);
    out.push(<div key="t" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.2em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>A BRAND NEW MYSTERY</div>
      <div style={{ ...big(RED, 190, 12) }}>#15</div>
    </div>);
  }
  if (idx === 5) out.push(<div key="shop" style={{ position: "absolute", top: 430, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ display: "flex", justifyContent: "center", gap: 26 }}>
      <Tag icon="🖊️" label="PEN" price="?" col="#4cc9f0" k={pop(t, at(5, 0.15), 0.45)} />
      <Tag icon="📒" label="NOTEBOOK" price="?" col={GOLD} k={pop(t, at(5, 0.35), 0.45)} />
    </div>
    <div style={{ marginTop: 34, ...big("#fff", 110), transform: `scale(${pop(t, at(5, 0.65), 0.45)})` }}>TOTAL £1.10</div>
  </div>);
  if (idx === 6) out.push(<div key="clue" style={{ position: "absolute", top: 430, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip(GOLD, INK, 46), marginBottom: 30, transform: `scale(${pop(t, S(6) + 0.1, 0.4)})` }}>🔎 THE CLUE</div>
    <div style={{ display: "flex", justifyContent: "center", gap: 26 }}>
      <Tag icon="🖊️" label="PEN" price="?" col="#4cc9f0" k={1} />
      <Tag icon="📒" label="NOTEBOOK" price={<span style={{ fontSize: 66 }}>PEN + £1</span>} col={GOLD} k={pop(t, at(6, 0.35), 0.45)} />
    </div>
  </div>);
  if (idx === 7) out.push(<div key="q" style={{ position: "absolute", top: 460, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ fontSize: 170, transform: `scale(${pop(t, S(7) + 0.1, 0.45)}) rotate(${Math.sin(t * 3) * 6}deg)` }}>🖊️</div>
    <div style={{ ...big(GOLD, 200), marginTop: 6, transform: `scale(${pop(t, at(7, 0.4), 0.45)})` }}>= ?</div>
    <div style={{ marginTop: 30, display: "flex", justifyContent: "center", gap: 18 }}>
      {["TOTAL £1.10", "DIFFERENCE £1"].map((s, i) => <div key={i} style={{ ...chip(i ? GOLD : "#3a4a8a", i ? INK : "#fff", 42), transform: `scale(${pop(t, at(7, 0.55) + i * 0.25, 0.4)})` }}>{s}</div>)}
    </div>
  </div>);
  if (idx >= 8) {
    const a = S(8);
    out.push(<div key="vote" style={{ position: "absolute", left: 60, right: 60, top: 450 }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 22 }}>
        {[["1", "10p"], ["2", "5p"], ["3", "1p"]].map(([k, v], i) => <div key={k} style={{ width: 270, background: "rgba(20,10,4,0.86)", border: `5px solid ${GOLD}`, borderRadius: 28, padding: "18px 0", textAlign: "center", transform: `scale(${pop(t, a + 0.1 + i * 0.25, 0.4)})` }}>
          <div style={{ ...chip(GOLD, INK, 40) }}>{k}</div>
          <div style={{ ...big("#fff", 110, 8), marginTop: 12 }}>{v}</div>
        </div>)}
      </div>
      <div style={{ marginTop: 34, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 62, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a + 1.0, 0.45)})` }}>COMMENT 1 · 2 · 3</div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: GOLD, textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: tw(t, a + 1.5, a + 2.0) }}>ANSWER AT SUNRISE</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1113riddle-mix.m4a",
  imgDir: "d1113",
  logo: "day1/solve-by-sunrise.png",
  brand: "SOLVE BY SUNRISE",
  keyword: /six|half|three|younger|gap|seventy|sixty|seven|mystery|pen|notebook|pound|ten|more|cost|answer|sunrise/i,
  particles: (c) => (c.idx >= R15 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx <= 3 ? 1400 : 1330),
  captionSize: 70,
  shakeAt: [3, 4, 7],
  shots: [
    { img: "r14_years.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r14_young.jpg", from: 1, to: 2, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.55, vertical: true },
    { img: "r14_candles.jpg", from: 2, to: 3, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r14_chairs.jpg", from: 3, to: 4, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.55, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r15_shop.jpg", from: 4, to: 5, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r15_items.jpg", from: 5, to: 6, z0: 1.0, z1: 1.1, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.5 },
    { img: "r15_coins.jpg", from: 6, to: 7, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r15_person.jpg", from: 7, to: 8, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r15_shop.jpg", from: 8, to: 999, z0: 1.2, z1: 1.05, fx0: 0.55, fy0: 0.6, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1113Riddle: React.FC = () => <HouseShort cfg={CFG} />;
