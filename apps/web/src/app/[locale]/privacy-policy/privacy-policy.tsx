"use client";

import { Hero, Section } from "@solana-foundation/solana-lib";
import ReactMarkdown from "react-markdown";

interface PrivacyPolicyPageProps {
  translations: {
    heroEyebrow: string;
    heroHeadline: string;
    heroBody: string;
    introBody: string;
    sections: {
      key: string;
      title: string;
      body: string;
    }[];
  };
}

const SECTION_IDS: Record<string, string> = {
  collection: "collection-of-information",
  use: "use-of-information",
  sharing: "sharing-of-information",
  analytics: "analytics",
  transfer: "transfer-of-information-to-the-united-states-and-other-countries",
  choices: "your-choices",
  california: "your-california-privacy-rights",
  europe: "additional-disclosures-for-individuals-in-europe",
  contact: "contact-us",
};

export function PrivacyPolicyPage({ translations }: PrivacyPolicyPageProps) {
  return (
    <>
      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={translations.heroEyebrow}
        headline={translations.heroHeadline}
        body={translations.heroBody}
      />

      <Section>
        <ReactMarkdown skipHtml={false}>{translations.introBody}</ReactMarkdown>
        {translations.sections.map((section) => (
          <div key={section.key}>
            <h3 id={SECTION_IDS[section.key]}>{section.title}</h3>
            <ReactMarkdown skipHtml={false}>{section.body}</ReactMarkdown>
          </div>
        ))}
      </Section>
    </>
  );
}
