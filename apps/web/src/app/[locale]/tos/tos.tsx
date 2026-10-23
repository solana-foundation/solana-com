"use client";

import { Hero, Section } from "@workspace/ui/landing";
import ReactMarkdown from "react-markdown";

interface TosPageProps {
  translations: {
    heroHeadline: string;
    content: string;
  };
}

export function TosPage({ translations }: TosPageProps) {
  return (
    <>
      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        headline={translations.heroHeadline}
      />

      <Section>
        <ReactMarkdown>{translations.content}</ReactMarkdown>
      </Section>
    </>
  );
}
