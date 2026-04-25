import type { Metadata } from "next";
import Footer from "@/components/sections/Footer";
import Marquee from "@/components/Marquee";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Registration | Breakpoint 2026",
  description:
    "Reserve Breakpoint 2026 tickets for general admission, developers, and students.",
};

const GENERAL_ADMISSION_HREF = "https://luma.com/breakpoint2026";
const DEVELOPER_APPLICATION_HREF =
  "https://solanafoundation.typeform.com/bp26-devapp";
const STUDENT_APPLICATION_HREF =
  "https://solanafoundation.typeform.com/bp26-studentapp";
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
    description: "Flash Sale : Ends on June 1st",
    originalPrice: "$500",
    price: "$350",
    ctaLabel: "Reserve Now",
    href: GENERAL_ADMISSION_HREF,
    tone: "featured",
  },
  {
    title: "Late Bird GA",
    description: "General admission rate starting September 1st",
    price: "$800",
    ctaLabel: "Coming soon | Don't Wait",
    tone: "disabled",
  },
  {
    title: "Developers",
    description:
      "Special discount for builders actively working in the Solana Ecosystem",
    price: "$800",
    ctaLabel: "Apply now",
    href: DEVELOPER_APPLICATION_HREF,
    tone: "standard",
  },
  {
    title: "Students",
    description:
      "Discounted rate for any active higher education students globally",
    price: "$800",
    ctaLabel: "Apply now",
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

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      width="8.02"
      height="8"
      viewBox="0 0 8.01975 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path
        d="M1.24444 8L0 6.7358L4.95803 1.79753H1.12593V0H8.01975V6.85432H6.20247V3.06173L1.24444 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TicketButton({
  disabled = false,
  href,
  label,
  tone,
}: {
  disabled?: boolean;
  href?: string;
  label: string;
  tone: "dark" | "light" | "muted";
}) {
  const toneClasses = {
    dark: "border-black text-black hover:bg-black hover:text-white focus-visible:outline-black",
    light:
      "border-white text-white hover:bg-white hover:text-black focus-visible:outline-white",
    muted:
      "border-[#a2a2a2] bg-neutral-600 text-[#c0c0c0] focus-visible:outline-[#c0c0c0]",
  }[tone];

  const className = `inline-flex h-10 w-full items-center justify-center gap-3 overflow-hidden border px-5 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] transition-colors ${toneClasses}`;

  const content = (
    <>
      <span>{label}</span>
      {!disabled && (
        <span className="inline-flex size-3 items-center justify-center">
          <ArrowUpRight />
        </span>
      )}
    </>
  );

  if (!href || disabled) {
    return (
      <span aria-disabled="true" className={`${className} pointer-events-none`}>
        {content}
      </span>
    );
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
}

function PriceCut({ value }: { value: string }) {
  return (
    <span className="relative inline-flex self-start">
      <span className="font-display text-[42px] font-normal uppercase leading-[1.18] tracking-[0.04em] text-black/40 md:text-[48px]">
        {value}
      </span>
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
      : "bg-neutral-700 text-white";

  const buttonTone = isFeatured ? "dark" : isDisabled ? "muted" : "light";

  return (
    <article
      className={`flex min-h-[300px] flex-col justify-between overflow-hidden p-6 md:h-[352px] md:p-8 ${cardClasses}`}
    >
      <div className="flex flex-col gap-1">
        <h2
          className={`font-sans text-[24px] font-bold leading-[1.18] tracking-[-0.01em] ${
            isFeatured ? "text-black" : "text-white"
          }`}
        >
          {ticket.title}
        </h2>
        <p
          className={`text-[18px] font-normal leading-[1.45] tracking-normal opacity-80 ${
            isFeatured ? "text-black" : "text-text-secondary"
          }`}
        >
          {ticket.description}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {ticket.originalPrice && <PriceCut value={ticket.originalPrice} />}
        <p
          className={`font-display text-[52px] font-normal uppercase leading-[1.18] tracking-[0.04em] md:text-[64px] ${
            isFeatured ? "text-black" : "text-white"
          }`}
        >
          {ticket.price}
        </p>
        <TicketButton
          disabled={isDisabled}
          href={ticket.href}
          label={ticket.ctaLabel}
          tone={buttonTone}
        />
      </div>
    </article>
  );
}

function RegistrationHero() {
  return (
    <section className="relative h-[395px] w-full overflow-hidden bg-black">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[360px] overflow-hidden"
      >
        <img
          src="/img/registration-hero-glitch.png"
          alt=""
          width={1200}
          height={800}
          className="absolute left-1/2 top-[-300px] h-[960px] w-[1440px] max-w-none -translate-x-1/2 object-cover"
        />
        <div className="absolute inset-0 bg-green mix-blend-multiply" />
      </div>

      <img
        src="/assets/pixel-edge.svg"
        alt=""
        aria-hidden="true"
        width={1440}
        height={146}
        className="pointer-events-none absolute left-0 top-[160px] h-[200px] w-full min-w-[840px]"
      />

      <div className="absolute left-5 right-5 top-[236px] flex flex-col gap-8 pb-3 text-white md:left-8 md:right-auto md:top-[252px] md:w-[1026px]">
        <p className="font-mono text-[16px] font-normal uppercase leading-[1.3] tracking-[0.08em]">
          Breakpoint 2026
        </p>
        <h1 className="max-w-[1026px] font-sans text-[48px] font-normal leading-[0.98] tracking-[-0.06em] md:text-[80px]">
          Snag Breakpoint 2026 tickets
        </h1>
      </div>
    </section>
  );
}

function TicketsGrid() {
  return (
    <section className="bg-black pt-[120px]">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 px-5 md:grid-cols-2 md:px-8">
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
      className="mt-[6px] size-[10px] shrink-0 border border-green"
    />
  );
}

function ExpectationsSection() {
  return (
    <section className="bg-black pt-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 md:flex-row md:items-center md:justify-center md:gap-[116px] md:px-8">
        <div className="flex w-full flex-col gap-6 md:w-[582px]">
          <p className="font-mono text-[16px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-white">
            What to expect:
          </p>
          <ul className="unstyled-list flex flex-col gap-4">
            {expectations.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckMark />
                <span className="font-sans text-[22px] font-normal leading-[1.18] tracking-[-0.04em] text-white md:text-[24px]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-[676/507] w-full overflow-hidden bg-neutral-700 md:w-[676px]">
          <img
            src="/img/gallery/photo-7.jpg"
            alt="Breakpoint attendees arriving at general admission"
            width={3648}
            height={2432}
            className="h-full w-full object-cover object-center grayscale"
          />
          <div className="absolute inset-0 bg-purple mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>
    </section>
  );
}

export default function RegistrationPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <a
        href="#registration-content"
        className="sr-only absolute left-5 top-5 z-50 focus:not-sr-only focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-[14px] focus:font-bold focus:uppercase focus:tracking-[0.08em] focus:text-black"
      >
        Skip to content
      </a>
      <Navigation
        ctaAlwaysVisible
        ctaHref={GENERAL_ADMISSION_HREF}
        ctaLabel="Register"
        showMenuButton
      />
      <div id="registration-content">
        <RegistrationHero />
        <Marquee
          highlightClassName="text-green"
          highlights={REGISTRATION_MARQUEE_HIGHLIGHTS}
        />
        <TicketsGrid />
        <ExpectationsSection />
        <Footer />
      </div>
    </main>
  );
}
