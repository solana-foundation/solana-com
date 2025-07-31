"use client";

import React, { useState } from "react";

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
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log("Form submitted with email:", email);
  };

  return (
    <section className="py-20 md:py-32 relative">
      <div className="container">
        <div className="bg-[#0a0a0a] rounded-2xl p-12 md:p-20 text-center max-w-6xl mx-auto relative overflow-hidden">
          {/* Gradient background effects */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500/20 rounded-full blur-[120px]"></div>

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
            <p className="text-gray-400 text-lg mb-10">
              {translations.description}
            </p>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="relative flex items-center bg-[#1a1a1a] border border-gray-700 rounded-full p-1.5 focus-within:border-purple-500 transition-all duration-200">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={translations.emailPlaceholder}
                  className="bg-transparent text-white placeholder-gray-500 px-6 py-2 focus:outline-none flex-1 text-base"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#9945FF] text-white font-semibold rounded-full px-6 py-2.5 hover:bg-[#7B3FF2] transition-colors duration-200 text-sm uppercase tracking-wider"
                >
                  {translations.submitButton}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
