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
                  title="Finance"
                  description="Master the essentials of Solana with these no code learning"
                  icon={<DollarSign size={32} strokeWidth={1.5} />}
                  href="/universities/finance"
                />
                <UniversitiesSubjectCard
                  title="Legal"
                  description="Master the essentials of Solana with these no code learning"
                  icon={<Book size={32} strokeWidth={1.5} />}
                  href="/universities/legal"
                />
                <UniversitiesSubjectCard
                  title="Technology"
                  description="Master the essentials of Solana with these no code learning"
                  icon={<Monitor size={32} strokeWidth={1.5} />}
                  href="/universities/technology"
                />
                <UniversitiesSubjectCard
                  title="Business"
                  description="Master the essentials of Solana with these no code learning"
                  icon={<BarChart2 size={32} strokeWidth={1.5} />}
                  href="/universities/business"
                />
                <UniversitiesSubjectCard
                  title="Economics"
                  description="Master the essentials of Solana with these no code learning"
                  icon={<TrendingUp size={32} strokeWidth={1.5} />}
                  href="/universities/economics"
                />
                <UniversitiesSubjectCard
                  title="Engineering"
                  description="Master the essentials of Solana with these no code learning"
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
