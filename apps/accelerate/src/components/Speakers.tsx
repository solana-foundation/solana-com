"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
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
      className="group relative flex w-full flex-shrink-0 flex-col gap-2 sm:w-[160px] sm:gap-3 lg:w-[165px]"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image - full width on mobile, fixed sizes on tablet/desktop */}
      <motion.div
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#a0a0a0] sm:aspect-auto sm:h-[140px] sm:w-[140px] lg:h-[145px] lg:w-[145px]"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          className="h-full w-full"
          animate={{
            filter: isHovered ? "grayscale(0%)" : "grayscale(100%)",
          }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={getImagePath(speaker.image)}
            alt={speaker.name}
            width={400}
            height={400}
            className="h-full w-full object-cover"
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
      <div className="relative flex w-full flex-col gap-1.5 sm:w-[140px] sm:gap-2 lg:w-[145px]">
        {/* Name - uppercase, multi-line */}
        <motion.div
          className="text-[18px] uppercase leading-none sm:text-[16px] lg:text-[18px]"
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
            className="text-[16px] sm:text-[14px] lg:text-[16px]"
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
          <p className="text-sm text-white/80 sm:text-sm">{speaker.title}</p>
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

const MOBILE_INITIAL_COUNT = 10;

function AllSpeakersSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllMobile, setShowAllMobile] = useState(false);
  const t = useTranslations("accelerate.speakers");

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
            {t("heading")}
          </h2>
          {/* Search and Filter Bar */}
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:justify-end ">
            <div className="relative min-w-0 flex-1 sm:max-w-none md:max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
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
                  {t("clear")}
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
              {t("clearFilters")}
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
            <>
              {/* Desktop/Tablet: show all speakers */}
              <motion.div
                key="speakers-grid-desktop"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={stagger}
                className="hidden sm:grid sm:grid-cols-[repeat(auto-fill,160px)] sm:justify-center sm:gap-5 lg:grid-cols-[repeat(auto-fill,165px)] lg:gap-6 pb-8"
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

              {/* Mobile: show first 10, then accordion for rest */}
              <div className="sm:hidden">
                <motion.div
                  key="speakers-grid-mobile"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={stagger}
                  className="grid grid-cols-1 gap-6 pb-6"
                >
                  {filteredSpeakers
                    .slice(0, MOBILE_INITIAL_COUNT)
                    .map((speaker, index) => (
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

                {/* See All Button - only show if there are more speakers */}
                {filteredSpeakers.length > MOBILE_INITIAL_COUNT && (
                  <>
                    <AnimatePresence>
                      {showAllMobile && (
                        <motion.div
                          key="speakers-grid-mobile-expanded"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={stagger}
                            className="grid grid-cols-1 gap-6 pb-6"
                          >
                            {filteredSpeakers
                              .slice(MOBILE_INITIAL_COUNT)
                              .map((speaker, index) => (
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
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      onClick={() => setShowAllMobile(!showAllMobile)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-white transition-all hover:border-accelerate-purple/50 hover:bg-accelerate-purple/10"
                      style={{
                        fontFamily:
                          "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>
                        {showAllMobile
                          ? t("showLess")
                          : t("seeAll", { count: filteredSpeakers.length })}
                      </span>
                      <motion.svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{ rotate: showAllMobile ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    </motion.button>
                  </>
                )}
              </div>
            </>
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
                {t("noResults")}
              </p>
              <button
                onClick={clearFilters}
                className="text-accelerate-purple hover:text-accelerate-green transition-colors underline"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                }}
              >
                {t("clearFiltersToSeeAll")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
