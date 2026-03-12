import type { ReactNode } from "react";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

import "@/styles.css";

const fontSans = localFont({
  src: [
    {
      path: "../fonts/ABCDiatype-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/ABCDiatype-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../fonts/ABCDiatype-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/ABCDiatype-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/ABCDiatype-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ABCDiatype-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/ABCDiatype-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/ABCDiatype-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/ABCDiatype-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/ABCDiatype-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/ABCDiatype-Thin.woff",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/ABCDiatype-ThinItalic.woff",
      weight: "100",
      style: "italic",
    },
    {
      path: "../fonts/ABCDiatype-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/ABCDiatype-LightItalic.woff",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/ABCDiatype-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ABCDiatype-RegularItalic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/ABCDiatype-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/ABCDiatype-MediumItalic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/ABCDiatype-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/ABCDiatype-BoldItalic.woff",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-sans",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn(fontSans.variable)} suppressHydrationWarning>
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
