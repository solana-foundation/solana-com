"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WhatIsX402PageProps {
  translations: {
    title: string;
    description: string;
    httpSectionTitle: string;
    httpSectionContent: string;
    solanaSectionTitle: string;
    solanaSectionContent: string;
    agentEconomySectionTitle: string;
    agentEconomySectionContent: string;
    communitySectionTitle: string;
    communitySectionContent: string;
    useCasesTitle: string;
    useCasesList: string[];
    ctaText: string;
    ctaButton: string;
  };
}

export function WhatIsX402Page({ translations }: WhatIsX402PageProps) {
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
                {/* HTTP 402 Section */}
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {translations.httpSectionTitle}
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {translations.httpSectionContent}
                  </p>
                </section>

                {/* Solana Section */}
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {translations.solanaSectionTitle}
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {translations.solanaSectionContent}
                  </p>
                </section>

                {/* Agent Economy Section */}
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {translations.agentEconomySectionTitle}
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {translations.agentEconomySectionContent}
                  </p>
                </section>

                {/* Community Section */}
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {translations.communitySectionTitle}
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {translations.communitySectionContent}
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
                        <span className="text-[#14F195] mr-2">→</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-[#14F195]/10 to-[#9945FF]/10 rounded-xl p-6 md:p-8 mt-12">
                  <p className="text-lg md:text-xl text-gray-200 mb-4">
                    {translations.ctaText}
                  </p>
                  <Link href="/x402">
                    <Button
                      className="rounded-full text-base md:text-lg px-6 bg-[#14F195] text-black hover:!bg-[#14F195]/90"
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
