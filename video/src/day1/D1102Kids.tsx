import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1102kids-timing.json";

/* Islam for Little Ones, 2 Nov 2026: "What do we say when we sneeze?", Sahih al-Bukhari 6224 (Abu Hurairah Radi Allahu Anhu). Made for Kids.
   Gentle and bright. A modern generic faceless kid; the Prophet Sallallahu Alaihi Wa Alihi Wasallam is never shown.
   Masjid-e-Nabawi shot is a REAL Pixabay frame, never AI. */
const TM = data as unknown as Timing;
export const D1102_KIDS_DUR = houseDur(TM);
const PLACE = ["ACHOO!", "A SUNNAH", "DUA 1", "DUA 2", "DUA 3", "WHAT IT MEANS", "3 DUAS", "PRACTISE", "YOUR TURN"];
const SKY = "#4cc9f0", PINK = "#ff8fab", LEAF = "#7bd389";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="DAY 4 · LESSON" big={<>SNEEZE</>} place={PLACE[c.idx] || ""} tag="LESSON 4" tagBg={LEAF} tagFg={INK} />;

const Bubble: React.FC<{ t: number; at: number; txt: string; col: string; top: number; left?: number; right?: number; size?: number }> = ({ t, at, txt, col, top, left, right, size = 60 }) => {
  const p = pop(t, at, 0.5);
  return <div style={{ position: "absolute", top, left, right, transform: `scale(${p})`, transformOrigin: left !== undefined ? "left bottom" : "right bottom" }}>
    <div style={{ background: "#fff", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: size, borderRadius: 40, padding: "22px 36px", border: `6px solid ${col}`, boxShadow: "0 10px 0 rgba(0,0,0,0.18)" }}>{txt}</div>
  </div>;
};

const DUAS: [string, string, string, string, string][] = [
  ["1 · YOU SNEEZE", "الْحَمْدُ لِلَّهِ", "ALHAMDULILLAH", "All praise is for Allah", SKY],
  ["2 · YOUR FRIEND SAYS", "يَرْحَمُكَ اللَّهُ", "YARHAMUKALLAH", "May Allah have mercy on you", PINK],
  ["3 · YOU ANSWER", "يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ", "YAHDIKUMULLAH WA YUSLIH BALAKUM", "May Allah guide you and make things good for you", LEAF],
];

const DuaCard: React.FC<{ d: typeof DUAS[number]; k: number }> = ({ d, k }) => (
  <div style={{ background: "rgba(255,252,240,0.95)", borderRadius: 30, padding: "20px 26px", border: `6px solid ${d[4]}`, boxShadow: "0 14px 0 rgba(0,0,0,0.15)", textAlign: "center", transform: `scale(${0.8 + 0.2 * k})`, opacity: k }}>
    <div style={{ display: "inline-block", background: d[4], color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 28, borderRadius: 14, padding: "4px 16px" }}>{d[0]}</div>
    <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 76, lineHeight: 1.4, color: "#b5651d", direction: "rtl" }}>{d[1]}</div>
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: d[2].length > 16 ? 36 : 50, color: INK }}>{d[2]}</div>
    <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 26, color: "#6b4b2a" }}>{d[3]}</div>
    <div style={{ marginTop: 8, fontFamily: MONT, fontWeight: 700, fontSize: 20, letterSpacing: "0.1em", color: "#b5651d" }}>SAHIH AL-BUKHARI 6224</div>
  </div>
);

const Cards = (c: Ctx) => {
  const { t, S, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<Bubble key="a" t={t} at={S(0) + 0.1} txt="ACHOO!" col={SKY} top={540} left={80} size={96} />);
  if (idx >= 2 && idx <= 4) {
    const d = DUAS[idx - 2];
    out.push(<div key={"d" + idx} style={{ position: "absolute", top: 500, left: 60, right: 60 }}><DuaCard d={d} k={pop(t, S(idx) + 0.1, 0.5)} /></div>);
  }
  if (idx === 5) {
    const p = pop(t, S(5) + 0.3, 0.5);
    out.push(<div key="m" style={{ position: "absolute", top: 560, left: 60, right: 60, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 48, lineHeight: 1.15, borderRadius: 30, padding: "18px 32px", border: `5px solid ${INK}` }}>ALLAH GUIDE YOU<br />+ MAKE THINGS GOOD</div>
    </div>);
  }
  if (idx === 6) {
    out.push(<div key="three" style={{ position: "absolute", top: 500, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {DUAS.map((d, i) => <div key={i} style={{ background: d[4], color: INK, fontFamily: MONT, fontWeight: 800, fontSize: d[2].length > 16 ? 30 : 46, borderRadius: 26, padding: "12px 28px", border: `5px solid ${INK}`, transform: `scale(${pop(t, S(6) + 0.3 + i * 0.5, 0.45)})`, boxShadow: "0 8px 0 rgba(0,0,0,0.2)" }}>{i + 1} · {d[2]}</div>)}
    </div>);
  }
  if (idx === 7) {
    out.push(<Bubble key="p1" t={t} at={S(7) + 0.7} txt="ACHOO!" col={PINK} top={540} left={70} size={80} />);
    out.push(<Bubble key="p2" t={t} at={S(7) + 1.4} txt="ALHAMDULILLAH!" col={LEAF} top={760} right={60} />);
  }
  if (idx === 8) {
    const a = S(8);
    const opts: [string, string][] = [["MUM & DAD", SKY], ["BROTHER OR SISTER", PINK], ["A FRIEND", LEAF]];
    out.push(<div key="end" style={{ position: "absolute", left: 90, right: 90, top: 470 }}>
      <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 70, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", transform: `scale(${pop(t, a, 0.45)})` }}>TEACH IT TO...</div>
      {opts.map(([s, col], i) => <div key={i} style={{ marginTop: 18, background: col, borderRadius: 22, padding: "14px 24px", border: `4px solid ${INK}`, fontFamily: MONT, fontWeight: 800, fontSize: 44, color: INK, textAlign: "center", transform: `translateX(${(1 - pop(t, a + 0.5 + i * 0.25, 0.4)) * 700}px)`, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>{s}</div>)}
      <div style={{ marginTop: 22, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.7)" }}>TRY IT <span style={{ color: GOLD }}>TODAY!</span></div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1102kids-mix.m4a",
  imgDir: "d1102",
  logo: "day1/islam-for-little-ones.png",
  brand: "ISLAM FOR LITTLE ONES",
  keyword: /achoo|sneeze|alhamdulillah|yarhamukallah|yahdikumullah|mercy|guide|duas|allah|practise|today/i,
  particles: () => "sparkle",
  bright: true,
  captionTop: (c) => (c.idx >= 2 && c.idx <= 4 ? 1300 : 1180),
  captionSize: 74,
  shots: [
    { img: "k_hero_lucid.jpg", from: 0, to: 1, z0: 1.12, z1: 1.02, fx0: 0.5, fy0: 0.45, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "dome_real_b.jpg", from: 1, to: 2, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.45, vertical: true },
    { img: "k_bless.jpg", from: 2, to: 3, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_friends.jpg", from: 3, to: 4, z0: 1.0, z1: 1.12, fx0: 0.45, fy0: 0.5, fx1: 0.55, fy1: 0.5 },
    { img: "k_reply.jpg", from: 4, to: 5, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_path.jpg", from: 5, to: 6, z0: 1.0, z1: 1.14, fx0: 0.5, fy0: 0.55, fx1: 0.5, fy1: 0.45 },
    { img: "k_three.jpg", from: 6, to: 7, z0: 1.14, z1: 1.02, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "k_tissue.jpg", from: 7, to: 8, z0: 1.0, z1: 1.12, fx0: 0.4, fy0: 0.5, fx1: 0.6, fy1: 0.5 },
    { img: "k_home.jpg", from: 8, to: 999, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1102Kids: React.FC = () => <HouseShort cfg={CFG} />;
