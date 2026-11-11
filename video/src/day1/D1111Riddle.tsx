import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, RED, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1111riddle-timing.json";

/* Solve by Sunrise, Wed 11 Nov 2026: Riddle #12 solution (snail, 10 m well, +3 m day, -2 m night: +1 m per full day,
   7 m after 7 days and nights, day 8 climbs 3 m and is out; animated depth gauge counts the days). Not day 10.
   Then Riddle #13: two ropes, each burns in exactly 1 hour but unevenly; a lighter, no clock. Measure exactly 45 minutes.
   Answer (next video): light rope A at BOTH ends and rope B at one end at the same time. A is gone after 30 min;
   at that moment light the other end of B: its remaining 30 min burns in 15. B finishes at 45 min.
   No salam. No names. Person 1 only, back view. The answer is never shown on screen. */
const TM = data as unknown as Timing;
export const D1111_RIDDLE_DUR = houseDur(TM);
const R13 = 5;
const PLACE = ["THE WELL", "EACH DAY", "AFTER 7 DAYS", "DAY 8", "SOLVED", "", "THE ROPES", "THE CATCH", "NO CLOCK", "THE QUESTION", "YOUR MOVE"];

const card: React.CSSProperties = { background: "rgba(20,10,4,0.82)", color: "#fff", fontFamily: MONT, fontWeight: 800, borderRadius: 18, padding: "14px 22px" };
const big = (col: string, sz: number, stroke = 11): React.CSSProperties => ({ fontFamily: MONT, fontWeight: 800, fontSize: sz, lineHeight: 1, color: col, WebkitTextStroke: `${stroke}px ${INK}`, paintOrder: "stroke fill" });
const chip = (bg: string, col: string, sz = 48): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 18, padding: "8px 24px", border: `5px solid ${INK}` });

const Hud = (c: Ctx) => {
  const { t, S, idx } = c;
  if (idx === R13) return null;
  if (idx < R13) return <HudBlock t={t} at={S(idx)} day="YESTERDAY'S MYSTERY" big={<>ANSWER</>} place={PLACE[idx]} tag="RIDDLE #12" tagBg="#2a9d8f" />;
  return <HudBlock t={t} at={S(idx)} day="DAY 13" big={<>9:15<span style={{ fontSize: 30, marginLeft: 8 }}>PM</span></>} place={PLACE[idx]} tag="RIDDLE #13" tagBg={RED} />;
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

/* rope with uneven thickness; burnt fraction from the left end (bl); flame drawn at the burning edge */
const THICK = [1, 0.6, 1.25, 0.8, 0.5, 1.15, 0.9, 0.55, 1.3, 0.75, 1.05, 0.65];
const Rope: React.FC<{ t: number; bl?: number; label?: string; col?: string; w?: number }> = ({ t, bl = 0, label, col = "#d9a35f", w = 860 }) => {
  const seg = w / THICK.length;
  return (
    <div style={{ position: "relative", width: w + 40, height: 130, margin: "0 auto" }}>
      {label ? <div style={{ position: "absolute", left: -10, top: -6, ...chip(GOLD, INK, 34) }}>{label}</div> : null}
      <div style={{ position: "absolute", left: 20, top: 60, width: w, height: 60, display: "flex", alignItems: "center" }}>
        {THICK.map((k, i) => {
          const x0 = i / THICK.length, x1 = (i + 1) / THICK.length;
          const gone = bl >= x1 ? 1 : bl <= x0 ? 0 : (bl - x0) / (x1 - x0);
          return <div key={i} style={{ width: seg, height: 22 + 30 * k, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(60deg, ${col} 0 10px, #8a5a1c 10px 16px)`, border: `4px solid ${INK}`, borderLeft: "none", borderRight: "none", clipPath: `inset(0 0 0 ${gone * 100}%)` }} />
            {gone > 0 ? <div style={{ position: "absolute", left: 0, top: "40%", width: `${gone * 100}%`, height: 6, background: "#3a2a20", opacity: 0.8 }} /> : null}
          </div>;
        })}
      </div>
      {bl > 0 && bl < 1 ? <div style={{ position: "absolute", left: 20 + bl * w - 34, top: 6 + Math.sin(t * 13) * 3, fontSize: 70, lineHeight: 1, filter: "drop-shadow(0 0 18px rgba(255,140,0,0.95))" }}>🔥</div> : null}
    </div>
  );
};

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const ph = (i: number, a: number, b: number) => tw(t, S(i) + (E(i) - S(i)) * a, S(i) + (E(i) - S(i)) * b);
  const out: React.ReactNode[] = [];
  if (idx === 0) { const u = ph(0, 0.35, 0.6), d = ph(0, 0.7, 0.95);
    out.push(<div key="re" style={{ position: "absolute", top: 410, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 14 }}>
        <div style={{ ...chip(GOLD, INK, 44), transform: `scale(${pop(t, S(0) + 0.3, 0.4)})` }}>☀️ +3 M</div>
        <div style={{ ...chip("#3a4a8a", "#fff", 44), transform: `scale(${pop(t, S(0) + (E(0) - S(0)) * 0.65, 0.4)})` }}>🌙 −2 M</div>
      </div>
      <Well h={3 * u - 2 * d} />
    </div>); }
  if (idx === 1) { const u = ph(1, 0.1, 0.45), d = ph(1, 0.5, 0.8);
    out.push(<div key="net" style={{ position: "absolute", top: 410, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...chip("#2a9d8f", "#fff", 50), marginBottom: 14, transform: `scale(${pop(t, S(1) + (E(1) - S(1)) * 0.75, 0.4)})` }}>1 DAY + 1 NIGHT = +1 M</div>
      <Well h={3 * u - 2 * d} mark={d > 0.95 ? "1 M" : undefined} />
    </div>); }
  if (idx === 2) { const u = ph(2, 0.1, 0.85); const day = Math.min(7, Math.floor(u * 7.999));
    out.push(<div key="seven" style={{ position: "absolute", top: 410, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...chip(GOLD, INK, 50), marginBottom: 14 }}>DAY {Math.max(1, day)} · NIGHT {Math.max(1, day)} → {Math.max(1, day)} M</div>
      <Well h={1 + 6 * u} mark={u > 0.97 ? "7 M" : undefined} />
    </div>); }
  if (idx === 3) { const u = ph(3, 0.15, 0.75);
    out.push(<div key="eight" style={{ position: "absolute", top: 410, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...chip(GOLD, INK, 50), marginBottom: 14 }}>☀️ DAY 8: 7 + 3 = 10 M</div>
      <Well h={7 + 3 * u} mark={u > 0.97 ? "OUT!" : undefined} markCol="#7bd389" />
    </div>); }
  if (idx === 4) out.push(<div key="ans" style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...big(GOLD, 170), transform: `scale(${pop(t, S(4) + 0.05, 0.45)}) rotate(-3deg)` }}>DAY 8</div>
    <div style={{ marginTop: 30, ...chip(RED, "#fff", 56), transform: `scale(${pop(t, S(4) + (E(4) - S(4)) * 0.55, 0.4)})` }}><span style={{ textDecoration: "line-through" }}>DAY 10</span> ❌</div>
    <div style={{ marginTop: 30, fontSize: 130, lineHeight: 1, transform: `translateY(${Math.sin(t * 3) * 10}px)` }}>🐌✨</div>
  </div>);
  if (idx === R13) {
    const p = pop(t, S(R13), 0.5);
    out.push(<div key="t" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.2em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>A BRAND NEW MYSTERY</div>
      <div style={{ ...big(RED, 190, 12) }}>#13</div>
    </div>);
  }
  if (idx === 6) out.push(<div key="ropes" style={{ position: "absolute", top: 430, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip("rgba(255,245,230,0.95)", INK, 46), marginBottom: 30, transform: `scale(${pop(t, S(6) + 0.1, 0.4)})` }}>PERSON 1 · 2 ROPES · 1 LIGHTER</div>
    <div style={{ transform: `translateX(${(1 - pop(t, S(6) + 0.4, 0.5)) * -1200}px)` }}><Rope t={t} label="ROPE A" /></div>
    <div style={{ marginTop: 20, transform: `translateX(${(1 - pop(t, S(6) + 0.7, 0.5)) * 1200}px)` }}><Rope t={t} label="ROPE B" col="#e0b070" /></div>
    <div style={{ marginTop: 20, fontSize: 90, transform: `scale(${pop(t, S(6) + (E(6) - S(6)) * 0.7, 0.4)})` }}>🔥</div>
  </div>);
  if (idx === 7) { const b = ph(7, 0.1, 0.95); const fast = (x: number) => x < 0.5 ? x * 1.6 : 0.8 + (x - 0.5) * 0.4;
    out.push(<div key="uneven" style={{ position: "absolute", top: 430, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...chip(GOLD, INK, 50), marginBottom: 30, transform: `scale(${pop(t, S(7) + 0.1, 0.4)})` }}>⏳ EACH ROPE = 1 HOUR</div>
      <Rope t={t} bl={fast(b)} label="ROPE A" />
      <div style={{ marginTop: 34, display: "flex", justifyContent: "center", gap: 18, opacity: ph(7, 0.45, 0.6) }}>
        <div style={{ ...chip(RED, "#fff", 44) }}>⚡ FAST HERE</div>
        <div style={{ ...chip("#3a4a8a", "#fff", 44) }}>🐢 SLOW THERE</div>
      </div>
    </div>); }
  if (idx === 8) out.push(<div key="no" style={{ position: "absolute", top: 480, left: 0, right: 0, textAlign: "center" }}>
    {["⏰ NO CLOCK", "📱 NO PHONE", "📏 NO RULER"].map((s, i) => <div key={i} style={{ marginTop: i ? 24 : 0 }}><div style={{ ...chip(i === 1 ? GOLD : "rgba(255,245,230,0.95)", INK, 60), transform: `scale(${pop(t, S(8) + (E(8) - S(8)) * (0.1 + i * 0.25), 0.4)}) rotate(${i % 2 ? 2 : -2}deg)` }}><span style={{ textDecoration: "line-through", textDecorationThickness: 6, textDecorationColor: RED }}>{s}</span></div></div>)}
  </div>);
  if (idx === 9) out.push(<div key="q" style={{ position: "absolute", top: 450, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...big(GOLD, 150), transform: `scale(${pop(t, S(9) + 0.2, 0.45)})` }}>EXACTLY</div>
    <div style={{ ...big("#fff", 190), marginTop: 10, transform: `scale(${pop(t, S(9) + 0.6, 0.45)})` }}>45 MIN?</div>
    <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 18 }}>
      {["🪢 2 ROPES", "⏳ 1 HOUR EACH", "🔥 1 LIGHTER"].map((s, i) => <div key={i} style={{ ...chip(i === 1 ? "#3a4a8a" : GOLD, i === 1 ? "#fff" : INK, 38), transform: `scale(${pop(t, S(9) + 1.1 + i * 0.25, 0.4)})` }}>{s}</div>)}
    </div>
  </div>);
  if (idx >= 10) {
    const a = S(10);
    out.push(<div key="vote" style={{ position: "absolute", left: 60, right: 60, top: 470 }}>
      <div style={{ textAlign: "center", fontSize: 110, lineHeight: 1, transform: `scale(${pop(t, a + 0.1, 0.45)})` }}>🪢 🔥 ❓</div>
      <div style={{ marginTop: 26, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 62, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a + 0.8, 0.45)})` }}>COMMENT YOUR PLAN</div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: GOLD, textShadow: "0 3px 12px rgba(0,0,0,0.8)", opacity: tw(t, a + 1.4, a + 1.9) }}>ANSWER AT SUNRISE</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1111riddle-mix.m4a",
  imgDir: "d1111",
  logo: "day1/solve-by-sunrise.png",
  brand: "SOLVE BY SUNRISE",
  keyword: /snail|well|metre|metres|one|seven|eight|top|day|ropes|lighter|hour|unevenly|clock|forty|five|minutes|sunrise|answer/i,
  particles: (c) => (c.idx >= R13 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx <= 3 ? 1420 : c.idx >= 6 && c.idx <= 7 ? 1300 : 1240),
  captionSize: 72,
  shakeAt: [4, 5, 9],
  shots: [
    { img: "r12_well.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r12_gauge.jpg", from: 1, to: 2, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.6, fx1: 0.5, fy1: 0.4 },
    { img: "r12_climb.jpg", from: 2, to: 3, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.6, fx1: 0.5, fy1: 0.4 },
    { img: "r12_top.jpg", from: 3, to: 5, z0: 1.0, z1: 1.15, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.45 },
    { img: "r13_question.jpg", from: 5, to: 6, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r13_person.jpg", from: 6, to: 7, z0: 1.12, z1: 1.02, fx0: 0.5, fy0: 0.55, fx1: 0.5, fy1: 0.5 },
    { img: "r13_burn.jpg", from: 7, to: 8, z0: 1.0, z1: 1.12, fx0: 0.4, fy0: 0.5, fx1: 0.6, fy1: 0.5 },
    { img: "r13_noclock.jpg", from: 8, to: 9, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.45, fx1: 0.5, fy1: 0.55 },
    { img: "r13_ropes.jpg", from: 9, to: 10, z0: 1.0, z1: 1.15, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r13_uneven.jpg", from: 10, to: 999, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1111Riddle: React.FC = () => <HouseShort cfg={CFG} />;
