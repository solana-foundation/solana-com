"use client";

import { useEffect, useState, type ElementType } from "react";
import slugify from "slugify";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Eyebrow, Section } from "./landing-shared";
import { HtmlParser } from "./landing-rich-text";

export interface LandingAccordionProps {
  accordions: { title: string; body: string }[];
  eyebrow?: string;
  headline?: string;
  headingAs?: ElementType;
}

const itemSlug = (title: string) => slugify(title, { lower: true });

export function LandingAccordion({
  accordions,
  eyebrow,
  headline,
  headingAs: H = "h2",
}: LandingAccordionProps) {
  const [open, setOpen] = useState("");

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const match = accordions?.find((item) => itemSlug(item.title) === hash);
    if (match) {
      setOpen(hash);
      window.requestAnimationFrame(() =>
        document
          .getElementById(`accordion-${hash}`)
          ?.scrollIntoView({ block: "center" }),
      );
    }
  }, [accordions]);

  function change(value: string) {
    setOpen(value);
    const url = new URL(window.location.href);
    url.hash = value
      ? itemSlug(
          accordions.find((item) => itemSlug(item.title) === value)?.title ||
            "",
        )
      : "";
    window.history.pushState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }

  return (
    <Section className="grid gap-8 md:gap-12 lg:grid-cols-12 lg:gap-20">
      {(eyebrow || headline) && (
        <div className="lg:col-span-5">
          {eyebrow && (
            <p className="mb-4">
              <Eyebrow>{eyebrow}</Eyebrow>
            </p>
          )}
          {headline && (
            <H className="text-4xl font-medium leading-tight md:text-5xl">
              {headline}
            </H>
          )}
        </div>
      )}
      <Accordion
        type="single"
        collapsible
        value={open}
        onValueChange={change}
        className={
          eyebrow || headline
            ? "lg:col-span-7"
            : "lg:col-span-10 lg:col-start-2"
        }
      >
        {accordions?.map((item, index) => {
          const slug = itemSlug(item.title);
          return (
            <AccordionItem
              key={`${slug}-${index}`}
              value={slug}
              id={`accordion-${slug}`}
              className="border-t border-white/20"
            >
              <AccordionTrigger className="py-6 text-left text-lg hover:text-[#14F195] hover:no-underline">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="text-base text-[#ABABBA]">
                <HtmlParser rawHtml={item.body} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Section>
  );
}
