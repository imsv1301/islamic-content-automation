import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1109sadqah-timing.json";

/* One More Sadqah, Short 11 (Mon 9 Nov 2026): "Peer ka din itna khaas kyun?", Sahih Muslim 1162 (Abu Qatada al-Ansari Radi Allahu Anhu):
   asked about fasting on Monday, he Sallallahu Alaihi Wa Alihi Wasallam said: "That is the day I was born, and the day I was sent / revelation came down to me."
   Checked via sunnah.com listings the same day. Never depicted; people faceless. Masjid-e-Nabawi shot is a REAL Pixabay frame, never AI. */
const TM = data as unknown as Timing;
export const D1109_SADQAH_DUR = houseDur(TM);
const PLACE = ["PEER KA DIN", "SAWAAL", "HADITH", "WILADAT KA DIN", "AAJ KA AMAL", "COMMENT", "ONE MORE SADQAH"];
const GREEN = "#2a9d8f";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="SHORT 11" big={<>PEER</>} place={PLACE[c.idx] || ""} tag="MUSLIM 1162" tagBg={GOLD} tagFg={INK} />;
const chip = (bg: string, col: string, sz = 50): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 24, padding: "14px 30px", border: `5px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)" });
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) {
    const L = E(0) - S(0);
    out.push(<div key="cal" style={{ position: "absolute", top: 500, left: 40, right: 40, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        {DAYS.map((d, i) => { const on = i === 1; const k = pop(t, S(0) + 0.2 + i * 0.08, 0.35); const g = on ? tw(t, S(0) + 1.0, S(0) + 1.5) : 0;
          return <div key={i} style={{ width: 124, padding: "14px 0", borderRadius: 18, border: `4px solid ${on && g > 0.5 ? GOLD : INK}`, background: on ? `rgba(255,209,102,${0.25 + 0.75 * g})` : "rgba(20,10,4,0.75)", color: on && g > 0.5 ? INK : "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 34, transform: `scale(${k * (1 + 0.15 * g)})`, boxShadow: on ? `0 0 ${40 * g}px ${GOLD}` : "none" }}>{d}</div>; })}
      </div>
      <div style={{ marginTop: 34, ...chip("rgba(20,10,4,0.85)", "#fff", 62), border: `4px solid ${GOLD}`, transform: `scale(${pop(t, S(0) + L * 0.55, 0.45)})` }}>ITNA <span style={{ color: GOLD }}>KHAAS</span> KYUN? 🤔</div>
    </div>);
  }
  if (idx === 1) out.push(<div key="q" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip("rgba(255,245,230,0.95)", INK, 52), transform: `scale(${pop(t, S(1) + (E(1) - S(1)) * 0.6, 0.45)})` }}>🌙 SAWAAL: PEER KA ROZA?</div>
  </div>);
  if (idx === 2) {
    const p = pop(t, S(2) - 0.1, 0.5);
    const k = tw(t, S(2) + 0.1, S(2) + 0.9);
    out.push(<div key="hadith" style={{ position: "absolute", top: 400, left: 40, right: 40, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
      <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "26px 24px 18px", border: `3px solid ${GOLD}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 58, lineHeight: 1.7, color: GOLD, direction: "rtl", textAlign: "center", opacity: k }}>ذَاكَ يَوْمٌ وُلِدْتُ فِيهِ<br />وَيَوْمٌ بُعِثْتُ أَوْ أُنْزِلَ عَلَيَّ فِيهِ</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 30, color: "#fff", textAlign: "center", marginTop: 8, lineHeight: 1.35 }}>"Yeh woh din hai jis din meri wiladat hui, aur jis din mujh par wahi utri."</div>
        <div style={{ marginTop: 12, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.08em", color: GOLD }}>SAHIH MUSLIM 1162 · ABU QATADA ANSARI RADI ALLAHU ANHU</div>
      </div>
    </div>);
  }
  if (idx === 3) {
    const L = E(3) - S(3);
    out.push(<div key="two" style={{ position: "absolute", top: 500, left: 80, right: 80, textAlign: "center" }}>
      <div style={{ ...chip("#fff3d6", INK, 50), transform: `translateX(${(1 - pop(t, S(3) + 0.2, 0.45)) * -900}px)` }}>🌟 WILADAT KA DIN</div>
      <div style={{ marginTop: 22 }}><div style={{ ...chip(GOLD, INK, 50), transform: `translateX(${(1 - pop(t, S(3) + L * 0.45, 0.45)) * 900}px)` }}>🍽️ ROZA</div>
        <span style={{ display: "inline-block", width: 20 }} />
        <div style={{ ...chip(GREEN, "#fff", 50), transform: `translateX(${(1 - pop(t, S(3) + L * 0.65, 0.45)) * 900}px)` }}>🤲 SHUKR</div></div>
    </div>);
  }
  if (idx === 4) {
    const L = E(4) - S(4);
    out.push(<div key="amal" style={{ position: "absolute", top: 500, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...chip("rgba(255,245,230,0.95)", INK, 54), transform: `scale(${pop(t, S(4) + 0.2, 0.45)})` }}>🍽️ PEER KA ROZA</div>
      <div style={{ marginTop: 22 }}><div style={{ ...chip(GOLD, INK, 54), transform: `scale(${pop(t, S(4) + L * 0.55, 0.45)})` }}>📿 KASRAT SE DUROOD</div></div>
    </div>);
  }
  if (idx === 5) out.push(<div key="cm" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(5) + 0.2, 0.45)})` }}>
    <div style={{ ...chip(GREEN, "#fff", 54) }}>💬 COMMENT: DUROOD SHAREEF</div>
    <div style={{ marginTop: 18, fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 64, color: GOLD, direction: "rtl", textShadow: "0 4px 14px rgba(0,0,0,0.8)" }}>صلی اللہ علیہ وآلہ وسلم</div>
  </div>);
  if (idx === 6) out.push(<div key="share" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(6) + 0.2, 0.5)})` }}>
    <div style={{ ...chip(GOLD, INK, 56) }}>SHARE = ONE MORE SADQAH</div>
  </div>);
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1109sadqah-mix.m4a",
  imgDir: "d1109",
  logo: "day1/one-more-sadqah.png",
  brand: "ONE MORE SADQAH",
  keyword: /peer|khaas|roze?a?|wiladat|wahi|shukr|durood|shareef|sadqah/i,
  particles: (c) => (c.idx >= 2 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx === 2 || c.idx === 3 ? 1330 : 1180),
  captionSize: 70,
  shakeAt: [2],
  shots: [
    { img: "s_suhoor.jpg", from: 0, to: 1, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.55 },
    { img: "dome_n1.jpg", from: 1, to: 3, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.45, vertical: true },
    { img: "s_hands.jpg", from: 3, to: 4, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_durood.jpg", from: 4, to: 5, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_phone.jpg", from: 5, to: 6, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_durood.jpg", from: 6, to: 999, z0: 1.2, z1: 1.08, fx0: 0.6, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1109Sadqah: React.FC = () => <HouseShort cfg={CFG} />;
