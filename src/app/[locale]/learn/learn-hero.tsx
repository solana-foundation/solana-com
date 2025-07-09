"use client";

import React from "react";
import Image from "next/image";
import learnHeroImage from "../../../../assets/learn/learn-hero.webp";

interface LearnHeroProps {
  title: string;
  subtitle: string;
}

export default function LearnHero({ title, subtitle }: LearnHeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      aria-label="Learn about Solana hero section"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={learnHeroImage}
          alt="Solana learning resources background"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex min-h-[300px] items-center py-12 md:py-16 lg:py-20">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="text-base leading-relaxed text-white md:text-lg">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
