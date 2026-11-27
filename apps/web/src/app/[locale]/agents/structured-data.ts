const SITE = "https://solana.com";

export type FaqEntry = { question: string; answer: string };

/** FAQPage JSON-LD for /agents, built from the same strings the page shows. */
export function buildAgentsFaqJsonLd({
  canonicalPath,
  faq,
}: {
  canonicalPath: string;
  faq: FaqEntry[];
}) {
  const url = new URL(canonicalPath, SITE).toString();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    mainEntity: faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
