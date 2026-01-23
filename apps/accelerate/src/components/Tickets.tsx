"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LumaModal } from "./LumaModal";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

interface TicketCardProps {
  title: string;
  price: string;
  description: string;
  lumaId: string;
  variant: "green" | "purple";
}

function TicketCard({
  title,
  price,
  description,
  lumaId,
  variant,
}: TicketCardProps) {
  const borderColor =
    variant === "green"
      ? "border-accelerate-green"
      : "border-accelerate-purple";
  const titleColor =
    variant === "green" ? "text-accelerate-green" : "text-accelerate-purple";

  return (
    <motion.div
      variants={fadeInUp}
      className={`relative flex w-full flex-col rounded-none border bg-black p-10 ${borderColor}`}
    >
      {/* Title and Price Row */}
      <div className="mb-5 flex items-center justify-between">
        <h3
          className={`text-h2 ${titleColor}`}
          style={{
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          {title}
        </h3>
        <span
          className={`text-h2 ${titleColor}`}
          style={{
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          {price}
        </span>
      </div>

      {/* Description */}
      <p className="text-p mb-8 text-white/60">{description}</p>

      {/* CTA Button */}
      <LumaModal lumaId={lumaId}>
        <button
          className="flex h-[66px] w-full items-center justify-between rounded-[32px] px-7 text-black transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(to right, #9945FF, #19FB9B)",
          }}
        >
          <span
            className="flex-1 text-left uppercase"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: "18px",
              letterSpacing: "0.9px",
            }}
          >
            Request to Join
          </span>
          <Image
            src="/images/ticket-icon.svg"
            alt="Ticket icon"
            width={18}
            height={12}
          />
        </button>
      </LumaModal>
    </motion.div>
  );
}

export function Tickets() {
  const lumaId = "sol-accelerate-hk";

  return (
    <section id="tickets" className="bg-black py-12 lg:py-16">
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
            Tickets
          </motion.h2>

          {/* Divider line */}
          <div className="mb-8 border-t border-white/10 lg:mb-10" />

          {/* Single Ticket Card with Solana Logo */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-[80px]">
            <TicketCard
              title="General Admission"
              price="Free"
              description="Full conference access. Your registration is subject to host approval."
              lumaId={lumaId}
              variant="green"
            />
            {/* Solana Logo - desktop only */}
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:pl-8">
              <Image
                src="/images/solana-logo.svg"
                alt="Solana"
                width={120}
                height={120}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
