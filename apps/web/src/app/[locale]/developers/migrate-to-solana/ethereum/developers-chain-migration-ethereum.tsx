"use client";

import dynamic from "next/dynamic";
import { Container } from "@/component-library/container";
import { useTranslations } from "next-intl";
import { PRIMARY_CARD_DECK } from "@/data/developers/evm-to-svm";
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

export function DevelopersChainMigrationEthereumPage() {
  const t = useTranslations("developers-evm-to-svm");

  const heroButtons = [
    {
      hierarchy: "primary",
      size: "md",
      url: "/developers/migrate-to-solana/complete-guide",
      label: t("evmGuidesHeading.buttons.0.label"),
    },
    {
      hierarchy: "outline",
      size: "md",
      url: "https://rareskills.io/solana-tutorial",
      label: t("evmGuidesHeading.buttons.1.label"),
    },
  ];

  const primaryCards = PRIMARY_CARD_DECK.cards.map((card, index) => ({
    eyebrow: t(`primaryCardDeck.cards.${index}.eyebrow`),
    heading: t(`primaryCardDeck.cards.${index}.heading`),
    ctaLabel: t(`primaryCardDeck.cards.${index}.callToAction.label`),
    ctaUrl: card.callToAction.url,
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-black border-b border-white/10">
        <UnicornScene
          className="!absolute inset-0 z-0"
          jsonFilePath="/src/img/solutions/icm/hero-bg.json"
          width="100%"
          height="100%"
          scale={1}
          dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
          fps={30}
          lazyLoad={true}
          production={true}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-8 xl:px-10 py-16 md:py-28 xl:py-40 w-full">
          <div className="flex flex-col gap-6 max-w-2xl">
            <p className="text-xs font-medium text-sky-300/80 uppercase tracking-widest mb-0">
              {t("evmGuidesHeading.eyebrow")}
            </p>
            <h1 className="text-[40px] md:text-[56px] xl:text-[88px] font-brand font-medium text-white leading-[1.1] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px] mb-0">
              {t("evmGuidesHeading.headline")}
            </h1>
            <div
              className="text-[#ABABBA] text-lg md:text-2xl text-pretty leading-[1.33] tracking-[-0.36px] md:tracking-[-0.48px] mb-0 [&_p]:m-0"
              dangerouslySetInnerHTML={{
                __html: t.raw("evmGuidesHeading.body") as string,
              }}
            />
            <div className="flex flex-wrap gap-3">
              {heroButtons.map((btn, i) => (
                <a
                  key={i}
                  href={btn.url}
                  className={[
                    "inline-flex items-center px-6 py-3 rounded-full text-sm font-brand font-semibold no-underline transition-opacity hover:opacity-90",
                    btn.hierarchy === "primary"
                      ? "tw-bg-nd-cta tw-text-nd-on-cta-high-em-text"
                      : "border border-white/30 text-white bg-transparent",
                  ].join(" ")}
                >
                  {btn.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-10 py-24 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="flex items-start p-0 md:p-2 xl:p-4">
          <h2 className="nd-heading-l text-white mb-0">Choose your guide.</h2>
        </div>
        {primaryCards.map((card) => (
          <PathCard
            key={card.ctaUrl}
            eyebrow={card.eyebrow}
            heading={card.heading}
            ctaLabel={card.ctaLabel}
            ctaUrl={card.ctaUrl}
          />
        ))}
      </div>

      <section className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text text-left m-0 px-2">
        <div className="max-w-[1828px] mx-auto rounded-xl overflow-hidden relative transform-gpu">
          <UnicornScene
            projectId="ethereum-resources"
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
