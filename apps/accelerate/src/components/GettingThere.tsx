"use client";

import { motion } from "framer-motion";
import { Plane, Hotel, MapPin } from "lucide-react";

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

interface TransportOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
}

function TransportCard({ option }: { option: TransportOption }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accelerate-purple/20 text-accelerate-purple">
        {option.icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{option.title}</h3>
      <p className="mb-4 text-sm text-white/60">{option.description}</p>
      <ul className="space-y-2">
        {option.details.map((detail, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-white/70"
          >
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accelerate-green" />
            {detail}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function GettingThere() {
  const transportOptions: TransportOption[] = [
    {
      icon: <Plane className="h-6 w-6" />,
      title: "By Air",
      description: "Hong Kong International Airport (HKG)",
      details: [
        "Airport Express to Hong Kong Station (24 min)",
        "Taxi to venue (~45 min, ~HK$300)",
        "MTR from Airport to Wan Chai (~1 hour)",
      ],
    },
    {
      icon: <Hotel className="h-6 w-6" />,
      title: "Accommodation",
      description: "Hotels near the venue",
      details: [
        "Grand Hyatt Hong Kong (adjacent to venue)",
        "Renaissance Hong Kong Harbour View Hotel",
        "Novotel Century Hong Kong",
        "Many options within walking distance",
      ],
    },
  ];

  return (
    <section id="getting-there" className="section bg-accelerate-dark">
      <div className="container-accelerate">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp} className="heading-lg mb-8 text-white">
            Getting there
          </motion.h2>

          {/* Venue info */}
          <motion.div
            variants={fadeInUp}
            className="mb-12 flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:flex-row md:items-center"
          >
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-accelerate-purple/20 text-accelerate-purple">
              <MapPin className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-xl font-semibold text-white">
                Hong Kong Convention and Exhibition Centre
              </h3>
              <p className="text-white/60">
                1 Harbour Road, Wan Chai, Hong Kong
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Hong+Kong+Convention+and+Exhibition+Centre"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary whitespace-nowrap"
            >
              Open in Maps
            </a>
          </motion.div>

          {/* Transport options */}
          <div className="grid gap-6 md:grid-cols-2">
            {transportOptions.map((option) => (
              <TransportCard key={option.title} option={option} />
            ))}
          </div>

          {/* Local transport */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-white">
              Local Transportation
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="mb-2 font-medium text-white">MTR (Subway)</p>
                <p className="text-sm text-white/60">
                  Wan Chai Station (Exit A5) - 5 min walk to venue
                </p>
              </div>
              <div>
                <p className="mb-2 font-medium text-white">Bus</p>
                <p className="text-sm text-white/60">
                  Multiple bus routes stop at the HKCEC
                </p>
              </div>
              <div>
                <p className="mb-2 font-medium text-white">Taxi / Ride-share</p>
                <p className="text-sm text-white/60">
                  Uber and local taxis widely available
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
