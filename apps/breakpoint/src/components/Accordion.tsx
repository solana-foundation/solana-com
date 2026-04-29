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
  panelClassName?: string;
}

export default function Accordion({
  children,
  className = "border-b border-neutral-700 pb-s",
  defaultOpen = false,
  onOpenChange,
  open,
  panelClassName = "pt-s",
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
    <div className={`accordion-type ${className}`.trim()}>
      <h3>
        <button
          id={triggerId}
          type="button"
          onClick={handleOpenChange}
          className="accordion-control group/accordion-control flex w-full items-center gap-l text-left focus-visible:outline-none"
          aria-controls={panelId}
          aria-expanded={isOpen}
        >
          <span className="type-p-large flex-1 normal-case text-white">
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
            <div className={panelClassName}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
