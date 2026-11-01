import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1101sadqah-timing.json";

/* One More Sadqah, Short 3 (1 Nov 2026): "Sadqah maal mein kami nahin karta", Sahih Muslim 2588 (Abu Hurairah Radi Allahu Anhu).
   Verified on sunnah.com/muslim:2588 the same day. The Prophet Sallallahu Alaihi Wa Alihi Wasallam is never depicted: places, objects, hands, back views only. */
const TM = data as unknown as Timing;
export const D1101_SADQAH_DUR = houseDur(TM);
const PLACE = ["SAWAL", "HAMARA HISAAB", "HADITH", "HADITH · 1", "HADITH · 2", "HADITH · 3", "ALLAH KA HISAAB", "AAJ KA AMAL", "ONE MORE SADQAH"];
const GREEN = "#2a9d8f";

const AR = [
  ["مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ", "Sadqah maal mein kami nahin karta"],
  ["وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا", "Maaf karne wale ki izzat Allah barhata hai"],
  ["وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ", "Allah ke liye aajizi karne wale ko Allah buland karta hai"],
];

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="SHORT 3" big={<>SADQAH</>} place={PLACE[c.idx] || ""} tag="MUSLIM 2588" tagBg={GOLD} tagFg={INK} />;

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 1) {
    const p = pop(t, S(1) + 0.2, 0.45);
    out.push(<div key="sum" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "rgba(20,10,4,0.82)", borderRadius: 26, padding: "18px 40px", border: `4px solid ${GOLD}`, fontFamily: MONT, fontWeight: 800, fontSize: 96, color: "#fff" }}>
        100 − 10 = <span style={{ color: GOLD }}>90</span><span style={{ color: "#ff6b6b" }}>?</span>
      </div>
    </div>);
  }
  if (idx >= 3 && idx <= 5) {
    const p = pop(t, S(3) - 0.1, 0.5);
    out.push(<div key="hadith" style={{ position: "absolute", top: 470, left: 50, right: 50, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
      <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "24px 28px 20px", border: `3px solid ${GOLD}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        {AR.map(([ar, ro], i) => {
          const li = 3 + i;
          const on = idx >= li;
          const k = tw(t, S(li) - 0.05, S(li) + 0.5);
          const cur = idx === li;
          return <div key={i} style={{ marginBottom: 14, opacity: on ? (cur ? 1 : 0.55) * k : 0.0, transform: `translateY(${(1 - k) * 20}px)` }}>
            <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 66, lineHeight: 1.45, color: cur ? GOLD : "#fff", direction: "rtl", textAlign: "center" }}>{ar}</div>
            <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 28, color: "#fff", textAlign: "center", letterSpacing: "0.02em" }}>{ro}</div>
          </div>;
        })}
        <div style={{ marginTop: 6, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.1em", color: GOLD }}>SAHIH MUSLIM 2588 · ABU HURAIRAH RADI ALLAHU ANHU</div>
      </div>
    </div>);
  }
  if (idx === 6) {
    const p1 = pop(t, S(6) + 0.1, 0.45), p2 = pop(t, S(6) + 0.8, 0.45);
    const row = (k: number, a: string, b: React.ReactNode, col: string) => <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", background: col, borderRadius: 22, padding: "16px 26px", border: `4px solid ${INK}`, transform: `translateX(${(1 - k) * 700}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)", fontFamily: MONT, fontWeight: 800, color: INK }}>
      <span style={{ fontSize: 30 }}>{a}</span><span style={{ fontSize: 44 }}>{b}</span></div>;
    out.push(<div key="cmp" style={{ position: "absolute", top: 540, left: 70, right: 70 }}>
      {row(p1, "HAMARA HISAAB", <>100 − 10 = 90</>, "#e9c46a")}
      {row(p2, "ALLAH KA HISAAB", <>KAMI NAHIN</>, GREEN)}
    </div>);
  }
  if (idx === 7) {
    const items = ["1 RUPAYA SADQAH", "KISI KO MAAF KAREIN", "AAJIZI IKHTIYAR KAREIN"];
    out.push(<div key="amal" style={{ position: "absolute", top: 520, left: 80, right: 80 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 70, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, S(7), 0.45)})` }}>AAJ KA AMAL</div>
      {items.map((s, i) => {
        const k = pop(t, S(7) + 0.5 + i * 0.3, 0.4);
        return <div key={i} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 16, background: "rgba(20,10,4,0.82)", borderRadius: 18, padding: "12px 20px", borderLeft: `8px solid ${GOLD}`, transform: `translateX(${(1 - k) * -700}px)` }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, border: `4px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontFamily: MONT, fontWeight: 800, fontSize: 30 }}>{i + 1}</div>
          <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 34, color: "#fff" }}>{s}</span>
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
  mix: "day1/d1101sadqah-mix.m4a",
  imgDir: "d1101",
  logo: "day1/one-more-sadqah.png",
  brand: "ONE MORE SADQAH",
  keyword: /sadqah|paisa|kami|maaf|izzat|aajizi|buland|hisaab|rupaya|nawwe|allah/i,
  particles: () => "dust",
  captionTop: (c) => (c.idx >= 3 && c.idx <= 5 ? 1300 : 1180),
  captionSize: 72,
  shakeAt: [3],
  shots: [
    { img: "q_coin.jpg", from: 0, to: 1, z0: 1.16, z1: 1.02, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "q_sums.jpg", from: 1, to: 2, z0: 1.0, z1: 1.14, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.5, vertical: true },
    { img: "q_dome.jpg", from: 2, to: 3, z0: 1.02, z1: 1.16, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.42, vertical: true },
    { img: "q_jar.jpg", from: 3, to: 4, z0: 1.14, z1: 1.0, fx0: 0.5, fy0: 0.45, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "q_forgive.jpg", from: 4, to: 5, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.45, vertical: true },
    { img: "q_rise_b.jpg", from: 5, to: 6, z0: 1.0, z1: 1.14, fx0: 0.5, fy0: 0.6, fx1: 0.5, fy1: 0.4, vertical: true },
    { img: "q_scale.jpg", from: 6, to: 7, z0: 1.0, z1: 1.15, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "q_give.jpg", from: 7, to: 8, z0: 1.15, z1: 1.02, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "q_lanterns.jpg", from: 8, to: 999, z0: 1.0, z1: 1.14, fx0: 0.4, fy0: 0.5, fx1: 0.6, fy1: 0.5, vertical: true },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1101Sadqah: React.FC = () => <HouseShort cfg={CFG} />;
