"use client";

import { Section } from "@solana-foundation/solana-lib";
import ReactMarkdown from "react-markdown";

interface RpcPageProps {
  translations: {
    content: string;
  };
}

export function RpcPage({ translations }: RpcPageProps) {
  return (
    <Section>
      <div className="tw-html_parser">
        <ReactMarkdown>{translations.content}</ReactMarkdown>
      </div>
    </Section>
  );
}
