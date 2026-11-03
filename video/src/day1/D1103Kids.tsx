import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1103kids-timing.json";

/* Islam for Little Ones, 3 Nov 2026: "What do we say before we sleep?", Sahih al-Bukhari 6324 (Hudhaifa Radi Allahu Anhu). Made for Kids.
   Gentle and bright, no scary scenes. Modern generic faceless kids (back views only); the Prophet Sallallahu Alaihi Wa Alihi Wasallam is never shown.
   Masjid-e-Nabawi shot is a REAL Pixabay frame, never AI. */
const TM = data as unknown as Timing;
export const D1103_KIDS_DUR = houseDur(TM);
const PLACE = ["BEDTIME", "A SUNNAH", "NIGHT DUA", "WHAT IT MEANS", "MORNING DUA", "WHAT IT MEANS", "2 DUAS", "PRACTISE", "YOUR TURN"];
const SKY = "#4cc9f0", PINK = "#ff8fab", LEAF = "#7bd389", NIGHT = "#9b8cff";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="DAY 5 · LESSON" big={<>SLEEP</>} place={PLACE[c.idx] || ""} tag="LESSON 5" tagBg={LEAF} tagFg={INK} />;

const Bubble: React.FC<{ t: number; at: number; txt: string; col: string; top: number; left?: number; right?: number; size?: number }> = ({ t, at, txt, col, top, left, right, size = 60 }) => {
  const p = pop(t, at, 0.5);
  return <div style={{ position: "absolute", top, left, right, transform: `scale(${p})`, transformOrigin: left !== undefined ? "left bottom" : "right bottom" }}>
    <div style={{ background: "#fff", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: size, borderRadius: 40, padding: "22px 36px", border: `6px solid ${col}`, boxShadow: "0 10px 0 rgba(0,0,0,0.18)" }}>{txt}</div>
  </div>;
};

type Dua = [string, string, string, string, string];
const NIGHT_DUA: Dua = ["🌙 BEFORE SLEEP", "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", "BISMIKA ALLAHUMMA AMOOTU WA AHYA", "With Your name, O Allah, I sleep and I wake", NIGHT];
const DAY_DUA: Dua = ["☀️ WHEN I WAKE UP", "الْحَمْدُ لِلَّهِ", "ALHAMDU LILLAH", "All praise is for Allah, who woke us up again", GOLD];

const DuaCard: React.FC<{ d: Dua; k: number }> = ({ d, k }) => (
  <div style={{ background: "rgba(255,252,240,0.95)", borderRadius: 30, padding: "20px 26px", border: `6px solid ${d[4]}`, boxShadow: "0 14px 0 rgba(0,0,0,0.15)", textAlign: "center", transform: `scale(${0.8 + 0.2 * k})`, opacity: k }}>
    <div style={{ display: "inline-block", background: d[4], color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 28, borderRadius: 14, padding: "4px 16px" }}>{d[0]}</div>
    <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 70, lineHeight: 1.45, color: "#b5651d", direction: "rtl" }}>{d[1]}</div>
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: d[2].length > 16 ? 36 : 50, color: INK }}>{d[2]}</div>
    <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 26, color: "#6b4b2a" }}>{d[3]}</div>
    <div style={{ marginTop: 8, fontFamily: MONT, fontWeight: 700, fontSize: 20, letterSpacing: "0.1em", color: "#b5651d" }}>SAHIH AL-BUKHARI 6324</div>
  </div>
);

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<Bubble key="a" t={t} at={S(0) + 0.1} txt="YAWN... 😴" col={NIGHT} top={540} left={80} size={88} />);
  if (idx === 2 || idx === 3) out.push(<div key="n" style={{ position: "absolute", top: 500, left: 60, right: 60 }}><DuaCard d={NIGHT_DUA} k={pop(t, S(2) + 0.1, 0.5)} /></div>);
  if (idx === 4 || idx === 5) out.push(<div key="d" style={{ position: "absolute", top: 520, left: 60, right: 60 }}><DuaCard d={DAY_DUA} k={pop(t, S(4) + 0.1, 0.5)} /></div>);
  if (idx === 6) {
    const rows: [string, string][] = [["🌙 NIGHT · BISMIKA ALLAHUMMA", NIGHT], ["☀️ MORNING · ALHAMDU LILLAH", GOLD]];
    out.push(<div key="two" style={{ position: "absolute", top: 540, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      {rows.map(([s, col], i) => <div key={i} style={{ background: col, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 38, borderRadius: 26, padding: "14px 28px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(6) + 0.3 + i * 0.6, 0.45)})`, boxShadow: "0 8px 0 rgba(0,0,0,0.2)" }}>{s}</div>)}
    </div>);
  }
  if (idx === 7) {
    out.push(<Bubble key="p1" t={t} at={S(7) + 0.6} txt="BISMIKA ALLAHUMMA..." col={NIGHT} top={540} left={60} size={56} />);
    out.push(<Bubble key="p2" t={t} at={S(7) + 1.6} txt="...AMOOTU WA AHYA ✨" col={LEAF} top={740} right={60} size={56} />);
  }
  if (idx === 8) {
    const a = S(8);
    const opts: [string, string][] = [["MUM & DAD", SKY], ["BROTHER OR SISTER", PINK], ["GRANDMA & GRANDPA", LEAF]];
    out.push(<div key="end" style={{ position: "absolute", left: 90, right: 90, top: 470 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 66, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>SAY IT TONIGHT WITH...</div>
      {opts.map(([s, col], i) => <div key={i} style={{ marginTop: 18, background: col, borderRadius: 22, padding: "14px 24px", border: `4px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 42, color: INK, textAlign: "center", transform: `translateX(${(1 - pop(t, a + 0.5 + i * 0.25, 0.4)) * 700}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>{s}</div>)}
      <div style={{ marginTop: 22, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.7)" }}>SWEET DREAMS, <span style={{ color: GOLD }}>IN SHA ALLAH!</span></div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1103kids-mix.m4a",
  imgDir: "d1103",
  logo: "day1/islam-for-little-ones.png",
  brand: "ISLAM FOR LITTLE ONES",
  keyword: /bedtime|sleep|bismika|allahumma|ahya|wake|morning|alhamdu|allah|night|dua|practise|tonight/i,
  particles: () => "sparkle",
  bright: true,
  captionTop: (c) => (c.idx >= 2 && c.idx <= 5 ? 1300 : 1180),
  captionSize: 74,
  shots: [
    { img: "k5_window.jpg", from: 0, to: 1, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "dome_real_b.jpg", from: 1, to: 2, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k5_bed.jpg", from: 2, to: 3, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k5_moon.jpg", from: 3, to: 4, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k5_morning.jpg", from: 4, to: 5, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k_bless.jpg", from: 5, to: 6, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_wave.jpg", from: 6, to: 7, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k_home.jpg", from: 7, to: 8, z0: 1.0, z1: 1.12, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k5_siblings.jpg", from: 8, to: 999, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1103Kids: React.FC = () => <HouseShort cfg={CFG} />;
