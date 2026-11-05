import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, RED, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1105riddle-timing.json";

/* Solve by Sunrise, 5 Nov 2026: Riddle #6 solution (4-min and 7-min sand timers: start both; flip the 4 at 4; flip the 7 at 7;
   flip the 7 again at 8; it runs out at 9) then Riddle #7 (wolf, goat and cabbage across a river; the boat holds Person 1 + one thing).
   No salam. Only Person 1, faceless (back view). */
const TM = data as unknown as Timing;
export const D1105_RIDDLE_DUR = houseDur(TM);
const R7 = 6; // transition line; Riddle #7 starts at 7
const PLACE = ["THE KITCHEN", "0:00", "4:00", "7:00", "8:00", "9:00", "", "THE RIVER", "THE BOAT", "THE DANGER", "THE QUESTION", "YOUR MOVE"];

const card: React.CSSProperties = { background: "rgba(20,10,4,0.82)", color: "#fff", fontFamily: MONT, fontWeight: 800, borderRadius: 18, padding: "14px 22px" };
const Badge: React.FC<{ txt: string; col: string }> = ({ txt, col }) => <div style={{ display: "inline-block", background: col, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 30, borderRadius: 14, padding: "6px 18px" }}>{txt}</div>;

const Hud = (c: Ctx) => {
  const { t, S, idx } = c;
  if (idx === R7) return null;
  if (idx < R7) return <HudBlock t={t} at={S(idx)} day="YESTERDAY'S MYSTERY" big={<>ANSWER</>} place={PLACE[idx]} tag="RIDDLE #6" tagBg="#2a9d8f" />;
  return <HudBlock t={t} at={S(idx)} day="DAY 7" big={<>6:10<span style={{ fontSize: 30, marginLeft: 8 }}>AM</span></>} place={PLACE[idx]} tag="RIDDLE #7" tagBg={RED} />;
};

/* sand timer drawn in CSS: sand level animates by p (0 = full top, 1 = empty top) */
const Hourglass: React.FC<{ label: string; k: number; p: number; col: string }> = ({ label, k, p, col }) => {
  const top = 1 - p, bot = p; const id = label.replace(/[^a-z0-9]/gi, "");
  return (
    <div style={{ width: 260, textAlign: "center", transform: `scale(${k})` }}>
      <div style={{ margin: "0 auto", width: 200, height: 18, background: "#8a5a2b", borderRadius: 8, border: `4px solid ${INK}` }} />
      <div style={{ position: "relative", margin: "0 auto", width: 170, height: 300 }}>
        <svg width={170} height={300} viewBox="0 0 170 300">
          <path d="M10 0 H160 C160 90 100 120 92 150 C100 180 160 210 160 300 H10 C10 210 70 180 78 150 C70 120 10 90 10 0 Z" fill="rgba(255,250,235,0.35)" stroke={INK} strokeWidth={6} />
          <clipPath id={`tp${id}`}><rect x={0} y={150 - 130 * top} width={170} height={130 * top} /></clipPath>
          <path clipPath={`url(#tp${id})`} d="M14 4 H156 C156 90 98 120 88 150 H82 C72 120 14 90 14 4 Z" fill={col} />
          <clipPath id={`bt${id}`}><rect x={0} y={296 - 130 * bot} width={170} height={130 * bot} /></clipPath>
          <path clipPath={`url(#bt${id})`} d="M82 150 H88 C98 180 156 210 156 296 H14 C14 210 72 180 82 150 Z" fill={col} />
          {p > 0 && p < 1 ? <rect x={83} y={150} width={4} height={140} fill={col} /> : null}
        </svg>
      </div>
      <div style={{ margin: "0 auto", width: 200, height: 18, background: "#8a5a2b", borderRadius: 8, border: `4px solid ${INK}` }} />
      <div style={{ marginTop: 12, display: "inline-block", background: col, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 46, borderRadius: 18, padding: "6px 22px", border: `4px solid ${INK}` }}>{label}</div>
    </div>
  );
};


/* story minute m(t): 0 at line 1, 4 at line 2, 7 at line 3, 8 at line 4, 9 at line 5 */
const minuteAt = (t: number, S: (i: number) => number) => {
  const ks: [number, number][] = [[S(1) + 0.6, 0], [S(2) + 0.9, 4], [S(3) + 0.9, 7], [S(4) + 1.2, 8], [S(5) + 0.6, 9]];
  if (t <= ks[0][0]) return 0;
  for (let i = 1; i < ks.length; i++) if (t <= ks[i][0]) { const [a, ma] = ks[i - 1], [b, mb] = ks[i]; return ma + (mb - ma) * (t - a) / (b - a); }
  return 9;
};
/* top-bulb fraction, simulated: 4-timer flipped at 0, 4, 8; 7-timer flipped at 0, 7, 8 */
const small = (m: number) => (m < 4 ? 1 - m / 4 : m < 8 ? 1 - (m - 4) / 4 : Math.max(0, 1 - (m - 8) / 4));
const big = (m: number) => (m < 7 ? 1 - m / 7 : m < 8 ? 1 - (m - 7) / 7 : Math.max(0, 1 / 7 - (m - 8) / 7));

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) {
    const p = pop(t, S(0) + 0.3, 0.45);
    out.push(<div key="re" style={{ position: "absolute", top: 540, left: 60, right: 60, transform: `scale(${0.7 + 0.3 * p})`, opacity: p }}>
      <Badge txt="RECAP" col={GOLD} />
      <div style={{ ...card, marginTop: 10, fontSize: 40, lineHeight: 1.2, borderLeft: `8px solid ${GOLD}` }}>🥚 EXACTLY 9:00 · ⏳ 4 MIN + ⏳ 7 MIN</div>
    </div>);
  }
  if (idx >= 1 && idx <= 5) {
    const m = minuteAt(t, S);
    const k = idx === 1 ? pop(t, S(1) + 0.1, 0.45) : 1;
    const flips: [number, string][] = [[2, "FLIP THE 4"], [3, "FLIP THE 7"], [4, "FLIP THE 7 AGAIN"]];
    const fl = flips.find((f) => f[0] === idx);
    out.push(<div key="clk" style={{ position: "absolute", top: 440, left: 0, right: 0, textAlign: "center", transform: `scale(${k})` }}>
      <div style={{ display: "inline-block", ...card, fontSize: 84, padding: "6px 34px", border: `5px solid ${idx === 5 ? GOLD : "#fff"}`, color: idx === 5 ? GOLD : "#fff" }}>{Math.floor(m)}:{String(Math.floor((m % 1) * 60)).padStart(2, "0")}</div>
    </div>);
    out.push(<div key="hg" style={{ position: "absolute", top: 600, left: 40, right: 40, display: "flex", justifyContent: "center", gap: 60, transform: `scale(${k})` }}>
      <Hourglass label="4 MIN" k={1} p={1 - small(m)} col="#f4a261" />
      <Hourglass label="7 MIN" k={1} p={1 - big(m)} col="#e9c46a" />
    </div>);
    if (fl) out.push(<div key="fl" style={{ position: "absolute", top: 1130, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(idx) + 0.9, 0.4)})` }}>
      <div style={{ display: "inline-block", background: RED, color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 50, borderRadius: 20, padding: "8px 30px", border: `5px solid ${INK}` }}>🔄 {fl[1]}</div>
    </div>);
    if (idx === 5) out.push(<div key="ok" style={{ position: "absolute", top: 1130, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(5) + 0.7, 0.45)})` }}>
      <div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 54, borderRadius: 20, padding: "8px 30px", border: `5px solid ${INK}` }}>✅ EXACTLY 9 MINUTES</div>
    </div>);
  }
  if (idx === R7) {
    const p = pop(t, S(R7), 0.5);
    out.push(<div key="t" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.2em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>A BRAND NEW MYSTERY</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: RED, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>#7</div>
    </div>);
  }
  if (idx === 7) {
    const p = pop(t, S(7) + 0.1, 0.45);
    out.push(<div key="p1" style={{ position: "absolute", top: 520, left: 60, transform: `translateX(${(1 - p) * -500}px)` }}>
      <Badge txt="PERSON 1" col="#3a86ff" />
      <div style={{ ...card, marginTop: 10, fontSize: 40, maxWidth: 820, borderLeft: "8px solid #3a86ff" }}>TAKE ALL 3 <span style={{ color: GOLD }}>ACROSS THE RIVER</span></div>
    </div>);
    const items = ["🐺 WOLF", "🐐 GOAT", "🥬 CABBAGE"];
    out.push(<div key="it" style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
      {items.map((s, i) => <div key={i} style={{ background: "rgba(255,245,230,0.95)", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 40, borderRadius: 22, padding: "10px 20px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(7) + 1.4 + i * 0.5, 0.4)})` }}>{s}</div>)}
    </div>);
  }
  if (idx === 8) {
    out.push(<div key="boat" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ display: "inline-block", background: "#8ecae6", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 56, borderRadius: 26, padding: "14px 34px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)", transform: `scale(${pop(t, S(8) + 0.3, 0.45)})` }}>🚣 BOAT = 2 SEATS</div>
      <div style={{ marginTop: 18 }}><div style={{ display: "inline-block", ...card, fontSize: 46, border: `4px solid ${GOLD}`, transform: `scale(${pop(t, S(8) + 1.6, 0.45)})` }}>PERSON 1 + <span style={{ color: GOLD }}>ONLY 1 THING</span></div></div>
    </div>);
  }
  if (idx === 9) {
    const rows: [string, number][] = [["🐺 + 🐐 ALONE", 0.3], ["🐐 + 🥬 ALONE", 2.0]];
    out.push(<div key="dz" style={{ position: "absolute", top: 520, left: 80, right: 80 }}>
      {rows.map(([s, d], i) => <div key={i} style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,245,230,0.95)", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 48, borderRadius: 24, padding: "12px 28px", border: `5px solid ${INK}`, transform: `translateX(${(1 - pop(t, S(9) + d, 0.4)) * 1100}px)`, opacity: pop(t, S(9) + d, 0.4) > 0.01 ? 1 : 0 }}>
        <span>{s}</span><span style={{ color: RED, fontSize: 60, opacity: tw(t, S(9) + d + 0.5, S(9) + d + 0.8) }}>✖ EATEN</span></div>)}
    </div>);
  }
  if (idx === 10) out.push(<div key="q" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(10) + 0.4, 0.45)})` }}>
    <div style={{ display: "inline-block", ...card, fontSize: 60, border: `5px solid ${GOLD}` }}>🐺 🐐 🥬 → <span style={{ color: GOLD }}>ALL SAFE?</span></div>
  </div>);
  if (idx >= 11) {
    const a = S(11);
    out.push(<div key="vote" style={{ position: "absolute", left: 60, right: 60, top: 470 }}>
      <div style={{ textAlign: "center", fontSize: 110, lineHeight: 1, transform: `scale(${pop(t, a + 0.1, 0.45)})` }}>🚣</div>
      <div style={{ marginTop: 26, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a + 0.8, 0.45)})` }}>COMMENT THE TRIPS</div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: GOLD, textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: tw(t, a + 1.4, a + 1.9) }}>ANSWER AT SUNRISE</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1105riddle-mix.m4a",
  imgDir: "d1105",
  logo: "day1/solve-by-sunrise.png",
  brand: "SOLVE BY SUNRISE",
  keyword: /egg|nine|exactly|timers?|flip|four|seven|eight|minutes?|wolf|goat|cabbage|river|boat|tiny|safely|person|sunrise|trick/i,
  particles: (c) => (c.idx >= 7 ? "rain" : "dust"),
  captionTop: (c) => (c.idx >= 1 && c.idx <= 5 ? 1300 : 1180),
  shakeAt: [5, 6, 9],
  shots: [
    { img: "r6_kitchen2.jpg", from: 0, to: 1, z0: 1.0, z1: 1.1, fx0: 0.45, fy0: 0.55, fx1: 0.5, fy1: 0.6 },
    { img: "r6_timers.jpg", from: 1, to: 3, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r6_egg.jpg", from: 3, to: 5, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.6, fx1: 0.5, fy1: 0.55 },
    { img: "r6_person.jpg", from: 5, to: 6, z0: 1.18, z1: 1.12, fx0: 0.5, fy0: 0.8, fx1: 0.5, fy1: 0.75 },
    { img: "r7_river.jpg", from: 6, to: 7, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r7_trio.jpg", from: 7, to: 8, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.55, fx1: 0.5, fy1: 0.5 },
    { img: "r7_boat.jpg", from: 8, to: 9, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r7_danger.jpg", from: 9, to: 10, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r7_person2.jpg", from: 10, to: 11, z0: 1.08, z1: 1.0, fx0: 0.42, fy0: 0.5, fx1: 0.42, fy1: 0.5 },
    { img: "r7_question.jpg", from: 11, to: 999, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1105Riddle: React.FC = () => <HouseShort cfg={CFG} />;
