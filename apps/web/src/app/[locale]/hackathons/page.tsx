import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { getFormatter, getTranslations } from "@workspace/i18n/server";
import { getAlternates } from "@workspace/i18n/routing";
import { createDefaultSocialImage } from "@solana-com/ui-chrome/social-image";
import { Container } from "@/component-library/container";
import { Link } from "@/utils/Link";
import {
  buildHackathonArchiveJsonLd,
  serializeJsonLd,
} from "./structured-data";
import frontierImg from "@@/assets/hackathon/past-hackathons/frontier.png";
import cypherpunkImg from "@@/assets/hackathon/past-hackathons/cypherpunk.png";
import breakoutImg from "@@/assets/hackathon/past-hackathons/breakout.png";
import radarImg from "@@/assets/hackathon/past-hackathons/radar.png";
import renaissanceImg from "@@/assets/hackathon/past-hackathons/renaissance.jpg";
import hyperdriveImg from "@@/assets/hackathon/past-hackathons/hyperdrive.jpg";
import grizzlythonImg from "@@/assets/hackathon/past-hackathons/grizzlython.jpg";
import summercampImg from "@@/assets/hackathon/past-hackathons/summercamp.png";
import riptideImg from "@@/assets/hackathon/past-hackathons/riptide.jpg";
import ignitionImg from "@@/assets/hackathon/past-hackathons/ignition.jpg";
import seasonImg from "@@/assets/hackathon/past-hackathons/season.jpg";
import defiImg from "@@/assets/hackathon/past-hackathons/defi.png";
import inauguralImg from "@@/assets/hackathon/past-hackathons/inaugural.png";

type Props = { params: Promise<{ locale: string }> };
const hackathonsSiteUrl = "https://hackathons.solana.com/";

// Dates mark the start of each hackathon, not the winners announcement.
const archive = [
  {
    key: "frontier",
    date: "2026-04-06",
    image: frontierImg,
    href: undefined,
  },
  {
    key: "cypherpunk",
    date: "2025-09-25",
    image: cypherpunkImg,
    href: undefined,
  },
  {
    key: "breakout",
    date: "2025-04-14",
    image: breakoutImg,
    href: undefined,
  },
  {
    key: "radar",
    date: "2024-09-02",
    image: radarImg,
    href: "/news/solana-radar-winners",
  },
  {
    key: "renaissance",
    date: "2024-03-04",
    image: renaissanceImg,
    href: "/news/solana-renaissance-winners",
  },
  {
    key: "hyperdrive",
    date: "2023-09-06",
    image: hyperdriveImg,
    href: "/news/solana-hyperdrive-hackathon-winners",
  },
  {
    key: "grizzlython",
    date: "2023-02-02",
    image: grizzlythonImg,
    href: "/news/solana-grizzlython-winners",
  },
  {
    key: "summercamp",
    date: "2022-07-11",
    image: summercampImg,
    href: "/news/solana-summer-camp-winners",
  },
  {
    key: "riptide",
    date: "2022-02-02",
    image: riptideImg,
    href: "/news/riptide-hackathon-winners-solana",
  },
  {
    key: "ignition",
    date: "2021-08-31",
    image: ignitionImg,
    href: "/news/solana-ignition-hackathon-winners",
  },
  {
    key: "season",
    date: "2021-05-15",
    image: seasonImg,
    href: "/news/announcing-winners-of-the-solana-season-hackathon",
  },
  {
    key: "defi",
    date: "2021-02-15",
    image: defiImg,
    href: "/news/winners-of-the-solana-x-serum-defi-hackathon",
  },
  {
    key: "inaugural",
    date: "2020-10-28",
    image: inauguralImg,
    href: "/news/announcing-the-winners-of-solana-s-inaugural-hackathon",
  },
] as const;

const years = [...new Set(archive.map(({ date }) => date.slice(0, 4)))];
const yearRange = {
  startYear: years.at(-1)!,
  endYear: years[0],
};
const metadataValues = { ...yearRange, eventCount: archive.length };

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const [t, format] = await Promise.all([
    getTranslations({ locale }),
    getFormatter({ locale }),
  ]);
  const structuredData = buildHackathonArchiveJsonLd({
    locale,
    title: t("hackathon.archive.metaTitle", metadataValues),
    description: t("hackathon.archive.metaDescription", metadataValues),
    events: archive.map(({ key }) => ({
      name: t(`hackathon.previousHackathons.${key}.title`),
      description: t(`hackathon.previousHackathons.${key}.description`),
    })),
  });

  return (
    <main className="bg-nd-bg font-brand text-nd-high-em-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <section
        className="overflow-hidden border-b border-nd-border-light"
        aria-labelledby="hackathon-title"
      >
        <Container className="grid gap-12 py-16 md:py-24 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.8fr)] xl:gap-16 xl:py-32">
          <div className="flex flex-col justify-center">
            <p className="mb-6 font-brand-mono text-xs uppercase tracking-[0.16em] text-nd-highlight-lavendar md:text-sm">
              {t("hackathon.archive.eyebrow", yearRange)}
            </p>
            <h1 id="hackathon-title" className="nd-heading-2xl max-w-[850px]">
              {t("hackathon.archive.title")}
            </h1>
            <p className="nd-body-xl mt-7 max-w-[680px] text-nd-mid-em-text">
              {t("hackathon.archive.description")}
            </p>
          </div>

          <div className="flex min-h-[360px] flex-col justify-between rounded-2xl bg-nd-highlight-lavendar p-6 text-black md:min-h-[420px] md:p-9">
            <div>
              <p className="font-brand-mono text-xs uppercase tracking-[0.16em] md:text-sm">
                {t("hackathon.archive.promoEyebrow")}
              </p>
              <h2 className="mt-8 max-w-[420px] font-brand text-[34px] font-medium leading-[1.08] tracking-[-0.04em] md:text-[48px]">
                {t("hackathon.archive.promoTitle")}
              </h2>
              <p className="mt-5 max-w-[380px] text-base leading-[1.45] text-black/70 md:text-lg">
                {t("hackathon.archive.promoDescription")}
              </p>
            </div>
            <Link
              to={hackathonsSiteUrl}
              className="group mt-8 inline-flex min-h-14 w-full items-center justify-between gap-4 rounded-full bg-black px-5 py-2 text-base font-medium text-white transition-colors hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black md:w-auto"
            >
              {t("hackathon.archive.promoCta")}
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none">
                <ArrowRight aria-hidden="true" className="size-5" />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      <section
        className="border-b border-nd-border-light"
        aria-labelledby="primer-title"
      >
        <Container className="grid gap-6 py-14 md:grid-cols-[1fr_1.4fr] md:gap-12 md:py-20">
          <div>
            <p className="mb-4 font-brand-mono text-xs uppercase tracking-[0.16em] text-nd-highlight-lavendar md:text-sm">
              {t("hackathon.archive.primerEyebrow")}
            </p>
            <h2 id="primer-title" className="nd-heading-l max-w-[560px]">
              {t("hackathon.archive.primerTitle")}
            </h2>
          </div>
          <p className="nd-body-xl max-w-[690px] self-end text-nd-mid-em-text">
            {t("hackathon.archive.primerDescription", yearRange)}
          </p>
        </Container>
      </section>

      <section id="archive" aria-labelledby="archive-title">
        <Container className="py-16 md:py-24">
          <div className="mb-12 max-w-[680px] md:mb-16">
            <p className="mb-4 font-brand-mono text-xs uppercase tracking-[0.16em] text-nd-highlight-lavendar md:text-sm">
              {t("hackathon.archive.listEyebrow", yearRange)}
            </p>
            <h2 id="archive-title" className="nd-heading-l">
              {t("hackathon.archive.listTitle")}
            </h2>
            <p className="nd-body-xl mt-5 text-nd-mid-em-text">
              {t("hackathon.archive.listDescription")}
            </p>
          </div>

          <div>
            {years.map((year) => (
              <div
                key={year}
                className="grid gap-6 border-t border-nd-border-light py-8 md:grid-cols-[180px_minmax(0,1fr)] md:gap-12 md:py-12 xl:grid-cols-[260px_minmax(0,1fr)]"
              >
                <h3 className="font-brand text-[48px] font-light leading-none tracking-[-0.04em] text-nd-mid-em-text md:text-[64px]">
                  {year}
                </h3>
                <div className="grid gap-6 lg:grid-cols-2">
                  {archive
                    .filter(({ date }) => date.startsWith(year))
                    .map((entry) => {
                      const title = t(
                        `hackathon.previousHackathons.${entry.key}.title`,
                      );
                      const card = (
                        <>
                          <div className="relative aspect-[16/9] overflow-hidden bg-[#17151B]">
                            <Image
                              src={entry.image}
                              alt=""
                              fill
                              sizes="(max-width: 1024px) 100vw, 40vw"
                              className={`object-cover ${entry.href ? "transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none" : ""}`}
                            />
                          </div>
                          <div className="flex flex-1 flex-col p-5 md:p-6">
                            <time
                              dateTime={entry.date}
                              className="font-brand-mono text-xs uppercase tracking-[0.12em] text-nd-highlight-lavendar"
                            >
                              {format.dateTime(
                                new Date(`${entry.date}T00:00:00Z`),
                                {
                                  month: "long",
                                  year: "numeric",
                                  timeZone: "UTC",
                                },
                              )}
                            </time>
                            <div className="mt-4 flex items-start justify-between gap-4">
                              <h4 className="nd-heading-s">{title}</h4>
                              {entry.href && (
                                <ArrowRight
                                  aria-hidden="true"
                                  className="mt-1 size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
                                />
                              )}
                            </div>
                            <p className="mt-4 text-base leading-[1.5] text-nd-mid-em-text">
                              {t(
                                `hackathon.previousHackathons.${entry.key}.description`,
                              )}
                            </p>
                            {entry.href && (
                              <span className="mt-6 pt-5 text-sm font-medium text-white underline decoration-nd-border-prominent underline-offset-4 group-hover:decoration-white">
                                {t("hackathon.archive.readRecap")}
                              </span>
                            )}
                          </div>
                        </>
                      );
                      const cardClassName = `flex h-full flex-col overflow-hidden rounded-xl border border-nd-border-light bg-[#0D0C11] text-white ${entry.href ? "group transition-colors hover:border-nd-border-hovered focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nd-highlight-lavendar" : ""}`;

                      return entry.href ? (
                        <Link
                          key={entry.key}
                          to={entry.href}
                          className={cardClassName}
                        >
                          {card}
                        </Link>
                      ) : (
                        <article key={entry.key} className={cardClassName}>
                          {card}
                        </article>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section
        className="border-t border-nd-border-light"
        aria-labelledby="hackathons-final-cta-title"
      >
        <Container className="py-16 md:py-24">
          <div className="flex flex-col gap-10 rounded-2xl bg-nd-highlight-lavendar p-6 text-black md:p-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="max-w-[680px]">
              <p className="font-brand-mono text-xs uppercase tracking-[0.16em] md:text-sm">
                {t("hackathon.archive.promoEyebrow")}
              </p>
              <h2
                id="hackathons-final-cta-title"
                className="mt-6 font-brand text-[34px] font-medium leading-[1.08] tracking-[-0.04em] md:text-[48px]"
              >
                {t("hackathon.archive.promoTitle")}
              </h2>
              <p className="mt-5 max-w-[580px] text-base leading-[1.45] text-black/70 md:text-lg">
                {t("hackathon.archive.promoDescription")}
              </p>
            </div>
            <Link
              to={hackathonsSiteUrl}
              className="group inline-flex min-h-14 w-full shrink-0 items-center justify-between gap-4 rounded-full bg-black px-5 py-2 text-base font-medium text-white transition-colors hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black md:w-auto"
            >
              {t("hackathon.archive.promoCta")}
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none">
                <ArrowRight aria-hidden="true" className="size-5" />
              </span>
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hackathon.archive" });
  const title = t("metaTitle", metadataValues);
  const description = t("metaDescription", metadataValues);
  const alternates = getAlternates("/hackathons", locale);
  const socialImage = createDefaultSocialImage(title);

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
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@solana",
      title,
      description,
      images: [socialImage],
    },
  };
}
