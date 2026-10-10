import type { ElementType, ReactNode } from "react";
import Image from "next/image";

import beamsDesktop from "../assets/beams_desktop.jpg";
import beamsMobile from "../assets/beams_mobile.jpg";
import beamsTablet from "../assets/beams_tablet.jpg";
import { cn } from "../lib/utils";
import {
  ActionButton,
  ActionList,
  Eyebrow,
  Section,
  type ActionButtonProps,
  type LandingImage,
} from "./landing-shared";
import { HtmlParser } from "./landing-rich-text";
import { LandingNewsletter } from "./landing-newsletter";

export interface CardData {
  type?: "standard" | "gradient" | "image" | "cta" | "blog" | "tall";
  eyebrow?: string;
  publishedDate?: string;
  heading?: string;
  headingAs?: ElementType;
  body?: string;
  callToAction?: ActionButtonProps;
  backgroundGradient?: "none" | "pink" | "purple" | "blue" | "green";
  backgroundImage?: LandingImage;
  mobileBackgroundImage?: LandingImage;
  isFeatured?: boolean;
  hiddenOnDesktop?: boolean;
}

function CardLink({
  href,
  className,
  children,
}: {
  href?: string;
  className: string;
  children: ReactNode;
}) {
  if (!href) return <div className={className}>{children}</div>;
  if (href.startsWith("/"))
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  if (/^(mailto:|tel:)/i.test(href))
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  try {
    const parsed = new URL(href);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
      return <div className={className}>{children}</div>;
    if (
      parsed.hostname === "solana.com" ||
      parsed.hostname === "www.solana.com"
    ) {
      return (
        <a href={href} className={className}>
          {children}
        </a>
      );
    }
  } catch {
    return <div className={className}>{children}</div>;
  }
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function DeckCard({
  card,
  featured,
  hiddenOnDesktop,
}: {
  card: CardData;
  featured?: boolean;
  hiddenOnDesktop?: boolean;
}) {
  const H = card.headingAs || "h3";
  const image = card.backgroundImage;
  const mobileImage = card.mobileBackgroundImage || image;
  const type = card.type || "standard";
  const date = card.publishedDate
    ? new Date(card.publishedDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;
  return (
    <CardLink
      href={card.callToAction?.url}
      className={cn(
        "group relative isolate flex min-h-64 flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-[#111114] p-8 text-white transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CA9FF5]",
        type === "blog" && "min-h-0 border-0 bg-transparent px-1 pb-4 pt-0",
        type === "tall" && "min-h-[480px] justify-end",
        type === "image" && "justify-end bg-black",
        type === "cta" && "justify-between border-white/20",
        card.backgroundGradient === "pink" &&
          "bg-gradient-to-br from-[#291525] to-[#111114]",
        card.backgroundGradient === "purple" &&
          "bg-gradient-to-br from-[#211535] to-[#111114]",
        card.backgroundGradient === "blue" &&
          "bg-gradient-to-br from-[#111e35] to-[#111114]",
        card.backgroundGradient === "green" &&
          "bg-gradient-to-br from-[#112b22] to-[#111114]",
        featured && "hidden sm:flex",
        hiddenOnDesktop && "sm:hidden",
      )}
    >
      {image?.src && (
        <Image
          src={image.src}
          alt=""
          fill
          className="-z-10 hidden rounded-3xl object-cover md:block"
        />
      )}
      {mobileImage?.src && (
        <Image
          src={mobileImage.src}
          alt=""
          fill
          className="-z-10 rounded-3xl object-cover md:hidden"
        />
      )}
      {(type === "image" || type === "tall") && (
        <span className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/80 to-transparent" />
      )}
      {(card.eyebrow || date) && (
        <span className="font-brand-mono text-xs uppercase tracking-wide text-[#CA9FF5]">
          {card.eyebrow || date}
        </span>
      )}
      {card.heading && (
        <H
          className={cn(
            "font-brand text-3xl font-medium leading-tight tracking-tight",
            featured && "text-4xl md:text-5xl",
          )}
        >
          {card.heading}
        </H>
      )}
      {card.body && (
        <p className="text-base leading-relaxed text-[#ABABBA]">{card.body}</p>
      )}
      {card.callToAction && (
        <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/50 px-4 py-2 font-brand-mono text-xs uppercase tracking-wide group-hover:bg-white group-hover:text-black">
          {card.callToAction.label || card.callToAction.children}
          <span aria-hidden="true">
            {card.callToAction.endIcon === "arrow-right" ? "→" : "↗"}
          </span>
        </span>
      )}
    </CardLink>
  );
}

export interface CardDeckProps {
  headline?: string;
  isListing?: boolean;
  cards: CardData[];
  numCols?: 1 | 2 | 3;
  featured?: boolean;
}

export function CardDeck({
  headline,
  isListing,
  cards,
  numCols = 3,
  featured,
}: CardDeckProps) {
  if (!cards?.length) return null;
  return (
    <Section className={cn(isListing && "flex flex-col gap-6 py-8 md:gap-8")}>
      {featured && (
        <div className="mb-7">
          <DeckCard card={cards[0]!} featured />
        </div>
      )}
      {isListing && headline && <span className="text-lg">{headline}</span>}
      <div
        className={cn(
          "grid gap-7",
          numCols === 2 && "md:grid-cols-2",
          numCols === 3 && "md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {cards.map((card, index) => (
          <DeckCard
            key={index}
            card={card}
            featured={card.isFeatured}
            hiddenOnDesktop={(featured && index === 0) || card.hiddenOnDesktop}
          />
        ))}
      </div>
    </Section>
  );
}

export interface SwitchbackProps {
  assetSide?: "left" | "right";
  eyebrow?: string;
  headline?: string;
  headingAs?: ElementType;
  body?: string;
  buttons?: ActionButtonProps[];
  image?: LandingImage;
  hideBackground?: boolean;
  newsLetter?: boolean;
  formId?: string;
  placeholder?: string;
  emailError?: string;
  submitError?: string;
  successMessage?: string;
}

export function Switchback({
  assetSide = "right",
  eyebrow,
  headline,
  headingAs: H = "h2",
  body,
  buttons,
  image,
  hideBackground,
  newsLetter,
  formId,
  placeholder,
  emailError,
  submitError,
  successMessage,
}: SwitchbackProps) {
  return (
    <Section
      wrapperClass={cn(
        !hideBackground && "bg-gradient-to-b from-[#111114] to-black",
      )}
      className={cn(
        "flex flex-col items-center justify-between gap-8 lg:flex-row",
        assetSide === "left" && "lg:flex-row-reverse",
      )}
    >
      <div className="flex max-w-lg flex-1 flex-col gap-4">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        {headline && (
          <H className="font-brand text-4xl font-medium leading-tight tracking-tight md:text-5xl">
            {headline}
          </H>
        )}
        {body && <HtmlParser rawHtml={body} classes="text-lg text-[#ABABBA]" />}
        {newsLetter && formId && (
          <LandingNewsletter
            formId={formId}
            placeholder={placeholder}
            emailError={emailError}
            submitError={submitError}
            successMessage={successMessage}
          />
        )}
        <ActionList buttons={buttons} className="mt-4" />
      </div>
      {image?.src && (
        <Image
          src={image.src}
          width={600}
          height={600}
          alt={image.alt || ""}
          className="h-auto w-full flex-1 object-contain lg:max-w-[50%]"
        />
      )}
    </Section>
  );
}

export function SwitchbackChain({
  switchbacks,
  hideBackground,
}: {
  switchbacks: SwitchbackProps[];
  hideBackground?: boolean;
}) {
  return (
    <div className="relative isolate">
      {!hideBackground && (
        <>
          <Image
            src={beamsDesktop}
            alt=""
            fill
            className="-z-10 hidden object-cover lg:block"
          />
          <Image
            src={beamsTablet}
            alt=""
            fill
            className="-z-10 hidden object-cover sm:block lg:hidden"
          />
          <Image
            src={beamsMobile}
            alt=""
            fill
            className="-z-10 object-cover sm:hidden"
          />
        </>
      )}
      {switchbacks?.map((switchback, index) => (
        <Switchback
          key={index}
          {...switchback}
          assetSide={index % 2 === 0 ? "right" : "left"}
          hideBackground
        />
      ))}
    </div>
  );
}

export interface ConversionPanelProps {
  variant?: "centered" | "inline-centered" | "offset";
  mobileBackground?: LandingImage;
  desktopBackground?: LandingImage;
  heading?: string;
  body?: string;
  buttons?: (ActionButtonProps | null)[];
  mobileImage?: LandingImage;
  desktopImage?: LandingImage;
  showLogos?: boolean;
  logos?: LandingImage[];
  listItems?: (ActionButtonProps | null)[];
  newsLetter?: boolean;
  formId?: string;
  placeholder?: string;
  emailError?: string;
  submitError?: string;
  successMessage?: string;
}

export function ConversionPanel({
  variant = "centered",
  mobileBackground,
  desktopBackground,
  heading,
  body,
  buttons,
  mobileImage,
  desktopImage,
  showLogos,
  logos,
  listItems,
  newsLetter,
  formId,
  placeholder,
  emailError,
  submitError,
  successMessage,
}: ConversionPanelProps) {
  const visibleButtons = buttons?.filter(
    (button): button is ActionButtonProps => !!button,
  );
  const visibleItems = listItems?.filter(
    (button): button is ActionButtonProps => !!button,
  );
  return (
    <Section className="relative py-16 lg:py-24">
      <div
        className={cn(
          "relative isolate mx-auto flex flex-col gap-8 overflow-hidden rounded-2xl border-b border-[#14F195] bg-[#1b1622] px-4 py-6 shadow-[0_12px_22px_-16px_#14F195] md:p-8",
          variant === "centered" &&
            "items-center gap-10 border-0 text-center md:p-16",
          variant === "offset" && "lg:max-w-[75%]",
          variant === "inline-centered" &&
            "md:grid md:grid-cols-[minmax(0,3.35fr)_minmax(0,1fr)]",
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
        <div
          className={cn(
            "flex flex-col gap-5",
            variant === "inline-centered" && "lg:gap-10",
          )}
        >
          {showLogos && !!logos?.length && (
            <div className="mb-5 hidden flex-wrap justify-center gap-12 md:flex">
              {logos.map(
                (logo, index) =>
                  logo.src && (
                    <Image
                      key={index}
                      src={logo.src}
                      alt={logo.alt || ""}
                      width={100}
                      height={24}
                      className="h-6 w-auto"
                    />
                  ),
              )}
            </div>
          )}
          {heading && (
            <h2
              className={cn(
                "font-brand text-4xl font-bold leading-tight tracking-tight md:text-[56px]",
                variant === "inline-centered" &&
                  "border-b border-[#667085] pb-5 text-center md:text-left lg:leading-[60px]",
              )}
            >
              {heading}
            </h2>
          )}
          {variant === "inline-centered" ? (
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              {body && (
                <p className="min-w-0 flex-1 text-lg leading-7 text-[#ABABBA] lg:text-2xl lg:leading-7">
                  {body}
                </p>
              )}
              <ActionList buttons={visibleButtons} className="shrink-0" />
            </div>
          ) : (
            body && (
              <p className="text-lg leading-relaxed text-[#ABABBA] md:text-xl">
                {body}
              </p>
            )
          )}
          {newsLetter && formId && (
            <LandingNewsletter
              formId={formId}
              placeholder={placeholder}
              emailError={emailError}
              submitError={submitError}
              successMessage={successMessage}
            />
          )}
          {variant !== "inline-centered" && (
            <ActionList
              buttons={visibleButtons}
              className={cn(variant === "centered" && "justify-center")}
            />
          )}
        </div>
        {!!visibleItems?.length && (
          <div className="flex flex-col items-start gap-4">
            {visibleItems.map((item, index) => (
              <ActionButton key={index} {...item} />
            ))}
          </div>
        )}
        {variant === "offset" && (
          <>
            {mobileImage?.src && (
              <Image
                src={mobileImage.src}
                alt={mobileImage.alt || ""}
                width={400}
                height={300}
                className="h-auto lg:hidden"
              />
            )}
            {desktopImage?.src && (
              <Image
                src={desktopImage.src}
                alt={desktopImage.alt || ""}
                width={800}
                height={600}
                className="hidden h-auto lg:block"
              />
            )}
          </>
        )}
      </div>
    </Section>
  );
}
