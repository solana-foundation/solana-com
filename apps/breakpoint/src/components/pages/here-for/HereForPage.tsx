import { getTranslations } from "@workspace/i18n/server";
import Marquee from "@/components/Marquee";
import PageShell from "@/components/PageShell";
import SubpageHero from "@/components/SubpageHero";
import Footer from "@/components/sections/Footer";
import { GENERAL_ADMISSION_HREF } from "@/content/links";
import Explorer from "./Explorer";
import { HERE_FOR_PATH } from "./constants";
import { hereForType } from "./typography";

const MARQUEE_KEYS = [
  "community",
  "connections",
  "mutuals",
  "london",
  "hereFor",
] as const;

// Filled box glyphs for the how-it-works steps: add, explore, mutuals.
const STEP_ICON_PATHS = {
  1: "M12 4h8v24h-8zM4 12h24v8H4z",
  2: "M4 4h10v10H4zM18 18h10v10H18zM15 8h9v3h-9zM21 11h3v6h-3z",
  3: "M3 10h12v12H3zM17 10h12v12H17z",
} as const;

function StepIcon({ step }: { step: keyof typeof STEP_ICON_PATHS }) {
  return (
    <svg
      aria-hidden="true"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className="text-core-purple"
      fill="currentColor"
    >
      <path d={STEP_ICON_PATHS[step]} fillRule="nonzero" />
    </svg>
  );
}

const SHARE_CARDS = [
  { type: "your3", key: "your3" },
  { type: "mutual", key: "mutual" },
  { type: "mutuals", key: "mutuals" },
] as const;

export default async function HereForPage({
  locale,
  focusHandle,
}: {
  locale: string;
  focusHandle?: string;
}) {
  const t = await getTranslations({ locale, namespace: "breakpoint.hereFor" });

  return (
    <PageShell
      contentId="breakpoint-here-for-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: `${HERE_FOR_PATH}/add`,
        ctaLabel: t("nav.add"),
        showMenuButton: true,
      }}
    >
      <SubpageHero
        cta={[
          { href: `${HERE_FOR_PATH}/add`, label: t("hero.cta") },
          {
            href: GENERAL_ADMISSION_HREF,
            label: t("hero.ticketsCta"),
            rel: "noopener noreferrer",
            target: "_blank",
            variant: "secondary",
          },
        ]}
        eyebrow={t("hero.eyebrow")}
        heroImage="awards"
        title={t("hero.title")}
      >
        <p className={`max-w-[620px] ${hereForType.lead} text-white`}>
          {t("hero.description")}
        </p>
      </SubpageHero>
      <Marquee
        highlightClassName="text-purple"
        highlights={MARQUEE_KEYS.map((key) => t(`marquee.${key}`))}
      />

      <Explorer locale={locale} initialFocus={focusHandle} />

      <section className="bg-black pb-2xl md:pb-3xl">
        <div className="mx-auto grid w-full max-w-[1440px] gap-m px-4 md:grid-cols-bp-desktop md:gap-x-s md:px-8">
          <div className="border-t border-stroke-primary pt-m md:col-span-5 md:pt-l">
            <h2 className={`${hereForType.eyebrow} text-core-purple`}>
              {t("how.eyebrow")}
            </h2>
          </div>
          <ol className="unstyled-list md:col-span-11 md:border-t md:border-stroke-primary">
            {([1, 2, 3] as const).map((step) => (
              <li
                key={step}
                className="grid gap-2xs border-b border-stroke-primary py-m md:grid-cols-[80px_1fr_1fr] md:gap-s"
              >
                <StepIcon step={step} />
                <h3 className="type-h4">{t(`how.step${step}Title`)}</h3>
                <p className={`${hereForType.body} text-text-secondary`}>
                  {t(`how.step${step}Body`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-black pb-3xl md:pb-4xl">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-l px-4 md:px-8">
          <div className="flex flex-col gap-s border-t border-stroke-primary pt-m md:flex-row md:items-end md:justify-between md:pt-l">
            <div className="flex flex-col gap-xs">
              <p className={`${hereForType.eyebrow} text-core-purple`}>
                {t("shareSection.eyebrow")}
              </p>
              <h2 className="type-h3 max-w-[720px]">
                {t("shareSection.title")}
              </h2>
            </div>
            <p
              className={`max-w-[420px] ${hereForType.body} text-text-secondary`}
            >
              {t("shareSection.description")}
            </p>
          </div>
          <ul className="unstyled-list grid gap-s md:grid-cols-3">
            {SHARE_CARDS.map((card) => (
              <li key={card.type} className="flex flex-col gap-2xs">
                <img
                  src={`/breakpoint/api/here-for/card?type=${card.type}&demo=1&locale=${locale}`}
                  alt=""
                  width={1200}
                  height={630}
                  loading="lazy"
                  className="block aspect-[1200/630] h-auto w-full border border-stroke-primary bg-background-secondary"
                />
                <span className={`${hereForType.caption} text-text-secondary`}>
                  {t(`shareSection.${card.key}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer backgroundColor="purple" />
    </PageShell>
  );
}
