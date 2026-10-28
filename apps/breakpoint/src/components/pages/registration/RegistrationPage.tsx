import { getTranslations } from "@workspace/i18n/server";
import ImageTreatment from "@/components/ImageTreatment";
import Footer from "@/components/sections/Footer";
import Marquee from "@/components/Marquee";
import PageShell from "@/components/PageShell";
import SubpageHero from "@/components/SubpageHero";
import {
  DEVELOPER_APPLICATION_HREF,
  GENERAL_ADMISSION_HREF,
  STUDENT_APPLICATION_HREF,
} from "@/content/links";
import { GENERAL_ADMISSION_PRICE_CHANGE } from "@/content/ticket-pricing";
import TicketsGrid from "@/components/pages/registration/RegistrationTicketsGrid";
import type {
  RegistrationTicket,
  RegistrationTicketSeed,
} from "@/components/pages/registration/RegistrationTicketsGrid";
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
  const tickets: RegistrationTicket[] = ticketSeeds.map((ticket) => ({
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
      <TicketsGrid
        initialNow={initialNow}
        tickets={tickets}
        generalCtaLabel={t("tickets.general.cta")}
      />
      <ExpectationsSection
        headline={t("expectations.headline")}
        imageAlt={t("expectations.imageAlt")}
        items={expectations}
      />
      <Footer />
    </PageShell>
  );
}
