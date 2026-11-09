import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1109kids-timing.json";

/* Islam for Little Ones, Mon 9 Nov 2026: "Want for others what you want for yourself", Sahih al-Bukhari 13 (Anas bin Malik Radi Allahu Anhu):
   "None of you truly believes until he loves for his brother what he loves for himself." Checked on sunnah.com listings the same day. Made for Kids.
   Children faceless (back views only); the Prophet Sallallahu Alaihi Wa Alihi Wasallam is never shown; Masjid-e-Nabawi shot is a REAL Pixabay frame. */
const TM = data as unknown as Timing;
export const D1109_KIDS_DUR = houseDur(TM);
const PLACE = ["IMAGINE!", "A TRUE HADITH", "SAHIH AL-BUKHARI 13", "SHARE", "PICK", "KIND WORDS", "THE GOLDEN RULE", "YOUR TURN"];
const SKY = "#4cc9f0", PINK = "#ff8fab", LEAF = "#7bd389";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="DAY 11 · LESSON" big={<>SHARING</>} place={PLACE[c.idx] || ""} tag="LESSON 11" tagBg={LEAF} tagFg={INK} />;
const bubble = (bg: string, col: string, bd: string, sz: number): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 34, padding: "16px 32px", border: `6px solid ${bd}`, boxShadow: "0 10px 0 rgba(0,0,0,0.18)" });
const PAIRS: [string, string, string][] = [["🍪", "YOU", "YOUR FRIEND"], ["⚽", "YOU", "YOUR FRIEND"], ["💬", "YOU", "YOUR FRIEND"]];
const COL = [GOLD, SKY, PINK];

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="a" style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ fontSize: 190, lineHeight: 1, transform: `scale(${pop(t, S(0) + 0.2, 0.5)}) rotate(${Math.sin(t * 3) * 6}deg)` }}>🍪</div>
    <div style={{ marginTop: 20, ...bubble("#fff", INK, SKY, 56), transform: `scale(${pop(t, S(0) + (E(0) - S(0)) * 0.55, 0.45)})` }}>AND FOR YOUR FRIEND? 🤔</div>
  </div>);
  if (idx === 2) {
    const p = pop(t, S(2) - 0.1, 0.5);
    out.push(<div key="h" style={{ position: "absolute", top: 440, left: 60, right: 60, opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
      <div style={{ background: "rgba(255,252,240,0.96)", borderRadius: 30, padding: "26px 28px", border: `6px solid ${GOLD}`, textAlign: "center", boxShadow: "0 12px 0 rgba(0,0,0,0.18)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 50, lineHeight: 1.6, color: "#b5651d", direction: "rtl" }}>لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ</div>
        <div style={{ marginTop: 10, fontFamily: MONT, fontWeight: 800, fontSize: 38, lineHeight: 1.25, color: INK }}>LOVE FOR YOUR BROTHER WHAT YOU LOVE FOR YOURSELF 💛</div>
        <div style={{ marginTop: 12, fontFamily: MONT, fontWeight: 800, fontSize: 24, letterSpacing: "0.08em", color: "#b5651d" }}>📖 SAHIH AL-BUKHARI 13</div>
      </div>
    </div>);
  }
  if (idx >= 3 && idx <= 5) {
    const i = idx - 3; const [e, a, b] = PAIRS[i]; const L = E(idx) - S(idx);
    out.push(<div key={"p" + i} style={{ position: "absolute", top: 520, left: 60, right: 60, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
      <div style={{ ...bubble(COL[i], INK, INK, 48), transform: `scale(${pop(t, S(idx) + 0.2, 0.45)})` }}>{e} {a}</div>
      <div style={{ fontSize: 80, transform: `scale(${pop(t, S(idx) + L * 0.45, 0.4)})` }}>➡️</div>
      <div style={{ ...bubble(COL[i], INK, INK, 48), transform: `scale(${pop(t, S(idx) + L * 0.6, 0.45)})` }}>{e} {b}</div>
    </div>);
  }
  if (idx === 6) out.push(<div key="rule" style={{ position: "absolute", top: 520, left: 90, right: 90, textAlign: "center", transform: `scale(${pop(t, S(6) + 0.2, 0.5)}) rotate(-2deg)` }}>
    <div style={bubble(GOLD, INK, INK, 58)}>🌟 WANT FOR OTHERS WHAT YOU WANT FOR YOU!</div>
  </div>);
  if (idx === 7) {
    const a = S(7);
    out.push(<div key="end" style={{ position: "absolute", left: 100, right: 100, top: 500, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>TODAY I WILL SHARE...</div>
      <div style={{ marginTop: 26, ...bubble(LEAF, INK, INK, 58), transform: `scale(${pop(t, a + 1.2, 0.45)}) rotate(-2deg)` }}>🎁 WITH A FRIEND!</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1109kids-mix.m4a",
  imgDir: "d1109",
  logo: "day1/islam-for-little-ones.png",
  brand: "ISLAM FOR LITTLE ONES",
  keyword: /cookie|friend|believes|brother|loves?|share|picked|pick|kind|others|yourself|today/i,
  particles: () => "sparkle",
  bright: true,
  captionTop: (c) => (c.idx === 2 ? 1330 : 1180),
  captionSize: 74,
  shots: [
    { img: "k_cookie.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_n2.jpg", from: 1, to: 3, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k_share.jpg", from: 3, to: 4, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_play.jpg", from: 4, to: 5, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_kind.jpg", from: 5, to: 6, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_share.jpg", from: 6, to: 7, z0: 1.2, z1: 1.08, fx0: 0.5, fy0: 0.6, fx1: 0.5, fy1: 0.5 },
    { img: "k_cookie.jpg", from: 7, to: 999, z0: 1.15, z1: 1.0, fx0: 0.4, fy0: 0.6, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1109Kids: React.FC = () => <HouseShort cfg={CFG} />;
