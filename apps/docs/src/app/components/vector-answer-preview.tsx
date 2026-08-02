"use client";

import { useEffect, useRef, useState } from "react";
import {
  AccountCard,
  AccountRow,
  AddressPill,
  AnswerIntro,
  CodeDisclosure,
  CodeSnippet,
  CommandArg,
  CommandChip,
  CommandList,
  CommandRow,
  ExecuteButton,
  FlowConnector,
  FlowStep,
  FlowSteps,
  KeyItem,
  KeyLegend,
  LabeledPanel,
  ModelArrows,
  ModelDiagram,
  ModelEmptyState,
  NetworkBadge,
  PanelStack,
  PrereqList,
  PrereqRow,
  ReplayButton,
  ResultBanner,
  SourceLink,
  SourcesRow,
  StepReturns,
  TabBar,
  TabPanel,
  Tok,
  VectorAnswerCard,
  prefersReducedMotion,
  randomAddress,
  useCountUp,
  type CodeLine,
} from "./vector";

/**
 * "Vector answered" interactive walkthrough shown under the Ask Vector hero
 * (Vector Answer Interactive.html, Solana.com Design System). Each Execute
 * click simulates one step of the token-creation flow with a fake devnet
 * address, progressively revealing the next step and building up the live
 * on-chain model (mint account → token accounts). The
 * code-snippets panel has working CLI/TypeScript/Rust tabs and copy buttons.
 * No real transactions — addresses are locally generated placeholders.
 *
 * All presentation lives in the reusable ./vector component family; this
 * file only holds the token-creation content and the step state machine.
 */

/* Copyable command text (kept in sync with the highlighted markup below). */
const CLI_INSTALL_SOLANA =
  'sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"';
const CLI_INSTALL_SPL = "cargo install spl-token-cli";
const CLI_KEYGEN = "solana-keygen new";
const CLI_AIRDROP = "solana airdrop 2";
const CLI_CONFIG = "solana config set --url devnet";
const CLI_CREATE_TOKEN = "spl-token create-token";
const CLI_CREATE_ACCOUNT = "spl-token create-account <MINT>";
const CLI_MINT = "spl-token mint <MINT> 100";
const CLI_SUPPLY = "spl-token supply <MINT>";
const TS_INSTALL =
  "npm i @solana/kit @solana/kit-plugin-rpc @solana/kit-plugin-signer @solana-program/system @solana-program/token";
const RUST_ADD =
  "cargo add solana-client solana-sdk spl-token spl-associated-token-account";
const RUST_CLIENT =
  'let client = RpcClient::new("https://api.devnet.solana.com".to_string());';
const RUST_PAYER = "let payer = Keypair::new();";

const TS_CODE_LINES: CodeLine[] = [
  [
    { text: "import", tone: "kw" },
    " { createClient, generateKeyPairSigner, lamports } ",
    { text: "from", tone: "kw" },
    " ",
    { text: '"@solana/kit"', tone: "str" },
    ";",
  ],
  [
    { text: "import", tone: "kw" },
    " { rpcAirdrop, solanaRpc } ",
    { text: "from", tone: "kw" },
    " ",
    { text: '"@solana/kit-plugin-rpc"', tone: "str" },
    ";",
  ],
  [
    { text: "import", tone: "kw" },
    " { airdropPayer, payer } ",
    { text: "from", tone: "kw" },
    " ",
    { text: '"@solana/kit-plugin-signer"', tone: "str" },
    ";",
  ],
  [
    { text: "import", tone: "kw" },
    " { getCreateAccountInstruction } ",
    { text: "from", tone: "kw" },
    " ",
    { text: '"@solana-program/system"', tone: "str" },
    ";",
  ],
  [{ text: "import", tone: "kw" }, " {"],
  ["  getInitializeMint2Instruction,"],
  ["  getMintSize,"],
  ["  TOKEN_PROGRAM_ADDRESS,"],
  [
    "} ",
    { text: "from", tone: "kw" },
    " ",
    { text: '"@solana-program/token"', tone: "str" },
    ";",
  ],
  [],
  [
    { text: "const", tone: "kw" },
    " sender = ",
    { text: "await", tone: "kw" },
    " ",
    { text: "generateKeyPairSigner", tone: "fn" },
    "(); ",
    { text: "// fee payer + mint authority", tone: "cm" },
  ],
  [
    { text: "const", tone: "kw" },
    " mint = ",
    { text: "await", tone: "kw" },
    " ",
    { text: "generateKeyPairSigner", tone: "fn" },
    "();   ",
    { text: "// the new mint account", tone: "cm" },
  ],
  [],
  [
    { text: "const", tone: "kw" },
    " client = ",
    { text: "await", tone: "kw" },
    " ",
    { text: "createClient", tone: "fn" },
    "()",
  ],
  [
    "  .",
    { text: "use", tone: "fn" },
    "(",
    { text: "payer", tone: "fn" },
    "(sender))",
  ],
  ["  .", { text: "use", tone: "fn" }, "("],
  ["    ", { text: "solanaRpc", tone: "fn" }, "({"],
  [
    "      rpcUrl: ",
    { text: '"https://api.devnet.solana.com"', tone: "str" },
    ",",
  ],
  [
    "      rpcSubscriptionsUrl: ",
    { text: '"wss://api.devnet.solana.com"', tone: "str" },
    ",",
  ],
  ["    }),"],
  ["  )"],
  [
    "  .",
    { text: "use", tone: "fn" },
    "(",
    { text: "rpcAirdrop", tone: "fn" },
    "())",
  ],
  [
    "  .",
    { text: "use", tone: "fn" },
    "(",
    { text: "airdropPayer", tone: "fn" },
    "(",
    { text: "lamports", tone: "fn" },
    "(",
    { text: "1_000_000_000n", tone: "fn" },
    "))); ",
    { text: "// devnet faucet is rate-limited", tone: "cm" },
  ],
  [],
  [
    {
      text: "// A mint account is fixed-size; fund it for rent exemption.",
      tone: "cm",
    },
  ],
  [
    { text: "const", tone: "kw" },
    " space = ",
    { text: "BigInt", tone: "fn" },
    "(",
    { text: "getMintSize", tone: "fn" },
    "());",
  ],
  [
    { text: "const", tone: "kw" },
    " rentLamports = ",
    { text: "await", tone: "kw" },
    " client.",
    { text: "getMinimumBalance", tone: "fn" },
    "(space);",
  ],
  [],
  [
    { text: "const", tone: "kw" },
    " createAccountIx = ",
    { text: "getCreateAccountInstruction", tone: "fn" },
    "({",
  ],
  ["  payer: sender,"],
  [
    "  newAccount: mint,               ",
    { text: "// the mint keypair signs its own creation", tone: "cm" },
  ],
  ["  lamports: rentLamports,"],
  ["  space,"],
  [
    "  programAddress: TOKEN_PROGRAM_ADDRESS, ",
    { text: "// owned by the token program, not system", tone: "cm" },
  ],
  ["});"],
  [],
  [
    { text: "const", tone: "kw" },
    " initializeMintIx = ",
    { text: "getInitializeMint2Instruction", tone: "fn" },
    "({",
  ],
  ["  mint: mint.address,"],
  ["  decimals: ", { text: "9", tone: "fn" }, ","],
  ["  mintAuthority: sender.address,"],
  [
    "  freezeAuthority: ",
    { text: "null", tone: "kw" },
    ",          ",
    { text: "// no freeze authority", tone: "cm" },
  ],
  ["});"],
  [],
  [
    { text: "const", tone: "kw" },
    " { context } = ",
    { text: "await", tone: "kw" },
    " client.",
    { text: "sendTransaction", tone: "fn" },
    "([createAccountIx, initializeMintIx]);",
  ],
  [],
  [
    "console.",
    { text: "log", tone: "fn" },
    "(",
    { text: '"Mint:"', tone: "str" },
    ", mint.address);",
  ],
  [
    "console.",
    { text: "log", tone: "fn" },
    "(",
    { text: '"Signature:"', tone: "str" },
    ", context.signature);",
  ],
];

const RUST_CODE_LINES: CodeLine[] = [
  [{ text: "// 01 · create + initialize the mint (9 decimals)", tone: "cm" }],
  [
    { text: "create_mint", tone: "fn" },
    "(&client, &payer, &mint, ",
    { text: "9", tone: "fn" },
    ")?;",
  ],
  [{ text: "// 02 · associated token account for the payer", tone: "cm" }],
  [
    { text: "let", tone: "kw" },
    " ata = ",
    { text: "get_associated_token_address", tone: "fn" },
    "(&payer.pubkey(), &mint.pubkey());",
  ],
  [
    { text: "create_associated_token_account", tone: "fn" },
    "(&client, &payer, &ata)?;",
  ],
  [{ text: "// 03 · mint 1,000,000 tokens (base units)", tone: "cm" }],
  [
    { text: "mint_to", tone: "fn" },
    "(&client, &mint, &ata, &payer, ",
    { text: "1_000_000", tone: "fn" },
    " * ",
    { text: "10u64", tone: "fn" },
    ".",
    { text: "pow", tone: "fn" },
    "(",
    { text: "9", tone: "fn" },
    "))?;",
  ],
];

const CODE_TABS = [
  { id: "cli", label: "CLI" },
  { id: "ts", label: "TypeScript" },
  { id: "rust", label: "Rust" },
] as const;

type CodeTabId = (typeof CODE_TABS)[number]["id"];

export function VectorAnswerPreview() {
  const [mint, setMint] = useState<string | null>(null);
  const [ata, setAta] = useState<string | null>(null);
  const [minted, setMinted] = useState(false);
  const [busy, setBusy] = useState<0 | 1 | 2 | 3>(0);
  const [codeTab, setCodeTab] = useState<CodeTabId>("cli");

  const runTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const step2Ref = useRef<HTMLDivElement | null>(null);
  const step3Ref = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLSpanElement | null>(null);

  /* Both cells animate from the same value so the mint's supply and the
     token account's amount visibly rise together. */
  const mintedAmount = useCountUp(minted, 1_000_000);
  const mintedDisplay = minted ? mintedAmount.toLocaleString("en-US") : "0";

  useEffect(() => {
    return () => {
      if (runTimer.current) clearTimeout(runTimer.current);
    };
  }, []);

  /* Bring the newly revealed step (or the final result) into view once it
     mounts, so each Execute visibly hands off to the next card. */
  useEffect(() => {
    const target = minted
      ? resultRef.current
      : ata
        ? step3Ref.current
        : mint
          ? step2Ref.current
          : null;
    if (!target) return;
    const behavior = prefersReducedMotion() ? "auto" : "smooth";
    const id = window.setTimeout(() => {
      target.scrollIntoView({ behavior, block: "nearest" });
    }, 80);
    return () => window.clearTimeout(id);
  }, [mint, ata, minted]);

  function reset() {
    if (runTimer.current) clearTimeout(runTimer.current);
    setMint(null);
    setAta(null);
    setMinted(false);
    setBusy(0);
  }

  function runStep(step: 1 | 2 | 3) {
    const done =
      step === 1 ? mint !== null : step === 2 ? ata !== null : minted;
    if (busy !== 0 || done) return;
    setBusy(step);
    runTimer.current = setTimeout(() => {
      if (step === 1) setMint(randomAddress());
      else if (step === 2) setAta(randomAddress());
      else setMinted(true);
      setBusy(0);
    }, 900);
  }

  const show2 = mint !== null;
  const show3 = ata !== null;
  const showBtn1 = mint === null;
  const showBtn2 = mint !== null && ata === null;
  const showBtn3 = ata !== null && !minted;

  return (
    <VectorAnswerCard
      question="How do I create a token?"
      ariaLabel="Interactive example of a Vector answer"
    >
      <AnswerIntro>
        To create a token on Solana, you&rsquo;ll make three small things — the
        coin itself, a place for your wallet to hold it, and its starting
        supply.
      </AnswerIntro>

      {/* column-reverse: the flow group renders below the live model */}
      <PanelStack>
        <LabeledPanel label="Token creation flow">
          <KeyLegend>
            <KeyItem tone="mint" symbol="◆">
              mint address
            </KeyItem>
            <KeyItem tone="account" symbol="●">
              token account address
            </KeyItem>
          </KeyLegend>

          <FlowSteps>
            <FlowStep
              num="01"
              title="Create the mint"
              sub="one mint per token, it defines the global information of that token on chain"
              done={mint !== null}
              description={
                showBtn1 ? (
                  <>
                    A mint account is the token&rsquo;s on-chain definition —
                    its decimals, total supply counter, and the mint authority
                    allowed to create new units. It holds no one&rsquo;s
                    balance; the address it returns is your token&rsquo;s
                    identity everywhere.
                  </>
                ) : undefined
              }
            >
              <CommandChip>spl-token create-token</CommandChip>
              {showBtn1 && (
                <ExecuteButton
                  busy={busy === 1}
                  disabled={busy !== 0}
                  onClick={() => runStep(1)}
                />
              )}
              {mint && (
                <StepReturns tone="mint">
                  <AddressPill
                    tone="mint"
                    wide
                    symbol="◆"
                    label="mint address"
                    value={mint}
                  />
                </StepReturns>
              )}
            </FlowStep>

            {/* Connector 1 → 2 */}
            {show2 && (
              <FlowConnector>
                <AddressPill tone="mint" bounce symbol="◆" value={mint} />
              </FlowConnector>
            )}

            {/* Step 02 — create a token account */}
            {show2 && (
              <FlowStep
                ref={step2Ref}
                num="02"
                title="Create a token account"
                sub="each wallet needs a token account of the mint to be able to hold that token"
                reveal
                done={ata !== null}
                description={
                  showBtn2 ? (
                    <>
                      Wallets don&rsquo;t hold tokens directly. Each token you
                      own lives in a token account tied to one mint and one
                      owner — this creates yours (an &ldquo;associated token
                      account&rdquo; derived from your wallet + the mint), ready
                      to receive supply.
                    </>
                  ) : undefined
                }
              >
                <CommandChip>
                  spl-token create-account{" "}
                  <CommandArg tone="mint" strong>
                    ◆ {mint}
                  </CommandArg>
                </CommandChip>
                {showBtn2 && (
                  <ExecuteButton
                    busy={busy === 2}
                    disabled={busy !== 0}
                    onClick={() => runStep(2)}
                  />
                )}
                {ata && (
                  <StepReturns tone="account">
                    <AddressPill
                      tone="account"
                      wide
                      symbol="●"
                      label="token account address"
                      value={ata}
                      valueTone="green"
                    />
                  </StepReturns>
                )}
              </FlowStep>
            )}

            {/* Connector 2 → 3 */}
            {show3 && (
              <FlowConnector>
                <AddressPill tone="mint" bounce symbol="◆" value={mint} />
                <AddressPill
                  tone="account"
                  bounce
                  bounceLate
                  symbol="●"
                  value={ata}
                />
              </FlowConnector>
            )}

            {/* Step 03 — mint the supply */}
            {show3 && (
              <FlowStep
                ref={step3Ref}
                num="03"
                title="Mint the supply"
                sub="the total supply in the mint account is equal to the sum of all the tokens across all token accounts of that mint"
                reveal
                done={minted}
                actionsColumn
                description={
                  showBtn3 ? (
                    <>
                      Only the mint authority can do this. Minting increases the
                      mint&rsquo;s global supply and credits the destination
                      token account in the same step. The CLI takes whole-token
                      amounts; on-chain, the program tracks base units (with 9
                      decimals, 1 token = 10⁹).
                    </>
                  ) : undefined
                }
              >
                <CommandChip wide>
                  spl-token mint <CommandArg tone="mint">◆ {mint}</CommandArg>{" "}
                  1000000 <CommandArg tone="account">● {ata}</CommandArg>
                </CommandChip>
                {showBtn3 && (
                  <ExecuteButton
                    busy={busy === 3}
                    disabled={busy !== 0}
                    onClick={() => runStep(3)}
                  />
                )}
                {minted && (
                  <StepReturns tone="account" word="result" ref={resultRef}>
                    <ResultBanner>
                      result: balance = 1,000,000 tokens
                    </ResultBanner>
                  </StepReturns>
                )}
                {minted && <ReplayButton onClick={reset} />}
              </FlowStep>
            )}
          </FlowSteps>

          <NetworkBadge name="devnet" />
        </LabeledPanel>

        <LabeledPanel label="Live model" sticky>
          {!mint && (
            <ModelEmptyState>
              Execute step 01 to build the model →
            </ModelEmptyState>
          )}

          {mint && (
            <ModelDiagram>
              {ata && (
                <ModelArrows
                  markerId="vap-lm-arrow"
                  paths={[
                    "M340 116 C 398 88, 418 70, 456 66",
                    "M340 170 C 398 178, 418 184, 456 186",
                  ]}
                />
              )}

              <AccountCard
                variant="mint"
                tag="◆ MINT ACCOUNT"
                address={mint}
                write={minted}
              >
                <AccountRow label="mint_authority" tone="mint">
                  you.sol
                </AccountRow>
                <AccountRow
                  label="supply"
                  tone={minted ? "green" : "white"}
                  pop={minted}
                >
                  {mintedDisplay}
                </AccountRow>
                <AccountRow label="decimals">9</AccountRow>
                <AccountRow label="freeze_authority">None</AccountRow>
              </AccountCard>

              {ata && (
                <>
                  <AccountCard
                    variant="token"
                    tag="● TOKEN ACCT"
                    address={ata}
                    write={minted}
                  >
                    <AccountRow label="mint" tone="mint">
                      ◆ {mint}
                    </AccountRow>
                    <AccountRow label="owner">you.sol</AccountRow>
                    <AccountRow
                      label="amount"
                      tone={minted ? "green" : "dim"}
                      strong
                      pop={minted}
                    >
                      {mintedDisplay}
                    </AccountRow>
                  </AccountCard>

                  <AccountCard
                    variant="token-muted"
                    tag="● TOKEN ACCT"
                    address="another holder"
                  >
                    <AccountRow label="mint" tone="mint">
                      ◆ {mint}
                    </AccountRow>
                    <AccountRow label="owner">bob.sol</AccountRow>
                    <AccountRow label="amount" tone="dim" strong>
                      0
                    </AccountRow>
                  </AccountCard>
                </>
              )}
            </ModelDiagram>
          )}
        </LabeledPanel>
      </PanelStack>

      <CodeDisclosure summary="View the code snippets for each step demonstrated above">
        <TabBar tabs={CODE_TABS} active={codeTab} onSelect={setCodeTab} />

        {codeTab === "cli" && (
          <TabPanel>
            <PrereqList>
              <PrereqRow
                num="1"
                title="Install the Solana CLI"
                copyText={CLI_INSTALL_SOLANA}
              >
                sh -c &quot;$(curl -sSfL
                https://release.anza.xyz/stable/install)&quot;
              </PrereqRow>
              <PrereqRow
                num="2"
                title="Install the token CLI"
                copyText={CLI_INSTALL_SPL}
              >
                cargo <Tok tone="green">install</Tok> spl-token-cli
              </PrereqRow>
              <PrereqRow
                num="3"
                title="Create a keypair (skip if you have one)"
                copyText={CLI_KEYGEN}
              >
                solana-keygen <Tok tone="green">new</Tok>
              </PrereqRow>
              <PrereqRow
                num="4"
                title="Fund the fee payer"
                copyText={CLI_AIRDROP}
              >
                solana <Tok tone="green">airdrop</Tok> 2
              </PrereqRow>
              <PrereqRow num="5" title="Point at devnet" copyText={CLI_CONFIG}>
                solana config <Tok tone="green">set</Tok> --url devnet
              </PrereqRow>
            </PrereqList>

            <CommandList footnote="# Token-2022 instead of the original program: add --program-2022 to create-token">
              <CommandRow
                step="01"
                note="# → prints the new mint address"
                copyText={CLI_CREATE_TOKEN}
              >
                spl-token <Tok tone="green">create-token</Tok>
              </CommandRow>
              <CommandRow
                step="02"
                note="# your associated token account for it"
                copyText={CLI_CREATE_ACCOUNT}
              >
                spl-token <Tok tone="green">create-account</Tok>{" "}
                <Tok tone="mint">&lt;MINT&gt;</Tok>
              </CommandRow>
              <CommandRow
                step="03"
                note="# mint 100 tokens to that account"
                copyText={CLI_MINT}
              >
                spl-token <Tok tone="green">mint</Tok>{" "}
                <Tok tone="mint">&lt;MINT&gt;</Tok> <Tok tone="green">100</Tok>
              </CommandRow>
              <CommandRow step="✓" ok note="# verify" copyText={CLI_SUPPLY}>
                spl-token <Tok tone="green">supply</Tok>{" "}
                <Tok tone="mint">&lt;MINT&gt;</Tok>
              </CommandRow>
            </CommandList>
          </TabPanel>
        )}

        {codeTab === "ts" && (
          <TabPanel>
            <PrereqList>
              <PrereqRow
                num="1"
                title="Install the Kit SDK + clients"
                copyText={TS_INSTALL}
              >
                npm i{" "}
                <Tok tone="str">
                  @solana/kit @solana/kit-plugin-rpc @solana/kit-plugin-signer
                  @solana-program/system @solana-program/token
                </Tok>
              </PrereqRow>
            </PrereqList>
            <CodeSnippet lines={TS_CODE_LINES} />
          </TabPanel>
        )}

        {codeTab === "rust" && (
          <TabPanel>
            <PrereqList>
              <PrereqRow num="1" title="Add the crates" copyText={RUST_ADD}>
                cargo <Tok tone="green">add</Tok>{" "}
                <Tok tone="str">
                  solana-client solana-sdk spl-token
                  spl-associated-token-account
                </Tok>
              </PrereqRow>
              <PrereqRow
                num="2"
                title="Create an RPC client"
                copyText={RUST_CLIENT}
              >
                <Tok tone="purple">let</Tok> client ={" "}
                <Tok tone="green">RpcClient</Tok>::
                <Tok tone="green">new</Tok>(
                <Tok tone="str">&quot;https://api.devnet.solana.com&quot;</Tok>
                .to_string());
              </PrereqRow>
              <PrereqRow
                num="3"
                title="Create a funded payer (airdrop on devnet)"
                copyText={RUST_PAYER}
              >
                <Tok tone="purple">let</Tok> payer ={" "}
                <Tok tone="green">Keypair</Tok>::<Tok tone="green">new</Tok>();
              </PrereqRow>
            </PrereqList>
            <CodeSnippet lines={RUST_CODE_LINES} />
          </TabPanel>
        )}
      </CodeDisclosure>

      <SourcesRow>
        <SourceLink href="/docs/tokens">Tokens on Solana</SourceLink>
        <SourceLink href="/developers/cookbook/tokens/create-token-with-metadata">
          Cookbook · Create a Token
        </SourceLink>
        <SourceLink
          href="https://www.npmjs.com/package/@solana/spl-token"
          external
        >
          @solana/spl-token
        </SourceLink>
      </SourcesRow>
    </VectorAnswerCard>
  );
}
