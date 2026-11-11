import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1111sadqah-timing.json";

/* One More Sadqah, Short 13 (Wed 11 Nov 2026): "Roz subah do farishton ki dua", Sahih al-Bukhari 1442 (also Muslim 1010),
   Hazrat Abu Huraira Radi Allahu Anhu: "Every day two angels come down; one says: O Allah, give the one who spends a replacement;
   the other says: O Allah, give the one who withholds destruction." (اللَّهُمَّ أَعْطِ مُنْفِقًا خَلَفًا / اللَّهُمَّ أَعْطِ مُمْسِكًا تَلَفًا)
   Angels are never depicted: only beams of light in the sky. No faces (hands only). Masjid-e-Nabawi shot is a REAL Pixabay frame, never AI. */
const TM = data as unknown as Timing;
export const D1111_SADQAH_DUR = houseDur(TM);
const PLACE = ["SAWAAL", "HADITH", "PEHLI DUA", "DOOSRI DUA", "AAJ KA AMAL", "COMMENT", "ONE MORE SADQAH"];
const GREEN = "#2a9d8f", RED = "#e63946";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="SHORT 13" big={<>SUBAH</>} place={PLACE[c.idx] || ""} tag="BUKHARI 1442" tagBg={GOLD} tagFg={INK} />;
const chip = (bg: string, col: string, sz = 50): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 24, padding: "14px 30px", border: `5px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)" });

const HadithCard: React.FC<{ t: number; a: number; ar: string; ro: string; col: string; tag: string }> = ({ t, a, ar, ro, col, tag }) => {
  const p = pop(t, a - 0.1, 0.5), k = tw(t, a + 0.1, a + 0.9);
  return (
    <div style={{ position: "absolute", top: 430, left: 40, right: 40, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}><div style={{ ...chip(col, "#fff", 40) }}>{tag}</div></div>
      <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "28px 24px 20px", border: `3px solid ${GOLD}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 70, lineHeight: 1.6, color: GOLD, direction: "rtl", textAlign: "center", opacity: k }}>{ar}</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 34, color: "#fff", textAlign: "center", marginTop: 8, lineHeight: 1.35 }}>{ro}</div>
        <div style={{ marginTop: 12, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.08em", color: GOLD }}>SAHIH AL-BUKHARI 1442 · HAZRAT ABU HURAIRA RADI ALLAHU ANHU</div>
      </div>
    </div>
  );
};

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const L = (i: number) => E(i) - S(i);
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="q" style={{ position: "absolute", top: 500, left: 40, right: 40, textAlign: "center" }}>
    <div style={{ ...chip("rgba(20,10,4,0.85)", "#fff", 56), border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(0) + 0.1, 0.4)})` }}>🌅 ROZ SUBAH</div>
    <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 30 }}>
      {[0, 1].map((i) => <div key={i} style={{ width: 120, height: 220, borderRadius: 60, background: "linear-gradient(180deg, rgba(255,255,240,0.95), rgba(255,209,102,0))", boxShadow: "0 0 60px rgba(255,240,200,0.8)", opacity: tw(t, S(0) + L(0) * (0.2 + i * 0.12), S(0) + L(0) * (0.4 + i * 0.12)) }} />)}
    </div>
    <div style={{ marginTop: 28, ...chip(GOLD, INK, 52), transform: `scale(${pop(t, S(0) + L(0) * 0.6, 0.45)})` }}>2 DUAYEIN · KAUN SI? ❓</div>
  </div>);
  if (idx === 1) out.push(<div key="nar" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip("rgba(255,245,230,0.95)", INK, 44), transform: `scale(${pop(t, S(1) + 0.2, 0.45)})` }}>HAZRAT ABU HURAIRA <span style={{ color: "#b5651d" }}>RADI ALLAHU ANHU</span></div>
  </div>);
  if (idx === 2) out.push(<HadithCard key="h1" t={t} a={S(2)} ar="اللَّهُمَّ أَعْطِ مُنْفِقًا خَلَفًا" ro={'"Aye Allah! Kharch karne wale ko us ka badla ata farma."'} col={GREEN} tag="✅ PEHLI DUA" />);
  if (idx === 3) out.push(<HadithCard key="h2" t={t} a={S(3)} ar="اللَّهُمَّ أَعْطِ مُمْسِكًا تَلَفًا" ro={'"Aye Allah! Rok kar rakhne wale ka maal barbaad kar de."'} col={RED} tag="⚠️ DOOSRI DUA" />);
  if (idx === 4) {
    const sw = tw(t, S(4) + L(4) * 0.45, S(4) + L(4) * 0.55);
    out.push(<div key="pick" style={{ position: "absolute", top: 480, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        <div style={{ ...chip(GREEN, "#fff", 46), transform: `scale(${1 + 0.12 * sw})` }}>🤲 KHARCH KARNE WALA</div>
      </div>
      <div style={{ marginTop: 20, opacity: 1 - 0.6 * sw }}><div style={{ ...chip("rgba(20,10,4,0.85)", "#fff", 40), textDecoration: sw > 0.5 ? "line-through" : "none" }}>🔒 ROK KAR RAKHNE WALA</div></div>
      <div style={{ marginTop: 40, ...chip(GOLD, INK, 60), transform: `scale(${pop(t, S(4) + L(4) * 0.55, 0.45)}) rotate(-2deg)` }}>🪙 CHAHE 10 RUPAY · AAJ!</div>
    </div>);
  }
  if (idx === 5) out.push(<div key="cm" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(5) + 0.2, 0.45)})` }}>
    <div style={{ ...chip(GREEN, "#fff", 54) }}>💬 "AAJ MAINE SADQAH DIYA!"</div>
  </div>);
  if (idx === 6) out.push(<div key="share" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(6) + 0.2, 0.5)})` }}>
    <div style={{ ...chip(GOLD, INK, 56) }}>SHARE = ONE MORE SADQAH</div>
  </div>);
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1111sadqah-mix.m4a",
  imgDir: "d1111",
  logo: "day1/one-more-sadqah.png",
  brand: "ONE MORE SADQAH",
  keyword: /subah|farishte|dua|huraira|kharch|badla|rok|barbaad|aaj|rupay|sadqah/i,
  particles: (c) => (c.idx >= 2 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx === 2 || c.idx === 3 ? 1380 : 1180),
  captionSize: 70,
  shakeAt: [3],
  shots: [
    { img: "s_angels_sky.jpg", from: 0, to: 1, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.4, fx1: 0.5, fy1: 0.55 },
    { img: "dome_s.jpg", from: 1, to: 2, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s_spend.jpg", from: 2, to: 3, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_lock.jpg", from: 3, to: 4, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_box.jpg", from: 4, to: 5, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_fajr.jpg", from: 5, to: 999, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1111Sadqah: React.FC = () => <HouseShort cfg={CFG} />;
