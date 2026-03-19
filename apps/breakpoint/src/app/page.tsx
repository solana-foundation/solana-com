import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import type { Metadata } from "next";
import HomePage from "./[locale]/page";
import { getBaseMetadata } from "./metadata";
import { loadBreakpointMessages } from "@/i18n/request";

const displayFont = localFont({
  src: "../../public/fonts/fh-lecturis/FHLecturis-Regular.woff2",
  variable: "--font-fh-lecturis",
  display: "swap",
});

const bodyFont = localFont({
  src: [
    {
      path: "../../public/fonts/abc-diatype/ABCDiatype-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/abc-diatype/ABCDiatype-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/abc-diatype/ABCDiatype-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-abc-diatype",
  display: "swap",
});

const monoFont = localFont({
  src: "../../public/fonts/macan-mono/Macan-Mono-Medium.woff2",
  variable: "--font-macan-mono",
  display: "swap",
});

export const metadata: Metadata = getBaseMetadata("en");

export default async function RootPage() {
  const { messages } = await loadBreakpointMessages("en");

  return (
    <div
      dir="ltr"
      data-locale="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <NextIntlClientProvider locale="en" messages={messages}>
        <HomePage />
      </NextIntlClientProvider>
    </div>
  );
}
