import Countdown from "@/components/epoch1000/Countdown";
import WalletChecker from "@/components/epoch1000/WalletChecker";
import { getAlternates, Link } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Page() {
  const t = await getTranslations();

  return (
    <main className="w-full max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16 flex flex-col gap-16 sm:gap-24 min-h-screen">
      <header className="flex items-center justify-between">
        <p className="text-xs font-mono tracking-[0.3em] text-ep-dust">
          {t("epoch1000.page.eyebrow")}
        </p>
        <Link
          href="/epoch1000#checker"
          className="text-xs text-ep-dust hover:text-ep-ink transition shrink-0"
        >
          {t("epoch1000.page.checkerLink")}
        </Link>
      </header>

      <div className="flex flex-col gap-6">
        <h1 className="font-black tracking-tight text-5xl sm:text-7xl leading-tight">
          {t.rich("epoch1000.page.title", {
            gradient: (chunks) => (
              <span className="text-sol-gradient">{chunks}</span>
            ),
          })}
        </h1>
        <p className="text-sm sm:text-base text-ep-dim max-w-xl">
          {t("epoch1000.page.description")}
        </p>
      </div>

      <WalletChecker />

      <hr className="border-ep-edge" />

      <Countdown />
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
