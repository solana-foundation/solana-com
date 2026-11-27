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
  "m-0 text-[clamp(2.5rem,4.6vw,4.5rem)] font-normal leading-[1] tracking-[-0.045em] text-balance";
const cardClass =
  "m-0 text-[clamp(3rem,7vw,6.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em]";
const bodyClass = "m-0 text-lg leading-relaxed text-[#ece7df]/80";
const itemClass =
  "border-0 border-t border-solid border-[var(--s10-rule)] py-4 text-base leading-relaxed text-[#ece7df]/80";
const gutterClass = "mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-12";
const linkClass =
  "inline-flex min-h-11 items-center gap-3 text-sm font-medium text-[#ece7df] underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ece7df]";
const UPGRADES = [
  // `before` and `now` are bar widths in percent, to scale within each pair:
  // 12.8s to 150ms, 400ms to 200ms, 60M to 100M CU, 1,232 to 4,096 bytes.
  { key: "alpenglow", href: "/upgrades/alpenglow", before: 100, now: 1.2 },
  {
    key: "slots",
    href: "/upgrades/reduced-slot-times",
    before: 100,
    now: 50,
  },
  { key: "capacity", href: "/upgrades/100m-cu-blocks", before: 60, now: 100 },
  {
    key: "transactions",
    href: "/upgrades/larger-transaction-sizes",
    before: 30,
    now: 100,
  },
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

/**
 * One shot of the film. The plate is transparent so the stage shows through
 * and `data-s10-scene` cuts the particles to this chapter's scene as it
 * scrolls in; the details sit on a dark panel below it.
 */
function Chapter({
  id,
  card,
  eyebrow,
  title,
  body,
  children,
}: {
  id: string;
  card?: React.ReactNode;
  eyebrow?: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <div
        data-s10-scene
        className={`${gutterClass} flex min-h-[100svh] flex-col justify-end pb-14 lg:min-h-[90svh] lg:justify-center lg:pb-0`}
      >
        <div className="flex flex-col gap-6 [text-shadow:0_0_24px_rgb(4_4_8/0.9)] lg:max-w-[46%]">
          {card ? <p className={cardClass}>{card}</p> : null}
          {eyebrow ? <p className={eyebrowClass}>{eyebrow}</p> : null}
          <h2 id={id} className={headingClass}>
            {title}
          </h2>
          {body ? <p className={bodyClass}>{body}</p> : null}
        </div>
      </div>
      {children ? (
        <div className="bg-[linear-gradient(to_bottom,transparent,rgb(4_4_8/0.9)_7rem,rgb(4_4_8/0.9)_calc(100%-7rem),transparent)] py-28">
          <div className={gutterClass}>{children}</div>
        </div>
      ) : null}
    </section>
  );
}

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
        <Chapter
          id="s10-intro"
          card={t.rich("intro.card", {
            gone: (chunks) => (
              <span className="text-transparent line-through decoration-[#9945ff] decoration-[0.06em] [-webkit-text-stroke:1px_rgb(236_231_223/0.5)]">
                {chunks}
              </span>
            ),
          })}
          eyebrow={t("intro.eyebrow")}
          title={t("intro.title")}
          body={t("intro.body")}
        />

        <Chapter
          id="s10-milestone"
          eyebrow={t("changes.eyebrow")}
          title={t("changes.title")}
          body={t("changes.body")}
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
            <ul className="m-0 flex list-none flex-col p-0">
              {(["label", "version", "clients"] as const).map((key) => (
                <li key={key} className={itemClass}>
                  {t(`changes.items.${key}`)}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-6">
              <h3 className="m-0 text-2xl font-normal tracking-tight">
                {t("constants.title")}
              </h3>
              <ul className="m-0 flex list-none flex-col p-0">
                {(["chain", "users"] as const).map((key) => (
                  <li key={key} className={itemClass}>
                    {t(`constants.items.${key}`)}
                  </li>
                ))}
                <li className={itemClass}>
                  {t.rich("constants.items.identifiers", { code })}
                </li>
              </ul>
            </div>
          </div>
        </Chapter>

        <Chapter
          id="s10-upgrades"
          eyebrow={t("upgrades.eyebrow")}
          title={t("upgrades.title")}
          body={t("upgrades.body")}
        >
          <div className="grid gap-x-16 md:grid-cols-2">
            {UPGRADES.map(({ key, href, before, now }) => (
              <article
                key={key}
                className="flex flex-col items-start border-0 border-t border-solid border-[var(--s10-rule)] py-8 md:py-10"
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
                <div className="mt-6 grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 font-brand-mono text-xs uppercase tracking-[0.12em] text-[var(--s10-dim)]">
                  <span>{t("upgrades.before")}</span>
                  <span aria-hidden="true" className="h-1.5 bg-white/[0.07]">
                    <span
                      className="block h-full bg-[#ece7df]/40"
                      style={{ width: `${before}%` }}
                    />
                  </span>
                  <span>{t(`upgrades.items.${key}.before`)}</span>
                  <span className="text-[#ece7df]">{t("upgrades.now")}</span>
                  <span aria-hidden="true" className="h-1.5 bg-white/[0.07]">
                    <span
                      className="block h-full min-w-[3px] bg-gradient-to-r from-[#9945ff] to-[#14f195]"
                      style={{ width: `${now}%` }}
                    />
                  </span>
                  <span className="text-[#ece7df]">
                    {t(`upgrades.items.${key}.metric`)}
                  </span>
                </div>
                <p className={`${bodyClass} mb-4 mt-6`}>
                  {t(`upgrades.items.${key}.body`)}
                </p>
                <CrossAppLink href={href} className={`${linkClass} mt-auto`}>
                  {t(`upgrades.items.${key}.link`)}
                  <span aria-hidden="true">↗</span>
                </CrossAppLink>
              </article>
            ))}
          </div>
        </Chapter>

        <Chapter
          id="s10-next"
          eyebrow={t("next.eyebrow")}
          title={t("next.title")}
          body={t("next.body")}
        >
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            {UPCOMING.map(({ key, href }) => (
              <article
                key={key}
                className="flex flex-col items-start gap-4 border-0 border-t border-solid border-[var(--s10-rule)] pt-6"
              >
                <p className={eyebrowClass}>{t(`next.items.${key}.status`)}</p>
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
        </Chapter>

        <Chapter
          id="s10-impact"
          eyebrow={t("impact.eyebrow")}
          title={t("impact.title")}
        >
          <div className="grid gap-10 md:grid-cols-3 md:gap-12">
            {(["users", "developers", "validators"] as const).map((key) => (
              <article
                key={key}
                className="flex flex-col gap-4 border-0 border-t border-solid border-[var(--s10-rule)] pt-6"
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
        </Chapter>

        <Chapter id="s10-faq" title={t("faq.title")}>
          <div className="mx-auto max-w-[56rem]">
            {FAQ.map((key) => (
              <details
                key={key}
                className="group border-0 border-t border-solid border-[var(--s10-rule)]"
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
        </Chapter>

        <section
          data-s10-scene
          aria-labelledby="s10-finale"
          className="mx-auto flex min-h-[100svh] w-full max-w-[1440px] flex-col items-center gap-6 px-5 pb-[38svh] pt-[12svh] text-center md:px-10"
        >
          <h2
            id="s10-finale"
            className="m-0 text-[clamp(2.75rem,7.5vw,7rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em] text-balance"
          >
            {t("finale.title")}
          </h2>
          <p className="m-0 text-2xl tracking-tight">{t("cta.title")}</p>
          <p className={`${bodyClass} max-w-[34rem]`}>{t("cta.body")}</p>
          <CrossAppLink
            href="/upgrades"
            className="inline-flex min-h-12 items-center gap-3 bg-[#ece7df] px-6 text-base font-medium text-[#040408] no-underline hover:bg-white hover:text-[#040408] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ece7df]"
          >
            {t("cta.label")}
            <span aria-hidden="true">→</span>
          </CrossAppLink>
        </section>
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
