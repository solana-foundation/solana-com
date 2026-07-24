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
  return <div className={`wsop-page ${anton.variable}`}>{children}</div>;
}
