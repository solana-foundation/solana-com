"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Container } from "@/component-library/container";
import { AnimatedHeroSection, SectionDivider } from "./cosmos-page-shared";
import Code from "@@/public/src/img/icons/Code.inline.svg";
import FileText from "@@/public/src/img/icons/FileText.inline.svg";
import Youtube from "@@/public/src/img/icons/youtube.inline.svg";
import Tools from "@@/public/src/img/icons/Tools.inline.svg";

const UnicornScene = dynamic(
  () => import("unicornstudio-react").then((mod) => mod.default),
  { ssr: false },
);

const EarthAnimation = dynamic(
  () =>
    import("@/components/index/earth-animation").then(
      (mod) => mod.EarthAnimation,
    ),
  { ssr: false },
);

function PathCard({
  eyebrow,
  heading,
  ctaLabel,
  ctaUrl,
}: {
  eyebrow: string;
  heading: string;
  ctaLabel: string;
  ctaUrl: string;
}) {
  return (
    <div
      className="tw-glass-card flex flex-col gap-4 p-8 rounded-xl"
      style={{
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p className="tw-eyebrow text-sky-400 text-xs font-mono uppercase tracking-widest mb-0">
        {eyebrow}
      </p>
      <h2 className="tw-text-display-xs md:tw-text-display-md font-medium text-white pl-3 border-l-2 border-purple-500 mb-0">
        {heading}
      </h2>
      <div>
        <a
          href={ctaUrl}
          className="inline-flex items-center px-5 py-2.5 rounded-full border text-sm font-semibold text-white no-underline transition-colors"
          style={{
            borderColor: "rgba(255,255,255,0.3)",
            background: "transparent",
          }}
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}

function ResourceCard({
  heading,
  body,
  url,
  Icon,
}: {
  heading: string;
  body: string;
  url: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={url}
      className="flex flex-col items-start gap-12 px-6 py-8 rounded-xl bg-nd-border-light hover:bg-nd-mid-em-text-alpha/20 backdrop-blur-[8px] text-inherit no-underline"
    >
      <div className="shrink-0 grow-0 brightness-0 invert">
        <Icon className="block w-10 h-10" />
      </div>
      <div>
        <h3 className="font-medium nd-body-xl text-white mb-0">{heading}</h3>
        <p className="nd-body-m text-nd-mid-em-text mt-1 mb-0">{body}</p>
      </div>
    </a>
  );
}

const RESOURCE_CARDS = [
  {
    heading: "Intro to Solana Development",
    body: "Browse official Solana development documentation.",
    url: "https://solana.com/docs",
    Icon: Code,
  },
  {
    heading: "Solana AI Agent Skills",
    body: "Use pre-built skills you can drop into your AI agents to interact with Solana.",
    url: "https://solana.com/skills",
    Icon: FileText,
  },
  {
    heading: "Solana Bootcamp",
    body: "Watch a structured video series that walks through setup and day-one development workflows.",
    url: "https://solana.com/developers/bootcamp",
    Icon: Youtube,
  },
  {
    heading: "Solana Developer Templates",
    body: "Browse docs, guides, cookbook recipes, tools, and ecosystem support channels.",
    url: "https://solana.com/developers/templates",
    Icon: Tools,
  },
];

export function DevelopersChainMigrationCosmosPage() {
  const t = useTranslations("developers-chain-migration-cosmos");

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

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-10 py-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex items-center">
          <h2 className="nd-heading-l text-white mb-0">Choose your guide.</h2>
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <PathCard
            eyebrow="CosmWasm"
            heading={t("pathCardDeck.cards.0.heading")}
            ctaLabel={t("pathCardDeck.cards.0.callToAction.label")}
            ctaUrl="/developers/migrate-to-solana/cosmos/cosmwasm"
          />
          <PathCard
            eyebrow="App Chain"
            heading={t("pathCardDeck.cards.1.heading")}
            ctaLabel={t("pathCardDeck.cards.1.callToAction.label")}
            ctaUrl="/developers/migrate-to-solana/cosmos/app-chain"
          />
        </div>
      </div>

      <SectionDivider />

      {/* Resources — identical to migrate-to-solana page */}
      <section className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text text-left m-0 px-2">
        <div className="max-w-[1828px] mx-auto rounded-xl overflow-hidden relative transform-gpu">
          <UnicornScene
            projectId="cosmos-resources"
            className="!absolute inset-0 z-0"
            jsonFilePath="/src/img/index/community-bg.json"
            width="100%"
            height="101%"
            scale={1}
            dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
            fps={30}
            lazyLoad={true}
            production={true}
          />
          <Container className="pt-[120px] pb-[120px] flex flex-col justify-between">
            <EarthAnimation className="absolute bottom-0 left-[-20%] md:left-[-10%] xl:left-0 w-[140%] md:w-[120%] xl:w-full mix-blend-overlay" />
            <div className="absolute top-0 left-0 right-0 h-[80%] bg-gradient-to-b from-[#0B0A10] via-[#0B0A10] via-19% to-transparent pointer-events-none" />
            <div className="relative">
              <h2 className="nd-heading-l">Resources for Solana Developers.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-10 relative">
              {RESOURCE_CARDS.map((card) => (
                <ResourceCard key={card.url} {...card} />
              ))}
            </div>
          </Container>
        </div>
      </section>
    </>
  );
}
