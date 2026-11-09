"use client";

import { Section } from "@workspace/ui/landing";
import ReactMarkdown from "react-markdown";

interface RpcPageProps {
  translations: {
    content: string;
  };
}

export function RpcPage({ translations }: RpcPageProps) {
  return (
    <Section>
      <div className="min-w-0 max-w-full overflow-x-auto">
        <ReactMarkdown>{translations.content}</ReactMarkdown>
      </div>
    </Section>
  );
}
