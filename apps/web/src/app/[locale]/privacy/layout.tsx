import { ReactNode } from "react";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./privacy.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--pp-font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--pp-font-mono",
  display: "swap",
});

type Props = {
  children: ReactNode;
};

export default function PrivacyLayout({ children }: Props) {
  return (
    <div className={`${interTight.variable} ${jetbrainsMono.variable}`}>
      {children}
    </div>
  );
}
