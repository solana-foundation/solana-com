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
          className={`text-h2 pr-8 font-normal transition-colors ${
            isOpen ? "text-accelerate-green" : "text-accelerate-gray-100"
          }`}
          style={{
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          {item.question}
        </span>
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center">
          {isOpen ? (
            <img
              src="/images/faq-arrow-expanded.svg"
              alt=""
              className="h-9 w-9"
            />
          ) : (
            <img src="/images/faq-arrow.svg" alt="" className="h-9 w-9" />
          )}
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
      question: "What is included in my ticket?",
      answer:
        "Your ticket includes full access to Accelerate Hong Kong, featuring boundary-pushing talks, workshops, and meaningful connections across the Solana ecosystem and beyond.",
    },
    {
      question: "Does my Consensus ticket also give me access to Accelerate?",
      answer:
        "No — Accelerate requires a separate ticket from Consensus. However, when purchasing your Consensus ticket, you can receive a discount for Accelerate at checkout.",
    },
    {
      question: "Is there a dress code?",
      answer:
        "There's no dress code. Come as you are and wear whatever you're comfortable in.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "Tickets are non-refundable, but they are transferable. To transfer your ticket, click here.",
    },
    {
      question: "Where should I stay?",
      answer: "Visit the travel section for more information.",
    },
    {
      question: "Is there parking available?",
      answer: "TBD",
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
            className="text-h1 mb-12 text-accelerate-gray-100 lg:mb-20"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
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
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
