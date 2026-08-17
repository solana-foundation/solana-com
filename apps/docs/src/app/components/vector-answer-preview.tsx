"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";
import {
  AnswerIntro,
  CodeDisclosure,
  CodeSnippet,
  CommandList,
  CommandRow,
  CommandTerminal,
  ExecuteButton,
  FlowArrows,
  KeyItem,
  KeyLegend,
  LabeledPanel,
  ModelEmptyState,
  NetworkBadge,
  PanelStack,
  PrereqList,
  PrereqRow,
  SourceLink,
  SourcesRow,
  StepUses,
  TabBar,
  TabPanel,
  Tok,
  UseChip,
  VectorAnswerCard,
  type CodeLine,
} from "./vector";
import styles from "./vector-answer-preview.module.css";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], display: "swap" });

/**
 * "Vector answered" live-answer preview shown under the Ask Vector hero
 * (Vector Answer Export.html, Solana.com Design System). A showcase of an
 * agent answer composed from the Vector design-system family
 * (@solana-com/ui-chrome/ask-solana/vector): intro sentence, the live model +
 * token-creation-flow panels, a collapsible per-step code-snippets panel
 * (native details), and source links. Executing a step simulates the command
 * and builds the live model; the language tabs remain part of the mock. The
 * scripted-walkthrough chrome (stepper timeline, live-model viz, back/replay
 * controls) is preview-specific and stays local; vector-answer-preview.module.css
 * also carries the hero's larger type scale as overrides on the family pieces.
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
        creates → <Tok tone="mint">◆ mint address</Tok> · needed in steps 02 +
        03
      </>
    ),
    out: (
      <>
        ✓ mint created · <Tok tone="mint">{MINT_ADDR}</Tok>
      </>
    ),
  },
  {
    num: "02",
    title: "Create your token account",
    desc: "Wallets don’t hold tokens directly — every holder needs a token account tied to the mint. This creates yours (the associated token account), which starts out empty at balance 0.",
    usesLabel: "needs step 01’s result",
    uses: [{ kind: "mint", label: "mint" }],
    cmd: (
      <>
        spl-token create-account{" "}
        <Tok tone="mint" flowTarget="mint">
          {MINT_ADDR}
        </Tok>
      </>
    ),
    returns: (
      <>
        creates → <Tok tone="account">● token account address</Tok> · needed in
        step 03
      </>
    ),
    out: (
      <>
        ✓ account created · <Tok tone="account">{ACCOUNT_ADDR}</Tok>
      </>
    ),
  },
  {
    num: "03",
    title: "Mint the starting supply",
    desc: "The mint authority creates 100 new units directly into your token account. The supply counter on the mint and the balance in your account both become 100.",
    usesLabel: "needs steps 01 + 02’s results",
    uses: [
      { kind: "mint", label: "mint" },
      { kind: "account", label: "account" },
    ],
    cmd: (
      <>
        spl-token mint{" "}
        <Tok tone="mint" flowTarget="mint">
          {MINT_ADDR}
        </Tok>{" "}
        100{" "}
        <Tok tone="account" flowTarget="account">
          {ACCOUNT_ADDR}
        </Tok>
      </>
    ),
    returns: (
      <>
        result → supply 100 on the mint · <Tok tone="account">balance 100</Tok>{" "}
        in your account
      </>
    ),
    out: "✓ minted 100 · balance 100",
  },
  {
    num: "04",
    title: "Transfer to another holder",
    desc: "Transfers move units between token accounts of the same mint. This sends 25 to another holder’s token account — your balance drops, theirs grows, and the supply stays untouched.",
    usesLabel: "needs step 01’s result",
    uses: [{ kind: "mint", label: "mint" }],
    cmd: (
      <>
        spl-token transfer{" "}
        <Tok tone="mint" flowTarget="mint">
          {MINT_ADDR}
        </Tok>{" "}
        25 <Tok tone="account">{RECIPIENT_ADDR}</Tok>
      </>
    ),
    returns: (
      <>
        result → your balance 75 · <Tok tone="account">their balance 25</Tok>
      </>
    ),
    out: (
      <>
        ✓ sent 25 · <Tok tone="account">{RECIPIENT_ADDR}</Tok>
      </>
    ),
  },
  {
    num: "05",
    title: "Burn the rest of your balance",
    desc: "Burning destroys units out of a token account and shrinks the mint’s supply — the only way supply goes down. Emptying your account here is what lets step 06 close it.",
    usesLabel: "needs step 02’s result",
    uses: [{ kind: "account", label: "account" }],
    cmd: (
      <>
        spl-token burn{" "}
        <Tok tone="account" flowTarget="account">
          {ACCOUNT_ADDR}
        </Tok>{" "}
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
    uses: [{ kind: "account", label: "account" }],
    cmd: (
      <>
        spl-token close --address{" "}
        <Tok tone="account" flowTarget="account">
          {ACCOUNT_ADDR}
        </Tok>
      </>
    ),
    returns: (
      <>
        result → rent back in your wallet · the mint and{" "}
        <Tok tone="account">their balance 25</Tok> live on
      </>
    ),
    out: "✓ account closed · rent reclaimed",
  },
];

export function VectorAnswerPreview() {
  const [done, setDone] = useState(0);
  const [running, setRunning] = useState(false);
  const [lang, setLang] = useState<SnippetLang>("cli");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

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
    <VectorAnswerCard
      className={styles.frame}
      question="How do I create a token?"
      ariaLabel="Example of a Vector answer"
    >
      <AnswerIntro className={styles.introLg}>
        To create a token on Solana, you&rsquo;ll make three small things — the
        coin itself, a place for your wallet to hold it, and its starting
        supply.
      </AnswerIntro>

      {/* Side by side: live model left, creation flow right; the grid
          collapses to a single stacked column on narrow containers. */}
      <PanelStack className={styles.panelsLg}>
        <LabeledPanel label="Live model" className={styles.modelGroup}>
          <div className={styles.modelBody} aria-live="polite">
            <div className={styles.modelTitle}>
              On-chain State{" "}
              <span className={styles.modelSub}>
                — updates as you execute each step
              </span>
            </div>
            {done === 0 ? (
              <ModelEmptyState className={styles.modelEmptyLg}>
                Run step 01 to build the model →
              </ModelEmptyState>
            ) : (
              <div className={styles.modelViz}>
                <div className={`${styles.acctCard} ${styles.acctMint}`}>
                  <div className={styles.acctHead}>
                    <span className={styles.acctGlyphMint} aria-hidden="true">
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
                      <span className={styles.fieldKey}>mint authority</span>
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
                            deleted — rent refunded to your wallet. The mint and
                            other holders live on.
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
                              <span className={styles.fieldKey}>balance</span>
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
                              <span className={styles.fieldKey}>balance</span>
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
        </LabeledPanel>

        <LabeledPanel label="Token creation flow" className={styles.flowGroup}>
          <KeyLegend>
            <KeyItem tone="mint" symbol="◆">
              mint address
            </KeyItem>
            <KeyItem tone="account" symbol="●">
              token account address
            </KeyItem>
          </KeyLegend>

          <div className={styles.stepList}>
            {STEPS.map((s, i) => {
              const isDone = i < done;
              const isActive = i === done;
              const showRail = i < STEPS.length - 1 || done === STEPS.length;
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
                          <span className={styles.stepTitle}>{s.title}</span>
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
                          <StepUses
                            className={styles.stepUsesLg}
                            label={s.usesLabel}
                          >
                            {s.uses.map((u) => (
                              <UseChip
                                key={u.kind}
                                tone={u.kind}
                                source={u.kind}
                              >
                                {u.kind === "mint" ? "◆" : "●"} {u.label}
                              </UseChip>
                            ))}
                          </StepUses>
                        )}
                        <CommandTerminal
                          className={styles.terminalLg}
                          action={
                            <>
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
                              <ExecuteButton
                                className={styles.executeLg}
                                busy={running}
                                busyLabel="Running"
                                disabled={running}
                                onClick={execute}
                              />
                            </>
                          }
                        >
                          {s.cmd}
                        </CommandTerminal>
                        <div
                          className={`${styles.stepReturns} ${jetbrainsMono.className}`}
                        >
                          {s.returns}
                        </div>
                        <FlowArrows containerRef={cardRef} signal={done} />
                      </div>
                    ) : (
                      <div
                        className={`${styles.tlRow} ${
                          isDone ? "" : styles.tlRowTodo
                        }`}
                      >
                        <span className={styles.tlRowTitle}>{s.title}</span>
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

          <NetworkBadge className={styles.devnetLg} />
        </LabeledPanel>
      </PanelStack>

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
                spl-token <Tok tone="green">create-token</Tok> --program-2022
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
                <Tok tone="mint">&lt;MINT&gt;</Tok> <Tok tone="green">100</Tok>{" "}
                <Tok tone="str">&lt;ACCOUNT&gt;</Tok>
              </CommandRow>
              <CommandRow
                step="04"
                copyText="spl-token transfer <MINT> 25 <RECIPIENT_ACCOUNT>"
                note="# send 25 to another token account"
              >
                spl-token <Tok tone="green">transfer</Tok>{" "}
                <Tok tone="mint">&lt;MINT&gt;</Tok> <Tok tone="green">25</Tok>{" "}
                <Tok tone="str">&lt;RECIPIENT_ACCOUNT&gt;</Tok>
              </CommandRow>
              <CommandRow
                step="05"
                copyText="spl-token burn <ACCOUNT> 75"
                note="# destroy units · supply drops"
              >
                spl-token <Tok tone="green">burn</Tok>{" "}
                <Tok tone="str">&lt;ACCOUNT&gt;</Tok> <Tok tone="green">75</Tok>
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
                npm <Tok tone="green">i</Tok> @solana/kit @solana/kit-plugin-rpc
                @solana/kit-plugin-signer @solana-program/token
                @solana-program/token-2022
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
                <Tok tone="str">&quot;https://api.devnet.solana.com&quot;</Tok>
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
    </VectorAnswerCard>
  );
}
