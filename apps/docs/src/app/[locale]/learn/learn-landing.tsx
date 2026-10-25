import Image from "next/image";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { getTranslations } from "@workspace/i18n/server";
import learnHeroImg from "@@/assets/learn/learn-hero.webp";
import { localizedHref } from "@/data/developers/hub";
import { LEARN_RESOURCES, learnTutorials } from "./learn-tutorials";

const container = "mx-auto w-full max-w-[1200px] px-5 md:px-8";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dl-accent-text)]";
const arrowDir = "rtl:-scale-x-100";

/**
 * /learn landing (a server component). The tutorial pages stay in the
 * docs at /learn/<slug>.
 * Shares the [data-dev-landing] light/dark variables with /developers.
 */
export async function LearnLanding({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "learn" });
  const href = (path: string) => localizedHref(locale, path);
  const first = learnTutorials[0];

  return (
    <main
      data-dev-landing
      className="overflow-hidden bg-[var(--dl-bg)] font-brand text-base text-[var(--dl-text)] transition-colors duration-300 motion-reduce:transition-none"
    >
      <section
        aria-labelledby="learn-hero-title"
        className="border-b border-[var(--dl-line)] py-14 md:py-20"
      >
        <div
          className={`${container} grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]`}
        >
          <div>
            <h1
              id="learn-hero-title"
              className="m-0 mb-5 font-brand text-[clamp(2.75rem,7vw,5rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[var(--dl-text)]"
            >
              {t("hero.title")}
            </h1>
            <p className="m-0 mb-7 max-w-[620px] text-lg leading-relaxed text-[var(--dl-muted)]">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={href(`/learn/${first.slug}`)}
                className={`inline-flex h-11 items-center gap-2 rounded-full bg-[var(--dl-accent)] px-5 text-[15px] font-medium text-[var(--dl-on-accent)] no-underline hover:bg-[#3ff5aa] hover:text-[var(--dl-on-accent)] ${focus}`}
              >
                {t("hero.start-learning")}
                <ArrowRight aria-hidden className={`!size-4 ${arrowDir}`} />
              </a>
              <a
                href={href("/developers")}
                className={`inline-flex h-11 items-center rounded-full border border-[var(--dl-line-strong)] px-5 text-[15px] font-medium text-[var(--dl-text)] no-underline hover:border-[var(--dl-text)] hover:text-[var(--dl-text)] ${focus}`}
              >
                {t("landing.developerDocs")}
              </a>
            </div>
          </div>
          <Image
            src={learnHeroImg}
            alt={t("landing.heroImageAlt")}
            priority
            fetchPriority="high"
            quality={60}
            sizes="(min-width: 1024px) 480px, (min-width: 768px) 50vw, 92vw"
            className="h-auto w-full rounded-3xl"
          />
        </div>
      </section>

      <section
        id="tutorials"
        aria-label={t("tutorials.aria-label")}
        className="py-14 md:py-20"
      >
        <div className={container}>
          <ol
            className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3"
            data-testid="learn-tutorials"
          >
            {learnTutorials.map((tutorial, index) => {
              const title = t(`tutorials.items.${tutorial.slug}.title`);
              return (
                <li key={tutorial.id} className="flex">
                  <a
                    href={href(`/learn/${tutorial.slug}`)}
                    aria-label={`${t("tutorials.readMoreAriaLabel")} ${title}`}
                    className={`group flex w-full flex-col rounded-[20px] border border-[var(--dl-line)] bg-[var(--dl-surface)] p-6 text-[var(--dl-text)] no-underline transition hover:border-[var(--dl-accent-line)] hover:text-[var(--dl-text)] motion-safe:hover:-translate-y-[3px] ${focus}`}
                  >
                    <span className="text-[13px] text-[var(--dl-dim)]">
                      {t("tutorials.partLabel")} {index + 1} ·{" "}
                      {t(`tutorials.items.${tutorial.slug}.category`)}
                    </span>
                    <h2 className="mb-2 mt-3 font-brand text-[22px] font-medium leading-tight tracking-[-0.02em] text-[var(--dl-text)]">
                      {title}
                    </h2>
                    <p className="m-0 text-[15px] leading-[1.55] text-[var(--dl-muted)]">
                      {t(`tutorials.items.${tutorial.slug}.description`)}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium">
                      {t("tutorials.readMore")}
                      <ArrowRight
                        aria-hidden
                        className={`!size-4 text-[var(--dl-accent-text)] transition-transform motion-safe:group-hover:translate-x-1 ${arrowDir}`}
                      />
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="learn-resources-title"
        className="border-t border-[var(--dl-line)] pb-20 pt-14 md:pb-24 md:pt-20"
      >
        <div className={container}>
          <h2
            id="learn-resources-title"
            className="m-0 mb-3 font-brand text-[28px] font-medium tracking-[-0.03em] text-[var(--dl-text)] md:text-[34px]"
          >
            {t("resources.continueJourneyTitle")}
          </h2>
          <p className="m-0 mb-8 text-[16.5px] text-[var(--dl-muted)]">
            {t("resources.continueJourneySubtitle")}
          </p>
          <ul
            aria-label={t("resources.ariaLabel")}
            className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2"
          >
            {LEARN_RESOURCES.map((resource) => (
              <li key={resource.id} className="flex">
                <a
                  href={resource.external ? resource.href : href(resource.href)}
                  {...(resource.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`group relative flex w-full flex-col gap-1.5 rounded-[20px] border border-[var(--dl-line)] p-6 text-[var(--dl-text)] no-underline transition-colors hover:border-[var(--dl-purple-line)] hover:text-[var(--dl-text)] ${focus}`}
                >
                  <span className="font-brand text-xl font-medium tracking-[-0.02em]">
                    {t(`resources.${resource.id}.label`)}
                    {resource.external && (
                      <span className="sr-only">
                        {" "}
                        ({t("resources.opensInNewTab")})
                      </span>
                    )}
                  </span>
                  <span className="text-[15px] text-[var(--dl-muted)]">
                    {t(`resources.${resource.id}.description`)}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className={`absolute end-6 top-6 !size-5 text-[var(--dl-dim)] group-hover:text-[var(--dl-text)] ${arrowDir}`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
