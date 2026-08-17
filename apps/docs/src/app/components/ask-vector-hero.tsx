"use client";

import { useState } from "react";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import {
  AskSolanaChatView,
  type AskSolanaChatStatus,
} from "@solana-com/ui-chrome";
import styles from "./ask-vector-hero.module.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], display: "swap" });

const GUIDED_LEARNING_PROMPT =
  "Enter guided learning mode: ask me a few questions about my experience and interests, then build me a custom Solana learning journey in real time.";

const CHAT_STATUS_LABELS: Record<AskSolanaChatStatus, string> = {
  idle: "Ready",
  thinking: "Thinking",
  searching: "Searching docs",
  answering: "Answering",
  complete: "Ready for follow-up",
  error: "Needs retry",
};

/**
 * "Ask Vector" agent hero for the docs landing page. The robot is the
 * "Vector" mark (vector-robot.html, Solana.com Design System) built purely
 * from CSS clip-paths and gradients — no SVG or images. Rendered by
 * DocsHero.
 */
export function AskVectorHero({
  onChatActiveChange,
}: {
  onChatActiveChange?: (_isActive: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [chatStatus, setChatStatus] = useState<AskSolanaChatStatus>("idle");
  const [chatSeed, setChatSeed] = useState<{
    id: number;
    query: string;
  } | null>(null);

  const startChat = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setChatSeed({ id: Date.now(), query: trimmed });
    setQuery("");
    setChatStatus("thinking");
    onChatActiveChange?.(true);
  };

  const closeChat = () => {
    setChatSeed(null);
    setChatStatus("idle");
    onChatActiveChange?.(false);
  };

  const chatStatusToneClass =
    chatStatus === "error"
      ? styles.chatStatusError
      : chatStatus === "thinking" ||
          chatStatus === "searching" ||
          chatStatus === "answering"
        ? styles.chatStatusLive
        : "";

  return (
    <section
      className={`${styles.hero} ${chatSeed ? styles.chatMode : spaceGrotesk.className}`}
    >
      <div className={styles.gridOverlay} />
      <div className={styles.columns}>
        {chatSeed ? null : (
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
        )}

        <div className={styles.panel}>
          {chatSeed ? (
            <div className={styles.chatPanel}>
              <div className={styles.chatHeader}>
                <div className={styles.chatTitleGroup}>
                  <h1 className={styles.chatTitle}>Ask Solana Docs</h1>
                  <span
                    className={`${styles.chatStatus} ${chatStatusToneClass}`}
                    aria-live="polite"
                  >
                    {CHAT_STATUS_LABELS[chatStatus]}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.chatBack}
                  onClick={closeChat}
                >
                  Back to docs
                </button>
              </div>
              <div className={styles.chatBody}>
                <AskSolanaChatView
                  key={chatSeed.id}
                  isDark
                  initialQuery={chatSeed.query}
                  className={styles.chatView}
                  onStatusChange={setChatStatus}
                  surface="inline"
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className={styles.headline}>
                Learn with your AI Assistant.
                <br />
                <span className={styles.gradientText}>Just ask.</span>
              </h1>

              <form
                className={styles.askBar}
                onSubmit={(e) => {
                  e.preventDefault();
                  startChat(query);
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
            </>
          )}
        </div>
      </div>

      {chatSeed ? null : (
        <div className={styles.guided}>
          <span className={`${styles.guidedLabel} ${jetbrainsMono.className}`}>
            Not sure where to start?
          </span>
          <button
            type="button"
            className={styles.guidedCard}
            onClick={() => startChat(GUIDED_LEARNING_PROMPT)}
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
      )}
    </section>
  );
}
