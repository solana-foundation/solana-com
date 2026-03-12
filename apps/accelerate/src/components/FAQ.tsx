"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getImagePath } from "@/config";
import { fadeInUp, staggerFast } from "@/lib/animations";

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
        >
          {item.question}
        </span>
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center">
          {isOpen ? (
            <Image
              src={getImagePath("/images/faq-arrow-expanded.svg")}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9"
            />
          ) : (
            <Image
              src={getImagePath("/images/faq-arrow.svg")}
              alt=""
              width={36}
              height={36}
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

interface FAQProps {
  faqKeys?: string[];
  translationPrefix?: string;
}

export function FAQ({
  faqKeys = ["q1", "q2", "q3", "q4"],
  translationPrefix = "accelerate.faq",
}: FAQProps = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = useTranslations(translationPrefix);

  const faqs: FAQItem[] = faqKeys.map((key) => ({
    question: t(`items.${key}.question`),
    answer: t(`items.${key}.answer`),
  }));

  return (
    <section id="faq" className="section-accelerate">
      <div className="container-accelerate">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerFast}
        >
          {/* Section heading */}
          <motion.h2 variants={fadeInUp} className="section-heading">
            {t("heading")}
          </motion.h2>

          {/* Divider line */}
          <div className="section-divider" />

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
