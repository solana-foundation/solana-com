import type { Metadata } from "next";
import { getAlternates, Link } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import Reveal from "@/components/epoch1000/Reveal";
import { tierFor } from "@/lib/epoch1000/tiers";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function ogQuery(
  sp: Record<string, string | string[] | undefined>,
  locale?: string,
): string {
  const p = new URLSearchParams();
  for (const key of ["s", "fe", "c", "t", "x", "w"]) {
    const v = first(sp[key]);
    if (v) p.set(key, v);
  }
  if (locale) p.set("l", locale);
  return p.toString();
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "epoch1000.card" });
  const sp = await searchParams;
  const survived = first(sp.s) || "0";
  const capped = first(sp.x) === "1";
  const firstEpoch = first(sp.fe);
  const tier = tierFor(parseInt(survived, 10) || 0);
  const survivedLabel = `${survived}${capped ? "+" : ""}`;
  const title = t("meta.title", { survived: survivedLabel });
  const description = t(
    firstEpoch
      ? "meta.description.withFirstEpoch"
      : "meta.description.withoutFirstEpoch",
    {
      survived: survivedLabel,
      firstEpoch,
      tierLine: t(`tiers.${tier.id}.line`),
    },
  );
  const image = `/api/epoch1000/og?${ogQuery(sp, locale)}`;
  return {
    title,
    description,
    alternates: getAlternates("/epoch1000/card", locale),
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CardPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "epoch1000.card" });
  const sp = await searchParams;
  const query = ogQuery(sp, locale);
  const survived = Math.max(0, parseInt(first(sp.s), 10) || 0);
  const capped = first(sp.x) === "1";
  const firstEpoch = first(sp.fe);
  const wallet = first(sp.w);
  const tier = tierFor(survived);
  const tierName = t(`tiers.${tier.id}.name`);
  const survivedLabel = `${survived}${capped ? "+" : ""}`;
  const walletLabel = wallet || t("summary.defaultWallet");

  return (
    <main className="w-full max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-20 flex flex-col items-center text-center gap-8 sm:gap-10 min-h-screen">
      <header className="flex flex-col items-center gap-4 sm:gap-5">
        <p className="font-brand-mono text-xs sm:text-sm tracking-[0.2em] text-ep-dust uppercase">
          {t("eyebrow")}
        </p>
        <h1
          className="font-black tracking-tight text-4xl sm:text-6xl leading-none"
          style={{ color: tier.color }}
        >
          {t("heading", { survived: survivedLabel })}
        </h1>
        <p className="text-sm sm:text-base text-ep-dim max-w-xl">
          {t.rich(
            firstEpoch ? "summary.withFirstEpoch" : "summary.withoutFirstEpoch",
            {
              walletLabel,
              survived: survivedLabel,
              firstEpoch,
              wallet: (chunks) =>
                wallet ? (
                  <span className="font-mono text-ep-ink">{chunks}</span>
                ) : (
                  <>{chunks}</>
                ),
              strong: (chunks) => (
                <span className="font-semibold text-ep-ink">{chunks}</span>
              ),
            },
          )}
        </p>
      </header>

      <Reveal className="w-full">
        <img
          src={`/api/epoch1000/og?${query}`}
          alt={t("imageAlt", { tier: tierName, survived: survivedLabel })}
          className="w-full rounded-xl border border-ep-edge"
          style={{ boxShadow: `0 20px 100px -30px ${tier.color}66` }}
          width={1200}
          height={630}
        />
      </Reveal>

      <Reveal className="flex flex-col items-center gap-6 sm:gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/epoch1000#checker"
              className="bg-ep-ink text-ep-void font-semibold rounded-full px-7 py-3 text-sm hover:bg-ep-dim transition-colors duration-200"
            >
              {t("ctaCheck")}
            </Link>
            <Link
              href="/epoch1000"
              className="border border-ep-edge rounded-full px-7 py-3 text-sm text-ep-dim hover:text-ep-ink transition-colors duration-200"
            >
              {t("ctaExplore")}
            </Link>
          </div>
          <p className="text-xs text-ep-dust">{t("privacyNote")}</p>
        </div>
      </Reveal>
    </main>
  );
}
