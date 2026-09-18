import { Playpen_Sans, Quantico } from "next/font/google";

// These variables are deliberately attached only by the Summer School route.
// Keeping them here (rather than the app layout) prevents the zine type system
// from becoming part of the media site's global typography.
export const summerSchoolTitle = Playpen_Sans({
  subsets: ["latin"],
  variable: "--font-summer-school-title",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const summerSchoolBody = Quantico({
  subsets: ["latin"],
  variable: "--font-summer-school-body",
  display: "swap",
  weight: ["400", "700"],
});
