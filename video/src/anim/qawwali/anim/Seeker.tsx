import React from "react";

/* The seeker: an ordinary young man (never a saint, prophet or historical figure).
   Vector rig, origin = between the feet, head centre at (0,-790). Everything is driven by props per frame. */
export type Pose = {
  t: number;
  blink?: number;      // 0 open .. 1 closed (momentary)
  closed?: number;     // 0..1 eyes gently closed (held)
  wide?: number;       // 0..1 awe
  gazeX?: number; gazeY?: number; // -1..1
  brow?: number;       // -1 frown .. 1 raised
  smile?: number;      // 0..1
  mouthOpen?: number;  // 0..1
  tilt?: number;       // head tilt deg
  nod?: number;        // head up(-)/down(+) px
  lArm?: [number, number]; rArm?: [number, number]; // [shoulder, elbow] degrees, 0 = hanging, + = outward/up
  rHold?: "mirror" | null;
  wind?: number;       // shawl flutter strength 0..1
  float?: number;      // 0..1 underwater: shawl & sleeves drift up
  tear?: number;       // 0..1 progress of a tear rolling down the right cheek
  glow?: number;       // 0..1 golden light on the face/front
  capLift?: number;    // px the cap has flown up (0 = on head)
  capFade?: number;    // 0..1
  shawlLift?: number; shawlFade?: number;
  back?: boolean;      // seen from behind
  walk?: number;       // walk cycle phase (radians) when back view
  breathe?: number;    // breathing phase override
  mirrorGlow?: number; // 0..1 mirror shows only light
  look?: Look;
};
/* cast variations: kid, mum (hijab, long dress), dad, etc. Defaults = the seeker */
export type Look = { kid?: boolean; beard?: boolean; cap?: string | null; hijab?: string | null; top?: string; topD?: string; pants?: string; shawl?: boolean; long?: boolean; hair?: string; skin?: [string, string, string] };

const SK = "#c48d66", SKD = "#a06d4b", SKL = "#dfb38d", HAIR = "#1f1510", KURTA = "#f5f0e6", KURTAD = "#d8cebd", SHAWL = "#e9d8b3", SHAWLD = "#c9b48a", GOLDT = "#b8893a";
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");

/* + angles = toward the body's centre line (both arms); shoulder then elbow */
const Arm: React.FC<{ side: 1 | -1; a: [number, number]; t: number; float: number; hold?: React.ReactNode; c?: [string, string]; sk?: [string, string, string] }> = ({ side, a, t, float, hold, c = [KURTA, KURTAD], sk = [SKL, SK, SKD] }) => {
  const sway = Math.sin(t * 1.3 + side) * 1.5 - float * (14 + Math.sin(t * 1.1 + side) * 8);
  const A = a[0] + sway;
  return (
    <g transform={`translate(${side * -136},-645) scale(${side * -1},1) rotate(${A})`}>
      <path d="M -30 -6 Q -34 100 -26 205 L 26 205 Q 32 100 30 -6 Q 0 -22 -30 -6 Z" fill={c[0]} />
      <path d="M -30 -6 Q -34 100 -26 205 L -16 205 Q -20 100 -18 -4 Z" fill={c[1]} opacity={0.7} />
      <g transform={`translate(0,195) rotate(${a[1]})`}>
        <path d="M -26 0 Q -28 80 -24 150 L 24 150 Q 28 80 26 0 Z" fill={c[0]} />
        <path d="M -26 0 Q -28 80 -24 150 L -14 150 Q -18 80 -16 0 Z" fill={c[1]} opacity={0.7} />
        <rect x={-25} y={142} width={50} height={10} rx={4} fill={c[1]} />
        <ellipse cx={0} cy={176} rx={21} ry={27} fill={sk[1]} />
        <ellipse cx={6} cy={170} rx={9} ry={14} fill={sk[0]} opacity={0.5} />
        {hold && <g transform={`translate(0,176) rotate(${-(A + a[1])}) scale(${side * -1},1)`}>{hold}</g>}
      </g>
    </g>
  );
};

export const Mirror: React.FC<{ glow: number; id: string }> = ({ glow, id }) => (
  <g>
    <defs>
      <radialGradient id={`mg${id}`} cx="40%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor={glow > 0.5 ? "#fff1c8" : "#cfd8e6"} />
        <stop offset="100%" stopColor={glow > 0.5 ? "#f2c76a" : "#7d8aa3"} />
      </radialGradient>
    </defs>
    <rect x={-9} y={-10} width={18} height={70} rx={8} fill="#8a6a3a" />
    <circle cx={0} cy={-62} r={62} fill="#b8893a" />
    <circle cx={0} cy={-62} r={52} fill={`url(#mg${id})`} />
    <circle cx={0} cy={-62} r={52} fill="#fff6d8" opacity={glow * 0.9} />
    <path d="M -30 -92 Q -10 -108 14 -100" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.6} fill="none" />
  </g>
);

export const Seeker: React.FC<Pose & { uid: string }> = (p) => {
  const id = sid(p.uid);
  const t = p.t;
  const br = Math.sin((p.breathe ?? t) * 1.6) * 0.012; // breathing
  const wind = p.wind ?? 0.3, fl = p.float ?? 0;
  const flap = (k: number) => Math.sin(t * 3.1 + k) * 14 * wind + Math.sin(t * 5.3 + k * 2) * 5 * wind;
  const lift = fl * 120;
  const open = Math.max(0, 1 - Math.max(p.blink ?? 0, p.closed ?? 0)) * (1 + 0.18 * (p.wide ?? 0));
  const gx = (p.gazeX ?? 0) * 6, gy = (p.gazeY ?? 0) * 4;
  const brow = (p.brow ?? 0) * 9 + (p.wide ?? 0) * 6 + (p.look?.kid ? 7 : 0);
  const smile = p.smile ?? 0, mo = p.mouthOpen ?? 0;
  const glow = p.glow ?? 0;
  const lA = p.lArm ?? [-4, 6], rA = p.rArm ?? [-4, 6];
  const front = (a: [number, number]) => Math.abs(a[1]) > 50 || Math.abs(a[0]) > 50;
  const hold = p.rHold === "mirror" ? <Mirror glow={p.mirrorGlow ?? 0} id={id} /> : undefined;
  const L = p.look ?? {};
  const TOP = L.top ?? KURTA, TOPD = L.topD ?? KURTAD, PANTS = L.pants ?? KURTAD, HAIRC = L.hair ?? HAIR;
  const [SL, SM, SD] = L.skin ?? [SKL, SK, SKD];
  const beard = L.beard ?? true, capC = L.cap === undefined ? "#f8f4eb" : L.cap, hij = L.hijab ?? null, shawlOn = L.shawl ?? true;
  const kid = !!L.kid, longDress = !!L.long;
  const armC: [string, string] = [TOP, TOPD], armSk: [string, string, string] = [SL, SM, SD];

  if (p.back) {
    const w = p.walk ?? 0;
    const lStep = Math.sin(w), bob = Math.abs(Math.cos(w)) * 10;
    return (
      <g transform={`translate(0,${-bob})`}>
        {/* legs: the stepping-forward leg shortens (moving away from camera) */}
        <rect x={-66} y={-255} width={48} height={225 - 30 * Math.max(0, lStep)} rx={18} fill={KURTAD} />
        <rect x={18} y={-255} width={48} height={225 - 30 * Math.max(0, -lStep)} rx={18} fill={KURTAD} />
        <ellipse cx={-42} cy={-28 - 30 * Math.max(0, lStep)} rx={30} ry={12} fill="#5a3a22" />
        <ellipse cx={42} cy={-28 - 30 * Math.max(0, -lStep)} rx={30} ry={12} fill="#5a3a22" />
        <path d="M -118 -650 Q -150 -560 -150 -470 L -168 -250 Q 0 -232 168 -250 L 150 -470 Q 150 -560 118 -650 Q 0 -690 -118 -650 Z" fill={KURTA} />
        <g transform={`rotate(${lStep * 7} -122 -640)`}><rect x={-160} y={-650} width={52} height={360} rx={24} fill={KURTA} /><ellipse cx={-134} cy={-282} rx={20} ry={26} fill={SK} /></g>
        <g transform={`rotate(${-lStep * 7} 122 -640)`}><rect x={108} y={-650} width={52} height={360} rx={24} fill={KURTA} /><ellipse cx={134} cy={-282} rx={20} ry={26} fill={SK} /></g>
        {/* shawl over the back */}
        <path d={`M -140 -660 Q 0 -700 140 -660 L 150 -430 Q ${80 + flap(1)} ${-400 + flap(2)} 0 ${-410 + flap(3)} Q ${-80 + flap(4)} ${-400 + flap(5)} -150 -430 Z`} fill={SHAWL} />
        <path d={`M -150 -430 Q ${-80 + flap(4)} ${-400 + flap(5)} 0 ${-410 + flap(3)} Q ${80 + flap(1)} ${-400 + flap(2)} 150 -430`} stroke={GOLDT} strokeWidth={6} fill="none" />
        <rect x={-24} y={-722} width={48} height={60} fill={SKD} />
        <ellipse cx={0} cy={-790} rx={74} ry={94} fill={HAIR} />
        <path d="M -76 -840 Q -76 -912 0 -918 Q 76 -912 76 -840 Q 0 -856 -76 -840 Z" fill="#f7f3ea" />
        <ellipse cx={-74} cy={-790} rx={13} ry={22} fill={SKD} /><ellipse cx={74} cy={-790} rx={13} ry={22} fill={SKD} />
      </g>
    );
  }

  return (
    <g transform={`scale(${1 + br * 0.3},${1 + br})`}>
      <defs>
        <radialGradient id={`face${id}`} cx="45%" cy="38%" r="70%">
          <stop offset="0%" stopColor={SL} /><stop offset="60%" stopColor={SM} /><stop offset="100%" stopColor={SD} />
        </radialGradient>
        <radialGradient id={`glow${id}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#fff2c2" stopOpacity={1} /><stop offset="100%" stopColor="#ffcf6a" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`kurta${id}`} x1="0" x2="1">
          <stop offset="0%" stopColor={TOPD} /><stop offset="30%" stopColor={TOP} /><stop offset="75%" stopColor={TOP} /><stop offset="100%" stopColor={TOPD} />
        </linearGradient>
        <clipPath id={`eyeL${id}`}><path d="M -19 0 Q 0 -13 19 0 Q 0 10 -19 0 Z" /></clipPath>
      </defs>

      <g transform={kid ? "scale(1.04,0.78)" : undefined}>
      {/* legs + feet */}
      <rect x={-68} y={-262} width={50} height={232} rx={18} fill={PANTS} />
      <rect x={18} y={-262} width={50} height={232} rx={18} fill={PANTS} />
      <ellipse cx={-44} cy={-22} rx={40} ry={15} fill="#5a3a22" /><ellipse cx={44} cy={-22} rx={40} ry={15} fill="#5a3a22" />


      {/* kurta */}
      <path d={`M -118 -650 Q -150 -560 -150 -470 L ${-168 - fl * 30} ${-250 - lift * 0.6} Q 0 ${-232 - lift * 0.8} ${168 + fl * 30} ${-250 - lift * 0.6} L 150 -470 Q 150 -560 118 -650 Q 0 -690 -118 -650 Z`} fill={`url(#kurta${id})`} />
      {longDress && <path d="M -168 -250 Q 0 -232 168 -250 L 180 -36 Q 0 -14 -180 -36 Z" fill={`url(#kurta${id})`} />}
      {!longDress && <path d="M 0 -688 L 0 -560" stroke={TOPD} strokeWidth={4} />}
      {!longDress && !hij && [-660, -630, -600].map((y) => <circle key={y} cx={0} cy={y} r={5} fill="#c9b48a" />)}

      {!front(lA) && <Arm side={1} a={lA} t={t} float={fl} c={armC} sk={armSk} />}
      {!front(rA) && <Arm side={-1} a={rA} t={t} float={fl} hold={hold} c={armC} sk={armSk} />}

      {/* shawl */}
      <g opacity={shawlOn ? 1 - (p.shawlFade ?? 0) : 0} transform={`translate(0,${-(p.shawlLift ?? 0)})`}>
        <path d="M -140 -660 Q 0 -706 140 -660 L 120 -640 Q 0 -676 -120 -640 Z" fill={SHAWLD} />
        <path d={`M -62 -690 Q -128 -672 -146 -640 L ${-156 + flap(1)} ${-400 - lift + flap(2)} L ${-96 + flap(3)} ${-388 - lift + flap(4)} Q -96 -560 -44 -676 Z`} fill={SHAWL} />
        <path d={`M 62 -690 Q 128 -672 146 -640 L ${156 + flap(5)} ${-400 - lift + flap(6)} L ${96 + flap(7)} ${-388 - lift + flap(8)} Q 96 -560 44 -676 Z`} fill={SHAWL} />
        <path d={`M -44 -676 Q -96 -560 ${-96 + flap(3)} ${-388 - lift + flap(4)}`} stroke={GOLDT} strokeWidth={6} fill="none" />
        <path d={`M 44 -676 Q 96 -560 ${96 + flap(7)} ${-388 - lift + flap(8)}`} stroke={GOLDT} strokeWidth={6} fill="none" />
        <path d={`M -146 -640 L ${-156 + flap(1)} ${-400 - lift + flap(2)}`} stroke={SHAWLD} strokeWidth={8} fill="none" />
      </g>

      {front(lA) && <Arm side={1} a={lA} t={t} float={fl} c={armC} sk={armSk} />}
      {front(rA) && <Arm side={-1} a={rA} t={t} float={fl} hold={hold} c={armC} sk={armSk} />}
      {/* neck */}
      <path d="M -26 -730 L -24 -660 Q 0 -648 24 -660 L 26 -730 Z" fill={SD} />

      </g>
      {/* head */}
      <g transform={`translate(0,${(kid ? -640 : -790) + (p.nod ?? 0)}) rotate(${p.tilt ?? 0}) scale(${kid ? 1.3 : 1})`}>
        {hij && <><ellipse cx={0} cy={-6} rx={104} ry={128} fill={hij} /><path d="M -100 40 Q -158 130 -172 200 Q 0 246 172 200 Q 158 130 100 40 Z" fill={hij} /><path d="M -172 200 Q 0 246 172 200" stroke="#00000022" strokeWidth={6} fill="none" /></>}
        {!hij && <><ellipse cx={-74} cy={6} rx={14} ry={23} fill={SD} /><ellipse cx={74} cy={6} rx={14} ry={23} fill={SD} /></>}
        <path d="M -72 -20 Q -74 60 -40 92 Q 0 112 40 92 Q 74 60 72 -20 Q 70 -98 0 -102 Q -70 -98 -72 -20 Z" fill={`url(#face${id})`} />
        {/* hair (visible when the cap is gone) */}
        {!hij && <path d="M -76 -30 Q -82 -112 0 -120 Q 82 -112 76 -30 Q 70 -70 40 -80 Q 0 -66 -40 -80 Q -70 -70 -76 -30 Z" fill={HAIRC} />}
        {hij && <path d="M -78 20 Q -84 -104 0 -112 Q 84 -104 78 20" stroke={hij} strokeWidth={22} fill="none" />}
        {/* sideburns + beard */}
        {beard && !hij && <><path d="M -77 -40 L -66 -40 L -64 14 L -74 14 Z" fill={HAIR} /><path d="M 77 -40 L 66 -40 L 64 14 L 74 14 Z" fill={HAIR} />
        <path d="M -75 8 Q -72 76 -38 102 Q 0 126 38 102 Q 72 76 75 8 L 64 12 Q 56 50 26 60 Q 0 66 -26 60 Q -56 50 -64 12 Z" fill={HAIR} />
        <path d="M -24 42 Q -10 34 0 38 Q 10 34 24 42 Q 12 47 0 44 Q -12 47 -24 42 Z" fill={HAIR} /></>}
        {/* mouth */}
        {mo > 0.05
          ? <path d={`M -12 50 Q 0 ${47} 12 50 Q 0 ${52 + 14 * mo} -12 50 Z`} fill="#3a1a12" />
          : <path d={`M -14 52 Q 0 ${52 + 7 * smile} 14 52`} stroke="#6e3a2a" strokeWidth={3.5} fill="none" strokeLinecap="round" />}
        {/* nose */}
        <path d={kid ? "M -2 14 Q -6 24 -8 28 Q 0 32 8 28" : "M -3 -12 Q -8 16 -12 24 Q 0 31 12 24"} stroke={SD} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        {/* cheeks */}
        <ellipse cx={-42} cy={22} rx={16} ry={9} fill="#d9876a" opacity={0.18 + 0.15 * smile} /><ellipse cx={42} cy={22} rx={16} ry={9} fill="#d9876a" opacity={0.18 + 0.15 * smile} />
        {/* eyes */}
        {[-31, 31].map((x) => (
          <g key={x} transform={`translate(${x},${kid ? -6 : -12}) scale(${(kid ? 1.25 : 1) * (1 + 0.06 * (p.wide ?? 0))},${(kid ? 1.75 : 1) * Math.max(0.06, open)})`}>
            <path d="M -19 0 Q 0 -13 19 0 Q 0 10 -19 0 Z" fill="#fbf5ec" />
            <g clipPath={`url(#eyeL${id})`}>
              <circle cx={gx} cy={gy} r={8.5} fill="#4a2c16" /><circle cx={gx} cy={gy} r={4.2} fill="#120905" />
              <circle cx={gx + 3} cy={gy - 3} r={2.4} fill="#fff" /><circle cx={gx - 2.5} cy={gy + 2.5} r={1.1} fill="#fff" opacity={0.7} />
            </g>
            <path d="M -20 1 Q 0 -14 20 1" stroke="#1d120b" strokeWidth={open < 0.3 ? 4 : 3.2} fill="none" strokeLinecap="round" />
          </g>
        ))}
        {/* brows */}
        <path d={`M -48 ${-38 - brow} Q -32 ${-48 - brow} -15 ${-40 - brow * 0.6}`} stroke={HAIR} strokeWidth={6.5} fill="none" strokeLinecap="round" />
        <path d={`M 48 ${-38 - brow} Q 32 ${-48 - brow} 15 ${-40 - brow * 0.6}`} stroke={HAIR} strokeWidth={6.5} fill="none" strokeLinecap="round" />
        {/* tear */}
        {(p.tear ?? 0) > 0 && (
          <g opacity={interp(p.tear!, [0, 0.08, 0.92, 1], [0, 1, 1, 0])}>
            <path d={`M 34 0 Q 37 ${40 * p.tear!} 38 ${86 * p.tear!}`} stroke="#e8f4ff" strokeWidth={2.5} opacity={0.45} fill="none" />
            <path d={`M 38 ${86 * p.tear! - 9} Q 44 ${86 * p.tear!} 38 ${86 * p.tear! + 6} Q 32 ${86 * p.tear!} 38 ${86 * p.tear! - 9} Z`} fill="#eaf6ff" />
          </g>
        )}
        {/* cap */}
        <g opacity={capC && !hij ? 1 - (p.capFade ?? 0) : 0} transform={`translate(0,${-(p.capLift ?? 0)}) rotate(${(p.capLift ?? 0) * 0.04})`}>
          <path d="M -77 -54 Q -78 -124 0 -130 Q 78 -124 77 -54 Q 0 -70 -77 -54 Z" fill={capC ?? "#f8f4eb"} />
          <path d="M -77 -54 Q 0 -70 77 -54" stroke="#d9d0be" strokeWidth={6} fill="none" />
          <path d="M -60 -86 Q 0 -98 60 -86 M -44 -110 Q 0 -118 44 -110" stroke="#e2dacb" strokeWidth={3} fill="none" />
        </g>
        {glow > 0 && <ellipse cx={0} cy={0} rx={120} ry={140} fill={`url(#glow${id})`} opacity={glow * 0.75} style={{ mixBlendMode: "screen" }} />}
      </g>
      {glow > 0 && <ellipse cx={0} cy={-560} rx={260} ry={320} fill={`url(#glow${id})`} opacity={glow * 0.45} style={{ mixBlendMode: "screen" }} />}
    </g>
  );
};

export const interp = (x: number, xs: number[], ys: number[]) => {
  if (x <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) if (x <= xs[i]) return ys[i - 1] + ((x - xs[i - 1]) / (xs[i] - xs[i - 1])) * (ys[i] - ys[i - 1]);
  return ys[ys.length - 1];
};
/* natural blinking: a quick blink every ~3.5 s, seeded */
export const blinkAt = (t: number, seed = 0) => {
  const period = 3.4 + (seed % 3) * 0.5, ph = (t + seed * 1.3) % period;
  return ph < 0.18 ? Math.sin((ph / 0.18) * Math.PI) : 0;
};
