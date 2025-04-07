import { FC } from "react";
import { HtmlParser } from "@solana-foundation/solana-lib";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from "@radix-ui/react-accordion";
import styles from "./AccelerateAccordion.module.scss";
import { ArrowDown } from "lucide-react";

export const AccelerateAccordion: FC<{
  items: {
    title: string;
    content: string;
  }[];
}> = ({ items }) => {
  return (
    <div>
      <Accordion className={styles.Root} type="multiple">
        {items && items.length !== 0 ? (
          items.map((item, index) => (
            <AccordionItem
              key={index}
              className={styles.Item}
              value={`item-${index}`}
            >
              <AccordionTrigger className={styles.AccordionTrigger}>
                {item.title}
                <span className={styles.Icon}>
                  <ArrowDown />
                </span>
              </AccordionTrigger>
              <AccordionContent className={styles.AccordionContent}>
                <HtmlParser classes={styles.content} rawHtml={item.content} />
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <div>Add content to the accordion</div>
        )}
      </Accordion>
    </div>
  );
};
