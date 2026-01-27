"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useMemo } from "react";
import speakersData from "../data/speakers.json";
import { getImagePath } from "@/config";

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

interface Speaker {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  image: string;
}

function SmallSpeakerCard({ speaker }: { speaker: Speaker }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      className="group relative flex w-[140px] flex-shrink-0 flex-col gap-2 sm:w-[160px] sm:gap-3 lg:w-[180px]"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image - responsive sizes: 120px mobile, 140px tablet, 150px desktop */}
      <motion.div
        className="relative h-[120px] w-[120px] overflow-hidden rounded-2xl bg-[#a0a0a0] sm:h-[140px] sm:w-[140px] lg:h-[150px] lg:w-[150px]"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            filter: isHovered ? "grayscale(0%)" : "grayscale(100%)",
          }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={getImagePath(speaker.image)}
            alt={speaker.name}
            width={150}
            height={150}
            className="object-cover"
          />
        </motion.div>
        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-accelerate-purple/20 via-accelerate-green/10 to-accelerate-cyan/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Info */}
      <div className="relative flex w-[120px] flex-col gap-1.5 sm:w-[140px] sm:gap-2 lg:w-[150px]">
        {/* Name - uppercase, multi-line */}
        <motion.div
          className="text-[14px] uppercase leading-none sm:text-[16px] lg:text-[18px]"
          style={{
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
          animate={{
            color: isHovered ? "#19fb9b" : "#9945ff",
          }}
          transition={{ duration: 0.3 }}
        >
          <p className="mb-0">{speaker.firstName}</p>
          <p>{speaker.lastName}</p>
        </motion.div>

        {/* Company and Title */}
        <div className="flex flex-col gap-0.5 sm:gap-1">
          {/* Company */}
          <motion.p
            className="text-[12px] sm:text-[14px] lg:text-[16px]"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
            animate={{
              color: isHovered ? "#d2d2d2" : "#ffffff",
            }}
            transition={{ duration: 0.3 }}
          >
            {speaker.company}
          </motion.p>

          {/* Title */}
          <p className="text-xs text-white/80 sm:text-sm">{speaker.title}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Speakers() {
  return (
    <section id="speakers" className="bg-black py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <AllSpeakersSection />
        </motion.div>
      </div>
    </section>
  );
}

/** Display order for speakers (matches requested lineup). */
const SPEAKER_ORDER: string[] = [
  "lily-liu",
  "joseph-chee",
  "brian-smith",
  "austin-federa",
  "shayon-sengupta",
  "mark-greenberg",
  "shawn-chan",
  "steve-zeng",
  "joosik-lee",
  "david-rodriguez",
  "saeed-badreg",
  "ben-nadareski",
  "chef-kids",
  "gal-stern",
  "jiani-chen",
  "patrick-kim",
  "zheng-jie-lim",
  "chris-chung",
  "silvestre-ramos",
  "cheryl-chan",
  "dan-jablonski",
  "kevin-kang",
  "mable-jiang",
  "yuan-gao",
  "john-teo",
  "yaoyao-ding",
  "jessica-cao",
  "kevin-eum",
  "tracy-chow",
  "jae-kim",
  "abhi-bansal",
  "yuchen-song",
  "yash-agarwal",
  "vesper-a",
  "robin-nordnes",
  "duke-song",
  "james-zhang",
  "shina-foo",
  "chloe-lo",
];

function AllSpeakersSection() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter speakers, then sort by SPEAKER_ORDER; any not in the list go at the end
  const filteredSpeakers = useMemo(() => {
    const filtered = speakersData.speakers.filter((speaker) => {
      const matchesSearch =
        searchQuery === "" ||
        speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speaker.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speaker.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    const orderIndex = new Map(SPEAKER_ORDER.map((slug, i) => [slug, i]));
    return [...filtered].sort((a, b) => {
      const ai = orderIndex.get(a.slug) ?? SPEAKER_ORDER.length;
      const bi = orderIndex.get(b.slug) ?? SPEAKER_ORDER.length;
      return ai - bi;
    });
  }, [searchQuery]);

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
  };

  const hasActiveFilters = searchQuery !== "";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={stagger}
    >
      {/* Header: Speakers title left, search right */}
      <div className="mb-8 flex flex-col gap-6 lg:mb-12">
        <motion.div
          variants={fadeInUp}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <h2
            className="text-h1 text-accelerate-gray-100 shrink-0"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            Speakers
          </h2>
          {/* Search and Filter Bar */}
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:justify-end ">
            <div className="relative min-w-0 flex-1 sm:max-w-none md:max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search speakers, companies, or titles..."
                className="w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-11 text-white placeholder:text-white/40 focus:border-accelerate-purple/50 focus:outline-none focus:ring-2 focus:ring-accelerate-purple/30 transition-all sm:min-w-[280px]"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                }}
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              >
                <path
                  d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.5 17.5L13.875 13.875"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Gradient accent line */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accelerate-purple via-accelerate-green to-accelerate-cyan"
                initial={{ width: 0 }}
                animate={{ width: searchQuery ? "100%" : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Clear Filters Button */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearFilters}
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 transition-all hover:border-accelerate-purple/50 hover:bg-accelerate-purple/10 hover:text-white whitespace-nowrap"
                  style={{
                    fontFamily:
                      "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                  }}
                >
                  Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Clear Filters Link */}
        {hasActiveFilters && (
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-2 text-sm text-white/60"
          >
            <button
              onClick={clearFilters}
              className="text-accelerate-purple hover:text-accelerate-green transition-colors underline"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Divider */}
      <div className="mb-8 border-t border-white/10 lg:mb-10" />

      {/* Speaker Grid - Dynamic Layout */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {filteredSpeakers.length > 0 ? (
            <motion.div
              key="speakers-grid"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={stagger}
              className="flex flex-wrap justify-center gap-4 pb-8 sm:gap-5 lg:gap-6"
            >
              {filteredSpeakers.map((speaker, index) => (
                <motion.div
                  key={speaker.slug}
                  variants={fadeInUp}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.03 }}
                >
                  <SmallSpeakerCard speaker={speaker} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="py-16 text-center"
            >
              <p
                className="text-h3 text-white/60 mb-4"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                }}
              >
                No speakers found
              </p>
              <button
                onClick={clearFilters}
                className="text-accelerate-purple hover:text-accelerate-green transition-colors underline"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                }}
              >
                Clear filters to see all speakers
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
