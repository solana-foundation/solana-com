import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import Footer from "@/components/sections/Footer";
import Marquee from "@/components/Marquee";
import PageShell from "@/components/PageShell";
import SubpageHero from "@/components/SubpageHero";

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
    dark: "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white focus-visible:outline-black",
    light:
      "border-stroke-tertiary text-white hover:bg-neutral-700 focus-visible:outline-white",
    muted:
      "border-neutral-300 bg-neutral-600 text-neutral-200 focus-visible:outline-neutral-200",
  }[tone];

  const className = `inline-flex h-10 w-full items-center justify-center gap-3 overflow-hidden border px-5 font-mono text-button uppercase transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 ${toneClasses}`;

  const content = (
    <>
      <span>{label}</span>
      {!disabled && (
        <span className="inline-flex size-3 items-center justify-center">
          <ArrowUpRightIcon />
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
      <span className="font-display text-[32px] font-normal uppercase leading-[1.18] tracking-[0.04em] text-black/40 md:text-[48px]">
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
      className={`flex flex-col gap-xl overflow-hidden p-6 md:h-[352px] md:justify-between md:gap-0 md:p-8 ${cardClasses}`}
    >
      <div className="flex flex-col gap-1">
        <h2
          className={`font-sans text-[20px] font-bold leading-[1.18] tracking-[-0.01em] md:text-[24px] ${
            isFeatured ? "text-black" : "text-white"
          }`}
        >
          {ticket.title}
        </h2>
        <p
          className={`text-[16px] font-normal leading-[1.36] tracking-normal opacity-80 md:text-[18px] md:leading-[1.45] ${
            isFeatured ? "text-black" : "text-text-secondary"
          }`}
        >
          {ticket.description}
        </p>
      </div>

      <div className="flex flex-col gap-2 md:gap-3">
        {ticket.originalPrice && <PriceCut value={ticket.originalPrice} />}
        <p
          className={`font-display text-[48px] font-normal uppercase leading-[1.15] tracking-[0.04em] md:text-[64px] md:leading-[1.18] ${
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
      className="mt-[5px] h-[13px] w-[12px] shrink-0 border border-green"
    />
  );
}

function ExpectationsSection() {
  return (
    <section className="bg-black pt-2xl md:pt-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-l px-xs md:flex-row md:items-center md:justify-center md:gap-[116px] md:px-8">
        <div className="flex w-full flex-col gap-m md:w-[582px]">
          <p className="font-mono text-[16px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-white">
            What to expect:
          </p>
          <ul className="unstyled-list flex flex-col gap-[20px]">
            {expectations.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckMark />
                <span className="font-sans text-[20px] font-normal leading-[1.18] tracking-[-0.04em] text-white md:text-[24px]">
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
    <PageShell
      contentId="registration-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: GENERAL_ADMISSION_HREF,
        ctaLabel: "Register",
        showMenuButton: true,
      }}
    >
      <SubpageHero
        title="Snag Breakpoint 2026 tickets"
        tintClassName="bg-green"
        imageTopClassName="top-[-300px] md:top-[-300px]"
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
