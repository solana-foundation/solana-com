"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { getImagePath } from "@/config";

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
              src={getImagePath("/images/faq-arrow-expanded.svg")}
              alt=""
              className="h-9 w-9"
            />
          ) : (
            <img
              src={getImagePath("/images/faq-arrow.svg")}
              alt=""
              className="h-9 w-9"
            />
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
  const t = useTranslations("accelerate.faq");

  const faqKeys = ["q1", "q2", "q3", "q4"] as const;
  const faqs: FAQItem[] = faqKeys.map((key) => ({
    question: t(`items.${key}.question`),
    answer: t(`items.${key}.answer`),
  }));

  return (
    <section id="faq" className="bg-black py-12 lg:py-16">
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
