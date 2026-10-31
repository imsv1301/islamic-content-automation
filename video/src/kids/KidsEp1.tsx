import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Iris, SCENES, useT } from "./kit";
import { Home, Intro, Travel } from "./scenes1";
import { Hadith, Makkah, Safa } from "./scenes2";
import { Captions, Kitchen, Outro, Quiz, Rules } from "./scenes3";

const MAP: Record<string, React.FC> = { intro: Intro, home: Home, travel: Travel, makkah: Makkah, safa: Safa, hadith: Hadith, kitchen: Kitchen, rules: Rules, quiz: Quiz, outro: Outro };

/** Every scene reads the absolute timeline (useT = frame / fps). The incoming scene is revealed
 *  through an expanding circle while the previous one stays underneath for the 0.7 s transition. */
export const KidsEp1: React.FC = () => {
  const t = useT();
  const idx = SCENES.findIndex((s) => t >= s.start && t < s.end);
  const i = idx < 0 ? SCENES.length - 1 : idx;
  const cur = SCENES[i];
  const prev = i > 0 && t < cur.start + 0.72 ? SCENES[i - 1] : null;
  const Cur = MAP[cur.name];
  const Prev = prev ? MAP[prev.name] : null;
  return (
    <AbsoluteFill style={{ background: "#1b1440" }}>
      {Prev ? <Prev /> : null}
      <Iris t={t} start={cur.start}><Cur /></Iris>
      <Captions />
      <Audio src={staticFile("kids-ep1/mix.m4a")} />
    </AbsoluteFill>
  );
};
