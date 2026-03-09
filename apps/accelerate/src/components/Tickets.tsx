"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LumaModal } from "./LumaModal";
import { getImagePath } from "@/config";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface TicketCardProps {
  title: string;
  price: string;
  priceColor: string;
  borderColor: string;
  description: string;
  ctaLabel: string;
  lumaId: string;
  extra?: React.ReactNode;
}

function TicketCard({
  title,
  price,
  priceColor,
  borderColor,
  description,
  ctaLabel,
  lumaId,
  extra,
}: TicketCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-1 flex-col rounded-2xl border bg-black/40 p-8 lg:p-10"
      style={{ borderColor }}
    >
      <div className="mb-6 flex items-baseline justify-between">
        <h3
          className="text-xl font-medium text-white lg:text-2xl"
          style={{
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          {title}
        </h3>
        <span
          className="text-3xl font-bold lg:text-4xl"
          style={{
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            color: priceColor,
          }}
        >
          {price}
        </span>
      </div>

      <p className="mb-8 text-white/60">{description}</p>

      <div className="mt-auto space-y-4">
        <LumaModal lumaId={lumaId}>
          <button
            className="group inline-flex h-[56px] w-full items-center justify-center rounded-[32px] px-5 text-black transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(to right, #9945FF, #19FB9B)",
            }}
          >
            <span
              className="text-sm font-semibold uppercase tracking-[0.9px]"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              }}
            >
              {ctaLabel}
            </span>
            <Image
              src={getImagePath("/images/ticket-icon.svg")}
              alt=""
              width={18}
              height={12}
              className="ml-2 flex-shrink-0"
            />
          </button>
        </LumaModal>
        {extra}
      </div>
    </motion.div>
  );
}

export function Tickets() {
  const t = useTranslations("accelerate.miami.tickets");

  return (
    <section id="tickets" className="relative bg-black py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Section heading */}
          <motion.h2
            variants={fadeInUp}
            className="text-h1 mb-8 text-accelerate-gray-100 lg:mb-12"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            {t("heading")}
          </motion.h2>

          {/* Divider line */}
          <div className="mb-8 border-t border-white/10 lg:mb-10" />

          {/* Ticket cards */}
          <div className="relative mx-auto max-w-4xl">
            {/* Solana mark decoration */}
            <div className="pointer-events-none absolute -right-8 -top-4 hidden opacity-10 lg:block">
              <Image
                src={getImagePath("/images/solana-logo.svg")}
                alt=""
                width={80}
                height={80}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-[80px]">
              {/* General Admission */}
              <TicketCard
                title={t("generalAdmission")}
                price={t("generalPrice")}
                priceColor="#19FB9B"
                borderColor="#19FB9B"
                description={t("generalDesc")}
                ctaLabel={t("getTickets")}
                lumaId="accelerate-miami"
              />

              {/* Student */}
              <TicketCard
                title={t("student")}
                price={t("studentPrice")}
                priceColor="#9945FF"
                borderColor="#9945FF"
                description={t("studentDesc")}
                ctaLabel={t("getTickets")}
                lumaId="accelerate-miami"
                extra={
                  <div className="text-center">
                    <p className="mb-1 text-sm text-white/60">
                      {t("areYouStudent")}
                    </p>
                    <a
                      href="mailto:events@solana.org?subject=Student%20Discount%20-%20Accelerate%20Miami"
                      className="text-sm font-semibold uppercase tracking-wide text-accelerate-green underline underline-offset-4 transition-colors hover:text-white"
                      style={{
                        fontFamily:
                          "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                      }}
                    >
                      {t("applyForDiscount")}
                    </a>
                  </div>
                }
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
