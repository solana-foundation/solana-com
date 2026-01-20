"use client";

import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";

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
  features: string[];
  highlighted?: boolean;
  soldOut?: boolean;
  comingSoon?: boolean;
}

function TicketCard({
  title,
  price,
  description,
  features,
  highlighted = false,
  soldOut = false,
  comingSoon = false,
}: TicketCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
        highlighted
          ? "border-accelerate-purple bg-accelerate-purple/10"
          : "border-white/10 bg-white/5 hover:border-white/20"
      }`}
    >
      {highlighted && (
        <div className="absolute right-4 top-4">
          <Zap className="h-5 w-5 text-accelerate-purple" />
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/60">{description}</p>
      </div>

      <div className="mb-6">
        <span className="text-3xl font-bold text-white">{price}</span>
        {!soldOut && !comingSoon && (
          <span className="ml-2 text-white/50">USD</span>
        )}
      </div>

      <ul className="mb-6 space-y-3">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm text-white/80"
          >
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accelerate-green" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        disabled={soldOut || comingSoon}
        className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition-all ${
          soldOut
            ? "cursor-not-allowed bg-white/10 text-white/50"
            : comingSoon
              ? "cursor-not-allowed bg-white/10 text-white/50"
              : highlighted
                ? "bg-accelerate-purple text-white hover:bg-accelerate-purple/90"
                : "bg-white text-black hover:bg-white/90"
        }`}
      >
        {soldOut ? "Sold Out" : comingSoon ? "Coming Soon" : "Get Tickets"}
      </button>
    </motion.div>
  );
}

export function Tickets() {
  const tickets: TicketCardProps[] = [
    {
      title: "General Admission",
      price: "$99",
      description: "Full conference access",
      features: [
        "Access to all keynotes and panels",
        "Networking opportunities",
        "Conference swag bag",
        "Lunch and refreshments",
      ],
      comingSoon: true,
    },
    {
      title: "Builder",
      price: "$0",
      description: "For active Solana developers",
      features: [
        "Everything in General Admission",
        "Priority seating at workshops",
        "Builder-only networking session",
        "1-on-1 mentorship opportunities",
      ],
      highlighted: true,
      comingSoon: true,
    },
    {
      title: "VIP",
      price: "$499",
      description: "Premium experience",
      features: [
        "Everything in Builder tier",
        "VIP lounge access",
        "Exclusive dinner with speakers",
        "Priority Q&A access",
      ],
      comingSoon: true,
    },
  ];

  return (
    <section id="tickets" className="section bg-white dark:bg-accelerate-dark">
      <div className="container-accelerate">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="heading-lg mb-4 text-black dark:text-white"
          >
            Tickets
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mb-12 max-w-2xl text-black/60 dark:text-white/60"
          >
            Secure your spot at Solana Accelerate APAC. Early bird pricing
            available for a limited time.
          </motion.p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.title} {...ticket} />
            ))}
          </div>

          <motion.p
            variants={fadeInUp}
            className="mt-8 text-center text-sm text-black/50 dark:text-white/50"
          >
            Tickets will be available in April 2025. Join the waitlist to be
            notified.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
