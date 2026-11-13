import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1113kids-timing.json";

/* Islam for Little Ones, Fri 13 Nov 2026: "Help at home!", Sahih al-Bukhari 676 (al-Aswad asked Hazrat Aisha
   Radi Allahu Anha what the Prophet Sallallahu Alaihi Wa Alihi Wasallam did at home: he kept himself busy serving
   his family, and when it was time for prayer he went out for the prayer). Made for Kids. Children faceless (back
   views / hands only); the Prophet and the Mothers of the Believers are never shown; Masjid-e-Nabawi shot is a REAL
   Pixabay frame. No face/person emoji on cards. */
const TM = data as unknown as Timing;
export const D1113_KIDS_DUR = houseDur(TM);
const PLACE = ["WHO CAN HELP?", "A QUESTION", "THE ANSWER", "PRAYER TIME", "YOUR JOBS", "A SUNNAH", "YOUR TURN"];
const SKY = "#4cc9f0", PINK = "#ff8fab", LEAF = "#7bd389";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="DAY 15 · LESSON" big={<>HELP</>} place={PLACE[c.idx] || ""} tag="LESSON 15" tagBg={LEAF} tagFg={INK} />;
const bubble = (bg: string, col: string, bd: string, sz: number): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 34, padding: "16px 32px", border: `6px solid ${bd}`, boxShadow: "0 10px 0 rgba(0,0,0,0.18)" });

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const L = (i: number) => E(i) - S(i);
  const at = (i: number, a: number) => S(i) + L(i) * a;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="a" style={{ position: "absolute", top: 480, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...bubble("#fff", INK, SKY, 56), transform: `scale(${pop(t, S(0) + 0.1, 0.45)})` }}>🧸 MESSY TABLE!</div>
    <div style={{ marginTop: 30, ...bubble(GOLD, INK, INK, 54), transform: `scale(${pop(t, at(0, 0.4), 0.45)})` }}>WHO CAN HELP? ❓</div>
    <div style={{ marginTop: 30, ...bubble(LEAF, INK, INK, 74), transform: `scale(${pop(t, at(0, 0.8), 0.45)}) rotate(-3deg)` }}>YOU CAN! ✋</div>
  </div>);
  if (idx === 1) out.push(<div key="q" style={{ position: "absolute", top: 520, left: 70, right: 70, textAlign: "center" }}>
    <div style={{ ...bubble("rgba(255,252,240,0.96)", INK, GOLD, 44), transform: `scale(${pop(t, S(1) + 0.2, 0.45)})` }}>LADY AISHA <span style={{ color: "#b5651d" }}>RADI ALLAHU ANHA</span></div>
    <div style={{ marginTop: 24, ...bubble(SKY, INK, INK, 50), transform: `scale(${pop(t, at(1, 0.6), 0.45)})` }}>🏠 WHAT DID HE DO AT HOME?</div>
  </div>);
  if (idx === 2) out.push(<div key="ans" style={{ position: "absolute", top: 520, left: 70, right: 70, textAlign: "center" }}>
    <div style={{ background: "rgba(255,252,240,0.96)", borderRadius: 30, padding: "26px 28px", border: `6px solid ${GOLD}`, boxShadow: "0 12px 0 rgba(0,0,0,0.18)", transform: `scale(${pop(t, S(2) + 0.1, 0.45)})` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 58, color: INK }}>💛 HE HELPED</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 58, color: "#b5651d" }}>HIS FAMILY!</div>
    </div>
    <div style={{ marginTop: 20, fontFamily: MONT, fontWeight: 800, fontSize: 28, letterSpacing: "0.08em", color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,0.8)", opacity: pop(t, at(2, 0.5), 0.4) }}>📖 SAHIH AL-BUKHARI 676</div>
  </div>);
  if (idx === 3) out.push(<div key="pray" style={{ position: "absolute", top: 540, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...bubble(LEAF, INK, INK, 56), transform: `scale(${pop(t, S(3) + 0.2, 0.45)})` }}>🕌 TIME TO PRAY? GO PRAY!</div>
  </div>);
  if (idx === 4) {
    const jobs: [string, string][] = [["🧸 TIDY YOUR TOYS", SKY], ["🍽️ SET THE TABLE", GOLD], ["👕 FOLD YOUR CLOTHES", PINK]];
    out.push(<div key="jobs" style={{ position: "absolute", top: 460, left: 0, right: 0, textAlign: "center" }}>
      {jobs.map(([s, col], i) => <div key={i} style={{ marginTop: i ? 24 : 0 }}><div style={{ ...bubble(col, INK, INK, 54), transform: `scale(${pop(t, at(4, 0.3 + i * 0.2), 0.4)}) rotate(${i % 2 ? 2 : -2}deg)` }}>{s} ✓</div></div>)}
    </div>);
  }
  if (idx === 5) out.push(<div key="sun" style={{ position: "absolute", top: 520, left: 80, right: 80, textAlign: "center" }}>
    <div style={{ ...bubble("rgba(255,252,240,0.96)", INK, GOLD, 56), transform: `scale(${pop(t, S(5) + 0.2, 0.45)})` }}>✨ HELPING = SUNNAH ✨</div>
    <div style={{ marginTop: 26, ...bubble(LEAF, INK, INK, 50), transform: `scale(${pop(t, at(5, 0.6), 0.45)})` }}>EVERYONE SMILES 💛</div>
  </div>);
  if (idx === 6) {
    const a = S(6);
    out.push(<div key="end" style={{ position: "absolute", left: 100, right: 100, top: 500, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>WHAT WILL YOU HELP WITH TODAY?</div>
      <div style={{ marginTop: 26, ...bubble(LEAF, INK, INK, 60), transform: `scale(${pop(t, a + L(6) * 0.55, 0.45)}) rotate(-2deg)` }}>🏠 I CAN HELP!</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1113kids-mix.m4a",
  imgDir: "d1113",
  logo: "day1/islam-for-little-ones.png",
  brand: "ISLAM FOR LITTLE ONES",
  keyword: /help|helped|can|home|family|pray|toys|table|clothes|sunnah|smile|today/i,
  particles: () => "sparkle",
  bright: true,
  captionTop: (c) => (c.idx === 4 ? 1380 : 1260),
  captionSize: 74,
  shots: [
    { img: "k_messy.jpg", from: 0, to: 1, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_k.jpg", from: 1, to: 2, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.4, fx1: 0.5, fy1: 0.4, vertical: true },
    { img: "k_carry.jpg", from: 2, to: 3, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_mat.jpg", from: 3, to: 4, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_tidy.jpg", from: 4, to: 5, z0: 1.0, z1: 1.1, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.5 },
    { img: "k_family.jpg", from: 5, to: 6, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_fold.jpg", from: 6, to: 999, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1113Kids: React.FC = () => <HouseShort cfg={CFG} />;
