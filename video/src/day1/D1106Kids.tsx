import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1106kids-timing.json";

/* Islam for Little Ones, Fri 6 Nov 2026: "Friday is the best day", Sahih Muslim 854 (Abu Huraira Radi Allahu Anhu):
   "The best day on which the sun has risen is Friday." Checked on sunnah.com listings the same day. Made for Kids. Gentle and bright.
   People faceless (back views only); the Prophet Sallallahu Alaihi Wa Alihi Wasallam is never shown. Masjid-e-Nabawi shot is a REAL Pixabay frame. */
const TM = data as unknown as Timing;
export const D1106_KIDS_DUR = houseDur(TM);
const PLACE = ["GUESS!", "FRIDAY", "A HADITH", "A HADITH", "STEP 1", "STEP 2", "STEP 3", "STEP 4", "YOUR TURN"];
const SKY = "#4cc9f0", PINK = "#ff8fab", LEAF = "#7bd389";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="DAY 8 · LESSON" big={<>JUMU'AH</>} place={PLACE[c.idx] || ""} tag="LESSON 8" tagBg={LEAF} tagFg={INK} />;

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const STEPS: [string, string][] = [["🛁 NICE BATH", SKY], ["👕 CLEAN CLOTHES ✨", PINK], ["🕌 JUMU'AH PRAYER", LEAF], ["🤲 LOTS OF DUA", GOLD]];

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="a" style={{ position: "absolute", top: 560, left: 80, transform: `scale(${pop(t, S(0) + 0.2, 0.5)})`, transformOrigin: "left bottom" }}>
    <div style={{ background: "#fff", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 70, borderRadius: 40, padding: "22px 36px", border: `6px solid ${SKY}`, boxShadow: "0 10px 0 rgba(0,0,0,0.18)" }}>THE BEST DAY? 🤔</div>
  </div>);
  if (idx <= 1) {
    const hi = idx === 1 ? pop(t, S(1) + 0.1, 0.5) : 0;
    out.push(<div key="wk" style={{ position: "absolute", top: idx === 0 ? 780 : 600, left: 40, right: 40, display: "flex", justifyContent: "center", gap: 10 }}>
      {DAYS.map((d, i) => { const f = i === 4; const k = idx === 0 ? pop(t, S(0) + 0.8 + i * 0.12, 0.35) : 1;
        return <div key={d} style={{ width: 128, textAlign: "center", background: f && hi > 0 ? GOLD : "#fff", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 34, borderRadius: 18, padding: "16px 0", border: `5px solid ${INK}`, transform: `scale(${k * (f ? 1 + 0.35 * hi : 1 - 0.1 * hi)}) translateY(${f ? -30 * hi : 0}px)`, opacity: f ? 1 : 1 - 0.4 * hi }}>{d}</div>; })}
    </div>);
    if (idx === 1) out.push(<div key="fr" style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(1) + 0.6, 0.5)}) rotate(-3deg)` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 130, lineHeight: 1, color: GOLD, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>JUMU'AH!</div>
    </div>);
  }
  if (idx === 3) {
    const p = pop(t, S(3) - 0.1, 0.5);
    out.push(<div key="ref" style={{ position: "absolute", top: 520, left: 60, right: 60, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ background: "rgba(255,252,240,0.96)", borderRadius: 30, padding: "22px 30px", border: `6px solid ${GOLD}`, boxShadow: "0 14px 0 rgba(0,0,0,0.15)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 60, color: "#b5651d", direction: "rtl", lineHeight: 1.5 }}>خَيْرُ يَوْمٍ طَلَعَتْ عَلَيْهِ الشَّمْسُ يَوْمُ الْجُمُعَةِ</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 40, color: INK, lineHeight: 1.2 }}>☀️ BEST DAY = <span style={{ color: "#b5651d" }}>FRIDAY</span></div>
        <div style={{ marginTop: 8, fontSize: 24, letterSpacing: "0.1em", color: "#b5651d", fontFamily: MONT, fontWeight: 800 }}>📖 SAHIH MUSLIM 854</div>
      </div>
    </div>);
  }
  if (idx >= 4 && idx <= 7) {
    out.push(<div key="list" style={{ position: "absolute", top: 480, left: 110, right: 110 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 52, color: "#fff", WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill" }}>MY FRIDAY LIST</div>
      {STEPS.slice(0, idx - 3).map(([s, col], i) => { const now = i === idx - 4; const k = now ? pop(t, S(idx) + 0.5, 0.45) : 1;
        return <div key={i} style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", background: col, borderRadius: 22, padding: "12px 24px", border: `5px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 44, color: INK, transform: `translateX(${(1 - k) * 800}px) scale(${now ? 1.04 : 0.96})`, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>
          <span>{s}</span><span style={{ fontSize: 46, opacity: now ? pop(t, S(idx) + 1.4, 0.4) : 1 }}>✅</span></div>; })}
    </div>);
  }
  if (idx === 8) {
    const a = S(8);
    out.push(<div key="end" style={{ position: "absolute", left: 110, right: 110, top: 480, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>THIS FRIDAY I WILL...</div>
      <div style={{ marginTop: 26, display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 60, borderRadius: 26, padding: "16px 34px", border: `6px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.25)", transform: `scale(${pop(t, a + 2.0, 0.45)}) rotate(-2deg)` }}>🌙 JUMU'AH MUBARAK!</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1106kids-mix.m4a",
  imgDir: "d1106",
  logo: "day1/islam-for-little-ones.png",
  brand: "ISLAM FOR LITTLE ONES",
  keyword: /best|friday|jumu|sun|bath|clean|smell|masjid|prayers?|allah|mubarak/i,
  particles: () => "sparkle",
  bright: true,
  captionTop: (c) => (c.idx === 3 ? 1260 : c.idx >= 4 && c.idx <= 7 ? 1300 : 1180),
  captionSize: 74,
  shots: [
    { img: "k8_sunrise.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k8_sunrise.jpg", from: 1, to: 2, z0: 1.0, z1: 1.12, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.45 },
    { img: "dome_real_b.jpg", from: 2, to: 3, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k8_sunrise.jpg", from: 3, to: 4, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.4, fx1: 0.5, fy1: 0.5 },
    { img: "k8_bath.jpg", from: 4, to: 5, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k8_clothes.jpg", from: 5, to: 6, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k8_walk.jpg", from: 6, to: 7, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k8_dua.jpg", from: 7, to: 8, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k8_walk.jpg", from: 8, to: 999, z0: 1.0, z1: 1.1, fx0: 0.55, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1106Kids: React.FC = () => <HouseShort cfg={CFG} />;
