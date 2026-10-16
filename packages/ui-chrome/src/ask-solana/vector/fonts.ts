import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

/* The Vector family's two typefaces, loaded once and shared by every
   component in this folder (next/font dedupes identical loaders). */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
});
