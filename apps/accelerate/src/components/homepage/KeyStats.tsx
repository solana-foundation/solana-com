"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getImagePath } from "@/config";

interface StatCard {
  value: string;
  label: string;
  variant: "outline" | "gradient";
}

const stats: StatCard[] = [
  {
    value: "3000+",
    label: "Builders, Executives, and Attendees",
    variant: "outline",
  },
  { value: "100+", label: "Fintech and Tech Companies", variant: "gradient" },
  { value: "20+", label: "Policymakers", variant: "outline" },
  { value: "50+", label: "Disruptive Crypto Startups", variant: "outline" },
];

function StatCardItem({ stat, index }: { stat: StatCard; index: number }) {
  const isGradient = stat.variant === "gradient";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center justify-between overflow-hidden rounded-[20px] px-6 py-6 md:px-10 md:py-10 ${
        isGradient
          ? "bg-accelerate-cta text-black"
          : "border border-accelerate-gray-dark"
      }`}
    >
      <span
        className={`text-[60px] font-light leading-none md:text-[90px] lg:text-[120px] ${
          isGradient ? "text-black" : "gradient-text"
        }`}
      >
        {stat.value}
      </span>
      <span
        className={`w-[140px] text-right text-[18px] font-normal leading-[1.1] md:w-[300px] md:text-[24px] lg:w-[400px] lg:text-[32px] ${
          isGradient ? "text-black" : "text-white"
        }`}
      >
        {stat.label}
      </span>
    </motion.div>
  );
}

export function KeyStats() {
  return (
    <section className="relative overflow-hidden bg-black py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <Image
          src={getImagePath("/images/homepage/acc-hero-bg.png")}
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-[1480px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6 md:gap-8"
        >
          <h3 className="text-[20px] font-normal uppercase leading-none tracking-[1.2px] text-[#8d8d8d] md:text-[24px]">
            Key Stats
          </h3>

          <div className="flex flex-col gap-4 md:gap-5">
            {stats.map((stat, i) => (
              <StatCardItem key={stat.value} stat={stat} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
