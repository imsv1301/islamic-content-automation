import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1103sadqah-timing.json";

/* One More Sadqah, Short 5 (3 Nov 2026): "Kisi neki ko chhota na samjho, chahe khile chehre se milna ho", Sahih Muslim 2626 (Abu Dharr Radi Allahu Anhu).
   Verified on sunnah.com/muslim:2626 the same day. The Prophet Sallallahu Alaihi Wa Alihi Wasallam is never depicted; all people are faceless (back views).
   Masjid-e-Nabawi shot is a REAL Pixabay frame (credited in the description), never AI. */
const TM = data as unknown as Timing;
export const D1103_SADQAH_DUR = houseDur(TM);
const PLACE = ["SAWAL", "KHAALI JEB?", "HADITH", "HADITH", "HADITH", "ASAR", "AAJ KA AMAL", "ONE MORE SADQAH"];
const GREEN = "#2a9d8f";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="SHORT 5" big={<>NEKI</>} place={PLACE[c.idx] || ""} tag="MUSLIM 2626" tagBg={GOLD} tagFg={INK} />;

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) {
    const p = pop(t, S(0) + 0.2, 0.45);
    out.push(<div key="q" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "rgba(20,10,4,0.82)", borderRadius: 26, padding: "18px 40px", border: `4px solid ${GOLD}`, fontFamily: MONT, fontWeight: 800, fontSize: 72, color: "#fff" }}>
        MUSKURAHAT <span style={{ color: GOLD }}>=</span> NEKI<span style={{ color: "#ff6b6b" }}>?</span>
      </div>
    </div>);
  }
  if (idx === 1) {
    const p = pop(t, S(1) + 0.2, 0.45);
    out.push(<div key="j" style={{ position: "absolute", top: 580, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "#e9c46a", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 64, borderRadius: 26, padding: "16px 36px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>JEB: <span style={{ color: "#b00020" }}>0</span></div>
    </div>);
  }
  if (idx === 3 || idx === 4) {
    const p = pop(t, S(3) - 0.1, 0.5);
    const k = tw(t, S(3) + 0.1, S(3) + 0.7);
    const k2 = tw(t, S(4), S(4) + 0.6);
    out.push(<div key="hadith" style={{ position: "absolute", top: 480, left: 46, right: 46, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
      <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "26px 26px 20px", border: `3px solid ${GOLD}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 64, lineHeight: 1.55, color: GOLD, direction: "rtl", textAlign: "center", opacity: k }}>لاَ تَحْقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا</div>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 64, lineHeight: 1.55, color: GOLD, direction: "rtl", textAlign: "center", opacity: k2 }}>وَلَوْ أَنْ تَلْقَى أَخَاكَ بِوَجْهٍ طَلْقٍ</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 30, color: "#fff", textAlign: "center", marginTop: 6 }}>Kisi bhi neki ko chhota na samjho, chahe apne bhai se khile chehre ke saath milna hi ho</div>
        <div style={{ marginTop: 14, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.1em", color: GOLD }}>SAHIH MUSLIM 2626 · ABU DHARR RADI ALLAHU ANHU</div>
      </div>
    </div>);
  }
  if (idx === 5) {
    const p1 = pop(t, S(5) + 0.2, 0.45), p2 = pop(t, S(5) + 1.2, 0.45);
    const row = (k: number, a: string, b: string, col: string) => <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", background: col, borderRadius: 22, padding: "16px 26px", border: `4px solid ${INK}`, transform: `translateX(${(1 - k) * 700}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)", fontFamily: MONT, fontWeight: 800, color: INK }}>
      <span style={{ fontSize: 36 }}>{a}</span><span style={{ fontSize: 44 }}>{b}</span></div>;
    out.push(<div key="cmp" style={{ position: "absolute", top: 560, left: 70, right: 70 }}>
      {row(p1, "1 MUSKURAHAT", "😊 → ❤", "#e9c46a")}
      {row(p2, "DIN KA BOJH", "HALKA", GREEN)}
    </div>);
  }
  if (idx === 6) {
    const items = ["GHAR WALE", "RAASTE KA ANJAAN", "MUSKURA KAR MILEIN"];
    out.push(<div key="amal" style={{ position: "absolute", top: 520, left: 80, right: 80 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 70, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, S(6), 0.45)})` }}>AAJ KA AMAL</div>
      {items.map((s, i) => {
        const k = pop(t, S(6) + 0.5 + i * 0.5, 0.4);
        return <div key={i} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 16, background: "rgba(20,10,4,0.82)", borderRadius: 18, padding: "12px 20px", borderLeft: `8px solid ${GOLD}`, transform: `translateX(${(1 - k) * -700}px)` }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, border: `4px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontFamily: MONT, fontWeight: 800, fontSize: 30 }}>{i + 1}</div>
          <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 36, color: "#fff" }}>{s}</span>
        </div>;
      })}
    </div>);
  }
  if (idx === 7) {
    const p = pop(t, S(7) + 0.2, 0.5);
    out.push(<div key="share" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 56, borderRadius: 26, padding: "18px 36px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>SHARE = ONE MORE SADQAH</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1103sadqah-mix.m4a",
  imgDir: "d1103",
  logo: "day1/one-more-sadqah.png",
  brand: "ONE MORE SADQAH",
  keyword: /muskurana|muskurahat|neki|khaali|chhota|khile|bojh|halka|muskura|sadqah/i,
  particles: (c) => (c.idx === 5 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx === 3 || c.idx === 4 ? 1300 : 1180),
  captionSize: 72,
  shakeAt: [3],
  shots: [
    { img: "q_rise_b.jpg", from: 0, to: 1, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s_empty.jpg", from: 1, to: 2, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_real_a.jpg", from: 2, to: 3, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s_seed.jpg", from: 3, to: 4, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "q_forgive.jpg", from: 4, to: 5, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s5_burden.jpg", from: 5, to: 6, z0: 1.02, z1: 1.14, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s_feed.jpg", from: 6, to: 7, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "q_lanterns.jpg", from: 7, to: 999, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1103Sadqah: React.FC = () => <HouseShort cfg={CFG} />;
