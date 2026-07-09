import Epoch1000Experience from "@/components/epoch1000/Epoch1000Experience";
import type { Metadata } from "next";
import { getAlternates, Link } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";

type Props = { params: Promise<{ locale: string }> };

const EPOCH1000_PATH = "/epoch1000";
const EPOCH1000_SOCIAL_IMAGE = "/api/epoch1000/og?s=1000&fe=0&c=1000";

export default async function Page() {
  const t = await getTranslations("epoch1000.page");

  return (
    <main className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-12 flex flex-col gap-10 sm:gap-14 min-h-screen">
      <header className="flex items-center justify-between gap-4 border-b border-ep-edge/70 pb-4">
        <p className="text-xs font-brand-mono uppercase tracking-[0.3em] text-ep-dust">
          {t("eyebrow")}
        </p>
        <Link
          href="/epoch1000#checker"
          className="text-xs font-brand-mono text-ep-dust hover:text-ep-ink transition-colors duration-200 shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          {t("checkerLink")}
        </Link>
      </header>

      <Epoch1000Experience
        title={t.rich("title", {
          gradient: (chunks) => (
            <span className="text-sol-gradient">{chunks}</span>
          ),
        })}
        description={t("description")}
      />
    </main>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("epoch1000.meta");
  const title = t("title");
  const description = t("description");
  const alternates = getAlternates(EPOCH1000_PATH, locale);

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
          url: EPOCH1000_SOCIAL_IMAGE,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [EPOCH1000_SOCIAL_IMAGE],
    },
  };
}
