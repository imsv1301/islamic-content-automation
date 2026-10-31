import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const f = (family: string, file: string, weight: string, style = "normal", unicodeRange?: string) =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, style, ...(unicodeRange ? { unicodeRange } : {}) });

const LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT = "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";

export const fontsReady = Promise.all([
  f("Montserrat", "montserrat-latin-500-normal.woff2", "500"),
  f("Montserrat", "montserrat-latin-600-normal.woff2", "600"),
  f("Montserrat", "montserrat-latin-700-normal.woff2", "700"),
  f("Montserrat", "montserrat-latin-800-normal.woff2", "800"),
  f("EB Garamond", "eb-garamond-latin-400-normal.woff2", "400"),
  f("EB Garamond", "eb-garamond-latin-400-italic.woff2", "400", "italic", LATIN),
  f("EB Garamond", "eb-garamond-latin-ext-400-italic.woff2", "400", "italic", LATIN_EXT),
  f("EB Garamond", "eb-garamond-latin-600-italic.woff2", "600", "italic"),
  f("Playfair Display", "playfair-display-latin-600-normal.woff2", "600"),
  f("Playfair Display", "playfair-display-latin-700-normal.woff2", "700"),
  f("Amiri", "Amiri-Regular.ttf", "400"),
  f("Amiri", "Amiri-Bold.ttf", "700"),
  f("Baloo 2", "baloo-2-latin-600-normal.woff2", "600"),
  f("Baloo 2", "baloo-2-latin-800-normal.woff2", "800"),
  f("Nunito", "nunito-latin-700-normal.woff2", "700"),
  f("Nunito", "nunito-latin-800-normal.woff2", "800"),
  f("Nunito", "nunito-latin-900-normal.woff2", "900"),
  f("Noto Nastaliq Urdu", "noto-nastaliq-urdu-arabic-400-normal.woff2", "400"),
  f("Noto Nastaliq Urdu", "noto-nastaliq-urdu-arabic-700-normal.woff2", "700"),
]);
