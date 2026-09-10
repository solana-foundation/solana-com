"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { pokerGuideChapters, pokerGuideSlug } from "@/lib/poker-guide-chapters";
import styles from "./poker-guide.module.css";

type Props = { activeChapter: string; children: ReactNode };

export default function PokerGuideChapterPage({
  activeChapter,
  children,
}: Props) {
  return (
    <div className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.container}>
        <header className={styles.topbar}>
          <Link className={styles.backLink} href={`/${pokerGuideSlug}`}>
            <span className={styles.backMark} aria-hidden="true">
              ←
            </span>
            <span>Poker player&apos;s guide</span>
          </Link>
          <Link className={styles.wsopLink} href="/wsop">
            <span className={styles.wsopDot} aria-hidden="true" />
            <span>Built for the WSOP table</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </header>
        <div className={styles.mobileChapterBar}>
          <span className={styles.mobileChapterLabel}>Chapters</span>
          <label className={styles.mobileChapterSelect}>
            <span className="sr-only">Choose a chapter</span>
            <select
              value={activeChapter}
              onChange={(event) =>
                window.location.assign(
                  `/${pokerGuideSlug}/${event.target.value}`,
                )
              }
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
        <div className={styles.readingFrame}>
          <article className={styles.article}>
            <div className={styles.content}>{children}</div>
          </article>
          <aside className={styles.rail} aria-label="Guide chapters">
            <div className={styles.railHeader}>
              <span className={styles.railKicker}>Guide</span>
              <span className={styles.railCount}>7 chapters</span>
            </div>
            <nav>
              {pokerGuideChapters.map((chapter) => {
                const isActive = activeChapter === chapter.slug;
                return (
                  <Link
                    key={chapter.slug}
                    href={`/${pokerGuideSlug}/${chapter.slug}`}
                    className={`${styles.railItem} ${isActive ? styles.railItemActive : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className={styles.railItemContent}>
                      <span className={styles.railLabel}>
                        {chapter.number}/ {chapter.label}
                      </span>
                      <span className={styles.railTitle}>{chapter.title}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>
            <Link className={styles.railCta} href="/wsop">
              <span>From the felt to the chain</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
