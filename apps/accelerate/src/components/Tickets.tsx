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
  showStudentDiscount?: boolean;
  lumaId: string;
  variant: "green" | "purple";
}

function TicketCard({
  title,
  price,
  description,
  showStudentDiscount,
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
      className={`relative flex h-[339px] w-full flex-col rounded-none border bg-black p-10 lg:w-[600px] ${borderColor}`}
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
      <p className="text-p mb-auto text-white/60">{description}</p>

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
            Get Tickets
          </span>
          <Image
            src="/images/ticket-icon.svg"
            alt="Ticket icon"
            width={18}
            height={12}
          />
        </button>
      </LumaModal>

      {/* Student Discount Link */}
      {showStudentDiscount && (
        <div className="mt-6 flex flex-col gap-3 text-p lg:flex-row lg:items-center lg:justify-between lg:gap-0">
          <span className="text-white/60">Are you a Student?</span>
          <a
            href="https://solanafoundation.typeform.com/hk26studentapp"
            className="text-button uppercase tracking-[0.05em] text-accelerate-green hover:underline"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            APPLY FOR DISCOUNT
          </a>
        </div>
      )}

      {/* Ticket Icon Mark - positioned at top right of Student card */}
      {showStudentDiscount && (
        <div className="absolute right-0 top-0">
          <svg
            width="120"
            height="99"
            viewBox="0 0 120 99"
            fill="none"
            className="text-white/5"
          >
            <path d="M120 0H0V99L60 49.5L120 99V0Z" fill="currentColor" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

export function Tickets() {
  const lumaId = "sol-accelerate-hk";

  return (
    <section id="tickets" className="bg-black py-20 lg:py-28">
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
            className="text-h1 mb-12 text-accelerate-gray-100 lg:mb-20"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            Tickets
          </motion.h2>

          {/* Divider line */}
          <div className="mb-12 border-t border-white/10 lg:mb-20" />

          {/* Ticket Cards Grid - 2 columns with Solana logo on right */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-[80px]">
            <TicketCard
              title="General Admission"
              price="$99"
              description="Full conference access"
              lumaId={lumaId}
              variant="green"
            />
            <TicketCard
              title="Student"
              price="$25"
              description="Full conference access"
              showStudentDiscount
              lumaId={lumaId}
              variant="purple"
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
