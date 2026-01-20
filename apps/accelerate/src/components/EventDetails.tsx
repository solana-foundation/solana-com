"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

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

interface EventDetailRowProps {
  label: string;
  value: string;
  subValue?: string;
}

function EventDetailRow({ label, value, subValue }: EventDetailRowProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="grid grid-cols-1 gap-4 border-b border-black/10 py-6 last:border-b-0 sm:grid-cols-[140px_1fr] lg:grid-cols-[360px_1fr]"
    >
      <p
        className="text-h2 text-black/50"
        style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
      >
        {label}
      </p>
      <div>
        <p
          className="text-h2 text-black"
          style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
        >
          {value}
        </p>
        {subValue && (
          <p className="mt-3 text-p text-black/60">{subValue}</p>
        )}
      </div>
    </motion.div>
  );
}

export function EventDetails() {
  return (
    <section id="event-details" className="bg-white py-20 lg:py-28">
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
            className="text-h1 mb-12 text-black lg:mb-20"
            style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
          >
            Event details
          </motion.h2>

          {/* Divider line */}
          <div className="mb-12 border-t border-black/10 lg:mb-20" />

          <div className="grid gap-10 lg:grid-cols-[800px_1fr] lg:gap-[80px]">
            {/* Details list */}
            <div>
              <EventDetailRow label="Date" value="February 11, 2026" />
              <EventDetailRow
                label="Venue"
                value="Hong Kong Convention and Exhibition Centre"
                subValue="1號 Expo Dr, Wan Chai, Hong Kong"
              />
              <EventDetailRow label="Time" value="9:00 AM GMT+8" />
              <EventDetailRow label="Tickets:" value="Starting at $99" />
            </div>

            {/* Map placeholder */}
            <motion.div
              variants={fadeInUp}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/10 bg-[#f5f5f5] lg:aspect-auto lg:h-[732px] lg:w-[600px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/5">
                    <MapPin className="h-8 w-8 text-black/40" />
                  </div>
                  <p
                    className="text-h1 uppercase text-black/60"
                    style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
                  >
                    EMBEDDED MAP
                  </p>
                </div>
              </div>
              {/* Map background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
