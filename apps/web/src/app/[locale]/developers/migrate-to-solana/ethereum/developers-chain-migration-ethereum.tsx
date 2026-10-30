"use client";

import { useTranslations } from "next-intl";
import { ArrowOutUpRightSquare as ExternalLink } from "@boxicons/react/ArrowOutUpRightSquare";
import { ChevronRight } from "@boxicons/react/ChevronRight";
import { PRIMARY_CARD_DECK } from "@/data/developers/evm-to-svm";
import { MigrationDocsLayout } from "../components/migration-docs-layout";

const COURSE_URL = "https://rareskills.io/solana-tutorial";

const RESOURCE_CARDS = [
  {
    heading: "Intro to Solana Development",
    body: "Browse official Solana development documentation.",
    url: "https://solana.com/developers/docs",
    ctaLabel: "Open the docs",
  },
  {
    heading: "Solana AI Agent Skills",
    body: "Use pre-built skills you can drop into your AI agents to interact with Solana.",
    url: "https://solana.com/skills",
    ctaLabel: "View skills",
  },
  {
    heading: "Solana Bootcamp",
    body: "Watch a structured video series that walks through setup and day-one development workflows.",
    url: "https://solana.com/developers/bootcamp",
    ctaLabel: "Watch the bootcamp",
  },
  {
    heading: "More Solana Developer Tools",
    body: "Browse docs, guides, cookbook recipes, tools, and ecosystem support channels.",
    url: "/developers",
    ctaLabel: "Browse developer tools",
  },
];

export function DevelopersChainMigrationEthereumPage() {
  const t = useTranslations("developers-evm-to-svm");

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
      tocHeadline="On this page"
      resourceCards={RESOURCE_CARDS}
      resourceHeadline="Resources for Solana Developers"
    >
      <h2 id="guides">Migration guides</h2>
      <p>
        Each guide maps an Ethereum concept or token standard to its Solana
        equivalent. Start with the complete guide, then open the standard you
        are porting.
      </p>
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

      <h2 id="course">RareSkills Solana course</h2>
      <p>
        RareSkills&apos; Solana tutorial teaches Solana program development with
        Anchor to developers who already write Solidity. Work through its
        lessons alongside these guides.
      </p>
      <p>
        <a
          href={COURSE_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5"
        >
          Open the RareSkills tutorial
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </p>
    </MigrationDocsLayout>
  );
}
