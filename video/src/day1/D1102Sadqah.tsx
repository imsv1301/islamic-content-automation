import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1102sadqah-timing.json";

/* One More Sadqah, Short 4 (2 Nov 2026): "Aag se bacho, chahe aadhi khajoor se", Sahih al-Bukhari 1417 ('Adi bin Hatim Radi Allahu Anhu).
   Verified on sunnah.com/bukhari:1417 the same day. The Prophet Sallallahu Alaihi Wa Alihi Wasallam is never depicted.
   Masjid-e-Nabawi shot is a REAL Pixabay frame (credited in the description), never AI. */
const TM = data as unknown as Timing;
export const D1102_SADQAH_DUR = houseDur(TM);
const PLACE = ["SAWAL", "SIRF AADHI?", "HADITH", "HADITH", "ALLAH KE HAAN", "DHAAL", "YAAD RAKHEIN", "AAJ KA AMAL", "ONE MORE SADQAH"];
const GREEN = "#2a9d8f";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="SHORT 4" big={<>SADQAH</>} place={PLACE[c.idx] || ""} tag="BUKHARI 1417" tagBg={GOLD} tagFg={INK} />;

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 1) {
    const p = pop(t, S(1) + 0.2, 0.45);
    out.push(<div key="half" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "rgba(20,10,4,0.82)", borderRadius: 26, padding: "18px 40px", border: `4px solid ${GOLD}`, fontFamily: MONT, fontWeight: 800, fontSize: 88, color: "#fff" }}>
        <span style={{ color: GOLD }}>½</span> KHAJOOR<span style={{ color: "#ff6b6b" }}>?</span>
      </div>
    </div>);
  }
  if (idx === 3) {
    const p = pop(t, S(3) - 0.1, 0.5);
    const k = tw(t, S(3) + 0.1, S(3) + 0.7);
    out.push(<div key="hadith" style={{ position: "absolute", top: 520, left: 50, right: 50, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
      <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "28px 28px 22px", border: `3px solid ${GOLD}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 84, lineHeight: 1.5, color: GOLD, direction: "rtl", textAlign: "center", opacity: k }}>اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 32, color: "#fff", textAlign: "center" }}>Aag se bacho, chahe aadhi khajoor ke zariye hi sahi</div>
        <div style={{ marginTop: 14, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.1em", color: GOLD }}>SAHIH AL-BUKHARI 1417 · 'ADI BIN HATIM RADI ALLAHU ANHU</div>
      </div>
    </div>);
  }
  if (idx === 4) {
    const p1 = pop(t, S(4) + 0.1, 0.45), p2 = pop(t, S(4) + 0.9, 0.45);
    const row = (k: number, a: string, b: React.ReactNode, col: string) => <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", background: col, borderRadius: 22, padding: "16px 26px", border: `4px solid ${INK}`, transform: `translateX(${(1 - k) * 700}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)", fontFamily: MONT, fontWeight: 800, color: INK }}>
      <span style={{ fontSize: 34 }}>{a}</span><span style={{ fontSize: 44 }}>{b}</span></div>;
    out.push(<div key="cmp" style={{ position: "absolute", top: 560, left: 70, right: 70 }}>
      {row(p1, "CHHOTA SADQAH", <>QEEMTI</>, "#e9c46a")}
      {row(p2, "BARA SADQAH", <>QEEMTI</>, GREEN)}
    </div>);
  }
  if (idx === 5) {
    const p = pop(t, S(5) + 0.3, 0.5);
    out.push(<div key="sh" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 58, borderRadius: 26, padding: "16px 34px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>🛡 ½ KHAJOOR = DHAAL</div>
    </div>);
  }
  if (idx === 6) {
    const p = pop(t, S(6) + 0.1, 0.45);
    out.push(<div key="kam" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 78, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${p})` }}>KAM KO <span style={{ color: GOLD }}>KAM</span><br />MAT SAMJHEIN</div>);
  }
  if (idx === 7) {
    const items = ["1 KHAJOOR", "1 LUQMA", "1 BHOOKA INSAAN"];
    out.push(<div key="amal" style={{ position: "absolute", top: 520, left: 80, right: 80 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 70, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, S(7), 0.45)})` }}>AAJ KA AMAL</div>
      {items.map((s, i) => {
        const k = pop(t, S(7) + 0.5 + i * 0.4, 0.4);
        return <div key={i} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 16, background: "rgba(20,10,4,0.82)", borderRadius: 18, padding: "12px 20px", borderLeft: `8px solid ${GOLD}`, transform: `translateX(${(1 - k) * -700}px)` }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, border: `4px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontFamily: MONT, fontWeight: 800, fontSize: 30 }}>{i + 1}</div>
          <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 36, color: "#fff" }}>{s}</span>
        </div>;
      })}
    </div>);
  }
  if (idx === 8) {
    const p = pop(t, S(8) + 0.2, 0.5);
    out.push(<div key="share" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 56, borderRadius: 26, padding: "18px 36px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>SHARE = ONE MORE SADQAH</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1102sadqah-mix.m4a",
  imgDir: "d1102",
  logo: "day1/one-more-sadqah.png",
  brand: "ONE MORE SADQAH",
  keyword: /sadqah|khajoor|aadhi|aag|dhaal|qeemti|kam|luqma|bhooke|allah/i,
  particles: (c) => (c.idx === 5 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx === 3 ? 1280 : 1180),
  captionSize: 72,
  shakeAt: [3, 5],
  shots: [
    { img: "s_empty.jpg", from: 0, to: 1, z0: 1.15, z1: 1.02, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_halfdate.jpg", from: 1, to: 2, z0: 1.0, z1: 1.16, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_real_a.jpg", from: 2, to: 3, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.45, vertical: true },
    { img: "s_dates_plate.jpg", from: 3, to: 4, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_scale.jpg", from: 4, to: 5, z0: 1.0, z1: 1.12, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.5 },
    { img: "s_fire_shield.jpg", from: 5, to: 6, z0: 1.02, z1: 1.18, fx0: 0.5, fy0: 0.55, fx1: 0.5, fy1: 0.5 },
    { img: "s_seed.jpg", from: 6, to: 7, z0: 1.16, z1: 1.02, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_feed.jpg", from: 7, to: 8, z0: 1.0, z1: 1.12, fx0: 0.55, fy0: 0.5, fx1: 0.45, fy1: 0.5 },
    { img: "s_lamps.jpg", from: 8, to: 999, z0: 1.0, z1: 1.14, fx0: 0.4, fy0: 0.5, fx1: 0.6, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1102Sadqah: React.FC = () => <HouseShort cfg={CFG} />;
