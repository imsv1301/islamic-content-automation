import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1105sadqah-timing.json";

/* One More Sadqah, Short 7 (5 Nov 2026, Shab-e-Jumu'ah tonight): "Ek durood, das rehmatein", Sahih Muslim 408 (Abu Huraira Radi Allahu Anhu):
   "Whoever sends salah upon me once, Allah sends salah upon him ten times." Checked on sunnah.com the same day.
   The Prophet Sallallahu Alaihi Wa Alihi Wasallam is never depicted; people are faceless (back views). Masjid-e-Nabawi shot is a REAL Pixabay frame, never AI. */
const TM = data as unknown as Timing;
export const D1105_SADQAH_DUR = houseDur(TM);
const PLACE = ["SAWAL", "SHAB-E-JUMU'AH", "HADITH", "HADITH", "HISAAB", "DUROOD", "AAJ KA AMAL", "ONE MORE SADQAH"];
const GREEN = "#2a9d8f";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="SHORT 7" big={<>1 = 10</>} place={PLACE[c.idx] || ""} tag="MUSLIM 408" tagBg={GOLD} tagFg={INK} />;

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) {
    const p = pop(t, S(0) + 0.3, 0.45);
    out.push(<div key="q" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "rgba(20,10,4,0.82)", borderRadius: 26, padding: "18px 40px", border: `4px solid ${GOLD}`, fontFamily: MONT, fontWeight: 800, fontSize: 70, color: "#fff" }}>
        1 LAMHA <span style={{ color: GOLD }}>=</span> 10 REHMATEIN
      </div>
    </div>);
  }
  if (idx === 1) {
    const p = pop(t, S(1) + 0.2, 0.45);
    out.push(<div key="j" style={{ position: "absolute", top: 580, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "#e9c46a", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 48, borderRadius: 26, padding: "16px 30px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>🌙 AAJ RAAT: SHAB-E-JUMU'AH</div>
    </div>);
  }
  if (idx === 3) {
    const p = pop(t, S(3) - 0.1, 0.5);
    const k = tw(t, S(3) + 0.1, S(3) + 0.8);
    out.push(<div key="hadith" style={{ position: "absolute", top: 470, left: 46, right: 46, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
      <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "26px 26px 20px", border: `3px solid ${GOLD}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 70, lineHeight: 1.6, color: GOLD, direction: "rtl", textAlign: "center", opacity: k }}>مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 30, color: "#fff", textAlign: "center", marginTop: 6 }}>Jo mujh par ek baar durood bheje, Allah us par das baar rehmat farmata hai</div>
        <div style={{ marginTop: 14, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.1em", color: GOLD }}>SAHIH MUSLIM 408 · ABU HURAIRA RADI ALLAHU ANHU</div>
      </div>
    </div>);
  }
  if (idx === 4) {
    const rows: [string, string, number][] = [["1 DUROOD", "10 REHMATEIN", 0.2], ["10 DUROOD", "100 REHMATEIN", 1.9]];
    out.push(<div key="calc" style={{ position: "absolute", top: 500, left: 60, right: 60 }}>
      {rows.map(([a, b, d], i) => {
        const k = pop(t, S(4) + d, 0.4);
        return <div key={i} style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", background: i ? GOLD : "rgba(20,10,4,0.86)", color: i ? INK : "#fff", borderRadius: 22, padding: "16px 26px", border: `4px solid ${i ? INK : GOLD}`, transform: `translateX(${(1 - k) * -1100}px)`, opacity: k > 0.01 ? 1 : 0, fontFamily: MONT, fontWeight: 800, fontSize: 46 }}>
          <span>{a}</span><span>→ {b}</span></div>;
      })}
    </div>);
  }
  if (idx === 5) {
    const p = pop(t, S(5) + 0.2, 0.5);
    const k = tw(t, S(5) + 0.9, S(5) + 1.8);
    out.push(<div key="d" style={{ position: "absolute", top: 520, left: 60, right: 60, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ background: "rgba(18,9,3,0.88)", borderRadius: 30, padding: "24px 26px", border: `4px solid ${GOLD}` }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.15em", color: "#fff" }}>SAB SE AASAAN DUROOD</div>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 84, color: GOLD, direction: "rtl", lineHeight: 1.5, opacity: k }}>صَلَّى اللّٰهُ عَلَيْهِ وَآلِهٖ وَسَلَّمَ</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 32, color: "#fff", opacity: k }}>Sallallahu Alaihi Wa Alihi Wasallam</div>
      </div>
    </div>);
  }
  if (idx === 6) {
    const n = Math.min(10, Math.floor(tw(t, S(6) + 0.3, E(6) + 0.2, (x) => x) * 10) + 1);
    out.push(<div key="amal" style={{ position: "absolute", top: 500, left: 80, right: 80, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 70, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, S(6), 0.45)})` }}>AAJ RAAT</div>
      <div style={{ marginTop: 10, fontFamily: MONT, fontWeight: 800, fontSize: 170, lineHeight: 1, color: GOLD, WebkitTextStroke: `11px ${INK}`, paintOrder: "stroke fill" }}>{n}×</div>
      <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 10 }}>
        {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ width: 42, height: 42, borderRadius: 21, background: i < n ? GOLD : "rgba(255,255,255,0.25)", border: `4px solid ${INK}` }} />)}
      </div>
      <div style={{ marginTop: 16, display: "inline-block", background: GREEN, color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 44, borderRadius: 22, padding: "10px 26px", border: `4px solid ${INK}` }}>KAM AZ KAM 10 BAAR DUROOD</div>
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
  mix: "day1/d1105sadqah-mix.m4a",
  imgDir: "d1105",
  logo: "day1/one-more-sadqah.png",
  brand: "ONE MORE SADQAH",
  keyword: /durood|rehmat|rehmatein|jumu|lamha|das|sau|aasaan|sadqah|baar/i,
  particles: (c) => (c.idx >= 5 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx === 3 ? 1300 : c.idx === 6 ? 1330 : 1180),
  captionSize: 70,
  shakeAt: [3],
  shots: [
    { img: "s7_lights.jpg", from: 0, to: 1, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s7_night.jpg", from: 1, to: 2, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_real_a.jpg", from: 2, to: 3, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "dome_real_b.jpg", from: 3, to: 4, z0: 1.08, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s7_tasbih.jpg", from: 4, to: 5, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s7_lamp.jpg", from: 5, to: 6, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s7_man.jpg", from: 6, to: 7, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s7_lights.jpg", from: 7, to: 999, z0: 1.0, z1: 1.12, fx0: 0.55, fy0: 0.45, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1105Sadqah: React.FC = () => <HouseShort cfg={CFG} />;
