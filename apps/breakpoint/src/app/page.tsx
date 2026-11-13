import localFont from "next/font/local";
import type { Metadata } from "next";
import { CookieConsentBanner } from "@solana-com/ui-chrome";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import HomePage from "./[locale]/page";
import { getHomeMetadata } from "./metadata";
import {
  resolveConferenceState,
  type SearchParams,
} from "@/content/conference-state";
import { FabMenu } from "@/components/FabMenu";
import { loadBreakpointMessages } from "@/i18n/request";

export const dynamic = "force-dynamic";

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

type RootPageProps = {
  searchParams?: Promise<SearchParams>;
};

export async function generateMetadata({
  searchParams,
}: RootPageProps): Promise<Metadata> {
  return await getHomeMetadata(
    "en",
    resolveConferenceState(await searchParams),
  );
}

export default async function RootPage({ searchParams }: RootPageProps) {
  const { messages } = await loadBreakpointMessages("en");

  return (
    <div
      dir="ltr"
      data-locale="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <NextIntlClientProvider locale="en" messages={messages}>
        <HomePage
          params={Promise.resolve({ locale: "en" })}
          searchParams={searchParams}
        />
        <FabMenu />
        <CookieConsentBanner />
      </NextIntlClientProvider>
    </div>
  );
}
