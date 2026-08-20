import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import Slot200Experience from "@/components/slot200/Slot200Experience";

type Props = { params: Promise<{ locale: string }> };

const PAGE_PATH = "/200ms";
const PAGE_SOCIAL_IMAGE = "/social/solana-200ms.jpg";

export default function Page() {
  return <Slot200Experience />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("slot200.meta");
  const title = t("title");
  const description = t("description");
  const socialImageAlt = t("socialImageAlt");
  const alternates = getAlternates(PAGE_PATH, locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title: t("openGraphTitle"),
      description: t("openGraphDescription"),
      type: "website",
      url: alternates.canonical,
      images: [
        {
          url: PAGE_SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: socialImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: PAGE_SOCIAL_IMAGE, alt: socialImageAlt }],
    },
  };
}
