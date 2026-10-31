import { Easing, interpolate } from "remotion";
import timing from "./timing.json";

export type Word = [string, number, number];
export type Line = { start: number; dur: number; end: number; words: Word[] };
export const T = timing as unknown as Record<string, Line>;
export const W = (k: string, i: number) => T[k].words[i][1];

export const FPS = 30;
export const DUR = 40.5;

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IN = Easing.bezier(0.7, 0, 0.84, 0);
export const BACK = (s: number) => Easing.out(Easing.back(s));

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** time-based tween: value at time t of a tween that starts at `at` and lasts `d` seconds */
export const tw = (t: number, at: number, d: number, from: number, to: number, easing = OUT) =>
  interpolate(t, [at, at + d], [from, to], { ...clamp, easing });

export const cl = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
export const ss = (e0: number, e1: number, x: number) => {
  const u = cl((x - e0) / (e1 - e0), 0, 1);
  return u * u * (3 - 2 * u);
};

/** deterministic PRNG */
export const prng = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

export const CUTS = [2.8, 8.0, 21.1, 23.8, 29.8, 32.65, 35.1];
export const C0 = 24.6;
export const C1 = 29.4;
export const countF = (t: number) => (t < C0 ? 0 : 100 * Math.pow(cl((t - C0) / (C1 - C0), 0, 1), 1.7));
export const countAt = (t: number) => (t < C0 ? 0 : Math.min(100, Math.floor(countF(t)) + 1));

export const GOLD = "#e3bd6e";
export const GOLD2 = "#f0c56c";
export const CREAM = "#efe3cc";
