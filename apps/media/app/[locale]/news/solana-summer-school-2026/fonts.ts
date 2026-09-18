import { Quantico } from "next/font/google";

// This variable is deliberately attached only by the Summer School route.
// Keeping it here (rather than the app layout) prevents the zine type system
// from becoming part of the media site's global typography.
export const summerSchoolBody = Quantico({
  subsets: ["latin"],
  variable: "--font-summer-school-body",
  display: "swap",
  weight: ["400", "700"],
});
