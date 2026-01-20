"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
  twitter?: string;
}

interface SpeakerCardProps {
  speaker: Speaker;
}

function XIcon() {
  return (
    <Image
      src="/images/x-social.svg"
      alt="X (Twitter)"
      width={31}
      height={31}
      className="opacity-60 transition-opacity hover:opacity-100"
    />
  );
}

function SpeakerCard({ speaker }: SpeakerCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative flex w-[300px] flex-shrink-0 flex-col gap-5 sm:w-[340px] lg:w-[380px]"
    >
      {/* Image - 380x380px with rounded corners */}
      <div className="relative h-[300px] w-full overflow-hidden rounded-[48px] bg-[#a0a0a0] sm:h-[340px] lg:h-[380px]">
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          className="object-cover grayscale"
        />
      </div>

      {/* Info - with left border */}
      <div className="flex flex-col gap-3 border-l border-accelerate-gray-300 pl-5">
        {/* Name - uppercase, multi-line */}
        <div
          className="text-h1 uppercase leading-none text-accelerate-purple"
          style={{
            fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          <p className="mb-0">{speaker.firstName}</p>
          <p>{speaker.lastName}</p>
        </div>

        {/* Company */}
        <p
          className="text-h2 text-white"
          style={{
            fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          {speaker.company}
        </p>

        {/* Title */}
        <p className="text-p text-accelerate-gray-muted">{speaker.title}</p>
      </div>

      {/* Twitter/X Icon - positioned at bottom right of card */}
      {speaker.twitter && (
        <a
          href={speaker.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-0 right-0 transition-transform hover:scale-110"
        >
          <XIcon />
        </a>
      )}
    </motion.div>
  );
}

export function Speakers() {
  const speakers: Speaker[] = [
    {
      name: "Lily Liu",
      firstName: "LILY",
      lastName: "LIU",
      title: "President",
      company: "Solana foundation",
      image: "/images/speakers/lily-liu.png",
      twitter: "https://twitter.com/calilyliu",
    },
    {
      name: "Chris Chung",
      firstName: "CHRIS",
      lastName: "CHUNG",
      title: "CEO & Co-Founder",
      company: "Titan",
      image: "/images/speakers/chris-chung.png",
      twitter: "https://twitter.com/cchung",
    },
    {
      name: "Shina Foo",
      firstName: "SHINA",
      lastName: "FOO",
      title: "Head of Growth",
      company: "Perena",
      image: "/images/speakers/shina-foo.png",
      twitter: "https://twitter.com/shinafoo",
    },
    {
      name: "Shawn Chain",
      firstName: "SHAWN",
      lastName: "CHAIN",
      title: "CEO",
      company: "Singapore Gulf Bank",
      image: "/images/speakers/shawn-chain.png",
      twitter: "https://twitter.com/shawnchain",
    },
  ];

  return (
    <section id="speakers" className="bg-black py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Header with arrow */}
          <div className="mb-12 flex items-end justify-between lg:mb-20">
            <motion.h2
              variants={fadeInUp}
              className="text-h1 text-accelerate-gray-100"
              style={{
                fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              }}
            >
              Speakers
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="hidden items-center gap-2 md:flex"
            >
              {/* Arrow icon pointing right */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                className="text-white/50"
              >
                <path
                  d="M8 28L28 8M28 8H12M28 8V24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>

          {/* Speaker Cards - horizontal scroll on mobile, 4 columns on desktop */}
          <div className="-mx-6 overflow-x-auto px-6 lg:mx-0 lg:overflow-visible lg:px-0">
            <div className="flex gap-6 lg:grid lg:grid-cols-4 lg:gap-[40px]">
              {speakers.map((speaker) => (
                <SpeakerCard key={speaker.name} speaker={speaker} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
