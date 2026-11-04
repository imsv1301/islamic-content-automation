import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, RED, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1104riddle-timing.json";

/* Solve by Sunrise, 4 Nov 2026: Riddle #5 solution (three switches, one lamp: switch 1 on a few minutes then off, switch 2 on;
   lit = 2, warm = 1, cold = 3) then Riddle #6 (boil an egg for exactly 9 minutes with only a 4-minute and a 7-minute sand timer).
   No salam. Only Person 1, faceless (back view). */
const TM = data as unknown as Timing;
export const D1104_RIDDLE_DUR = houseDur(TM);
const R6 = 5; // transition line; Riddle #6 starts at 6
const PLACE = ["THE HALLWAY", "STEP 1", "STEP 2", "THE DOOR", "THE BULB", "", "THE KITCHEN", "THE RULES", "THE TIMERS", "THE QUESTION", "YOUR MOVE"];

const card: React.CSSProperties = { background: "rgba(20,10,4,0.82)", color: "#fff", fontFamily: MONT, fontWeight: 800, borderRadius: 18, padding: "14px 22px" };
const Badge: React.FC<{ txt: string; col: string }> = ({ txt, col }) => <div style={{ display: "inline-block", background: col, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 30, borderRadius: 14, padding: "6px 18px" }}>{txt}</div>;

const Hud = (c: Ctx) => {
  const { t, S, idx } = c;
  if (idx === R6) return null;
  if (idx < R6) return <HudBlock t={t} at={S(idx)} day="YESTERDAY'S MYSTERY" big={<>ANSWER</>} place={PLACE[idx]} tag="RIDDLE #5" tagBg="#2a9d8f" />;
  return <HudBlock t={t} at={S(idx)} day="DAY 6" big={<>6:15<span style={{ fontSize: 30, marginLeft: 8 }}>AM</span></>} place={PLACE[idx]} tag="RIDDLE #6" tagBg={RED} />;
};

const Switch: React.FC<{ n: number; k: number; up?: number; glow?: string }> = ({ n, k, up = 0, glow }) => (
  <div style={{ width: 200, transform: `scale(${k})`, textAlign: "center" }}>
    <div style={{ margin: "0 auto", width: 150, height: 230, borderRadius: 22, background: "#e9d8b4", border: `6px solid ${INK}`, boxShadow: glow ? `0 0 40px ${glow}, 0 12px 0 rgba(0,0,0,0.3)` : "0 12px 0 rgba(0,0,0,0.3)", position: "relative" }}>
      <div style={{ position: "absolute", left: 45, width: 60, height: 90, top: 30 + 80 * (1 - up), borderRadius: 14, background: up > 0.5 ? GOLD : "#b8893c", border: `5px solid ${INK}` }} />
    </div>
    <div style={{ marginTop: 10, fontFamily: MONT, fontWeight: 800, fontSize: 60, color: "#fff", WebkitTextStroke: `7px ${INK}`, paintOrder: "stroke fill" }}>{n}</div>
  </div>
);

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

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) {
    const p = pop(t, S(0) + 0.3, 0.45);
    out.push(<div key="re" style={{ position: "absolute", top: 540, left: 60, right: 60, transform: `scale(${0.7 + 0.3 * p})`, opacity: p }}>
      <Badge txt="RECAP" col={GOLD} />
      <div style={{ ...card, marginTop: 10, fontSize: 38, lineHeight: 1.2, borderLeft: `8px solid ${GOLD}` }}>3 SWITCHES · 1 LAMP · <span style={{ color: RED }}>OPEN THE DOOR ONCE</span></div>
    </div>);
  }
  if (idx === 1 || idx === 2) {
    const up1 = idx === 1 ? tw(t, S(1) + 0.5, S(1) + 0.8) : 1 - tw(t, S(2) + 0.2, S(2) + 0.5);
    const up2 = idx === 2 ? tw(t, S(2) + 1.2, S(2) + 1.5) : 0;
    out.push(<div key="sw" style={{ position: "absolute", top: 480, left: 40, right: 40, display: "flex", justifyContent: "center", gap: 20 }}>
      {[1, 2, 3].map((n, i) => <Switch key={n} n={n} k={idx === 1 ? pop(t, S(1) + 0.1 + i * 0.15, 0.35) : 1} up={n === 1 ? up1 : n === 2 ? up2 : 0} glow={n === 1 && idx === 1 ? "rgba(255,120,40,0.9)" : undefined} />)}
    </div>);
    const txt = idx === 1 ? <>⏱ WAIT <span style={{ color: GOLD }}>A FEW MINUTES</span></> : <>1 OFF · 2 ON · <span style={{ color: GOLD }}>OPEN!</span></>;
    out.push(<div key="cap" style={{ position: "absolute", top: 880, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(idx) + (idx === 1 ? 1.2 : 1.8), 0.45)})` }}>
      <div style={{ display: "inline-block", ...card, fontSize: 46, border: `4px solid ${GOLD}` }}>{txt}</div>
    </div>);
  }
  if (idx === 3 || idx === 4) {
    const rows: [string, string, string][] = [["💡 LAMP ON", "SWITCH 2", GOLD], ["🔥 OFF BUT WARM", "SWITCH 1", "#f4a261"], ["❄️ OFF AND COLD", "SWITCH 3", "#8ecae6"]];
    const at = [S(3) + 0.2, S(4) + 0.3, S(4) + 2.2];
    out.push(<div key="fix" style={{ position: "absolute", top: 520, left: 60, right: 60 }}>
      {rows.map(([a, b, col], i) => {
        const k = pop(t, at[i], 0.4);
        return <div key={i} style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", background: col, borderRadius: 22, padding: "14px 24px", border: `4px solid ${INK}`, transform: `translateX(${(1 - k) * 800}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)", fontFamily: MONT, fontWeight: 800, color: INK }}>
          <span style={{ fontSize: 36 }}>{a}</span><span style={{ fontSize: 42 }}>→ {b}</span></div>;
      })}
    </div>);
  }
  if (idx === R6) {
    const p = pop(t, S(R6), 0.5);
    out.push(<div key="t" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.2em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>A BRAND NEW MYSTERY</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: RED, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>#6</div>
    </div>);
  }
  if (idx === 6) {
    const p = pop(t, S(6) + 0.1, 0.45);
    out.push(<div key="p1" style={{ position: "absolute", top: 540, left: 60, transform: `translateX(${(1 - p) * -500}px)` }}>
      <Badge txt="PERSON 1" col="#3a86ff" />
      <div style={{ ...card, marginTop: 10, fontSize: 40, maxWidth: 800, borderLeft: "8px solid #3a86ff" }}>🥚 BOIL AN EGG FOR <span style={{ color: GOLD }}>EXACTLY 9:00</span></div>
    </div>);
  }
  if (idx === 7) {
    const rows: [string, string][] = [["⏰ CLOCK", RED], ["📱 PHONE", RED]];
    out.push(<div key="no" style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {rows.map(([s, col], i) => <div key={i} style={{ position: "relative", background: "rgba(255,245,230,0.95)", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 52, borderRadius: 24, padding: "10px 34px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(7) + 0.2 + i * 0.5, 0.4)})` }}>{s}<span style={{ position: "absolute", left: 20, right: 20, top: "48%", height: 10, background: col, transform: `scaleX(${tw(t, S(7) + 0.5 + i * 0.5, S(7) + 0.8 + i * 0.5)}) rotate(-4deg)` }} /></div>)}
      <div style={{ background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 52, borderRadius: 24, padding: "10px 34px", border: `5px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)", transform: `scale(${pop(t, S(7) + 1.8, 0.45)})` }}>⏳⏳ 2 SAND TIMERS</div>
    </div>);
  }
  if (idx === 8 || idx === 9) {
    const k1 = idx === 8 ? pop(t, S(8) + 0.2, 0.45) : 1, k2 = idx === 8 ? pop(t, S(8) + 1.5, 0.45) : 1;
    const run = tw(t, S(8) + 0.4, E(9));
    out.push(<div key="hg" style={{ position: "absolute", top: 470, left: 40, right: 40, display: "flex", justifyContent: "center", gap: 60 }}>
      <Hourglass label="4 MIN" k={k1} p={Math.min(1, run * 1.75)} col="#f4a261" />
      <Hourglass label="7 MIN" k={k2} p={run} col="#e9c46a" />
    </div>);
    if (idx === 9) out.push(<div key="q" style={{ position: "absolute", top: 1010, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(9) + 0.4, 0.45)})` }}>
      <div style={{ display: "inline-block", ...card, fontSize: 58, border: `5px solid ${GOLD}` }}>4 & 7 → <span style={{ color: GOLD }}>9 MIN?</span></div>
    </div>);
  }
  if (idx >= 10) {
    const a = S(10);
    out.push(<div key="vote" style={{ position: "absolute", left: 60, right: 60, top: 470 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 110, lineHeight: 1, color: GOLD, WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a + 0.1, 0.45)})` }}>9:00</div>
      <div style={{ marginTop: 26, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a + 0.8, 0.45)})` }}>COMMENT HOW</div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: GOLD, textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: tw(t, a + 1.4, a + 1.9) }}>ANSWER AT SUNRISE</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1104riddle-mix.m4a",
  imgDir: "d1104",
  logo: "day1/solve-by-sunrise.png",
  brand: "SOLVE BY SUNRISE",
  keyword: /switch|switches|lamp|door|warm|cold|trick|egg|nine|exactly|clock|timers|four|seven|minutes|person|how|sunrise|once/i,
  particles: () => "dust",
  captionTop: (c) => (c.idx === 8 || c.idx === 9 ? 1330 : c.idx === 1 || c.idx === 2 ? 1240 : 1180),
  shakeAt: [3, 5, 9],
  shots: [
    { img: "r5_switches.jpg", from: 0, to: 1, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r5_hand.jpg", from: 1, to: 3, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r5_lamp.jpg", from: 3, to: 5, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r6_timers.jpg", from: 5, to: 6, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r6_kitchen2.jpg", from: 6, to: 7, z0: 1.0, z1: 1.1, fx0: 0.45, fy0: 0.55, fx1: 0.5, fy1: 0.6 },
    { img: "r6_person.jpg", from: 7, to: 8, z0: 1.18, z1: 1.15, fx0: 0.5, fy0: 0.8, fx1: 0.5, fy1: 0.75 },
    { img: "r6_egg.jpg", from: 8, to: 9, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.6, fx1: 0.5, fy1: 0.55 },
    { img: "r6_question.jpg", from: 9, to: 10, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r6_timers.jpg", from: 10, to: 999, z0: 1.16, z1: 1.04, fx0: 0.6, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1104Riddle: React.FC = () => <HouseShort cfg={CFG} />;
