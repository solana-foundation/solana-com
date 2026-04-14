import React from "react";
import Button from "./Button";

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
    <div className="flex min-h-[332px] flex-col justify-between overflow-hidden border border-white/15 bg-white/[0.02] p-6 md:min-h-[404px] md:p-8">
      <div>
        {heading && (
          <h3 className="font-sans text-[1.5rem] font-medium leading-[1.1] tracking-[-0.03em] text-white">
            {heading}
          </h3>
        )}
        {subhead && (
          <p className="mt-3 text-[1rem] leading-[1.4] text-white/64 md:max-w-[26ch] md:text-[1.125rem]">
            {subhead}
          </p>
        )}
      </div>
      <div>
        {price && (
          <p className="font-display text-[3rem] leading-none tracking-[0.04em] text-white md:text-[4.75rem]">
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
    </div>
  );
}

function LinkCard({ eyebrow, linkLabel, href }: LinkCardProps) {
  const content = (
    <div className="flex h-[300px] flex-col justify-between overflow-hidden border border-white/15 bg-white/[0.02] p-s">
      <div>
        {eyebrow && (
          <span className="font-mono text-base uppercase tracking-[1.28px] text-white opacity-80">
            {eyebrow}
          </span>
        )}
      </div>
      <div>
        {linkLabel && (
          <span className="font-sans text-[32px] tracking-[-1.28px] text-white">
            {linkLabel}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block transition-opacity hover:opacity-80">
        {content}
      </a>
    );
  }

  return content;
}
