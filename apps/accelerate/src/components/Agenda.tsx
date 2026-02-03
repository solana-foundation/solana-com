"use client";

import { motion } from "framer-motion";
import agendaData from "@/data/agenda.json";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

interface Speaker {
  name?: string;
  title?: string;
  company?: string;
}

interface Session {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  type:
    | "keynote"
    | "panel"
    | "fireside"
    | "lightning"
    | "break"
    | "demo"
    | "closing";
  location: string;
  duration?: string;
  moderator?: Speaker;
  speakers: Speaker[];
}

function SessionTypeBadge({ type }: { type: Session["type"] }) {
  const badgeStyles: Record<
    Session["type"],
    { bg: string; text: string; label: string }
  > = {
    keynote: {
      bg: "bg-accelerate-purple/20",
      text: "text-accelerate-purple",
      label: "Keynote",
    },
    panel: {
      bg: "bg-accelerate-green/20",
      text: "text-accelerate-green",
      label: "Panel",
    },
    fireside: {
      bg: "bg-orange-500/20",
      text: "text-orange-400",
      label: "Fireside",
    },
    lightning: {
      bg: "bg-accelerate-cyan/20",
      text: "text-accelerate-cyan",
      label: "Lightning",
    },
    break: { bg: "bg-white/10", text: "text-white/60", label: "Break" },
    demo: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Demo" },
    closing: { bg: "bg-white/10", text: "text-white/60", label: "Closing" },
  };

  const style = badgeStyles[type];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

function SpeakerList({
  speakers,
  moderator,
}: {
  speakers: Speaker[];
  moderator?: Speaker;
}) {
  if (speakers.length === 0 && !moderator) return null;

  const formatSpeaker = (speaker: Speaker, prefix?: string) => {
    const parts = [];
    if (prefix) parts.push(prefix);
    if (speaker.name) parts.push(speaker.name);
    if (speaker.title && speaker.company) {
      parts.push(`(${speaker.title}, ${speaker.company})`);
    } else if (speaker.title) {
      parts.push(`(${speaker.title})`);
    } else if (speaker.company) {
      parts.push(`(${speaker.company})`);
    }
    return parts.join(" ");
  };

  return (
    <div className="mt-2 space-y-1">
      {moderator && (
        <p className="text-sm text-accelerate-green">
          <span className="font-medium">Moderator:</span>{" "}
          {formatSpeaker(moderator)}
        </p>
      )}
      {speakers.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {speakers.map((speaker, idx) => (
            <p key={idx} className="text-sm text-white/70">
              {speaker.name}
              {speaker.company && (
                <span className="text-white/50"> ({speaker.company})</span>
              )}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  const isBreak = session.type === "break" || session.type === "closing";

  return (
    <motion.div
      variants={fadeInUp}
      className={`group relative grid grid-cols-1 gap-4 border-b border-white/10 py-6 transition-colors last:border-b-0 md:grid-cols-[140px_1fr_100px] lg:grid-cols-[180px_1fr_120px] ${
        isBreak ? "bg-white/[0.02]" : "hover:bg-white/[0.02]"
      }`}
    >
      {/* Time */}
      <div className="flex items-start gap-3 md:flex-col md:gap-2">
        <p
          className={`font-space-grotesk text-base font-medium ${
            isBreak ? "text-white/40" : "text-accelerate-green"
          }`}
        >
          {session.time}
        </p>
        <div className="md:hidden">
          <SessionTypeBadge type={session.type} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex flex-wrap items-start gap-3">
          <h3
            className={`font-space-grotesk text-lg font-medium leading-tight ${
              isBreak ? "text-white/50" : "text-white"
            } lg:text-xl`}
          >
            {session.title}
          </h3>
          <div className="hidden md:block">
            <SessionTypeBadge type={session.type} />
          </div>
        </div>
        {session.subtitle && (
          <p className="mt-1 text-sm text-white/50">{session.subtitle}</p>
        )}
        {session.duration && (
          <p className="mt-1 text-xs text-accelerate-cyan">
            {session.duration}
          </p>
        )}
        <SpeakerList
          speakers={session.speakers}
          moderator={session.moderator}
        />
      </div>

      {/* Location */}
      <div className="hidden text-right md:block">
        <p className="text-sm text-white/40">{session.location}</p>
      </div>
    </motion.div>
  );
}

export function Agenda() {
  const { event, focusTopics, sessions } = agendaData;

  return (
    <section id="agenda" className="bg-black py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Focus Topics */}
          <motion.div variants={fadeInUp} className="mb-10 lg:mb-14">
            <h2 className="mb-4 font-space-grotesk text-h2 text-white/80">
              Focus Topics
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {focusTopics.map((topic) => (
                <motion.div
                  key={topic.title}
                  variants={fadeInUp}
                  className="rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20"
                >
                  <h3 className="gradient-text mb-1 font-space-grotesk text-base font-semibold">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-white/50">{topic.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="mb-8 border-t border-white/10 lg:mb-10" />

          {/* Schedule Header */}
          <motion.div
            variants={fadeInUp}
            className="mb-6 hidden border-b border-white/10 pb-4 md:grid md:grid-cols-[140px_1fr_100px] lg:grid-cols-[180px_1fr_120px]"
          >
            <p className="text-sm font-medium uppercase tracking-wider text-white/40">
              Time
            </p>
            <p className="text-sm font-medium uppercase tracking-wider text-white/40">
              Session
            </p>
            <p className="text-right text-sm font-medium uppercase tracking-wider text-white/40">
              Location
            </p>
          </motion.div>

          {/* Sessions */}
          <div>
            {(sessions as Session[]).map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>

          {/* MC Note */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 border-t border-white/10 pt-6"
          >
            <p className="text-sm text-white/50">
              <span className="font-medium text-white/70">MC:</span> {event.mc}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
