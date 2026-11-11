import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1111kids-timing.json";

/* Islam for Little Ones, Wed 11 Nov 2026: "Do not get angry", Sahih al-Bukhari 6116 (Abu Huraira Radi Allahu Anhu):
   a man asked for advice; the answer was "Do not become angry", repeated several times. Made for Kids.
   Children faceless (back views only); the Prophet Sallallahu Alaihi Wa Alihi Wasallam is never shown; the man who asked is never shown;
   Masjid-e-Nabawi shot is a REAL Pixabay frame. No face/person emoji on cards. */
const TM = data as unknown as Timing;
export const D1111_KIDS_DUR = houseDur(TM);
const PLACE = ["GRRR!", "A TRUE HADITH", "SAHIH AL-BUKHARI 6116", "STOP & BREATHE", "KIND WORDS", "STRONG", "YOUR TURN"];
const SKY = "#4cc9f0", PINK = "#ff8fab", LEAF = "#7bd389", RED = "#e63946";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="DAY 13 · LESSON" big={<>CALM</>} place={PLACE[c.idx] || ""} tag="LESSON 13" tagBg={LEAF} tagFg={INK} />;
const bubble = (bg: string, col: string, bd: string, sz: number): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 34, padding: "16px 32px", border: `6px solid ${bd}`, boxShadow: "0 10px 0 rgba(0,0,0,0.18)" });

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const L = (i: number) => E(i) - S(i);
  const out: React.ReactNode[] = [];
  if (idx === 0) {
    const heat = Math.min(1, (t - S(0)) / Math.max(0.5, L(0) * 0.7));
    out.push(<div key="a" style={{ position: "absolute", top: 480, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...bubble("#fff", INK, RED, 52), transform: `scale(${pop(t, S(0) + 0.1, 0.45)})` }}>🧸 MY TOY!</div>
      <div style={{ margin: "30px auto 0", width: 600, height: 60, borderRadius: 30, border: `6px solid ${INK}`, background: "#fff", overflow: "hidden" }}>
        <div style={{ width: `${heat * 100}%`, height: "100%", background: `linear-gradient(90deg, ${LEAF}, ${GOLD}, ${RED})`, transform: `translateX(${Math.sin(t * 40) * 3 * heat}px)` }} />
      </div>
      <div style={{ marginTop: 12, fontFamily: MONT, fontWeight: 800, fontSize: 34, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>ANGRY METER 🌡️</div>
      <div style={{ marginTop: 22, ...bubble(SKY, INK, INK, 52), transform: `scale(${pop(t, S(0) + L(0) * 0.7, 0.45)})` }}>WHAT DO YOU DO? ❓</div>
    </div>);
  }
  if (idx === 1) out.push(<div key="ask" style={{ position: "absolute", top: 560, left: 80, right: 80, textAlign: "center" }}>
    <div style={{ ...bubble("rgba(255,252,240,0.96)", INK, GOLD, 50), transform: `scale(${pop(t, S(1) + L(1) * 0.55, 0.45)})` }}>💬 "PLEASE GIVE ME ADVICE!"</div>
  </div>);
  if (idx === 2) {
    const p = pop(t, S(2) - 0.1, 0.5);
    const reps = [0.45, 0.65, 0.85];
    out.push(<div key="h" style={{ position: "absolute", top: 430, left: 60, right: 60, opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
      <div style={{ background: "rgba(255,252,240,0.96)", borderRadius: 30, padding: "26px 28px", border: `6px solid ${GOLD}`, textAlign: "center", boxShadow: "0 12px 0 rgba(0,0,0,0.18)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 84, lineHeight: 1.4, color: "#b5651d", direction: "rtl" }}>لَا تَغْضَبْ</div>
        <div style={{ marginTop: 6, fontFamily: MONT, fontWeight: 800, fontSize: 46, color: INK }}>DO NOT GET ANGRY!</div>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 14 }}>
          {reps.map((r, i) => <div key={i} style={{ ...bubble(i === 2 ? GOLD : LEAF, INK, INK, 30), padding: "8px 18px", transform: `scale(${pop(t, S(2) + L(2) * r, 0.35)})` }}>AGAIN ✋</div>)}
        </div>
        <div style={{ marginTop: 14, fontFamily: MONT, fontWeight: 800, fontSize: 24, letterSpacing: "0.08em", color: "#b5651d" }}>📖 SAHIH AL-BUKHARI 6116</div>
      </div>
    </div>);
  }
  if (idx === 3) {
    const br = 1 + 0.18 * Math.sin((t - S(3)) * 2.2);
    out.push(<div key="br" style={{ position: "absolute", top: 480, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...bubble(RED, "#fff", INK, 58), transform: `scale(${pop(t, S(3) + 0.1, 0.4)})` }}>✋ STOP!</div>
      <div style={{ margin: "40px auto 0", width: 260, height: 260, borderRadius: 130, background: `radial-gradient(circle, #ffffff, ${SKY})`, border: `6px solid ${INK}`, transform: `scale(${pop(t, S(3) + L(3) * 0.4, 0.5) * br})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: INK }}>BREATHE<br />IN... OUT</div>
    </div>);
  }
  if (idx === 4) out.push(<div key="kind" style={{ position: "absolute", top: 520, left: 80, right: 80, textAlign: "center" }}>
    <div style={{ ...bubble("#fff", INK, PINK, 52), transform: `scale(${pop(t, S(4) + L(4) * 0.3, 0.45)}) rotate(-2deg)` }}>💬 "CAN I HAVE MY TOY BACK, PLEASE?"</div>
    <div style={{ marginTop: 26, fontSize: 120, transform: `scale(${pop(t, S(4) + L(4) * 0.7, 0.4)})` }}>🧸💛</div>
  </div>);
  if (idx === 5) out.push(<div key="strong" style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(5) + 0.2, 0.5)}) rotate(-2deg)` }}>
    <div style={bubble(GOLD, INK, INK, 60)}>💪 CALM = STRONG!</div>
  </div>);
  if (idx === 6) {
    const a = S(6);
    out.push(<div key="end" style={{ position: "absolute", left: 100, right: 100, top: 500, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>STAY CALM TODAY?</div>
      <div style={{ marginTop: 26, ...bubble(LEAF, INK, INK, 64), transform: `scale(${pop(t, a + L(6) * 0.6, 0.45)}) rotate(-2deg)` }}>✋ YES, I CAN!</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1111kids-mix.m4a",
  imgDir: "d1111",
  logo: "day1/islam-for-little-ones.png",
  brand: "ISLAM FOR LITTLE ONES",
  keyword: /grrr|toy|angry|advice|again|stop|breath|kind|please|calm|strong|yes/i,
  particles: () => "sparkle",
  bright: true,
  captionTop: (c) => (c.idx === 2 ? 1360 : 1200),
  captionSize: 74,
  shots: [
    { img: "k_toy.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_k.jpg", from: 1, to: 3, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.4, fx1: 0.5, fy1: 0.4, vertical: true },
    { img: "k_breath.jpg", from: 3, to: 4, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_share.jpg", from: 4, to: 5, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_strong.jpg", from: 5, to: 6, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_share.jpg", from: 6, to: 999, z0: 1.15, z1: 1.02, fx0: 0.55, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1111Kids: React.FC = () => <HouseShort cfg={CFG} />;
