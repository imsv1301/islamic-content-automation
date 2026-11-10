import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1110kids-timing.json";

/* Islam for Little Ones, Tue 10 Nov 2026: "Always tell the truth", Sahih al-Bukhari 6094 (Abdullah bin Mas'ud Radi Allahu Anhu):
   "Truthfulness leads to righteousness, and righteousness leads to Paradise." Opened on sunnah.com the same day. Made for Kids.
   Children faceless (back views only); the Prophet Sallallahu Alaihi Wa Alihi Wasallam is never shown; Masjid-e-Nabawi shot is a REAL Pixabay frame (112360). */
const TM = data as unknown as Timing;
export const D1110_KIDS_DUR = houseDur(TM);
const PLACE = ["OOPS!", "A TRUE HADITH", "SAHIH AL-BUKHARI 6094", "BE BRAVE", "ALLAH LOVES IT", "TRUST", "THE RULE", "YOUR TURN"];
const SKY = "#4cc9f0", PINK = "#ff8fab", LEAF = "#7bd389";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="DAY 12 · LESSON" big={<>TRUTH</>} place={PLACE[c.idx] || ""} tag="LESSON 12" tagBg={LEAF} tagFg={INK} />;
const bubble = (bg: string, col: string, bd: string, sz: number): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 34, padding: "16px 32px", border: `6px solid ${bd}`, boxShadow: "0 10px 0 rgba(0,0,0,0.18)" });

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const L = (i: number) => E(i) - S(i);
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="a" style={{ position: "absolute", top: 500, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ fontSize: 180, lineHeight: 1, transform: `scale(${pop(t, S(0) + 0.1, 0.5)}) rotate(${Math.sin(t * 9) * 8 * Math.max(0, 1 - (t - S(0)))}deg)` }}>☕💥</div>
    <div style={{ marginTop: 24, ...bubble("#fff", INK, SKY, 56), transform: `scale(${pop(t, S(0) + L(0) * 0.6, 0.45)})` }}>WHAT DO YOU DO? 🤔</div>
  </div>);
  if (idx === 2) {
    const p = pop(t, S(2) - 0.1, 0.5);
    out.push(<div key="h" style={{ position: "absolute", top: 430, left: 60, right: 60, opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
      <div style={{ background: "rgba(255,252,240,0.96)", borderRadius: 30, padding: "26px 28px", border: `6px solid ${GOLD}`, textAlign: "center", boxShadow: "0 12px 0 rgba(0,0,0,0.18)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 52, lineHeight: 1.6, color: "#b5651d", direction: "rtl" }}>إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ<br />وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ</div>
        <div style={{ marginTop: 10, fontFamily: MONT, fontWeight: 800, fontSize: 38, lineHeight: 1.25, color: INK }}>TRUTH ➡️ GOOD DEEDS ➡️ JANNAH 🌟</div>
        <div style={{ marginTop: 12, fontFamily: MONT, fontWeight: 800, fontSize: 24, letterSpacing: "0.08em", color: "#b5651d" }}>📖 SAHIH AL-BUKHARI 6094</div>
      </div>
    </div>);
  }
  if (idx === 3) out.push(<div key="say" style={{ position: "absolute", top: 520, left: 80, right: 80, textAlign: "center" }}>
    <div style={{ ...bubble("#fff", INK, PINK, 56), transform: `scale(${pop(t, S(3) + L(3) * 0.4, 0.45)}) rotate(-2deg)` }}>💬 "I BROKE THE CUP. I AM SORRY!"</div>
  </div>);
  if (idx === 4) out.push(<div key="love" style={{ position: "absolute", top: 520, left: 80, right: 80, textAlign: "center" }}>
    <div style={{ ...bubble(SKY, INK, INK, 50), transform: `scale(${pop(t, S(4) + 0.2, 0.45)})` }}>😟 FEELS HARD...</div>
    <div style={{ marginTop: 24 }}><div style={{ ...bubble(GOLD, INK, INK, 54), transform: `scale(${pop(t, S(4) + L(4) * 0.45, 0.45)})` }}>💛 ALLAH LOVES THE TRUTHFUL</div></div>
  </div>);
  if (idx === 5) {
    const n = 5;
    out.push(<div key="trust" style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...bubble(LEAF, INK, INK, 52), transform: `scale(${pop(t, S(5) + 0.2, 0.45)})` }}>TRUST METER</div>
      <div style={{ marginTop: 26, display: "flex", justifyContent: "center", gap: 12 }}>
        {Array.from({ length: n }).map((_, i) => <div key={i} style={{ fontSize: 96, transform: `scale(${pop(t, S(5) + L(5) * (0.3 + i * 0.12), 0.35)})` }}>⭐</div>)}
      </div>
    </div>);
  }
  if (idx === 6) out.push(<div key="rule" style={{ position: "absolute", top: 520, left: 90, right: 90, textAlign: "center", transform: `scale(${pop(t, S(6) + 0.2, 0.5)}) rotate(-2deg)` }}>
    <div style={bubble(GOLD, INK, INK, 60)}>🌟 ALWAYS TELL THE TRUTH!</div>
  </div>);
  if (idx === 7) {
    const a = S(7);
    out.push(<div key="end" style={{ position: "absolute", left: 100, right: 100, top: 500, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>WILL YOU?</div>
      <div style={{ marginTop: 26, ...bubble(LEAF, INK, INK, 64), transform: `scale(${pop(t, a + L(7) * 0.6, 0.45)}) rotate(-2deg)` }}>🙋 YES, I WILL!</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1110kids-mix.m4a",
  imgDir: "d1110",
  logo: "day1/islam-for-little-ones.png",
  brand: "ISLAM FOR LITTLE ONES",
  keyword: /oops|cup|truth|good|paradise|mama|sorry|hard|loves|trust|always|yes/i,
  particles: () => "sparkle",
  bright: true,
  captionTop: (c) => (c.idx === 2 ? 1330 : 1180),
  captionSize: 74,
  shots: [
    { img: "k_oops.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.58, fy0: 0.5, fx1: 0.56, fy1: 0.5 },
    { img: "dome_b1.jpg", from: 1, to: 3, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.4, fx1: 0.5, fy1: 0.4, vertical: true },
    { img: "k_cup.jpg", from: 3, to: 4, z0: 1.0, z1: 1.1, fx0: 0.45, fy0: 0.6, fx1: 0.5, fy1: 0.6 },
    { img: "k_stars.jpg", from: 4, to: 5, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_friends.jpg", from: 5, to: 6, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_oops.jpg", from: 6, to: 7, z0: 1.15, z1: 1.02, fx0: 0.6, fy0: 0.6, fx1: 0.58, fy1: 0.5 },
    { img: "k_stars.jpg", from: 7, to: 999, z0: 1.2, z1: 1.05, fx0: 0.5, fy0: 0.4, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1110Kids: React.FC = () => <HouseShort cfg={CFG} />;
