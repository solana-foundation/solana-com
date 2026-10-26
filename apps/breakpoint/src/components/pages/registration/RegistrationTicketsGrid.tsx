"use client";

import {
  LocalizedGeneralAdmissionPrice,
  LocalizedTicketPriceChangeCountdown,
  usePriceChangeClock,
} from "@/components/TicketPriceChange";
import RegistrationTicketButton from "@/components/pages/registration/RegistrationTicketButton";
import { GENERAL_ADMISSION_HREF } from "@/content/links";
import { hasLateBirdStarted } from "@/content/ticket-pricing";

export type RegistrationTicketSeed = {
  href?: string;
  id: string;
  originalPrice?: string;
  price: string;
  priceAfterIncrease?: string;
  tone: "disabled" | "featured" | "standard";
};

export type RegistrationTicket = RegistrationTicketSeed & {
  ctaLabel: string;
  description: string;
  title: string;
};

function PriceCut({ value }: { value: string }) {
  return (
    <span className="relative inline-flex self-start">
      <span className="type-price-cut text-black/40">{value}</span>
      <span
        aria-hidden="true"
        className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 -skew-y-6 bg-black/45"
      />
    </span>
  );
}

function RegistrationTicketCard({
  initialNow,
  ticket,
}: {
  initialNow: number;
  ticket: RegistrationTicket;
}) {
  const isFeatured = ticket.tone === "featured";
  const isDisabled = ticket.tone === "disabled";

  const cardClasses = isFeatured
    ? "bg-purple text-black"
    : isDisabled
      ? "border border-neutral-700 bg-black text-white"
      : "bg-background-secondary text-white";

  const buttonTone = isFeatured ? "dark" : isDisabled ? "muted" : "light";

  return (
    <article
      className={`flex flex-col gap-xl overflow-hidden p-6 md:h-[352px] md:justify-between md:gap-0 md:p-8 ${cardClasses}`}
    >
      <div className="flex flex-col gap-1">
        <h2
          className={`type-p-large-bold ${
            isFeatured ? "text-black" : "text-white"
          }`}
        >
          {ticket.title}
        </h2>
        <p
          className={`type-paragraph opacity-80 ${
            isFeatured ? "text-black" : "text-text-secondary"
          }`}
        >
          {ticket.description}
        </p>
      </div>

      <div className="flex flex-col gap-2 md:gap-3">
        {ticket.originalPrice && <PriceCut value={ticket.originalPrice} />}
        <p className={`type-h2 ${isFeatured ? "text-black" : "text-white"}`}>
          {ticket.priceAfterIncrease ? (
            <LocalizedGeneralAdmissionPrice initialNow={initialNow} />
          ) : (
            ticket.price
          )}
        </p>
        <RegistrationTicketButton
          disabled={isDisabled}
          href={ticket.href}
          label={ticket.ctaLabel}
          tone={buttonTone}
        />
      </div>
    </article>
  );
}

export default function TicketsGrid({
  generalCtaLabel,
  initialNow,
  tickets,
}: {
  generalCtaLabel: string;
  initialNow: number;
  tickets: RegistrationTicket[];
}) {
  const lateBirdStarted = hasLateBirdStarted(usePriceChangeClock(initialNow));
  const visibleTickets = lateBirdStarted
    ? tickets
        .filter((ticket) => ticket.id !== "general")
        .map((ticket) =>
          ticket.id === "lateBird"
            ? {
                ...ticket,
                href: GENERAL_ADMISSION_HREF,
                tone: "featured" as const,
                ctaLabel: generalCtaLabel,
              }
            : ticket,
        )
    : tickets;

  return (
    <section className="bg-black pt-2xl md:pt-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-xs md:px-8">
        <LocalizedTicketPriceChangeCountdown
          className="self-center"
          initialNow={initialNow}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {visibleTickets.map((ticket) => (
            <RegistrationTicketCard
              key={ticket.id}
              initialNow={initialNow}
              ticket={ticket}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
