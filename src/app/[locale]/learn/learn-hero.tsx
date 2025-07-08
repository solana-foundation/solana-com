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
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex min-h-[500px] items-center py-20 md:py-24 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="text-lg leading-relaxed text-white md:text-xl">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
