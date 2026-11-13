import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1113sadqah-timing.json";

/* One More Sadqah, Short 15 (Fri 13 Nov 2026): "Tasbeeh-e-Fatima: khaadim se behtar", Sahih al-Bukhari 3113
   (also 3705, 5361, 6318; Muslim 2727), narrated by Hazrat Ali Alaihis Salam: Sayyida Fatima Alaihas Salam's hands
   were hurt by the hand-mill; she went to ask for a servant; the Prophet Sallallahu Alaihi Wa Alihi Wasallam came to
   them at night and said: "Shall I not tell you of something better than what you asked for? When you go to bed,
   say Allahu Akbar 34 times, Alhamdulillah 33 times and SubhanAllah 33 times; that is better for you than a servant."
   (فَهُوَ خَيْرٌ لَكُمَا مِمَّا سَأَلْتُمَاهُ). Nobody is depicted: objects, places and hands of an ordinary person only.
   Masjid-e-Nabawi shot is a REAL Pixabay frame, never AI. No wisal date is claimed (Sunni observance differs). */
const TM = data as unknown as Timing;
export const D1113_SADQAH_DUR = houseDur(TM);
const PLACE = ["SAWAAL", "HADITH", "RAAT KO", "BEHTAR CHEEZ", "34 · 33 · 33", "KHAADIM SE BEHTAR", "AAJ RAAT", "ONE MORE SADQAH"];
const GREEN = "#2a9d8f", BLUE = "#3a4a8a";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="SHORT 15" big={<>TASBEEH</>} place={PLACE[c.idx] || ""} tag="BUKHARI 3113" tagBg={GOLD} tagFg={INK} />;
const chip = (bg: string, col: string, sz = 50): React.CSSProperties => ({ display: "inline-block", background: bg, color: col, fontFamily: MONT, fontWeight: 800, fontSize: sz, borderRadius: 24, padding: "14px 30px", border: `5px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,0.3)" });
const lin = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / Math.max(0.01, b - a)));

/* bead counter: label + count rolling up to n */
const Counter: React.FC<{ t: number; a: number; b: number; n: number; ar: string; ro: string; col: string }> = ({ t, a, b, n, ar, ro, col }) => {
  const u = lin(t, a, b), k = pop(t, a - 0.15, 0.4);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, background: "rgba(18,9,3,0.86)", borderRadius: 26, border: `4px solid ${col}`, padding: "14px 26px", transform: `scale(${k})`, opacity: k }}>
      <div style={{ width: 150, fontFamily: MONT, fontWeight: 800, fontSize: 84, color: col, textAlign: "center" }}>{Math.round(n * u)}</div>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 54, color: GOLD, direction: "rtl", textAlign: "left", lineHeight: 1.3 }}>{ar}</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 36, color: "#fff" }}>{ro}</div>
      </div>
    </div>
  );
};

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const L = (i: number) => E(i) - S(i);
  const at = (i: number, a: number) => S(i) + L(i) * a;
  const out: React.ReactNode[] = [];
  if (idx === 0) out.push(<div key="q" style={{ position: "absolute", top: 500, left: 40, right: 40, textAlign: "center" }}>
    <div style={{ ...chip("rgba(20,10,4,0.85)", "#fff", 54), border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(0) + 0.1, 0.4)})` }}>💭 THAKAWAT KA NUSKHA</div>
    <div style={{ marginTop: 30, ...chip(GOLD, INK, 50), transform: `scale(${pop(t, at(0, 0.45), 0.45)})` }}>KHAADIM SE BHI BEHTAR!</div>
    <div style={{ marginTop: 30, fontSize: 120, transform: `scale(${pop(t, at(0, 0.75), 0.45)})` }}>❓</div>
  </div>);
  if (idx === 1) out.push(<div key="nar" style={{ position: "absolute", top: 520, left: 40, right: 40, textAlign: "center" }}>
    <div style={{ ...chip("rgba(255,245,230,0.95)", INK, 42), transform: `scale(${pop(t, S(1) + 0.2, 0.45)})` }}>HAZRAT ALI <span style={{ color: "#b5651d" }}>ALAIHIS SALAM</span></div>
    <div style={{ marginTop: 24, ...chip("rgba(255,245,230,0.95)", INK, 42), transform: `scale(${pop(t, at(1, 0.4), 0.45)})` }}>SAYYIDA FATIMA <span style={{ color: "#b5651d" }}>ALAIHAS SALAM</span></div>
    <div style={{ marginTop: 24, ...chip(BLUE, "#fff", 44), transform: `scale(${pop(t, at(1, 0.75), 0.45)})` }}>🪨 CHAKKI KI MASHAQQAT</div>
  </div>);
  if (idx === 2) out.push(<div key="night" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip("rgba(20,10,4,0.85)", "#fff", 46), border: `5px solid ${GOLD}`, transform: `scale(${pop(t, at(2, 0.1), 0.45)})` }}>🌙 RAAT KO TASHREEF LAAYE</div>
  </div>);
  if (idx === 3) out.push(<div key="better" style={{ position: "absolute", top: 520, left: 60, right: 60, textAlign: "center" }}>
    <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "26px", border: `3px solid ${GOLD}`, transform: `scale(${pop(t, S(3) + 0.1, 0.45)})` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 46, color: "#fff" }}>"KHAADIM SE BEHTAR</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 46, color: GOLD }}>CHEEZ NA BATAOON?"</div>
    </div>
    <div style={{ marginTop: 26, ...chip(GREEN, "#fff", 46), transform: `scale(${pop(t, at(3, 0.7), 0.45)})` }}>🛏️ JAB SONE LAGO…</div>
  </div>);
  if (idx === 4) {
    const a = S(4), l = L(4);
    out.push(<div key="cnt" style={{ position: "absolute", top: 430, left: 50, right: 50, display: "flex", flexDirection: "column", gap: 24 }}>
      <Counter t={t} a={a + l * 0.05} b={a + l * 0.33} n={34} ar="اَللّٰهُ أَكْبَرُ" ro="ALLAHU AKBAR" col={GOLD} />
      <Counter t={t} a={a + l * 0.36} b={a + l * 0.64} n={33} ar="اَلْحَمْدُ لِلّٰهِ" ro="ALHAMDULILLAH" col="#7bd389" />
      <Counter t={t} a={a + l * 0.67} b={a + l * 0.95} n={33} ar="سُبْحَانَ اللّٰهِ" ro="SUBHANALLAH" col="#4cc9f0" />
    </div>);
  }
  if (idx === 5) {
    const k = tw(t, S(5) + 0.1, S(5) + 0.9);
    out.push(<div key="h" style={{ position: "absolute", top: 440, left: 40, right: 40, transform: `translateY(${(1 - pop(t, S(5) - 0.1, 0.5)) * 60}px)`, opacity: pop(t, S(5) - 0.1, 0.5) }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}><div style={{ ...chip(GREEN, "#fff", 40) }}>📿 TASBEEH-E-FATIMA</div></div>
      <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "28px 24px 20px", border: `3px solid ${GOLD}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 66, lineHeight: 1.6, color: GOLD, direction: "rtl", textAlign: "center", opacity: k }}>فَهُوَ خَيْرٌ لَكُمَا مِمَّا سَأَلْتُمَاهُ</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 36, color: "#fff", textAlign: "center", marginTop: 8, lineHeight: 1.35 }}>"Yeh tumhare liye khaadim se behtar hai."</div>
        <div style={{ marginTop: 12, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.06em", color: GOLD }}>SAHIH AL-BUKHARI 3113 · HAZRAT ALI ALAIHIS SALAM</div>
      </div>
    </div>);
  }
  if (idx === 6) out.push(<div key="cm" style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ ...chip("rgba(20,10,4,0.85)", "#fff", 48), border: `5px solid ${GOLD}`, transform: `scale(${pop(t, S(6) + 0.2, 0.45)})` }}>🌙 AAJ RAAT SONE SE PEHLE</div>
    <div style={{ marginTop: 28, ...chip(GOLD, INK, 52), transform: `scale(${pop(t, at(6, 0.35), 0.45)})` }}>34 · 33 · 33</div>
    <div style={{ marginTop: 28, ...chip(GREEN, "#fff", 46), transform: `scale(${pop(t, at(6, 0.7), 0.45)})` }}>💬 "MAIN PADHUNGA!"</div>
  </div>);
  if (idx === 7) out.push(<div key="share" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(t, S(7) + 0.2, 0.5)})` }}>
    <div style={{ ...chip(GOLD, INK, 56) }}>SHARE = ONE MORE SADQAH</div>
  </div>);
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1113sadqah-mix.m4a",
  imgDir: "d1113",
  logo: "day1/one-more-sadqah.png",
  brand: "ONE MORE SADQAH",
  keyword: /nuskha|khaadim|behtar|fatima|ali|chakki|raat|akbar|alhamdulillah|subhanallah|tasbeeh|sadqah/i,
  particles: (c) => (c.idx >= 2 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx === 4 ? 1400 : c.idx === 5 ? 1260 : 1200),
  captionSize: 66,
  shakeAt: [5],
  shots: [
    { img: "s_lamp2.jpg", from: 0, to: 1, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.45, fx1: 0.5, fy1: 0.55 },
    { img: "s_mill.jpg", from: 1, to: 2, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.55 },
    { img: "dome_s.jpg", from: 2, to: 3, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s_night.jpg", from: 3, to: 4, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_beads.jpg", from: 4, to: 5, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_bed.jpg", from: 5, to: 6, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_beads2.jpg", from: 6, to: 7, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s_lamp2.jpg", from: 7, to: 999, z0: 1.2, z1: 1.05, fx0: 0.55, fy0: 0.6, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1113Sadqah: React.FC = () => <HouseShort cfg={CFG} />;
