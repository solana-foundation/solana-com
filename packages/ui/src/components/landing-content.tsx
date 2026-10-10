import type { ElementType } from "react";
import Image from "next/image";
import glassQuote from "../assets/glass-quotes.webp";

import { cn } from "../lib/utils";
import {
  ActionList,
  Eyebrow,
  Section,
  type ActionButtonProps,
  type LandingImage,
  type LandingPerson,
} from "./landing-shared";
import { HtmlParser } from "./landing-rich-text";
import { LandingNewsletter } from "./landing-newsletter";

export interface HeroProps {
  eyebrow?: string;
  headline?: string | { text: string; variant?: "default" | "gradient" }[];
  headingAs?: ElementType;
  body?: string;
  buttons?: ActionButtonProps[];
  image?: LandingImage;
  leftImage?: LandingImage;
  rightImage?: LandingImage;
  centered?: boolean;
  headingSize?: "sm" | "lg";
  newsLetter?: boolean;
  formId?: string;
  placeholder?: string;
  emailError?: string;
  submitError?: string;
  successMessage?: string;
}

export function Hero({
  eyebrow,
  headline,
  headingAs: H = "h2",
  body,
  buttons,
  image,
  leftImage,
  rightImage,
  centered = true,
  headingSize = "lg",
  newsLetter,
  formId,
  placeholder,
  emailError,
  submitError,
  successMessage,
}: HeroProps) {
  return (
    <Section
      wrapperClass={cn(
        !centered &&
          "bg-[radial-gradient(33.16%_39.51%_at_90.76%_42.36%,rgba(153,69,255,0.3)_0%,transparent_100%)]",
      )}
      className={cn(
        "relative flex flex-col items-center gap-8",
        centered && "text-center",
      )}
    >
      <div
        className={cn(
          "relative z-10 flex flex-col gap-8",
          !centered && "xl:w-1/2",
        )}
      >
        <div className="grid gap-6">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {headline && (
            <H
              className={cn(
                "font-brand text-balance text-[28px] font-bold leading-[33px] tracking-[-0.017em] lg:text-[72px] lg:leading-[76px] lg:tracking-[-0.02em]",
                headingSize === "sm" && "lg:text-5xl lg:leading-tight",
              )}
            >
              {typeof headline === "string"
                ? headline
                : headline.map((line, index) => (
                    <span key={index}>
                      {index > 0 && <br />}
                      <span
                        className={cn(
                          line.variant === "gradient" &&
                            "bg-gradient-to-r from-[#14F195] via-[#369ad5] to-[#9945ff] bg-clip-text text-transparent",
                        )}
                      >
                        {line.text}
                      </span>
                    </span>
                  ))}
            </H>
          )}
          {body && (
            <HtmlParser
              rawHtml={body}
              classes={cn(
                "text-[#ABABBA] [&_p]:!my-0 [&_p]:!mb-2 [&_p]:text-lg [&_p]:leading-7 lg:[&_p]:w-3/4 lg:[&_p]:text-xl lg:[&_p]:leading-[30px]",
                centered && "mx-auto max-w-3xl",
              )}
            />
          )}
        </div>
        {newsLetter && formId && (
          <LandingNewsletter
            formId={formId}
            placeholder={placeholder}
            emailError={emailError}
            submitError={submitError}
            successMessage={successMessage}
          />
        )}
        <ActionList
          buttons={buttons}
          className={cn(centered && "justify-center")}
        />
      </div>
      {!centered && image?.src && (
        <Image
          src={image.src}
          width={705}
          height={705}
          alt={image.alt || ""}
          className="absolute -right-24 top-20 z-0 hidden size-[705px] object-contain xl:block"
          priority
        />
      )}
      {centered && leftImage?.src && (
        <Image
          src={leftImage.src}
          width={1200}
          height={1200}
          alt={leftImage.alt || ""}
          className="pointer-events-none absolute -left-1/3 -top-52 -z-10 hidden h-auto w-[1200px] sm:block"
          priority
        />
      )}
      {centered && rightImage?.src && (
        <Image
          src={rightImage.src}
          width={1600}
          height={1600}
          alt={rightImage.alt || ""}
          className="pointer-events-none absolute -top-14 left-1/2 -z-10 h-auto w-[1600px]"
          priority
        />
      )}
    </Section>
  );
}

export interface HeadingProps {
  eyebrow?: string;
  headline?: string;
  headingAs?: ElementType;
  body?: string;
  buttons?: ActionButtonProps[];
  variant?: "floatingButton" | "centered";
  paddingBottom?: "none" | "sm" | "md" | "lg";
}

export function Heading({
  eyebrow,
  headline,
  headingAs: H = "h2",
  body,
  buttons,
  variant,
  paddingBottom,
}: HeadingProps) {
  return (
    <Section
      className={cn(
        "flex flex-col gap-4",
        variant === "centered" && "items-center text-center",
        variant === "floatingButton" &&
          "md:flex-row md:items-end md:justify-between",
        paddingBottom === "none" && "pb-0 md:pb-0 xl:pb-0",
        paddingBottom === "sm" && "pb-8 md:pb-12 xl:pb-16",
      )}
    >
      <div className="flex flex-col gap-4">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        {headline && (
          <H
            className={cn(
              "font-brand font-medium leading-[1.1] tracking-[-0.04em] text-4xl md:text-5xl xl:text-6xl",
              variant === "floatingButton" && "md:max-w-4xl",
            )}
          >
            {headline}
          </H>
        )}
        {body && (
          <p className="max-w-4xl text-lg leading-relaxed text-[#ABABBA]">
            {body}
          </p>
        )}
      </div>
      <ActionList
        buttons={buttons}
        className={cn(variant === "centered" && "justify-center")}
      />
    </Section>
  );
}

export interface StatValue {
  statType: string;
  staticValue?: string | number;
  dynamicValueSource?: string | null;
  dynamicValueEndpoint?: string | null;
}

export interface StatCardData {
  stat?: string;
  value?: StatValue;
  description: string;
}

export interface StatsProps {
  stats: StatCardData[];
  contained: boolean;
  eyebrow?: string;
  headline?: string;
  headingAs?: ElementType;
  buttons?: ActionButtonProps[];
}

export function Stats({
  stats,
  contained,
  eyebrow,
  headline,
  headingAs: H = "h2",
  buttons,
}: StatsProps) {
  return (
    <Section
      className={cn("grid gap-9 md:gap-14", !contained && "lg:grid-cols-2")}
    >
      {!contained && (
        <div className="flex max-w-md flex-col gap-4">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {headline && (
            <H className="text-4xl font-medium leading-tight md:text-5xl">
              {headline}
            </H>
          )}
          <ActionList buttons={buttons} />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col gap-8",
          contained && "flex-row flex-wrap justify-center gap-4 md:gap-8",
        )}
      >
        {stats?.map((item, index) => (
          <div
            key={index}
            className={cn(
              "min-w-[250px] flex-1",
              contained &&
                "rounded-2xl border border-white/20 px-8 py-12 text-center",
            )}
          >
            <h3 className="mb-4 bg-gradient-to-r from-[#9945FF] via-[#6693F7] to-[#14F195] bg-clip-text text-5xl font-light text-transparent md:text-6xl">
              {item.value?.staticValue ?? item.stat ?? "—"}
            </h3>
            <p
              className={cn(
                "font-brand-mono text-xs uppercase tracking-wide text-[#ABABBA]",
                contained && "font-brand text-base normal-case",
              )}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export interface TrustbarProps {
  eyebrow?: string;
  logos?: (LandingImage & { url?: string })[];
  variant?: "standard" | "standardPurple" | "grid";
}

export function Trustbar({
  eyebrow,
  logos,
  variant = "standard",
}: TrustbarProps) {
  return (
    <Section
      wrapperClass={variant === "standardPurple" ? "bg-[#9945FF]" : undefined}
      className="flex flex-col gap-8 py-8 md:py-12"
    >
      {eyebrow && (
        <p className="text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
        {logos
          ?.filter((logo) => logo.src)
          .map((logo, index) => {
            const image = (
              <Image
                src={logo.src}
                alt={logo.alt || ""}
                width={118}
                height={24}
                className={cn(
                  "h-6 w-auto object-contain",
                  variant === "standard" && "brightness-0 invert",
                )}
              />
            );
            return logo.url ? (
              <a
                key={index}
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CA9FF5]",
                  variant === "grid" &&
                    "flex h-28 w-56 items-center justify-center rounded-lg border border-white/10 bg-white/5",
                )}
              >
                {image}
              </a>
            ) : (
              <div
                key={index}
                className={cn(
                  variant === "grid" &&
                    "flex h-28 w-56 items-center justify-center rounded-lg border border-white/10 bg-white/5",
                )}
              >
                {image}
              </div>
            );
          })}
      </div>
    </Section>
  );
}

export interface QuoteProps {
  quote: string;
  eyebrow?: string;
  image?: LandingImage;
  author?: LandingPerson;
}

export function Quote({ quote, eyebrow, image, author }: QuoteProps) {
  return (
    <Section className="flex gap-12">
      <blockquote className="flex flex-1 flex-col gap-6">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <p className="max-w-4xl text-4xl font-medium leading-tight md:text-5xl xl:text-6xl">
          “{quote}”
        </p>
        {author && <Attribution author={author} />}
      </blockquote>
      {image?.src && (
        <Image
          src={image.src}
          width={392}
          height={392}
          alt={image.alt || ""}
          className="hidden h-auto self-center lg:block"
        />
      )}
    </Section>
  );
}

function Attribution({ author }: { author: LandingPerson }) {
  return (
    <figcaption className="flex flex-wrap gap-x-2 text-sm text-[#ABABBA]">
      <strong className="text-white">{author.name}</strong>
      {author.role && <span>{author.role}</span>}
      {author.company && <span>— {author.company}</span>}
    </figcaption>
  );
}

export function RichTextQuote({
  quote,
  author,
}: {
  quote?: string;
  author?: LandingPerson;
}) {
  return (
    <figure className="my-4 flex flex-col gap-4 rounded-lg border border-white/10 bg-gradient-to-br from-[#211535] to-[#101014] p-8 md:flex-row md:gap-8">
      <Image
        src={glassQuote}
        alt=""
        width={123}
        height={135}
        className="w-16 self-start md:w-[123px]"
      />
      <div>
        <blockquote>
          {quote && (
            <HtmlParser
              rawHtml={quote}
              classes="text-3xl leading-tight md:text-4xl"
            />
          )}
        </blockquote>
        {author && <Attribution author={author} />}
      </div>
    </figure>
  );
}

export function YoutubeVideo({ url }: { url?: string }) {
  if (!url) return null;
  let videoId: string | null = null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:")
      return null;
    if (parsed.hostname === "youtu.be") videoId = parsed.pathname.slice(1);
    if (
      parsed.hostname === "youtube.com" ||
      parsed.hostname === "www.youtube.com"
    )
      videoId = parsed.searchParams.get("v");
  } catch {
    return null;
  }
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return null;
  return (
    <iframe
      className="aspect-video w-full"
      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
      title="YouTube video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
    />
  );
}
