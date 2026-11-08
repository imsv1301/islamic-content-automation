import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1108kids-timing.json";

/* Islam for Little Ones, Sun 8 Nov 2026: "Who should you be kindest to? Your mother!", Sahih al-Bukhari 5971 (Abu Huraira Radi Allahu Anhu):
   a man asked who most deserves his good companionship: "Your mother", then "your mother", then "your mother", then "your father".
   Checked on sunnah.com listings the same day. Made for Kids. Gentle and bright.
   People faceless (back views only); the man who asked is a Companion and is NOT shown; the Prophet Sallallahu Alaihi Wa Alihi Wasallam is never shown.
   Masjid-e-Nabawi shot is a REAL Pixabay frame. */
const TM = data as unknown as Timing;
export const D1108_KIDS_DUR = houseDur(TM);
const PLACE = ["GUESS!", "A TRUE HADITH", "THE QUESTION", "ANSWER 1", "ANSWER 2", "ANSWER 3", "ANSWER 4", "WHEN YOU WERE TINY", "YOUR TURN", "TODAY"];
const SKY = "#4cc9f0", PINK = "#ff8fab", LEAF = "#7bd389";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="DAY 10 · LESSON" big={<>KINDNESS</>} place={PLACE[c.idx] || ""} tag="LESSON 10" tagBg={LEAF} tagFg={INK} />;

const bubble = (bg: string, col: string, bd: string, sz: number): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 34, padding: "16px 32px", border: `6px solid ${bd}`, boxShadow: "0 10px 0 rgba(0,0,0,0.18)" });
const ROWS: [string, string][] = [["💛 YOUR MOTHER", PINK], ["💛 YOUR MOTHER", PINK], ["💛 YOUR MOTHER", PINK], ["💙 YOUR FATHER", SKY]];
const CHIPS: [string, string][] = [["🤗 A BIG HUG", PINK], ["🙌 HELP HER", SKY], ["😊 A SMILE", GOLD]];

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="a" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(0) + 0.2, 0.5)})` }}>
    <div style={bubble("#fff", INK, SKY, 62)}>KINDEST TO WHO? 🤔</div>
  </div>);
  if (idx === 2) out.push(<div key="q" style={{ position: "absolute", top: 580, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(2) + 0.2, 0.45)})` }}>
    <div style={bubble("rgba(255,252,240,0.96)", INK, GOLD, 52)}>🙋 WHO, MOST OF ALL?</div>
  </div>);
  if (idx >= 3 && idx <= 6) {
    out.push(<div key="rows" style={{ position: "absolute", top: 440, left: 110, right: 110 }}>
      {ROWS.map(([s, col], i) => {
        if (idx < 3 + i) return null;
        const k = idx === 3 + i ? pop(t, S(3 + i) + (i === 0 ? 0.9 : 0.4), 0.45) : 1;
        return <div key={i} style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 18, background: col, borderRadius: 24, padding: "12px 26px", border: `5px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 52, color: INK, transform: `scale(${k})`, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>
          <span style={{ background: INK, color: GOLD, borderRadius: 999, width: 60, height: 60, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{i + 1}</span><span>{s}</span></div>;
      })}
      {idx === 6 ? <div style={{ marginTop: 22, textAlign: "center", transform: `scale(${pop(t, S(6) + 1.4, 0.45)})` }}>
        <div style={{ display: "inline-block", background: "rgba(255,252,240,0.96)", borderRadius: 22, padding: "10px 24px", border: `5px solid ${GOLD}`, fontFamily: MONT, fontWeight: 800, fontSize: 26, letterSpacing: "0.08em", color: "#b5651d" }}>📖 SAHIH AL-BUKHARI 5971</div>
      </div> : null}
    </div>);
  }
  if (idx === 7) out.push(<div key="tiny" style={{ position: "absolute", top: 580, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(7) + 0.3, 0.45)})` }}>
    <div style={bubble("#fff", INK, PINK, 54)}>👶 SHE LOOKED AFTER YOU</div>
  </div>);
  if (idx === 8) out.push(<div key="chips" style={{ position: "absolute", top: 500, left: 110, right: 110 }}>
    {CHIPS.map(([s, col], i) => { const k = pop(t, S(8) + 0.4 + i * 0.9, 0.45); return <div key={i} style={{ marginTop: 16, background: col, borderRadius: 22, padding: "12px 26px", border: `5px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 52, color: INK, textAlign: "center", transform: `translateX(${(1 - k) * 800}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>{s}</div>; })}
  </div>);
  if (idx === 9) {
    const a = S(9);
    out.push(<div key="end" style={{ position: "absolute", left: 100, right: 100, top: 500, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>TODAY I WILL HELP MUM BY...</div>
      <div style={{ marginTop: 26, ...bubble(GOLD, INK, INK, 58), transform: `scale(${pop(t, a + 1.4, 0.45)}) rotate(-2deg)` }}>🌟 BE KIND TO MUM!</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1108kids-mix.m4a",
  imgDir: "d1108",
  logo: "day1/islam-for-little-ones.png",
  brand: "ISLAM FOR LITTLE ONES",
  keyword: /kindest|world|asked|mother|father|tiny|hug|smile|help|mum|today/i,
  particles: () => "sparkle",
  bright: true,
  captionTop: (c) => (c.idx >= 3 && c.idx <= 6 ? 1340 : c.idx === 8 ? 1300 : 1180),
  captionSize: 74,
  shots: [
    { img: "k_world.jpg", from: 0, to: 1, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_real_b.jpg", from: 1, to: 2, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "k_heart.jpg", from: 2, to: 3, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_hug.jpg", from: 3, to: 6, z0: 1.0, z1: 1.15, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.45 },
    { img: "k_father.jpg", from: 6, to: 7, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_baby.jpg", from: 7, to: 8, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_help.jpg", from: 8, to: 9, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_heart.jpg", from: 9, to: 999, z0: 1.12, z1: 1.0, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1108Kids: React.FC = () => <HouseShort cfg={CFG} />;
