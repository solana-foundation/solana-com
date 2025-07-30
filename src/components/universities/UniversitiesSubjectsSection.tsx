"use client";

import React from "react";
import Button from "@/components/shared/Button";
import CarouselCards from "@/components/shared/CarouselCards";
import UniversitiesSubjectCard from "./UniversitiesSubjectCard";
import {
  DollarSign,
  Book,
  Monitor,
  BarChart2,
  TrendingUp,
  Settings,
} from "react-feather";

interface UniversitiesSubjectsSectionProps {
  translations: {
    title: string;
    description: string;
    emailButtonLabel: string;
    learnMore: string;
    cards: {
      finance: {
        title: string;
        description: string;
      };
      legal: {
        title: string;
        description: string;
      };
      technology: {
        title: string;
        description: string;
      };
      business: {
        title: string;
        description: string;
      };
      economics: {
        title: string;
        description: string;
      };
      engineering: {
        title: string;
        description: string;
      };
    };
  };
}

export default function UniversitiesSubjectsSection({
  translations,
}: UniversitiesSubjectsSectionProps) {
  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <div className="max-w-5xl mx-auto mb-12">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-8 lg:mb-0">
                {translations.title}
              </h2>
            </div>
            <div className="col-12 col-lg-6">
              <p className="text-lg text-gray-400 mb-8">
                {translations.description}
              </p>
              {/* @ts-ignore */}
              <Button
                to="#"
                variant="outline"
                size="large"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  // TODO: Implement email form modal
                  console.log("Email form clicked");
                }}
              >
                {translations.emailButtonLabel}
              </Button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="px-0 mx-n3">
              <CarouselCards>
                <UniversitiesSubjectCard
                  title={translations.cards.finance.title}
                  description={translations.cards.finance.description}
                  learnMore={translations.learnMore}
                  icon={<DollarSign size={32} strokeWidth={1.5} />}
                  href="/universities/finance"
                />
                <UniversitiesSubjectCard
                  title={translations.cards.legal.title}
                  description={translations.cards.legal.description}
                  learnMore={translations.learnMore}
                  icon={<Book size={32} strokeWidth={1.5} />}
                  href="/universities/legal"
                />
                <UniversitiesSubjectCard
                  title={translations.cards.technology.title}
                  description={translations.cards.technology.description}
                  learnMore={translations.learnMore}
                  icon={<Monitor size={32} strokeWidth={1.5} />}
                  href="/universities/technology"
                />
                <UniversitiesSubjectCard
                  title={translations.cards.business.title}
                  description={translations.cards.business.description}
                  learnMore={translations.learnMore}
                  icon={<BarChart2 size={32} strokeWidth={1.5} />}
                  href="/universities/business"
                />
                <UniversitiesSubjectCard
                  title={translations.cards.economics.title}
                  description={translations.cards.economics.description}
                  learnMore={translations.learnMore}
                  icon={<TrendingUp size={32} strokeWidth={1.5} />}
                  href="/universities/economics"
                />
                <UniversitiesSubjectCard
                  title={translations.cards.engineering.title}
                  description={translations.cards.engineering.description}
                  learnMore={translations.learnMore}
                  icon={<Settings size={32} strokeWidth={1.5} />}
                  href="/universities/engineering"
                />
              </CarouselCards>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
