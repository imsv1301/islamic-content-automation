import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, RED, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1112riddle-timing.json";

/* Solve by Sunrise, Thu 12 Nov 2026: Riddle #13 solution (two uneven ropes, 45 minutes): light rope A at BOTH ends and
   rope B at ONE end together; A's two flames meet after exactly 30 min (wherever they meet); then light B's other end:
   its remaining 30 min of burning takes 15. 30 + 15 = 45. Animated ropes burn from the ends with a minute counter.
   Then Riddle #14: when Person 1 was 6, Person 2 was half as old (3). Person 1 is 70 today. How old is Person 2?
   Answer (next video): 67 (the gap is always 3 years; not 35). Vote options shown, answer never confirmed on screen.
   No salam. No names. Person 1/2 only, back views. */
const TM = data as unknown as Timing;
export const D1112_RIDDLE_DUR = houseDur(TM);
const R14 = 5;
const PLACE = ["THE ROPES", "STEP 1", "30 MINUTES", "STEP 2", "SOLVED", "", "THE PAST", "TODAY", "THE QUESTION", "YOUR VOTE"];

const big = (col: string, sz: number, stroke = 11): React.CSSProperties => ({ fontFamily: MONT, fontWeight: 800, fontSize: sz, lineHeight: 1, color: col, WebkitTextStroke: `${stroke}px ${INK}`, paintOrder: "stroke fill" });
const chip = (bg: string, col: string, sz = 48): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 18, padding: "8px 24px", border: `5px solid ${INK}` });
const lin = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / Math.max(0.01, b - a)));

const Hud = (c: Ctx) => {
  const { t, S, idx } = c;
  if (idx === R14) return null;
  if (idx < R14) return <HudBlock t={t} at={S(idx)} day="YESTERDAY'S MYSTERY" big={<>ANSWER</>} place={PLACE[idx]} tag="RIDDLE #13" tagBg="#2a9d8f" />;
  return <HudBlock t={t} at={S(idx)} day="DAY 14" big={<>7:00<span style={{ fontSize: 30, marginLeft: 8 }}>AM</span></>} place={PLACE[idx]} tag="RIDDLE #14" tagBg={RED} />;
};

/* uneven rope; l = burnt fraction from the left end, r = burnt fraction from the right end; flames at burning edges */
const THICK = [1, 0.6, 1.25, 0.8, 0.5, 1.15, 0.9, 0.55, 1.3, 0.75, 1.05, 0.65];
const Rope: React.FC<{ t: number; l?: number; r?: number; fl?: boolean; fr?: boolean; label: string; col?: string; w?: number; done?: boolean }> = ({ t, l = 0, r = 0, fl = false, fr = false, label, col = "#d9a35f", w = 860, done = false }) => {
  const seg = w / THICK.length;
  const right = 1 - r;
  return (
    <div style={{ position: "relative", width: w + 40, height: 150, margin: "0 auto", background: "rgba(20,10,4,0.72)", borderRadius: 28 }}>
      <div style={{ position: "absolute", left: -10, top: -6, ...chip(GOLD, INK, 34) }}>{label}</div>
      {done ? <div style={{ position: "absolute", right: -10, top: -6, ...chip("#2a9d8f", "#fff", 34) }}>GONE ✓</div> : null}
      <div style={{ position: "absolute", left: 20, top: 70, width: w, height: 70, display: "flex", alignItems: "center" }}>
        {THICK.map((k, i) => {
          const x0 = i / THICK.length, x1 = (i + 1) / THICK.length;
          const gl = l >= x1 ? 1 : l <= x0 ? 0 : (l - x0) / (x1 - x0);
          const gr = right <= x0 ? 1 : right >= x1 ? 0 : (x1 - right) / (x1 - x0);
          const vis = gl + gr < 1;
          return <div key={i} style={{ width: seg, height: 30 + 34 * k, position: "relative" }}>
            {vis ? <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(60deg, ${col} 0 10px, #8a5a1c 10px 16px)`, border: `4px solid ${INK}`, borderLeft: "none", borderRight: "none", clipPath: `inset(0 ${gr * 100}% 0 ${gl * 100}%)` }} /> : null}
            <div style={{ position: "absolute", left: 0, top: "42%", width: "100%", height: 8, background: "#2a1a10", opacity: gl > 0 || gr > 0 ? 0.8 : 0 }} />
          </div>;
        })}
      </div>
      {fl && l < right ? <div style={{ position: "absolute", left: 20 + l * w - 34, top: 30 + Math.sin(t * 13) * 3, fontSize: 80, lineHeight: 1, filter: "drop-shadow(0 0 18px rgba(255,140,0,0.95))" }}>🔥</div> : null}
      {fr && l < right ? <div style={{ position: "absolute", left: 20 + right * w - 46, top: 30 + Math.sin(t * 11 + 1) * 3, fontSize: 80, lineHeight: 1, filter: "drop-shadow(0 0 18px rgba(255,140,0,0.95))" }}>🔥</div> : null}
    </div>
  );
};

const Clock: React.FC<{ m: number; col?: string }> = ({ m, col = GOLD }) => (
  <div style={{ ...chip("rgba(20,10,4,0.88)", col, 66), border: `5px solid ${col}`, minWidth: 330 }}>⏱ {Math.floor(m)} MIN</div>
);

/* age card: label + number that counts */
const Age: React.FC<{ label: string; n: React.ReactNode; col: string; k: number }> = ({ label, n, col, k }) => (
  <div style={{ width: 400, background: "rgba(20,10,4,0.84)", borderRadius: 30, border: `5px solid ${col}`, padding: "20px 10px", transform: `scale(${k})` }}>
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 40, color: "#fff" }}>{label}</div>
    <div style={{ ...big(col, 150, 10), marginTop: 10 }}>{n}</div>
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 30, color: "#fff", opacity: 0.85 }}>YEARS OLD</div>
  </div>
);

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const L = (i: number) => E(i) - S(i);
  const at = (i: number, a: number) => S(i) + L(i) * a;
  const out: React.ReactNode[] = [];
  /* timeline of the burn across lines 1-4 (A meets at 0.42 from the left: uneven) */
  const MEET = 0.42;
  if (idx === 0) out.push(<div key="re" style={{ position: "absolute", top: 430, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip("rgba(255,245,230,0.95)", INK, 46), marginBottom: 30, transform: `scale(${pop(t, S(0) + 0.1, 0.4)})` }}>2 ROPES · 1 HOUR EACH · UNEVEN</div>
    <div style={{ transform: `translateX(${(1 - pop(t, S(0) + 0.4, 0.5)) * -1200}px)` }}><Rope t={t} label="ROPE A" /></div>
    <div style={{ marginTop: 20, transform: `translateX(${(1 - pop(t, S(0) + 0.7, 0.5)) * 1200}px)` }}><Rope t={t} label="ROPE B" col="#e0b070" /></div>
    <div style={{ marginTop: 30, ...big(GOLD, 120), transform: `scale(${pop(t, at(0, 0.6), 0.45)})` }}>45 MIN?</div>
  </div>);
  if (idx === 1) out.push(<div key="s1" style={{ position: "absolute", top: 430, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip(GOLD, INK, 46), marginBottom: 30, transform: `scale(${pop(t, S(1) + 0.1, 0.4)})` }}>🔥 A: BOTH ENDS · B: ONE END</div>
    <Rope t={t} label="ROPE A" fl={t > at(1, 0.2)} fr={t > at(1, 0.3)} />
    <div style={{ marginTop: 20 }}><Rope t={t} label="ROPE B" col="#e0b070" fl={t > at(1, 0.6)} /></div>
    <div style={{ marginTop: 30 }}><Clock m={0} /></div>
  </div>);
  if (idx === 2) { const u = lin(t, at(2, 0.05), at(2, 0.85));
    out.push(<div key="s2" style={{ position: "absolute", top: 430, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...chip("#2a9d8f", "#fff", 46), marginBottom: 30, transform: `scale(${pop(t, S(2) + 0.1, 0.4)})` }}>2 FLAMES = HALF THE TIME</div>
      <Rope t={t} label="ROPE A" l={MEET * u} r={(1 - MEET) * u} fl fr done={u >= 1} />
      <div style={{ marginTop: 20 }}><Rope t={t} label="ROPE B" col="#e0b070" l={0.62 * u} fl /></div>
      <div style={{ marginTop: 30 }}><Clock m={30 * u} /></div>
    </div>); }
  if (idx === 3) out.push(<div key="s3" style={{ position: "absolute", top: 430, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip(GOLD, INK, 46), marginBottom: 30, transform: `scale(${pop(t, S(3) + 0.1, 0.4)})` }}>🔥 NOW LIGHT B'S OTHER END</div>
    <Rope t={t} label="ROPE A" l={MEET} r={1 - MEET} done />
    <div style={{ marginTop: 20 }}><Rope t={t} label="ROPE B" col="#e0b070" l={0.62} fl fr={t > at(3, 0.4)} /></div>
    <div style={{ marginTop: 30 }}><Clock m={30} /></div>
  </div>);
  if (idx === 4) { const u = lin(t, S(4), at(4, 0.45)); const m2 = 0.62 + (1 - 0.62) * 0.5;
    out.push(<div key="s4" style={{ position: "absolute", top: 430, left: 0, right: 0, textAlign: "center" }}>
      <Rope t={t} label="ROPE B" col="#e0b070" l={0.62 + (m2 - 0.62) * u} r={(1 - m2) * u} fl fr done={u >= 1} />
      <div style={{ marginTop: 30 }}><Clock m={30 + 15 * u} col={u >= 1 ? "#7bd389" : GOLD} /></div>
      <div style={{ marginTop: 40, ...big(GOLD, 120), transform: `scale(${pop(t, at(4, 0.55), 0.45)}) rotate(-3deg)` }}>30 + 15</div>
      <div style={{ marginTop: 16, ...big("#fff", 150), transform: `scale(${pop(t, at(4, 0.75), 0.45)}) rotate(-3deg)` }}>= 45 ✅</div>
    </div>); }
  if (idx === R14) {
    const p = pop(t, S(R14), 0.5);
    out.push(<div key="t" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", transform: `scale(${0.5 + 0.5 * p})`, opacity: p }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.2em", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>A BRAND NEW MYSTERY</div>
      <div style={{ ...big(RED, 190, 12) }}>#14</div>
    </div>);
  }
  if (idx === 6) out.push(<div key="past" style={{ position: "absolute", top: 440, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip("rgba(255,245,230,0.95)", INK, 46), marginBottom: 30, transform: `scale(${pop(t, S(6) + 0.1, 0.4)})` }}>⏪ LONG AGO</div>
    <div style={{ display: "flex", justifyContent: "center", gap: 30 }}>
      <Age label="PERSON 1" n="6" col={GOLD} k={pop(t, at(6, 0.2), 0.45)} />
      <Age label="PERSON 2" n="3" col="#4cc9f0" k={pop(t, at(6, 0.7), 0.45)} />
    </div>
    <div style={{ marginTop: 26, ...chip("#3a4a8a", "#fff", 44), opacity: tw(t, at(6, 0.8), at(6, 0.95)) }}>½ AS OLD</div>
  </div>);
  if (idx === 7) { const u = lin(t, at(7, 0.15), at(7, 0.8)); const n = Math.round(6 + 64 * (1 - Math.pow(1 - u, 2)));
    out.push(<div key="now" style={{ position: "absolute", top: 440, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...chip(GOLD, INK, 46), marginBottom: 30, transform: `scale(${pop(t, S(7) + 0.1, 0.4)})` }}>⏩ TODAY</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 30 }}>
        <Age label="PERSON 1" n={n} col={GOLD} k={1} />
        <Age label="PERSON 2" n="?" col="#4cc9f0" k={1} />
      </div>
    </div>); }
  if (idx === 8) out.push(<div key="q" style={{ position: "absolute", top: 460, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...big("#fff", 120), transform: `scale(${pop(t, S(8) + 0.1, 0.45)})` }}>PERSON 2</div>
    <div style={{ ...big(GOLD, 200), marginTop: 16, transform: `scale(${pop(t, at(8, 0.45), 0.45)})` }}>= ?</div>
    <div style={{ marginTop: 34, display: "flex", justifyContent: "center", gap: 18 }}>
      {["THEN: 6 & 3", "NOW: 70 & ?"].map((s, i) => <div key={i} style={{ ...chip(i ? GOLD : "#3a4a8a", i ? INK : "#fff", 42), transform: `scale(${pop(t, at(8, 0.6) + i * 0.25, 0.4)})` }}>{s}</div>)}
    </div>
  </div>);
  if (idx >= 9) {
    const a = S(9);
    out.push(<div key="vote" style={{ position: "absolute", left: 60, right: 60, top: 450 }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 22 }}>
        {[["1", "35"], ["2", "67"], ["3", "73"]].map(([k, v], i) => <div key={k} style={{ width: 270, background: "rgba(20,10,4,0.86)", border: `5px solid ${GOLD}`, borderRadius: 28, padding: "18px 0", textAlign: "center", transform: `scale(${pop(t, a + 0.1 + i * 0.25, 0.4)})` }}>
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
  mix: "day1/d1112riddle-mix.m4a",
  imgDir: "d1112",
  logo: "day1/solve-by-sunrise.png",
  brand: "SOLVE BY SUNRISE",
  keyword: /ropes|lighter|both|one|thirty|flames|other|fifteen|forty|five|six|half|seventy|old|answer|sunrise/i,
  particles: (c) => (c.idx >= R14 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx <= 4 ? 1440 : c.idx >= 6 ? 1320 : 1240),
  captionSize: 70,
  shakeAt: [4, 5, 8],
  shots: [
    { img: "r13_ropes.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r13_burn.jpg", from: 1, to: 3, z0: 1.0, z1: 1.12, fx0: 0.4, fy0: 0.5, fx1: 0.6, fy1: 0.5 },
    { img: "r13_uneven.jpg", from: 3, to: 4, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r13_person.jpg", from: 4, to: 5, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "r14_years.jpg", from: 5, to: 6, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r14_young.jpg", from: 6, to: 7, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.55, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r14_candles.jpg", from: 7, to: 8, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "r14_chairs.jpg", from: 8, to: 9, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.6, fx1: 0.5, fy1: 0.55, vertical: true },
    { img: "r14_years.jpg", from: 9, to: 999, z0: 1.2, z1: 1.05, fx0: 0.5, fy0: 0.65, fx1: 0.5, fy1: 0.55, vertical: true },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1112Riddle: React.FC = () => <HouseShort cfg={CFG} />;
