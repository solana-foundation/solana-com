"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "3000+", label: "Builders, Executives, and Attendees" },
  { value: "100+", label: "Fintech and Tech Companies" },
  { value: "20+", label: "Policymakers" },
  { value: "50+", label: "Disruptive Crypto Startups" },
];

export function KeyStats() {
  return (
    <section className="relative bg-black py-16 lg:py-24">
      <div className="mx-auto max-w-[1480px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8"
        >
          <h3 className="text-[24px] font-normal leading-[1.1] text-accelerate-gray-100 md:text-[30px]">
            Key Stats
          </h3>

          <div className="flex flex-col md:w-[800px]">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between border-b border-accelerate-gray-dark py-5 md:py-6"
              >
                <span className="text-[40px] font-light leading-none text-accelerate-gray-dark md:text-[60px]">
                  {stat.value}
                </span>
                <span className="w-[200px] text-right text-[20px] font-normal leading-[1.1] text-white md:w-[440px] md:text-left md:text-[32px]">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
