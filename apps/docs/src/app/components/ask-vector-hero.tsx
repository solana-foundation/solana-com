"use client";

import { useState } from "react";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { AskSolanaModalHost, openAskSolana } from "@solana-com/ui-chrome";
import styles from "./ask-vector-hero.module.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], display: "swap" });

/**
 * "Ask Vector" agent hero for the docs landing page. The robot is the
 * "Vector" mark (vector-robot.html, Solana.com Design System) built purely
 * from CSS clip-paths and gradients — no SVG or images. Shown in place of
 * the classic title/search hero while the Ask Solana flag is on (see
 * DocsHero).
 */
export function AskVectorHero() {
  const [query, setQuery] = useState("");

  return (
    <section className={`${styles.hero} ${spaceGrotesk.className}`}>
      <div className={styles.gridOverlay} />
      <div className={styles.columns}>
        <div className={styles.botFrame}>
          <div
            className={styles.bot}
            role="img"
            aria-label="Vector, the Solana docs agent"
          >
            <span className={styles.antennaStalk} />
            <span className={styles.antennaTip} />
            <span className={styles.head}>
              <span className={styles.face}>
                <span className={styles.eye} />
                <span className={styles.eye} />
              </span>
              <span className={`${styles.cheek} ${styles.cheekL}`} />
              <span className={`${styles.cheek} ${styles.cheekR}`} />
            </span>
            <span className={styles.neck} />
            <span className={`${styles.shoulder} ${styles.shL}`} />
            <span className={`${styles.shoulder} ${styles.shR}`} />
            <span className={styles.torso}>
              <span className={styles.core} />
              <span className={`${styles.dot} ${styles.dotL}`} />
              <span className={`${styles.dot} ${styles.dotR}`} />
              <span className={`${styles.vent} ${styles.ventA}`} />
              <span className={`${styles.vent} ${styles.ventB}`} />
            </span>
          </div>
        </div>

        <div className={styles.panel}>
          <h1 className={styles.headline}>
            Don&rsquo;t search the docs.
            <br />
            <span className={styles.gradientText}>Just ask.</span>
          </h1>

          <form
            className={styles.askBar}
            onSubmit={(e) => {
              e.preventDefault();
              openAskSolana("chat", query.trim());
              setQuery("");
            }}
          >
            <span className={styles.askInner}>
              <input
                type="text"
                className={styles.askInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask me anything"
                aria-label="Ask Vector anything"
              />
              <kbd
                className={`${styles.kbd} ${jetbrainsMono.className}`}
                aria-hidden="true"
              >
                ⌘K
              </kbd>
              <button
                type="submit"
                className={styles.send}
                aria-label="Send question"
              >
                ↑
              </button>
            </span>
          </form>
        </div>
      </div>

      <div className={styles.guided}>
        <span className={`${styles.guidedLabel} ${jetbrainsMono.className}`}>
          Not sure where to start?
        </span>
        <button
          type="button"
          className={styles.guidedCard}
          onClick={() =>
            openAskSolana(
              "chat",
              "Enter guided learning mode: ask me a few questions about my experience and interests, then build me a custom Solana learning journey in real time.",
            )
          }
        >
          <span className={styles.guidedText}>
            <span className={styles.guidedTitle}>
              Enter Guided Learning Mode
            </span>
            <span className={styles.guidedDesc}>
              Follow a custom journey based on your experience and interests,
              built by me in real time.
            </span>
          </span>
          <span className={styles.guidedArrow} aria-hidden="true">
            →
          </span>
        </button>
      </div>

      <AskSolanaModalHost />
    </section>
  );
}
