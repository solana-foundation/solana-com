import { getTranslations } from "@workspace/i18n/server";
import PageShell from "@/components/PageShell";
import Footer from "@/components/sections/Footer";
import { GENERAL_ADMISSION_HREF } from "@/content/links";
import Explorer from "./Explorer";
import { hereForType } from "./typography";

// Filled box glyphs for the how-it-works steps: sign in, pick, mutuals.
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
        ctaHref: GENERAL_ADMISSION_HREF,
        ctaLabel: t("hero.ticketsCta"),
        showMenuButton: true,
      }}
    >
      <Explorer locale={locale} initialFocus={focusHandle} />

      <section className="bg-black pb-3xl md:pb-4xl">
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

      <Footer backgroundColor="purple" />
    </PageShell>
  );
}
