import type { ElementType } from "react";
import Image from "next/image";

import { cn } from "../lib/utils";
import {
  ActionButton,
  ActionList,
  Eyebrow,
  Section,
  type ActionButtonProps,
  type LandingImage,
} from "./landing-shared";
import type { StatCardData } from "./landing-content";

export interface FeatureCardData {
  variant?: "logo";
  color?: "aqua" | "orange" | "purple" | "green";
  feature?: string;
  body?: string;
  stat?: StatCardData;
  button?: ActionButtonProps;
  eyebrow?: string;
  logo?: LandingImage;
}

export interface FeatureHighlightProps {
  cards: FeatureCardData[];
  eyebrow?: string;
  headline?: string;
  headingAs?: ElementType;
  buttons?: ActionButtonProps[];
  body?: string;
  mobileBackground?: LandingImage;
  desktopBackground?: LandingImage;
  dynamicDataFootnote?: string;
}

function FeatureCard({ card }: { card: FeatureCardData }) {
  const color = {
    aqua: "border-[#00D4FF]",
    orange: "border-[#F48252]",
    purple: "border-[#9945FF]",
    green: "border-[#14F195]",
  }[card.color || "aqua"];
  return (
    <div
      data-slot="feature-card"
      className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
    >
      {card.eyebrow && <Eyebrow>{card.eyebrow}</Eyebrow>}
      {card.variant === "logo" && card.logo?.src && (
        <Image
          src={card.logo.src}
          alt={card.logo.alt || ""}
          width={100}
          height={48}
          className="h-12 w-auto object-contain"
        />
      )}
      {card.variant !== "logo" && card.feature && (
        <h3 className={cn("border-l-2 pl-3 text-2xl font-medium", color)}>
          {card.feature}
        </h3>
      )}
      {card.body && (
        <p className="text-base leading-relaxed text-[#ABABBA] lg:text-lg">
          {card.body}
        </p>
      )}
      {card.stat && (
        <div className="grid gap-2">
          <strong className="text-4xl font-light">
            {card.stat.value?.staticValue ?? card.stat.stat ?? "—"}
          </strong>
          <span className="font-brand-mono text-xs uppercase text-[#ABABBA]">
            {card.stat.description}
          </span>
        </div>
      )}
      {card.button && <ActionButton {...card.button} className="mt-2" />}
    </div>
  );
}

export function FeatureHighlight({
  cards,
  eyebrow,
  headline,
  headingAs: H = "h2",
  buttons,
  body,
  mobileBackground,
  desktopBackground,
  dynamicDataFootnote,
}: FeatureHighlightProps) {
  const hasIntro = !!(eyebrow || headline || body || buttons?.length);
  return (
    <Section
      className={cn(
        "relative isolate grid gap-8",
        hasIntro && "lg:grid-cols-12",
      )}
    >
      {mobileBackground?.src && (
        <Image
          src={mobileBackground.src}
          alt=""
          fill
          className="-z-10 object-cover md:hidden"
        />
      )}
      {desktopBackground?.src && (
        <Image
          src={desktopBackground.src}
          alt=""
          fill
          className="-z-10 hidden object-cover md:block"
        />
      )}
      {hasIntro && (
        <div className="grid h-fit gap-3 lg:col-span-4">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {headline && (
            <H className="text-4xl font-medium leading-tight md:text-5xl">
              {headline}
            </H>
          )}
          {body && (
            <p className="text-lg leading-relaxed text-[#ABABBA]">{body}</p>
          )}
          <ActionList buttons={buttons} className="mt-4" />
          {dynamicDataFootnote &&
            cards?.some((card) => card.stat?.value?.statType === "dynamic") && (
              <p className="font-brand-mono text-xs uppercase text-[#ABABBA]">
                {dynamicDataFootnote}
              </p>
            )}
        </div>
      )}
      <div
        className={cn(
          "grid gap-4 md:gap-8",
          cards?.length !== 1 && "md:grid-cols-2",
          hasIntro && "lg:col-span-8",
        )}
      >
        {cards?.map((card, index) => (
          <FeatureCard key={index} card={card} />
        ))}
      </div>
    </Section>
  );
}
