"use client";

import { motion } from "framer-motion";

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
  ticketUrl: string;
}

function TicketCard({
  title,
  price,
  description,
  showStudentDiscount,
  ticketUrl,
}: TicketCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative flex h-[339px] w-full flex-col rounded-none border border-black/10 bg-white p-10 lg:w-[600px]"
    >
      {/* Title and Price Row */}
      <div className="mb-5 flex items-center justify-between">
        <h3
          className="text-h2 text-black"
          style={{
            fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          {title}
        </h3>
        <span
          className="text-h2 text-black"
          style={{
            fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          {price}
        </span>
      </div>

      {/* Description */}
      <p className="text-p mb-auto text-black/60">{description}</p>

      {/* CTA Button */}
      <a
        href={ticketUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[66px] w-full items-center justify-between rounded-[32px] px-7 text-black transition-all hover:opacity-90"
        style={{
          background: "linear-gradient(to right, #9945FF, #19FB9B)",
        }}
      >
        <span
          className="flex-1 text-left uppercase"
          style={{
            fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: "18px",
            letterSpacing: "0.9px",
          }}
        >
          Get Tickets
        </span>
        {/* Grid icon (4 squares) */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="shrink-0"
        >
          <rect x="0" y="0" width="8" height="8" fill="black" />
          <rect x="10" y="0" width="8" height="8" fill="black" />
          <rect x="0" y="10" width="8" height="8" fill="black" />
          <rect x="10" y="10" width="8" height="8" fill="black" />
        </svg>
      </a>

      {/* Student Discount Link */}
      {showStudentDiscount && (
        <div className="mt-6 flex items-center justify-between text-p">
          <span className="text-black/60">Are you a Student?</span>
          <a
            href="#"
            className="text-button uppercase tracking-[0.05em] text-accelerate-purple hover:underline"
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
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
            className="text-black/5"
          >
            <path
              d="M120 0H0V99L60 49.5L120 99V0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

export function Tickets() {
  const ticketUrl = "https://lu.ma/sol-accelerate-hk";

  return (
    <section id="tickets" className="bg-white py-20 lg:py-28">
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
            className="text-h1 mb-12 text-black lg:mb-20"
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            Tickets
          </motion.h2>

          {/* Divider line */}
          <div className="mb-12 border-t border-black/10 lg:mb-20" />

          {/* Ticket Cards Grid - 2 columns */}
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-[80px]">
            <TicketCard
              title="General Admission"
              price="$99"
              description="Full conference access"
              ticketUrl={ticketUrl}
            />
            <TicketCard
              title="Student"
              price="$25"
              description="Full conference access"
              showStudentDiscount
              ticketUrl={ticketUrl}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
