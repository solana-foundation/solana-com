import React from "react";
import { Link } from "@workspace/i18n/routing";
import Button from "./Button";
import WordReveal from "./WordReveal";
import { isRelativeHref } from "@/lib/links";

interface TicketCardProps {
  variant: "ticket";
  heading?: string;
  subhead?: string;
  price?: string;
  ctaLabel?: string;
  href?: string;
  eyebrow?: never;
  linkLabel?: never;
}

interface LinkCardProps {
  variant: "link";
  eyebrow?: string;
  linkLabel?: string;
  href?: string;
  heading?: never;
  subhead?: never;
  price?: never;
  ctaLabel?: never;
}

type CardProps = TicketCardProps | LinkCardProps;

export default function Card(props: CardProps) {
  if (props.variant === "ticket") {
    return <TicketCard {...props} />;
  }

  return <LinkCard {...props} />;
}

function TicketCard({
  heading,
  subhead,
  price,
  ctaLabel,
  href,
}: TicketCardProps) {
  return (
    <article className="flex aspect-[4/3] flex-col justify-between overflow-hidden border border-neutral-700 p-8">
      <div className="flex flex-col gap-1">
        {heading && (
          <h3 className="font-sans !text-[24px] !font-bold !leading-[1.18] !tracking-[-0.01em] !text-white">
            {heading}
          </h3>
        )}
        {subhead && (
          <p className="!text-[18px] !leading-[1.45] !text-text-secondary opacity-80">
            {subhead}
          </p>
        )}
      </div>
      <div>
        {price && (
          <p className="font-display !text-[64px] uppercase !leading-[1.18] !tracking-[0.04em] !text-white">
            {price}
          </p>
        )}
        {ctaLabel && (
          <div className="mt-6 w-full">
            <Button
              label={ctaLabel}
              variant="secondary"
              href={href}
              className="w-full"
            />
          </div>
        )}
      </div>
    </article>
  );
}

function LinkCard({ eyebrow, linkLabel, href }: LinkCardProps) {
  const content = (
    <div className="flex h-[300px] flex-col justify-between overflow-hidden border border-white/15 bg-white/[0.02] p-s">
      <div>
        {eyebrow && (
          <WordReveal
            as="span"
            text={eyebrow}
            stepMs={55}
            className="font-mono text-base uppercase tracking-[1.28px] text-white opacity-80"
          />
        )}
      </div>
      <div>
        {linkLabel && (
          <WordReveal
            as="span"
            text={linkLabel}
            stepMs={70}
            startDelayMs={120}
            className="font-sans text-[32px] tracking-[-1.28px] text-white"
          />
        )}
      </div>
    </div>
  );

  if (href) {
    if (isRelativeHref(href)) {
      return (
        <Link href={href} className="block transition-opacity hover:opacity-80">
          {content}
        </Link>
      );
    }

    return (
      <a href={href} className="block transition-opacity hover:opacity-80">
        {content}
      </a>
    );
  }

  return content;
}
