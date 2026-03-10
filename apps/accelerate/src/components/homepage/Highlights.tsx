"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getImagePath } from "@/config";

export function Highlights() {
  return (
    <section className="relative bg-black py-16 lg:py-24">
      <div className="mx-auto max-w-[1480px] px-6">
        {/* Section heading - Space Grotesk Light 56px */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-[32px] font-light uppercase tracking-[2.5px] text-[#b3b2bc] md:text-[44px] lg:mb-14 lg:text-[50px]"
          style={{
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            lineHeight: 1,
          }}
        >
          Highlights
        </motion.h2>

        {/* Two-column layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-[145px]"
        >
          {/* Left - text + CTA */}
          <div className="flex flex-col gap-10">
            {/* Title text - Space Grotesk Regular 40px, with green highlight */}
            <p
              className="text-[25px] font-normal uppercase leading-[1.1] tracking-[1.25px] text-[#d2d2d2] md:text-[34px] lg:w-[605px] lg:text-[40px]"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              }}
            >
              Watch the recordings from Accelerate APAC{" "}
              <span className="text-[#19fb9b]">Hong Kong 2026</span>
            </p>

            {/* Watch Now CTA - gradient button */}
            <a
              href="https://www.youtube.com/playlist?list=PLilwLeBwGuK4EO5mZ7IDM1zZApataXukG"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[48px] w-[208px] items-center justify-between rounded-[32px] px-5 py-[17.9px] md:h-[66px] md:w-[240px] md:px-7 md:py-6"
              style={{
                background: "linear-gradient(to right, #9945FF, #19FB9B)",
              }}
            >
              <span
                className="text-[13.43px] font-semibold uppercase tracking-[0.67px] text-black md:text-[18px] md:tracking-[0.9px]"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                  lineHeight: 1,
                }}
              >
                Watch Now
              </span>
              <Image
                src={getImagePath("/images/homepage/cta-arrow.svg")}
                alt=""
                width={12}
                height={12}
              />
            </a>
          </div>

          {/* Right - event photo */}
          <div className="relative h-[308px] w-[350px] overflow-hidden rounded-[10px] md:h-[340px] md:w-full lg:h-[410px] lg:w-[730px] lg:flex-shrink-0 lg:rounded-[20px]">
            <Image
              src={getImagePath("/images/homepage/highlights-photo.jpg")}
              alt="Accelerate APAC Hong Kong 2026 highlights"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
