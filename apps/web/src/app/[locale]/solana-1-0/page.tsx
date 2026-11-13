import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import { Link as CrossAppLink } from "@solana-com/ui-chrome/link";
import Solana10Experience from "@/components/solana-1-0/Solana10Experience";

type Props = { params: Promise<{ locale: string }> };

const PAGE_PATH = "/solana-1-0";

const eyebrowClass =
  "m-0 font-brand-mono text-[0.75rem] font-light uppercase tracking-[0.3em] text-[var(--s10-dim)]";
const headingClass =
  "m-0 text-[clamp(1.75rem,calc(2.2vw+1rem),2.75rem)] font-medium leading-[1.1] tracking-[-0.02em] text-balance";
const bodyClass =
  "m-0 text-[1.0625rem] leading-[1.55] text-[#ece7df]/80 md:text-[1.125rem]";
const listClass = "m-0 flex list-none flex-col p-0";
const itemClass =
  "m-0 border-t border-[var(--s10-rule)] py-4 text-[1rem] leading-[1.5] text-[#ece7df]/85";
const codeClass =
  "rounded-sm bg-white/[0.06] px-1.5 py-0.5 font-brand-mono text-[0.875em] text-[#ece7df] [overflow-wrap:anywhere]";

const CHANGES = ["label", "version", "clients"] as const;
const CONSTANTS = ["chain", "users"] as const;
const FAQ = ["what", "why", "action", "next"] as const;

export default async function Page() {
  const t = await getTranslations("solana10.content");
  const code = (chunks: React.ReactNode) => (
    <code className={codeClass}>{chunks}</code>
  );

  return (
    <Solana10Experience>
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-28 pt-[18svh] md:px-8 lg:pb-40 xl:px-10">
        <div className="flex max-w-[34rem] flex-col gap-24 lg:gap-32">
          <section className="flex flex-col gap-6">
            <p className={eyebrowClass}>{t("intro.eyebrow")}</p>
            <h2 className={headingClass}>{t("intro.title")}</h2>
            <p className={bodyClass}>{t("intro.body")}</p>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className={headingClass}>{t("changes.title")}</h2>
            <ul className={listClass}>
              {CHANGES.map((key) => (
                <li key={key} className={itemClass}>
                  {t(`changes.items.${key}`)}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className={headingClass}>{t("constants.title")}</h2>
            <ul className={listClass}>
              {CONSTANTS.map((key) => (
                <li key={key} className={itemClass}>
                  {t(`constants.items.${key}`)}
                </li>
              ))}
              <li className={itemClass}>
                {t.rich("constants.items.identifiers", { code })}
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className={headingClass}>{t("faq.title")}</h2>
            <div className="flex flex-col">
              {FAQ.map((key) => (
                <details
                  key={key}
                  className="group border-t border-[var(--s10-rule)]"
                >
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-4 text-[1.0625rem] font-medium leading-snug focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ece7df] [&::-webkit-details-marker]:hidden">
                    {t(`faq.items.${key}.q`)}
                    <span
                      aria-hidden="true"
                      className="font-brand-mono text-[var(--s10-dim)] transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                    >
                      +
                    </span>
                  </summary>
                  <p className={`${bodyClass} !mb-5 pr-8`}>
                    {t(`faq.items.${key}.a`)}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="flex flex-col items-start gap-6">
            <h2 className={headingClass}>{t("cta.title")}</h2>
            <p className={bodyClass}>{t("cta.body")}</p>
            <CrossAppLink
              href="/upgrades"
              className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#ece7df] px-6 text-[1rem] font-medium leading-none text-[#040408] no-underline transition-colors duration-200 hover:bg-white hover:text-[#040408] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ece7df]"
            >
              {t("cta.label")}
              <span aria-hidden="true">→</span>
            </CrossAppLink>
          </section>
        </div>
      </div>
    </Solana10Experience>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("solana10.meta");
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
