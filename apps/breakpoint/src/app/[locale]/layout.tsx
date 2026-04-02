import type { ReactNode } from "react";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { staticLocales } from "@workspace/i18n/config";
import { getLangDir } from "rtl-detect";
import { PersistentPodcastPlayer } from "@solana-com/ui-chrome";
import { getBaseMetadata } from "@/app/metadata";
import { FabMenu } from "@/components/FabMenu";

const displayFont = localFont({
  src: "../../../public/fonts/fh-lecturis/FHLecturis-Regular.woff2",
  variable: "--font-fh-lecturis",
  display: "swap",
});

const bodyFont = localFont({
  src: [
    {
      path: "../../../public/fonts/abc-diatype/ABCDiatype-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/abc-diatype/ABCDiatype-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/abc-diatype/ABCDiatype-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-abc-diatype",
  display: "swap",
});

const monoFont = localFont({
  src: "../../../public/fonts/macan-mono/Macan-Mono-Medium.woff2",
  variable: "--font-macan-mono",
  display: "swap",
});

export function generateStaticParams() {
  return staticLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getBaseMetadata(locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <div
      dir={getLangDir(locale)}
      data-locale={locale}
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
        <FabMenu />
        <PersistentPodcastPlayer />
      </NextIntlClientProvider>
    </div>
  );
}
