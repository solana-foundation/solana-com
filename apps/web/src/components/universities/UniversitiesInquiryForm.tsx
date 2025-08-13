"use client";

import React from "react";
import GradientOrbs, { OrbConfig } from "./GradientOrbs";

interface UniversitiesInquiryFormProps {
  translations: {
    eyebrowText: string;
    title: string;
    description: string;
    emailPlaceholder: string;
    submitButton: string;
  };
}

export default function UniversitiesInquiryForm({
  translations,
}: UniversitiesInquiryFormProps) {
  const handleEmailClick = () => {
    // TODO: Replace with Airtable/Typeform intake form URL
    window.location.href = "/universities/contact";
  };

  const inquiryOrbs: OrbConfig[] = [
    {
      position: { top: "-160px", right: "-160px" },
      size: "384px",
      color: "purple",
      opacity: 20,
      blur: 120,
    },
    {
      position: { bottom: "-160px", left: "-160px" },
      size: "384px",
      color: "green",
      opacity: 20,
      blur: 120,
    },
  ];

  return (
    <section className="[padding-block:1rem] sm:[padding-block:3rem] relative">
      <div className="container">
        <div className="bg-[#0a0a0a] rounded-2xl p-12 md:p-20 text-center max-w-6xl mx-auto relative overflow-hidden">
          <GradientOrbs orbs={inquiryOrbs} />

          {/* Additional gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-purple-900/20 pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-[#14F195] uppercase text-sm font-bold tracking-wider mb-4">
              {translations.eyebrowText}
            </p>
            <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
              {translations.title}
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              {translations.description}
            </p>

            <div className="max-w-2xl mx-auto">
              <button
                onClick={handleEmailClick}
                className="bg-[#9945FF] text-white font-semibold rounded-full px-8 py-4 hover:bg-[#7B3FF2] transition-colors duration-200 text-base uppercase tracking-wider"
              >
                {translations.submitButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
