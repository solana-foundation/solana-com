"use client";

import { useTranslations } from "next-intl";
import { ArrowOutUpRightSquare as ExternalLink } from "@boxicons/react/ArrowOutUpRightSquare";
import { ChevronRight } from "@boxicons/react/ChevronRight";
import { PRIMARY_CARD_DECK } from "@/data/developers/evm-to-svm";
import { MigrationDocsLayout } from "../components/migration-docs-layout";

const COURSE_URL = "https://rareskills.io/solana-tutorial";

const RESOURCE_CARD_URLS = [
  "https://solana.com/docs",
  "https://solana.com/skills",
  "https://solana.com/developers/bootcamp",
  "/developers",
];

export function DevelopersChainMigrationEthereumPage() {
  const t = useTranslations("developers-evm-to-svm");

  const resourceCards = RESOURCE_CARD_URLS.map((url, index) => ({
    heading: t(`evmOverview.resourceCards.${index}.heading`),
    body: t(`evmOverview.resourceCards.${index}.body`),
    ctaLabel: t(`evmOverview.resourceCards.${index}.ctaLabel`),
    url,
  }));

  const guides = PRIMARY_CARD_DECK.cards.map((card, index) => ({
    heading: t(`primaryCardDeck.cards.${index}.heading`),
    body: t(`primaryCardDeck.cards.${index}.body`),
    url: card.callToAction.url,
  }));

  return (
    <MigrationDocsLayout
      activeUrl="/developers/migrate-to-solana/ethereum"
      eyebrow={t("evmGuidesHeading.eyebrow")}
      headline={t("evmGuidesHeading.headline")}
      bodyHtml={t.raw("evmGuidesHeading.body") as string}
      buttons={[
        {
          url: "/developers/migrate-to-solana/complete-guide",
          label: t("evmGuidesHeading.buttons.0.label"),
        },
        { url: COURSE_URL, label: t("evmGuidesHeading.buttons.1.label") },
      ]}
      tocHeadline={t("evmOverview.tocHeadline")}
      resourceCards={resourceCards}
      resourceHeadline={t("evmOverview.resourceHeadline")}
    >
      <h2 id="guides">{t("evmOverview.guidesHeading")}</h2>
      <p>{t("evmOverview.guidesBody")}</p>
      <ul className="!my-6 grid !list-none gap-3 !pl-0 sm:grid-cols-2">
        {guides.map((guide) => (
          <li key={guide.url} className="!my-0">
            <a
              href={guide.url}
              className="group flex h-full flex-col gap-1.5 rounded-[0.875rem] border border-white/[0.08] bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
            >
              <span className="inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold leading-[1.45] text-white">
                {guide.heading}
                <ChevronRight
                  className="size-3.5 text-[#00ffbd] transition-colors group-hover:text-white"
                  aria-hidden
                />
              </span>
              <span className="text-sm leading-[1.6] text-white/50">
                {guide.body}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <h2 id="course">{t("evmOverview.courseHeading")}</h2>
      <p>{t("evmOverview.courseBody")}</p>
      <p>
        <a
          href={COURSE_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5"
        >
          {t("evmOverview.courseLink")}
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </p>
    </MigrationDocsLayout>
  );
}
