import type { Metadata } from "next";
import { getIndexMetadata } from "@/app/metadata";
import { ThemePrepaint } from "@/app/(docs)/[locale]/developers/theme-prepaint";
import { LearnLanding } from "./learn-landing";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export default async function LearnPage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <ThemePrepaint />
      <LearnLanding locale={locale} />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getIndexMetadata({
    titleKey: "learn.landing.metadata.title",
    descriptionKey: "learn.landing.metadata.description",
    path: "/learn",
    locale,
  });
}
