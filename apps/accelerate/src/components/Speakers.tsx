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
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white/60 transition-colors hover:text-white"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SpeakerCard({ speaker }: SpeakerCardProps) {
  return (
    <motion.div variants={fadeInUp} className="group">
      {/* Image */}
      <div className="relative mb-6 aspect-square overflow-hidden rounded-3xl bg-gray-500">
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          className="object-cover grayscale"
        />
      </div>

      {/* Info */}
      <div className="px-2">
        <h3 className="mb-4 text-3xl font-bold uppercase leading-tight tracking-tight text-white md:text-4xl">
          {speaker.name.split(" ").map((word, i) => (
            <span key={i} className="block">
              {word}
            </span>
          ))}
        </h3>
        <p className="mb-2 text-lg text-white/70">{speaker.company}</p>
        <div className="flex items-center justify-between">
          <p className="text-base text-white/50">{speaker.title}</p>
          {speaker.twitter && (
            <a
              href={speaker.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <XIcon />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Speakers() {
  const speakers: Speaker[] = [
    {
      name: "Lily Liu",
      title: "President",
      company: "Solana Foundation",
      image: "/images/speakers/lily-liu.png",
      twitter: "https://twitter.com/calilyliu",
    },
    {
      name: "Chris Chung",
      title: "CEO & Co-Founder",
      company: "Titan",
      image: "/images/speakers/chris-chung.png",
      twitter: "https://twitter.com/cchung",
    },
    {
      name: "Shina Foo",
      title: "Head of Growth",
      company: "Perena",
      image: "/images/speakers/shina-foo.png",
      twitter: "https://twitter.com/shinafoo",
    },
    {
      name: "Shawn Chain",
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
          <div className="mb-12 flex items-end justify-between">
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-bold text-white md:text-5xl"
            >
              Speakers
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="hidden items-center gap-2 md:flex"
            >
              <span className="text-sm text-white/50">More speakers coming soon</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="rotate-45"
              >
                <path
                  d="M2 10L10 2M10 2H4M10 2V8"
                  stroke="white"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4 lg:gap-10">
            {speakers.map((speaker) => (
              <SpeakerCard key={speaker.name} speaker={speaker} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
