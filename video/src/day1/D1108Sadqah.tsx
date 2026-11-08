import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1108sadqah-timing.json";

/* One More Sadqah, Short 10 (Sun 8 Nov 2026): "Do kalime: zabaan par halke, tarazu mein bhaari", Sahih al-Bukhari 7563 (also 6406),
   Abu Huraira Radi Allahu Anhu: "Two words are beloved to the Most Merciful, light on the tongue, heavy in the Balance:
   Subhan Allahi wa bihamdihi, Subhan Allahil Azim." The last hadith of Sahih al-Bukhari. Checked on sunnah.com listings the same day.
   The Prophet Sallallahu Alaihi Wa Alihi Wasallam is never depicted; people are faceless (back views). Masjid-e-Nabawi shots are REAL Pixabay frames, never AI. */
const TM = data as unknown as Timing;
export const D1108_SADQAH_DUR = houseDur(TM);
const PLACE = ["DO KALIME", "HADITH", "HADITH", "YEH HAIN WOH KALIME", "KAB PARHEIN?", "AAJ KA AMAL", "ONE MORE SADQAH"];
const GREEN = "#2a9d8f";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="SHORT 10" big={<>DO KALIME</>} place={PLACE[c.idx] || ""} tag="BUKHARI 7563" tagBg={GOLD} tagFg={INK} />;

const Q: [string, string, string][] = [["🪶", "ZABAAN PAR HALKE", "#fff3d6"], ["⚖️", "TARAZU MEIN BHAARI", GOLD], ["💛", "RAHMAAN KO PYAARE", GREEN]];
const WHEN = ["🚶 CHALTE PHIRTE", "🛠️ KAAM KARTE", "🛣️ RAASTE MEIN", "🍳 KITCHEN MEIN"];

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) {
    const L = E(0) - S(0);
    out.push(<div key="q" style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ display: "inline-block", background: "rgba(20,10,4,0.82)", borderRadius: 26, padding: "16px 36px", border: `4px solid ${GOLD}`, fontFamily: MONT, fontWeight: 800, fontSize: 60, color: "#fff", transform: `scale(${pop(t, S(0) + 0.3, 0.45)})` }}>🪶 ZABAAN PAR <span style={{ color: GOLD }}>HALKE</span></div>
      <div style={{ marginTop: 20 }}><div style={{ display: "inline-block", background: GOLD, borderRadius: 26, padding: "16px 36px", border: `5px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 60, color: INK, transform: `scale(${pop(t, S(0) + L * 0.6, 0.45)})` }}>⚖️ TARAZU MEIN BHAARI</div></div>
    </div>);
  }
  if (idx === 2) {
    const L = E(2) - S(2);
    out.push(<div key="three" style={{ position: "absolute", top: 480, left: 80, right: 80 }}>
      {Q.map(([e, s, col], i) => { const k = pop(t, S(2) + 0.3 + i * (L / 3.3), 0.45); return <div key={i} style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 20, background: col, borderRadius: 24, padding: "12px 24px", border: `5px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 46, color: INK, transform: `translateX(${(1 - k) * 900}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)" }}>
        <span style={{ fontSize: 56 }}>{e}</span><span>{s}</span></div>; })}
    </div>);
  }
  if (idx === 3) {
    const p = pop(t, S(3) - 0.1, 0.5);
    const k = tw(t, S(3) + 0.1, S(3) + 0.9);
    out.push(<div key="hadith" style={{ position: "absolute", top: 420, left: 40, right: 40, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
      <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "26px 24px 18px", border: `3px solid ${GOLD}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 64, lineHeight: 1.6, color: GOLD, direction: "rtl", textAlign: "center", opacity: k }}>سُبْحَانَ اللَّهِ وَبِحَمْدِهِ<br />سُبْحَانَ اللَّهِ الْعَظِيمِ</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 32, color: "#fff", textAlign: "center", marginTop: 8, lineHeight: 1.3 }}>SubhanAllahi wa bihamdihi · SubhanAllahil Azeem</div>
        <div style={{ marginTop: 12, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.1em", color: GOLD }}>SAHIH AL-BUKHARI 7563 · ABU HURAIRA RADI ALLAHU ANHU</div>
      </div>
    </div>);
  }
  if (idx === 4) {
    const L = E(4) - S(4);
    out.push(<div key="when" style={{ position: "absolute", top: 480, left: 60, right: 60, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18 }}>
      {WHEN.map((s, i) => <div key={i} style={{ background: "rgba(255,245,230,0.95)", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 46, borderRadius: 22, padding: "12px 26px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(4) + 0.1 + i * (L / 6), 0.4)})`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)" }}>{s}</div>)}
      <div style={{ background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 52, borderRadius: 22, padding: "12px 30px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(4) + L * 0.72, 0.45)})` }}>⏱️ 10 SECOND SE KAM</div>
    </div>);
  }
  if (idx === 5) {
    const p = pop(t, S(5) + 0.3, 0.45);
    out.push(<div key="today" style={{ position: "absolute", top: 540, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 170, lineHeight: 1, color: GOLD, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>100×</div>
      <div style={{ marginTop: 10, display: "inline-block", background: "#e9c46a", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 48, borderRadius: 26, padding: "14px 28px", border: `5px solid ${INK}` }}>🤲 AAJ KI NIYYAT</div>
      <div style={{ marginTop: 18 }}><div style={{ display: "inline-block", background: GREEN, color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 44, borderRadius: 22, padding: "10px 26px", border: `4px solid ${INK}`, transform: `scale(${pop(t, S(5) + 2.0, 0.4)})` }}>💬 COMMENT: SUBHANALLAH</div></div>
    </div>);
  }
  if (idx === 6) {
    const p = pop(t, S(6) + 0.2, 0.5);
    out.push(<div key="share" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 56, borderRadius: 26, padding: "18px 36px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>SHARE = ONE MORE SADQAH</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1108sadqah-mix.m4a",
  imgDir: "d1108",
  logo: "day1/one-more-sadqah.png",
  brand: "ONE MORE SADQAH",
  keyword: /kalime|zabaan|halke|tarazu|bhaari|rahmaan|pyaare|subhanallahi?|azeem|bihamdihi|second|sau|niyyat|subhanallah|sadqah/i,
  particles: (c) => (c.idx >= 3 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx === 2 || c.idx === 3 || c.idx === 4 ? 1330 : 1180),
  captionSize: 70,
  shakeAt: [3],
  shots: [
    { img: "s_scale.jpg", from: 0, to: 1, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_real_a.jpg", from: 1, to: 2, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s_tongue.jpg", from: 2, to: 3, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_beads.jpg", from: 3, to: 4, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_walk.jpg", from: 4, to: 5, z0: 1.0, z1: 1.1, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.5 },
    { img: "s_kitchen.jpg", from: 5, to: 6, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_share.jpg", from: 6, to: 999, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1108Sadqah: React.FC = () => <HouseShort cfg={CFG} />;
