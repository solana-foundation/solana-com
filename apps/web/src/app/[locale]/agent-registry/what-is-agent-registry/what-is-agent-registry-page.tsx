"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WhatIsAgentRegistryPageProps {
  translations: {
    title: string;
    description: string;
    identitySectionTitle: string;
    identitySectionContent: string;
    reputationSectionTitle: string;
    reputationSectionContent: string;
    validationSectionTitle: string;
    validationSectionContent: string;
    whySolanaSectionTitle: string;
    whySolanaSectionContent: string;
    useCasesTitle: string;
    useCasesList: string[];
    ctaText: string;
    ctaButton: string;
  };
}

export function WhatIsAgentRegistryPage({
  translations,
}: WhatIsAgentRegistryPageProps) {
  return (
    <div className="container-fluid py-8 md:py-12 bg-black text-white">
      <div className="container">
        <div className="relative flex justify-center">
          <main className="w-full max-w-4xl px-4">
            <article role="article" aria-labelledby="article-title">
              <header className="mb-8 md:mb-12">
                <h1
                  id="article-title"
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6"
                >
                  {translations.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300">
                  {translations.description}
                </p>
              </header>

              <div className="prose prose-lg prose-invert max-w-none space-y-8 md:space-y-12">
                {/* Identity Registry Section */}
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {translations.identitySectionTitle}
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {translations.identitySectionContent}
                  </p>
                </section>

                {/* Reputation Registry Section */}
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {translations.reputationSectionTitle}
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {translations.reputationSectionContent}
                  </p>
                </section>

                {/* Validation Registry Section */}
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {translations.validationSectionTitle}
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {translations.validationSectionContent}
                  </p>
                </section>

                {/* Why Solana Section */}
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {translations.whySolanaSectionTitle}
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {translations.whySolanaSectionContent}
                  </p>
                </section>

                {/* Use Cases Section */}
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {translations.useCasesTitle}
                  </h2>
                  <ul className="space-y-3 text-gray-300 text-lg">
                    {translations.useCasesList.map((useCase, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#9945FF] mr-2">&rarr;</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 rounded-xl p-6 md:p-8 mt-12">
                  <p className="text-lg md:text-xl text-gray-200 mb-4">
                    {translations.ctaText}
                  </p>
                  <Link href="/agent-registry">
                    <Button
                      className="rounded-full text-base md:text-lg px-6 bg-[#9945FF] text-white hover:!bg-[#9945FF]/90"
                      size="lg"
                    >
                      {translations.ctaButton}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </section>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
