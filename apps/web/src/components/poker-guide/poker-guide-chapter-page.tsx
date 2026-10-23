"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { pokerGuideChapters, pokerGuideSlug } from "@/lib/poker-guide-chapters";
import { guide } from "./poker-guide-classes";

type Props = { activeChapter: string; children: ReactNode };

export default function PokerGuideChapterPage({
  activeChapter,
  children,
}: Props) {
  return (
    <div className={guide.page}>
      <div className={guide.ambient} aria-hidden="true" />
      <div className={guide.container}>
        <header className={guide.topbar}>
          <Link className={guide.backLink} href={`/${pokerGuideSlug}`}>
            <span className={guide.backMark} aria-hidden="true">
              ←
            </span>
            <span>Poker player&apos;s guide</span>
          </Link>
          <Link className={guide.wsopLink} href="/wsop">
            <span className={guide.wsopDot} aria-hidden="true" />
            <span>Built for the WSOP table</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </header>
        <div className={guide.mobileChapterBar}>
          <span className={guide.mobileChapterLabel}>Chapters</span>
          <label className={guide.mobileChapterSelect}>
            <span className="sr-only">Choose a chapter</span>
            <select
              value={activeChapter}
              onChange={(event) => {
                const chapter = pokerGuideChapters.find(
                  ({ slug }) => slug === event.target.value,
                );
                if (chapter) {
                  window.location.assign(`/${pokerGuideSlug}/${chapter.slug}`);
                }
              }}
            >
              {pokerGuideChapters.map((chapter) => (
                <option key={chapter.slug} value={chapter.slug}>
                  {chapter.number}/ {chapter.title}
                </option>
              ))}
            </select>
            <span aria-hidden="true">⌄</span>
          </label>
        </div>
        <div className={guide.readingFrame}>
          <article className={guide.article}>
            <div className={guide.content}>{children}</div>
          </article>
          <aside className={guide.rail} aria-label="Guide chapters">
            <div className={guide.railHeader}>
              <span className={guide.railKicker}>Guide</span>
              <span className={guide.railCount}>7 chapters</span>
            </div>
            <nav className={guide.railNav}>
              {pokerGuideChapters.map((chapter) => {
                const isActive = activeChapter === chapter.slug;
                return (
                  <Link
                    key={chapter.slug}
                    href={`/${pokerGuideSlug}/${chapter.slug}`}
                    className={`${guide.railItem} ${isActive ? guide.railItemActive : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className={guide.railItemContent}>
                      <span className={guide.railLabel}>
                        {chapter.number}/ {chapter.label}
                      </span>
                      <span className={guide.railTitle}>{chapter.title}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>
            <Link className={guide.railCta} href="/wsop">
              <span>From the felt to the chain</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
