import Epoch1000Experience from "@/components/epoch1000/Epoch1000Experience";
import { getAlternates, Link } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Page() {
  const t = await getTranslations();

  return (
    <main className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-12 flex flex-col gap-10 sm:gap-14 min-h-screen">
      <header className="flex items-center justify-between gap-4 border-b border-ep-edge/70 pb-4">
        <p className="text-xs font-brand-mono uppercase tracking-[0.3em] text-ep-dust">
          {t("epoch1000.page.eyebrow")}
        </p>
        <Link
          href="/epoch1000#checker"
          className="text-xs font-brand-mono text-ep-dust hover:text-ep-ink transition-colors duration-200 shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
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
