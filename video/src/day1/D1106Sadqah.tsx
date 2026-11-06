import React from "react";
import { HouseShort, HouseCfg, HudBlock, Ctx, pop, tw, MONT, GOLD, INK, houseDur, Timing } from "./HouseShort";
import data from "./d1106sadqah-timing.json";

/* One More Sadqah, Short 8 (Fri 6 Nov 2026, Jumu'ah): "Jumu'ah ki qeemti ghari", Sahih al-Bukhari 935 (Abu Huraira Radi Allahu Anhu):
   "There is an hour on Friday: no Muslim servant meets it while standing in prayer, asking Allah for something, except that He gives it to him",
   and he indicated with his hand how short it is. Checked on sunnah.com listings the same day.
   The Prophet Sallallahu Alaihi Wa Alihi Wasallam is never depicted; people are faceless (back views). Masjid-e-Nabawi shots are REAL Pixabay frames, never AI. */
const TM = data as unknown as Timing;
export const D1106_SADQAH_DUR = houseDur(TM);
const PLACE = ["JUMU'AH", "HADITH", "HADITH", "EK GHARI", "CHHUPI GHARI", "AAJ KA AMAL", "ONE MORE SADQAH"];
const GREEN = "#2a9d8f";

const Hud = (c: Ctx) => <HudBlock t={c.t} at={c.S(c.idx)} day="SHORT 8" big={<>JUMU'AH</>} place={PLACE[c.idx] || ""} tag="BUKHARI 935" tagBg={GOLD} tagFg={INK} />;

const Cards = (c: Ctx) => {
  const { t, S, E, idx } = c;
  const out: React.ReactNode[] = [];
  if (idx === 0) {
    const p = pop(t, S(0) + 0.3, 0.45);
    out.push(<div key="q" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "rgba(20,10,4,0.82)", borderRadius: 26, padding: "18px 40px", border: `4px solid ${GOLD}`, fontFamily: MONT, fontWeight: 800, fontSize: 64, color: "#fff" }}>
        ⏳ JUMU'AH KI <span style={{ color: GOLD }}>EK GHARI</span>
      </div>
    </div>);
  }
  if (idx === 2) {
    const p = pop(t, S(2) - 0.1, 0.5);
    const k = tw(t, S(2) + 0.1, S(2) + 0.9);
    out.push(<div key="hadith" style={{ position: "absolute", top: 440, left: 40, right: 40, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
      <div style={{ background: "rgba(18,9,3,0.86)", borderRadius: 26, padding: "24px 24px 18px", border: `3px solid ${GOLD}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ fontFamily: "Amiri, serif", fontWeight: 700, fontSize: 52, lineHeight: 1.65, color: GOLD, direction: "rtl", textAlign: "center", opacity: k }}>فِيهِ سَاعَةٌ لاَ يُوَافِقُهَا عَبْدٌ مُسْلِمٌ وَهْوَ قَائِمٌ يُصَلِّي يَسْأَلُ اللَّهَ تَعَالَى شَيْئًا إِلاَّ أَعْطَاهُ إِيَّاهُ</div>
        <div style={{ fontFamily: MONT, fontWeight: 700, fontSize: 28, color: "#fff", textAlign: "center", marginTop: 6, lineHeight: 1.3 }}>Jumu'ah mein ek ghari hai: jo Muslim banda namaz mein Allah se bhalai maange, Allah use zaroor ata farmata hai</div>
        <div style={{ marginTop: 12, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 22, letterSpacing: "0.1em", color: GOLD }}>SAHIH AL-BUKHARI 935 · ABU HURAIRA RADI ALLAHU ANHU</div>
      </div>
    </div>);
  }
  if (idx === 3) {
    const p = pop(t, S(3) + 0.2, 0.5);
    const sand = tw(t, S(3) + 0.4, E(3), (x) => x);
    out.push(<div key="hg" style={{ position: "absolute", top: 500, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <svg width={260} height={380} viewBox="0 0 170 300">
        <path d="M10 0 H160 C160 90 100 120 92 150 C100 180 160 210 160 300 H10 C10 210 70 180 78 150 C70 120 10 90 10 0 Z" fill="rgba(255,250,235,0.35)" stroke={INK} strokeWidth={6} />
        <clipPath id="sadtop"><rect x={0} y={150 - 130 * (1 - sand)} width={170} height={130 * (1 - sand)} /></clipPath>
        <path clipPath="url(#sadtop)" d="M14 4 H156 C156 90 98 120 88 150 H82 C72 120 14 90 14 4 Z" fill={GOLD} />
        <clipPath id="sadbot"><rect x={0} y={296 - 130 * sand} width={170} height={130 * sand} /></clipPath>
        <path clipPath="url(#sadbot)" d="M82 150 H88 C98 180 156 210 156 296 H14 C14 210 72 180 82 150 Z" fill={GOLD} />
        {sand < 1 ? <rect x={83} y={150} width={4} height={140} fill={GOLD} /> : null}
      </svg>
      <div style={{ marginTop: 14 }}><div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 48, borderRadius: 22, padding: "10px 28px", border: `5px solid ${INK}` }}>BOHAT THORI SI GHARI</div></div>
    </div>);
  }
  if (idx === 4) {
    const p = pop(t, S(4) + 0.2, 0.45);
    out.push(<div key="hid" style={{ position: "absolute", top: 540, left: 70, right: 70, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ background: "rgba(18,9,3,0.88)", borderRadius: 28, padding: "20px 26px", border: `4px solid ${GOLD}`, fontFamily: MONT, fontWeight: 800, fontSize: 52, color: "#fff" }}>🔒 GHARI <span style={{ color: GOLD }}>CHHUPI</span> HAI</div>
      <div style={{ marginTop: 18, display: "inline-block", background: GREEN, color: "#fff", fontFamily: MONT, fontWeight: 800, fontSize: 46, borderRadius: 22, padding: "10px 26px", border: `4px solid ${INK}`, transform: `scale(${pop(t, S(4) + 1.8, 0.4)})` }}>🤲 SARA DIN DUA</div>
    </div>);
  }
  if (idx === 5) {
    const p = pop(t, S(5) + 0.3, 0.45);
    out.push(<div key="par" style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: "#e9c46a", color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 50, borderRadius: 26, padding: "16px 30px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>🤲 WALIDAIN KE LIYE DUA</div>
    </div>);
  }
  if (idx === 6) {
    const p = pop(t, S(6) + 0.2, 0.5);
    out.push(<div key="share" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ display: "inline-block", background: GOLD, color: INK, fontFamily: MONT, fontWeight: 800, fontSize: 56, borderRadius: 26, padding: "18px 36px", border: `5px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>SHARE = ONE MORE SADQAH</div>
    </div>);
  }
  return <>{out}</>;
};

const CFG: HouseCfg = {
  timing: TM,
  mix: "day1/d1106sadqah-mix.m4a",
  imgDir: "d1106",
  logo: "day1/one-more-sadqah.png",
  brand: "ONE MORE SADQAH",
  keyword: /jumu|ghari|waqt|qeemti|dua|bhalai|ata|zaroor|chhupi|walidain|sadqah|thori/i,
  particles: (c) => (c.idx >= 4 ? "sparkle" : "dust"),
  captionTop: (c) => (c.idx === 2 ? 1330 : c.idx === 3 ? 1330 : 1180),
  captionSize: 70,
  shakeAt: [2],
  shots: [
    { img: "s8_clock.jpg", from: 0, to: 1, z0: 1.12, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "dome_real_a.jpg", from: 1, to: 2, z0: 1.0, z1: 1.08, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "dome_real_b.jpg", from: 2, to: 3, z0: 1.08, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5, vertical: true },
    { img: "s8_rows.jpg", from: 3, to: 4, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s8_asr.jpg", from: 4, to: 5, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s8_parents.jpg", from: 5, to: 6, z0: 1.0, z1: 1.1, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
    { img: "s8_dua.jpg", from: 6, to: 999, z0: 1.1, z1: 1.0, fx0: 0.5, fy0: 0.5, fx1: 0.5, fy1: 0.5 },
  ],
  hud: Hud,
  cards: Cards,
};

export const D1106Sadqah: React.FC = () => <HouseShort cfg={CFG} />;
