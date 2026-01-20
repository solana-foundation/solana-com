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
      className="border-b border-black/10 last:border-b-0"
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <span className="pr-8 text-lg font-medium text-black md:text-xl">
          {item.question}
        </span>
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-black/10 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-black/60"
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
            <p className="pb-6 pr-12 text-base leading-relaxed text-black/60">
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

  const faqs: FAQItem[] = [
    {
      question: "What's included in the ticket?",
      answer:
        "Your ticket includes full access to Accelerate Hong Kong, featuring boundary-pushing talks, workshops, and meaningful connections across the Solana ecosystem and beyond.",
    },
    {
      question: "Is there a dress code?",
      answer:
        "There is no strict dress code for the event. We recommend smart casual attire. The venue is air-conditioned, so you may want to bring a light jacket.",
    },
    {
      question: "Can I get a ticket to everything?",
      answer:
        "Yes! The General Admission ticket gives you access to all main sessions. Builder and VIP tickets include additional exclusive events and networking opportunities.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "Tickets are refundable up to 14 days before the event. After that, tickets can be transferred to another attendee. Please contact our support team for assistance with refunds or transfers.",
    },
    {
      question: "What should I bring?",
      answer:
        "Bring your ticket confirmation (digital or printed), a valid ID, and business cards for networking. Laptops are welcome for the workshop sessions. The venue provides free WiFi.",
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
      question: "COVID Information",
      answer:
        "We follow all local health guidelines. Please check our website closer to the event date for the latest health and safety protocols.",
    },
  ];

  return (
    <section id="faq" className="bg-white py-20 lg:py-28">
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
            FAQ
          </motion.h2>

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

          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <p className="text-black/60">
              Still have questions?{" "}
              <a
                href="mailto:accelerate@solana.com"
                className="font-medium text-[#9945FF] hover:underline"
              >
                Contact us
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
