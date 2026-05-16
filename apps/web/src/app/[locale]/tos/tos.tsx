"use client";

import { Hero, Section } from "@solana-foundation/solana-lib";
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
