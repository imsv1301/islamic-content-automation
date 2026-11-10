import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, RED, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1110riddle-timing.json";

/* Solve by Sunrise, Tue 10 Nov 2026: Riddle #11 solution (3 vs 3; level -> weigh the 2 left over 1 vs 1;
   not level -> from the heavy 3 weigh 1 vs 1; level -> the third ball), animated CSS balance scale shows every weighing.
   Then Riddle #12: snail at the bottom of a 10 m well, climbs 3 m each day, slides back 2 m each night. Which day is it out?
   Answer (next video): day 8 (after 7 days and nights it is at 7 m; on day 8 it climbs 3 m and reaches the top), not day 10.
   No salam. No names. Person 1 only, back view. The answer is never shown on screen. */
const TM = data as unknown as Timing;
export const D1110_RIDDLE_DUR = houseDur(TM);
const R12 = 5;
const PLACE = ["THE BALLS", "WEIGHING 1", "IF LEVEL", "IF NOT LEVEL", "SOLVED", "", "THE WELL", "BY DAY", "BY NIGHT", "THE QUESTION", "YOUR MOVE"];

const card: React.CSSProperties = { background: "rgba(20,10,4,0.82)", color: "#fff", fontFamily: MONT, fontWeight: 800, borderRadius: 18, padding: "14px 22px" };
const big = (col: string, sz: number, stroke = 11): React.CSSProperties => ({ fontFamily: MONT, fontWeight: 800, fontSize: sz, lineHeight: 1, color: col, WebkitTextStroke: `${stroke}px ${INK}`, paintOrder: "stroke fill" });
const chip = (bg: string, col: string, sz = 48): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 18, padding: "8px 24px", border: `5px solid ${INK}` });

const Hud = (c: Ctx) => {
  const { t, S, idx } = c;
  if (idx === R12) return null;
  if (idx < R12) return <HudBlock t={t} at={S(idx)} day="YESTERDAY'S MYSTERY" big={<>ANSWER</>} place={PLACE[idx]} tag="RIDDLE #11" tagBg="#2a9d8f" />;
  return <HudBlock t={t} at={S(idx)} day="DAY 12" big={<>6:40<span style={{ fontSize: 30, marginLeft: 8 }}>AM</span></>} place={PLACE[idx]} tag="RIDDLE #12" tagBg={RED} />;
};

const Ball: React.FC<{ k?: number; sz?: number; glow?: boolean; dim?: boolean }> = ({ k = 1, sz = 80, glow, dim }) => (
  <div style={{ width: sz, height: sz, borderRadius: sz / 2, background: glow ? "radial-gradient(circle at 35% 30%, #fff6c8, #ffd166 55%, #b8860b)" : "radial-gradient(circle at 35% 30%, #ffe2b0, #c97a2b 60%, #7a3e10)", border: `5px solid ${INK}`, transform: `scale(${k})`, boxShadow: glow ? `0 0 40px ${GOLD}` : "0 6px 0 rgba(0,0,0,0.3)", opacity: dim ? 0.35 : 1, flex: "none" }} />
);

/* CSS balance scale: ang > 0 means the LEFT pan is lower */
const Scale: React.FC<{ ang: number; left: number; right: number; k?: number; glowL?: boolean; glowR?: boolean }> = ({ ang, left, right, k = 1, glowL, glowR }) => {
  const L = 300, rad = (ang * Math.PI) / 180;
  const dy = Math.sin(rad) * L;
  const Pan: React.FC<{ n: number; side: number; glow?: boolean }> = ({ n, side, glow }) => (
    <div style={{ position: "absolute", left: 540 + side * Math.cos(rad) * L - 150, top: 170 + side * -dy - 0 + (side < 0 ? 0 : 0), width: 300, textAlign: "center", transform: `translateY(${side < 0 ? dy * 2 * 0 : 0}px)` }}>
      <div style={{ width: 4, height: 150, background: INK, margin: "0 auto" }} />
      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: -2, height: 70, alignItems: "flex-end" }}>
        {Array.from({ length: n }).map((_, i) => <Ball key={i} sz={64} glow={glow} />)}
      </div>
      <div style={{ width: 280, height: 26, margin: "0 auto", background: "linear-gradient(#e0a24a, #8a5a1c)", border: `5px solid ${INK}`, borderRadius: "0 0 140px 140px" }} />
    </div>
  );
  return (
    <div style={{ position: "relative", width: 1080, height: 620, transform: `scale(${k})` }}>
      <div style={{ position: "absolute", left: 50, width: 980, top: 70, height: 580, background: "rgba(20,10,4,0.62)", borderRadius: 44, boxShadow: "0 18px 40px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 530, top: 170, width: 20, height: 420, background: "linear-gradient(90deg,#8a5a1c,#e0a24a,#8a5a1c)", border: `4px solid ${INK}` }} />
      <div style={{ position: "absolute", left: 430, top: 580, width: 220, height: 30, background: "#8a5a1c", border: `5px solid ${INK}`, borderRadius: 12 }} />
      <div style={{ position: "absolute", left: 540 - L - 10, top: 160, width: 2 * L + 20, height: 20, background: "linear-gradient(#ffd166,#b8860b)", border: `5px solid ${INK}`, borderRadius: 10, transform: `rotate(${-ang}deg)` }} />
      <div style={{ position: "absolute", left: 518, top: 148, width: 44, height: 44, borderRadius: 22, background: GOLD, border: `5px solid ${INK}` }} />
      <Pan n={left} side={-1} glow={glowL} />
      <Pan n={right} side={1} glow={glowR} />
    </div>
  );
};

/* well depth gauge with a snail; h = metres above the bottom */
const Well: React.FC<{ h: number; k?: number; mark?: string; markCol?: string }> = ({ h, k = 1, mark, markCol = GOLD }) => {
  const H = 640, m = H / 10;
  return (
    <div style={{ position: "relative", width: 520, height: H + 40, margin: "0 auto", transform: `scale(${k})` }}>
      <div style={{ position: "absolute", left: -10, right: -60, top: -20, bottom: -20, background: "rgba(20,10,4,0.6)", borderRadius: 36 }} />
      <div style={{ position: "absolute", left: 150, top: 20, width: 220, height: H, background: "linear-gradient(90deg,#3b2414,#6b4426 50%,#3b2414)", border: `8px solid ${INK}`, borderTop: "none", borderRadius: "0 0 30px 30px", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, background: "#2b6f8f" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 4, width: 280, height: 30, background: "#a7896a", border: `6px solid ${INK}`, borderRadius: 10 }} />
      {Array.from({ length: 11 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 30, top: 20 + H - i * m - 14, width: 110, textAlign: "right", fontFamily: MONT, fontWeight: 800, fontSize: i % 5 === 0 ? 30 : 22, color: i % 5 === 0 ? GOLD : "#fff", textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}>{i} m —</div>
      ))}
      <div style={{ position: "absolute", left: 215, top: 20 + H - h * m - 92, fontSize: 100, lineHeight: 1, transform: "scaleX(-1) rotate(-90deg)", filter: "drop-shadow(0 0 12px rgba(255,209,102,0.9))" }}>🐌</div>
      {mark ? <div style={{ position: "absolute", left: 390, top: 20 + H - h * m - 70, ...chip(markCol, INK, 40) }}>{mark}</div> : null}
    </div>
  );
};

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const ph = (i: number, a: number, b: number) => tw(t, S(i) + (E(i) - S(i)) * a, S(i) + (E(i) - S(i)) * b);
  const out: React.ReactNode[] = [];
  const top = 430;
  if (idx === 0) out.push(<div key="re" style={{ position: "absolute", top: 500, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 90px)", gap: 26, justifyContent: "center" }}>
      {Array.from({ length: 8 }).map((_, i) => <Ball key={i} sz={90} k={pop(t, S(0) + 0.2 + i * 0.12, 0.35)} />)}
    </div>
    <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 20 }}>
      <div style={{ ...chip(RED, "#fff", 46), transform: `scale(${pop(t, S(0) + (E(0) - S(0)) * 0.4, 0.4)})` }}>1 HEAVIER</div>
      <div style={{ ...chip(GOLD, INK, 46), transform: `scale(${pop(t, S(0) + (E(0) - S(0)) * 0.7, 0.4)})` }}>⚖️ ONLY 2 TRIES</div>
    </div>
  </div>);
  if (idx === 1) out.push(<div key="w1" style={{ position: "absolute", top, left: 0, right: 0 }}>
    <div style={{ textAlign: "center", marginBottom: -40 }}><div style={{ ...chip(GOLD, INK, 46), transform: `scale(${pop(t, S(1) + 0.05, 0.35)})` }}>3 ⚖️ 3 · KEEP 2 OFF</div></div>
    <Scale ang={0} left={3} right={3} />
    <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 10, opacity: ph(1, 0.55, 0.75) }}><Ball /><Ball /></div>
  </div>);
  if (idx === 2) {
    const sw = ph(2, 0.45, 0.6);
    out.push(<div key="w2" style={{ position: "absolute", top, left: 0, right: 0 }}>
      <div style={{ textAlign: "center", marginBottom: -40 }}><div style={{ ...chip(sw < 0.5 ? "#2a9d8f" : GOLD, sw < 0.5 ? "#fff" : INK, 46) }}>{sw < 0.5 ? "LEVEL ✅ → IT'S IN THE 2" : "WEIGH 1 ⚖️ 1"}</div></div>
      {sw < 0.5 ? <><Scale ang={0} left={3} right={3} /><div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 10 }}><Ball glow /><Ball glow /></div></>
        : <><Scale ang={0} left={1} right={1} glowL glowR k={0.9 + 0.1 * sw} /><div style={{ textAlign: "center", marginTop: 10 }}><div style={{ ...card, display: "inline-block", fontSize: 44, border: `4px solid ${GOLD}` }}>THE LOWER SIDE = <span style={{ color: GOLD }}>HEAVY</span></div></div></>}
    </div>);
  }
  if (idx === 3) {
    const tilt = ph(3, 0.0, 0.3), sw = ph(3, 0.5, 0.65);
    out.push(<div key="w3" style={{ position: "absolute", top, left: 0, right: 0 }}>
      <div style={{ textAlign: "center", marginBottom: -40 }}><div style={{ ...chip(sw < 0.5 ? RED : GOLD, sw < 0.5 ? "#fff" : INK, 46) }}>{sw < 0.5 ? "ONE SIDE DOWN ⬇️ TAKE THOSE 3" : "WEIGH 1 ⚖️ 1 AGAIN"}</div></div>
      {sw < 0.5 ? <Scale ang={12 * tilt} left={3} right={3} glowL={tilt > 0.8} /> : <Scale ang={0} left={1} right={1} glowL glowR />}
      {sw >= 0.5 ? <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 10 }}><Ball glow /></div> : null}
    </div>);
  }
  if (idx === 4) out.push(<div key="w4" style={{ position: "absolute", top, left: 0, right: 0 }}>
    <div style={{ textAlign: "center", marginBottom: -40 }}><div style={{ ...chip("#2a9d8f", "#fff", 46) }}>LEVEL AGAIN → THE 3RD BALL</div></div>
    <Scale ang={0} left={1} right={1} />
    <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}><Ball sz={110} glow k={1 + 0.08 * Math.sin(t * 6)} /></div>
    <div style={{ textAlign: "center", marginTop: 26 }}><div style={{ ...chip(GOLD, INK, 60), transform: `scale(${pop(t, S(4) + 0.8, 0.45)}) rotate(-2deg)` }}>✅ FOUND IN 2 TRIES</div></div>
  </div>);
  if (idx === R12) {
    const p = pop(t, S(R12), 0.5);
    out.push(<div key="t" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.2em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>A BRAND NEW MYSTERY</div>
      <div style={{ ...big(RED, 190, 12) }}>#12</div>
    </div>);
  }
  if (idx === 6) out.push(<div key="well" style={{ position: "absolute", top: 410, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip("rgba(255,245,230,0.95)", INK, 46), marginBottom: 14, transform: `scale(${pop(t, S(6) + 0.1, 0.4)})` }}>PERSON 1 · A WELL · 10 M DEEP</div>
    <Well h={0} k={pop(t, S(6) + 0.5, 0.5)} />
  </div>);
  if (idx === 7) { const u = ph(7, 0.25, 0.85);
    out.push(<div key="day" style={{ position: "absolute", top: 410, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...chip(GOLD, INK, 50), marginBottom: 14 }}>☀️ EVERY DAY: +3 M</div>
      <Well h={3 * u} mark={u > 0.95 ? "+3" : undefined} />
    </div>); }
  if (idx === 8) { const d = ph(8, 0.3, 0.85);
    out.push(<div key="night" style={{ position: "absolute", top: 410, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...chip("#3a4a8a", "#fff", 50), marginBottom: 14 }}>🌙 EVERY NIGHT: −2 M</div>
      <Well h={3 - 2 * d} mark={d > 0.95 ? "−2" : undefined} markCol="#9fb4ff" />
    </div>); }
  if (idx === 9) out.push(<div key="q" style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...big(GOLD, 150), transform: `scale(${pop(t, S(9) + 0.2, 0.45)})` }}>WHICH DAY?</div>
    <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 18 }}>
      {["☀️ +3", "🌙 −2", "🧱 10 M"].map((s, i) => <div key={i} style={{ ...chip(i === 1 ? "#3a4a8a" : GOLD, i === 1 ? "#fff" : INK, 46), transform: `scale(${pop(t, S(9) + 0.9 + i * 0.25, 0.4)})` }}>{s}</div>)}
    </div>
    <div style={{ marginTop: 40, fontSize: 150, lineHeight: 1, transform: `translateY(${Math.sin(t * 2) * 10}px)` }}>🐌</div>
  </div>);
  if (idx >= 10) {
    const a = S(10);
    out.push(<div key="vote" style={{ position: "absolute", left: 60, right: 60, top: 470 }}>
      <div style={{ textAlign: "center", fontSize: 110, lineHeight: 1, transform: `scale(${pop(t, a + 0.1, 0.45)})` }}>🐌 ❓</div>
      <div style={{ marginTop: 26, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 62, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a + 0.8, 0.45)})` }}>COMMENT THE DAY</div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: GOLD, textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: tw(t, a + 1.4, a + 1.9) }}>ANSWER AT SUNRISE</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1110riddle-mix.m4a",
  imgDir: "d1110",
  logo: "day1/solve-by-sunrise.png",
  brand: "SOLVE BY SUNRISE",
  keyword: /eight|heavier|heavy|three|two|level|third|found|tries|snail|well|ten|metres|day|night|sunrise|answer/i,
  particles: (c) => (c.idx >= R12 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx <= 4 ? 1400 : c.idx >= 6 && c.idx <= 8 ? 1420 : 1180),
  captionSize: 72,
  shakeAt: [4, 5, 8],
  shots: [
    { img: "r11_balls.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r11_level.jpg", from: 1, to: 2, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r11_scale.jpg", from: 2, to: 3, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r11_level.jpg", from: 3, to: 4, z0: 1.18, z1: 1.06, fx0: 0.45, fy0: 0.55, fx1: 0.55, fy1: 0.5 },
    { img: "r11_balls.jpg", from: 4, to: 5, z0: 1.0, z1: 1.14, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.45 },
    { img: "r12_question.jpg", from: 5, to: 6, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r12_person.jpg", from: 6, to: 7, z0: 1.12, z1: 1.02, fx0: 0.5, fy0: 0.55, fx1: 0.5, fy1: 0.5 },
    { img: "r12_climb.jpg", from: 7, to: 8, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.6, fx1: 0.5, fy1: 0.4 },
    { img: "r12_night.jpg", from: 8, to: 9, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.4, fx1: 0.5, fy1: 0.6 },
    { img: "r12_well.jpg", from: 9, to: 10, z0: 1.0, z1: 1.15, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r12_top.jpg", from: 10, to: 999, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1110Riddle: React.FC = () => <HouseShort cfg={CFG} />;
