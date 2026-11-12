import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1112sadqah-timing.json";

/* One More Sadqah, Short 14 (Thu 12 Nov 2026): "Achhi baat kaho ya khamosh raho", Sahih al-Bukhari 6475,
   Hazrat Abu Huraira Radi Allahu Anhu: "Whoever believes in Allah and the Last Day should speak good or keep silent;
   and whoever believes in Allah and the Last Day should not hurt his neighbour; and whoever believes in Allah and the
   Last Day should honour his guest." (مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ)
   No faces (back views, hands only). Masjid-e-Nabawi shot is a REAL Pixabay frame, never AI. */
const TM = data as unknown as Timing;
export const D1112_SADQAH_DUR = houseDur(TM);
const PLACE = ["SAWAAL", "HADITH", "ZABAAN", "PADOSI · MEHMAAN", "AAJ KA AMAL", "COMMENT", "ONE MORE SADQAH"];
const GREEN = "#2a9d8f", BLUE = "#3a4a8a";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="SHORT 14" big={<>ZABAAN</>} place={PLACE[c.idx] || ""} tag="BUKHARI 6475" tagBg={GOLD} tagFg={INK} />;
const chip = (bg: string, col: string, sz = 50): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 24, padding: "14px 30px", border: `5px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)" });

const HadithCard: React.FC<{ t: number; a: number; ar: string; ro: string; col: string; tag: string }> = ({ t, a, ar, ro, col, tag }) => {
  const p = pop(t, a - 0.1, 0.5), k = tw(t, a + 0.1, a + 0.9);
  return (
    <div style={{ position: "absolute", top: 410, left: 40, right: 40, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}><div style={{ ...chip(col, "#fff", 40) }}>{tag}</div></div>
      <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "28px 24px 20px", border: `3px solid ${GOLD}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 62, lineHeight: 1.6, color: GOLD, direction: "rtl", textAlign: "center", opacity: k }}>{ar}</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 34, color: "#fff", textAlign: "center", marginTop: 8, lineHeight: 1.35 }}>{ro}</div>
        <div style={{ marginTop: 12, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.08em", color: GOLD }}>SAHIH AL-BUKHARI 6475 · HAZRAT ABU HURAIRA RADI ALLAHU ANHU</div>
      </div>
    </div>
  );
};

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const L = (i: number) => E(i) - S(i);
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="q" style={{ position: "absolute", top: 520, left: 40, right: 40, textAlign: "center" }}>
    <div style={{ ...chip("rgba(20,10,4,0.85)", "#fff", 56), border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(0) + 0.1, 0.4)})` }}>💭 EK CHHOTI SI CHEEZ</div>
    <div style={{ marginTop: 30, ...chip(GOLD, INK, 52), transform: `scale(${pop(t, S(0) + L(0) * 0.45, 0.45)})` }}>= IMAAN KI PEHCHAAN</div>
    <div style={{ marginTop: 30, fontSize: 120, transform: `scale(${pop(t, S(0) + L(0) * 0.75, 0.45)})` }}>❓</div>
  </div>);
  if (idx === 1) out.push(<div key="nar" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip("rgba(255,245,230,0.95)", INK, 44), transform: `scale(${pop(t, S(1) + 0.2, 0.45)})` }}>HAZRAT ABU HURAIRA <span style={{ color: "#b5651d" }}>RADI ALLAHU ANHU</span></div>
  </div>);
  if (idx === 2) {
    const sw = tw(t, S(2) + L(2) * 0.6, S(2) + L(2) * 0.75);
    out.push(<HadithCard key="h1" t={t} a={S(2)} ar="فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ" ro={'"...woh achhi baat kahe, ya khamosh rahe."'} col={GREEN} tag="💬 ZABAAN" />);
    out.push(<div key="ch" style={{ position: "absolute", top: 1010, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 24 }}>
      <div style={{ ...chip(GREEN, "#fff", 44), transform: `scale(${pop(t, S(2) + L(2) * 0.4, 0.4)})` }}>✅ ACHHI BAAT</div>
      <div style={{ ...chip(BLUE, "#fff", 44), transform: `scale(${pop(t, S(2) + L(2) * 0.7, 0.4) * (1 + 0.06 * sw)})` }}>🤐 YA KHAMOSHI</div>
    </div>);
  }
  if (idx === 3) out.push(<div key="h2" style={{ position: "absolute", top: 470, left: 60, right: 60, textAlign: "center" }}>
    <div style={{ ...chip(GOLD, INK, 40), marginBottom: 26, transform: `scale(${pop(t, S(3), 0.4)})` }}>SAME HADITH · AUR DO BAATEIN</div>
    <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "24px", border: `3px solid ${GOLD}`, transform: `scale(${pop(t, S(3) + L(3) * 0.1, 0.45)})` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 48, color: "#fff" }}>🏠 PADOSI KO</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 48, color: GOLD }}>TAKLEEF NA DO</div>
    </div>
    <div style={{ marginTop: 22, background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "24px", border: `3px solid ${GOLD}`, transform: `scale(${pop(t, S(3) + L(3) * 0.55, 0.45)})` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 48, color: "#fff" }}>🫖 MEHMAAN KI</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 48, color: GOLD }}>IZZAT KARO</div>
    </div>
  </div>);
  if (idx === 4) {
    const k = tw(t, S(4) + L(4) * 0.2, S(4) + L(4) * 0.45);
    out.push(<div key="pause" style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ ...chip("rgba(20,10,4,0.85)", "#fff", 50), border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(4) + 0.1, 0.4)})` }}>⏸ BOLNE SE PEHLE: 1 LAMHA</div>
      <div style={{ margin: "34px auto 0", width: 240, height: 240, borderRadius: 120, border: `10px solid ${GOLD}`, background: `conic-gradient(${GOLD} ${k * 360}deg, rgba(20,10,4,0.75) 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 170, height: 170, borderRadius: 85, background: "rgba(20,10,4,0.92)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: "#fff" }}>ACHHI?</div>
      </div>
      <div style={{ marginTop: 34, display: "flex", justifyContent: "center", gap: 20 }}>
        <div style={{ ...chip(GREEN, "#fff", 42), transform: `scale(${pop(t, S(4) + L(4) * 0.55, 0.4)})` }}>HAAN → BOLO</div>
        <div style={{ ...chip(BLUE, "#fff", 42), transform: `scale(${pop(t, S(4) + L(4) * 0.75, 0.4)})` }}>NAHIN → KHAMOSHI</div>
      </div>
    </div>);
  }
  if (idx === 5) out.push(<div key="cm" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(5) + 0.2, 0.45)})` }}>
    <div style={{ ...chip(GREEN, "#fff", 48) }}>💬 "AAJ SIRF ACHHI BAAT!"</div>
  </div>);
  if (idx === 6) out.push(<div key="share" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(6) + 0.2, 0.5)})` }}>
    <div style={{ ...chip(GOLD, INK, 56) }}>SHARE = ONE MORE SADQAH</div>
  </div>);
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1112sadqah-mix.m4a",
  imgDir: "d1112",
  logo: "day1/one-more-sadqah.png",
  brand: "ONE MORE SADQAH",
  keyword: /imaan|huraira|achhi|khamosh|padosi|mehmaan|izzat|lamha|khamoshi|sadqah/i,
  particles: (c) => (c.idx >= 2 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx === 2 ? 1200 : c.idx === 3 || c.idx === 4 ? 1330 : 1180),
  captionSize: 68,
  shakeAt: [2],
  shots: [
    { img: "s_lamp.jpg", from: 0, to: 1, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.45, fx1: 0.5, fy1: 0.55 },
    { img: "dome_s.jpg", from: 1, to: 2, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s_quiet.jpg", from: 2, to: 3, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_neighbors.jpg", from: 3, to: 4, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_pause.jpg", from: 4, to: 5, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_guest.jpg", from: 5, to: 999, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1112Sadqah: React.FC = () => <HouseShort cfg={CFG} />;
