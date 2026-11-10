import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1110sadqah-timing.json";

/* One More Sadqah, Short 12 (Tue 10 Nov 2026): "Thoda magar roz", Sahih Muslim 783b (Sayyida Aisha Radi Allahu Anha):
   "The acts most pleasing to Allah are those which are done continuously, even if they are small." (أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ تَعَالَى أَدْوَمُهَا وَإِنْ قَلَّ)
   Opened on sunnah.com the same day. Never depicted; no people at all. Masjid-e-Nabawi shot is a REAL Pixabay frame (198164), never AI. */
const TM = data as unknown as Timing;
export const D1110_SADQAH_DUR = houseDur(TM);
const PLACE = ["SAWAAL", "HADITH", "HADITH", "MATLAB", "ROZ KA AMAL", "COMMENT", "ONE MORE SADQAH"];
const GREEN = "#2a9d8f", RED = "#e63946";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="SHORT 12" big={<>ROZ</>} place={PLACE[c.idx] || ""} tag="MUSLIM 783" tagBg={GOLD} tagFg={INK} />;
const chip = (bg: string, col: string, sz = 50): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 24, padding: "14px 30px", border: `5px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)" });

/* 7-day streak row: ticks pop one by one */
const Streak: React.FC<{ t: number; a: number; on: boolean[]; col: string }> = ({ t, a, on, col }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
    {on.map((x, i) => <div key={i} style={{ width: 112, height: 112, borderRadius: 20, border: `5px solid ${INK}`, background: x ? col : "rgba(20,10,4,0.75)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, transform: `scale(${pop(t, a + i * 0.15, 0.3)})` }}>{x ? "✔" : "✖"}</div>)}
  </div>
);

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const L = (i: number) => E(i) - S(i);
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="vs" style={{ position: "absolute", top: 480, left: 40, right: 40, textAlign: "center" }}>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
      <div style={{ ...chip("rgba(20,10,4,0.85)", "#fff", 54), border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(0) + 0.1, 0.4)})` }}>⏳ 1 GHANTA</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 60, color: GOLD, textShadow: "0 3px 10px #000", transform: `scale(${pop(t, S(0) + L(0) * 0.3, 0.4)})` }}>VS</div>
      <div style={{ ...chip(GOLD, INK, 54), transform: `scale(${pop(t, S(0) + L(0) * 0.35, 0.4)})` }}>⏱️ 2 MINUTE</div>
    </div>
    <div style={{ marginTop: 34, ...chip("rgba(255,245,230,0.95)", INK, 56), transform: `scale(${pop(t, S(0) + L(0) * 0.65, 0.45)})` }}>ALLAH KO KYA PASAND? 🤔</div>
  </div>);
  if (idx === 1) out.push(<div key="nar" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip("rgba(255,245,230,0.95)", INK, 44), transform: `scale(${pop(t, S(1) + 0.2, 0.45)})` }}>HAZRAT AISHA <span style={{ color: "#b5651d" }}>RADI ALLAHU ANHA</span></div>
  </div>);
  if (idx === 2) {
    const p = pop(t, S(2) - 0.1, 0.5), k = tw(t, S(2) + 0.1, S(2) + 0.9);
    out.push(<div key="hadith" style={{ position: "absolute", top: 420, left: 40, right: 40, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
      <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "28px 24px 20px", border: `3px solid ${GOLD}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 64, lineHeight: 1.7, color: GOLD, direction: "rtl", textAlign: "center", opacity: k }}>أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ تَعَالَى<br />أَدْوَمُهَا وَإِنْ قَلَّ</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 32, color: "#fff", textAlign: "center", marginTop: 8, lineHeight: 1.35 }}>"Allah ko sab se pyare amal woh hain jo hamesha kiye jayen, chahe thode hon."</div>
        <div style={{ marginTop: 12, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.08em", color: GOLD }}>SAHIH MUSLIM 783 · HAZRAT AISHA RADI ALLAHU ANHA</div>
      </div>
    </div>);
  }
  if (idx === 3) {
    const sw = tw(t, S(3) + L(3) * 0.5, S(3) + L(3) * 0.58);
    out.push(<div key="cmp" style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ opacity: 1 - 0.55 * sw }}>
        <div style={{ ...chip(RED, "#fff", 46), marginBottom: 16, transform: `scale(${pop(t, S(3) + 0.1, 0.4)})` }}>❌ EK DIN BOHAT, PHIR BAS</div>
        <Streak t={t} a={S(3) + 0.4} on={[true, false, false, false, false, false, false]} col={RED} />
      </div>
      <div style={{ marginTop: 40, opacity: sw }}>
        <div style={{ ...chip(GREEN, "#fff", 46), marginBottom: 16 }}>✅ THODA, MAGAR ROZ</div>
        <Streak t={t} a={S(3) + L(3) * 0.55} on={[true, true, true, true, true, true, true]} col={GREEN} />
      </div>
    </div>);
  }
  if (idx === 4) {
    const items = ["🧎 2 RAKAT NAFL", "📖 1 SAFHA QURAN", "🪙 1 CHHOTA SADQAH"];
    out.push(<div key="amal" style={{ position: "absolute", top: 480, left: 0, right: 0, textAlign: "center" }}>
      {items.map((s, i) => <div key={i} style={{ marginTop: i ? 22 : 0 }}><div style={{ ...chip(i === 1 ? GOLD : "rgba(255,245,230,0.95)", INK, 54), transform: `translateX(${(1 - pop(t, S(4) + L(4) * (0.05 + i * 0.3), 0.45)) * (i % 2 ? 900 : -900)}px)` }}>ROZ {s}</div></div>)}
    </div>);
  }
  if (idx === 5) out.push(<div key="cm" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(5) + 0.2, 0.45)})` }}>
    <div style={{ ...chip(GREEN, "#fff", 54) }}>💬 AAPKA ROZ KA 1 AMAL?</div>
  </div>);
  if (idx === 6) out.push(<div key="share" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(6) + 0.2, 0.5)})` }}>
    <div style={{ ...chip(GOLD, INK, 56) }}>SHARE = ONE MORE SADQAH</div>
  </div>);
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1110sadqah-mix.m4a",
  imgDir: "d1110",
  logo: "day1/one-more-sadqah.png",
  brand: "ONE MORE SADQAH",
  keyword: /roz|ghanta|minute|pasand|aisha|pyare|amal|hamesha|thode|thoda|nafl|quran|sadqah/i,
  particles: (c) => (c.idx >= 2 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx === 2 || c.idx === 3 ? 1360 : 1180),
  captionSize: 70,
  shakeAt: [2],
  shots: [
    { img: "s_drops.jpg", from: 0, to: 1, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.55 },
    { img: "dome_a1.jpg", from: 1, to: 3, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s_drops.jpg", from: 3, to: 4, z0: 1.2, z1: 1.05, fx0: 0.5, fy0: 0.6, fx1: 0.5, fy1: 0.5 },
    { img: "s_mat.jpg", from: 4, to: 5, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_quran.jpg", from: 5, to: 6, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_coin.jpg", from: 6, to: 999, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1110Sadqah: React.FC = () => <HouseShort cfg={CFG} />;
