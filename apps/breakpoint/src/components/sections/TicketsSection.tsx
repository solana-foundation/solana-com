"use client";

import React, { useEffect } from "react";
import { useTranslations } from "@workspace/i18n/client";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import {
  BREAKPOINT_LUMA_EVENT_ID,
  DEVELOPER_APPLICATION_HREF,
  GENERAL_ADMISSION_HREF,
  STUDENT_APPLICATION_HREF,
} from "@/content/links";
import { getAnchorLinkProps } from "@/lib/links";
import { useVariant } from "@/lib/use-variant";

declare global {
  interface Window {
    luma?: {
      initCheckout?: () => void;
    };
  }
}

type TicketCardProps = {
  description?: string;
  disabled?: boolean;
  heading: string;
  href?: string;
  lumaEventId?: string;
  originalPrice?: string;
  price: string;
};

function PriceCut({ value }: { value: string }) {
  return (
    <span className="relative inline-flex self-start">
      <span className="type-price-cut text-black/40">{value}</span>
      <span
        aria-hidden="true"
        className="absolute left-0 top-1/2 h-[2px] w-[112%] -translate-x-[6%] -translate-y-1/2 -rotate-[12deg] bg-black/70"
      />
    </span>
  );
}

function ArrowGlyph({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
    >
      <ArrowUpRightIcon className="h-full w-full" />
    </span>
  );
}

function TicketLink({
  children,
  className,
  disabled = false,
  href,
  lumaEventId,
  label,
}: {
  children: React.ReactNode;
  className: string;
  disabled?: boolean;
  href?: string;
  label: string;
  lumaEventId?: string;
}) {
  if (disabled || !href) {
    return (
      <article aria-disabled="true" aria-label={label} className={className}>
        {children}
      </article>
    );
  }

  const lumaProps = lumaEventId
    ? {
        "data-luma-action": "checkout",
        "data-luma-event-id": lumaEventId,
      }
    : {};

  return (
    <a
      href={href}
      aria-label={label}
      className={className}
      {...lumaProps}
      {...(lumaEventId ? {} : getAnchorLinkProps({ href }))}
    >
      {children}
    </a>
  );
}

function FeaturedTicketCard({
  description,
  heading,
  href,
  lumaEventId,
  originalPrice,
  price,
}: TicketCardProps) {
  return (
    <TicketLink
      href={href}
      label={heading}
      lumaEventId={lumaEventId}
      className="group relative flex h-[263px] flex-col justify-between overflow-hidden bg-green p-s text-black transition-colors hover:bg-green/90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white md:col-span-8 md:h-[352px] md:p-m"
    >
      <div className="flex flex-col gap-1">
        <h3 className="type-p-large-bold text-black">{heading}</h3>
        {description && (
          <p className="type-paragraph text-black/80">{description}</p>
        )}
      </div>

      <div className="flex flex-col gap-2xs md:gap-3">
        {originalPrice && <PriceCut value={originalPrice} />}
        <p className="type-h2 text-black">{price}</p>
      </div>

      <ArrowGlyph className="absolute bottom-m right-m size-[26px] text-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:bottom-[40px] md:right-[40px] md:size-[35px]" />
    </TicketLink>
  );
}

function HorizontalTicketCard({
  disabled = false,
  heading,
  href,
  lumaEventId,
  originalPrice,
  price,
}: TicketCardProps) {
  const activeClasses =
    "bg-neutral-700 text-white transition-colors hover:bg-neutral-600 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white";
  const disabledClasses =
    "border border-stroke-primary bg-black text-text-secondary";

  return (
    <TicketLink
      disabled={disabled}
      href={href}
      label={heading}
      lumaEventId={lumaEventId}
      className={`group flex h-[77px] items-center justify-between gap-1 overflow-hidden p-s md:h-auto md:gap-s ${
        disabled ? disabledClasses : activeClasses
      }`}
    >
      <h3
        className={`type-p-large-bold w-[141px] shrink-0 md:w-auto ${
          disabled ? "text-text-secondary" : "text-white"
        }`}
      >
        {heading}
      </h3>
      <div className="flex min-w-0 items-center gap-1 md:gap-3">
        {originalPrice && (
          <span className="font-bp26 text-[20px] leading-none tracking-[0.05rem] text-white/50 line-through md:text-[28px]">
            {originalPrice}
          </span>
        )}
        <p
          className={`font-bp26 text-[24px] leading-[1.18] tracking-[0.06rem] whitespace-nowrap uppercase md:text-h2 md:leading-[var(--text-h2--line-height)] md:tracking-[var(--text-h2--letter-spacing)] ${
            disabled ? "text-text-secondary" : "text-white"
          }`}
        >
          {price}
        </p>
        {!disabled && (
          <ArrowGlyph className="size-4 text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:size-[35px]" />
        )}
      </div>
    </TicketLink>
  );
}

export default function TicketsSection() {
  const t = useTranslations("breakpoint");
  const variant = useVariant();

  useEffect(() => {
    window.luma?.initCheckout?.();
  }, []);

  const lumaEventId = BREAKPOINT_LUMA_EVENT_ID;
  const lumaHref = GENERAL_ADMISSION_HREF;

  return (
    <section className="bg-black pt-2xl md:pt-[120px]">
      <div className="container flex w-full flex-col gap-l">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="type-h3 mx-auto max-w-[24ch] text-white">
            {variant?.ticketsHeadline ?? t("tickets.headline")}
          </h2>
          {variant?.ticketsSupportingText && (
            <p className="type-eyebrow text-white">
              {variant.ticketsSupportingText}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-xs md:grid-cols-bp-desktop md:gap-s">
          <FeaturedTicketCard
            heading={t("tickets.categories.general.label")}
            description={t("tickets.categories.general.description")}
            price={t("tickets.categories.general.price")}
            href={lumaHref}
            lumaEventId={lumaEventId}
          />
          <div className="grid gap-xs md:col-span-8 md:h-[352px] md:grid-rows-3 md:gap-s">
            <HorizontalTicketCard
              heading={t("tickets.categories.developers.label")}
              originalPrice={
                variant?.slug === "developers"
                  ? variant.heroOriginalPrice
                  : undefined
              }
              price={t("tickets.categories.developers.price")}
              href={DEVELOPER_APPLICATION_HREF}
            />
            <HorizontalTicketCard
              heading={t("tickets.categories.students.label")}
              price={t("tickets.categories.students.price")}
              href={STUDENT_APPLICATION_HREF}
            />
            <HorizontalTicketCard
              heading={t("tickets.categories.lateBird.label")}
              price={t("tickets.categories.lateBird.price")}
              disabled
            />
          </div>
        </div>
      </div>
    </section>
  );
}
