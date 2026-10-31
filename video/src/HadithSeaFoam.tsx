import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Audio } from "@remotion/media";
import { BACK, C1, CUTS, GOLD, GOLD2, IN, OUT, T, W, countAt, cl, clamp, prng, tw } from "./lib";
import { drawBeads, drawGrain, drawOcean, drawSins, oceanView } from "./draw";

const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: 1920 };
const ctr = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 80, right: 80, top, textAlign: "center", ...extra });
const MONT = "Montserrat, sans-serif", GAR = "'EB Garamond', serif", PLAY = "'Playfair Display', serif", AMIRI = "Amiri, serif";

/** absolute seconds inside a Sequence that starts at `start` */
const useT = (start = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return start + frame / fps;
};

/** a canvas repainted every frame from a pure painter */
const FrameCanvas: React.FC<{ start?: number; w?: number; h?: number; paint: (g: CanvasRenderingContext2D, t: number, frame: number) => void; style?: React.CSSProperties }> = ({ start = 0, w = 1080, h = 1920, paint, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = start + frame / fps;
  useLayoutEffect(() => {
    const g = ref.current?.getContext("2d");
    if (g) paint(g, t, Math.floor(t * fps));
  }, [t, fps, paint]);
  return <canvas ref={ref} width={w} height={h} style={{ ...full, ...style }} />;
};

/* ---------------- shared layers ---------------- */
const Ocean: React.FC = () => {
  const t = useT();
  const v = oceanView(t);
  return <FrameCanvas paint={drawOcean} style={{ opacity: v.a, filter: v.blur ? "blur(5px)" : "none" }} />;
};

const Flash: React.FC = () => {
  const t = useT();
  let o = 0;
  for (const c of CUTS) {
    if (t >= c - 0.07 && t < c) o = Math.max(o, interpolate(t, [c - 0.07, c], [0, 0.92], clamp));
    if (t >= c && t < c + 0.26) o = Math.max(o, interpolate(t, [c, c + 0.26], [0.92, 0], { ...clamp, easing: OUT }));
  }
  return <AbsoluteFill style={{ background: "#6b1a24", opacity: o }} />;
};

const Grain: React.FC = () => (
  <FrameCanvas w={360} h={640} paint={(g, _t, f) => drawGrain(g, f)} style={{ opacity: 0.09, mixBlendMode: "overlay" }} />
);

/* ---------------- captions (top band) ---------------- */
const CAPS: { key: string; chunks: number[]; keys: number[]; until: number }[] = [
  { key: "c", chunks: [6, 4, 8], keys: [4, 5, 14, 17], until: 8.0 },
  { key: "f", chunks: [4, 5], keys: [3, 6, 8], until: 23.8 },
  { key: "g", chunks: [5], keys: [3, 4], until: 25.5 },
  { key: "h", chunks: [5, 8], keys: [3, 4, 12], until: 29.8 },
];
const Captions: React.FC = () => {
  const t = useT();
  const out: React.ReactNode[] = [];
  for (const c of CAPS) {
    const ws = T[c.key].words;
    let i = 0;
    c.chunks.forEach((n, ci) => {
      const s = ws[i][1];
      const e = ci + 1 < c.chunks.length ? ws[i + n][1] : c.until;
      const idx = Array.from({ length: n }, (_, k) => i + k);
      i += n;
      if (t < s - 0.05 || t >= e - 0.02) return;
      out.push(
        <div key={c.key + ci} style={{ position: "absolute", left: 0, right: 0, top: 0, fontFamily: MONT, fontWeight: 700, fontSize: 54, lineHeight: 1.22, color: "#fbf4e6", textShadow: "0 4px 24px rgba(0,0,0,0.65)" }}>
          {idx.map((wi) => {
            const k = c.keys.includes(wi);
            const at = ws[wi][1] - 0.04;
            return (
              <span key={wi} style={{ display: "inline-block", margin: "0 6px", opacity: tw(t, at, 0.22, 0, 1), translate: `0px ${tw(t, at, 0.22, 14, 0)}px`,
                ...(k ? { fontFamily: GAR, fontStyle: "italic", fontWeight: 600, fontSize: 64, color: GOLD2 } : {}) }}>
                {ws[wi][0]}
              </span>
            );
          })}
        </div>,
      );
    });
  }
  return <div style={{ position: "absolute", left: 80, right: 80, top: 228, height: 170, textAlign: "center" }}>{out}</div>;
};

/* ---------------- scenes ---------------- */
const rb = prng(1);
const BOKEH = Array.from({ length: 16 }, (_, i) => ({ s: 40 + rb() * 120, x: rb() * 1000, y: 200 + rb() * 1300, gold: i % 3 !== 0, i }));

const Hook: React.FC = () => {
  const t = useT(0);
  const u = cl((t - 1.25) / 1.2, 0, 1), n = Math.round(100 * (u * u * (3 - 2 * u)));
  const land = t >= 2.45 ? tw(t, 2.45, 0.45, 1.12, 1, BACK(2.5)) : 1;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(90% 60% at 50% 45%, #22130f 0%, #110a08 55%, #050303 100%)", scale: String(interpolate(t, [0, 2.8], [1, 1.06])) }}>
      {BOKEH.map((b) => (
        <div key={b.i} style={{ position: "absolute", width: b.s, height: b.s, left: b.x, top: b.y, borderRadius: "50%", filter: "blur(16px)",
          background: b.gold ? "rgba(227,189,110,0.28)" : "rgba(150,40,50,0.32)",
          translate: `0px ${interpolate(t, [0, 2.8], [0, -80 - (b.i % 5) * 30])}px`, opacity: interpolate(t, [0, 2.8], [0.4 + (b.i % 4) * 0.12, 0.9]) }} />
      ))}
      <div style={{ position: "absolute", left: 290, top: 530, width: 500, height: 500, borderRadius: "50%", border: "3px solid rgba(227,189,110,0.9)",
        opacity: interpolate(t, [2.45, 2.85, 3.25], [0, 1, 0], clamp), scale: String(tw(t, 2.45, 0.8, 0.6, 1.25)) }} />
      <div style={ctr(470, { fontFamily: PLAY, fontWeight: 600, fontSize: 84, letterSpacing: "0.1em", color: "#f2e7d0",
        opacity: tw(t, W("a", 0) - 0.05, 0.5, 0, 1), translate: `0px ${tw(t, W("a", 0) - 0.05, 0.5, 20, 0)}px`, scale: String(tw(t, W("a", 0) - 0.05, 0.5, 1.04, 1)) })}>TWO WORDS.</div>
      <div style={ctr(640, { height: 280, fontFamily: MONT, fontWeight: 800, fontSize: 250, lineHeight: "280px", color: "#fff4dc",
        opacity: tw(t, 1.2, 0.35, 0, 1), filter: `blur(${tw(t, 1.2, 0.35, 10, 0)}px)`, scale: String(tw(t, 1.2, 0.35, 0.85, 1) * land) })}>{n}</div>
      <div style={ctr(950, { fontFamily: GAR, fontStyle: "italic", fontSize: 60, color: GOLD,
        opacity: tw(t, W("b", 2) - 0.05, 0.45, 0, 1), translate: `0px ${tw(t, W("b", 2) - 0.05, 0.45, 16, 0)}px` })}>times a day</div>
    </AbsoluteFill>
  );
};

const Sea: React.FC = () => {
  const t = useT(2.8);
  const wt = W("c", 4);
  return (
    <AbsoluteFill>
      <FrameCanvas start={2.8} paint={drawSins} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", fontFamily: MONT, fontWeight: 700, fontSize: 34, letterSpacing: "0.3em", color: "#d9c7a6",
        opacity: tw(t, W("c", 2) - 0.1, 0.4, 0, 1) * tw(t, wt + 0.8, 0.6, 1, 0, IN), translate: `0px ${tw(t, W("c", 2) - 0.1, 0.4, 10, 0) + tw(t, wt + 0.8, 0.6, 0, -20, IN)}px` }}>YOUR SINS</div>
      <div style={{ position: "absolute", left: 430, top: 1170, width: 220, height: 5, background: GOLD, transformOrigin: "0 50%",
        scale: `${tw(t, wt + 0.2, 0.35, 0, 1)} 1`, opacity: tw(t, wt + 0.9, 0.5, 1, 0) }} />
    </AbsoluteFill>
  );
};

const E3_GOLD = new Set([7, 19, 20, 21, 22]);
const Hadith: React.FC = () => {
  const t = useT(8.0);
  const fade = (at: number, d = 0.5, dy = 14) => ({ opacity: tw(t, at, d, 0, 1), translate: `0px ${tw(t, at, d, dy, 0)}px` });
  const e3 = T["e3"].words;
  const arT = [W("e2", 0), W("e2", 1), W("e2", 2)];
  return (
    <AbsoluteFill style={{ scale: String(interpolate(t, [8.0, 21.1], [1, 1.035])) }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.82) 0%, rgba(5,7,12,0.7) 45%, rgba(5,7,12,0.9) 100%)" }} />
      <div style={ctr(270, { fontFamily: MONT, fontWeight: 700, fontSize: 36, letterSpacing: "0.14em", color: GOLD, ...fade(W("d", 0) - 0.05) })}>
        THE PROPHET MUHAMMAD <span style={{ fontFamily: AMIRI, fontWeight: 400, fontSize: 44, letterSpacing: 0 }}>ﷺ</span>
      </div>
      <div style={ctr(330, { fontFamily: MONT, fontWeight: 600, fontSize: 28, letterSpacing: "0.12em", color: "#cbbd9f", ...fade(W("d", 3), 0.5, 10) })}>(PEACE AND BLESSINGS BE UPON HIM) SAID</div>
      <div style={ctr(430, { fontFamily: GAR, fontStyle: "italic", fontSize: 58, color: "#f3ead8", ...fade(W("e1", 0) - 0.05, 0.4) })}>“Whoever says,</div>
      <div dir="rtl" lang="ar" style={ctr(505, { fontFamily: AMIRI, fontWeight: 700, fontSize: 104, lineHeight: 1.6, color: GOLD2, textShadow: "0 0 40px rgba(240,197,108,0.35)" })}>
        {["سُبْحَانَ", "اللَّهِ", "وَبِحَمْدِهِ"].map((w, i) => (
          <span key={i} style={{ display: "inline-block", margin: "0 10px", opacity: tw(t, arT[i] - 0.05, 0.45, 0, 1), translate: `0px ${tw(t, arT[i] - 0.05, 0.45, 24, 0)}px`, filter: `blur(${tw(t, arT[i] - 0.05, 0.45, 8, 0)}px)` }}>{w}</span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 240, width: 600, top: 690, height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, scale: `${tw(t, W("e2", 0), 1.2, 0, 1)} 1` }} />
      <div style={ctr(708, { fontFamily: GAR, fontStyle: "italic", fontSize: 40, color: "#b9ad94", opacity: tw(t, W("e2", 2), 0.5, 0, 1, (x) => x) })}>Subḥān-Allāhi wa bi-ḥamdihi</div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 800, textAlign: "center", fontFamily: GAR, fontSize: 58, lineHeight: 1.3, color: "#f3ead8", ...fade(W("e3", 0) - 0.3, 0.5, 20) }}>
        {e3.map((w, i) => (
          <span key={i} style={{ display: "inline-block", marginRight: 13, opacity: interpolate(t, [w[1] - 0.03, w[1] + 0.15], [0.12, 1], clamp), ...(E3_GOLD.has(i) ? { color: GOLD2, fontStyle: "italic" } : {}) }}>
            {i === e3.length - 1 ? w[0] + "”" : w[0]}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Shore: React.FC = () => {
  const t = useT(21.1);
  const big = Math.floor(913 + 37e6 * Math.pow(cl(t - 21.2, 0, 3), 2.2));
  return (
    <AbsoluteFill>
      <div style={ctr(820, { fontFamily: MONT, fontWeight: 800, fontSize: 120, color: "rgba(255,250,240,0.92)", textShadow: "0 6px 40px rgba(0,0,0,0.6)",
        opacity: tw(t, 21.25, 0.4, 0, 1) * tw(t, 22.3, 1.4, 1, 0.6, IN), filter: `blur(${tw(t, 21.25, 0.4, 6, 0) + tw(t, 22.3, 1.4, 0, 5, IN)}px)` })}>{big.toLocaleString("en-US")}</div>
      <div style={ctr(960, { fontFamily: MONT, fontWeight: 700, fontSize: 30, letterSpacing: "0.3em", color: "#d9e6f2", opacity: tw(t, 21.5, 0.4, 0, 1, (x) => x) })}>FOAM ON ONE SHORE</div>
    </AbsoluteFill>
  );
};

const Tasbih: React.FC = () => {
  const t = useT(23.8);
  const land = t >= C1 ? tw(t, C1, 0.45, 1.12, 1, BACK(2.5)) : 1;
  const ct = W("h", 3) - 0.1;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(80% 55% at 50% 30%, #1b1712 0%, #0d0b09 60%, #050404 100%)" }}>
      <FrameCanvas start={23.8} paint={drawBeads} />
      <div style={ctr(520, { fontFamily: MONT, fontWeight: 800, fontSize: 230, lineHeight: 1, color: "#fff4dc", opacity: tw(t, 23.9, 0.4, 0, 1), scale: String(tw(t, 23.9, 0.4, 0.9, 1) * land) })}>{countAt(t)}</div>
      <div style={ctr(760, { fontFamily: MONT, fontWeight: 700, fontSize: 30, letterSpacing: "0.3em", color: "#a99c83", opacity: tw(t, 24.2, 0.4, 0, 1, (x) => x) })}>OF 100</div>
      <div style={{ position: "absolute", left: 400, top: 1140, width: 280, height: 150, opacity: tw(t, ct, 0.5, 0, 1), translate: `0px ${tw(t, ct, 0.5, 20, 0)}px` }}>
        <svg width={280} height={150} viewBox="0 0 280 150">
          <rect x={4} y={4} width={272} height={142} rx={71} fill="none" stroke={GOLD} strokeWidth={4} strokeDasharray={760} strokeDashoffset={tw(t, ct, 1.2, 760, 0)} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 34, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: GOLD2 }}>≈ 2:00</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 108, textAlign: "center", fontFamily: MONT, fontWeight: 600, fontSize: 28, letterSpacing: "0.22em", color: "#cbbd9f" }}>MINUTES</div>
      </div>
    </AbsoluteFill>
  );
};

const Card: React.FC<{ top: number; n: string; w: string; at: number; t: number }> = ({ top, n, w, at, t }) => (
  <div style={{ position: "absolute", left: 150, top, width: 780, height: 170, borderRadius: 22, background: "linear-gradient(180deg, #f4ead6, #e6d7b8)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.7)", color: "#2a1a14",
    opacity: tw(t, at, 0.45, 0, 1), translate: `0px ${tw(t, at, 0.45, 60, 0)}px`, rotate: `${tw(t, at, 0.45, -2, 0)}deg` }}>
    <div style={{ position: "absolute", left: 44, top: 22, fontFamily: PLAY, fontWeight: 700, fontSize: 110, lineHeight: 1, color: "#6b1a24" }}>{n}</div>
    <div style={{ position: "absolute", left: 230, top: 58, fontFamily: MONT, fontWeight: 800, fontSize: 50, letterSpacing: "0.12em" }}>{w}</div>
  </div>
);

const Ledger: React.FC = () => {
  const t = useT(29.8);
  const s = W("i", 4) + 0.25;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(80% 60% at 50% 40%, #17121a 0%, #0b0a0e 60%, #050507 100%)" }}>
      <Card t={t} top={470} n="2" w="WORDS" at={W("i", 0) - 0.08} />
      <Card t={t} top={670} n="2" w="MINUTES" at={W("i", 2) - 0.08} />
      <Card t={t} top={870} n="1×" w="EVERY DAY" at={W("i", 4) - 0.08} />
      <div style={ctr(1090, { fontFamily: GAR, fontStyle: "italic", fontSize: 56, color: GOLD2, opacity: tw(t, s, 0.45, 0, 1), translate: `0px ${tw(t, s, 0.45, 14, 0)}px` })}>sins like sea foam, forgiven.</div>
    </AbsoluteFill>
  );
};

const Why: React.FC = () => {
  const t = useT(32.65);
  return (
    <AbsoluteFill style={{ background: "#070607" }}>
      <div style={{ position: "absolute", left: 110, top: 560, width: 860, height: 300, background: "#6b1a24", borderRadius: 10, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", scale: `1 ${tw(t, 32.65, 0.35, 0, 1)}` }} />
      <div style={ctr(650, { fontFamily: PLAY, fontWeight: 600, fontSize: 76, color: "#f7ecd8", opacity: tw(t, W("j", 0) - 0.05, 0.4, 0, 1), translate: `0px ${tw(t, W("j", 0) - 0.05, 0.4, 16, 0)}px` })}>So why do we miss it?</div>
      <div style={ctr(960, { fontFamily: MONT, fontWeight: 800, fontSize: 72, color: "#fff", opacity: tw(t, W("j", 6) - 0.05, 0.4, 0, 1), translate: `0px ${tw(t, W("j", 6) - 0.05, 0.4, 16, 0)}px` })}>
        Because we{" "}
        <span style={{ position: "relative", display: "inline-block", padding: "0 14px", isolation: "isolate" }}>
          <i style={{ position: "absolute", left: 0, right: 0, top: 14, bottom: 4, background: GOLD, zIndex: -1, transformOrigin: "0 50%", scale: `${tw(t, W("j", 8) - 0.05, 0.35, 0, 1)} 1` }} />
          <b style={{ position: "relative", color: "#1a0f0a", fontWeight: 800 }}>forget.</b>
        </span>
      </div>
    </AbsoluteFill>
  );
};

const Save: React.FC = () => {
  const t = useT(35.1);
  const bm = W("k", 1);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(5,7,12,0.72)" }} />
      <div dir="rtl" lang="ar" style={ctr(430, { fontFamily: AMIRI, fontWeight: 700, fontSize: 128, lineHeight: 1.5, color: GOLD2, textShadow: "0 0 50px rgba(240,197,108,0.45)",
        opacity: tw(t, 35.15, 0.7, 0, 1), scale: String(tw(t, 35.15, 0.7, 0.94, 1)), filter: `blur(${tw(t, 35.15, 0.7, 8, 0)}px)` })}>سُبْحَانَ اللَّهِ وَبِحَمْدِهِ</div>
      <div style={ctr(650, { fontFamily: GAR, fontStyle: "italic", fontSize: 46, color: "#e6dcc6", opacity: tw(t, 35.5, 0.5, 0, 1, (x) => x) })}>Subḥān-Allāhi wa bi-ḥamdihi</div>
      <div style={ctr(720, { fontFamily: MONT, fontWeight: 500, fontSize: 32, color: "#a8a090", opacity: tw(t, 35.7, 0.5, 0, 1, (x) => x) })}>Glory be to Allah, and praise be to Him.</div>
      <div style={ctr(900, { fontFamily: PLAY, fontWeight: 700, fontSize: 96, color: "#fbf4e6", opacity: tw(t, W("k", 0) - 0.05, 0.45, 0, 1), translate: `0px ${tw(t, W("k", 0) - 0.05, 0.45, 18, 0)}px` })}>Save this.</div>
      <div style={ctr(1030, { fontFamily: GAR, fontStyle: "italic", fontSize: 60, color: GOLD2, opacity: tw(t, W("k", 3) - 0.05, 0.45, 0, 1), translate: `0px ${tw(t, W("k", 3) - 0.05, 0.45, 14, 0)}px` })}>Say it 100 times today.</div>
      <svg viewBox="0 0 70 90" style={{ position: "absolute", left: 505, top: 1150, width: 70, height: 90, opacity: tw(t, bm, 0.4, 0, 1), translate: `0px ${tw(t, bm, 0.4, -20, 0)}px`,
        scale: String(t >= bm + 0.35 ? tw(t, bm + 0.35, 0.35, 1.2, 1, BACK(3)) : 1) }}>
        <path d="M8 4 H62 V86 L35 64 L8 86 Z" fill="none" stroke={GOLD2} strokeWidth={6} strokeLinejoin="round" />
        <path d="M8 4 H62 V86 L35 64 L8 86 Z" fill={GOLD2} opacity={tw(t, bm + 0.35, 0.2, 0, 1, (x) => x)} />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- the video ---------------- */
export const HadithSeaFoam: React.FC = () => {
  const { fps } = useVideoConfig();
  const S = (a: number, b: number) => ({ from: Math.round(a * fps), durationInFrames: Math.round((b - a) * fps) });
  return (
    <AbsoluteFill style={{ background: "#06080d", color: "#efe3cc", fontFamily: MONT }}>
      <Ocean />
      <Sequence name="Hook" {...S(0, 2.8)}><Hook /></Sequence>
      <Sequence name="Sea" {...S(2.8, 8.0)}><Sea /></Sequence>
      <Sequence name="Hadith" {...S(8.0, 21.1)}><Hadith /></Sequence>
      <Sequence name="Shore" {...S(21.1, 23.8)}><Shore /></Sequence>
      <Sequence name="Tasbih" {...S(23.8, 29.8)}><Tasbih /></Sequence>
      <Sequence name="Ledger" {...S(29.8, 32.65)}><Ledger /></Sequence>
      <Sequence name="Why" {...S(32.65, 35.1)}><Why /></Sequence>
      <Sequence name="Save" {...S(35.1, 40.5)}><Save /></Sequence>
      <Captions />
      <AbsoluteFill style={{ background: "radial-gradient(120% 85% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      <Grain />
      <div style={{ position: "absolute", left: 80, top: 1296, fontFamily: MONT, fontWeight: 600, fontSize: 28, letterSpacing: "0.06em", color: "rgba(239,227,204,0.72)" }}>Sahih al-Bukhari 6405</div>
      <div style={{ position: "absolute", right: 80, top: 1296, fontFamily: MONT, fontWeight: 600, fontSize: 28, letterSpacing: "0.06em", color: "rgba(239,227,204,0.5)" }}>DAILY HADITH</div>
      <Flash />
      <Audio src={staticFile("mix.m4a")} />
    </AbsoluteFill>
  );
};
