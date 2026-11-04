import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1104kids-timing.json";

/* Islam for Little Ones, 4 Nov 2026: "The man who gave water to a thirsty dog", Sahih al-Bukhari 2363 (Abu Huraira Radi Allahu Anhu).
   Verified on sunnah.com/bukhari:2363 the same day. Made for Kids. Gentle and bright, no scary scenes. People faceless (back views only);
   the Prophet Sallallahu Alaihi Wa Alihi Wasallam is never shown. Masjid-e-Nabawi shot is a REAL Pixabay frame, never AI. */
const TM = data as unknown as Timing;
export const D1104_KIDS_DUR = houseDur(TM);
const PLACE = ["STORY TIME", "A TRUE STORY", "A HOT DAY", "THE WELL", "THE DOG", "KINDNESS", "THE REWARD", "THE LESSON", "YOUR TURN"];
const SKY = "#4cc9f0", PINK = "#ff8fab", LEAF = "#7bd389";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="DAY 6 · LESSON" big={<>KINDNESS</>} place={PLACE[c.idx] || ""} tag="LESSON 6" tagBg={LEAF} tagFg={INK} />;

const Bubble: React.FC<{ t: number; at: number; txt: string; col: string; top: number; left?: number; right?: number; size?: number }> = ({ t, at, txt, col, top, left, right, size = 60 }) => {
  const p = pop(t, at, 0.5);
  return <div style={{ position: "absolute", top, left, right, transform: `scale(${p})`, transformOrigin: left !== undefined ? "left bottom" : "right bottom" }}>
    <div style={{ background: "#fff", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: size, borderRadius: 40, padding: "22px 36px", border: `6px solid ${col}`, boxShadow: "0 10px 0 rgba(0,0,0,0.18)" }}>{txt}</div>
  </div>;
};

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<Bubble key="a" t={t} at={S(0) + 0.2} txt="A THIRSTY DOG? 🐶" col={SKY} top={560} left={80} size={70} />);
  if (idx === 1) {
    const p = pop(t, S(1) + 0.4, 0.45);
    out.push(<div key="ref" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "rgba(255,252,240,0.95)", borderRadius: 26, padding: "14px 30px", border: `6px solid ${GOLD}`, fontFamily: MONT, fontWeight: 800, fontSize: 40, color: INK }}>📖 A TRUE STORY<div style={{ fontSize: 24, letterSpacing: "0.1em", color: "#b5651d" }}>SAHIH AL-BUKHARI 2363</div></div>
    </div>);
  }
  if (idx === 2) out.push(<Bubble key="h" t={t} at={S(2) + 0.6} txt="☀️ SO HOT!" col={GOLD} top={560} right={80} size={70} />);
  if (idx === 3) out.push(<Bubble key="w" t={t} at={S(3) + 1.0} txt="💧 COOL WATER" col={SKY} top={560} left={80} size={64} />);
  if (idx === 4) out.push(<Bubble key="d" t={t} at={S(4) + 1.0} txt="SO THIRSTY... 🥺" col={PINK} top={560} right={70} size={64} />);
  if (idx === 5) {
    const steps: [string, string][] = [["1 · CLIMB DOWN AGAIN", LEAF], ["2 · FILL THE SHOE 👞💧", SKY], ["3 · GIVE A DRINK 🐶", GOLD]];
    out.push(<div key="st" style={{ position: "absolute", top: 500, left: 70, right: 70 }}>
      {steps.map(([s, col], i) => <div key={i} style={{ marginTop: 16, background: col, borderRadius: 24, padding: "14px 24px", border: `5px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 42, color: INK, transform: `translateX(${(1 - pop(t, S(5) + 0.3 + i * 1.3, 0.4)) * 800}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.2)" }}>{s}</div>)}
    </div>);
  }
  if (idx === 6) {
    const p = pop(t, S(6) + 0.3, 0.5);
    out.push(<div key="f" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "rgba(255,252,240,0.95)", borderRadius: 30, padding: "20px 34px", border: `6px solid ${GOLD}`, boxShadow: "0 14px 0 rgba(0,0,0,0.15)" }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 60, color: INK }}>✨ ALLAH <span style={{ color: "#b5651d" }}>FORGAVE</span> HIM ✨</div>
      </div>
    </div>);
  }
  if (idx === 7) {
    const p = pop(t, S(7) + 0.2, 0.5);
    out.push(<div key="l" style={{ position: "absolute", top: 540, left: 70, right: 70, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ background: LEAF, borderRadius: 30, padding: "18px 26px", border: `6px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.2)", fontFamily: MONT, fontWeight: 800, fontSize: 52, color: INK, lineHeight: 1.15 }}>KIND TO ANIMALS<br />= <span style={{ color: "#fff", WebkitTextStroke: `6px ${INK}`, paintOrder: "stroke fill" }}>REWARD</span> 🌟</div>
    </div>);
  }
  if (idx === 8) {
    const a = S(8);
    const opts: [string, string][] = [["🐱 A CAT", PINK], ["🐦 A BIRD", SKY], ["🐶 A DOG", GOLD]];
    out.push(<div key="end" style={{ position: "absolute", left: 120, right: 120, top: 470 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>BE KIND TODAY TO...</div>
      {opts.map(([s, col], i) => <div key={i} style={{ marginTop: 18, background: col, borderRadius: 22, padding: "14px 24px", border: `4px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 48, color: INK, textAlign: "center", transform: `translateX(${(1 - pop(t, a + 1.0 + i * 0.4, 0.4)) * 700}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>{s}</div>)}
      <div style={{ marginTop: 22, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 38, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.7)" }}>A LITTLE WATER, <span style={{ color: GOLD }}>A BIG REWARD!</span></div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1104kids-mix.m4a",
  imgDir: "d1104",
  logo: "day1/islam-for-little-ones.png",
  brand: "ISLAM FOR LITTLE ONES",
  keyword: /thirsty|dog|story|hot|well|water|shoe|drink|allah|forgave|kind|reward|cat|bird|today/i,
  particles: () => "sparkle",
  bright: true,
  captionTop: (c) => (c.idx === 5 ? 1260 : 1180),
  captionSize: 74,
  shots: [
    { img: "k6_dog.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_real_b.jpg", from: 1, to: 2, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k6_man2.jpg", from: 2, to: 3, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k6_well.jpg", from: 3, to: 4, z0: 1.1, z1: 1.0, fx0: 0.55, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k6_dog.jpg", from: 4, to: 5, z0: 1.0, z1: 1.14, fx0: 0.55, fy0: 0.4, fx1: 0.55, fy1: 0.4 },
    { img: "k6_shoe.jpg", from: 5, to: 6, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k6_drink.jpg", from: 6, to: 7, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k6_light.jpg", from: 7, to: 8, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k6_cat.jpg", from: 8, to: 999, z0: 1.0, z1: 1.1, fx0: 0.55, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1104Kids: React.FC = () => <HouseShort cfg={CFG} />;
