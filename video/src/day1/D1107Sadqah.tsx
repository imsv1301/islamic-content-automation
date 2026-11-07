import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1107sadqah-timing.json";

/* One More Sadqah, Short 9 (Sat 7 Nov 2026): "Teen cheezein jo saath jati hain", Sahih Muslim 1631 (Abu Huraira Radi Allahu Anhu):
   "When a person dies, his deeds come to an end except for three: sadaqah jariyah, knowledge from which benefit is derived,
   or a righteous child who prays for him." Book of Wills. Checked on sunnah.com listings the same day.
   The Prophet Sallallahu Alaihi Wa Alihi Wasallam is never depicted; people are faceless (back views). Masjid-e-Nabawi shots are REAL Pixabay frames, never AI. */
const TM = data as unknown as Timing;
export const D1107_SADQAH_DUR = houseDur(TM);
const PLACE = ["AAKHRI SAFAR", "HADITH", "HADITH", "TEEN CHEEZEIN", "MISALEIN", "AAJ KA AMAL", "ONE MORE SADQAH"];
const GREEN = "#2a9d8f";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="SHORT 9" big={<>SADQA-E-JARIYA</>} place={PLACE[c.idx] || ""} tag="MUSLIM 1631" tagBg={GOLD} tagFg={INK} />;

const THREE: [string, string, string][] = [["1", "💧 SADQA-E-JARIYA", GOLD], ["2", "📖 NAFA WALA ILM", "#e9c46a"], ["3", "🤲 NEK AULAD KI DUA", GREEN]];
const EX = ["💧 KUNWAN", "🕌 MASJID", "📖 QURAN PAK", "🤲 EK DUA"];

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) {
    const p = pop(t, S(0) + 0.3, 0.45);
    out.push(<div key="q" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "rgba(20,10,4,0.82)", borderRadius: 26, padding: "18px 40px", border: `4px solid ${GOLD}`, fontFamily: MONT, fontWeight: 800, fontSize: 62, color: "#fff" }}>
        SAATH <span style={{ color: GOLD }}>KYA</span> JATA HAI? 🤔
      </div>
    </div>);
  }
  if (idx === 2) {
    const p = pop(t, S(2) - 0.1, 0.5);
    const k = tw(t, S(2) + 0.1, S(2) + 0.9);
    out.push(<div key="hadith" style={{ position: "absolute", top: 420, left: 40, right: 40, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
      <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "24px 24px 18px", border: `3px solid ${GOLD}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 50, lineHeight: 1.65, color: GOLD, direction: "rtl", textAlign: "center", opacity: k }}>إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 28, color: "#fff", textAlign: "center", marginTop: 6, lineHeight: 1.3 }}>Jab insaan faut ho jata hai to us ke amal khatam ho jate hain, siwaye teen cheezon ke</div>
        <div style={{ marginTop: 12, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.1em", color: GOLD }}>SAHIH MUSLIM 1631 · ABU HURAIRA RADI ALLAHU ANHU</div>
      </div>
    </div>);
  }
  if (idx === 3) {
    const L = E(3) - S(3);
    out.push(<div key="three" style={{ position: "absolute", top: 480, left: 80, right: 80 }}>
      {THREE.map(([n, s, col], i) => { const k = pop(t, S(3) + 0.1 + i * (L / 3.2), 0.45); return <div key={i} style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 20, background: col, borderRadius: 24, padding: "12px 24px", border: `5px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 46, color: INK, transform: `translateX(${(1 - k) * 900}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)" }}>
        <span style={{ background: INK, color: GOLD, borderRadius: 999, width: 64, height: 64, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{n}</span><span>{s}</span></div>; })}
    </div>);
  }
  if (idx === 4) {
    const L = E(4) - S(4);
    out.push(<div key="ex" style={{ position: "absolute", top: 500, left: 60, right: 60, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18 }}>
      {EX.map((s, i) => <div key={i} style={{ background: "rgba(255,245,230,0.95)", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 48, borderRadius: 22, padding: "12px 26px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(4) + 0.1 + i * (L / 4.4), 0.4)})`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)" }}>{s}</div>)}
    </div>);
  }
  if (idx === 5) {
    const p = pop(t, S(5) + 0.3, 0.45);
    out.push(<div key="today" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "#e9c46a", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 50, borderRadius: 26, padding: "16px 30px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>🌱 AAJ SHURU KAREIN</div>
      <div style={{ marginTop: 18 }}><div style={{ display: "inline-block", background: GREEN, color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 44, borderRadius: 22, padding: "10px 26px", border: `4px solid ${INK}`, transform: `scale(${pop(t, S(5) + 1.8, 0.4)})` }}>♾️ AAP KE BAAD BHI</div></div>
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
  mix: "day1/d1107sadqah-mix.m4a",
  imgDir: "d1107",
  logo: "day1/one-more-sadqah.png",
  brand: "ONE MORE SADQAH",
  keyword: /duniya|saath|faut|amal|khatam|teen|jariya|ilm|faida|nek|aulad|dua|kunwan|masjid|quran|aaj|baad|sadqah/i,
  particles: (c) => (c.idx >= 3 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx === 2 || c.idx === 3 ? 1330 : 1180),
  captionSize: 70,
  shakeAt: [2],
  shots: [
    { img: "s9_path.jpg", from: 0, to: 1, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_real_a.jpg", from: 1, to: 2, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "dome_real_b.jpg", from: 2, to: 3, z0: 1.08, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s9_teach.jpg", from: 3, to: 4, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s9_well.jpg", from: 4, to: 5, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s9_mosque.jpg", from: 5, to: 6, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s9_son.jpg", from: 6, to: 999, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1107Sadqah: React.FC = () => <HouseShort cfg={CFG} />;
