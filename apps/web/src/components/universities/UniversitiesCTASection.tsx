"use client";

import React from "react";
import Button from "@/components/shared/Button";
import GradientOrbs, { orbPresets } from "./GradientOrbs";
import { UNIVERSITY_TYPEFORM_URL } from "@/constants/universities";

interface UniversitiesCTASectionProps {
  translations: {
    eyebrowText: string;
    title: string;
    description: string;
    ctaLabel: string;
  };
  ctaUrl?: string;
}

export default function UniversitiesCTASection({
  translations,
  ctaUrl,
}: UniversitiesCTASectionProps) {
  return (
    <section className="[padding-block:1rem] sm:[padding-block:3rem] relative overflow-hidden">
      <GradientOrbs orbs={[orbPresets.topLeftGreen]} />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-green-400">
              {translations.eyebrowText}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {translations.title}
          </h2>

          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            {translations.description}
          </p>

          {/* @ts-expect-error button has no props? */}
          <Button
            to={ctaUrl || UNIVERSITY_TYPEFORM_URL}
            variant="secondary"
            size="large"
            newTab={!ctaUrl}
          >
            {translations.ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
