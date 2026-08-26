"use client";

import { useMemo, useState } from "react";
import { Link } from "@workspace/i18n/routing";
import { cn } from "@/app/components/utils";
import { SelectionColor } from "@/component-library/selection-color";
import { FAQ_TOPICS, FAQ_TOTAL, type FaqItem } from "@/data/enterprise/faq";

const CONTACT_HREF = "mailto:enterprise@solana.org";

type IndexedItem = FaqItem & {
  id: string;
  searchText: string;
};

type IndexedTopic = {
  topic: string;
  icon: string;
  items: IndexedItem[];
};

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}

export function EnterpriseFaqPage() {
  const [activeTopic, setActiveTopic] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const sections: IndexedTopic[] = useMemo(
    () =>
      FAQ_TOPICS.map((topic, topicIndex) => ({
        topic: topic.topic,
        icon: topic.icon,
        items: topic.items.map((item, itemIndex) => ({
          ...item,
          id: `${topicIndex}-${itemIndex}`,
          searchText:
            `${item.q} ${item.tldr} ${stripTags(item.a)}`.toLowerCase(),
        })),
      })),
    [],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const visibleSections = sections
    .map((section) => ({
      ...section,
      items:
        activeTopic === "all" || activeTopic === section.topic
          ? section.items.filter(
              (item) =>
                !normalizedQuery || item.searchText.includes(normalizedQuery),
            )
          : [],
    }))
    .filter((section) => section.items.length > 0);

  const visibleCount = visibleSections.reduce(
    (total, section) => total + section.items.length,
    0,
  );

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="bg-black text-white font-brand">
      <SelectionColor selectionColor="#14F195" selectionTextColor="#000000" />

      {/* Hero */}
      <div className="max-w-[1140px] mx-auto px-5 md:px-8 pt-12 pb-1">
        <Link
          href="/solutions/enterprise"
          className="text-[13px] text-[#ABABBA] hover:text-white no-underline transition-colors"
        >
          ← Enterprise
        </Link>
        <h1 className="font-bold text-[clamp(28px,4.4vw,44px)] leading-[1.12] tracking-[-0.015em] max-w-[700px] mt-4 mb-0">
          How Solana?{" "}
          <em className="not-italic bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
            Answered.
          </em>
        </h1>
        <p className="text-[#ABABBA] max-w-[580px] mt-3 mb-0 text-[15px]">
          Common questions from institutions exploring Solana, answered in plain
          language for business and partnership teams.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-[1140px] mx-auto px-5 md:px-8 mt-6">
        <div className="flex items-center gap-2.5 max-w-[680px] bg-white/[0.04] border border-white/10 rounded-[14px] px-4 py-3 transition-colors focus-within:border-[#9945FF]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            className="flex-none opacity-50"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions: custody, privacy, stablecoin, settlement…"
            aria-label="Search FAQ"
            className="bg-transparent border-none outline-none text-white text-[15px] w-full placeholder:text-white/40"
          />
        </div>
        <div className="text-[13px] text-white/40 mt-2 min-h-[19px]">
          {normalizedQuery && (
            <>
              <b className="text-[#14F195] font-medium">{visibleCount}</b> match
              {visibleCount === 1 ? "" : "es"} for “{query.trim()}”
            </>
          )}
        </div>
      </div>

      {/* Layout: topic nav + questions */}
      <div className="max-w-[1140px] mx-auto px-5 md:px-8 mt-7 pb-16 lg:grid lg:grid-cols-[240px_1fr] lg:gap-x-11 lg:items-start">
        {/* Mobile: topic dropdown */}
        <div className="lg:hidden mb-6">
          <label htmlFor="faq-topic" className="sr-only">
            Topic
          </label>
          <div className="relative">
            <select
              id="faq-topic"
              value={activeTopic}
              onChange={(event) => setActiveTopic(event.target.value)}
              className="w-full appearance-none bg-white/[0.04] border border-white/10 rounded-[14px] px-4 py-3 pr-10 text-[15px] text-white outline-none cursor-pointer transition-colors focus:border-[#9945FF]"
            >
              <option value="all" className="bg-[#101014] text-white">
                All questions ({FAQ_TOTAL})
              </option>
              {sections.map((section) => (
                <option
                  key={section.topic}
                  value={section.topic}
                  className="bg-[#101014] text-white"
                >
                  {section.topic} ({section.items.length})
                </option>
              ))}
            </select>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Desktop: sidebar topic nav */}
        <nav
          aria-label="Topics"
          className="hidden lg:block lg:sticky lg:top-[110px]"
        >
          <div className="text-[11px] tracking-[0.12em] uppercase text-white/40 mb-3 pl-3">
            Topics
          </div>
          <TopicButton
            label="All questions"
            count={FAQ_TOTAL}
            active={activeTopic === "all"}
            onClick={() => setActiveTopic("all")}
          />
          {sections.map((section) => (
            <TopicButton
              key={section.topic}
              label={section.topic}
              count={section.items.length}
              active={activeTopic === section.topic}
              onClick={() => setActiveTopic(section.topic)}
            />
          ))}
        </nav>

        <main>
          {visibleSections.map((section) => (
            <section key={section.topic} className="mb-10">
              <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-white/10">
                <h2 className="font-semibold text-[19px] m-0">
                  {section.topic}
                </h2>
                <span className="text-[13px] text-white/40">
                  {section.items.length} question
                  {section.items.length === 1 ? "" : "s"}
                </span>
              </div>
              {section.items.map((item) => {
                const isOpen = openIds.has(item.id) || Boolean(normalizedQuery);
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "bg-white/[0.04] border rounded-[14px] mb-3 overflow-hidden transition-colors",
                      isOpen
                        ? "border-[#9945FF]/45"
                        : "border-white/10 hover:border-white/20",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={isOpen}
                      className="w-full text-left bg-transparent border-none cursor-pointer px-5 py-[17px] grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 items-start text-inherit"
                    >
                      <div className="font-medium text-[15.5px] leading-[1.4]">
                        {item.q}
                      </div>
                      <div
                        aria-hidden="true"
                        className={cn(
                          "row-span-2 self-center w-[25px] h-[25px] rounded-lg border flex items-center justify-center text-[13px] transition-transform",
                          isOpen
                            ? "rotate-45 text-[#14F195] border-[#14F195]/40"
                            : "text-[#ABABBA] border-white/15",
                        )}
                      >
                        +
                      </div>
                      <div className="text-[13px] text-[#ABABBA] leading-[1.55] mt-1">
                        {item.tldr}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="mx-5 pb-5 border-t border-dashed border-white/10">
                        <div
                          className="faq-ans"
                          dangerouslySetInnerHTML={{ __html: item.a }}
                        />
                        {item.refs && item.refs.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5">
                            <span className="text-[11px] tracking-[0.1em] uppercase text-white/40 mr-1">
                              References
                            </span>
                            {item.refs.map((ref) => {
                              const external = ref.href?.startsWith("http");
                              return (
                                <a
                                  key={`${ref.type}-${ref.label}`}
                                  href={ref.href}
                                  onClick={(event) => {
                                    if (ref.href === "#") {
                                      event.preventDefault();
                                    }
                                  }}
                                  {...(external
                                    ? {
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                      }
                                    : {})}
                                  className="group/ref inline-flex items-center gap-1.5 text-[12px] text-[#ABABBA] hover:text-white border border-white/10 hover:border-[#14F195]/50 bg-white/[0.03] rounded-full px-3 py-1 no-underline transition-colors"
                                >
                                  <span className="text-[#14F195] text-[10.5px] uppercase tracking-[0.06em]">
                                    {ref.type}
                                  </span>
                                  {ref.label}
                                  <span
                                    aria-hidden="true"
                                    className="text-white/40 group-hover/ref:text-[#14F195] text-[11px]"
                                  >
                                    ↗
                                  </span>
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          ))}
          {visibleSections.length === 0 && (
            <div className="text-white/40 text-center py-12">
              No questions match your search.
            </div>
          )}
        </main>
      </div>

      {/* Contact */}
      <div className="max-w-[1140px] mx-auto px-5 md:px-8 pb-24">
        <div className="border-t border-white/10 pt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[#ABABBA] text-[15px] m-0">
            Have a question that isn&apos;t covered here?
          </p>
          <a
            href={CONTACT_HREF}
            className="inline-flex items-center gap-2 text-base font-medium text-black bg-white hover:bg-white/90 rounded-full px-5 py-2.5 no-underline tracking-[-0.16px] transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>

      <style>{`
        .faq-ans p{margin:12px 0 0;color:#ABABBA;font-size:14px;line-height:1.65}
        .faq-ans ul{margin:12px 0 0 20px;padding:0;color:#ABABBA;font-size:14px;line-height:1.65}
        .faq-ans li{margin-bottom:7px}
        .faq-ans strong{color:#FFFFFF}
        .faq-term{border-bottom:1px dotted rgba(20,241,149,.55);cursor:help;position:relative}
        .faq-term:hover::after,.faq-term:focus::after{
          content:attr(data-tip);position:absolute;left:0;bottom:calc(100% + 8px);z-index:50;
          width:min(280px,70vw);background:#101014;border:1px solid rgba(255,255,255,.14);
          border-radius:10px;padding:10px 12px;font-size:12.5px;line-height:1.5;color:#ABABBA;
        }
      `}</style>
    </div>
  );
}

function TopicButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-2 w-full text-left bg-transparent cursor-pointer",
        "text-sm px-3 py-2 rounded-[10px] border-none border-l-2 border-l-transparent transition-colors",
        active
          ? "text-white bg-white/[0.04] border-l-[#9945FF]"
          : "text-[#ABABBA] hover:text-white hover:bg-white/5",
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "text-[11.5px] rounded-full px-2 py-px bg-white/5",
          active ? "text-[#14F195]" : "text-white/40",
        )}
      >
        {count}
      </span>
    </button>
  );
}
