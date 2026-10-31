import React from "react";
import { interpolate } from "remotion";
import { AMIRI, BALOO, Bubble, Defs, E, Kid, LINES, Mum, NUN, PopText, S, SAL_TXT, SC, WT, clamp, fadeIO, pop, prng, tw, useT, INO } from "./kit";
import { NightSky, Sparkle } from "./scenes1";

const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080 };

/* ============================ KITCHEN ============================ */
export const Kitchen: React.FC = () => {
  const t = useT();
  const sc = SC("kitchen");
  const w0 = S("l33") + 0.2, w1 = S("l33") + 3.2;
  const yx = interpolate(t, [w0, w1], [-260, 820], { ...clamp, easing: INO });
  const walking = t > w0 && t < w1;
  const hugAt = WT("l35", "hug") - 0.3;
  const mumX = interpolate(t, [hugAt - 0.6, hugAt + 0.4], [1440, 1080], { ...clamp, easing: INO });
  const hug = tw(t, hugAt, 0.4, 0, 1);
  const happy = t > S("l37");
  const ph = t * 9;
  const pose = walking
    ? { armL: 60, armR: 60, legL: 22 * Math.sin(ph), legR: -22 * Math.sin(ph), tilt: 0 }
    : t < hugAt ? { armL: 60, armR: 60, tilt: 12 } : happy ? { armL: 150 + 20 * Math.sin(t * 8), armR: -150 - 20 * Math.sin(t * 8), tilt: 0 } : { armL: 20, armR: 50, tilt: 0 };
  const bob = walking ? 6 * Math.abs(Math.sin(ph)) : happy ? 40 * Math.abs(Math.sin(t * 5)) : 2 * Math.sin(t * 2);
  const holdingTray = t < hugAt;
  const hearts = t > hugAt + 0.3;
  return (
    <div style={{ ...full, overflow: "hidden" }}>
      <svg viewBox="0 0 1920 1080" style={full}>
        <Defs />
        <rect width={1920} height={1080} fill="#d9f2e5" />
        {Array.from({ length: 16 }, (_, i) => Array.from({ length: 4 }, (_, j) => <rect key={`${i}-${j}`} x={1040 + i * 56} y={440 + j * 56} width={52} height={52} fill="#fff" opacity={0.55} />))}
        {/* window with sun */}
        <g transform="translate(300,140)">
          <rect width={460} height={360} rx={16} fill="#fff" />
          <rect x={18} y={18} width={424} height={324} rx={10} fill="#bfe6ff" />
          <circle cx={330} cy={110} r={140} fill="url(#sunGlow)" /><circle cx={330} cy={110} r={46} fill="#fff1a8" />
          <path d="M 18 260 Q 140 220 260 250 T 442 236 L 442 342 L 18 342 Z" fill="#9bd48a" />
          <rect x={226} y={18} width={8} height={324} fill="#fff" />
        </g>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={1040 + i * 220} y={110} width={200} height={230} rx={14} fill="#f6c98d" stroke="#d9a462" strokeWidth={6} />)}
        <rect y={860} width={1920} height={220} fill="#ead3b0" />
        {Array.from({ length: 10 }, (_, i) => <line key={i} x1={i * 200} y1={860} x2={i * 200 - 120} y2={1080} stroke="#d8bd94" strokeWidth={4} />)}
        <rect x={1040} y={660} width={880} height={200} fill="#f6c98d" stroke="#d9a462" strokeWidth={6} />
        <rect x={1020} y={640} width={920} height={30} rx={10} fill="#fff" />
        <rect x={1500} y={600} width={160} height={40} rx={20} fill="#c9d6e0" /><path d="M 1580 600 L 1580 560 Q 1580 540 1600 540" stroke="#9aa9b6" strokeWidth={10} fill="none" />
        <circle cx={1250} cy={620} r={26} fill="#ff8f5b" /><circle cx={1300} cy={624} r={22} fill="#ffd34d" />
        <Mum x={mumX} y={905} s={1.32} flip armL={hug > 0 ? 6 + 110 * hug : 6} armR={hug > 0 ? -6 - 20 * hug : -6} bob={2 * Math.sin(t * 2)} />
        <Kid x={yx} y={905} s={1.4} pose={pose} bob={bob} />
        {holdingTray ? (
          <g transform={`translate(${yx + 100},${905 - 215 - bob}) scale(1.4)`}>
            <rect x={-60} y={-10} width={120} height={22} rx={8} fill="#8a5a3c" />
            <path d="M -40 -10 L -28 -30 L -12 -12 Z M 0 -10 L 14 -34 L 26 -10 Z M 30 -10 L 44 -24 L 50 -10 Z" fill="#4a8fe0" stroke="#2b5aa0" strokeWidth={2} />
          </g>
        ) : null}
        {hearts ? Array.from({ length: 7 }, (_, i) => {
          const u = ((t - hugAt - 0.3) * 0.6 + i / 7) % 1;
          const x = 950 + Math.sin(i * 2.3 + t * 2) * 110 + (i - 3) * 36;
          const y = 470 - u * 360;
          return <path key={i} transform={`translate(${x},${y}) scale(${1.2 - u * 0.6})`} d="M 0 18 C -40 -10 -30 -42 0 -26 C 30 -42 40 -10 0 18 Z" fill="#ff6b8a" opacity={1 - u} />;
        }) : null}
        {happy ? <circle cx={yx} cy={905 - 250} r={330} fill="url(#softGlow)" opacity={0.6} /> : null}
      </svg>
      <Bubble x={300} y={170} w={760} size={46} text={<>“Mum... it was me. I kicked the ball inside, and I broke your vase. <span style={{ color: "#e0473f" }}>I'm really sorry.</span>”</>} t={t} at={S("l34") - 0.1} until={S("l35") + 0.6} tail="right" color="#ffffff" />
      <Bubble x={1010} y={120} w={820} size={44} text={<>“Thank you for telling me the truth, Yusuf. A vase can be fixed. But <span style={{ color: "#2fa36b" }}>trust is very precious.</span> I am proud of you.”</>} t={t} at={S("l36") - 0.1} until={S("l37") + 0.8} tail="left" color="#fff4c9" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", opacity: fadeIO(t, S("l37") + 0.6, sc.end, 0.3) }}>
        <PopText text="Light & happy!" t={t} at={S("l37") + 0.6} size={120} color="#ffd34d" />
      </div>
    </div>
  );
};

/* ============================ RULES ============================ */
const RuleIcon: React.FC<{ k: number }> = ({ k }) => (
  <svg viewBox="-60 -60 120 120" style={{ width: 120, height: 120 }}>
    <circle r={56} fill={["#ff6b8a", "#ffd34d", "#7fd8ff"][k]} stroke="#2b2340" strokeWidth={6} />
    {k === 0 ? <g><path d="M 0 -34 L 30 -22 L 26 12 Q 18 32 0 40 Q -18 32 -26 12 L -30 -22 Z" fill="#fff" stroke="#2b2340" strokeWidth={4} /><path d="M 0 14 C -20 0 -14 -18 0 -8 C 14 -18 20 0 0 14 Z" fill="#ff4d6d" /></g> : null}
    {k === 1 ? <g><rect x={-34} y={-26} width={68} height={44} rx={14} fill="#fff" stroke="#2b2340" strokeWidth={4} /><text x={0} y={4} textAnchor="middle" fontFamily={BALOO} fontWeight={800} fontSize={22} fill="#2b2340">ha ha</text><line x1={-40} y1={-40} x2={40} y2={40} stroke="#e0473f" strokeWidth={8} strokeLinecap="round" /></g> : null}
    {k === 2 ? <g transform="rotate(-35)"><rect x={-40} y={-15} width={80} height={30} rx={15} fill="#f7d6b0" stroke="#2b2340" strokeWidth={4} /><rect x={-12} y={-15} width={24} height={30} fill="#efc192" /><circle cx={-4} cy={-5} r={2.5} fill="#b9895a" /><circle cx={5} cy={5} r={2.5} fill="#b9895a" /></g> : null}
  </svg>
);

export const Rules: React.FC = () => {
  const t = useT();
  const sc = SC("rules");
  const items = [
    { at: WT("r2", "one"), text: "Tell the truth, even when it feels scary.", ref: "" },
    { at: WT("r3", "two"), text: "No joke lies!", ref: "Jami' at-Tirmidhi 2315" },
    { at: WT("r4", "three"), text: "Made a mistake? Say sorry, and fix it.", ref: "" },
  ];
  const quranAt = S("r5");
  return (
    <div style={{ ...full, overflow: "hidden" }}>
      <svg viewBox="0 0 1920 1080" style={full}>
        <rect width={1920} height={1080} fill="#fdf0d2" />
        <rect y={880} width={1920} height={200} fill="#d9a87a" />
        <rect x={130} y={110} width={1260} height={700} rx={24} fill="#8a5a3c" />
        <rect x={160} y={140} width={1200} height={640} rx={14} fill="#2f6b4f" />
        <Kid x={1640} y={890} s={1.05} flip pose={{ armL: 6, armR: 130 + 8 * Math.sin(t * 3), tilt: -6 }} bob={3 * Math.sin(t * 2)} />
      </svg>
      <div style={{ position: "absolute", left: 160, width: 1200, top: 160, textAlign: "center" }}>
        <PopText text="3 Golden Truth Rules" t={t} at={sc.start + 0.6} size={88} color="#ffffff" stroke="#1d4634" stagger={0.03} />
      </div>
      {items.map((it, i) => (
        <div key={i} style={{ position: "absolute", left: 210, top: 300 + i * 150, width: 1110, display: "flex", alignItems: "center", gap: 30, opacity: tw(t, it.at - 0.1, 0.3, 0, 1), translate: `${tw(t, it.at - 0.1, 0.5, -60, 0)}px 0px` }}>
          <div style={{ scale: String(pop(t, it.at, 0.5)) }}><RuleIcon k={i} /></div>
          <div>
            <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 58, color: "#ffffff", lineHeight: 1.05 }}>{i + 1}. {it.text}</div>
            {it.ref ? <div style={{ fontFamily: NUN, fontWeight: 800, fontSize: 28, color: "#cfeedd", opacity: tw(t, it.at + 1.2, 0.4, 0, 1) }}>{it.ref}</div> : null}
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", inset: 0, background: "rgba(20,30,25,0.55)", opacity: fadeIO(t, quranAt - 0.1, sc.end, 0.35) }} />
      <div style={{ position: "absolute", left: 260, right: 260, top: 240, opacity: fadeIO(t, quranAt - 0.1, sc.end, 0.35), scale: String(0.85 + 0.15 * pop(t, quranAt - 0.1, 0.6)) }}>
        <div style={{ background: "#fffaf0", border: "8px solid #b8863a", borderRadius: 40, padding: "30px 50px", textAlign: "center", boxShadow: "0 20px 0 rgba(0,0,0,0.15)" }}>
          <div dir="rtl" lang="ar" style={{ fontFamily: AMIRI, fontWeight: 700, fontSize: 104, lineHeight: 1.4, color: "#b8863a" }}>وَكُونُوا مَعَ الصَّادِقِينَ</div>
          <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 62, color: "#2b2340" }}>“Be with those who are truthful.”</div>
          <div style={{ fontFamily: NUN, fontWeight: 900, fontSize: 34, color: "#2fa36b", marginTop: 6 }}>Quran · Surah At-Tawbah 9:119</div>
        </div>
      </div>
    </div>
  );
};

/* ============================ QUIZ ============================ */
const QUIZ = [
  { q: "l39", a: "l40", qText: "What did the people of Makkah call our Prophet?", sub: `(${SAL_TXT})`, aText: "Al-Ameen — the Trustworthy One!" },
  { q: "l41", a: "l42", qText: "What does truthfulness lead to?", sub: "", aText: "Goodness... and then Paradise!" },
  { q: "l43", a: "l44", qText: "What should we do when we make a mistake?", sub: "", aText: "Tell the truth, and say sorry!" },
];
const Confetti: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  if (t < at || t > at + 2) return null;
  const u = (t - at) / 2;
  const r = prng(Math.round(at * 10));
  return (
    <svg viewBox="0 0 1920 1080" style={{ ...full, pointerEvents: "none" }}>
      {Array.from({ length: 70 }, (_, i) => {
        const x0 = 960 + (r() - 0.5) * 300, vx = (r() - 0.5) * 1800, vy = -600 - r() * 700;
        const x = x0 + vx * u, y = 520 + vy * u + 1400 * u * u;
        return <rect key={i} x={x} y={y} width={16} height={10} fill={["#ffd34d", "#ff6b8a", "#7fd8ff", "#9be38a", "#c79bff"][i % 5]} transform={`rotate(${u * 900 + i * 37} ${x} ${y})`} opacity={1 - u * 0.5} />;
      })}
    </svg>
  );
};

export const Quiz: React.FC = () => {
  const t = useT();
  const sc = SC("quiz");
  const cur = QUIZ.reduce((acc, q, i) => (t >= S(q.q) - 0.3 ? i : acc), -1);
  const stars = QUIZ.filter((q) => t >= S(q.a)).length;
  return (
    <div style={{ ...full, overflow: "hidden", background: "radial-gradient(circle at 50% 40%, #6a4bc4 0%, #3b2a7a 60%, #21184a 100%)" }}>
      <svg viewBox="0 0 1920 1080" style={full}>
        <g transform={`translate(960,540) rotate(${t * 10})`} opacity={0.18}>
          {Array.from({ length: 12 }, (_, i) => <path key={i} d="M 0 0 L 160 -1400 L -160 -1400 Z" fill="#fff" transform={`rotate(${i * 30})`} />)}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center" }}>
        <PopText text="QUIZ TIME!" t={t} at={sc.start + 0.6} size={130} color="#ffd34d" />
      </div>
      <div style={{ position: "absolute", right: 70, top: 80, display: "flex", gap: 14 }}>
        {[0, 1, 2].map((i) => (
          <svg key={i} viewBox="-50 -50 100 100" style={{ width: 80, height: 80, scale: String(i < stars ? 1 + 0.4 * (1 - tw(t, S(QUIZ[i].a), 0.5, 0, 1)) : 1) }}>
            <path d="M 0 -44 L 13 -14 L 44 -12 L 20 9 L 27 41 L 0 24 L -27 41 L -20 9 L -44 -12 L -13 -14 Z" fill={i < stars ? "#ffd34d" : "#4b3a8c"} stroke="#21184a" strokeWidth={5} />
          </svg>
        ))}
      </div>
      {cur >= 0 ? (() => {
        const q = QUIZ[cur];
        const qa = S(q.q), aa = S(q.a);
        const left = Math.max(0, Math.ceil(aa - t));
        const counting = t > E(q.q) && t < aa;
        const revealed = t >= aa;
        return (
          <div key={cur} style={{ position: "absolute", left: 200, right: 200, top: 270, textAlign: "center", scale: String(pop(t, qa - 0.3, 0.5)) }}>
            <div style={{ background: "#ffffff", border: "8px solid #21184a", borderRadius: 40, padding: "30px 50px", boxShadow: "0 18px 0 rgba(0,0,0,0.25)" }}>
              <div style={{ fontFamily: NUN, fontWeight: 900, fontSize: 40, color: "#6a4bc4" }}>Question {cur + 1}</div>
              <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 70, lineHeight: 1.1, color: "#21184a" }}>{q.qText}</div>
              {q.sub ? <div style={{ fontFamily: NUN, fontWeight: 800, fontSize: 32, color: "#7a5532" }}>{q.sub}</div> : null}
            </div>
            <div style={{ marginTop: 40, height: 200, position: "relative" }}>
              {counting ? (
                <div style={{ display: "inline-flex", width: 190, height: 190, borderRadius: 95, background: "#ffd34d", border: "8px solid #21184a", alignItems: "center", justifyContent: "center", fontFamily: BALOO, fontWeight: 800, fontSize: 120, color: "#21184a", scale: String(1 + 0.15 * (1 - ((aa - t) % 1))) }}>{left}</div>
              ) : null}
              {revealed ? (
                <div style={{ display: "inline-block", background: "#2fa36b", border: "8px solid #21184a", borderRadius: 40, padding: "24px 60px", fontFamily: BALOO, fontWeight: 800, fontSize: 76, color: "#ffffff", scale: String(pop(t, aa, 0.5)) }}>✓ {q.aText}</div>
              ) : null}
            </div>
          </div>
        );
      })() : null}
      {QUIZ.map((q, i) => <Confetti key={i} t={t} at={S(q.a)} />)}
    </div>
  );
};

/* ============================ OUTRO ============================ */
export const Outro: React.FC = () => {
  const t = useT();
  const sc = SC("outro");
  const end = sc.end;
  return (
    <div style={{ ...full, overflow: "hidden" }}>
      <NightSky t={t} />
      <svg viewBox="0 0 1920 1080" style={full}>
        <Kid x={330} y={990} s={1.0} pose={{ armL: 8, armR: -150 - 25 * Math.sin(t * 7), tilt: 0 }} bob={3 * Math.sin(t * 2)} />
      </svg>
      <div style={{ position: "absolute", left: 520, right: 120, top: 360, textAlign: "center", opacity: fadeIO(t, S("l45") - 0.1, S("l46"), 0.4) }}>
        <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 84, lineHeight: 1.1, color: "#fff4dc", WebkitTextStroke: "4px #21184a", paintOrder: "stroke fill" }}>Tell the truth in everything we say</div>
        <div style={{ fontFamily: NUN, fontWeight: 800, fontSize: 38, color: "#ffd34d", marginTop: 14 }}>just like our beloved Prophet ({SAL_TXT})</div>
      </div>
      <div style={{ position: "absolute", left: 520, right: 120, top: 330, textAlign: "center", opacity: fadeIO(t, S("l46") - 0.1, S("l48") - 0.1, 0.4) }}>
        <div style={{ display: "inline-block", background: "rgba(255,250,235,0.95)", border: "8px solid #b8863a", borderRadius: 40, padding: "20px 60px 26px", scale: String(pop(t, S("l46") - 0.1, 0.6)) }}>
          <div style={{ fontFamily: NUN, fontWeight: 900, fontSize: 36, color: "#7a5532" }}>Let's send salawat together</div>
          <div dir="rtl" lang="ar" style={{ fontFamily: AMIRI, fontWeight: 700, fontSize: 100, lineHeight: 1.5, color: "#b8863a" }}>اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ</div>
          <div style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 52, color: "#2b2340", opacity: tw(t, S("l47"), 0.4, 0, 1) }}>Allahumma salli ala Sayyidina Muhammad</div>
        </div>
      </div>
      <Sparkle t={t} at={S("l47") + 0.2} x={1200} y={520} n={22} />
      <div style={{ position: "absolute", left: 520, right: 120, top: 380, textAlign: "center", opacity: tw(t, S("l48") - 0.1, 0.4, 0, 1) }}>
        <PopText text="Allah Hafiz!" t={t} at={WT("l48", "allah")} size={150} color="#ffd34d" />
        <div style={{ fontFamily: NUN, fontWeight: 900, fontSize: 52, color: "#fff4dc", marginTop: 10, opacity: tw(t, S("l48"), 0.4, 0, 1) }}>See you in the next story!</div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: interpolate(t, [end - 0.9, end], [0, 1], clamp) }} />
    </div>
  );
};

/* ============================ CAPTIONS ============================ */
export const Captions: React.FC = () => {
  const t = useT();
  const line = LINES.find((l) => t >= l.start - 0.1 && t < l.end + 0.35);
  if (!line) return null;
  const toks = line.tokens;
  // chunks of up to 6 tokens, breaking after punctuation when possible
  const chunks: number[][] = [];
  let cur: number[] = [];
  toks.forEach((tk, i) => {
    cur.push(i);
    const punct = /[,.!?]$/.test(tk[0]);
    if (cur.length >= 6 || (punct && cur.length >= 3)) { chunks.push(cur); cur = []; }
  });
  if (cur.length) chunks.push(cur);
  let ci = 0;
  chunks.forEach((c, k) => { if (t >= toks[c[0]][1] - 0.05) ci = k; });
  const chunk = chunks[ci];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center" }}>
      <div style={{ display: "inline-block", background: "rgba(25,18,45,0.72)", borderRadius: 26, padding: "8px 30px 12px" }}>
        {chunk.map((i) => {
          const [w, a, b] = toks[i];
          const active = t >= a && t < b + 0.05;
          const done = t >= b;
          return <span key={i} style={{ display: "inline-block", margin: "0 9px", fontFamily: BALOO, fontWeight: 800, fontSize: 54, color: active ? "#ffd34d" : "#ffffff", opacity: active || done ? 1 : 0.55, translate: `0px ${active ? -4 : 0}px` }}>{w}</span>;
        })}
      </div>
    </div>
  );
};
