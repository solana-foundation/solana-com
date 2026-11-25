import { notFound } from "next/navigation";
import { getAlternates } from "@workspace/i18n/routing";
import PokerGuideIndex from "@/components/poker-guide/poker-guide-index";
import { getPokerGuide, pokerGuideSlug } from "@/lib/poker-guide";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const guide = getPokerGuide(locale);

  if (!guide) notFound();

  return {
    title: guide.data.seoTitle || guide.data.title,
    description: guide.data.description,
    alternates: getAlternates(`/${pokerGuideSlug}`, locale),
  };
}

export default async function PokerGuidePage({ params }: Props) {
  const { locale } = await params;
  const guide = getPokerGuide(locale);

  if (!guide) notFound();

  return (
    <PokerGuideIndex
      title={guide.data.h1 || guide.data.title}
      description={guide.data.description || ""}
    />
  );
}
