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
import { NaatReal, NAAT_REAL_DUR } from "./naat/NaatReal";

export const MyComposition = () => {
  return (
    <>
    <Composition id="NaatOverlay" component={NaatReal} defaultProps={{ overlay: true }} durationInFrames={Math.round(NAAT_REAL_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="NaatReal" component={NaatReal} durationInFrames={Math.round(NAAT_REAL_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="SolutionShort" component={SolutionShort} durationInFrames={Math.round(SOLUTION_DUR * 30)} fps={30} width={1080} height={1920} />
    <Composition id="KidsShort" component={KidsShort} durationInFrames={Math.round((KIDSSHORT_DUR + 1.0) * 30)} fps={30} width={1080} height={1920} />
    <Composition id="ChhapTilak" component={ChhapTilak} durationInFrames={Math.round(CHHAP_DUR * 30)} fps={30} width={1080} height={1920} />
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
