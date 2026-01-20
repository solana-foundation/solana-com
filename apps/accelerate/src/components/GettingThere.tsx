"use client";

import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface InfoRowProps {
  label: string;
  value: string;
  subValue?: string;
  link?: {
    text: string;
    href: string;
  };
}

function InfoRow({ label, value, subValue, link }: InfoRowProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="grid grid-cols-1 gap-4 border-b border-white/10 py-6 last:border-b-0 lg:grid-cols-[360px_1fr]"
    >
      <p
        className="gradient-text text-h2"
        style={{
          fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
        }}
      >
        {label}
      </p>
      <div>
        <p
          className="text-h2 text-white"
          style={{
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          {value}
        </p>
        {subValue && (
          <p className="text-p mt-3 text-accelerate-green">
            {subValue}
            {link && (
              <>
                {" "}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accelerate-green underline hover:no-underline"
                >
                  {link.text}
                </a>
              </>
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function GettingThere() {
  return (
    <section id="getting-there" className="bg-black py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Section heading */}
          <motion.h2
            variants={fadeInUp}
            className="text-h1 mb-12 text-accelerate-gray-100 lg:mb-20"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            Getting there
          </motion.h2>

          {/* Divider line */}
          <div className="mb-12 border-t border-white/10 lg:mb-8" />

          <div className="mx-auto max-w-4xl">
            <InfoRow
              label="Nearest Airport"
              value="Hong Kong International Airport (HKG)"
            />
            <InfoRow
              label="Accommodations"
              value="Grand Hyatt Hong Kong"
              subValue="Consensus is offering discounted hotel rates."
              link={{
                text: "View details here.",
                href: "#",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
