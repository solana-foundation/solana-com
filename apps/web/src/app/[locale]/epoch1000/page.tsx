import Epoch1000Experience from "@/components/epoch1000/Epoch1000Experience";
import { getAlternates, Link } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Page() {
  const t = await getTranslations();

  return (
    <main className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12 flex flex-col gap-12 sm:gap-16 min-h-screen">
      <header className="flex items-center justify-between">
        <p className="text-xs font-brand-mono tracking-[0.3em] text-ep-dust">
          {t("epoch1000.page.eyebrow")}
        </p>
        <Link
          href="/epoch1000#checker"
          className="text-xs text-ep-dust hover:text-ep-ink transition shrink-0"
        >
          {t("epoch1000.page.checkerLink")}
        </Link>
      </header>

      <Epoch1000Experience
        title={t.rich("epoch1000.page.title", {
          gradient: (chunks) => (
            <span className="text-sol-gradient">{chunks}</span>
          ),
        })}
        description={t("epoch1000.page.description")}
      />
    </main>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations();

  return {
    title: t("epoch1000.meta.title"),
    description: t("epoch1000.meta.description"),
    alternates: getAlternates("/epoch1000", locale),
    openGraph: {
      title: t("epoch1000.meta.openGraphTitle"),
      description: t("epoch1000.meta.openGraphDescription"),
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
