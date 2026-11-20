import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import { Link as CrossAppLink } from "@solana-com/ui-chrome/link";
import Solana10Experience from "@/components/solana-1-0/Solana10Experience";
import { setRequestLocale } from "next-intl/server";
import { createDefaultSocialImage } from "@solana-com/ui-chrome/social-image";
import { config } from "@/config";

type Props = { params: Promise<{ locale: string }> };

const PAGE_PATH = "/solana-1-0";
const eyebrowClass =
  "m-0 font-brand-mono text-xs uppercase tracking-[0.16em] text-[var(--s10-dim)]";
const headingClass =
  "m-0 text-[clamp(2.5rem,4.4vw,4.25rem)] font-normal leading-[1] tracking-[-0.045em] text-balance";
const bodyClass = "m-0 text-lg leading-relaxed text-[#ece7df]/75";
const sectionClass =
  "grid gap-10 border-t border-[var(--s10-rule)] py-20 md:gap-16 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:gap-24";
const linkClass =
  "inline-flex min-h-11 items-center gap-3 text-sm font-medium text-[#ece7df] underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ece7df]";
const UPGRADES = [
  { key: "alpenglow", href: "/upgrades/alpenglow" },
  { key: "slots", href: "/upgrades/reduced-slot-times" },
  { key: "capacity", href: "/upgrades/100m-cu-blocks" },
  { key: "transactions", href: "/upgrades/larger-transaction-sizes" },
] as const;
const UPCOMING = [
  { key: "rent", href: "/upgrades/reduced-rent" },
  { key: "accounts", href: "/upgrades/v1-account-limit" },
] as const;
const FAQ = [
  "what",
  "why",
  "production",
  "chain",
  "announcement",
  "versions",
  "action",
  "operators",
  "next",
  "follow",
] as const;

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "solana10.content" });
  const meta = await getTranslations({ locale, namespace: "solana10.meta" });
  const pageUrl = new URL(
    getAlternates(PAGE_PATH, locale).canonical,
    config.publicUrl,
  ).href;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: meta("title"),
        description: meta("description"),
        inLanguage: locale,
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Solana",
            item: config.publicUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: meta("title"),
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        isPartOf: { "@id": `${pageUrl}#webpage` },
        mainEntity: FAQ.map((key) => ({
          "@type": "Question",
          name: t(`faq.items.${key}.q`),
          acceptedAnswer: { "@type": "Answer", text: t(`faq.items.${key}.a`) },
        })),
      },
    ],
  };
  const code = (chunks: React.ReactNode) => (
    <code className="rounded-sm bg-white/[0.06] px-1.5 py-0.5 font-brand-mono text-[0.875em] text-[#ece7df] [overflow-wrap:anywhere]">
      {chunks}
    </code>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Solana10Experience>
        <div className="mx-auto w-full max-w-[1440px] px-5 py-24 md:px-8 md:py-36 xl:px-10">
          <section
            aria-labelledby="s10-intro"
            className="flex max-w-[36rem] flex-col gap-6 lg:min-h-[50svh] lg:justify-center"
          >
            <p className={eyebrowClass}>{t("intro.eyebrow")}</p>
            <h2 id="s10-intro" className={headingClass}>
              {t("intro.title")}
            </h2>
            <p className={bodyClass}>{t("intro.body")}</p>
          </section>
        </div>

        <div data-s10-opaque-content className="relative bg-[#040408]">
          <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10">
            <section aria-labelledby="s10-milestone" className={sectionClass}>
              <div className="flex flex-col items-start gap-6">
                <p className={eyebrowClass}>{t("changes.eyebrow")}</p>
                <h2 id="s10-milestone" className={headingClass}>
                  {t("changes.title")}
                </h2>
                <p className={bodyClass}>{t("changes.body")}</p>
                <ul className="m-0 flex list-none flex-col p-0">
                  {(["label", "version", "clients"] as const).map((key) => (
                    <li
                      key={key}
                      className="border-t border-[var(--s10-rule)] py-4 text-base leading-relaxed text-[#ece7df]/75"
                    >
                      {t(`changes.items.${key}`)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-6 lg:pt-10">
                <h3 className="m-0 text-2xl font-normal tracking-tight">
                  {t("constants.title")}
                </h3>
                <ul className="m-0 flex list-none flex-col p-0">
                  {(["chain", "users"] as const).map((key) => (
                    <li
                      key={key}
                      className="border-t border-[var(--s10-rule)] py-4 text-base leading-relaxed text-[#ece7df]/75"
                    >
                      {t(`constants.items.${key}`)}
                    </li>
                  ))}
                  <li className="border-t border-[var(--s10-rule)] py-4 text-base leading-relaxed text-[#ece7df]/75">
                    {t.rich("constants.items.identifiers", { code })}
                  </li>
                </ul>
              </div>
            </section>

            <section
              aria-labelledby="s10-upgrades"
              className="border-t border-[var(--s10-rule)] py-20 md:py-28"
            >
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
                <div className="flex flex-col gap-6">
                  <p className={eyebrowClass}>{t("upgrades.eyebrow")}</p>
                  <h2 id="s10-upgrades" className={headingClass}>
                    {t("upgrades.title")}
                  </h2>
                </div>
                <p className={`${bodyClass} lg:self-end`}>
                  {t("upgrades.body")}
                </p>
              </div>
              <div className="mt-14 grid gap-x-16 md:grid-cols-2">
                {UPGRADES.map(({ key, href }) => (
                  <article
                    key={key}
                    className="flex flex-col items-start border-t border-[var(--s10-rule)] py-8 md:py-10"
                  >
                    <h3 className="m-0 text-2xl font-normal tracking-tight">
                      {t(`upgrades.items.${key}.title`)}
                    </h3>
                    <p className="mb-2 mt-8 text-[clamp(3rem,5vw,4.5rem)] leading-none tracking-[-0.05em]">
                      {t(`upgrades.items.${key}.metric`)}
                    </p>
                    <p className={eyebrowClass}>
                      {t(`upgrades.items.${key}.label`)}
                    </p>
                    <p className={`${bodyClass} mb-4 mt-6`}>
                      {t(`upgrades.items.${key}.body`)}
                    </p>
                    <CrossAppLink
                      href={href}
                      className={`${linkClass} mt-auto`}
                    >
                      {t(`upgrades.items.${key}.link`)}
                      <span aria-hidden="true">↗</span>
                    </CrossAppLink>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="s10-next" className={sectionClass}>
              <div className="flex flex-col gap-6">
                <p className={eyebrowClass}>{t("next.eyebrow")}</p>
                <h2 id="s10-next" className={headingClass}>
                  {t("next.title")}
                </h2>
                <p className={bodyClass}>{t("next.body")}</p>
              </div>
              <div className="flex flex-col gap-10">
                {UPCOMING.map(({ key, href }) => (
                  <article
                    key={key}
                    className="flex flex-col items-start gap-4 border-t border-[var(--s10-rule)] pt-6"
                  >
                    <p className={eyebrowClass}>
                      {t(`next.items.${key}.status`)}
                    </p>
                    <h3 className="m-0 text-2xl font-normal tracking-tight">
                      {t(`next.items.${key}.title`)}
                    </h3>
                    <p className={bodyClass}>{t(`next.items.${key}.body`)}</p>
                    <CrossAppLink href={href} className={linkClass}>
                      {t(`next.items.${key}.label`)}
                      <span aria-hidden="true">↗</span>
                    </CrossAppLink>
                  </article>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="s10-impact"
              className="border-t border-[var(--s10-rule)] py-20 md:py-28"
            >
              <div className="flex max-w-[48rem] flex-col gap-6">
                <p className={eyebrowClass}>{t("impact.eyebrow")}</p>
                <h2 id="s10-impact" className={headingClass}>
                  {t("impact.title")}
                </h2>
              </div>
              <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
                {(["users", "developers", "validators"] as const).map((key) => (
                  <article
                    key={key}
                    className="flex flex-col gap-4 border-t border-[var(--s10-rule)] pt-6"
                  >
                    <h3 className="m-0 text-2xl font-normal tracking-tight">
                      {t(`impact.items.${key}.title`)}
                    </h3>
                    <p className={bodyClass}>{t(`impact.items.${key}.body`)}</p>
                  </article>
                ))}
              </div>
              <CrossAppLink href="/upgrades" className={`${linkClass} mt-8`}>
                {t("impact.label")}
                <span aria-hidden="true">↗</span>
              </CrossAppLink>
            </section>

            <section aria-labelledby="s10-faq" className={sectionClass}>
              <h2 id="s10-faq" className={headingClass}>
                {t("faq.title")}
              </h2>
              <div>
                {FAQ.map((key) => (
                  <details
                    key={key}
                    className="group border-t border-[var(--s10-rule)]"
                  >
                    <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 text-lg font-medium leading-snug focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ece7df] [&::-webkit-details-marker]:hidden">
                      {t(`faq.items.${key}.q`)}
                      <span
                        aria-hidden="true"
                        className="font-brand-mono text-[var(--s10-dim)] transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                      >
                        +
                      </span>
                    </summary>
                    <p className={`${bodyClass} !mb-6 pr-8`}>
                      {t(`faq.items.${key}.a`)}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            <section aria-labelledby="s10-resources" className={sectionClass}>
              <h2 id="s10-resources" className={headingClass}>
                {t("cta.title")}
              </h2>
              <div className="flex flex-col items-start gap-6">
                <p className={bodyClass}>{t("cta.body")}</p>
                <CrossAppLink
                  href="/upgrades"
                  className="inline-flex min-h-12 items-center gap-3 bg-[#ece7df] px-6 text-base font-medium text-[#040408] no-underline hover:bg-white hover:text-[#040408] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ece7df]"
                >
                  {t("cta.label")}
                  <span aria-hidden="true">→</span>
                </CrossAppLink>
              </div>
            </section>
          </div>
        </div>
      </Solana10Experience>
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "solana10.meta" });
  const title = t("title");
  const description = t("description");
  const alternates = getAlternates(PAGE_PATH, locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      type: "website",
      url: alternates.canonical,
      siteName: "Solana",
      locale,
      images: [createDefaultSocialImage()],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@solana",
      images: [createDefaultSocialImage()],
    },
  };
}
