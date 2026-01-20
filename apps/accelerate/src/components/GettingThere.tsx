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
      className="grid grid-cols-1 gap-4 border-b border-white/10 py-6 last:border-b-0 md:grid-cols-[200px_1fr]"
    >
      <p className="text-base text-white/50">{label}</p>
      <div>
        <p className="text-lg font-medium text-white">{value}</p>
        {subValue && (
          <p className="mt-2 text-base text-white/60">
            {subValue}
            {link && (
              <>
                {" "}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#14F195] hover:underline"
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
          <motion.h2
            variants={fadeInUp}
            className="mb-12 text-4xl font-bold text-white md:text-5xl"
          >
            Getting there
          </motion.h2>

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
