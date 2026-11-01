import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1101kids-timing.json";

/* Islam for Little Ones, 1 Nov 2026: "Spread salam", Sahih Muslim 54 (Abu Hurairah Radi Allahu Anhu). Made for Kids.
   Gentle and bright. A modern generic faceless kid; the Prophet Sallallahu Alaihi Wa Alihi Wasallam, Sahaba and Ahl-e-Bait are never shown. */
const TM = data as unknown as Timing;
export const D1101_KIDS_DUR = houseDur(TM);
const PLACE = ["SCHOOLYARD", "A HADITH", "A HADITH", "THE SECRET", "SAY IT!", "WHAT IT MEANS", "THE ANSWER", "EVERYWHERE", "YOUR TURN"];
const SKY = "#4cc9f0", PINK = "#ff8fab", LEAF = "#7bd389";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="DAY 3 · LESSON" big={<>SALAM</>} place={PLACE[c.idx] || ""} tag="LESSON 3" tagBg={LEAF} tagFg={INK} />;

const Bubble: React.FC<{ t: number; at: number; txt: string; col: string; top: number; left?: number; right?: number }> = ({ t, at, txt, col, top, left, right }) => {
  const p = pop(t, at, 0.5);
  return <div style={{ position: "absolute", top, left, right, transform: `scale(${p})`, transformOrigin: left !== undefined ? "left bottom" : "right bottom" }}>
    <div style={{ background: "#fff", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 60, borderRadius: 40, padding: "22px 36px", border: `6px solid ${col}`, boxShadow: "0 10px 0 rgba(0,0,0,0.18)" }}>{txt}</div>
  </div>;
};

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx >= 2 && idx <= 3) {
    const p = pop(t, S(2) + 0.1, 0.5);
    const k = pop(t, S(3) + 0.05, 0.5);
    out.push(<div key="h" style={{ position: "absolute", top: 500, left: 60, right: 60, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
      <div style={{ background: "rgba(255,252,240,0.94)", borderRadius: 30, padding: "24px 28px", border: `5px solid ${GOLD}`, boxShadow: "0 14px 0 rgba(0,0,0,0.15)", textAlign: "center" }}>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 30, color: "#6b4b2a" }}>Shall I tell you something that will make you love one another?</div>
        <div style={{ marginTop: 10, opacity: k, transform: `scale(${0.8 + 0.2 * k})` }}>
          <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 80, color: "#b5651d", direction: "rtl" }}>أَفْشُوا السَّلَامَ بَيْنَكُمْ</div>
          <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, color: INK }}>“SPREAD SALAM AMONG YOURSELVES”</div>
        </div>
        <div style={{ marginTop: 10, fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.1em", color: "#b5651d" }}>SAHIH MUSLIM 54</div>
      </div>
    </div>);
  }
  if (idx === 4) out.push(<Bubble key="b1" t={t} at={S(4) + 0.6} txt="ASSALAMU ALAIKUM!" col={SKY} top={560} left={70} />);
  if (idx === 5) {
    const p = pop(t, S(5) + 0.3, 0.5);
    out.push(<div key="m" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 56, borderRadius: 30, padding: "18px 36px", border: `5px solid ${INK}` }}>= PEACE BE UPON YOU</div>
    </div>);
  }
  if (idx === 6) out.push(<Bubble key="b2" t={t} at={S(6) + 0.8} txt="WA ALAIKUM ASSALAM!" col={PINK} top={560} right={60} />);
  if (idx === 7) {
    const tags: [string, string][] = [["AT HOME", SKY], ["AT SCHOOL", PINK], ["AT THE MASJID", LEAF]];
    out.push(<div key="pl" style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      {tags.map(([s, col], i) => <div key={i} style={{ background: col, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 50, borderRadius: 26, padding: "12px 34px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(7) + 0.3 + i * 0.55, 0.45)})`, boxShadow: "0 8px 0 rgba(0,0,0,0.2)" }}>{s}</div>)}
    </div>);
  }
  if (idx === 8) {
    const a = S(8);
    const opts: [string, string][] = [["MUM & DAD", SKY], ["A FRIEND", PINK], ["YOUR TEACHER", LEAF]];
    out.push(<div key="end" style={{ position: "absolute", left: 90, right: 90, top: 470 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 70, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>SALAM FIRST TO...</div>
      {opts.map(([s, col], i) => <div key={i} style={{ marginTop: 18, background: col, borderRadius: 22, padding: "14px 24px", border: `4px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 44, color: INK, textAlign: "center", transform: `translateX(${(1 - pop(t, a + 0.5 + i * 0.25, 0.4)) * 700}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>{s}</div>)}
      <div style={{ marginTop: 22, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.7)" }}>TRY IT <span style={{ color: GOLD }}>TODAY!</span></div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1101kids-mix.m4a",
  imgDir: "d1101",
  logo: "day1/islam-for-little-ones.png",
  brand: "ISLAM FOR LITTLE ONES",
  keyword: /salam|love|peace|assalamu|alaikum|friend|masjid|school|home|today/i,
  particles: () => "sparkle",
  bright: true,
  captionTop: (c) => (c.idx >= 2 && c.idx <= 3 ? 1260 : 1180),
  captionSize: 74,
  shots: [
    { img: "k_wave.jpg", from: 0, to: 1, z0: 1.14, z1: 1.02, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k_dome.jpg", from: 1, to: 3, z0: 1.0, z1: 1.15, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.42, vertical: true },
    { img: "k_park.jpg", from: 3, to: 4, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k_hero.jpg", from: 4, to: 5, z0: 1.02, z1: 1.14, fx0: 0.5, fy0: 0.45, fx1: 0.5, fy1: 0.4, vertical: true },
    { img: "k_dove2.jpg", from: 5, to: 6, z0: 1.0, z1: 1.12, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.45, vertical: true },
    { img: "k_girl.jpg", from: 6, to: 7, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k_places2.jpg", from: 7, to: 8, z0: 1.0, z1: 1.12, fx0: 0.4, fy0: 0.5, fx1: 0.6, fy1: 0.5, vertical: true },
    { img: "k_sunrise.jpg", from: 8, to: 999, z0: 1.42, z1: 1.36, fx0: 0.42, fy0: 0.68, fx1: 0.45, fy1: 0.66, vertical: true },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1101Kids: React.FC = () => <HouseShort cfg={CFG} />;
