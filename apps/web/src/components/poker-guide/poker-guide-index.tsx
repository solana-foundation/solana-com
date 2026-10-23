import Image from "next/image";
import Link from "next/link";
import { pokerGuideChapters, pokerGuideSlug } from "@/lib/poker-guide-chapters";
import { guide } from "./poker-guide-classes";

type PokerGuideIndexProps = { title: string; description: string };

export default function PokerGuideIndex({
  title,
  description,
}: PokerGuideIndexProps) {
  return (
    <div className={guide.page}>
      <div className={guide.ambient} aria-hidden="true" />
      <div className={guide.container}>
        <header className={guide.topbar}>
          <p className={guide.topbarEyebrow}>Table stakes</p>
          <Link className={guide.wsopLink} href="/wsop">
            <span className={guide.wsopDot} aria-hidden="true" />
            <span>Built for the WSOP table</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </header>
        <section className={guide.hero} aria-labelledby="poker-guide-title">
          <div className={guide.heroCopy}>
            <h1 id="poker-guide-title" className={guide.heroTitle}>
              {title}
            </h1>
            <p className={guide.heroDescription}>{description}</p>
            <div className={guide.heroActions}>
              <Link className={guide.heroCta} href="#chapters">
                Deal me in <span aria-hidden="true">↓</span>
              </Link>
              <Link className={guide.heroSecondaryCta} href="/wsop">
                See the WSOP story <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className={guide.heroArt}>
            <Image
              src="/images/learn/poker-guide/poker-guide-hero.webp"
              alt="A poker player at a desk with a Solana trading chart and live poker tables"
              width={1536}
              height={1024}
              priority
            />
            <span className={guide.heroArtLabel}>Read the table</span>
          </div>
        </section>
        <section
          id="chapters"
          className={guide.chapterGrid}
          aria-label="Guide chapters"
        >
          <div className={guide.chapterGridHeader}>
            <p className={guide.eyebrow}>The guide</p>
            <h2>Choose your next hand.</h2>
          </div>
          <div className={guide.cards}>
            {pokerGuideChapters.map((chapter) => (
              <Link
                key={chapter.slug}
                className={guide.card}
                href={`/${pokerGuideSlug}/${chapter.slug}`}
              >
                <span className={guide.cardLabel}>
                  {chapter.number}/ {chapter.label}
                </span>
                <span className={guide.cardTitle}>{chapter.title}</span>
                <span className={guide.cardCta}>
                  Read chapter <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
        <footer className={guide.footer}>
          <div>
            <p className={guide.footerKicker}>The short version</p>
            <p className={guide.footerTitle}>The rest you already know.</p>
          </div>
          <Link className={guide.footerLink} href="/wsop">
            From the felt to the chain <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}
