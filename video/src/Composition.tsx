import { Composition } from "remotion";
import { HadithSeaFoam } from "./HadithSeaFoam";
import { DUR, FPS } from "./lib";
import "./fonts";
import { KidsEp1 } from "./kids/KidsEp1";
import { TOTAL as KIDS_TOTAL } from "./kids/kit";
import { NaatSabSeAula, NAAT_DUR } from "./naat/NaatSabSeAula";
import { SadqahShort, SADQAH_DUR } from "./day1/SadqahShort";
import { RiddleShort, RIDDLE_DUR } from "./day1/RiddleShort";
import { KidsThumb } from "./day1/KidsThumb";
import { StrengthShort, STRENGTH_DUR } from "./day1/StrengthShort";
import { SolutionShort, SOLUTION_DUR } from "./day1/SolutionShort";
import { KidsShort, KIDSSHORT_DUR } from "./day1/KidsShort";
import { ChhapTilak, CHHAP_DUR } from "./qawwali/ChhapTilak";
import { MysteryShort, MYSTERY_DUR } from "./day1/MysteryShort";
import { D1101Riddle, D1101_RIDDLE_DUR } from "./day1/D1101Riddle";
import { D1101Sadqah, D1101_SADQAH_DUR } from "./day1/D1101Sadqah";
import { D1101Kids, D1101_KIDS_DUR } from "./day1/D1101Kids";
import { D1102Riddle, D1102_RIDDLE_DUR } from "./day1/D1102Riddle";
import { D1102Sadqah, D1102_SADQAH_DUR } from "./day1/D1102Sadqah";
import { D1102Kids, D1102_KIDS_DUR } from "./day1/D1102Kids";
import { D1103Riddle, D1103_RIDDLE_DUR } from "./day1/D1103Riddle";
import { D1103Sadqah, D1103_SADQAH_DUR } from "./day1/D1103Sadqah";
import { D1103Kids, D1103_KIDS_DUR } from "./day1/D1103Kids";
import { D1104Riddle, D1104_RIDDLE_DUR } from "./day1/D1104Riddle";
import { D1104Sadqah, D1104_SADQAH_DUR } from "./day1/D1104Sadqah";
import { D1104Kids, D1104_KIDS_DUR } from "./day1/D1104Kids";
import { D1105Riddle, D1105_RIDDLE_DUR } from "./day1/D1105Riddle";
import { D1105Sadqah, D1105_SADQAH_DUR } from "./day1/D1105Sadqah";
import { D1105Kids, D1105_KIDS_DUR } from "./day1/D1105Kids";
import { D1106Riddle, D1106_RIDDLE_DUR } from "./day1/D1106Riddle";
import { D1106Sadqah, D1106_SADQAH_DUR } from "./day1/D1106Sadqah";
import { D1106Kids, D1106_KIDS_DUR } from "./day1/D1106Kids";
import { NaatReal, NAAT_REAL_DUR } from "./naat/NaatReal";

export const MyComposition = () => {
  return (
    <>
    <Composition id="NaatOverlay" component={NaatReal} defaultProps={{ overlay: true }} durationInFrames={Math.round(NAAT_REAL_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="NaatReal" component={NaatReal} durationInFrames={Math.round(NAAT_REAL_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="SolutionShort" component={SolutionShort} durationInFrames={Math.round(SOLUTION_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="KidsShort" component={KidsShort} durationInFrames={Math.round((KIDSSHORT_DUR + 1.0) * 30)} fps={30} width={1080} height={1920} />
    <Composition id="ChhapTilak" component={ChhapTilak} durationInFrames={Math.round(CHHAP_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1101Riddle" component={D1101Riddle} durationInFrames={Math.round(D1101_RIDDLE_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1101Sadqah" component={D1101Sadqah} durationInFrames={Math.round(D1101_SADQAH_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1101Kids" component={D1101Kids} durationInFrames={Math.round(D1101_KIDS_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1102Riddle" component={D1102Riddle} durationInFrames={Math.round(D1102_RIDDLE_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1102Sadqah" component={D1102Sadqah} durationInFrames={Math.round(D1102_SADQAH_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1102Kids" component={D1102Kids} durationInFrames={Math.round(D1102_KIDS_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1103Riddle" component={D1103Riddle} durationInFrames={Math.round(D1103_RIDDLE_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1103Sadqah" component={D1103Sadqah} durationInFrames={Math.round(D1103_SADQAH_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1103Kids" component={D1103Kids} durationInFrames={Math.round(D1103_KIDS_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1104Riddle" component={D1104Riddle} durationInFrames={Math.round(D1104_RIDDLE_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1104Sadqah" component={D1104Sadqah} durationInFrames={Math.round(D1104_SADQAH_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1104Kids" component={D1104Kids} durationInFrames={Math.round(D1104_KIDS_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1105Riddle" component={D1105Riddle} durationInFrames={Math.round(D1105_RIDDLE_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1105Sadqah" component={D1105Sadqah} durationInFrames={Math.round(D1105_SADQAH_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1105Kids" component={D1105Kids} durationInFrames={Math.round(D1105_KIDS_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1106Riddle" component={D1106Riddle} durationInFrames={Math.round(D1106_RIDDLE_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1106Sadqah" component={D1106Sadqah} durationInFrames={Math.round(D1106_SADQAH_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="D1106Kids" component={D1106Kids} durationInFrames={Math.round(D1106_KIDS_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="MysteryShort" component={MysteryShort} durationInFrames={Math.round(MYSTERY_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="StrengthShort" component={StrengthShort} durationInFrames={Math.round(STRENGTH_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="KidsThumb" component={KidsThumb} durationInFrames={1} fps={30} width={1280} height={720} />
    <Composition id="RiddleShort" component={RiddleShort} durationInFrames={Math.round(RIDDLE_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="SadqahShort" component={SadqahShort} durationInFrames={Math.round(SADQAH_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition
      id="NaatSabSeAula"
      component={NaatSabSeAula}
      durationInFrames={Math.round(NAAT_DUR * 30)}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="KidsEp1"
      component={KidsEp1}
      durationInFrames={Math.round(KIDS_TOTAL * 30)}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="HadithSeaFoam"
      component={HadithSeaFoam}
      durationInFrames={Math.round(DUR * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
    />
    </>
  );
};
