"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import { CardDeck, Heading } from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import { RESOURCE_CARD_DECK } from "@/data/developers/evm-to-svm/cosmos";
import { AnimatedHeroSection, SectionDivider } from "./cosmos-page-shared";
import CodeInSquare from "@@/public/src/img/icons/CodeInSquare.inline.svg";
import Globe from "@@/public/src/img/icons/Globe.inline.svg";

function PathCard({
  heading,
  body,
  ctaUrl,
  Icon,
}: {
  heading: string;
  body: string;
  ctaUrl: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={ctaUrl}
      className="flex flex-col items-start gap-12 px-6 py-8 rounded-xl bg-nd-border-light hover:bg-nd-mid-em-text-alpha/20 backdrop-blur-[8px] text-inherit no-underline"
    >
      <div className="shrink-0 grow-0 brightness-0 invert">
        <Icon className="block w-10 h-10" />
      </div>
      <div>
        <h2 className="font-medium nd-body-xl text-white mb-0">{heading}</h2>
        <p className="nd-body-m text-nd-mid-em-text mt-1 mb-0">{body}</p>
      </div>
    </a>
  );
}

export function DevelopersChainMigrationCosmosPage() {
  const t = useTranslations("developers-chain-migration-cosmos");
  const blockSpacing = { large: { marginTop: "48px" } };

  const resourceCards = RESOURCE_CARD_DECK.cards.map((card, index) => ({
    ...card,
    heading: t(`resourceCardDeck.cards.${index}.heading`),
    body: t(`resourceCardDeck.cards.${index}.body`),
    callToAction: {
      ...card.callToAction,
      label: t(`resourceCardDeck.cards.${index}.callToAction.label`),
    },
  }));

  return (
    <>
      <AnimatedHeroSection
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={[
          {
            label: "Smart Contract Developers",
            url: "/developers/migrate-to-solana/cosmos/cosmwasm",
            hierarchy: "primary",
          },
          {
            label: "App Chain Developers",
            url: "/developers/migrate-to-solana/cosmos/app-chain",
            hierarchy: "outline",
          },
        ]}
        showScene={true}
      />

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-10 py-10 grid grid-cols-1 md:grid-cols-2 gap-1">
        <PathCard
          heading={t("pathCardDeck.cards.0.heading")}
          body={t("pathCardDeck.cards.0.body")}
          ctaUrl="/developers/migrate-to-solana/cosmos/cosmwasm"
          Icon={CodeInSquare}
        />
        <PathCard
          heading={t("pathCardDeck.cards.1.heading")}
          body={t("pathCardDeck.cards.1.body")}
          ctaUrl="/developers/migrate-to-solana/cosmos/app-chain"
          Icon={Globe}
        />
      </div>

      <SectionDivider />

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Heading
          eyebrow={t("resourceHeading.eyebrow")}
          headline={t("resourceHeading.headline")}
          body={t("resourceHeading.body")}
        />
      </ResponsiveBox>

      <CardDeck
        cards={resourceCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={
          RESOURCE_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
        featured={RESOURCE_CARD_DECK.featured}
      />
    </>
  );
}
