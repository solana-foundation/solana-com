"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import styles from "./poker-guide-page.module.css";

export const pokerGuideSlug = "poker-players-guide-to-crypto";

const chapters = [
  {
    id: "poker-edge",
    number: "1",
    label: "The edge you already have",
    title: "Why poker players make natural traders",
  },
  {
    id: "first-trade",
    number: "2",
    label: "Before you trade",
    title: "Get table-ready",
  },
  {
    id: "mechanics",
    number: "3",
    label: "The mechanics",
    title: "Spot and perps",
  },
  {
    id: "poker-player",
    number: "4",
    label: "The habits transfer",
    title: "Trade like a poker player",
  },
  {
    id: "venue",
    number: "5",
    label: "Choose where to trade",
    title: "Read the venue",
  },
  {
    id: "protect",
    number: "6",
    label: "Protect your bankroll",
    title: "Keep the keys",
  },
  {
    id: "next-steps",
    number: "7",
    label: "Take your seat",
    title: "Start with what you know",
  },
];

type PokerGuidePageProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function PokerGuidePage({
  title,
  description,
  children,
}: PokerGuidePageProps) {
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);

  useEffect(() => {
    const sections = chapters
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveChapter(visible[0].target.id);
        }
      },
      { rootMargin: "-18% 0px -67% 0px", threshold: [0, 0.15, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.container}>
        <header className={styles.topbar}>
          <Link className={styles.backLink} href="/learn">
            <span className={styles.backMark} aria-hidden="true">
              ←
            </span>
            <span>Solana Learn</span>
          </Link>
          <Link className={styles.wsopLink} href="/wsop">
            <span className={styles.wsopDot} aria-hidden="true" />
            <span>Built for the WSOP table</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </header>

        <section className={styles.hero} aria-labelledby="poker-guide-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              Table stakes / A Solana Learn guide
            </p>
            <h1 id="poker-guide-title" className={styles.heroTitle}>
              {title}
            </h1>
            <p className={styles.heroDescription}>{description}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#poker-edge">
                Deal me in <span aria-hidden="true">↓</span>
              </a>
              <Link className={styles.secondaryAction} href="/wsop">
                See the WSOP story <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className={styles.heroArt}>
            <Image
              src="/images/learn/poker-guide/poker-guide-hero.webp"
              alt="A poker player at a desk with a Solana trading chart and live poker tables"
              width={1536}
              height={1024}
              priority
            />
            <span className={styles.heroArtLabel}>Read the table</span>
          </div>
        </section>

        <div className={styles.mobileChapterBar}>
          <span className={styles.mobileChapterLabel}>Chapters</span>
          <label className={styles.mobileChapterSelect}>
            <span className="sr-only">Jump to a chapter</span>
            <select
              value={activeChapter}
              onChange={(event) => {
                const id = event.target.value;
                setActiveChapter(id);
                document.getElementById(id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
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
              {chapters.map((chapter) => {
                const isActive = activeChapter === chapter.id;

                return (
                  <a
                    key={chapter.id}
                    href={`#${chapter.id}`}
                    className={`${styles.railItem} ${isActive ? styles.railItemActive : ""}`}
                    aria-current={isActive ? "location" : undefined}
                  >
                    <span className={styles.railItemContent}>
                      <span className={styles.railLabel}>
                        {chapter.number}/ {chapter.label}
                      </span>
                      <span className={styles.railTitle}>{chapter.title}</span>
                    </span>
                  </a>
                );
              })}
            </nav>
            <Link className={styles.railCta} href="/wsop">
              <span>From the felt to the chain</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </div>

        <footer className={styles.footer}>
          <div>
            <p className={styles.footerKicker}>The short version</p>
            <p className={styles.footerTitle}>The rest you already know.</p>
          </div>
          <Link className={styles.footerLink} href="/learn">
            Keep learning on Solana <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}
