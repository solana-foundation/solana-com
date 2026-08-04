"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import {
  CodeDisclosure,
  CodeSnippet,
  CommandList,
  CommandRow,
  PrereqList,
  PrereqRow,
  SourceLink,
  SourcesRow,
  TabBar,
  TabPanel,
  Tok,
  type CodeLine,
} from "./vector";
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
const RECIPIENT_ADDR = "9fXn…2wLp";

const SNIPPET_TABS = [
  { id: "cli", label: "CLI" },
  { id: "ts", label: "TypeScript" },
  { id: "rust", label: "Rust" },
] as const;

type SnippetLang = (typeof SNIPPET_TABS)[number]["id"];

/* Tokenized code samples: one source drives both the highlighted render
   and the clipboard text (see CodeSnippet). */
const kw = (text: string) => ({ text, tone: "kw" as const });
const fn = (text: string) => ({ text, tone: "fn" as const });
const str = (text: string) => ({ text, tone: "str" as const });
const cm = (text: string) => ({ text, tone: "cm" as const });

const TS_CODE: CodeLine[] = [
  [
    kw("import"),
    " { createClient, generateKeyPairSigner, lamports } ",
    kw("from"),
    " ",
    str('"@solana/kit"'),
    ";",
  ],
  [
    kw("import"),
    " { rpcAirdrop, solanaRpc } ",
    kw("from"),
    " ",
    str('"@solana/kit-plugin-rpc"'),
    ";",
  ],
  [
    kw("import"),
    " { airdropPayer, payer } ",
    kw("from"),
    " ",
    str('"@solana/kit-plugin-signer"'),
    ";",
  ],
  [
    kw("import"),
    " { tokenProgram } ",
    kw("from"),
    " ",
    str('"@solana-program/token"'),
    ";",
  ],
  [kw("import"), " {"],
  ["  findAssociatedTokenPda,"],
  ["  getBurnInstruction,"],
  ["  getCloseAccountInstruction,"],
  ["  TOKEN_2022_PROGRAM_ADDRESS,"],
  ["} ", kw("from"), " ", str('"@solana-program/token-2022"'), ";"],
  [],
  [
    kw("const"),
    " sender = ",
    kw("await"),
    " ",
    fn("generateKeyPairSigner"),
    "(); ",
    cm("// fee payer + mint authority"),
  ],
  [
    kw("const"),
    " mint = ",
    kw("await"),
    " ",
    fn("generateKeyPairSigner"),
    "(); ",
    cm("// the new mint account"),
  ],
  [
    kw("const"),
    " recipient = ",
    kw("await"),
    " ",
    fn("generateKeyPairSigner"),
    "(); ",
    cm("// another holder"),
  ],
  [],
  [kw("const"), " client = ", kw("await"), " ", fn("createClient"), "()"],
  ["  .", kw("use"), "(", fn("payer"), "(sender))"],
  ["  .", kw("use"), "("],
  ["    ", fn("solanaRpc"), "({"],
  ["      rpcUrl: ", str('"https://api.devnet.solana.com"'), ","],
  ["      rpcSubscriptionsUrl: ", str('"wss://api.devnet.solana.com"'), ","],
  ["    }),"],
  ["  )"],
  ["  .", kw("use"), "(", fn("rpcAirdrop"), "())"],
  [
    "  .",
    kw("use"),
    "(",
    fn("airdropPayer"),
    "(",
    fn("lamports"),
    "(2_000_000_000n))) ",
    cm("// 2 devnet SOL"),
  ],
  [
    "  .",
    kw("use"),
    "(",
    fn("tokenProgram"),
    "()); ",
    cm("// adds client.token.*"),
  ],
  [],
  [kw("const"), " asToken2022 = { tokenProgram: TOKEN_2022_PROGRAM_ADDRESS };"],
  [
    kw("const"),
    " ONE = 10n ** 9n; ",
    cm("// 1 token in base units (9 decimals)"),
  ],
  [],
  [cm("// 01 · create + initialize the mint — one call, one transaction")],
  [kw("await"), " client.token"],
  ["  .", fn("createMint"), "("],
  ["    { newMint: mint, decimals: 9, mintAuthority: sender.address },"],
  ["    asToken2022,"],
  ["  )"],
  ["  .", fn("sendTransaction"), "();"],
  [],
  [cm("// 02 + 03 · mint 100 to your token account (created automatically)")],
  [kw("await"), " client.token"],
  ["  .", fn("mintToATA"), "("],
  ["    {"],
  ["      owner: sender.address,"],
  ["      mint: mint.address,"],
  ["      mintAuthority: sender,"],
  ["      amount: 100n * ONE,"],
  ["      decimals: 9,"],
  ["    },"],
  ["    asToken2022,"],
  ["  )"],
  ["  .", fn("sendTransaction"), "();"],
  [],
  [cm("// 04 · transfer 25 — the recipient's ATA is created on the fly")],
  [kw("await"), " client.token"],
  ["  .", fn("transferToATA"), "("],
  ["    {"],
  ["      mint: mint.address,"],
  ["      authority: sender,"],
  ["      recipient: recipient.address,"],
  ["      amount: 25n * ONE,"],
  ["      decimals: 9,"],
  ["    },"],
  ["    asToken2022,"],
  ["  )"],
  ["  .", fn("sendTransaction"), "();"],
  [],
  [cm("// 05 · burn the rest, 06 · close the emptied account")],
  [
    kw("const"),
    " [yourAta] = ",
    kw("await"),
    " ",
    fn("findAssociatedTokenPda"),
    "({",
  ],
  ["  owner: sender.address,"],
  ["  mint: mint.address,"],
  ["  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,"],
  ["});"],
  [kw("await"), " client.", fn("sendTransaction"), "(["],
  ["  ", fn("getBurnInstruction"), "({"],
  ["    account: yourAta,"],
  ["    mint: mint.address,"],
  ["    authority: sender,"],
  ["    amount: 75n * ONE,"],
  ["  }),"],
  ["  ", fn("getCloseAccountInstruction"), "({"],
  ["    account: yourAta,"],
  ["    destination: sender.address, ", cm("// rent refund")],
  ["    owner: sender,"],
  ["  }),"],
  ["]);"],
  [],
  [
    "console.",
    fn("log"),
    "(",
    str('"lifecycle complete · mint:"'),
    ", mint.address);",
  ],
];

const RUST_CODE: CodeLine[] = [
  [cm("// 01 · create + initialize the mint (9 decimals, Token-2022)")],
  [
    fn("create_mint"),
    "(&client, &payer, &mint, 9, &spl_token_2022::",
    fn("id"),
    "())?;",
  ],
  [cm("// 02 · associated token account for the payer")],
  [
    kw("let"),
    " ata = ",
    fn("get_associated_token_address_with_program_id"),
    "(",
  ],
  ["  &payer.pubkey(), &mint.pubkey(), &spl_token_2022::", fn("id"), "(),"],
  [");"],
  [fn("create_associated_token_account"), "(&client, &payer, &ata)?;"],
  [cm("// 03 · mint 100 tokens (base units, 9 decimals)")],
  [
    fn("mint_to"),
    "(&client, &mint, &ata, &payer, ",
    fn("100 * 10u64.pow(9)"),
    ")?;",
  ],
  [cm("// 04 · transfer 25 to another holder's token account")],
  [kw("let"), " recipient = Keypair::", fn("new"), "();"],
  [
    kw("let"),
    " their_ata = ",
    fn("get_associated_token_address_with_program_id"),
    "(",
  ],
  ["  &recipient.pubkey(), &mint.pubkey(), &spl_token_2022::", fn("id"), "(),"],
  [");"],
  [fn("create_associated_token_account"), "(&client, &payer, &their_ata)?;"],
  [
    fn("transfer"),
    "(&client, &ata, &their_ata, &payer, ",
    fn("25 * 10u64.pow(9)"),
    ")?;",
  ],
  [cm("// 05 · burn the remaining 75 — the only way supply goes down")],
  [
    fn("burn"),
    "(&client, &ata, &mint, &payer, ",
    fn("75 * 10u64.pow(9)"),
    ")?;",
  ],
  [cm("// 06 · close the emptied account (rent back to the payer)")],
  [fn("close_account"), "(&client, &ata, &payer)?;"],
];

const STEPS: {
  num: string;
  title: string;
  desc: string;
  usesLabel?: string;
  uses: { kind: "mint" | "account"; label: string }[];
  cmd: ReactNode;
  returns: ReactNode;
  out: ReactNode;
}[] = [
  {
    num: "01",
    title: "Create the mint",
    desc: "A mint account is the token’s on-chain definition — its decimals, total supply counter, and the mint authority allowed to create new units. The --program-2022 flag puts the mint on Token-2022; every later command detects the program from the mint, so only this step needs it.",
    uses: [],
    cmd: <>spl-token create-token --program-2022</>,
    returns: (
      <>
        creates → <span className={styles.tokMint}>◆ mint address</span> ·
        needed in steps 02 + 03
      </>
    ),
    out: (
      <>
        ✓ mint created · <span className={styles.tokMint}>{MINT_ADDR}</span>
      </>
    ),
  },
  {
    num: "02",
    title: "Create your token account",
    desc: "Wallets don’t hold tokens directly — every holder needs a token account tied to the mint. This creates yours (the associated token account), which starts out empty at balance 0.",
    usesLabel: "needs step 01’s result",
    uses: [{ kind: "mint", label: "mint address" }],
    cmd: (
      <>
        spl-token create-account{" "}
        <span className={styles.tokMint} data-flow-target="mint">
          {MINT_ADDR}
        </span>
      </>
    ),
    returns: (
      <>
        creates →{" "}
        <span className={styles.tokAccount}>● token account address</span> ·
        needed in step 03
      </>
    ),
    out: (
      <>
        ✓ account created ·{" "}
        <span className={styles.tokAccount}>{ACCOUNT_ADDR}</span>
      </>
    ),
  },
  {
    num: "03",
    title: "Mint the starting supply",
    desc: "The mint authority creates 100 new units directly into your token account. The supply counter on the mint and the balance in your account both become 100.",
    usesLabel: "needs steps 01 + 02’s results",
    uses: [
      { kind: "mint", label: "mint address" },
      { kind: "account", label: "token account address" },
    ],
    cmd: (
      <>
        spl-token mint{" "}
        <span className={styles.tokMint} data-flow-target="mint">
          {MINT_ADDR}
        </span>{" "}
        100{" "}
        <span className={styles.tokAccount} data-flow-target="account">
          {ACCOUNT_ADDR}
        </span>
      </>
    ),
    returns: (
      <>
        result → supply 100 on the mint ·{" "}
        <span className={styles.tokAccount}>balance 100</span> in your account
      </>
    ),
    out: "✓ minted 100 · balance 100",
  },
  {
    num: "04",
    title: "Transfer to another holder",
    desc: "Transfers move units between token accounts of the same mint. This sends 25 to another holder’s token account — your balance drops, theirs grows, and the supply stays untouched.",
    usesLabel: "needs step 01’s result",
    uses: [{ kind: "mint", label: "mint address" }],
    cmd: (
      <>
        spl-token transfer{" "}
        <span className={styles.tokMint} data-flow-target="mint">
          {MINT_ADDR}
        </span>{" "}
        25 <span className={styles.tokAccount}>{RECIPIENT_ADDR}</span>
      </>
    ),
    returns: (
      <>
        result → your balance 75 ·{" "}
        <span className={styles.tokAccount}>their balance 25</span>
      </>
    ),
    out: (
      <>
        ✓ sent 25 · <span className={styles.tokAccount}>{RECIPIENT_ADDR}</span>
      </>
    ),
  },
  {
    num: "05",
    title: "Burn the rest of your balance",
    desc: "Burning destroys units out of a token account and shrinks the mint’s supply — the only way supply goes down. Emptying your account here is what lets step 06 close it.",
    usesLabel: "needs step 02’s result",
    uses: [{ kind: "account", label: "token account address" }],
    cmd: (
      <>
        spl-token burn{" "}
        <span className={styles.tokAccount} data-flow-target="account">
          {ACCOUNT_ADDR}
        </span>{" "}
        75
      </>
    ),
    returns: (
      <>result → balance 0 · supply 25 — your account is ready to close</>
    ),
    out: "✓ burned 75 · supply 25",
  },
  {
    num: "06",
    title: "Close your token account",
    desc: "A token account must be empty before it can close. Closing deletes the account and refunds its rent lamports to your wallet — the mint and every other holder’s account live on.",
    usesLabel: "needs step 02’s result",
    uses: [{ kind: "account", label: "token account address" }],
    cmd: (
      <>
        spl-token close --address{" "}
        <span className={styles.tokAccount} data-flow-target="account">
          {ACCOUNT_ADDR}
        </span>
      </>
    ),
    returns: (
      <>
        result → rent back in your wallet · the mint and{" "}
        <span className={styles.tokAccount}>their balance 25</span> live on
      </>
    ),
    out: "✓ account closed · rent reclaimed",
  },
];

export function VectorAnswerPreview() {
  const [done, setDone] = useState(0);
  const [running, setRunning] = useState(false);
  const [lang, setLang] = useState<SnippetLang>("cli");
  const [arrows, setArrows] = useState<{ kind: string; d: string }[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  // Provenance arrows: measure each "needs" pill and the command argument
  // it feeds, then draw a curve between them. Re-measured on card resize
  // and once fonts settle, since both shift the argument's position.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) {
      setArrows([]);
      return;
    }
    const measure = () => {
      const cardRect = card.getBoundingClientRect();
      const next: { kind: string; d: string }[] = [];
      card
        .querySelectorAll<HTMLElement>("[data-flow-source]")
        .forEach((src) => {
          const kind = src.dataset.flowSource;
          const tgt = card.querySelector<HTMLElement>(
            `[data-flow-target="${kind}"]`,
          );
          if (!kind || !tgt) return;
          const s = src.getBoundingClientRect();
          const t = tgt.getBoundingClientRect();
          const cmdBox = tgt.closest("code")?.getBoundingClientRect();
          // Skip when the argument is ellipsized out of view.
          if (cmdBox && t.left + t.width / 2 > cmdBox.right - 6) return;
          const sx = s.left + s.width / 2 - cardRect.left;
          const sy = s.bottom - cardRect.top;
          const tx = t.left + t.width / 2 - cardRect.left;
          const ty = t.top - cardRect.top;
          if (ty - sy < 8) return;
          // Lean the final control point toward the travel direction so the
          // auto-oriented arrowhead continues the curve instead of snapping
          // to vertical.
          const lean = Math.max(-12, Math.min(12, (tx - sx) * 0.25));
          next.push({
            kind,
            d: `M ${sx} ${sy + 1} C ${sx} ${sy + 10}, ${tx - lean} ${ty - 12}, ${tx} ${ty - 3}`,
          });
        });
      setArrows(next);
    };
    measure();
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    ro?.observe(card);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro?.disconnect();
  }, [done]);

  // On-chain state by step: mint 100 → transfer 25 away → burn the rest →
  // close the emptied account. Supply only drops on burn.
  const supply = done >= 5 ? 25 : done >= 3 ? 100 : 0;
  const yourBalance = done >= 5 ? 0 : done >= 4 ? 75 : done >= 3 ? 100 : 0;

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

  const rewind = () => {
    if (running || done === 0) return;
    setDone((d) => d - 1);
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

          {/* Side by side: live model left, creation flow right; the grid
              collapses to a single stacked column on narrow containers. */}
          <div className={styles.panels}>
            <div className={styles.panelGroup}>
              <span
                className={`${styles.panelLabel} ${jetbrainsMono.className}`}
              >
                Live model
              </span>
              <div className={styles.modelPanel} aria-live="polite">
                <div className={styles.modelTitle}>
                  On-chain State{" "}
                  <span className={styles.modelSub}>
                    — updates as you execute each step
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
                    <div className={`${styles.acctCard} ${styles.acctMint}`}>
                      <div className={styles.acctHead}>
                        <span
                          className={styles.acctGlyphMint}
                          aria-hidden="true"
                        >
                          ◆
                        </span>
                        <span className={styles.acctName}>Mint account</span>
                        <span
                          className={`${styles.acctAddr} ${styles.addrMint} ${jetbrainsMono.className}`}
                        >
                          {MINT_ADDR}
                        </span>
                      </div>
                      <div className={styles.acctRole}>
                        defines the token — holds no balances
                      </div>
                      <div className={styles.fieldList}>
                        <div className={styles.fieldRow}>
                          <span className={styles.fieldKey}>decimals</span>
                          <span
                            className={`${styles.fieldVal} ${jetbrainsMono.className}`}
                          >
                            9
                          </span>
                        </div>
                        <div className={styles.fieldRow}>
                          <span className={styles.fieldKey}>supply</span>
                          <span
                            key={`supply-${supply}`}
                            className={`${styles.fieldVal} ${
                              done >= 3 ? styles.fieldValUp : ""
                            } ${jetbrainsMono.className}`}
                          >
                            {supply}
                          </span>
                        </div>
                        <div className={styles.fieldRow}>
                          <span className={styles.fieldKey}>
                            mint authority
                          </span>
                          <span
                            className={`${styles.fieldVal} ${jetbrainsMono.className}`}
                          >
                            your wallet
                          </span>
                        </div>
                      </div>
                    </div>

                    {done >= 2 && (
                      <>
                        {/* accounts reference the mint: arrows point up into it */}
                        <div className={styles.linkRow} aria-hidden="true">
                          <span
                            className={`${styles.linkLine} ${
                              done >= 6 ? styles.linkLineGhost : ""
                            }`}
                          >
                            {done === 3 && <span className={styles.linkDot} />}
                          </span>
                          <span
                            className={`${styles.linkLine} ${
                              done < 4 ? styles.linkLineGhost : ""
                            }`}
                          >
                            {done === 4 && <span className={styles.linkDot} />}
                          </span>
                        </div>

                        <div className={styles.holderRow}>
                          {done === 4 && (
                            <span
                              className={`${styles.transferFly} ${jetbrainsMono.className}`}
                              aria-hidden="true"
                            >
                              sent 25
                            </span>
                          )}
                          {done >= 6 ? (
                            <div className={styles.acctClosed}>
                              <div className={styles.acctHead}>
                                <span
                                  className={styles.acctGlyphToken}
                                  aria-hidden="true"
                                >
                                  ●
                                </span>
                                <span className={styles.acctName}>
                                  Your token account
                                </span>
                                <span
                                  className={`${styles.acctAddr} ${jetbrainsMono.className}`}
                                >
                                  closed
                                </span>
                              </div>
                              <div className={styles.acctRole}>
                                deleted — rent refunded to your wallet. The mint
                                and other holders live on.
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`${styles.acctCard} ${styles.acctToken}`}
                            >
                              <div className={styles.acctHead}>
                                <span
                                  className={styles.acctGlyphToken}
                                  aria-hidden="true"
                                >
                                  ●
                                </span>
                                <span className={styles.acctName}>
                                  Your token account
                                </span>
                                <span
                                  className={`${styles.acctAddr} ${styles.addrToken} ${jetbrainsMono.className}`}
                                >
                                  {ACCOUNT_ADDR}
                                </span>
                              </div>
                              <div className={styles.acctRole}>
                                holds your balance of this token
                              </div>
                              <div className={styles.fieldList}>
                                <div className={styles.fieldRow}>
                                  <span className={styles.fieldKey}>owner</span>
                                  <span
                                    className={`${styles.fieldVal} ${jetbrainsMono.className}`}
                                  >
                                    your wallet
                                  </span>
                                </div>
                                <div className={styles.fieldRow}>
                                  <span className={styles.fieldKey}>mint</span>
                                  <span
                                    className={`${styles.fieldVal} ${styles.addrMint} ${jetbrainsMono.className}`}
                                  >
                                    ◆ {MINT_ADDR}
                                  </span>
                                </div>
                                <div className={styles.fieldRow}>
                                  <span className={styles.fieldKey}>
                                    balance
                                  </span>
                                  <span
                                    key={`balance-${yourBalance}`}
                                    className={`${styles.fieldVal} ${
                                      done >= 3 ? styles.fieldValUp : ""
                                    } ${jetbrainsMono.className}`}
                                  >
                                    {yourBalance}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {done >= 4 ? (
                            <div
                              className={`${styles.acctCard} ${styles.acctToken}`}
                            >
                              <div className={styles.acctHead}>
                                <span
                                  className={styles.acctGlyphToken}
                                  aria-hidden="true"
                                >
                                  ●
                                </span>
                                <span className={styles.acctName}>
                                  Their token account
                                </span>
                                <span
                                  className={`${styles.acctAddr} ${styles.addrToken} ${jetbrainsMono.className}`}
                                >
                                  {RECIPIENT_ADDR}
                                </span>
                              </div>
                              <div className={styles.acctRole}>
                                another holder of the same token
                              </div>
                              <div className={styles.fieldList}>
                                <div className={styles.fieldRow}>
                                  <span className={styles.fieldKey}>owner</span>
                                  <span
                                    className={`${styles.fieldVal} ${jetbrainsMono.className}`}
                                  >
                                    another wallet
                                  </span>
                                </div>
                                <div className={styles.fieldRow}>
                                  <span className={styles.fieldKey}>mint</span>
                                  <span
                                    className={`${styles.fieldVal} ${styles.addrMint} ${jetbrainsMono.className}`}
                                  >
                                    ◆ {MINT_ADDR}
                                  </span>
                                </div>
                                <div className={styles.fieldRow}>
                                  <span className={styles.fieldKey}>
                                    balance
                                  </span>
                                  <span
                                    className={`${styles.fieldVal} ${styles.fieldValUp} ${jetbrainsMono.className}`}
                                  >
                                    25
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className={styles.acctGhost}>
                              <div className={styles.acctHead}>
                                <span
                                  className={styles.acctGlyphToken}
                                  aria-hidden="true"
                                >
                                  ●
                                </span>
                                <span className={styles.acctName}>
                                  More holders
                                </span>
                              </div>
                              <div className={styles.acctRole}>
                                every holder gets their own token account — each
                                references this same mint
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

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
                  {STEPS.map((s, i) => {
                    const isDone = i < done;
                    const isActive = i === done;
                    const showRail =
                      i < STEPS.length - 1 || done === STEPS.length;
                    return (
                      <div key={s.num} className={styles.tlItem}>
                        <div className={styles.tlGutter} aria-hidden="true">
                          <span
                            className={`${styles.tlMarker} ${
                              isDone
                                ? styles.tlMarkerDone
                                : isActive
                                  ? styles.tlMarkerActive
                                  : styles.tlMarkerTodo
                            } ${jetbrainsMono.className}`}
                          >
                            {isDone ? "✓" : s.num}
                          </span>
                          {showRail && (
                            <span
                              className={`${styles.tlRail} ${
                                isDone ? styles.tlRailDone : ""
                              }`}
                            />
                          )}
                        </div>

                        <div className={styles.tlBody}>
                          {isActive ? (
                            <div className={styles.step} ref={cardRef}>
                              {done > 0 && (
                                <span
                                  key={`nudge-${done}`}
                                  className={`${styles.mobileNudge} ${jetbrainsMono.className}`}
                                  aria-hidden="true"
                                >
                                  ↑ on-chain state updated above
                                </span>
                              )}
                              <div className={styles.stepTitleRow}>
                                <span className={styles.stepTitle}>
                                  {s.title}
                                </span>
                                {done > 0 && (
                                  <button
                                    type="button"
                                    className={styles.backBtn}
                                    onClick={rewind}
                                    disabled={running}
                                  >
                                    ↶ Back
                                  </button>
                                )}
                              </div>
                              <div className={styles.stepDesc}>{s.desc}</div>
                              {s.uses.length > 0 && (
                                <div
                                  className={`${styles.stepUses} ${jetbrainsMono.className}`}
                                >
                                  <span className={styles.usesLabel}>
                                    {s.usesLabel}
                                  </span>
                                  {s.uses.map((u) => (
                                    <span
                                      key={u.kind}
                                      data-flow-source={u.kind}
                                      className={`${styles.useChip} ${
                                        u.kind === "mint"
                                          ? styles.useChipMint
                                          : styles.useChipAccount
                                      }`}
                                    >
                                      {u.kind === "mint" ? "◆" : "●"} {u.label}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className={styles.terminal}>
                                <code
                                  className={`${styles.termCmd} ${jetbrainsMono.className}`}
                                >
                                  <span
                                    className={styles.termPrompt}
                                    aria-hidden="true"
                                  >
                                    ${" "}
                                  </span>
                                  {s.cmd}
                                </code>
                                {done === 0 && (
                                  <span
                                    className={`${styles.execHint} ${
                                      running ? styles.execHintOff : ""
                                    }`}
                                    aria-hidden="true"
                                  >
                                    <svg
                                      width="26"
                                      height="16"
                                      viewBox="0 0 26 16"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M2 8h18" />
                                      <path d="M15 2l7 6-7 6" />
                                    </svg>
                                  </span>
                                )}
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
                              <div
                                className={`${styles.stepReturns} ${jetbrainsMono.className}`}
                              >
                                {s.returns}
                              </div>
                              {arrows.length > 0 && (
                                <svg
                                  className={styles.flowArrows}
                                  aria-hidden="true"
                                >
                                  <defs>
                                    <marker
                                      id="flowArrowMint"
                                      viewBox="0 0 8 8"
                                      refX="6.5"
                                      refY="4"
                                      markerWidth="7"
                                      markerHeight="7"
                                      markerUnits="userSpaceOnUse"
                                      orient="auto"
                                    >
                                      <path
                                        d="M0 0L8 4L0 8Z"
                                        className={styles.arrowHeadMint}
                                      />
                                    </marker>
                                    <marker
                                      id="flowArrowAccount"
                                      viewBox="0 0 8 8"
                                      refX="6.5"
                                      refY="4"
                                      markerWidth="7"
                                      markerHeight="7"
                                      markerUnits="userSpaceOnUse"
                                      orient="auto"
                                    >
                                      <path
                                        d="M0 0L8 4L0 8Z"
                                        className={styles.arrowHeadAccount}
                                      />
                                    </marker>
                                  </defs>
                                  {arrows.map((a) => (
                                    <path
                                      key={a.kind}
                                      d={a.d}
                                      className={
                                        a.kind === "mint"
                                          ? styles.arrowMint
                                          : styles.arrowAccount
                                      }
                                      markerEnd={`url(#flowArrow${
                                        a.kind === "mint" ? "Mint" : "Account"
                                      })`}
                                    />
                                  ))}
                                </svg>
                              )}
                            </div>
                          ) : (
                            <div
                              className={`${styles.tlRow} ${
                                isDone ? "" : styles.tlRowTodo
                              }`}
                            >
                              <span className={styles.tlRowTitle}>
                                {s.title}
                              </span>
                              {isDone && (
                                <span
                                  className={`${styles.stepOut} ${jetbrainsMono.className}`}
                                >
                                  {s.out}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {done === STEPS.length && (
                    <div className={styles.tlItem}>
                      <div className={styles.tlGutter} aria-hidden="true">
                        <span
                          className={`${styles.tlMarker} ${styles.tlMarkerFinal}`}
                        >
                          ✓
                        </span>
                      </div>
                      <div className={styles.tlBody}>
                        <div className={styles.replayRow}>
                          <span
                            key={`nudge-${done}`}
                            className={`${styles.mobileNudge} ${jetbrainsMono.className}`}
                            aria-hidden="true"
                          >
                            ↑ on-chain state updated above
                          </span>
                          <span className={styles.replayMsg}>
                            Token lifecycle complete — the mint lives on
                          </span>
                          <div className={styles.replayActions}>
                            <button
                              type="button"
                              className={styles.backBtn}
                              onClick={rewind}
                            >
                              ↶ Back
                            </button>
                            <button
                              type="button"
                              className={styles.replayBtn}
                              onClick={replay}
                            >
                              Replay ↺
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <span className={`${styles.devnet} ${jetbrainsMono.className}`}>
                  <span className={styles.devnetDot} aria-hidden="true" />
                  <span className={styles.devnetName}>devnet</span>
                </span>
              </div>
            </div>
          </div>

          <CodeDisclosure
            className={styles.codeDisclosure}
            summary="View the code snippets for each step demonstrated above"
          >
            <TabBar tabs={SNIPPET_TABS} active={lang} onSelect={setLang} />

            {lang === "cli" && (
              <TabPanel>
                <PrereqList>
                  <PrereqRow
                    num="1"
                    title="Install the Solana CLI"
                    copyText={
                      'sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"'
                    }
                  >
                    sh -c &quot;$(curl -sSfL
                    https://release.anza.xyz/stable/install)&quot;
                  </PrereqRow>
                  <PrereqRow
                    num="2"
                    title="Install the token CLI"
                    copyText="cargo install spl-token-cli"
                  >
                    cargo <Tok tone="green">install</Tok> spl-token-cli
                  </PrereqRow>
                  <PrereqRow
                    num="3"
                    title="Create a keypair (skip if you have one)"
                    copyText="solana-keygen new"
                  >
                    solana-keygen <Tok tone="green">new</Tok>
                  </PrereqRow>
                  <PrereqRow
                    num="4"
                    title="Fund the fee payer"
                    copyText="solana airdrop 2"
                  >
                    solana <Tok tone="green">airdrop</Tok> 2
                  </PrereqRow>
                  <PrereqRow
                    num="5"
                    title="Point at devnet"
                    copyText="solana config set --url devnet"
                  >
                    solana config <Tok tone="green">set</Tok> --url devnet
                  </PrereqRow>
                </PrereqList>

                <CommandList footnote="# --program-2022 is only needed on create-token — every later command detects the program from the mint">
                  <CommandRow
                    step="01"
                    copyText="spl-token create-token --program-2022"
                    note="# creates mint account"
                  >
                    spl-token <Tok tone="green">create-token</Tok>{" "}
                    --program-2022
                  </CommandRow>
                  <CommandRow
                    step="02"
                    copyText="spl-token create-account <MINT>"
                    note="# creates a token account for the specified mint"
                  >
                    spl-token <Tok tone="green">create-account</Tok>{" "}
                    <Tok tone="mint">&lt;MINT&gt;</Tok>
                  </CommandRow>
                  <CommandRow
                    step="03"
                    copyText="spl-token mint <MINT> 100 <ACCOUNT>"
                    note="# mint 100 tokens of the desired mint to the specified token account"
                  >
                    spl-token <Tok tone="green">mint</Tok>{" "}
                    <Tok tone="mint">&lt;MINT&gt;</Tok>{" "}
                    <Tok tone="green">100</Tok>{" "}
                    <Tok tone="str">&lt;ACCOUNT&gt;</Tok>
                  </CommandRow>
                  <CommandRow
                    step="04"
                    copyText="spl-token transfer <MINT> 25 <RECIPIENT_ACCOUNT>"
                    note="# send 25 to another token account"
                  >
                    spl-token <Tok tone="green">transfer</Tok>{" "}
                    <Tok tone="mint">&lt;MINT&gt;</Tok>{" "}
                    <Tok tone="green">25</Tok>{" "}
                    <Tok tone="str">&lt;RECIPIENT_ACCOUNT&gt;</Tok>
                  </CommandRow>
                  <CommandRow
                    step="05"
                    copyText="spl-token burn <ACCOUNT> 75"
                    note="# destroy units · supply drops"
                  >
                    spl-token <Tok tone="green">burn</Tok>{" "}
                    <Tok tone="str">&lt;ACCOUNT&gt;</Tok>{" "}
                    <Tok tone="green">75</Tok>
                  </CommandRow>
                  <CommandRow
                    step="06"
                    copyText="spl-token close --address <ACCOUNT>"
                    note="# empty accounts only · refunds rent"
                  >
                    spl-token <Tok tone="green">close</Tok> --address{" "}
                    <Tok tone="str">&lt;ACCOUNT&gt;</Tok>
                  </CommandRow>
                  <CommandRow
                    step="✓"
                    ok
                    copyText="spl-token supply <MINT>"
                    note="# verify"
                  >
                    spl-token <Tok tone="green">supply</Tok>{" "}
                    <Tok tone="mint">&lt;MINT&gt;</Tok>
                  </CommandRow>
                </CommandList>
              </TabPanel>
            )}

            {lang === "ts" && (
              <TabPanel>
                <PrereqList>
                  <PrereqRow
                    num="1"
                    title="Install the Kit SDK + clients"
                    copyText="npm i @solana/kit @solana/kit-plugin-rpc @solana/kit-plugin-signer @solana-program/token @solana-program/token-2022"
                  >
                    npm <Tok tone="green">i</Tok> @solana/kit
                    @solana/kit-plugin-rpc @solana/kit-plugin-signer
                    @solana-program/token @solana-program/token-2022
                  </PrereqRow>
                  <PrereqRow
                    num="2"
                    title="Save the code below to a file"
                    copyText="create-token.ts"
                  >
                    create-token.ts
                  </PrereqRow>
                  <PrereqRow
                    num="3"
                    title="Run it"
                    copyText="npx tsx create-token.ts"
                  >
                    npx <Tok tone="green">tsx</Tok> create-token.ts
                  </PrereqRow>
                </PrereqList>
                <CodeSnippet lines={TS_CODE} />
              </TabPanel>
            )}

            {lang === "rust" && (
              <TabPanel>
                <PrereqList>
                  <PrereqRow
                    num="1"
                    title="Add the crates"
                    copyText="cargo add solana-client solana-sdk spl-token-2022 spl-associated-token-account"
                  >
                    cargo <Tok tone="green">add</Tok> solana-client solana-sdk
                    spl-token-2022 spl-associated-token-account
                  </PrereqRow>
                  <PrereqRow
                    num="2"
                    title="Create an RPC client"
                    copyText={
                      'let client = RpcClient::new("https://api.devnet.solana.com".to_string());'
                    }
                  >
                    <Tok tone="purple">let</Tok> client = RpcClient::
                    <Tok tone="green">new</Tok>(
                    <Tok tone="str">
                      &quot;https://api.devnet.solana.com&quot;
                    </Tok>
                    .to_string());
                  </PrereqRow>
                  <PrereqRow
                    num="3"
                    title="Create a funded payer (airdrop on devnet)"
                    copyText="let payer = Keypair::new();"
                  >
                    <Tok tone="purple">let</Tok> payer = Keypair::
                    <Tok tone="green">new</Tok>();
                  </PrereqRow>
                </PrereqList>
                <CodeSnippet lines={RUST_CODE} />
              </TabPanel>
            )}
          </CodeDisclosure>

          <SourcesRow>
            <SourceLink href="/docs/tokens">Tokens on Solana</SourceLink>
            <SourceLink href="/developers/cookbook/tokens/create-token-with-metadata">
              Cookbook · Create a Token
            </SourceLink>
            <SourceLink
              external
              href="https://www.npmjs.com/package/@solana/spl-token"
            >
              @solana/spl-token
            </SourceLink>
          </SourcesRow>
        </div>
      </div>
    </section>
  );
}
