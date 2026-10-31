// Canvas painters. Each is a pure function of time t (seconds), so every frame is reproducible.
import { cl, countF, prng, ss, W } from "./lib";

const rnd = prng(3);
const STARS = Array.from({ length: 150 }, () => ({ x: rnd() * 1080, y: rnd() * 760, r: 0.6 + rnd() * 1.7, w: 0.8 + rnd() * 2.5, p: rnd() * 6.28 }));
const SINS = Array.from({ length: 46 }, () => ({ x: 120 + rnd() * 840, y: 860 + rnd() * 300, r: 6 + rnd() * 16, p: rnd() * 6.28 }));
const FOAM = Array.from({ length: 700 }, () => ({ u: rnd(), v: rnd(), r: 1 + rnd() * 4.5, p: rnd() * 6.28 }));

const H = 1920, HZ = 760, MX = 760, MY = 560;

export function oceanView(t: number) {
  let z = 1, oy = 0, a = 0, blur = 0;
  if (t >= 2.8 && t < 8.0) { const u = (t - 2.8) / 5.2; z = 1.1 - 0.08 * u; oy = 30 * (1 - u); a = 1; }
  else if (t >= 8.0 && t < 21.1) { z = 1.0; a = 0.55; blur = 1; }
  else if (t >= 21.1 && t < 23.8) { const u = (t - 21.1) / 2.7; z = 1.6 + 0.1 * u; oy = -800 - 140 * u; a = 1; }
  else if (t >= 35.1) { z = 1.04; oy = -330; a = 0.9; }
  return { z, oy, a, blur };
}

export function drawOcean(g: CanvasRenderingContext2D, t: number) {
  const v = oceanView(t);
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, 1080, H);
  if (v.a === 0) return;
  g.setTransform(v.z, 0, 0, v.z, 540 * (1 - v.z), H * 0.5 * (1 - v.z) + v.oy);
  let gr = g.createLinearGradient(0, 0, 0, HZ);
  gr.addColorStop(0, "#03060f"); gr.addColorStop(0.65, "#0c1630"); gr.addColorStop(1, "#22324f");
  g.fillStyle = gr; g.fillRect(-400, -600, 1880, HZ + 600);
  for (const s of STARS) {
    g.globalAlpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.w + s.p));
    g.fillStyle = "#e9eefc"; g.beginPath(); g.arc(s.x, s.y, s.r, 0, 6.283); g.fill();
  }
  g.globalAlpha = 1;
  const mg = g.createRadialGradient(MX, MY, 30, MX, MY, 320);
  mg.addColorStop(0, "rgba(255,244,214,0.55)"); mg.addColorStop(0.25, "rgba(255,236,200,0.16)"); mg.addColorStop(1, "rgba(255,236,200,0)");
  g.fillStyle = mg; g.fillRect(MX - 340, MY - 340, 680, 680);
  g.fillStyle = "#f6edd3"; g.beginPath(); g.arc(MX, MY, 54, 0, 6.283); g.fill();
  g.fillStyle = "rgba(170,150,110,0.18)";
  g.beginPath(); g.arc(MX - 16, MY - 12, 12, 0, 6.283); g.fill();
  g.beginPath(); g.arc(MX + 18, MY + 13, 8, 0, 6.283); g.fill();
  gr = g.createLinearGradient(0, HZ - 60, 0, HZ + 40);
  gr.addColorStop(0, "rgba(60,80,110,0)"); gr.addColorStop(0.6, "rgba(70,90,120,0.35)"); gr.addColorStop(1, "rgba(30,45,70,0)");
  g.fillStyle = gr; g.fillRect(-400, HZ - 60, 1880, 100);
  gr = g.createLinearGradient(0, HZ, 0, H + 600);
  gr.addColorStop(0, "#152641"); gr.addColorStop(0.35, "#0b1830"); gr.addColorStop(1, "#040a16");
  g.fillStyle = gr; g.fillRect(-400, HZ, 1880, H - HZ + 900);

  const N = 64;
  for (let j = 0; j < N; j++) {
    const q = j / (N - 1), y0 = HZ + (1800 - HZ) * Math.pow(q, 1.9);
    const A = 1.0 + 26 * q * q, L = 70 + 640 * Math.pow(q, 1.5), w = 0.9 + 0.6 * (1 - q), ph = j * 1.7;
    const yAt = (x: number) => y0 + A * Math.sin((6.283 * x) / L + w * t + ph) + 0.45 * A * Math.sin((6.283 * x) / (0.43 * L) - 1.37 * w * t + ph * 0.6);
    g.beginPath(); g.moveTo(-400, yAt(-400));
    for (let x = -400; x <= 1480; x += 16) g.lineTo(x, yAt(x));
    g.lineTo(1480, y0 + A * 3 + 30); g.lineTo(-400, y0 + A * 3 + 30); g.closePath();
    g.fillStyle = `rgba(3,8,18,${0.18 + 0.25 * q})`; g.fill();
    const face = g.createLinearGradient(0, y0 - A, 0, y0 + A * 2.2);
    face.addColorStop(0, `rgba(70,100,140,${0.1 + 0.16 * q})`); face.addColorStop(1, "rgba(10,20,40,0)");
    g.beginPath(); g.moveTo(-400, yAt(-400));
    for (let x = -400; x <= 1480; x += 16) g.lineTo(x, yAt(x));
    for (let x = 1480; x >= -400; x -= 32) g.lineTo(x, yAt(x) + A * 2.2 + 6);
    g.closePath(); g.fillStyle = face; g.fill();
    const hl = g.createLinearGradient(-400, 0, 1480, 0);
    const c = (MX + 400) / 1880, spread = 0.04 + 0.16 * q, ba = 0.1 + 0.25 * q;
    hl.addColorStop(0, `rgba(110,140,180,${ba * 0.1})`);
    hl.addColorStop(cl(c - spread * 1.8, 0, 1), `rgba(130,160,200,${ba * 0.16})`);
    hl.addColorStop(cl(c - spread, 0, 1), `rgba(190,205,225,${ba * 0.6})`);
    hl.addColorStop(c, `rgba(255,240,205,${Math.min(0.85, ba * 2.0)})`);
    hl.addColorStop(cl(c + spread, 0, 1), `rgba(190,205,225,${ba * 0.6})`);
    hl.addColorStop(cl(c + spread * 1.8, 0, 1), `rgba(130,160,200,${ba * 0.16})`);
    hl.addColorStop(1, `rgba(110,140,180,${ba * 0.1})`);
    g.strokeStyle = hl; g.lineWidth = 0.6 + 1.6 * q;
    g.beginPath(); g.moveTo(-400, yAt(-400));
    for (let x = -400; x <= 1480; x += 16) g.lineTo(x, yAt(x));
    g.stroke();
    const gw = 30 + 380 * q;
    for (let k = 0; k < 6 + q * 10; k++) {
      const xx = MX + Math.sin(k * 12.9898 + j * 78.233) * 0.5 * 2 * gw;
      const fl = 0.5 + 0.5 * Math.sin(t * (3 + (k % 5)) + k * 1.3 + j);
      if (fl < 0.55) continue;
      g.globalAlpha = (fl - 0.5) * 1.6 * (1 - Math.abs(xx - MX) / (gw + 1));
      g.fillStyle = "#fff3d6"; g.fillRect(xx, yAt(xx) - 1, 6 + 26 * q, 1 + 2 * q);
    }
    g.globalAlpha = 1;
    if (q > 0.55) {
      g.fillStyle = "rgba(235,244,250,0.55)";
      for (let x = -400; x <= 1480; x += 9) {
        const s1 = Math.sin((6.283 * x) / L + w * t + ph);
        if (s1 > 0.86) { g.globalAlpha = Math.min(0.8, (s1 - 0.86) * 6 * (q - 0.5)); g.fillRect(x, yAt(x) - 2, 7, 2 + 3 * q); }
      }
      g.globalAlpha = 1;
    }
  }
  const shoreY = 1790 + 55 * Math.sin((6.283 * t) / 6.2);
  for (const f of FOAM) {
    const x = -300 + f.u * 1680, y = shoreY - 30 + f.v * 150 + 14 * Math.sin(x / 70 + t * 0.8 + f.p);
    const twk = 0.5 + 0.5 * Math.sin(t * 2.2 + f.p * 3);
    g.globalAlpha = (0.25 + 0.6 * twk) * (1 - f.v * 0.7);
    g.fillStyle = "#eef5fb"; g.beginPath(); g.arc(x, y, f.r * (0.7 + 0.5 * twk), 0, 6.283); g.fill();
  }
  g.globalAlpha = 1;
  gr = g.createLinearGradient(0, shoreY - 80, 0, shoreY + 40);
  gr.addColorStop(0, "rgba(220,235,245,0)"); gr.addColorStop(1, "rgba(220,235,245,0.22)");
  g.fillStyle = gr; g.fillRect(-400, shoreY - 80, 1880, 120);
  gr = g.createLinearGradient(0, shoreY + 90, 0, shoreY + 420);
  gr.addColorStop(0, "#3a3633"); gr.addColorStop(1, "#151314");
  g.fillStyle = gr; g.fillRect(-400, shoreY + 110, 1880, 600);
  g.fillStyle = "rgba(200,215,230,0.10)"; g.fillRect(-400, shoreY + 100, 1880, 14);
  g.setTransform(1, 0, 0, 1, 0, 0);
}

export function drawSins(g: CanvasRenderingContext2D, t: number) {
  g.clearRect(0, 0, 1080, 1920);
  if (t < 2.8 || t >= 8.0) return;
  const wipeT = W("c", 4);
  const front = -200 + 1500 * ss(wipeT - 0.1, wipeT + 1.1, t);
  for (const s of SINS) {
    const bob = 8 * Math.sin(t * 1.3 + s.p);
    const hit = cl((front - s.x) / 160, 0, 1);
    const a = (1 - hit) * ss(2.9, 3.6, t);
    if (a > 0.01) {
      const rg = g.createRadialGradient(s.x, s.y + bob, 1, s.x, s.y + bob, s.r * 1.8);
      rg.addColorStop(0, `rgba(6,5,8,${0.95 * a})`); rg.addColorStop(0.5, `rgba(22,14,24,${0.75 * a})`); rg.addColorStop(1, "rgba(30,20,34,0)");
      g.fillStyle = rg; g.beginPath(); g.arc(s.x, s.y + bob, s.r * 1.8, 0, 6.283); g.fill();
    }
    if (hit > 0 && hit < 1) {
      g.globalAlpha = (1 - hit) * 0.9; g.fillStyle = "#f4fbff";
      for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(s.x + (k - 2) * 6, s.y + bob - hit * 50 - k * 7, 2 + (k % 2), 0, 6.283); g.fill(); }
      g.globalAlpha = 1;
    }
  }
  if (front > -150 && front < 1300) {
    const lg = g.createLinearGradient(front - 260, 0, front + 40, 0);
    lg.addColorStop(0, "rgba(220,240,255,0)"); lg.addColorStop(0.8, "rgba(230,245,255,0.28)"); lg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = lg; g.fillRect(front - 260, 820, 300, 420);
  }
}

const curve = (s: number): [number, number] => {
  const x = -120 + s, u = (x - 540) / 640;
  return [x, 1010 + 150 * (1 - u * u) - 150];
};

export function drawBeads(g: CanvasRenderingContext2D, t: number) {
  g.clearRect(0, 0, 1080, 1920);
  const sp = 58, off = (countF(t) % 1000) * sp * 0.999;
  g.strokeStyle = "rgba(200,170,110,0.55)"; g.lineWidth = 3; g.beginPath();
  for (let s = 0; s <= 1320; s += 20) { const [x, y] = curve(s); if (s) g.lineTo(x, y); else g.moveTo(x, y); }
  g.stroke();
  for (let i = -2; i < 26; i++) {
    const s = i * sp + (off % sp);
    const idx = i - Math.floor(off / sp);
    const [x, y] = curve(s);
    if (x < -60 || x > 1140) continue;
    const r = 25, marker = Math.abs(x - 540) < sp / 2;
    g.fillStyle = "rgba(0,0,0,0.45)"; g.beginPath(); g.ellipse(x + 6, y + 30, r * 0.9, r * 0.32, 0, 0, 6.283); g.fill();
    const rg = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
    const amber = idx % 33 === 0;
    rg.addColorStop(0, amber ? "#ffe6a6" : "#c98a58"); rg.addColorStop(0.45, amber ? "#d79a3c" : "#7c4426"); rg.addColorStop(1, amber ? "#5b3510" : "#2a130a");
    g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill();
    g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.ellipse(x - r * 0.38, y - r * 0.45, r * 0.28, r * 0.16, -0.6, 0, 6.283); g.fill();
    if (marker) { g.strokeStyle = "rgba(240,197,108,0.8)"; g.lineWidth = 3; g.beginPath(); g.arc(x, y, r + 10, 0, 6.283); g.stroke(); }
  }
  const lg = g.createRadialGradient(540, 700, 40, 540, 900, 700);
  lg.addColorStop(0, "rgba(255,225,160,0.10)"); lg.addColorStop(1, "rgba(255,225,160,0)");
  g.fillStyle = lg; g.fillRect(0, 300, 1080, 1200);
}

let grainImg: ImageData | null = null;
export function drawGrain(g: CanvasRenderingContext2D, frame: number) {
  if (!grainImg) grainImg = g.createImageData(360, 640);
  let h = (frame * 2654435761) >>> 0;
  const d = grainImg.data;
  for (let i = 0; i < d.length; i += 4) {
    h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0;
    const v = h & 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
  }
  g.putImageData(grainImg, 0, 0);
}
