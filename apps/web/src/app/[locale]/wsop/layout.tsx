import type { ReactNode } from "react";
import { Anton } from "next/font/google";
import "./wsop.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--wsop-display",
  display: "swap",
});

export default function WsopLayout({ children }: { children: ReactNode }) {
  return (
    /* Paradise accent replaces the Vegas green */
    <div className={`wsop-page [--wsop-green:#7fd8f0] ${anton.variable}`}>
      {children}
    </div>
  );
}
