"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Twitter, Linkedin } from "lucide-react";

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
  linkedin?: string;
}

interface SpeakerCardProps {
  speaker: Speaker;
}

function SpeakerCard({ speaker }: SpeakerCardProps) {
  return (
    <motion.div variants={fadeInUp} className="speaker-card group text-center">
      <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full border-2 border-white/10 transition-colors group-hover:border-accelerate-purple">
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          className="object-cover grayscale transition-all group-hover:grayscale-0"
        />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-white">{speaker.name}</h3>
      <p className="text-sm text-accelerate-purple">{speaker.title}</p>
      <p className="mb-3 text-sm text-white/60">{speaker.company}</p>
      <div className="flex justify-center gap-3">
        {speaker.twitter && (
          <a
            href={speaker.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 transition-colors hover:text-white"
          >
            <Twitter className="h-4 w-4" />
          </a>
        )}
        {speaker.linkedin && (
          <a
            href={speaker.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 transition-colors hover:text-white"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
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
      image: "/images/speakers/lily-liu.jpg",
      twitter: "https://twitter.com/calilyliu",
    },
    {
      name: "Chris Chung",
      title: "CEO",
      company: "Titan",
      image: "/images/speakers/chris-chung.jpg",
      twitter: "https://twitter.com/cchung",
    },
    {
      name: "Shira Rozi",
      title: "CEO",
      company: "Parcoca",
      image: "/images/speakers/shira-rozi.jpg",
      twitter: "https://twitter.com/shirarozi",
    },
    {
      name: "Shawn Chan",
      title: "Co-founder",
      company: "Singapore Gulf Bank",
      image: "/images/speakers/shawn-chan.jpg",
      linkedin: "https://linkedin.com/in/shawnchan",
    },
  ];

  return (
    <section id="speakers" className="section bg-accelerate-dark">
      <div className="container-accelerate">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp} className="heading-lg mb-4 text-white">
            Speakers
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mb-12 max-w-2xl text-white/60"
          >
            Learn from industry leaders and pioneers building the future of
            decentralized technology.
          </motion.p>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
            {speakers.map((speaker) => (
              <SpeakerCard key={speaker.name} speaker={speaker} />
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <p className="text-sm text-white/50">
              More speakers to be announced soon.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
