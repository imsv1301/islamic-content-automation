import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1107kids-timing.json";

/* Islam for Little Ones, Sat 7 Nov 2026: "The man who moved a thorny branch", Sahih al-Bukhari 652 (Abu Huraira Radi Allahu Anhu):
   "While a man was going on a way, he saw a thorny branch and removed it from the way; Allah was pleased with his action and forgave him."
   Checked on sunnah.com listings the same day. Made for Kids. Gentle and bright.
   People faceless (back views only); the Prophet Sallallahu Alaihi Wa Alihi Wasallam is never shown. Masjid-e-Nabawi shot is a REAL Pixabay frame. */
const TM = data as unknown as Timing;
export const D1107_KIDS_DUR = houseDur(TM);
const PLACE = ["GUESS!", "A TRUE STORY", "THE PATH", "UH-OH", "OUCH!", "GOOD DEED", "ALLAH IS PLEASED", "YOUR TURN", "TODAY"];
const SKY = "#4cc9f0", PINK = "#ff8fab", LEAF = "#7bd389";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="DAY 9 · LESSON" big={<>KINDNESS</>} place={PLACE[c.idx] || ""} tag="LESSON 9" tagBg={LEAF} tagFg={INK} />;

const bubble = (bg: string, col: string, bd: string, sz: number): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 34, padding: "16px 32px", border: `6px solid ${bd}`, boxShadow: "0 10px 0 rgba(0,0,0,0.18)" });
const CHIPS: [string, string][] = [["🪨 STONE", SKY], ["🧸 TOY", PINK], ["🍌 PEEL", GOLD]];

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="a" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(0) + 0.2, 0.5)})` }}>
    <div style={bubble("#fff", INK, SKY, 66)}>A TINY GOOD DEED? 🤔</div>
  </div>);
  if (idx === 2) out.push(<div key="st" style={{ position: "absolute", top: 580, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(2) + 0.2, 0.45)})` }}>
    <div style={bubble("rgba(255,252,240,0.96)", INK, GOLD, 52)}>📖 LONG, LONG AGO...</div>
  </div>);
  if (idx === 3) out.push(<div key="br" style={{ position: "absolute", top: 580, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(3) + 0.6, 0.45)}) rotate(-2deg)` }}>
    <div style={bubble(LEAF, INK, INK, 58)}>🌿 A PRICKLY BRANCH!</div>
  </div>);
  if (idx === 4) out.push(<div key="ou" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(4) + 0.1, 0.5)}) rotate(${Math.sin(t * 20) * 3}deg)` }}>
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 170, lineHeight: 1, color: PINK, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>OUCH!</div>
    <div style={{ marginTop: 14 }}><div style={bubble("#fff", INK, PINK, 44)}>⚠️ SOMEONE COULD GET HURT</div></div>
  </div>);
  if (idx === 5) out.push(<div key="mv" style={{ position: "absolute", top: 580, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(5) + 1.2, 0.45)})` }}>
    <div style={bubble(GOLD, INK, INK, 58)}>✋ MOVED IT AWAY ✅</div>
  </div>);
  if (idx === 6) {
    const p = pop(t, S(6) - 0.1, 0.5);
    out.push(<div key="ref" style={{ position: "absolute", top: 500, left: 60, right: 60, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ background: "rgba(255,252,240,0.96)", borderRadius: 30, padding: "22px 30px", border: `6px solid ${GOLD}`, boxShadow: "0 14px 0 rgba(0,0,0,0.15)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 52, color: "#b5651d", direction: "rtl", lineHeight: 1.5 }}>وَجَدَ غُصْنَ شَوْكٍ عَلَى الطَّرِيقِ فَأَخَّرَهُ فَشَكَرَ اللَّهُ لَهُ فَغَفَرَ لَهُ</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 42, color: INK, lineHeight: 1.2 }}>💛 ALLAH WAS <span style={{ color: "#b5651d" }}>PLEASED</span> &amp; FORGAVE HIM</div>
        <div style={{ marginTop: 8, fontSize: 24, letterSpacing: "0.1em", color: "#b5651d", fontFamily: MONT, fontWeight: 800 }}>📖 SAHIH AL-BUKHARI 652</div>
      </div>
    </div>);
  }
  if (idx === 7) out.push(<div key="chips" style={{ position: "absolute", top: 500, left: 90, right: 90 }}>
    <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 52, color: "#fff", WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill" }}>SEE IT? MOVE IT!</div>
    {CHIPS.map(([s, col], i) => { const k = pop(t, S(7) + 0.5 + i * 0.8, 0.45); return <div key={i} style={{ marginTop: 16, display: "flex", justifyContent: "space-between", background: col, borderRadius: 22, padding: "12px 26px", border: `5px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 48, color: INK, transform: `translateX(${(1 - k) * 800}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}><span>{s}</span><span>➡️ AWAY</span></div>; })}
  </div>);
  if (idx === 8) {
    const a = S(8);
    out.push(<div key="end" style={{ position: "absolute", left: 100, right: 100, top: 500, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>TODAY I WILL MOVE...</div>
      <div style={{ marginTop: 26, ...bubble(GOLD, INK, INK, 58), transform: `scale(${pop(t, a + 1.6, 0.45)}) rotate(-2deg)` }}>🌟 BE A HELPER!</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1107kids-mix.m4a",
  imgDir: "d1107",
  logo: "day1/islam-for-little-ones.png",
  brand: "ISLAM FOR LITTLE ONES",
  keyword: /tiny|happy|story|path|prickly|branch|ouch|hurt|moved?|forgave|allah|stone|toy|today/i,
  particles: () => "sparkle",
  bright: true,
  captionTop: (c) => (c.idx === 6 ? 1280 : c.idx === 7 ? 1300 : 1180),
  captionSize: 74,
  shots: [
    { img: "k9_path.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_real_b.jpg", from: 1, to: 2, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k9_man.jpg", from: 2, to: 3, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k9_branch.jpg", from: 3, to: 4, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k9_branch.jpg", from: 4, to: 5, z0: 1.0, z1: 1.18, fx0: 0.5, fy0: 0.55, fx1: 0.5, fy1: 0.5 },
    { img: "k9_clear.jpg", from: 5, to: 6, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k9_clear.jpg", from: 6, to: 7, z0: 1.0, z1: 1.1, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.5 },
    { img: "k9_stairs.jpg", from: 7, to: 8, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k9_kid.jpg", from: 8, to: 999, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1107Kids: React.FC = () => <HouseShort cfg={CFG} />;
