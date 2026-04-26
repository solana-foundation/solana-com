import type { ReactNode } from "react";
import localFont from "next/font/local";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { locales } from "@workspace/i18n/config";
import { getBaseMetadata } from "../metadata";
import { loadBreakpointMessages } from "@/i18n/request";
import { FabMenu } from "@/components/FabMenu";

const displayFont = localFont({
  src: "../../../public/fonts/bp26-extended/BP26-Extended.woff2",
  variable: "--font-bp26",
  display: "swap",
});

const bodyFont = localFont({
  src: [
    {
      path: "../../../public/fonts/abc-favorit/ABCFavorit-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/abc-favorit/ABCFavorit-Bold.woff2",
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
      path: "../../../public/fonts/abc-favorit-mono/ABCFavoritMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/abc-favorit-mono/ABCFavoritMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-abc-favorit-mono",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return await getBaseMetadata(locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { messages } = await loadBreakpointMessages(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      dir={dir}
      data-locale={locale}
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
        <FabMenu />
      </NextIntlClientProvider>
    </div>
  );
}
