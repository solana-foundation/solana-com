"use client";

import React, { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import AccordionButton from "@/components/AccordionButton";

interface AccordionProps {
  question: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  onOpenChange?: (_open: boolean) => void;
  open?: boolean;
}

export default function Accordion({
  children,
  className = "border-b border-neutral-700 pb-s",
  defaultOpen = false,
  onOpenChange,
  open,
  question,
}: AccordionProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const triggerId = useId();
  const panelId = useId();
  const isControlled = open !== undefined;
  const isOpen = open ?? uncontrolledOpen;

  function handleOpenChange() {
    const nextOpen = !isOpen;
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  }

  return (
    <div className={className}>
      <h3>
        <button
          id={triggerId}
          type="button"
          onClick={handleOpenChange}
          className="group/accordion-control flex w-full items-center gap-l text-left focus-visible:outline-none"
          aria-controls={panelId}
          aria-expanded={isOpen}
        >
          <span className="flex-1 font-sans text-[20px] font-normal normal-case leading-[1.18] tracking-[-0.04em] text-white md:text-[24px]">
            {question}
          </span>
          <AccordionButton interaction="group" open={isOpen} />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            aria-labelledby={triggerId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="pt-s">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
