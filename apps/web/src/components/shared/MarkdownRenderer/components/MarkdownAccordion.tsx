import React, { ReactNode, useRef, useEffect } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import styles from "./MarkdownAccordion.module.scss";
import AngleDownIcon from "../../../../../public/src/img/icons/Angle-down.inline.svg";

interface MarkdownAccordionProps {
  children: ReactNode;
}

export function MarkdownAccordion({
  children,
  ...props
}: MarkdownAccordionProps) {
  return (
    <AccordionPrimitive.Root type="multiple" className={styles.root} {...props}>
      {children}
    </AccordionPrimitive.Root>
  );
}

interface MarkdownAccordionItemProps {
  title: string;
  value?: string;
  children: ReactNode;
}

export function MarkdownAccordionItem({
  title,
  value,
  children,
}: MarkdownAccordionItemProps) {
  const itemId = value ? value : title.toLowerCase().replace(/\s+/g, "-");
  const contentRef = useRef<HTMLDivElement>(null);

  // css for radixui data-state attribute (sometimes) doesn't render on change
  // this seems to cause rerender and apply the correct state
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-state"
        ) {
          const element = mutation.target as HTMLElement;
          const newState = element.getAttribute("data-state");
          console.log(newState);
        }
      });
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, { attributes: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <AccordionPrimitive.Item
      value={itemId}
      className={styles.item}
      ref={contentRef}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className={styles.trigger}>
          {title}
          <AngleDownIcon className={styles.chevron} />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className={styles.content}>
        <div className={styles["content-inner"]}>{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
