"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LumaModal } from "./LumaModal";
import { getImagePath } from "@/config";
import { fadeInUp, stagger } from "@/lib/animations";

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
      className="flex flex-1 flex-col border bg-black/40 p-8 lg:p-10"
      style={{ borderColor }}
    >
      <div className="mb-6 flex items-baseline justify-between">
        <h3 className="text-xl font-medium text-white lg:text-2xl">{title}</h3>
        <span
          className="text-3xl font-bold lg:text-4xl"
          style={{ color: priceColor }}
        >
          {price}
        </span>
      </div>

      <p className="mb-8 text-white/60">{description}</p>

      <div className="mt-auto space-y-4">
        <LumaModal lumaId={lumaId}>
          <button className="btn-cta h-[56px] w-full px-5">
            <span className="text-sm font-semibold uppercase tracking-[0.9px]">
              {ctaLabel}
            </span>
            <Image
              src={getImagePath("/images/ticket-icon.svg")}
              alt=""
              width={18}
              height={12}
              className="flex-shrink-0"
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
    <section id="tickets" className="section-accelerate relative">
      <div className="container-accelerate">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Section heading */}
          <motion.h2 variants={fadeInUp} className="section-heading">
            {t("heading")}
          </motion.h2>

          {/* Divider line */}
          <div className="section-divider" />

          {/* Ticket cards with Solana mark */}
          <div className="relative">
            <div className="flex items-start gap-6 md:gap-8 lg:gap-[80px]">
              <div className="grid flex-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-[80px]">
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
                      >
                        {t("applyForDiscount")}
                      </a>
                    </div>
                  }
                />
              </div>
              {/* Solana gradient mark — right-aligned per Figma */}
              <div className="hidden shrink-0 self-center lg:block">
                <Image
                  src={getImagePath("/images/solana-mark-gradient.svg")}
                  alt=""
                  width={120}
                  height={99}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
