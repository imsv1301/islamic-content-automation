import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import beats from "../chhap-beats.json";
import { Words, LineCaption, EndCard, pulseAt, STORY_DUR } from "../QawwaliStory";
import { Seeker, Pose, interp, blinkAt } from "./Seeker";

/* Mehfil-e-Sama · animated qawwali (Chhap Tilak). Every shot is drawn and animated in code: the seeker blinks, breathes,
   looks, walks, wades, sinks, rises, cries; the river runs uphill; doors open; qawwals clap on the beat.
   Rules: never depict Allah, the Prophet ﷺ, prophets, Sahaba, Ahl-e-Bait, Awliya (so not Khusrau or Nizamuddin) or any deity
   or another faith's marks; the Beloved is only ever light. No spinning text, no tool branding. */
export const ANIM_DUR = STORY_DUR;
const BEATS = beats.beats as number[];
const W = 1080, H = 1920;
export const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
export const k = (t: number, a: number, b: number) => ease((t - a) / (b - a));
export const prng = (seed: number) => { let v = seed; return () => { v = (v * 16807) % 2147483647; return (v - 1) / 2147483646; }; };
export const clapAt = (t: number, beatList: number[] = BEATS) => { let c = 0; for (const b of beatList) { if (b > t + 0.02) break; c = Math.max(c, Math.exp(-Math.max(0, t - b) / 0.09)); } return c; };

/* ================= shared pieces ================= */
const rS = prng(3);
const STARS = Array.from({ length: 140 }, () => ({ x: rS() * W, y: rS() * 980, r: 0.8 + rS() * 2.4, ph: rS() * 6.28, sp: 0.6 + rS() * 2 }));
export const Stars: React.FC<{ t: number; o?: number }> = ({ t, o = 1 }) => (
  <g opacity={o}>{STARS.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff8e6" opacity={0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph))} />)}</g>
);
export const Glow: React.FC<{ id: string; cx: number; cy: number; r: number; c: string; o?: number }> = ({ id, cx, cy, r, c, o = 1 }) => (
  <>
    <defs><radialGradient id={id}><stop offset="0%" stopColor={c} stopOpacity={1} /><stop offset="100%" stopColor={c} stopOpacity={0} /></radialGradient></defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} opacity={o} />
  </>
);
export const flick = (t: number, s: number) => 0.82 + 0.1 * Math.sin(t * 13 + s) + 0.08 * Math.sin(t * 29 + s * 2.3);
export const PETAL = "M 0 22 C -24 8 -20 -20 0 -24 C 20 -20 24 8 0 22 Z";

/* ================= river that flows uphill ================= */
type P2 = [number, number];
const bez = (p0: P2, p1: P2, p2: P2, p3: P2, u: number): P2 => {
  const m = 1 - u;
  return [m * m * m * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u * u * u * p3[0], m * m * m * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u * u * u * p3[1]];
};
const RIV: P2[] = [[560, 2050], [200, 1560], [860, 1180], [540, 905]];
const SKY: P2[] = [[540, 905], [470, 800], [620, 690], [540, 600]];
const rivPt = (u: number): P2 => (u < 0.82 ? bez(RIV[0], RIV[1], RIV[2], RIV[3], u / 0.82) : bez(SKY[0], SKY[1], SKY[2], SKY[3], (u - 0.82) / 0.18));
const rivW = (u: number) => (u < 0.82 ? 30 + 900 * Math.pow(1 - u / 0.82, 1.7) : 30 * (1 - (u - 0.82) / 0.18) + 4);
const RIVER_POLY = (() => {
  const L: P2[] = [], Rr: P2[] = [];
  for (let i = 0; i <= 120; i++) {
    const u = i / 120, p = rivPt(u), q = rivPt(Math.min(1, u + 0.004)), d = [q[0] - p[0], q[1] - p[1]], n = Math.hypot(d[0], d[1]) || 1;
    const nx = -d[1] / n, ny = d[0] / n, w = rivW(u) / 2;
    L.push([p[0] + nx * w, p[1] + ny * w]); Rr.push([p[0] - nx * w, p[1] - ny * w]);
  }
  return "M " + L.map((p) => p.join(" ")).join(" L ") + " L " + Rr.reverse().map((p) => p.join(" ")).join(" L ") + " Z";
})();
const rR = prng(9);
const STREAKS = Array.from({ length: 110 }, () => ({ u0: rR(), off: rR() * 2 - 1, len: 0.15 + rR() * 0.35, sp: 0.06 + rR() * 0.05, a: 0.35 + rR() * 0.6 }));
const LANTERNS = Array.from({ length: 9 }, (_, i) => ({ u: 0.08 + i * 0.075, side: i % 2 ? 1 : -1 }));

const RiverWorld: React.FC<{ t: number; tag: string }> = ({ t, tag }) => (
  <g>
    <defs>
      <linearGradient id={`sky${tag}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#060818" /><stop offset="40%" stopColor="#141a44" /><stop offset="62%" stopColor="#3a2d63" /><stop offset="100%" stopColor="#120c22" />
      </linearGradient>
      <linearGradient id={`riv${tag}`} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#3f5f9a" /><stop offset="55%" stopColor="#8fb0e0" /><stop offset="100%" stopColor="#f4f7ff" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill={`url(#sky${tag})`} />
    <Stars t={t} />
    <Glow id={`mg${tag}`} cx={540} cy={470} r={330} c="#cfd9ff" o={0.45} />
    <circle cx={540} cy={470} r={92} fill="#f6f2e4" />
    <circle cx={516} cy={452} r={20} fill="#e4ddc8" opacity={0.6} /><circle cx={572} cy={498} r={12} fill="#e4ddc8" opacity={0.5} />
    {/* far dunes */}
    <path d="M 0 930 Q 180 860 380 905 Q 560 945 760 880 Q 930 830 1080 900 L 1080 1920 L 0 1920 Z" fill="#241a3a" />
    <path d="M 0 1040 Q 220 960 460 1030 Q 700 1100 1080 990 L 1080 1920 L 0 1920 Z" fill="#1a1229" />
    {/* the river */}
    <path d={RIVER_POLY} fill={`url(#riv${tag})`} opacity={0.92} />
    {STREAKS.map((s, i) => {
      const u = (s.u0 + t * s.sp) % 1, p = rivPt(u), w = rivW(u);
      const x0 = p[0] + s.off * w * 0.42 - (w * s.len) / 2, x1 = x0 + w * s.len;
      const fade = Math.sin(Math.PI * u);
      return <path key={i} d={`M ${x0} ${p[1]} Q ${(x0 + x1) / 2} ${p[1] - w * 0.03} ${x1} ${p[1]}`} stroke="#ffffff" strokeWidth={Math.max(1, w / 70)} strokeLinecap="round" fill="none" opacity={s.a * fade} />;
    })}
    {/* near banks */}
    <path d="M 0 1380 Q 160 1300 300 1420 Q 330 1700 230 1920 L 0 1920 Z" fill="#0f0a1a" />
    <path d="M 1080 1300 Q 900 1260 820 1400 Q 760 1650 880 1920 L 1080 1920 Z" fill="#0f0a1a" />
    {LANTERNS.map((l, i) => {
      const p = rivPt(l.u), w = rivW(l.u), x = p[0] + l.side * (w / 2 + 30 * (1 - l.u)), s = 1.4 - l.u * 1.3;
      return (
        <g key={i}>
          <Glow id={`ln${tag}${i}`} cx={x} cy={p[1] - 20 * s} r={70 * s} c="#ffb04a" o={flick(t, i) * 0.8} />
          <rect x={x - 6 * s} y={p[1] - 32 * s} width={12 * s} height={20 * s} rx={3 * s} fill="#ffd27a" />
        </g>
      );
    })}
  </g>
);

/* ================= water helpers ================= */
const WaterFront: React.FC<{ t: number; y: number; tag: string; cx?: number; deep?: number }> = ({ t, y, tag, cx = 540, deep = 0.85 }) => (
  <g>
    <defs><linearGradient id={`wf${tag}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6f8fc9" stopOpacity={deep * 0.75} /><stop offset="100%" stopColor="#0d1b3d" stopOpacity={deep} /></linearGradient></defs>
    <path d={`M 0 ${y} ${Array.from({ length: 13 }, (_, i) => `Q ${i * 90 + 45} ${y + Math.sin(t * 3 + i) * 10} ${(i + 1) * 90} ${y}`).join(" ")} L 1080 1920 L 0 1920 Z`} fill={`url(#wf${tag})`} />
    {[0, 1, 2].map((i) => {
      const ph = ((t * 0.6 + i / 3) % 1);
      return <ellipse key={i} cx={cx} cy={y + 6} rx={140 + ph * 380} ry={16 + ph * 40} stroke="#dfe9ff" strokeWidth={3} fill="none" opacity={(1 - ph) * 0.7} />;
    })}
  </g>
);
const rB = prng(21);
const BUBBLES = Array.from({ length: 70 }, () => ({ x: rB() * W, y0: rB() * H, r: 3 + rB() * 12, sp: 120 + rB() * 260, ph: rB() * 6.28 }));

/* ================= scenes (t = global seconds) ================= */
const S_River: React.FC<{ t: number }> = ({ t }) => (
  <g transform={`translate(540 960) scale(${1 + 0.1 * k(t, 0, 5.6)}) translate(-540 -960)`}>
    <RiverWorld t={t} tag="a" />
    {/* the seeker, tiny on the bank, watching */}
    <g transform="translate(250 1510) scale(0.26)" style={{ filter: "brightness(0.35)" }}><Seeker uid="s0" t={t} back /></g>
  </g>
);

const S_Seeker: React.FC<{ t: number }> = ({ t }) => {
  const look = k(t, 6.2, 7.0);
  return (
    <g>
      <g transform={`translate(230 0) translate(540 700) scale(${1.32 + 0.05 * k(t, 5.6, 11.3)}) translate(-540 -700)`}><RiverWorld t={t} tag="b" /></g>
      <g transform={`translate(${330 - 20 * k(t, 5.6, 11.3)} 2000) scale(1.78)`}>
        <Seeker uid="s1" t={t} wind={0.85} blink={blinkAt(t, 1)} gazeY={-0.9 * look} gazeX={0.7 * look} wide={look} brow={0.4 * look} tilt={5 * look} nod={-8 * look}
          mouthOpen={0.25 * k(t, 8.3, 8.8) * (1 - k(t, 10.4, 11))} />
      </g>
    </g>
  );
};

const S_Enter: React.FC<{ t: number }> = ({ t }) => {
  const d = k(t, 11.3, 13.2);
  return (
    <g>
      <g transform="translate(540 1100) scale(1.6) translate(-540 -1100)"><RiverWorld t={t} tag="c" /></g>
      <g transform={`translate(540 ${1900 + 330 * d}) scale(1.35)`}>
        <Seeker uid="s2" t={t} wind={0.4} closed={k(t, 12.2, 12.9)} smile={0.3} lArm={[-26 * d, 10]} rArm={[-26 * d, 10]} float={0.4 * d} />
      </g>
      <WaterFront t={t} y={1240} tag="e" />
    </g>
  );
};

const S_Sink: React.FC<{ t: number }> = ({ t }) => {
  const lt = t - 13.0;
  return (
    <g>
      <defs><linearGradient id="uw" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a6aa0" /><stop offset="45%" stopColor="#0d3160" /><stop offset="100%" stopColor="#030b1c" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#uw)" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 140 + i * 160 + Math.sin(t * 0.8 + i) * 40;
        return <path key={i} d={`M ${x - 30} -20 L ${x + 30} -20 L ${x + 160 + i * 10} 1920 L ${x - 120} 1920 Z`} fill="#bfe3ff" opacity={0.05 + 0.04 * Math.sin(t * 1.7 + i * 1.3)} />;
      })}
      <g transform={`translate(${540 + Math.sin(t * 1.2) * 18} ${1380 + lt * 110}) rotate(${Math.sin(t * 0.9) * 4}) scale(1.25)`}>
        <Seeker uid="s3" t={t} closed={1} smile={0.35} float={1} wind={0.2} lArm={[-32, 14]} rArm={[-32, 14]} />
      </g>
      <rect width={W} height={H} fill="#1d4f8a" opacity={0.28} />
      {BUBBLES.map((b, i) => {
        const y = (((b.y0 - t * b.sp) % H) + H) % H;
        return <circle key={i} cx={b.x + Math.sin(t * 2 + b.ph) * 10} cy={y} r={b.r} fill="none" stroke="#dff1ff" strokeWidth={2} opacity={0.55} />;
      })}
    </g>
  );
};

const S_Paar: React.FC<{ t: number }> = ({ t }) => {
  const rise = k(t, 15.4, 16.5), open = k(t, 15.9, 16.9), dawn = k(t, 15.3, 17.5);
  return (
    <g>
      <defs>
        <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dawn > 0.5 ? "#f6b660" : "#5a3f6e"} /><stop offset="50%" stopColor="#ffd98f" /><stop offset="100%" stopColor="#ffefc9" />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f2c27a" /><stop offset="100%" stopColor="#6c5a8a" /></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#dawn)" />
      <Glow id="sunG" cx={540} cy={1010 - 200 * dawn} r={520} c="#fff3c0" o={0.9} />
      <circle cx={540} cy={1010 - 200 * dawn} r={105} fill="#fff6dc" />
      {[0, 1, 2].map((i) => <rect key={i} x={-200 + ((t * 40 + i * 400) % 1500)} y={930 + i * 70} width={700} height={36} rx={18} fill="#fff" opacity={0.18} />)}
      <rect y={1060} width={W} height={860} fill="url(#sea)" />
      {Array.from({ length: 26 }, (_, i) => {
        const y = 1080 + i * 30, w = 30 + i * 9;
        return <rect key={i} x={540 - w / 2 + Math.sin(t * 3 + i) * 20} y={y} width={w} height={4} rx={2} fill="#fffbe8" opacity={0.55 * (0.5 + 0.5 * Math.sin(t * 6 + i * 1.7))} />;
      })}
      <path d="M 0 1640 Q 300 1600 540 1630 Q 800 1660 1080 1610 L 1080 1920 L 0 1920 Z" fill="#c99a5e" />
      <g transform={`translate(540 ${1900 + 520 * (1 - rise)}) scale(1.4)`}>
        <Seeker uid="s4" t={t} wind={0.6} smile={0.4 + 0.5 * open} gazeY={-0.4} closed={1 - k(t, 15.8, 16.3)} glow={0.35 * dawn} brow={0.3 * open}
          lArm={[-8 - 62 * open, 6 - 14 * open]} rArm={[-8 - 62 * open, 6 - 14 * open]} />
      </g>
      <WaterFront t={t} y={1700 - 80 * rise} tag="p" deep={0.55} />
    </g>
  );
};

export const Room: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs><radialGradient id="roomG" cx="72%" cy="58%" r="80%"><stop offset="0%" stopColor="#8a4f1f" /><stop offset="55%" stopColor="#3b2010" /><stop offset="100%" stopColor="#120804" /></radialGradient></defs>
    <rect width={W} height={H} fill="url(#roomG)" />
    <path d="M 640 1500 L 640 900 Q 640 700 820 640 Q 1000 700 1000 900 L 1000 1500 Z" fill="#2a1609" opacity={0.7} />
    <rect x={620} y={1480} width={400} height={26} fill="#4a2a12" />
    {/* diya */}
    <path d="M 770 1480 Q 820 1440 870 1480 Z" fill="#a8622a" />
    <path d={`M 820 1452 Q ${808 + Math.sin(t * 11) * 4} ${1420 - 6 * flick(t, 1)} ${820 + Math.sin(t * 7) * 3} ${1385 - 14 * flick(t, 2)} Q ${832 + Math.sin(t * 9) * 4} 1420 820 1452 Z`} fill="#ffcf5a" />
    <Glow id="diya" cx={820} cy={1420} r={420} c="#ffb347" o={0.55 * flick(t, 3)} />
  </g>
);

const S_Mirror: React.FC<{ t: number }> = ({ t }) => {
  const reach = k(t, 19.0, 19.6) * (1 - k(t, 21.0, 21.6));
  const lift = k(t, 18.7, 19.3);
  return (
    <g>
      <Room t={t} />
      <g transform={`translate(${430 + 20 * k(t, 18.6, 24.9)} 2120) scale(${1.95 + 0.12 * k(t, 18.6, 24.9)})`}>
        <Seeker uid="s5" t={t} wind={0.1} blink={blinkAt(t, 2)} gazeX={0.8} gazeY={-0.2} smile={0.2 + 0.6 * k(t, 21.4, 22.2)} tilt={4 * k(t, 21.4, 22.2)}
          rArm={[-4 - 31 * lift, 6 + 194 * lift]} rHold="mirror" lArm={[-4 - 146 * reach, 6 - 101 * reach]} glow={0.12} />
      </g>
    </g>
  );
};

/* lane: gateways rush past toward camera; the seeker walks towards the light */
const VP: P2 = [540, 880];
const Gate: React.FC<{ z: number; t: number; i: number }> = ({ z, t, i }) => {
  const s = 1 / z, fog = Math.min(1, (z - 0.6) / 9);
  const shade = Math.round(70 - 50 * fog);
  return (
    <g transform={`translate(${VP[0]} ${VP[1] + 1050 * s}) scale(${s})`} opacity={Math.min(1, (12 - z) / 2)}>
      <path fillRule="evenodd" d="M -900 0 L -900 -1700 L 900 -1700 L 900 0 Z M -400 0 L -400 -1000 Q -400 -1240 0 -1350 Q 400 -1240 400 -1000 L 400 0 Z" fill={`rgb(${shade + 30},${shade + 12},${shade})`} />
      <path d="M -400 0 L -400 -1000 Q -400 -1240 0 -1350 Q 400 -1240 400 -1000 L 400 0" stroke={`rgba(255,190,110,${0.5 - 0.4 * fog})`} strokeWidth={14} fill="none" />
      <line x1={0} y1={-1350} x2={0} y2={-1180} stroke="#2a1a10" strokeWidth={6} />
      <circle cx={0} cy={-1150} r={70} fill="#ffb24a" opacity={0.25 * flick(t, i)} />
      <rect x={-20} y={-1185} width={40} height={60} rx={8} fill="#ffd27a" opacity={flick(t, i)} />
    </g>
  );
};
const S_Lane: React.FC<{ t: number }> = ({ t }) => {
  const lt = t - 24.9;
  const zs = Array.from({ length: 12 }, (_, i) => ((i - lt * 0.75) % 12 + 12) % 12 + 0.6).sort((a, b) => b - a);
  return (
    <g>
      <rect width={W} height={H} fill="#0b0716" />
      <Stars t={t} o={0.5} />
      <path d={`M 0 1920 L ${VP[0] - 30} ${VP[1] + 60} L ${VP[0] + 30} ${VP[1] + 60} L 1080 1920 Z`} fill="#3a2414" />
      {Array.from({ length: 14 }, (_, i) => {
        const z = ((i * 0.9 - lt * 0.75) % 12.6 + 12.6) % 12.6 + 0.6, s = 1 / z;
        return <rect key={i} x={VP[0] - 900 * s} y={VP[1] + 1050 * s} width={1800 * s} height={6 * s + 1} fill="#5a3a20" opacity={0.6} />;
      })}
      <Glow id="laneDoor" cx={VP[0]} cy={VP[1] - 20} r={260 + 120 * k(t, 24.9, 33)} c="#ffd98a" o={0.9} />
      {zs.map((z, i) => <Gate key={i} z={z} t={t} i={i} />)}
      {Array.from({ length: 24 }, (_, i) => {
        const z = ((i * 0.5 - lt * 0.75) % 12 + 12) % 12 + 0.6, s = 1 / z, x = VP[0] + ((i * 37) % 11 - 5) * 120 * s;
        return <path key={i} d={PETAL} transform={`translate(${x} ${VP[1] + 1050 * s - 4}) scale(${s * 0.9},${s * 0.45})`} fill="#c2183c" opacity={0.8} />;
      })}
      <g transform="translate(540 1960) scale(1.05)"><Seeker uid="s6" t={t} back walk={lt * 5.2} wind={0.5} /></g>
    </g>
  );
};

const S_Door: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const open = k(t, 34.2, 38.8), walk = k(t, 33.0, 40.0);
  const cam = 1 + 0.22 * k(t, 33, 40);
  return (
    <g transform={`translate(540 980) scale(${cam}) translate(-540 -980)`}>
      <rect width={W} height={H} fill="#140b08" />
      <defs><radialGradient id="beyond" cx="50%" cy="55%" r="60%"><stop offset="0%" stopColor="#ffffff" /><stop offset="35%" stopColor="#fff0c4" /><stop offset="100%" stopColor="#f0a83c" /></radialGradient></defs>
      <path d="M 210 1640 L 210 760 Q 210 470 540 380 Q 870 470 870 760 L 870 1640 Z" fill="url(#beyond)" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = -Math.PI / 2 + (i - 7.5) * 0.17, L = 1500;
        return <path key={i} d={`M 540 1000 L ${540 + Math.cos(a - 0.03) * L} ${1000 + Math.sin(a - 0.03) * L} L ${540 + Math.cos(a + 0.03) * L} ${1000 + Math.sin(a + 0.03) * L} Z`} fill="#fff4cf" opacity={open * (0.12 + 0.1 * Math.sin(t * 2 + i) + 0.1 * pulse)} />;
      })}
      {/* doors */}
      {[-1, 1].map((sd) => {
        const wFull = 330, w = wFull * (1 - 0.86 * open), x0 = sd < 0 ? 210 : 870 - w;
        return (
          <g key={sd}>
            <rect x={x0} y={430} width={w} height={1210} fill="#5a3214" />
            {[0, 1, 2, 3].map((r) => <rect key={r} x={x0 + w * 0.12} y={560 + r * 270} width={w * 0.76} height={220} rx={10} fill="none" stroke="#3a1e0a" strokeWidth={10} />)}
            {[0, 1, 2, 3, 4, 5].map((r) => <circle key={r} cx={x0 + (sd < 0 ? w - 30 : 30)} cy={560 + r * 190} r={9} fill="#d9a441" />)}
          </g>
        );
      })}
      <path fillRule="evenodd" d="M -100 1920 L -100 0 L 1180 0 L 1180 1920 Z M 210 1640 L 210 760 Q 210 470 540 380 Q 870 470 870 760 L 870 1640 Z" fill="#2b170c" />
      <path d="M 210 1640 L 210 760 Q 210 470 540 380 Q 870 470 870 760 L 870 1640" stroke="#c99140" strokeWidth={22} fill="none" />
      <path d="M 170 1680 L 170 750 Q 170 420 540 320 Q 910 420 910 750 L 910 1680" stroke="#7a5124" strokeWidth={12} fill="none" />
      <rect x={0} y={1640} width={W} height={280} fill="#1e110a" />
      <Glow id="spill" cx={540} cy={1700} r={520} c="#ffd38a" o={0.55 * open} />
      <g transform={`translate(540 ${1900 - 170 * walk}) scale(${0.95 - 0.35 * walk})`} style={{ filter: "brightness(0.12)" }}>
        <Seeker uid="s7" t={t} back walk={(t - 33) * 3.4} wind={0.3} />
      </g>
    </g>
  );
};

const rD = prng(33);
const DUST = Array.from({ length: 60 }, () => ({ x: rD() * W, y: rD() * H, r: 1.5 + rD() * 4, sp: 15 + rD() * 40, ph: rD() * 6.28 }));
export const LightBg: React.FC<{ t: number; pulse: number; o?: number }> = ({ t, pulse, o = 1 }) => (
  <g opacity={o}>
    <defs><radialGradient id="lbg" cx="86%" cy="10%" r="95%"><stop offset="0%" stopColor="#fffaf0" /><stop offset="30%" stopColor="#ffe3a0" /><stop offset="70%" stopColor="#b8742a" /><stop offset="100%" stopColor="#3a1d0c" /></radialGradient></defs>
    <rect width={W} height={H} fill="url(#lbg)" />
    {Array.from({ length: 18 }, (_, i) => {
      const a = (i / 18) * Math.PI * 2 + t * 0.05, L = 1600;
      return <path key={i} d={`M 930 190 L ${930 + Math.cos(a - 0.04) * L} ${190 + Math.sin(a - 0.04) * L} L ${930 + Math.cos(a + 0.04) * L} ${190 + Math.sin(a + 0.04) * L} Z`} fill="#fff6d6" opacity={0.1 + 0.08 * pulse} />;
    })}
    {DUST.map((d, i) => <circle key={i} cx={d.x + Math.sin(t + d.ph) * 20} cy={(((d.y - t * d.sp) % H) + H) % H} r={d.r} fill="#fff4cc" opacity={0.6} />)}
  </g>
);

const S_Light: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const wow = k(t, 40.0, 40.6);
  return (
    <g>
      <LightBg t={t} pulse={pulse} />
      <g transform={`translate(540 ${2200 - 40 * k(t, 40, 43.6)}) scale(${2.1 + 0.08 * k(t, 40, 43.6)})`}>
        <Seeker uid="s8" t={t} wind={0.25} wide={wow} brow={0.7 * wow} gazeY={-0.7} gazeX={0.8} tilt={5 * wow} mouthOpen={0.35 * k(t, 41.0, 41.5)} glow={0.35 + 0.35 * wow} blink={t > 42.2 ? blinkAt(t, 4) : 0} tear={k(t, 42.6, 47.2)} />
      </g>
    </g>
  );
};

const S_Forget: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const up = k(t, 43.6, 44.4);
  return (
    <g>
      <LightBg t={t} pulse={pulse} />
      <g transform={`translate(540 2190) scale(2.18)`}>
        <Seeker uid="s9" t={t} wind={0.3} closed={k(t, 45.0, 45.9)} smile={0.3 + 0.6 * k(t, 45.4, 46.4)} gazeX={0.6} gazeY={-0.2} glow={0.6 + 0.35 * k(t, 45.3, 47.6)}
          rArm={[-4 - 31 * up, 6 + 194 * up]} rHold="mirror" mirrorGlow={1} tear={k(t, 42.6, 47.2)} tilt={-3 * k(t, 45, 46)} />
      </g>
      <rect width={W} height={H} fill="#fff4d6" opacity={0.45 * k(t, 46.4, 47.7)} />
    </g>
  );
};

/* "chhap tilak sab chheen li": cap and shawl lift away and burst into rose petals */
export const burst = (t: number, t0: number, ox: number, oy: number, n: number, seed: number) => {
  if (t < t0) return null;
  const r = prng(seed), dt = t - t0;
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (r() - 0.5) * 2.6, v = 380 + r() * 700, spin = (r() - 0.5) * 540, s = 0.8 + r() * 1.4, life = 2.2 + r() * 1.4;
    const x = ox + Math.cos(a) * v * dt + Math.sin(dt * 3 + i) * 30, y = oy + Math.sin(a) * v * dt + 260 * dt * dt;
    const o = Math.max(0, 1 - dt / life);
    return <path key={i} d={PETAL} transform={`translate(${x} ${y}) rotate(${spin * dt + i * 20}) scale(${s})`} fill={i % 3 ? "#c8143c" : "#ff6f8e"} opacity={o} />;
  });
};
const S_Chheen: React.FC<{ t: number; pulse: number }> = ({ t, pulse }) => {
  const cap = k(t, 47.82, 49.0), shawl = k(t, 49.16, 50.5);
  return (
    <g>
      <defs><radialGradient id="cbg" cx="50%" cy="30%" r="80%"><stop offset="0%" stopColor="#ffd88a" /><stop offset="45%" stopColor="#a8361f" /><stop offset="100%" stopColor="#24070b" /></radialGradient></defs>
      <rect width={W} height={H} fill="url(#cbg)" />
      <g transform={`translate(540 2180) scale(2.1)`}>
        <Seeker uid="s10" t={t} wind={0.6 + pulse * 0.4} closed={k(t, 48.2, 48.8)} smile={0.5} gazeY={-0.5} glow={0.3 + 0.3 * shawl}
          capLift={cap * 520} capFade={k(t, 48.4, 49.1)} shawlLift={shawl * 600} shawlFade={k(t, 49.7, 50.6)} tear={0} />
      </g>
      {burst(t, 47.82, 540, 680, 70, 5)}
      {burst(t, 49.16, 300, 1040, 60, 6)}
      {burst(t, 49.16, 780, 1040, 60, 7)}
      {burst(t, 49.68, 540, 1200, 80, 8)}
    </g>
  );
};

/* extreme close-up of the eyes, then pull back to the face looking up into the light */
const S_Eyes: React.FC<{ t: number; pulse: number; pull?: boolean }> = ({ t, pulse, pull }) => {
  const S = pull ? interp(ease((t - 56.3) / 3.2), [0, 1], [5.8, 2.15]) : 5.2 + 0.6 * k(t, 51.8, 56.3);
  const cy = pull ? interp(ease((t - 56.3) / 3.2), [0, 1], [640, 560]) : 640;
  const P: Pose = pull
    ? { t, gazeY: -1 * k(t, 56.4, 57.4), gazeX: 0.7 * k(t, 56.4, 57.4), tilt: 4 * k(t, 56.4, 57.4), smile: 0.2 + 0.6 * k(t, 57.3, 58.4), glow: 0.3 + 0.4 * k(t, 56.4, 58.4), tear: 0.85, wide: 0.6 * k(t, 56.4, 57.0), brow: 0.4, blink: blinkAt(t, 5), wind: 0.4 }
    : { t, gazeX: Math.sin(t * 0.7) * 0.4, gazeY: -0.2, blink: t > 53.0 && t < 53.25 ? Math.sin(((t - 53.0) / 0.25) * Math.PI) : 0, tear: k(t, 53.6, 56.6), glow: 0.25, wind: 0.2 };
  return (
    <g>
      <LightBg t={t} pulse={pulse} o={pull ? 0.4 + 0.6 * k(t, 56.4, 58) : 0.4} />
      <g transform={`translate(540 ${cy + 802 * S}) scale(${S})`}><Seeker uid={pull ? "s12" : "s11"} {...P} /></g>
    </g>
  );
};

/* the qawwali gathering: anonymous qawwals in silhouette, clapping on the beat */
const Qawwal: React.FC<{ x: number; s: number; t: number; role: "clap" | "lead" | "harmonium"; i: number; beats?: number[] }> = ({ x, s, t, role, i, beats: bl }) => {
  const c = clapAt(t + i * 0.01, bl), sep = 46 * (1 - c), lift = 10 * c;
  const sway = Math.sin(t * 2.3 + i) * 3;
  const DK = "#120a18", RIM = "#ffbf6a";
  return (
    <g transform={`translate(${x} 1560) scale(${s}) rotate(${sway * 0.4})`}>
      <path d="M -150 0 Q -150 -120 -110 -220 Q -60 -300 0 -300 Q 60 -300 110 -220 Q 150 -120 150 0 Z" fill={DK} stroke={RIM} strokeWidth={4} strokeOpacity={0.6} />
      <circle cx={0} cy={-360} r={62} fill={DK} stroke={RIM} strokeWidth={4} strokeOpacity={0.6} />
      <path d="M -62 -380 Q -62 -440 0 -444 Q 62 -440 62 -380 Z" fill="#2a1d2e" />
      {role === "clap" && (
        <g>
          <path d={`M -90 -230 Q -70 -150 ${-sep - 10} ${-200 - lift}`} stroke={DK} strokeWidth={34} strokeLinecap="round" fill="none" />
          <path d={`M 90 -230 Q 70 -150 ${sep + 10} ${-200 - lift}`} stroke={DK} strokeWidth={34} strokeLinecap="round" fill="none" />
          <ellipse cx={-sep} cy={-210 - lift} rx={18} ry={26} fill="#3a2a2a" /><ellipse cx={sep} cy={-210 - lift} rx={18} ry={26} fill="#3a2a2a" />
          {c > 0.6 && <circle cx={0} cy={-210 - lift} r={40 * c} fill="#ffd59a" opacity={0.35 * c} />}
        </g>
      )}
      {role === "lead" && (
        <g>
          <path d={`M 90 -230 Q 160 -300 ${150 + Math.sin(t * 1.6) * 30} ${-400 + Math.cos(t * 1.6) * 20}`} stroke={DK} strokeWidth={34} strokeLinecap="round" fill="none" />
          <ellipse cx={150 + Math.sin(t * 1.6) * 30} cy={-420 + Math.cos(t * 1.6) * 20} rx={22} ry={30} fill="#3a2a2a" />
        </g>
      )}
      {role === "harmonium" && (
        <g>
          <rect x={-120} y={-150} width={240} height={110} rx={8} fill="#3b1f12" stroke={RIM} strokeWidth={3} strokeOpacity={0.5} />
          <rect x={-120} y={-150} width={30 + 26 * (0.5 + 0.5 * Math.sin(t * 4.4))} height={110} fill="#5a3320" />
          {Array.from({ length: 10 }, (_, j) => <rect key={j} x={-80 + j * 18} y={-140} width={14} height={34} fill="#efe6d6" />)}
        </g>
      )}
    </g>
  );
};
export const S_Mehfil: React.FC<{ t: number; pulse: number; a?: number; b?: number; beats?: number[]; dimAt?: number }> = ({ t, pulse, a = 61.8, b = 74.5, beats: bl, dimAt = 62.2 }) => {
  const cam = 1.08 - 0.06 * k(t, a, b);
  return (
    <g transform={`translate(540 1100) scale(${cam}) translate(-540 -1100)`}>
      <rect width={W} height={H} fill="#0c0714" />
      <Stars t={t} o={0.6} />
      {[-1, 0, 1].map((j) => (
        <g key={j} transform={`translate(${540 + j * 380} 1380)`}>
          <path d="M -170 0 L -170 -560 Q -170 -760 0 -830 Q 170 -760 170 -560 L 170 0 Z" fill="#1d1226" stroke="#6b4a2a" strokeWidth={10} />
          <line x1={0} y1={-830} x2={0} y2={-700} stroke="#3a2a1a" strokeWidth={4} />
          <Glow id={`mlg${j}`} cx={0} cy={-660} r={170} c="#ffb04a" o={0.7 * flick(t, j + 4)} />
          <rect x={-18} y={-690} width={36} height={54} rx={8} fill="#ffd27a" opacity={flick(t, j + 4)} />
        </g>
      ))}
      <rect y={1380} width={W} height={540} fill="#5a1420" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} y={1420 + i * 60} width={W} height={4} fill="#c99140" opacity={0.35} />)}
      <Glow id="stageG" cx={540} cy={1500} r={620} c="#ffb35a" o={0.35 + 0.15 * pulse} />
      <Qawwal x={150} s={0.62} t={t} role="clap" i={0} beats={bl} />
      <Qawwal x={345} s={0.7} t={t} role="harmonium" i={1} beats={bl} />
      <Qawwal x={540} s={0.78} t={t} role="lead" i={2} beats={bl} />
      <Qawwal x={735} s={0.7} t={t} role="clap" i={3} beats={bl} />
      <Qawwal x={930} s={0.62} t={t} role="clap" i={4} beats={bl} />
      <rect width={W} height={H} fill="#000" opacity={0.35 * k(t, dimAt, dimAt + 1.2)} />
    </g>
  );
};

/* ================= timeline ================= */
type Shot = { a: number; b: number; r: (t: number, pulse: number) => React.ReactNode };
const SHOTS: Shot[] = [
  { a: 0, b: 5.6, r: (t) => <S_River t={t} /> },
  { a: 5.6, b: 11.3, r: (t) => <S_Seeker t={t} /> },
  { a: 11.3, b: 13.0, r: (t) => <S_Enter t={t} /> },
  { a: 13.0, b: 15.5, r: (t) => <S_Sink t={t} /> },
  { a: 15.5, b: 18.6, r: (t) => <S_Paar t={t} /> },
  { a: 18.6, b: 24.9, r: (t) => <S_Mirror t={t} /> },
  { a: 24.9, b: 33.0, r: (t) => <S_Lane t={t} /> },
  { a: 33.0, b: 40.0, r: (t, p) => <S_Door t={t} pulse={p} /> },
  { a: 40.0, b: 43.6, r: (t, p) => <S_Light t={t} pulse={p} /> },
  { a: 43.6, b: 47.7, r: (t, p) => <S_Forget t={t} pulse={p} /> },
  { a: 47.7, b: 51.8, r: (t, p) => <S_Chheen t={t} pulse={p} /> },
  { a: 51.8, b: 56.3, r: (t, p) => <S_Eyes t={t} pulse={p} /> },
  { a: 56.3, b: 61.8, r: (t, p) => <S_Eyes t={t} pulse={p} pull /> },
  { a: 61.8, b: 74.6, r: (t, p) => <S_Mehfil t={t} pulse={p} /> },
];
const XF = 0.35;
const FLASH = [16.1, 40.0, 47.82];

export const QawwaliAnim: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const pulse = pulseAt(t);
  const flash = Math.max(0, ...FLASH.map((f) => interp(t, [f - 0.06, f, f + 0.8], [0, 1, 0])));
  const fade = Math.max(interp(t, [0, 0.7], [1, 0]), interp(t, [ANIM_DUR - 1.3, ANIM_DUR], [0, 1]));
  return (
    <AbsoluteFill style={{ background: "#07040c" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {SHOTS.map((s, i) => {
          if (t < s.a - XF || t > s.b + XF) return null;
          const o = s.a === 0 ? 1 : interp(t, [s.a - XF, s.a + XF], [0, 1]);
          return (
            <g key={i} opacity={o} transform={`translate(540 960) scale(${1 + 0.006 * pulse}) translate(-540 -960)`}>{s.r(t, pulse)}</g>
          );
        })}
        <defs><radialGradient id="vig" cx="50%" cy="46%" r="75%"><stop offset="60%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.55} /></radialGradient></defs>
        <rect width={W} height={H} fill="url(#vig)" />
        <defs><linearGradient id="band" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#08040e" stopOpacity={0.45} /><stop offset="20%" stopColor="#08040e" stopOpacity={0} /><stop offset="38%" stopColor="#08040e" stopOpacity={0} /><stop offset="55%" stopColor="#08040e" stopOpacity={0.4} /><stop offset="74%" stopColor="#08040e" stopOpacity={0.62} /><stop offset="90%" stopColor="#08040e" stopOpacity={0.3} /><stop offset="100%" stopColor="#08040e" stopOpacity={0.1} /></linearGradient></defs>
        <rect width={W} height={H} fill="url(#band)" />
        <rect width={W} height={H} fill="#fff1c8" opacity={flash * 0.7} />
      </svg>
      <Words t={t} pulse={pulse} />
      <LineCaption t={t} />
      <EndCard t={t} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,245,232,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>@MEHFIL.E_SAMA</div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
      {withAudio && <Audio src={staticFile("qawwali/chhap-tilak.m4a")} />}
    </AbsoluteFill>
  );
};
