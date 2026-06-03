import type { ReactNode } from "react";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { FabMenu } from "@/components/FabMenu";
import { loadBreakpointMessages } from "@/i18n/request";

const displayFont = localFont({
  src: "../../public/fonts/bp26-extended/BP26-Extended.woff2",
  variable: "--font-bp26",
  display: "swap",
});

const bodyFont = localFont({
  src: [
    {
      path: "../../public/fonts/abc-favorit/ABCFavorit-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/abc-favorit/ABCFavorit-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-abc-favorit",
  display: "swap",
});

const monoFont = localFont({
  src: [
    {
      path: "../../public/fonts/abc-favorit-mono/ABCFavoritMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/abc-favorit-mono/ABCFavoritMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-abc-favorit-mono",
  display: "swap",
});

type DefaultLocaleShellProps = {
  children: ReactNode;
  includeFabMenu?: boolean;
};

export default async function DefaultLocaleShell({
  children,
  includeFabMenu = false,
}: DefaultLocaleShellProps) {
  const { messages } = await loadBreakpointMessages("en");

  return (
    <div
      dir="ltr"
      data-locale="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <NextIntlClientProvider locale="en" messages={messages}>
        {children}
        {includeFabMenu && <FabMenu />}
      </NextIntlClientProvider>
    </div>
  );
}
