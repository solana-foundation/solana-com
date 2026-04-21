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
    <div className="flex aspect-[4/3] flex-col justify-between overflow-hidden border border-[#353535] p-8">
      <div className="flex flex-col gap-1">
        {heading && (
          <p className="font-sans !text-[24px] !font-bold !leading-[1.18] !tracking-[-0.01em] !text-white">
            {heading}
          </p>
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
