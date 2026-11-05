import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1105kids-timing.json";

/* Islam for Little Ones, 5 Nov 2026: "Say thank you", Jami' at-Tirmidhi 1954 (Abu Huraira Radi Allahu Anhu; Tirmidhi: Hasan Sahih):
   "Whoever does not thank people does not thank Allah." Checked on sunnah.com the same day. Made for Kids. Gentle and bright.
   People faceless (back views only); the Prophet Sallallahu Alaihi Wa Alihi Wasallam is never shown. Masjid-e-Nabawi shot is a REAL Pixabay frame. */
const TM = data as unknown as Timing;
export const D1105_KIDS_DUR = houseDur(TM);
const PLACE = ["GUESS!", "THE WORDS", "A HADITH", "A HADITH", "AT HOME", "WITH FRIENDS", "SAY IT TOO", "THANK ALLAH", "YOUR TURN"];
const SKY = "#4cc9f0", PINK = "#ff8fab", LEAF = "#7bd389";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="DAY 7 · LESSON" big={<>THANK YOU</>} place={PLACE[c.idx] || ""} tag="LESSON 7" tagBg={LEAF} tagFg={INK} />;

const Bubble: React.FC<{ t: number; at: number; txt: React.ReactNode; col: string; top: number; left?: number; right?: number; size?: number }> = ({ t, at, txt, col, top, left, right, size = 60 }) => {
  const p = pop(t, at, 0.5);
  return <div style={{ position: "absolute", top, left, right, transform: `scale(${p})`, transformOrigin: left !== undefined ? "left bottom" : "right bottom" }}>
    <div style={{ background: "#fff", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: size, borderRadius: 40, padding: "22px 36px", border: `6px solid ${col}`, boxShadow: "0 10px 0 rgba(0,0,0,0.18)" }}>{txt}</div>
  </div>;
};

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<Bubble key="a" t={t} at={S(0) + 0.2} txt="2 LITTLE WORDS? 🤔" col={SKY} top={560} left={80} size={70} />);
  if (idx === 1) {
    const p = pop(t, S(1), 0.5);
    out.push(<div key="ty" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${p}) rotate(${-4 * p}deg)` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 150, lineHeight: 1, color: GOLD, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>THANK<br />YOU!</div>
    </div>);
  }
  if (idx === 3) {
    const p = pop(t, S(3) - 0.1, 0.5);
    out.push(<div key="ref" style={{ position: "absolute", top: 520, left: 60, right: 60, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ background: "rgba(255,252,240,0.96)", borderRadius: 30, padding: "22px 30px", border: `6px solid ${GOLD}`, boxShadow: "0 14px 0 rgba(0,0,0,0.15)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 64, color: "#b5651d", direction: "rtl", lineHeight: 1.5 }}>مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 40, color: INK, lineHeight: 1.2 }}>THANK PEOPLE = <span style={{ color: "#b5651d" }}>THANK ALLAH</span></div>
        <div style={{ marginTop: 8, fontSize: 24, letterSpacing: "0.1em", color: "#b5651d", fontFamily: MONT, fontWeight: 800 }}>📖 JAMI' AT-TIRMIDHI 1954</div>
      </div>
    </div>);
  }
  if (idx === 4) out.push(<Bubble key="m" t={t} at={S(4) + 0.9} txt="🍲 THANK YOU, MUMMY!" col={PINK} top={560} right={60} size={60} />);
  if (idx === 5) out.push(<Bubble key="f" t={t} at={S(5) + 0.9} txt="🚗 THANK YOU, FRIEND!" col={SKY} top={560} left={60} size={60} />);
  if (idx === 6) {
    const p = pop(t, S(6) + 0.4, 0.5);
    out.push(<div key="jz" style={{ position: "absolute", top: 520, left: 70, right: 70, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ background: LEAF, borderRadius: 30, padding: "18px 26px", border: `6px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.2)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 70, color: INK, direction: "rtl", lineHeight: 1.4 }}>جَزَاكَ اللّٰهُ خَيْرًا</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 48, color: INK }}>JAZAK ALLAHU KHAYRAN</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 30, color: INK, opacity: pop(t, S(6) + 2.2, 0.4) }}>May Allah reward you with good 🌟</div>
      </div>
    </div>);
  }
  if (idx === 7) out.push(<Bubble key="h" t={t} at={S(7) + 0.3} txt={<>🤲 ALHAMDULILLAH!</>} col={GOLD} top={560} left={90} size={66} />);
  if (idx === 8) {
    const a = S(8);
    const opts: [string, string][] = [["👩 MUMMY", PINK], ["🧒 A FRIEND", SKY], ["👨‍🏫 MY TEACHER", GOLD]];
    out.push(<div key="end" style={{ position: "absolute", left: 120, right: 120, top: 470 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>TODAY I WILL THANK...</div>
      {opts.map(([s, col], i) => <div key={i} style={{ marginTop: 18, background: col, borderRadius: 22, padding: "14px 24px", border: `4px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 48, color: INK, textAlign: "center", transform: `translateX(${(1 - pop(t, a + 0.6 + i * 0.35, 0.4)) * 700}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>{s}</div>)}
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1105kids-mix.m4a",
  imgDir: "d1105",
  logo: "day1/islam-for-little-ones.png",
  brand: "ISLAM FOR LITTLE ONES",
  keyword: /thank|smile|words|allah|mummy|food|friend|toy|jazak|reward|alhamdulillah|today|people/i,
  particles: () => "sparkle",
  bright: true,
  captionTop: (c) => (c.idx === 3 || c.idx === 6 ? 1260 : 1180),
  captionSize: 74,
  shots: [
    { img: "k7_hearts.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k7_gift.jpg", from: 1, to: 2, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_real_b.jpg", from: 2, to: 3, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k7_garden.jpg", from: 3, to: 4, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k7_food.jpg", from: 4, to: 5, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k7_toy.jpg", from: 5, to: 6, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k7_hearts.jpg", from: 6, to: 7, z0: 1.0, z1: 1.12, fx0: 0.4, fy0: 0.5, fx1: 0.6, fy1: 0.5 },
    { img: "k7_dua.jpg", from: 7, to: 8, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k7_garden.jpg", from: 8, to: 999, z0: 1.0, z1: 1.1, fx0: 0.55, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1105Kids: React.FC = () => <HouseShort cfg={CFG} />;
