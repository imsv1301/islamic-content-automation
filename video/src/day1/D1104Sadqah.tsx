import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1104sadqah-timing.json";

/* One More Sadqah, Short 6 (4 Nov 2026): "Har jod par roz ek sadqah", Sahih al-Bukhari 2989 (Abu Huraira Radi Allahu Anhu).
   Verified on sunnah.com/bukhari:2989 the same day (in-book: Book 56, Hadith 198). The Prophet Sallallahu Alaihi Wa Alihi Wasallam is never depicted;
   all people are faceless (back views). Masjid-e-Nabawi shot is a REAL Pixabay frame (credited in the description), never AI. */
const TM = data as unknown as Timing;
export const D1104_SADQAH_DUR = houseDur(TM);
const PLACE = ["SAWAL", "PAISA: 0", "HADITH", "HADITH", "SADQAH 1 · 2", "SADQAH 3 · 4", "SADQAH 5", "AAJ KA AMAL", "ONE MORE SADQAH"];
const GREEN = "#2a9d8f";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="SHORT 6" big={<>ROZ KA SADQAH</>} place={PLACE[c.idx] || ""} tag="BUKHARI 2989" tagBg={GOLD} tagFg={INK} />;

const LIST: [string, number][] = [["INSAAF KARNA", 4], ["BOJH UTHANE MEIN MADAD", 4], ["ACHHI BAAT", 5], ["NAMAZ KI TARAF HAR QADAM", 5], ["RAASTE SE TAKLEEF HATANA", 6]];

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) {
    const p = pop(t, S(0) + 0.3, 0.45);
    out.push(<div key="q" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "rgba(20,10,4,0.82)", borderRadius: 26, padding: "18px 40px", border: `4px solid ${GOLD}`, fontFamily: MONT, fontWeight: 800, fontSize: 64, color: "#fff" }}>
        HAR JOD <span style={{ color: GOLD }}>=</span> 1 SADQAH<span style={{ color: "#ff6b6b" }}> / ROZ</span>
      </div>
    </div>);
  }
  if (idx === 1) {
    const p = pop(t, S(1) + 0.2, 0.45);
    out.push(<div key="j" style={{ position: "absolute", top: 580, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "#e9c46a", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 64, borderRadius: 26, padding: "16px 36px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>KHARCHA: <span style={{ color: "#b00020" }}>Rs 0</span></div>
    </div>);
  }
  if (idx === 3) {
    const p = pop(t, S(3) - 0.1, 0.5);
    const k = tw(t, S(3) + 0.1, S(3) + 0.8);
    out.push(<div key="hadith" style={{ position: "absolute", top: 470, left: 46, right: 46, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
      <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "26px 26px 20px", border: `3px solid ${GOLD}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 62, lineHeight: 1.6, color: GOLD, direction: "rtl", textAlign: "center", opacity: k }}>كُلُّ سُلَامَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ كُلَّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 30, color: "#fff", textAlign: "center", marginTop: 6 }}>Har din jab sooraj nikalta hai, insaan ke har jod par sadqah hai</div>
        <div style={{ marginTop: 14, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.1em", color: GOLD }}>SAHIH AL-BUKHARI 2989 · ABU HURAIRA RADI ALLAHU ANHU</div>
      </div>
    </div>);
  }
  if (idx >= 4 && idx <= 6) {
    out.push(<div key="list" style={{ position: "absolute", top: 470, left: 60, right: 60 }}>
      {LIST.map(([s, li], i) => {
        if (li > idx) return null;
        const at = li < idx ? -99 : S(li) + 0.2 + (i - LIST.findIndex((x) => x[1] === li)) * 1.6;
        const k = pop(t, at, 0.4);
        const now = li === idx;
        return <div key={i} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 16, background: now ? "rgba(20,10,4,0.88)" : "rgba(20,10,4,0.6)", borderRadius: 18, padding: "12px 20px", borderLeft: `8px solid ${now ? GOLD : GREEN}`, transform: `translateX(${(1 - k) * -800}px)` }}>
          <div style={{ width: 46, height: 46, borderRadius: 10, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 30, flexShrink: 0 }}>✓</div>
          <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 34, color: "#fff" }}>{s} <span style={{ color: GOLD }}>= SADQAH</span></span>
        </div>;
      })}
    </div>);
  }
  if (idx === 7) {
    const items = ["1 ACHHI BAAT", "RAASTE SE 1 PATHAR"];
    out.push(<div key="amal" style={{ position: "absolute", top: 520, left: 80, right: 80 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 70, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, S(7), 0.45)})` }}>AAJ KA SADQAH</div>
      {items.map((s, i) => {
        const k = pop(t, S(7) + 0.8 + i * 0.9, 0.4);
        return <div key={i} style={{ marginTop: 16, background: i ? GREEN : "#e9c46a", color: INK, borderRadius: 22, padding: "14px 24px", border: `4px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 44, textAlign: "center", transform: `scale(${k})`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)" }}>{s}</div>;
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
  mix: "day1/d1104sadqah-mix.m4a",
  imgDir: "d1104",
  logo: "day1/one-more-sadqah.png",
  brand: "ONE MORE SADQAH",
  keyword: /sadqah|jod|sooraj|insaaf|bojh|madad|achhi|qadam|takleef|pathar|paisa/i,
  particles: (c) => (c.idx === 7 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx >= 4 && c.idx <= 6 ? 1330 : c.idx === 3 ? 1300 : 1180),
  captionSize: 70,
  shakeAt: [3],
  shots: [
    { img: "q_rise_b.jpg", from: 0, to: 1, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s_empty.jpg", from: 1, to: 2, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_real_a.jpg", from: 2, to: 3, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s6_steps.jpg", from: 3, to: 4, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s6_justice.jpg", from: 4, to: 5, z0: 1.0, z1: 1.1, fx0: 0.52, fy0: 0.5, fx1: 0.52, fy1: 0.5 },
    { img: "s6_word2.jpg", from: 5, to: 6, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s6_stone.jpg", from: 6, to: 7, z0: 1.0, z1: 1.12, fx0: 0.45, fy0: 0.5, fx1: 0.45, fy1: 0.5 },
    { img: "s6_path.jpg", from: 7, to: 8, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "q_lanterns.jpg", from: 8, to: 999, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1104Sadqah: React.FC = () => <HouseShort cfg={CFG} />;
