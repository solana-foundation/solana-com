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

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

interface EventDetailRowProps {
  label: string;
  value: string;
  subValue?: string;
}

function EventDetailRow({ label, value, subValue }: EventDetailRowProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="grid grid-cols-1 gap-4 border-b border-white/10 py-6 last:border-b-0 sm:grid-cols-[160px_1fr] md:grid-cols-[240px_1fr] lg:grid-cols-[360px_1fr]"
    >
      <p className="gradient-text text-h2 font-space-grotesk">{label}</p>
      <div>
        <p className="text-h2 font-space-grotesk text-accelerate-gray-100">
          {value}
        </p>
        {subValue && (
          <p className="mt-3 font-diatype text-p text-accelerate-green">
            {subValue}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function EventDetails() {
  return (
    <section id="event-details" className="bg-black py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Intro copy */}
          <motion.div
            variants={stagger}
            className="mx-auto mb-10 max-w-4xl lg:mb-14"
          >
            <motion.p
              variants={fadeInUp}
              className="mb-6 font-space-grotesk text-h4 text-accelerate-gray-100"
            >
              Join us as we bring together founders, institutions, policymakers,
              and innovators to amplify the region&apos;s momentum and showcase
              the future of internet capital markets on Solana.
            </motion.p>
            <dl className="space-y-0">
              {[
                {
                  title: "Payments",
                  desc: "Real-world adoption and next-gen payment rails.",
                },
                {
                  title: "Retail Access",
                  desc: "Empowering the next 100M users in the digital economy.",
                },
                {
                  title: "Institutional Finance",
                  desc: "Asset managers, banks, and the acceleration of tokenization.",
                },
                {
                  title: "Infrastructure",
                  desc: "The tech stack powering APAC's digital asset future.",
                },
                {
                  title: "Sell The Asset",
                  desc: "How SOL Staking ETFs and DATs are unlocking global adoption.",
                },
              ].map(({ title, desc }, index) => (
                <motion.div
                  key={title}
                  variants={listItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  whileHover={{
                    x: 8,
                    backgroundColor: "rgba(255,255,255,0.02)",
                  }}
                  className="grid cursor-default grid-cols-1 gap-4 border-b border-white/10 py-6 transition-colors last:border-b-0 sm:grid-cols-[160px_1fr] md:grid-cols-[240px_1fr] lg:grid-cols-[360px_1fr]"
                >
                  <dt className="gradient-text font-space-grotesk text-h2">
                    {title}
                  </dt>
                  <dd className="font-diatype text-p leading-relaxed text-white/50">
                    {desc}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
          {/* Section heading */}
          <motion.h2
            variants={fadeInUp}
            className="text-h1 mb-8 font-space-grotesk text-accelerate-gray-100 lg:mb-12"
          >
            Event details
          </motion.h2>

          {/* Divider line */}
          <div className="mb-8 border-t border-white/10 lg:mb-10" />

          <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-[80px]">
            {/* Details list */}
            <div className="order-1 md:order-1">
              <EventDetailRow label="Date" value="11 February 2026" />
              <EventDetailRow
                label="Venue"
                value="Hong Kong Convention and Exhibition Centre"
                subValue="1號 Expo Dr, Wan Chai, Hong Kong"
              />
              <EventDetailRow label="Time" value="9:00 AM GMT+8" />
            </div>

            {/* Embedded Map - Hong Kong Convention and Exhibition Centre */}
            <motion.div
              variants={fadeInUp}
              className="relative order-2 aspect-[4/3] -mx-6 w-[calc(100%+3rem)] overflow-hidden border-0 md:mx-0 md:w-full md:aspect-[3/4] md:border md:border-white/10 lg:aspect-[600/500] lg:h-[500px]"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.8397711851847!2d114.17165037620083!3d22.28168794388889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340400f2e9a4e90d%3A0x55e8d8b5ddad5e1c!2sHong%20Kong%20Convention%20and%20Exhibition%20Centre!5e0!3m2!1sen!2shk!4v1705900000000!5m2!1sen!2shk&maptype=roadmap&style=feature:all|element:geometry|color:0x242f3e&style=feature:all|element:labels.text.stroke|color:0x242f3e&style=feature:all|element:labels.text.fill|color:0x746855&style=feature:water|element:geometry|color:0x17263c&style=feature:water|element:labels.text.fill|color:0x515c6d"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hong Kong Convention and Exhibition Centre - 1號 Expo Dr, Wan Chai, Hong Kong"
                className="absolute inset-0 h-full w-full"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
