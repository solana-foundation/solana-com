import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Link } from "@/utils/Link";
import { getTranslations } from "@workspace/i18n/server";
import {
  BUILD_OPTIONS,
  HERO_LINKS,
  PAYMENT_PATHS,
  PRODUCTION_LINK,
  RELATED_LINKS,
} from "@/data/developers/payments";

const container = "mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10";
const eyebrow =
  "m-0 font-brand-mono text-xs uppercase tracking-[0.18em] text-nd-highlight-green";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nd-highlight-green";

export async function DevelopersPaymentsPage() {
  const t = await getTranslations("developers-payments");

  return (
    <main className="overflow-hidden bg-black text-white">
      <section className="relative isolate border-b border-white/15">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_70%_at_80%_25%,rgba(111,63,185,0.2),transparent_70%)]"
        />
        <div
          className={`${container} grid gap-14 py-20 md:py-28 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)] xl:items-center xl:gap-20 xl:py-36`}
        >
          <div>
            <p className={`${eyebrow} mb-5`}>{t("hero.eyebrow")}</p>
            <h1 className="m-0 max-w-[850px] font-brand text-[clamp(3.5rem,7.5vw,7.5rem)] font-medium leading-[0.98] tracking-[-0.055em]">
              {t("hero.headline")}
            </h1>
            <p className="mb-0 mt-7 max-w-[650px] text-lg leading-relaxed text-nd-mid-em-text md:text-2xl">
              {t("hero.body")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={HERO_LINKS[0].href}
                className={`inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-base font-medium text-black no-underline transition-colors hover:bg-white/85 hover:text-black ${focus}`}
              >
                {t("hero.primaryCta")}
                <ArrowRight aria-hidden className="!size-5" />
              </Link>
              <Link
                href={HERO_LINKS[1].href}
                className={`inline-flex items-center gap-3 rounded-full border border-white/30 px-6 py-3.5 text-base font-medium text-white no-underline transition-colors hover:border-white hover:text-white ${focus}`}
              >
                {t("hero.secondaryCta")}
              </Link>
            </div>
          </div>
          <div
            aria-label={t("flow.label")}
            className="relative rounded-[28px] border border-white/20 bg-white/[0.04] p-5 shadow-[0_30px_100px_rgba(80,40,140,0.15)] md:p-8"
          >
            <div
              aria-hidden
              className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-nd-highlight-green to-transparent"
            />
            <p className={`${eyebrow} mb-7`}>{t("flow.eyebrow")}</p>
            <ol className="relative m-0 list-none space-y-3 p-0 before:absolute before:bottom-8 before:left-5 before:top-8 before:w-px before:bg-gradient-to-b before:from-nd-highlight-green before:via-[#a989f5] before:to-nd-highlight-green">
              {(["request", "transfer", "verify"] as const).map(
                (step, index) => (
                  <li
                    key={step}
                    className="relative flex items-center gap-4 rounded-2xl border border-white/10 bg-black/75 p-4 md:p-5"
                  >
                    <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-nd-highlight-green/60 bg-black font-brand-mono text-xs text-nd-highlight-green">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="m-0 font-brand text-lg font-medium text-white md:text-xl">
                        {t(`flow.steps.${step}.title`)}
                      </p>
                      <p className="mb-0 mt-1 text-sm leading-relaxed text-nd-mid-em-text">
                        {t(`flow.steps.${step}.body`)}
                      </p>
                    </div>
                  </li>
                ),
              )}
            </ol>
          </div>
        </div>
      </section>

      <section
        id="payment-paths"
        className={`${container} py-20 md:py-28 xl:py-32`}
      >
        <header className="mb-10 max-w-3xl md:mb-14">
          <p className={`${eyebrow} mb-4`}>{t("paths.eyebrow")}</p>
          <h2 className="m-0 font-brand text-4xl font-medium leading-[1.08] tracking-[-0.04em] md:text-6xl">
            {t("paths.title")}
          </h2>
          <p className="mb-0 mt-5 text-lg leading-relaxed text-nd-mid-em-text md:text-xl">
            {t("paths.body")}
          </p>
        </header>
        <div className="grid gap-3 md:grid-cols-2">
          {PAYMENT_PATHS.map((path) => (
            <Link
              key={path.id}
              href={path.href}
              className={`group flex min-h-52 flex-col justify-between rounded-2xl border border-white/15 bg-white/[0.035] p-6 text-white no-underline transition-colors hover:border-nd-highlight-green/70 hover:bg-white/[0.07] hover:text-white md:p-8 ${focus}`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="m-0 font-brand text-2xl font-medium tracking-[-0.025em] md:text-3xl">
                  {t(`paths.items.${path.id}.title`)}
                </h3>
                <ArrowUpRight
                  aria-hidden
                  className="!size-6 shrink-0 text-nd-highlight-green transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>
              <p className="mb-0 mt-6 max-w-lg text-base leading-relaxed text-nd-mid-em-text md:text-lg">
                {t(`paths.items.${path.id}.body`)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/15 bg-[#0b0b10]">
        <div className={`${container} py-20 md:py-28 xl:py-32`}>
          <header className="mb-10 max-w-3xl md:mb-14">
            <p className={`${eyebrow} mb-4`}>{t("build.eyebrow")}</p>
            <h2 className="m-0 font-brand text-4xl font-medium leading-[1.08] tracking-[-0.04em] md:text-6xl">
              {t("build.title")}
            </h2>
            <p className="mb-0 mt-5 text-lg leading-relaxed text-nd-mid-em-text md:text-xl">
              {t("build.body")}
            </p>
          </header>
          <div className="grid border-t border-white/20 lg:grid-cols-3">
            {BUILD_OPTIONS.map((option) => (
              <article
                key={option.id}
                className="flex flex-col border-b border-white/20 py-8 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <h3 className="m-0 font-brand text-2xl font-medium tracking-[-0.025em]">
                  {t(`build.items.${option.id}.title`)}
                </h3>
                <p className="mb-6 mt-4 flex-1 text-base leading-relaxed text-nd-mid-em-text">
                  {t(`build.items.${option.id}.body`)}
                </p>
                <Link
                  href={option.href}
                  className={`inline-flex w-fit items-center gap-2 text-base font-medium text-white no-underline hover:text-nd-highlight-green ${focus}`}
                >
                  {t(`build.items.${option.id}.cta`)}
                  <ArrowRight
                    aria-hidden
                    className="!size-5 text-nd-highlight-green"
                  />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`${container} grid gap-12 py-20 md:py-28 xl:grid-cols-2 xl:gap-24 xl:py-32`}
      >
        <div>
          <p className={`${eyebrow} mb-4`}>{t("related.eyebrow")}</p>
          <h2 className="m-0 font-brand text-4xl font-medium leading-[1.08] tracking-[-0.04em] md:text-6xl">
            {t("related.title")}
          </h2>
          <p className="mb-0 mt-5 max-w-xl text-lg leading-relaxed text-nd-mid-em-text">
            {t("related.body")}
          </p>
        </div>
        <div className="border-t border-white/20">
          {RELATED_LINKS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`group flex items-center justify-between gap-5 border-b border-white/20 py-6 text-white no-underline hover:text-nd-highlight-green ${focus}`}
            >
              <span>
                <span className="block font-brand text-xl font-medium md:text-2xl">
                  {t(`related.items.${item.id}.title`)}
                </span>
                <span className="mt-1 block text-sm text-nd-mid-em-text md:text-base">
                  {t(`related.items.${item.id}.body`)}
                </span>
              </span>
              <ArrowRight
                aria-hidden
                className="!size-6 shrink-0 text-nd-highlight-green transition-transform group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-white/15 bg-[radial-gradient(ellipse_70%_120%_at_90%_100%,rgba(111,63,185,0.18),transparent_75%)]">
        <div
          className={`${container} flex flex-col gap-7 py-16 md:flex-row md:items-end md:justify-between md:py-20`}
        >
          <div className="max-w-2xl">
            <p className={`${eyebrow} mb-4`}>{t("production.eyebrow")}</p>
            <h2 className="m-0 font-brand text-3xl font-medium tracking-[-0.035em] md:text-5xl">
              {t("production.title")}
            </h2>
            <p className="mb-0 mt-4 text-base leading-relaxed text-nd-mid-em-text md:text-lg">
              {t("production.body")}
            </p>
          </div>
          <Link
            href={PRODUCTION_LINK.href}
            className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-base font-medium text-white no-underline hover:border-white hover:text-white ${focus}`}
          >
            {t("production.cta")}
            <ArrowRight
              aria-hidden
              className="!size-5 text-nd-highlight-green"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
