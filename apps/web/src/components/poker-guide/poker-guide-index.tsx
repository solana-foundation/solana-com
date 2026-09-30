import Image from "next/image";
import Link from "next/link";
import { pokerGuideChapters, pokerGuideSlug } from "@/lib/poker-guide-chapters";
import styles from "./poker-guide.module.css";

type PokerGuideIndexProps = { title: string; description: string };

export default function PokerGuideIndex({
  title,
  description,
}: PokerGuideIndexProps) {
  return (
    <div className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.container}>
        <header className={styles.topbar}>
          <p className={styles.topbarEyebrow}>Table stakes</p>
          <Link className={styles.wsopLink} href="/wsop">
            <span className={styles.wsopDot} aria-hidden="true" />
            <span>Built for the WSOP table</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </header>
        <section className={styles.hero} aria-labelledby="poker-guide-title">
          <div className={styles.heroCopy}>
            <h1 id="poker-guide-title" className={styles.heroTitle}>
              {title}
            </h1>
            <p className={styles.heroDescription}>{description}</p>
            <div className={styles.heroActions}>
              <Link className={styles.heroCta} href="#chapters">
                Deal me in <span aria-hidden="true">↓</span>
              </Link>
              <Link className={styles.heroSecondaryCta} href="/wsop">
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
        <section
          id="chapters"
          className={styles.chapterGrid}
          aria-label="Guide chapters"
        >
          <div className={styles.chapterGridHeader}>
            <p className={styles.eyebrow}>The guide</p>
            <h2>Choose your next hand.</h2>
          </div>
          <div className={styles.cards}>
            {pokerGuideChapters.map((chapter) => (
              <Link
                key={chapter.slug}
                className={styles.card}
                href={`/${pokerGuideSlug}/${chapter.slug}`}
              >
                <span className={styles.cardLabel}>
                  {chapter.number}/ {chapter.label}
                </span>
                <span className={styles.cardTitle}>{chapter.title}</span>
                <span className={styles.cardCta}>
                  Read chapter <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
        <footer className={styles.footer}>
          <div>
            <p className={styles.footerKicker}>The short version</p>
            <p className={styles.footerTitle}>The rest you already know.</p>
          </div>
          <Link className={styles.footerLink} href="/wsop">
            From the felt to the chain <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}
