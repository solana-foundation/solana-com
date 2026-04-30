import ImageTreatment from "@/components/ImageTreatment";
import Footer from "@/components/sections/Footer";
import Marquee from "@/components/Marquee";
import PageShell from "@/components/PageShell";
import RegistrationTicketButton from "@/components/pages/registration/RegistrationTicketButton";
import SubpageHero from "@/components/SubpageHero";
import {
  DEVELOPER_APPLICATION_HREF,
  GENERAL_ADMISSION_HREF,
  STUDENT_APPLICATION_HREF,
} from "@/content/links";
const REGISTRATION_MARQUEE_HIGHLIGHTS = [
  "BP26",
  "LDN",
  "BUILD",
  "DEPLOY",
  "SHIP MORE",
];

const tickets = [
  {
    title: "General Admission",
    description: "Price available until May 31, 2026",
    price: "$350",
    ctaLabel: "Get tickets",
    href: GENERAL_ADMISSION_HREF,
    tone: "featured",
  },
  {
    title: "Late Bird",
    description: "General admission pricing after May 31, 2026",
    price: "$800",
    ctaLabel: "Coming soon",
    tone: "disabled",
  },
  {
    title: "Developers",
    description: "Discounted access for builders actively working on Solana.",
    price: "$250",
    ctaLabel: "Apply",
    href: DEVELOPER_APPLICATION_HREF,
    tone: "standard",
  },
  {
    title: "Students",
    description: "Discounted access for active higher education students.",
    price: "$100",
    ctaLabel: "Apply",
    href: STUDENT_APPLICATION_HREF,
    tone: "standard",
  },
] satisfies RegistrationTicket[];

const expectations = [
  "Exclusive opening party with other attendees",
  "Solana and partner swag",
  "Over 60+ talks and other activations",
  "Time with Solana builders and founders",
  "Early access to talk recordings and other materials",
];

type RegistrationTicket = {
  ctaLabel: string;
  description: string;
  href?: string;
  originalPrice?: string;
  price: string;
  title: string;
  tone: "disabled" | "featured" | "standard";
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

function RegistrationTicketCard({ ticket }: { ticket: RegistrationTicket }) {
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
          {ticket.price}
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

function TicketsGrid() {
  return (
    <section className="bg-black pt-2xl md:pt-[120px]">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 px-xs md:grid-cols-2 md:px-8">
        {tickets.map((ticket) => (
          <RegistrationTicketCard key={ticket.title} ticket={ticket} />
        ))}
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

function ExpectationsSection() {
  return (
    <section className="bg-black pt-2xl md:pt-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-l px-xs md:flex-row md:items-center md:justify-center md:gap-[116px] md:px-8">
        <div className="flex w-full flex-col gap-m md:w-[582px]">
          <p className="type-eyebrow text-white">What to expect:</p>
          <ul className="unstyled-list flex flex-col gap-[20px] md:gap-2xs">
            {expectations.map((item) => (
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
            alt="Breakpoint attendees arriving at general admission"
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

export default function RegistrationPage() {
  return (
    <PageShell
      contentId="registration-content"
      // navigation={{
      //   ctaAlwaysVisible: true,
      //   ctaHref: GENERAL_ADMISSION_HREF,
      //   ctaLabel: "Get tickets",
      //   showMenuButton: true,
      // }}
    >
      <SubpageHero
        imageHeightClassName="h-[482px] md:h-[395px]"
        imageSrc="/img/subpage-heroes/registration.png"
        title="Snag Breakpoint 2026 tickets"
        tintClassName="bg-green"
        imageTopClassName="top-[-300px] md:top-[-300px]"
        imageTreatment={{
          flicker: true,
          motion: true,
          mouseReactive: true,
          mouseRadius: 160,
        }}
      />
      <Marquee
        highlightClassName="text-green"
        highlights={REGISTRATION_MARQUEE_HIGHLIGHTS}
      />
      <TicketsGrid />
      <ExpectationsSection />
      <Footer />
    </PageShell>
  );
}
