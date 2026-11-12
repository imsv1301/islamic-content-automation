import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1112kids-timing.json";

/* Islam for Little Ones, Thu 12 Nov 2026: "Right foot first!", Sahih al-Bukhari 5856 (Abu Huraira Radi Allahu Anhu):
   when putting on shoes, start with the right; when taking them off, start with the left; so the right is the first in
   and the last out. Made for Kids. Children faceless (back views / feet only); the Prophet Sallallahu Alaihi Wa Alihi
   Wasallam is never shown; Masjid-e-Nabawi shot is a REAL Pixabay frame. No face/person emoji on cards. */
const TM = data as unknown as Timing;
export const D1112_KIDS_DUR = houseDur(TM);
const PLACE = ["SHOES ON!", "A LOVELY SUNNAH", "PUTTING ON", "TAKING OFF", "REMEMBER", "PRACTISE", "YOUR TURN"];
const SKY = "#4cc9f0", PINK = "#ff8fab", LEAF = "#7bd389";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="DAY 14 · LESSON" big={<>SHOES</>} place={PLACE[c.idx] || ""} tag="LESSON 14" tagBg={LEAF} tagFg={INK} />;
const bubble = (bg: string, col: string, bd: string, sz: number): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 34, padding: "16px 32px", border: `6px solid ${bd}`, boxShadow: "0 10px 0 rgba(0,0,0,0.18)" });

/* a cartoon shoe; side R/L, step number badge */
const Shoe: React.FC<{ side: "R" | "L"; k: number; n?: string; col: string; dim?: boolean }> = ({ side, k, n, col, dim }) => (
  <div style={{ position: "relative", width: 300, height: 230, transform: `scale(${k})`, opacity: dim ? 0.45 : 1 }}>
    <div style={{ position: "absolute", left: 20, top: 40, fontSize: 170, lineHeight: 1, transform: side === "L" ? "scaleX(-1)" : "none" }}>👟</div>
    <div style={{ position: "absolute", left: 0, top: 0, ...bubble(col, INK, INK, 44), padding: "6px 22px" }}>{side === "R" ? "RIGHT" : "LEFT"}</div>
    {n ? <div style={{ position: "absolute", right: 0, top: 0, width: 78, height: 78, borderRadius: 39, background: GOLD, border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 44, color: INK }}>{n}</div> : null}
  </div>
);

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const L = (i: number) => E(i) - S(i);
  const at = (i: number, a: number) => S(i) + L(i) * a;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="a" style={{ position: "absolute", top: 480, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...bubble("#fff", INK, SKY, 56), transform: `scale(${pop(t, S(0) + 0.1, 0.45)})` }}>👟 SHOES ON!</div>
    <div style={{ marginTop: 30, display: "flex", justifyContent: "center", gap: 40 }}>
      <Shoe side="L" k={pop(t, at(0, 0.35), 0.4)} col={PINK} />
      <Shoe side="R" k={pop(t, at(0, 0.45), 0.4)} col={LEAF} />
    </div>
    <div style={{ marginTop: 20, ...bubble(GOLD, INK, INK, 52), transform: `scale(${pop(t, at(0, 0.7), 0.45)})` }}>WHICH FOOT FIRST? ❓</div>
  </div>);
  if (idx === 1) out.push(<div key="sun" style={{ position: "absolute", top: 560, left: 80, right: 80, textAlign: "center" }}>
    <div style={{ ...bubble("rgba(255,252,240,0.96)", INK, GOLD, 52), transform: `scale(${pop(t, at(1, 0.55), 0.45)})` }}>✨ A LITTLE SUNNAH ✨</div>
    <div style={{ marginTop: 18, fontFamily: MONT, fontWeight: 800, fontSize: 28, letterSpacing: "0.08em", color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,0.8)", opacity: pop(t, at(1, 0.7), 0.4) }}>📖 SAHIH AL-BUKHARI 5856</div>
  </div>);
  if (idx === 2) out.push(<div key="on" style={{ position: "absolute", top: 460, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...bubble(LEAF, INK, INK, 56), transform: `scale(${pop(t, S(2) + 0.1, 0.45)})` }}>⬆️ PUTTING ON</div>
    <div style={{ marginTop: 30, display: "flex", justifyContent: "center", gap: 40 }}>
      <Shoe side="R" k={pop(t, at(2, 0.4), 0.4)} n="1" col={LEAF} />
      <Shoe side="L" k={pop(t, at(2, 0.75), 0.4)} n="2" col={PINK} dim />
    </div>
  </div>);
  if (idx === 3) out.push(<div key="off" style={{ position: "absolute", top: 460, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...bubble(PINK, INK, INK, 56), transform: `scale(${pop(t, S(3) + 0.1, 0.45)})` }}>⬇️ TAKING OFF</div>
    <div style={{ marginTop: 30, display: "flex", justifyContent: "center", gap: 40 }}>
      <Shoe side="L" k={pop(t, at(3, 0.45), 0.4)} n="1" col={PINK} />
      <Shoe side="R" k={pop(t, at(3, 0.75), 0.4)} n="2" col={LEAF} dim />
    </div>
  </div>);
  if (idx === 4) out.push(<div key="rem" style={{ position: "absolute", top: 500, left: 60, right: 60, textAlign: "center" }}>
    <div style={{ background: "rgba(255,252,240,0.96)", borderRadius: 30, padding: "26px 28px", border: `6px solid ${GOLD}`, boxShadow: "0 12px 0 rgba(0,0,0,0.18)", transform: `scale(${pop(t, S(4) + 0.1, 0.45)})` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 54, color: INK }}>👟 RIGHT FOOT</div>
      <div style={{ marginTop: 14, ...bubble(LEAF, INK, INK, 46), transform: `scale(${pop(t, at(4, 0.3), 0.4)})` }}>FIRST IN</div>
      <div style={{ marginTop: 14, ...bubble(SKY, INK, INK, 46), transform: `scale(${pop(t, at(4, 0.65), 0.4)})` }}>LAST OUT</div>
    </div>
  </div>);
  if (idx === 5) {
    const steps = [["RIGHT ON", LEAF], ["LEFT ON", LEAF], ["LEFT OFF", PINK], ["RIGHT OFF", PINK]];
    out.push(<div key="pr" style={{ position: "absolute", top: 460, left: 0, right: 0, textAlign: "center" }}>
      {steps.map(([s, col], i) => <div key={i} style={{ marginTop: i ? 20 : 0 }}><div style={{ ...bubble(col, INK, INK, 54), transform: `scale(${pop(t, at(5, 0.12 + i * 0.2), 0.4)}) rotate(${i % 2 ? 2 : -2}deg)` }}>{i + 1}. {s} ✓</div></div>)}
    </div>);
  }
  if (idx === 6) {
    const a = S(6);
    out.push(<div key="end" style={{ position: "absolute", left: 100, right: 100, top: 500, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>CAN YOU DO IT TODAY?</div>
      <div style={{ marginTop: 26, ...bubble(LEAF, INK, INK, 60), transform: `scale(${pop(t, a + L(6) * 0.55, 0.45)}) rotate(-2deg)` }}>👟 RIGHT FOOT FIRST!</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1112kids-mix.m4a",
  imgDir: "d1112",
  logo: "day1/islam-for-little-ones.png",
  brand: "ISLAM FOR LITTLE ONES",
  keyword: /shoes|foot|first|right|left|sunnah|last|practise|today/i,
  particles: () => "sparkle",
  bright: true,
  captionTop: (c) => (c.idx === 4 || c.idx === 5 ? 1380 : 1260),
  captionSize: 74,
  shots: [
    { img: "k_shoes.jpg", from: 0, to: 1, z0: 1.35, z1: 1.25, fx0: 0.68, fy0: 0.38, fx1: 0.66, fy1: 0.36, vertical: true },
    { img: "dome_k.jpg", from: 1, to: 2, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.4, fx1: 0.5, fy1: 0.4, vertical: true },
    { img: "k_right.jpg", from: 2, to: 3, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.6, fx1: 0.5, fy1: 0.6, vertical: true },
    { img: "k_off.jpg", from: 3, to: 4, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k_rack.jpg", from: 4, to: 5, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.45, vertical: true },
    { img: "k_right2.jpg", from: 5, to: 6, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.55, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k_door.jpg", from: 6, to: 999, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.45, vertical: true },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1112Kids: React.FC = () => <HouseShort cfg={CFG} />;
