"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import styles from "./vector-answer-preview.module.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], display: "swap" });

/**
 * "Vector answered" live-answer preview shown under the Ask Vector hero
 * (Vector Answer Export.html, Solana.com Design System). A showcase of an
 * agent answer: intro sentence, the live model + token-creation-flow panels,
 * a collapsible per-step code-snippets panel (native details), and source
 * links. Executing a step simulates the command and builds the live model;
 * the language tabs remain part of the mock.
 */

const MINT_ADDR = "8gWp…3kQd";
const ACCOUNT_ADDR = "Bt7c…kR2m";

const STEPS: {
  num: string;
  title: string;
  desc: string;
  cmd: ReactNode;
  out: string;
}[] = [
  {
    num: "01",
    title: "Create the mint",
    desc: "A mint account is the token’s on-chain definition — its decimals, total supply counter, and the mint authority allowed to create new units. It holds no one’s balance; the address it returns is your token’s identity everywhere.",
    cmd: <>spl-token create-token</>,
    out: `✓ mint created · ${MINT_ADDR}`,
  },
  {
    num: "02",
    title: "Create your token account",
    desc: "Wallets don’t hold tokens directly — every holder needs a token account tied to the mint. This creates yours (the associated token account), which starts out empty at balance 0.",
    cmd: (
      <>
        spl-token create-account{" "}
        <span className={styles.tokMint}>{MINT_ADDR}</span>
      </>
    ),
    out: `✓ account created · ${ACCOUNT_ADDR}`,
  },
  {
    num: "03",
    title: "Mint the starting supply",
    desc: "The mint authority creates 100 new units directly into your token account. The supply counter on the mint and the balance in your account both become 100.",
    cmd: (
      <>
        spl-token mint <span className={styles.tokMint}>{MINT_ADDR}</span> 100
      </>
    ),
    out: "✓ minted 100 · balance 100",
  },
];

function Icon({
  paths,
  size = 16,
  strokeWidth = 1.8,
}: {
  paths: string[];
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export function VectorAnswerPreview() {
  const [done, setDone] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const execute = () => {
    if (running || done >= STEPS.length) return;
    setRunning(true);
    timerRef.current = setTimeout(() => {
      setRunning(false);
      setDone((d) => d + 1);
    }, 950);
  };

  const replay = () => {
    if (running) return;
    setDone(0);
  };

  return (
    <section
      className={`${styles.preview} ${spaceGrotesk.className}`}
      aria-label="Example of a Vector answer"
    >
      <div className={styles.header}>
        <span className={styles.headerDot} aria-hidden="true" />
        <span className={styles.headerText}>
          Vector answered{" "}
          <span className={styles.headerQuestion}>
            &ldquo;How do I create a token?&rdquo;
          </span>
        </span>
      </div>

      <div className={styles.body}>
        <span className={styles.avatar} aria-hidden="true">
          <span className={styles.avatarIn}>
            <span className={styles.avatarEye} />
            <span className={styles.avatarEye} />
          </span>
        </span>

        <div className={styles.content}>
          <p className={styles.intro}>
            To create a token on Solana, you&rsquo;ll make three small things —
            the coin itself, a place for your wallet to hold it, and its
            starting supply.
          </p>

          {/* column-reverse: this first group renders below the live model */}
          <div className={styles.panels}>
            <div className={styles.panelGroup}>
              <span
                className={`${styles.panelLabel} ${jetbrainsMono.className}`}
              >
                Token creation flow
              </span>
              <div className={styles.flowPanel}>
                <div className={`${styles.keyRow} ${jetbrainsMono.className}`}>
                  <span className={styles.keyLabel}>KEY</span>
                  <span className={styles.keyItem}>
                    <span className={styles.keyMint}>◆</span> ={" "}
                    <span className={styles.keyMint}>mint address</span>
                  </span>
                  <span className={styles.keyItem}>
                    <span className={styles.keyAccount}>●</span> ={" "}
                    <span className={styles.keyAccount}>
                      token account address
                    </span>
                  </span>
                </div>

                <div className={styles.stepList}>
                  {STEPS.map((s, i) =>
                    i === done ? (
                      <div key={s.num} className={styles.step}>
                        <div className={styles.stepTop}>
                          <span
                            className={`${styles.stepNum} ${jetbrainsMono.className}`}
                          >
                            {s.num}
                          </span>
                          <span className={styles.stepTitle}>{s.title}</span>
                        </div>
                        <div className={styles.stepDesc}>{s.desc}</div>
                        <div className={styles.stepActions}>
                          <code
                            className={`${styles.stepCmd} ${jetbrainsMono.className}`}
                          >
                            {s.cmd}
                          </code>
                          <button
                            type="button"
                            className={`${styles.execute} ${
                              running ? styles.executeRunning : ""
                            }`}
                            onClick={execute}
                            disabled={running}
                          >
                            {running && (
                              <span
                                className={styles.spinner}
                                aria-hidden="true"
                              />
                            )}
                            {running ? "Running" : "Execute"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={s.num}
                        className={`${styles.stepRow} ${
                          i < done ? styles.stepRowDone : styles.stepRowTodo
                        }`}
                      >
                        <span
                          className={`${styles.stepNum} ${jetbrainsMono.className}`}
                        >
                          {s.num}
                        </span>
                        <span className={styles.stepRowTitle}>{s.title}</span>
                        {i < done && (
                          <>
                            <span
                              className={styles.stepCheck}
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                            <span
                              className={`${styles.stepOut} ${jetbrainsMono.className}`}
                            >
                              {s.out}
                            </span>
                          </>
                        )}
                      </div>
                    ),
                  )}

                  {done === STEPS.length && (
                    <div className={styles.replayRow}>
                      <span className={styles.replayMsg}>
                        ✓ Token live on devnet
                      </span>
                      <button
                        type="button"
                        className={styles.replayBtn}
                        onClick={replay}
                      >
                        Replay ↺
                      </button>
                    </div>
                  )}
                </div>

                <span className={`${styles.devnet} ${jetbrainsMono.className}`}>
                  <span className={styles.devnetDot} aria-hidden="true" />
                  <span className={styles.devnetName}>devnet</span>
                </span>
              </div>
            </div>

            <div className={styles.panelGroup}>
              <span
                className={`${styles.panelLabel} ${jetbrainsMono.className}`}
              >
                Live model
              </span>
              <div className={styles.modelPanel} aria-live="polite">
                <div className={styles.modelTitle}>
                  One mint, many token accounts{" "}
                  <span className={styles.modelSub}>
                    — The mint defines the token. Each holder gets a token
                    account that stores a balance.
                  </span>
                </div>
                {done === 0 ? (
                  <div
                    className={`${styles.modelEmpty} ${jetbrainsMono.className}`}
                  >
                    Run step 01 to build the model →
                  </div>
                ) : (
                  <div className={styles.modelViz}>
                    <div className={styles.node}>
                      <span className={styles.nodeGlyphMint} aria-hidden="true">
                        ◆
                      </span>
                      <span className={styles.nodeName}>mint</span>
                      <span
                        className={`${styles.nodeAddr} ${jetbrainsMono.className}`}
                      >
                        {MINT_ADDR}
                      </span>
                      <span
                        key={`supply-${done >= 3 ? 100 : 0}`}
                        className={`${styles.nodeMeta} ${jetbrainsMono.className}`}
                      >
                        supply {done >= 3 ? 100 : 0}
                      </span>
                    </div>

                    {done >= 2 && (
                      <span className={styles.edge} aria-hidden="true">
                        {done >= 3 && <span className={styles.edgeDot} />}
                      </span>
                    )}

                    {done >= 2 && (
                      <div className={styles.node}>
                        <span
                          className={styles.nodeGlyphAccount}
                          aria-hidden="true"
                        >
                          ●
                        </span>
                        <span className={styles.nodeName}>
                          your token account
                        </span>
                        <span
                          className={`${styles.nodeAddr} ${jetbrainsMono.className}`}
                        >
                          {ACCOUNT_ADDR}
                        </span>
                        <span
                          key={`balance-${done >= 3 ? 100 : 0}`}
                          className={`${styles.nodeMeta} ${jetbrainsMono.className}`}
                        >
                          balance {done >= 3 ? 100 : 0}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.codeRow}>
            <span className={styles.codeIcon} aria-hidden="true">
              <Icon
                paths={["m8 6-6 6 6 6", "M16 6l6 6-6 6"]}
                size={14}
                strokeWidth={2.2}
              />
            </span>
            <details className={styles.codeDetails}>
              <summary className={styles.codeSummary}>
                View the code snippets for each step demonstrated above
                <Icon
                  paths={["M12 5v14M6 13l6 6-6 6"]}
                  size={13}
                  strokeWidth={2}
                />
              </summary>
              <div className={styles.codeBody}>
                <div className={styles.tabsRow}>
                  <div className={styles.tabs}>
                    <span
                      className={`${styles.tab} ${styles.tabActive} ${jetbrainsMono.className}`}
                    >
                      CLI
                    </span>
                    <span
                      className={`${styles.tab} ${jetbrainsMono.className}`}
                    >
                      TypeScript
                    </span>
                    <span
                      className={`${styles.tab} ${jetbrainsMono.className}`}
                    >
                      Rust
                    </span>
                  </div>
                </div>

                <div
                  className={`${styles.prereqLabel} ${jetbrainsMono.className}`}
                >
                  Prerequisites
                </div>
                <ol
                  className={`${styles.prereqList} ${jetbrainsMono.className}`}
                >
                  <li>
                    Install the Solana CLI{" "}
                    <code className={styles.codeGreen}>
                      sh -c &quot;$(curl -sSfL
                      https://release.anza.xyz/stable/install)&quot;
                    </code>
                  </li>
                  <li>
                    Install the token CLI{" "}
                    <code className={styles.codeGreen}>
                      cargo install spl-token-cli
                    </code>
                  </li>
                  <li>
                    Create and fund a keypair:
                    <div className={styles.prereqCmd}>
                      solana-keygen <span className={styles.tokGreen}>new</span>{" "}
                      <span className={styles.tokComment}>
                        # skip if you already have a keypair
                      </span>
                    </div>
                    <div className={styles.prereqCmd}>
                      solana <span className={styles.tokGreen}>airdrop</span> 2{" "}
                      <span className={styles.tokComment}>
                        # fund the fee payer
                      </span>
                    </div>
                  </li>
                  <li>
                    Point at devnet:
                    <div className={styles.prereqCmd}>
                      solana config <span className={styles.tokGreen}>set</span>{" "}
                      --url devnet
                    </div>
                  </li>
                </ol>

                <div className={styles.cmdList}>
                  <div className={styles.cmdRow}>
                    <code
                      className={`${styles.cmdCode} ${jetbrainsMono.className}`}
                    >
                      spl-token{" "}
                      <span className={styles.tokGreen}>create-token</span>
                    </code>
                    <span
                      className={`${styles.cmdNote} ${jetbrainsMono.className}`}
                    >
                      # → prints the new mint address
                    </span>
                  </div>
                  <div className={styles.cmdRow}>
                    <code
                      className={`${styles.cmdCode} ${jetbrainsMono.className}`}
                    >
                      spl-token{" "}
                      <span className={styles.tokGreen}>create-account</span>{" "}
                      <span className={styles.tokMint}>&lt;MINT&gt;</span>
                    </code>
                    <span
                      className={`${styles.cmdNote} ${jetbrainsMono.className}`}
                    >
                      # your associated token account for it
                    </span>
                  </div>
                  <div className={styles.cmdRow}>
                    <code
                      className={`${styles.cmdCode} ${jetbrainsMono.className}`}
                    >
                      spl-token <span className={styles.tokGreen}>mint</span>{" "}
                      <span className={styles.tokMint}>&lt;MINT&gt;</span>{" "}
                      <span className={styles.tokGreen}>100</span>
                    </code>
                    <span
                      className={`${styles.cmdNote} ${jetbrainsMono.className}`}
                    >
                      # mint 100 tokens to that account
                    </span>
                  </div>
                  <div className={styles.cmdRow}>
                    <code
                      className={`${styles.cmdCode} ${jetbrainsMono.className}`}
                    >
                      spl-token <span className={styles.tokGreen}>supply</span>{" "}
                      <span className={styles.tokMint}>&lt;MINT&gt;</span>
                    </code>
                    <span
                      className={`${styles.cmdNote} ${jetbrainsMono.className}`}
                    >
                      # verify
                    </span>
                  </div>
                  <div
                    className={`${styles.cmdFoot} ${jetbrainsMono.className}`}
                  >
                    # Token-2022 instead of the original program: add
                    --program-2022 to create-token
                  </div>
                </div>
              </div>
            </details>
          </div>

          <div className={styles.sources}>
            <span
              className={`${styles.sourcesLabel} ${jetbrainsMono.className}`}
            >
              Sources:
            </span>
            <Link className={styles.sourceLink} href="/docs/tokens">
              Tokens on Solana
            </Link>
            <Link
              className={styles.sourceLink}
              href="/developers/cookbook/tokens/create-token-with-metadata"
            >
              Cookbook · Create a Token
            </Link>
            <a
              className={styles.sourceLink}
              href="https://www.npmjs.com/package/@solana/spl-token"
              target="_blank"
              rel="noopener noreferrer"
            >
              @solana/spl-token
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
