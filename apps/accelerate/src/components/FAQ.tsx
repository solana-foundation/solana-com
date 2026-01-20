"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

interface FAQItem {
  question: string;
  answer: string;
}

function FAQAccordionItem({
  item,
  isOpen,
  onClick,
}: {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className="border-b border-white/10 last:border-b-0"
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <span
          className="text-h2 pr-8 text-white"
          style={{
            fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          {item.question}
        </span>
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-white/60"
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-p max-w-[800px] pb-6 pr-12 leading-relaxed text-white/60">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // FAQ items matching the Figma design content
  const faqs: FAQItem[] = [
    {
      question: "What's included in the ticket?",
      answer:
        "Your ticket includes full access to Accelerate Hong Kong, featuring boundary-pushing talks, workshops, and meaningful connections across the Solana ecosystem and beyond.",
    },
    {
      question: "Does my Consensus ticket also give me access to Accelerate?",
      answer:
        "No, Solana Accelerate is a separate event and requires its own ticket. However, we offer special pricing for Consensus attendees.",
    },
    {
      question: "Is there a dress code?",
      answer:
        "There is no strict dress code for the event. We recommend smart casual attire. The venue is air-conditioned, so you may want to bring a light jacket.",
    },
    {
      question: "Can I get a ticket to everything?",
      answer:
        "Yes! The General Admission ticket gives you access to all main sessions, talks, and networking events at Accelerate Hong Kong.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "Tickets are refundable up to 14 days before the event. After that, tickets can be transferred to another attendee. Please contact our support team for assistance with refunds or transfers.",
    },
    {
      question: "Where should I stay?",
      answer:
        "We recommend staying at the Grand Hyatt Hong Kong, which is offering discounted rates for event attendees. The venue is conveniently located near the Hong Kong Convention and Exhibition Centre.",
    },
    {
      question: "Is there parking available?",
      answer:
        "Yes, the Hong Kong Convention and Exhibition Centre has parking facilities available. However, we recommend using public transportation as parking can fill up quickly during large events.",
    },
    {
      question: "Accessibility information",
      answer:
        "The venue is fully wheelchair accessible with elevators, accessible restrooms, and designated seating areas. If you require any specific accommodations, please contact us in advance.",
    },
    {
      question: "Age restrictions",
      answer:
        "The event is open to attendees 18 years and older. Valid ID may be required for entry.",
    },
    {
      question: "Recording/Photography policy",
      answer:
        "Photography for personal use is permitted. Professional recording equipment requires prior approval. The event will be professionally photographed and recorded - by attending, you consent to appearing in event media.",
    },
    {
      question: "Contact information",
      answer:
        "For any questions or assistance, please email accelerate@solana.com. Our team will respond within 24-48 hours.",
    },
  ];

  return (
    <section id="faq" className="bg-black py-20 lg:py-28">
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
            className="text-h1 mb-12 text-white lg:mb-20"
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            FAQ
          </motion.h2>

          {/* Divider line */}
          <div className="mb-12 border-t border-white/10 lg:mb-8" />

          <div className="mx-auto max-w-4xl">
            {faqs.map((faq, index) => (
              <FAQAccordionItem
                key={index}
                item={faq}
                isOpen={openIndex === index}
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
