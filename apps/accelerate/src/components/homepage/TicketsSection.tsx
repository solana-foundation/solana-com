"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getImagePath } from "@/config";

interface TicketTier {
  name: string;
  subtitle: string;
  price: string;
  description: string;
  nameColor: string;
  href: string;
}

interface EventTicketBlockProps {
  logoSrc: string;
  dateLocation: string;
  tiers: TicketTier[];
  showDivider?: boolean;
}

function SectionHeader() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-[18px]">
        <div className="h-[17px] w-[17px] bg-accelerate-green" />
        <h2 className="text-[22px] font-bold uppercase leading-none text-accelerate-gray-100 md:text-[30px]">
          Tickets
        </h2>
      </div>
      <div className="h-px w-full bg-accelerate-gray-300" />
    </div>
  );
}

function TicketCard({ tier }: { tier: TicketTier }) {
  return (
    <div
      className="flex w-full flex-col gap-8 rounded-[10px] p-8 md:w-[400px] md:gap-10 md:p-10"
      style={{
        backgroundImage:
          "linear-gradient(142deg, rgba(23, 20, 20, 0.2) 25.5%, rgba(217, 217, 217, 0.2) 101.2%)",
      }}
    >
      <div className="flex flex-col gap-5">
        {/* Title */}
        <div>
          <p
            className="text-[24px] font-bold leading-[1.1] md:text-[32px]"
            style={{ color: tier.nameColor }}
          >
            {tier.name}
          </p>
          <p className="text-[24px] font-bold leading-[1.1] text-accelerate-gray-light md:text-[32px]">
            {tier.subtitle}
          </p>
        </div>

        {/* Price */}
        <p className="text-[48px] font-bold leading-none text-accelerate-gray-light md:text-[60px]">
          {tier.price}
        </p>

        {/* Description */}
        <p className="font-diatype text-[18px] font-light leading-[1.2] text-accelerate-gray-light md:text-[24px]">
          {tier.description}
        </p>
      </div>

      {/* CTA Button */}
      <a
        href={tier.href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-cta flex h-[56px] items-center justify-between px-7 py-6 md:h-[66px]"
      >
        <span className="text-[14px] font-semibold uppercase tracking-[0.9px] leading-none text-black md:text-[18px]">
          Get Tickets
        </span>
        <Image
          src={getImagePath("/images/homepage/cta-arrow.svg")}
          alt=""
          width={18}
          height={12}
          className="flex-shrink-0"
        />
      </a>
    </div>
  );
}

function EventTicketBlock({
  logoSrc,
  dateLocation,
  tiers,
  showDivider = true,
}: EventTicketBlockProps) {
  return (
    <div className="flex flex-col gap-16 md:gap-20">
      {showDivider && <div className="h-px w-full bg-accelerate-gray-300" />}

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        {/* Left — event logo + date */}
        <div className="flex flex-col gap-8 md:gap-10">
          <div className="relative h-[130px] w-[230px] md:h-[185px] md:w-[327px]">
            <Image src={logoSrc} alt="" fill className="object-contain" />
          </div>
          <p className="text-[20px] font-light leading-[1.2] text-accelerate-green md:text-[24px]">
            {dateLocation}
          </p>
        </div>

        {/* Right — ticket cards */}
        <div className="flex flex-col gap-5 md:flex-row">
          {tiers.map((tier) => (
            <TicketCard key={tier.name} tier={tier} />
          ))}
        </div>
      </div>
    </div>
  );
}

const EVENTS: EventTicketBlockProps[] = [
  {
    logoSrc: getImagePath("/images/solana-accelerate-logo.svg"),
    dateLocation: "February 11 / Hong Kong",
    tiers: [
      {
        name: "General Admission",
        subtitle: "(Early Bird)",
        price: "$99",
        description: "Full conference access",
        nameColor: "#19FB9B",
        href: "/accelerate/hong-kong",
      },
      {
        name: "Student",
        subtitle: "(Early Bird)",
        price: "$25",
        description: "Valid student ID required\nat entry",
        nameColor: "#9945FF",
        href: "/accelerate/hong-kong",
      },
    ],
  },
  {
    logoSrc: getImagePath("/images/accelerate-usa-logo.svg"),
    dateLocation: "May 5 / Miami",
    tiers: [
      {
        name: "General Admission",
        subtitle: "(Early Bird)",
        price: "$99",
        description: "Full conference access",
        nameColor: "#19FB9B",
        href: "https://lu.ma/accelerate-miami",
      },
      {
        name: "Student",
        subtitle: "(Early Bird)",
        price: "$25",
        description: "Valid student ID required\nat entry",
        nameColor: "#9945FF",
        href: "https://lu.ma/accelerate-miami",
      },
    ],
  },
  {
    logoSrc: getImagePath("/images/accelerate-usa-logo.svg"),
    dateLocation: "Sep 23 / Buenos Aires",
    tiers: [
      {
        name: "General Admission",
        subtitle: "(Early Bird)",
        price: "$99",
        description: "Full conference access",
        nameColor: "#19FB9B",
        href: "/accelerate",
      },
      {
        name: "Student",
        subtitle: "(Early Bird)",
        price: "$25",
        description: "Valid student ID required\nat entry",
        nameColor: "#9945FF",
        href: "/accelerate",
      },
    ],
  },
];

export function TicketsSection() {
  return (
    <section className="relative bg-black py-16 lg:py-24">
      <div className="mx-auto max-w-[1480px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-16 md:gap-20"
        >
          <SectionHeader />
          {EVENTS.map((event, i) => (
            <EventTicketBlock
              key={event.dateLocation}
              {...event}
              showDivider={i > 0}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
