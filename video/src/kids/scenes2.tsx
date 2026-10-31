import React from "react";
import { interpolate } from "remotion";
import { AMIRI, BALOO, Bubble, Defs, E, NUN, Person, PopText, S, SAL_TXT, SC, WT, clamp, fadeIO, pop, prng, tw, useT, INO } from "./kit";
import { Sparkle } from "./scenes1";

const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080 };

const Kaaba: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={20} cy={8} rx={300} ry={46} fill="#f6eedd" />
    <path d="M -120 0 L -120 -240 L 120 -240 L 120 0 Z" fill="#1d1d1f" />
    <path d="M 120 0 L 120 -240 L 190 -270 L 190 -30 Z" fill="#101012" />
    <path d="M -120 -240 L -50 -270 L 190 -270 L 120 -240 Z" fill="#2a2a2d" />
    <path d="M -120 -178 L 120 -178 L 120 -150 L -120 -150 Z" fill="#d8b25a" />
    <path d="M 120 -178 L 190 -208 L 190 -180 L 120 -150 Z" fill="#b8913d" />
    {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={-105 + i * 30} cy={-164} r={4} fill="#8a6a2a" />)}
    <rect x={40} y={-110} width={50} height={90} rx={4} fill="#d8b25a" />
  </g>
);

const Mountains: React.FC<{ base?: number }> = ({ base = 760 }) => (
  <g>
    <path d={`M 0 ${base - 220} L 160 ${base - 330} L 330 ${base - 250} L 520 ${base - 380} L 700 ${base - 270} L 900 ${base - 340} L 1100 ${base - 240} L 1320 ${base - 360} L 1520 ${base - 260} L 1720 ${base - 350} L 1920 ${base - 240} L 1920 ${base} L 0 ${base} Z`} fill="#d9aa7c" />
    <path d={`M 0 ${base - 120} L 220 ${base - 220} L 420 ${base - 140} L 640 ${base - 230} L 860 ${base - 150} L 1080 ${base - 210} L 1300 ${base - 130} L 1560 ${base - 230} L 1920 ${base - 120} L 1920 ${base} L 0 ${base} Z`} fill="#c28a5b" />
  </g>
);

const HOUSES = (() => { const r = prng(5); return Array.from({ length: 26 }, (_, i) => ({ x: -40 + i * 78 + r() * 20, w: 70 + r() * 60, h: 70 + r() * 90, c: ["#e9cc9d", "#ddb985", "#efd7ad", "#d3ac78"][i % 4], row: i % 2 })); })();
const Town: React.FC = () => (
  <g>
    {HOUSES.map((h, i) => {
      const y = 790 + h.row * 34;
      if (h.x > 760 && h.x < 1190 && h.row === 1) return null;
      return (
        <g key={i}>
          <rect x={h.x} y={y - h.h} width={h.w} height={h.h} fill={h.c} />
          <rect x={h.x - 4} y={y - h.h - 8} width={h.w + 8} height={10} fill="#c69b66" />
          <rect x={h.x + h.w * 0.25} y={y - h.h * 0.7} width={14} height={20} rx={7} fill="#7a5532" />
          {h.w > 100 ? <rect x={h.x + h.w * 0.6} y={y - h.h * 0.7} width={14} height={20} rx={7} fill="#7a5532" /> : null}
        </g>
      );
    })}
  </g>
);

const WALKERS = (() => { const r = prng(9); const robes = ["#f4f1ea", "#d9c9a8", "#8f6b4a", "#b5c2c9", "#e7dcc2"]; const cloths = ["#ffffff", "#e9e1cc", "#c9b48f", "#f2ece0"]; const skins = ["#d4a37c", "#b98b62", "#e2b996", "#a87652"]; return Array.from({ length: 9 }, (_, i) => ({ x0: r() * 1920, sp: (r() > 0.5 ? 1 : -1) * (40 + r() * 40), robe: robes[i % 5], cloth: cloths[i % 4], skin: skins[i % 4], s: 0.38 + r() * 0.12, y: 905 + r() * 50 })); })();

/* ============================ MAKKAH ============================ */
export const Makkah: React.FC = () => {
  const t = useT();
  const sc = SC("makkah");
  const zoom = interpolate(t, [sc.start, sc.start + 4, sc.end], [1.35, 1.08, 1.0], { ...clamp, easing: INO });
  const nameA = WT("l17", "beloved"), nameB = S("l18") + 1.5;
  const lies = [WT("l19", "big"), WT("l19", "small"), WT("l19", "joke")];
  const amin = WT("l20", "beautiful");
  return (
    <div style={{ ...full, overflow: "hidden" }}>
      <div style={{ ...full, scale: String(zoom), transformOrigin: "50% 75%" }}>
        <svg viewBox="0 0 1920 1080" style={full}>
          <Defs />
          <defs><linearGradient id="mkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffcf94" /><stop offset="100%" stopColor="#fff1d8" /></linearGradient></defs>
          <rect width={1920} height={1080} fill="url(#mkSky)" />
          <circle cx={1500} cy={230} r={260} fill="url(#sunGlow)" />
          <circle cx={1500} cy={230} r={80} fill="#fff4c9" />
          <Mountains />
          <rect y={760} width={1920} height={320} fill="#e8c99a" />
          <Town />
          <ellipse cx={980} cy={880} rx={520} ry={70} fill="#f3ead8" />
          <Kaaba x={960} y={880} s={0.95} />
          <rect y={940} width={1920} height={140} fill="#e2bf8d" />
          {WALKERS.map((w, i) => {
            const x = ((w.x0 + w.sp * t) % 2100 + 2100) % 2100 - 90;
            return <Person key={i} x={x} y={w.y + 40} s={w.s} robe={w.robe} cloth={w.cloth} skin={w.skin} flip={w.sp < 0} bob={4 * Math.abs(Math.sin(t * 6 + i))} sway={3 * Math.sin(t * 6 + i)} />;
          })}
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", opacity: fadeIO(t, sc.start + 0.3, nameA - 0.2, 0.3) }}>
        <PopText text="MAKKAH" t={t} at={sc.start + 0.4} size={150} color="#ffffff" stagger={0.06} />
      </div>
      <Bubble x={1080} y={430} w={520} text={<>The Kaaba<br /><span style={{ fontSize: 38 }}>House of Allah</span></>} t={t} at={WT("l16", "kaaba")} until={nameA - 0.2} tail="left" color="#fff4c9" />
      {/* the Prophet's blessed name — calligraphy only, never a figure */}
      <div style={{ position: "absolute", left: 360, right: 360, top: 70, textAlign: "center", opacity: fadeIO(t, nameA, nameB, 0.5) }}>
        <div style={{ position: "absolute", left: "50%", marginLeft: -420, top: -60, width: 840, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,246,207,0.95) 0%, rgba(255,224,138,0.35) 45%, rgba(255,224,138,0) 70%)" }} />
        <div dir="rtl" lang="ar" style={{ position: "relative", fontFamily: AMIRI, fontWeight: 700, fontSize: 200, lineHeight: 1.1, color: "#8f5f1c", textShadow: "0 0 24px rgba(255,248,215,1), 0 0 4px rgba(255,248,215,1)", scale: String(0.9 + 0.1 * tw(t, nameA, 1.2, 0, 1)) }}>مُحَمَّد ﷺ</div>
        <div style={{ position: "relative", fontFamily: BALOO, fontWeight: 800, fontSize: 64, color: "#5a3a1a" }}>Sayyiduna Muhammad</div>
        <div style={{ position: "relative", fontFamily: NUN, fontWeight: 800, fontSize: 36, color: "#7a5532" }}>({SAL_TXT})</div>
      </div>
      {/* no lies */}
      {["Big lie", "Small lie", "Joke lie"].map((w, i) => {
        const at = lies[i];
        const o = fadeIO(t, at - 0.1, S("l20") + 0.2, 0.2);
        return (
          <div key={w} style={{ position: "absolute", left: 300 + i * 470, top: 180, width: 380, opacity: o, scale: String(pop(t, at - 0.1, 0.45)) }}>
            <div style={{ background: "#fff", border: "6px solid #2b2340", borderRadius: 34, padding: "26px 0", textAlign: "center", fontFamily: BALOO, fontWeight: 800, fontSize: 66, color: "#2b2340", position: "relative" }}>
              {w}
              <svg viewBox="0 0 380 140" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
                <line x1={40} y1={20} x2={340} y2={120} stroke="#e0473f" strokeWidth={16} strokeLinecap="round" strokeDasharray={330} strokeDashoffset={330 * (1 - tw(t, at + 0.25, 0.3, 0, 1))} />
              </svg>
            </div>
          </div>
        );
      })}
      {/* Al-Ameen */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", opacity: fadeIO(t, amin, sc.end, 0.4) }}>
        <div style={{ display: "inline-block", background: "rgba(255,250,235,0.92)", border: "8px solid #b8863a", borderRadius: 50, padding: "20px 90px 30px", scale: String(pop(t, amin, 0.6)) }}>
          <div dir="rtl" lang="ar" style={{ fontFamily: AMIRI, fontWeight: 700, fontSize: 170, lineHeight: 1.2, color: "#b8863a" }}>الأَمِين</div>
          <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 84, color: "#2b2340", lineHeight: 1 }}>Al-Ameen</div>
          <div style={{ fontFamily: NUN, fontWeight: 900, fontSize: 48, color: "#7a5532", opacity: tw(t, WT("l20", "means"), 0.4, 0, 1) }}>The Trustworthy One</div>
        </div>
      </div>
      <Sparkle t={t} at={amin + 0.3} x={960} y={330} n={24} />
    </div>
  );
};

/* ============================ SAFA ============================ */
const CROWD = (() => {
  const r = prng(31);
  const robes = ["#f4f1ea", "#d9c9a8", "#8f6b4a", "#b5c2c9", "#e7dcc2", "#a3876a", "#cfd8d2"];
  const cloths = ["#ffffff", "#e9e1cc", "#c9b48f", "#f2ece0", "#d8d0bc"];
  const skins = ["#d4a37c", "#b98b62", "#e2b996", "#a87652", "#c99a72"];
  return Array.from({ length: 16 }, (_, i) => {
    const right = i % 2 === 0;
    const tx = right ? 1000 + r() * 760 : 80 + r() * 330;
    return { right, tx, y: 940 + r() * 80, s: 0.62 + r() * 0.2, delay: r() * 2.2, robe: robes[i % 7], cloth: cloths[i % 5], skin: skins[i % 5] };
  }).sort((a, b) => a.y - b.y);
})();

export const Safa: React.FC = () => {
  const t = useT();
  const sc = SC("safa");
  const glow = tw(t, S("l21") + 0.3, 1.5, 0.3, 1) + 0.35 * tw(t, S("l28"), 1.5, 0, 1);
  const callAt = WT("l22", "called");
  const comeAt = S("l23");
  const armyAt = WT("l24", "army");
  const yesAt = WT("l26", "yes");
  const camZ = interpolate(t, [sc.start, sc.start + 5, S("l24"), S("l24") + 1.5, S("l26"), S("l26") + 1], [1.18, 1.0, 1.0, 1.06, 1.06, 1.0], { ...clamp, easing: INO });
  return (
    <div style={{ ...full, overflow: "hidden" }}>
      <div style={{ ...full, scale: String(camZ) }}>
        <svg viewBox="0 0 1920 1080" style={full}>
          <Defs />
          <defs><linearGradient id="sfSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a9dcff" /><stop offset="100%" stopColor="#fff3d9" /></linearGradient></defs>
          <rect width={1920} height={1080} fill="url(#sfSky)" />
          <Mountains base={800} />
          <rect y={800} width={1920} height={280} fill="#e6c595" />
          <Kaaba x={1560} y={850} s={0.42} />
          {/* imagined army: only a dust cloud and banner tips behind the hill, no figures */}
          <g opacity={fadeIO(t, armyAt, S("l25") + 0.4, 0.4)} transform={`translate(${interpolate(t, [armyAt, S("l25")], [140, 0], clamp)},0)`}>
            {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={1000 + i * 70} cy={640 - (i % 2) * 30} r={70 + (i % 3) * 20} fill="#d8b98f" opacity={0.75} />)}
            {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${1030 + i * 90},${560 - (i % 2) * 20})`}><line x1={0} y1={0} x2={0} y2={-120} stroke="#6b4a2a" strokeWidth={6} /><path d="M 0 -120 L 50 -105 L 0 -90 Z" fill="#b8423a" /></g>)}
            <text x={1180} y={400} textAnchor="middle" fontFamily={BALOO} fontWeight={800} fontSize={44} fill="#5a3a1a">imagine...</text>
          </g>
          {/* Mount Safa */}
          <path d="M 220 900 Q 330 640 520 560 Q 600 520 700 545 Q 860 600 1000 900 Z" fill="#b98457" />
          <path d="M 330 900 Q 420 720 560 640 Q 640 600 720 640 Q 840 720 900 900 Z" fill="#a8744a" />
          {[[420, 760], [600, 700], [760, 780], [520, 840], [680, 860]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={40} ry={18} fill="#8f5f3b" opacity={0.6} />)}
          {/* the call — light only */}
          <g transform="translate(610,540)">
            <g transform={`rotate(${t * 8})`} opacity={0.2 * glow}>
              {Array.from({ length: 16 }, (_, i) => <path key={i} d="M 0 0 L 40 -700 L -40 -700 Z" fill="#fff3c4" transform={`rotate(${i * 22.5})`} />)}
            </g>
            <circle r={260 * glow} fill="url(#softGlow)" />
            {[0, 1, 2].map((k) => {
              const u = (t - callAt - k * 0.5) / 1.6;
              if (u < 0 || u > 1) return null;
              return <circle key={k} r={40 + 520 * u} fill="none" stroke="#fff6d0" strokeWidth={10 * (1 - u)} opacity={1 - u} />;
            })}
          </g>
          {CROWD.map((p, i) => {
            const at = comeAt - 0.6 + p.delay;
            const u = tw(t, at, 2.4, 0, 1, INO);
            const x0 = p.right ? 2050 : -150;
            const x = x0 + (p.tx - x0) * u;
            const moving = u > 0 && u < 1;
            const cheer = t > yesAt - 0.1 && t < yesAt + 2.2 ? 1 : 0;
            return <Person key={i} x={x} y={p.y} s={p.s * 1.4} robe={p.robe} cloth={p.cloth} skin={p.skin} flip={p.right} bob={moving ? 8 * Math.abs(Math.sin(t * 9 + i)) : cheer * 12 * Math.abs(Math.sin(t * 8 + i))} sway={moving ? 4 * Math.sin(t * 9 + i) : 0} armUp={cheer ? 120 : 0} />;
          })}
        </svg>
      </div>
      <div style={{ position: "absolute", left: 60, top: 60, opacity: fadeIO(t, WT("l22", "safa") - 0.2, S("l24"), 0.3), scale: String(pop(t, WT("l22", "safa") - 0.2, 0.5)) }}>
        <div style={{ background: "#fff4c9", border: "6px solid #2b2340", borderRadius: 30, padding: "10px 34px", fontFamily: BALOO, fontWeight: 800, fontSize: 60, color: "#2b2340" }}>Mount Safa</div>
      </div>
      <Bubble x={1150} y={430} w={400} text="What is it?" t={t} at={WT("l23", "what")} until={S("l24")} color="#fff" />
      <Bubble x={1450} y={560} w={420} text="What's happening?" t={t} at={WT("l23", "happening") - 0.3} until={S("l24")} color="#fff" size={42} />
      {/* question on a parchment scroll (his words, quoted — no figure) */}
      <div style={{ position: "absolute", left: 260, right: 260, top: 40, opacity: fadeIO(t, S("l24"), S("l26") + 0.1, 0.4), scale: String(0.9 + 0.1 * pop(t, S("l24"), 0.6)) }}>
        <div style={{ background: "linear-gradient(180deg,#fff7e3,#f3e2bd)", border: "6px solid #8a5a3c", borderRadius: 26, padding: "26px 50px", textAlign: "center", fontFamily: NUN, fontWeight: 800, fontSize: 48, lineHeight: 1.25, color: "#3a2614", boxShadow: "0 12px 0 rgba(0,0,0,0.15)" }}>
          “If I told you that an army was in the valley, coming to attack you… would you believe me?”
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", opacity: fadeIO(t, S("l25"), yesAt - 0.1, 0.2) }}>
        <span style={{ display: "inline-block", background: "#2b2340", color: "#ffd34d", fontFamily: BALOO, fontWeight: 800, fontSize: 80, padding: "10px 50px", borderRadius: 40, scale: String(pop(t, S("l25"), 0.5)) }}>What did they say?</span>
      </div>
      {[[1080, 560], [1320, 470], [1580, 560], [140, 560], [340, 480]].map(([x, y], i) => (
        <Bubble key={i} x={x} y={y} w={220} text="YES!" t={t} at={yesAt + i * 0.12} until={S("l27") + 0.6} color="#d9ffe6" size={58} />
      ))}
      <div style={{ position: "absolute", left: 200, right: 200, top: 60, textAlign: "center", opacity: fadeIO(t, WT("l26", "never") - 0.1, S("l27") + 0.3, 0.3) }}>
        <div style={{ display: "inline-block", background: "#ffffff", border: "6px solid #2b2340", borderRadius: 30, padding: "18px 40px", fontFamily: BALOO, fontWeight: 800, fontSize: 56, color: "#2b2340", lineHeight: 1.15 }}>
          “We have never found you saying<br />anything except the <span style={{ color: "#2fa36b" }}>truth!</span>”
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", opacity: fadeIO(t, S("l27"), S("l28"), 0.3) }}>
        <PopText text="SubhanAllah!" t={t} at={S("l27")} size={140} color="#ffd34d" />
      </div>
      <Sparkle t={t} at={S("l27") + 0.2} x={960} y={220} n={22} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", opacity: fadeIO(t, WT("l28", "allah") - 0.2, sc.end, 0.4) }}>
        <div dir="rtl" lang="ar" style={{ fontFamily: AMIRI, fontWeight: 700, fontSize: 190, lineHeight: 1.15, color: "#b8863a", textShadow: "0 0 36px rgba(255,246,207,1)" }}>الله</div>
        <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 64, color: "#2b2340" }}>Worship Allah alone</div>
      </div>
      <div style={{ position: "absolute", right: 50, top: 40, fontFamily: NUN, fontWeight: 800, fontSize: 30, color: "#2b2340", opacity: 0.75 }}>Sahih al-Bukhari 4770</div>
    </div>
  );
};

/* ============================ HADITH (path to Jannah) ============================ */
const PATH = (u: number): [number, number] => {
  // bezier-ish winding path from bottom-left to the gate
  const x = 180 + 1300 * u + 120 * Math.sin(u * Math.PI * 2.2);
  const y = 1000 - 560 * Math.pow(u, 0.9) + 40 * Math.sin(u * Math.PI * 3);
  return [x, y];
};
const FLOWERS = (() => { const r = prng(41); return Array.from({ length: 40 }, () => ({ x: r() * 1920, y: 700 + r() * 360, c: ["#ff8fb1", "#ffd34d", "#ffffff", "#c79bff"][Math.floor(r() * 4)], s: 6 + r() * 8 })); })();

export const Hadith: React.FC = () => {
  const t = useT();
  const sc = SC("hadith");
  const a1 = WT("l30", "truthfulness"), a2 = WT("l30", "goodness"), a3 = WT("l30", "paradise");
  const prog = interpolate(t, [a1, a3 + 0.6, E("l31")], [0.03, 0.85, 1], { ...clamp, easing: INO });
  const [ox, oy] = PATH(prog);
  const signs = [{ u: 0.1, label: "Truth", at: a1, c: "#2fa36b" }, { u: 0.5, label: "Goodness", at: a2, c: "#4a8fe0" }];
  return (
    <div style={{ ...full, overflow: "hidden" }}>
      <svg viewBox="0 0 1920 1080" style={full}>
        <Defs />
        <defs><linearGradient id="hdSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffd1e0" /><stop offset="55%" stopColor="#ffe9c7" /><stop offset="100%" stopColor="#fff7e3" /></linearGradient></defs>
        <rect width={1920} height={1080} fill="url(#hdSky)" />
        <path d="M 0 640 Q 400 520 800 600 T 1920 560 L 1920 1080 L 0 1080 Z" fill="#9bd48a" />
        <path d="M 0 760 Q 500 660 1000 740 T 1920 700 L 1920 1080 L 0 1080 Z" fill="#7cc46f" />
        {FLOWERS.map((f, i) => <circle key={i} cx={f.x} cy={f.y} r={f.s} fill={f.c} />)}
        {[[260, 640, 70], [420, 600, 54], [1720, 600, 80], [1840, 650, 56], [980, 600, 46]].map(([x, y, r], i) => (
          <g key={i}><rect x={x - 8} y={y} width={16} height={r * 1.1} fill="#8a5a3c" /><circle cx={x} cy={y} r={r} fill="#5cae5a" /><circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.55} fill="#6fc26a" /></g>
        ))}
        {/* gate of Jannah */}
        <g transform="translate(1500,470)">
          <circle r={330} fill="url(#softGlow)" opacity={0.5 + 0.5 * tw(t, a3, 0.8, 0, 1)} />
          <path d="M -150 120 L -150 -60 Q -150 -200 0 -230 Q 150 -200 150 -60 L 150 120 Z" fill="#fff6d0" stroke="#d8b25a" strokeWidth={18} />
          <path d="M -100 120 L -100 -40 Q -100 -150 0 -170 Q 100 -150 100 -40 L 100 120 Z" fill="#fffdf3" opacity={0.9} />
          <text x={0} y={-262} textAnchor="middle" fontFamily={BALOO} fontWeight={800} fontSize={62} fill="#b8863a">Jannah</text>
        </g>
        {/* stepping stones */}
        {Array.from({ length: 22 }, (_, i) => {
          const u = i / 21;
          const [x, y] = PATH(u);
          const lit = prog >= u;
          return <ellipse key={i} cx={x} cy={y} rx={50 - 26 * u} ry={20 - 10 * u} fill={lit ? "#ffe8a3" : "#e9e1cf"} stroke="#b9a98a" strokeWidth={3} />;
        })}
        {signs.map((s, i) => {
          const [x, y] = PATH(s.u);
          const p = pop(t, s.at, 0.5);
          return (
            <g key={i} transform={`translate(${x + 40},${y - 30}) scale(${p})`}>
              <rect x={-4} y={-150} width={10} height={150} fill="#8a5a3c" />
              <rect x={-140} y={-230} width={280} height={90} rx={20} fill="#fff" stroke={s.c} strokeWidth={8} />
              <text x={0} y={-170} textAnchor="middle" fontFamily={BALOO} fontWeight={800} fontSize={52} fill={s.c}>{s.label}</text>
            </g>
          );
        })}
        <circle cx={ox} cy={oy - 30} r={34} fill="url(#softGlow)" opacity={t > a1 ? 1 : 0} />
        <circle cx={ox} cy={oy - 30} r={12} fill="#fffbe8" opacity={t > a1 ? 1 : 0} />
      </svg>
      <div style={{ position: "absolute", left: 70, top: 50, width: 1000, opacity: fadeIO(t, sc.start + 0.4, sc.end, 0.4) }}>
        <div style={{ background: "rgba(255,255,255,0.92)", border: "6px solid #2b2340", borderRadius: 34, padding: "24px 40px" }}>
          <div style={{ fontFamily: NUN, fontWeight: 800, fontSize: 34, color: "#7a5532" }}>Our beloved Prophet ({SAL_TXT}) taught us:</div>
          <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 58, lineHeight: 1.15, color: "#2b2340", marginTop: 8, opacity: tw(t, a1 - 0.2, 0.4, 0, 1) }}>
            “Truthfulness leads to <span style={{ color: "#4a8fe0" }}>goodness</span>, and goodness leads to <span style={{ color: "#b8863a" }}>Paradise</span>.”
          </div>
          <div style={{ fontFamily: NUN, fontWeight: 900, fontSize: 30, color: "#2fa36b", marginTop: 8, opacity: tw(t, WT("l31", "bukhari") - 0.2, 0.4, 0, 1) }}>Sahih al-Bukhari 6094</div>
        </div>
      </div>
    </div>
  );
};
