import { useState } from "react";
import styles from "./AccelerateAccordion.module.scss";
import { HtmlParser } from "@solana-foundation/solana-lib";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function AccelerateAccordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.accordion}>
      {items &&
        items.length !== 0 &&
        items.map((item, index) => (
          <div key={index} className={styles.item}>
            <button
              className={styles.question}
              onClick={() => toggleAccordion(index)}
              aria-expanded={openIndex === index}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`${styles.arrow} ${openIndex === index ? styles.open : ""}`}
              />
            </button>
            <div
              className={`${styles.answer} ${openIndex === index ? styles.show : ""}`}
            >
              <HtmlParser classes={styles.content} rawHtml={item.answer} />
            </div>
          </div>
        ))}
    </div>
  );
}
