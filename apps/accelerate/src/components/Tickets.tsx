"use client";

import { motion } from "framer-motion";
import { useState } from "react";

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
  originalPrice?: string;
  description: string;
  hasCheckbox?: boolean;
  checkboxLabel?: string;
  isChecked?: boolean;
  onCheckChange?: (checked: boolean) => void;
}

function TicketIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className="text-black"
    >
      <rect
        x="4"
        y="12"
        width="40"
        height="24"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M16 12V36"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <circle cx="32" cy="24" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

function TicketCard({
  title,
  price,
  originalPrice,
  description,
  hasCheckbox,
  checkboxLabel,
  isChecked,
  onCheckChange,
}: TicketCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-col rounded-2xl border border-black/10 bg-white p-6 transition-all duration-300 hover:border-black/20 hover:shadow-lg"
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-black">{title}</h3>
          <p className="mt-1 text-sm text-black/60">{description}</p>
        </div>
        <TicketIcon />
      </div>

      {hasCheckbox && (
        <label className="mb-4 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onCheckChange?.(e.target.checked)}
            className="h-5 w-5 rounded border-black/20 text-[#9945FF] focus:ring-[#9945FF]"
          />
          <span className="text-sm text-black/70">{checkboxLabel}</span>
        </label>
      )}

      <div className="mb-6 mt-auto">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-black">{price}</span>
          {originalPrice && (
            <span className="text-lg text-black/40 line-through">
              {originalPrice}
            </span>
          )}
        </div>
      </div>

      <a
        href="#"
        className="flex w-full items-center justify-center rounded-lg bg-black py-3.5 text-sm font-medium text-white transition-colors hover:bg-black/90"
      >
        Buy a ticket
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="ml-2"
        >
          <path
            d="M4 12L12 4M12 4H6M12 4V10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </motion.div>
  );
}

export function Tickets() {
  const [isBuilder, setIsBuilder] = useState(false);

  return (
    <section id="tickets" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="mb-12 text-4xl font-bold text-black md:text-5xl"
          >
            Tickets
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TicketCard
              title="General Admission"
              price="$99"
              description="Full conference access"
            />
            <TicketCard
              title="Builder"
              price={isBuilder ? "$0" : "$99"}
              originalPrice={isBuilder ? "$99" : undefined}
              description="For active Solana developers"
              hasCheckbox
              checkboxLabel="Are you a developer?"
              isChecked={isBuilder}
              onCheckChange={setIsBuilder}
            />
            <TicketCard
              title="VIP"
              price="$499"
              description="Premium experience"
            />
          </div>

          <motion.p
            variants={fadeInUp}
            className="mt-8 text-center text-sm text-black/50"
          >
            All tickets include access to keynotes, panels, and networking sessions.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
