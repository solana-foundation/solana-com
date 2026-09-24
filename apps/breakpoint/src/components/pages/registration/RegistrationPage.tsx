import { getTranslations } from "@workspace/i18n/server";
import ImageTreatment from "@/components/ImageTreatment";
import Footer from "@/components/sections/Footer";
import Marquee from "@/components/Marquee";
import PageShell from "@/components/PageShell";
import RegistrationTicketButton from "@/components/pages/registration/RegistrationTicketButton";
import SubpageHero from "@/components/SubpageHero";
import {
  LocalizedGeneralAdmissionPrice,
  LocalizedTicketPriceChangeCountdown,
} from "@/components/TicketPriceChange";
import {
  DEVELOPER_APPLICATION_HREF,
  GENERAL_ADMISSION_HREF,
  STUDENT_APPLICATION_HREF,
} from "@/content/links";
import { GENERAL_ADMISSION_PRICE_CHANGE } from "@/content/ticket-pricing";
const REGISTRATION_MARQUEE_HIGHLIGHTS = [
  "BP26",
  "LDN",
  "BUILD",
  "DEPLOY",
  "SHIP MORE",
];

const ticketSeeds = [
  {
    id: "general",
    price: GENERAL_ADMISSION_PRICE_CHANGE.current.display,
    priceAfterIncrease: GENERAL_ADMISSION_PRICE_CHANGE.increased.display,
    href: GENERAL_ADMISSION_HREF,
    tone: "featured",
  },
  {
    id: "lateBird",
    price: "$800",
    tone: "disabled",
  },
  {
    id: "developers",
    price: "$250",
    href: DEVELOPER_APPLICATION_HREF,
    tone: "standard",
  },
  {
    id: "students",
    price: "$100",
    href: STUDENT_APPLICATION_HREF,
    tone: "standard",
  },
] satisfies RegistrationTicketSeed[];

const expectationIds = [
  "openingParty",
  "swag",
  "talks",
  "builders",
  "recordings",
] as const;

type RegistrationTicketSeed = {
  href?: string;
  id: string;
  originalPrice?: string;
  price: string;
  priceAfterIncrease?: string;
  tone: "disabled" | "featured" | "standard";
};

type RegistrationTicket = RegistrationTicketSeed & {
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

function TicketsGrid({
  initialNow,
  tickets,
}: {
  initialNow: number;
  tickets: RegistrationTicket[];
}) {
  return (
    <section className="bg-black pt-2xl md:pt-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-xs md:px-8">
        <LocalizedTicketPriceChangeCountdown
          className="self-center"
          initialNow={initialNow}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {tickets.map((ticket) => (
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

function CheckMark() {
  return (
    <span
      aria-hidden="true"
      className="mt-[11px] size-[6px] shrink-0 bg-green"
    />
  );
}

function ExpectationsSection({
  headline,
  imageAlt,
  items,
}: {
  headline: string;
  imageAlt: string;
  items: string[];
}) {
  return (
    <section className="bg-black pt-2xl md:pt-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-l px-xs md:flex-row md:items-center md:justify-center md:gap-[116px] md:px-8">
        <div className="flex w-full flex-col gap-m md:w-[582px]">
          <p className="type-eyebrow text-white">{headline}</p>
          <ul className="unstyled-list flex flex-col gap-[20px] md:gap-2xs">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckMark />
                <span className="type-p-large text-white">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-[676/507] w-full overflow-hidden bg-neutral-800 md:w-[676px]">
          <ImageTreatment
            src="/img/gallery/photo-7.jpg"
            alt={imageAlt}
            glitchPattern="p1"
            intensity={40}
            lighting="even"
            color="purple"
            motion
            flicker
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </section>
  );
}

export default async function RegistrationPage({ locale }: { locale: string }) {
  const t = await getTranslations({
    locale,
    namespace: "breakpoint.pages.registration",
  });
  const initialNow = Date.now();
  const tickets = ticketSeeds.map((ticket) => ({
    ...ticket,
    title: t(`tickets.${ticket.id}.title`),
    description: t(`tickets.${ticket.id}.description`),
    ctaLabel: t(`tickets.${ticket.id}.cta`),
  }));
  const expectations = expectationIds.map((item) => t(`expectations.${item}`));

  return (
    <PageShell
      contentId="registration-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: GENERAL_ADMISSION_HREF,
        ctaLabel: t("ticketsCta"),
        showMenuButton: true,
      }}
    >
      <SubpageHero heroImage="registration" title={t("heroTitle")} />
      <Marquee
        highlightClassName="text-green"
        highlights={REGISTRATION_MARQUEE_HIGHLIGHTS}
      />
      <TicketsGrid initialNow={initialNow} tickets={tickets} />
      <ExpectationsSection
        headline={t("expectations.headline")}
        imageAlt={t("expectations.imageAlt")}
        items={expectations}
      />
      <Footer />
    </PageShell>
  );
}
