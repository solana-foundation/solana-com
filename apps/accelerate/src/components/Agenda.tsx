"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
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

function SessionTypeBadge({
  type,
  label,
}: {
  type: Session["type"];
  label: string;
}) {
  const badgeColors: Record<Session["type"], { bg: string; text: string }> = {
    keynote: {
      bg: "bg-accelerate-purple/20",
      text: "text-accelerate-purple",
    },
    panel: {
      bg: "bg-accelerate-green/20",
      text: "text-accelerate-green",
    },
    fireside: {
      bg: "bg-orange-500/20",
      text: "text-orange-400",
    },
    lightning: {
      bg: "bg-accelerate-cyan/20",
      text: "text-accelerate-cyan",
    },
    break: { bg: "bg-white/10", text: "text-white/60" },
    demo: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
    closing: { bg: "bg-white/10", text: "text-white/60" },
  };

  const style = badgeColors[type];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${style.bg} ${style.text}`}
    >
      {label}
    </span>
  );
}

function SpeakerList({
  speakers,
  moderator,
  moderatorLabel,
}: {
  speakers: Speaker[];
  moderator?: Speaker;
  moderatorLabel: string;
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
          <span className="font-medium">{moderatorLabel}</span>{" "}
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

function SessionCard({
  session,
  typeLabels,
  moderatorLabel,
}: {
  session: Session;
  typeLabels: Record<string, string>;
  moderatorLabel: string;
}) {
  const isBreak = session.type === "break" || session.type === "closing";

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
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
          <SessionTypeBadge
            type={session.type}
            label={typeLabels[session.type] ?? session.type}
          />
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
            <SessionTypeBadge
              type={session.type}
              label={typeLabels[session.type] ?? session.type}
            />
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
          moderatorLabel={moderatorLabel}
        />
      </div>

      {/* Location */}
      <div className="hidden text-right md:block">
        <p className="text-sm text-white/40">{session.location}</p>
      </div>
    </motion.div>
  );
}

const SESSION_TYPES: Session["type"][] = [
  "keynote",
  "panel",
  "fireside",
  "lightning",
  "demo",
  "break",
  "closing",
];

function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedTypes,
  toggleType,
  clearFilters,
  hasActiveFilters,
  typeLabels,
  searchPlaceholder,
  filterByTypeLabel,
  clearLabel,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTypes: Session["type"][];
  toggleType: (type: Session["type"]) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  typeLabels: Record<string, string>;
  searchPlaceholder: string;
  filterByTypeLabel: string;
  clearLabel: string;
}) {
  const badgeStyles: Record<
    Session["type"],
    { bg: string; text: string; activeBg: string }
  > = {
    keynote: {
      bg: "bg-accelerate-purple/10 hover:bg-accelerate-purple/20",
      activeBg: "bg-accelerate-purple/30 ring-1 ring-accelerate-purple/50",
      text: "text-accelerate-purple",
    },
    panel: {
      bg: "bg-accelerate-green/10 hover:bg-accelerate-green/20",
      activeBg: "bg-accelerate-green/30 ring-1 ring-accelerate-green/50",
      text: "text-accelerate-green",
    },
    fireside: {
      bg: "bg-orange-500/10 hover:bg-orange-500/20",
      activeBg: "bg-orange-500/30 ring-1 ring-orange-500/50",
      text: "text-orange-400",
    },
    lightning: {
      bg: "bg-accelerate-cyan/10 hover:bg-accelerate-cyan/20",
      activeBg: "bg-accelerate-cyan/30 ring-1 ring-accelerate-cyan/50",
      text: "text-accelerate-cyan",
    },
    demo: {
      bg: "bg-yellow-500/10 hover:bg-yellow-500/20",
      activeBg: "bg-yellow-500/30 ring-1 ring-yellow-500/50",
      text: "text-yellow-400",
    },
    break: {
      bg: "bg-white/5 hover:bg-white/10",
      activeBg: "bg-white/15 ring-1 ring-white/30",
      text: "text-white/60",
    },
    closing: {
      bg: "bg-white/5 hover:bg-white/10",
      activeBg: "bg-white/15 ring-1 ring-white/30",
      text: "text-white/60",
    },
  };

  return (
    <motion.div variants={fadeInUp} className="mb-8 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] py-3 pl-11 pr-10 text-white placeholder-white/40 transition-colors focus:border-accelerate-green/50 focus:outline-none focus:ring-1 focus:ring-accelerate-green/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/70"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-white/40">{filterByTypeLabel}</span>
        {SESSION_TYPES.map((type) => {
          const style = badgeStyles[type];
          const isSelected = selectedTypes.includes(type);
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all ${style.text} ${isSelected ? style.activeBg : style.bg}`}
            >
              {typeLabels[type]}
            </button>
          );
        })}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
          >
            <X className="h-3 w-3" />
            {clearLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function Agenda() {
  const { event, focusTopics, sessions } = agendaData;
  const t = useTranslations("accelerate.agenda");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Session["type"][]>([]);

  const typeLabels: Record<string, string> = {
    keynote: t("types.keynote"),
    panel: t("types.panel"),
    fireside: t("types.fireside"),
    lightning: t("types.lightning"),
    break: t("types.break"),
    demo: t("types.demo"),
    closing: t("types.closing"),
  };

  const toggleType = (type: Session["type"]) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTypes([]);
  };

  const hasActiveFilters = searchQuery.length > 0 || selectedTypes.length > 0;

  const filteredSessions = useMemo(() => {
    return (sessions as Session[]).filter((session) => {
      // Filter by type
      if (selectedTypes.length > 0 && !selectedTypes.includes(session.type)) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchableText = [
          session.title,
          session.subtitle,
          session.location,
          session.moderator?.name,
          session.moderator?.company,
          session.moderator?.title,
          ...session.speakers.map((s) => s.name),
          ...session.speakers.map((s) => s.company),
          ...session.speakers.map((s) => s.title),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [sessions, searchQuery, selectedTypes]);

  const sessionCount = filteredSessions.length;
  const totalCount = (sessions as Session[]).length;

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
              {t("focusTopics")}
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

          {/* Filter Bar */}
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTypes={selectedTypes}
            toggleType={toggleType}
            clearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            typeLabels={typeLabels}
            searchPlaceholder={t("searchPlaceholder")}
            filterByTypeLabel={t("filterByType")}
            clearLabel={t("clear")}
          />

          {/* Results Count */}
          {hasActiveFilters && (
            <motion.div variants={fadeInUp} className="mb-4">
              <p className="text-sm text-white/50">
                {t("showing")}{" "}
                <span className="font-medium text-white/70">
                  {sessionCount}
                </span>{" "}
                {t("of")}{" "}
                <span className="font-medium text-white/70">{totalCount}</span>{" "}
                {t("sessions")}
              </p>
            </motion.div>
          )}

          {/* Schedule Header */}
          <motion.div
            variants={fadeInUp}
            className="mb-6 hidden border-b border-white/10 pb-4 md:grid md:grid-cols-[140px_1fr_100px] lg:grid-cols-[180px_1fr_120px]"
          >
            <p className="text-sm font-medium uppercase tracking-wider text-white/40">
              {t("timeHeader")}
            </p>
            <p className="text-sm font-medium uppercase tracking-wider text-white/40">
              {t("sessionHeader")}
            </p>
            <p className="text-right text-sm font-medium uppercase tracking-wider text-white/40">
              {t("locationHeader")}
            </p>
          </motion.div>

          {/* Sessions */}
          <div>
            <AnimatePresence mode="sync">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    typeLabels={typeLabels}
                    moderatorLabel={t("moderator")}
                  />
                ))
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center text-white/50"
                >
                  <p className="text-lg">{t("noSessionsMatch")}</p>
                  <button
                    onClick={clearFilters}
                    className="mt-3 text-sm text-accelerate-green transition-colors hover:text-accelerate-green/80"
                  >
                    {t("clearAllFilters")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MC Note */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 border-t border-white/10 pt-6"
          >
            <p className="text-sm text-white/50">
              <span className="font-medium text-white/70">{t("mc")}</span>{" "}
              {event.mc}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
