"use client";

import {
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Code2,
  ExternalLink,
  GitBranch,
  Play,
  RotateCcw,
  ShieldCheck,
  Trophy,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  getBrowserStorage,
  safeStorageGetItem,
  safeStorageSetItem,
} from "@solana-com/ui-chrome";
import styles from "./concepts-roadmap.module.scss";

type RoadmapResource = {
  label: string;
  href: string;
  type: "Read" | "Watch" | "Build";
};

type CoreStep = {
  id: string;
  number: string;
  phase: "Get ready" | "Learn" | "Build and ship";
  title: string;
  description: string;
  resources: RoadmapResource[];
  doneWhen: string;
};

type Branch = {
  id: string;
  label: string;
  title: string;
  description: string;
  resources: RoadmapResource[];
};

type RoadmapDetail = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  resources: RoadmapResource[];
  doneWhen?: string;
  canComplete: boolean;
};

type EntryRoute = "new" | "ethereum";

type StoredProgress = {
  completedIds: string[];
  entryRoute: EntryRoute;
  assessmentPassed: boolean;
};

type MultipleChoiceQuestion = {
  id: string;
  type: "multiple-choice";
  question: string;
  answers: readonly string[];
  correctAnswer: number;
};

type WrittenQuestion = {
  id: string;
  type: "written";
  question: string;
  hint: string;
};

type IntermediateQuestion = MultipleChoiceQuestion | WrittenQuestion;

const STORAGE_KEY = "solana:docs:concepts-roadmap:v2";

const INTERMEDIATE_QUESTIONS = [
  {
    id: "persistent-state",
    type: "multiple-choice",
    question:
      "Where should a Solana program keep persistent application state?",
    answers: [
      "Inside the deployed program binary",
      "In accounts owned by the program",
      "In the transaction's recent blockhash",
    ],
    correctAnswer: 1,
  },
  {
    id: "atomic-transactions",
    type: "multiple-choice",
    question:
      "What happens when the third instruction in a Solana transaction fails?",
    answers: [
      "Only the third instruction is reverted",
      "The first two instructions remain committed",
      "The entire transaction fails atomically",
    ],
    correctAnswer: 2,
  },
  {
    id: "pda-authority",
    type: "multiple-choice",
    question: "How can a program authorize an action for one of its PDAs?",
    answers: [
      "The runtime verifies the program's seeds and bump during signing",
      "The PDA stores and exposes a private key",
      "Any transaction signer can impersonate the PDA",
    ],
    correctAnswer: 0,
  },
  {
    id: "compute-review",
    type: "multiple-choice",
    question: "What should happen before optimizing a program's compute use?",
    answers: [
      "Remove account validation to save units",
      "Measure compute and cover important failure paths",
      "Increase every transaction's priority fee",
    ],
    correctAnswer: 1,
  },
  {
    id: "vault-security-review",
    type: "written",
    question:
      "A vault withdrawal receives a vault account, authority, destination, and amount. In 2–4 sentences, what should the program verify before moving funds?",
    hint: "Think about authority, account relationships, and the requested transfer.",
  },
] as const satisfies readonly IntermediateQuestion[];

const CORE_STEPS: CoreStep[] = [
  {
    id: "mental-model",
    number: "01",
    phase: "Get ready",
    title: "Learn the Solana mental model",
    description:
      "Start with the execution model: accounts hold state, programs process instructions, and transactions group work atomically.",
    resources: [
      {
        label: "Intro to Blockchain",
        href: "/developers/bootcamp/foundations/quick-intro-to-blockchain",
        type: "Watch",
      },
    ],
    doneWhen:
      "You can explain the difference between an account, a program, an instruction, and a transaction.",
  },
  {
    id: "local-setup",
    number: "02",
    phase: "Get ready",
    title: "Project 1: set up locally",
    description:
      "Install the shared toolchain and verify that the CLI, Rust, Anchor, and local validator work together.",
    resources: [
      {
        label: "Local Installation",
        href: "/developers/bootcamp/foundations/local-installation",
        type: "Watch",
      },
    ],
    doneWhen:
      "The project checks pass and you can start a local validator without errors.",
  },
  {
    id: "hello-world",
    number: "03",
    phase: "Get ready",
    title: "Project 2: build Hello World",
    description:
      "Complete the first end-to-end app before adding more concepts. Run it and inspect the resulting transaction.",
    resources: [
      {
        label: "Hello World",
        href: "/developers/bootcamp/foundations/hello-world",
        type: "Build",
      },
    ],
    doneWhen:
      "Your app sends a transaction successfully and you can find its signature in an explorer.",
  },
  {
    id: "accounts-programs",
    number: "04",
    phase: "Learn",
    title: "Understand accounts and programs",
    description:
      "Read these together. Accounts store state; programs are stateless code that can modify the accounts passed to them.",
    resources: [
      {
        label: "Accounts",
        href: "/docs/core/accounts",
        type: "Read",
      },
      {
        label: "Programs",
        href: "/docs/core/programs",
        type: "Read",
      },
    ],
    doneWhen:
      "Given an account, you can identify its address, owner, data, lamports, and whether it is executable.",
  },
  {
    id: "transactions",
    number: "05",
    phase: "Learn",
    title: "Follow a transaction",
    description:
      "Learn how instructions declare accounts and data, how transactions combine them, and where execution costs come from.",
    resources: [
      {
        label: "Instructions",
        href: "/docs/core/instructions",
        type: "Read",
      },
      {
        label: "Transactions",
        href: "/docs/core/transactions",
        type: "Read",
      },
      {
        label: "Fees",
        href: "/docs/core/fees",
        type: "Read",
      },
    ],
    doneWhen:
      "You can inspect a transaction and identify its signers, writable accounts, instructions, blockhash, and fee.",
  },
  {
    id: "pda-cpi",
    number: "06",
    phase: "Learn",
    title: "Learn program authority",
    description:
      "PDAs give programs deterministic addresses and signing authority. CPIs let programs call and compose with other programs.",
    resources: [
      {
        label: "Program Derived Addresses",
        href: "/docs/core/pda",
        type: "Read",
      },
      {
        label: "Cross-Program Invocations",
        href: "/docs/core/cpi",
        type: "Read",
      },
    ],
    doneWhen:
      "You can derive a PDA, explain its seeds and bump, and describe how it signs during a CPI.",
  },
  {
    id: "stateful-program",
    number: "07",
    phase: "Build and ship",
    title: "Build one stateful program",
    description:
      "Learn the Anchor account model, then use it in a small vault challenge. Do not move on until the failure cases make sense.",
    resources: [
      {
        label: "Anchor Accounts",
        href: "https://learn.blueshift.gg/en/courses/anchor-for-dummies/anchor-accounts",
        type: "Read",
      },
      {
        label: "Anchor Vault Challenge",
        href: "https://learn.blueshift.gg/en/challenges/anchor-vault",
        type: "Build",
      },
    ],
    doneWhen:
      "Your vault initializes, accepts a deposit, withdraws only with the correct authority, and rejects invalid signers.",
  },
  {
    id: "client-integration",
    number: "08",
    phase: "Build and ship",
    title: "Build the client side",
    description:
      "Connect a real interface to your program. Construct instructions, simulate transactions, surface wallet errors, and confirm finality.",
    resources: [
      {
        label: "Frontend Client",
        href: "/docs/frontend/client",
        type: "Read",
      },
      {
        label: "React Hooks",
        href: "/docs/frontend/react-hooks",
        type: "Build",
      },
    ],
    doneWhen:
      "A user can connect a wallet, submit every core instruction, see useful failures, and confirm the resulting account changes.",
  },
  {
    id: "test-optimize",
    number: "09",
    phase: "Build and ship",
    title: "Test and profile the program",
    description:
      "Move beyond happy-path tests. Cover invalid authorities and account states, then measure compute before optimizing.",
    resources: [
      {
        label: "Testing with Mollusk",
        href: "/docs/programs/testing/mollusk",
        type: "Build",
      },
      {
        label: "Compute Budget",
        href: "/docs/core/fees/compute-budget",
        type: "Read",
      },
      {
        label: "Transaction Pipeline",
        href: "/docs/core/transactions/transaction-pipeline",
        type: "Read",
      },
    ],
    doneWhen:
      "Your tests prove the important failure cases and you can explain where the program spends compute units.",
  },
  {
    id: "index-data",
    number: "10",
    phase: "Build and ship",
    title: "Index and observe onchain data",
    description:
      "Build the read path for your application instead of treating RPC calls as a database. Track events, account changes, and failed transactions.",
    resources: [
      {
        label: "Indexing",
        href: "/developers/bootcamp/shipping-production/indexing",
        type: "Build",
      },
      {
        label: "Transaction Introspection",
        href: "/docs/core/transactions/transaction-introspection",
        type: "Read",
      },
    ],
    doneWhen:
      "Your application can reconstruct its important state, diagnose a failed transaction, and alert on unexpected behavior.",
  },
  {
    id: "security-production",
    number: "11",
    phase: "Build and ship",
    title: "Test, review, and ship",
    description:
      "Finish the shared path by testing account constraints, reviewing the common security failures, and preparing a production deployment.",
    resources: [
      {
        label: "Security",
        href: "/developers/bootcamp/program-patterns/security",
        type: "Watch",
      },
      {
        label: "Production Readiness",
        href: "/developers/bootcamp/shipping-production/production-readiness",
        type: "Watch",
      },
      {
        label: "Verified Builds",
        href: "/docs/programs/verified-builds",
        type: "Read",
      },
    ],
    doneWhen:
      "Critical instructions have negative tests, authorities are explicit, deployment keys are controlled, and monitoring is planned.",
  },
];

const ETHEREUM_STEP: CoreStep = {
  id: "ethereum-transfer",
  number: "E1",
  phase: "Get ready",
  title: "Translate EVM to SVM",
  description:
    "Use your Ethereum knowledge as the starting point. Translate storage, contract calls, signatures, and program authority into Solana's model.",
  resources: [
    {
      label: "EVM to SVM guide",
      href: "https://solana.com/developers/evm-to-svm/complete-guide",
      type: "Read",
    },
    {
      label: "Eth to Sol",
      href: "https://ethtosol.mcgee.cat",
      type: "Build",
    },
  ],
  doneWhen:
    "You can map contract storage to accounts, contract calls to instructions, and contract-owned state to PDAs.",
};

const PRODUCT_BRANCHES: Branch[] = [
  {
    id: "privacy",
    label: "Product branch",
    title: "Privacy",
    description:
      "Take this branch when your application needs private balances or transfers.",
    resources: [
      {
        label: "Private Transfers",
        href: "/developers/bootcamp/fullstack-apps/private-transfers",
        type: "Build",
      },
      {
        label: "Confidential Transfers",
        href: "/docs/tokens/extensions/confidential-transfer",
        type: "Read",
      },
    ],
  },
  {
    id: "institutional",
    label: "Product branch",
    title: "Institutional assets",
    description:
      "Take this branch for stablecoins, tokenized assets, and issuer-controlled flows.",
    resources: [
      {
        label: "Stable Coin",
        href: "/developers/bootcamp/program-patterns/stable-coin",
        type: "Build",
      },
      {
        label: "Real-World Assets",
        href: "/developers/bootcamp/fullstack-apps/real-world-assets",
        type: "Build",
      },
    ],
  },
];

const INTRO_STEP = CORE_STEPS[0];
const SHARED_SETUP_STEPS = CORE_STEPS.slice(1, 3);
const STANDARD_FOUNDATION_STEPS = CORE_STEPS.slice(3, 6);
const INTERMEDIATE_STEPS = CORE_STEPS.slice(6, 10);
const FINAL_STEP = CORE_STEPS[10];

function ResourceLink({ resource }: { resource: RoadmapResource }) {
  return (
    <a
      className={styles.resourceLink}
      href={resource.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.resourceType}>{resource.type}</span>
      <span>{resource.label}</span>
      <ExternalLink aria-hidden="true" size={14} />
    </a>
  );
}

function readProgress(): StoredProgress {
  const emptyProgress: StoredProgress = {
    completedIds: [],
    entryRoute: "new",
    assessmentPassed: false,
  };

  if (typeof window === "undefined") return emptyProgress;

  const value = safeStorageGetItem(
    getBrowserStorage("localStorage"),
    STORAGE_KEY,
  );
  if (!value) return emptyProgress;

  try {
    const parsed = JSON.parse(value) as Partial<StoredProgress>;
    const validIds = new Set([
      ...CORE_STEPS.map((step) => step.id),
      ETHEREUM_STEP.id,
      ...PRODUCT_BRANCHES.map((branch) => branch.id),
    ]);

    return {
      completedIds: Array.isArray(parsed.completedIds)
        ? parsed.completedIds.filter(
            (item): item is string =>
              typeof item === "string" && validIds.has(item),
          )
        : [],
      entryRoute: parsed.entryRoute === "ethereum" ? "ethereum" : "new",
      assessmentPassed: parsed.assessmentPassed === true,
    };
  } catch {
    return emptyProgress;
  }
}

function RoadmapStep({
  step,
  isComplete,
  isNext,
  onToggle,
  onOpen,
  side,
}: {
  step: CoreStep;
  isComplete: boolean;
  isNext: boolean;
  onToggle: (_id: string) => void;
  onOpen: (_step: CoreStep) => void;
  side: "left" | "right" | "center";
}) {
  return (
    <article
      className={`${styles.mapRow} ${
        side === "left"
          ? styles.mapRowLeft
          : side === "right"
            ? styles.mapRowRight
            : styles.mapRowCenter
      } ${
        isComplete ? styles.stepComplete : ""
      } ${isNext ? styles.stepNext : ""}`}
    >
      <div className={styles.stepCluster}>
        <button
          type="button"
          className={styles.stepOpenButton}
          onClick={() => onOpen(step)}
          aria-label={`Open resources for ${step.title}`}
        />
        <header className={styles.mainNode}>
          <div>
            <span className={styles.stepNumber}>
              {step.number} <span>{step.phase}</span>
            </span>
            <h3>{step.title}</h3>
          </div>
          <div className={styles.nodeControls}>
            {isNext && !isComplete ? (
              <span className={styles.nextLabel}>Next</span>
            ) : null}
            <button
              type="button"
              onClick={() => onToggle(step.id)}
              aria-pressed={isComplete}
              aria-label={`${
                isComplete ? "Mark incomplete" : "Mark complete"
              }: ${step.title}`}
            >
              {isComplete ? (
                <Check aria-hidden="true" size={15} strokeWidth={2.6} />
              ) : (
                <Circle aria-hidden="true" size={9} fill="currentColor" />
              )}
            </button>
          </div>
        </header>
        <p className={styles.stepDescription}>{step.description}</p>
        <div className={styles.stepMeta}>
          <span>
            <BookOpen aria-hidden="true" size={14} />
            {step.resources.length}{" "}
            {step.resources.length === 1 ? "resource" : "resources"}
          </span>
          <span>
            Open
            <ChevronRight aria-hidden="true" size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}

function RoadmapResourceDrawer({
  detail,
  isComplete,
  onOpenChange,
  onToggle,
}: {
  detail: RoadmapDetail | null;
  isComplete: boolean;
  onOpenChange: (_open: boolean) => void;
  onToggle: (_id: string) => void;
}) {
  return (
    <Dialog.Root open={detail !== null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.drawerOverlay} />
        <Dialog.Content className={styles.resourceDrawer}>
          {detail ? (
            <>
              <header className={styles.drawerTopbar}>
                <span>
                  <BookOpen aria-hidden="true" size={16} />
                  Resources
                </span>
                <div>
                  {detail.canComplete ? (
                    <button
                      type="button"
                      className={`${styles.drawerStatus} ${
                        isComplete ? styles.drawerStatusComplete : ""
                      }`}
                      onClick={() => onToggle(detail.id)}
                      aria-pressed={isComplete}
                    >
                      {isComplete ? (
                        <Check aria-hidden="true" size={14} />
                      ) : (
                        <Circle
                          aria-hidden="true"
                          size={9}
                          fill="currentColor"
                        />
                      )}
                      {isComplete ? "Complete" : "Mark complete"}
                    </button>
                  ) : null}
                  <Dialog.Close
                    className={styles.drawerClose}
                    aria-label="Close resources"
                  >
                    <X aria-hidden="true" size={18} />
                  </Dialog.Close>
                </div>
              </header>

              <div className={styles.drawerBody}>
                <span className={styles.drawerEyebrow}>{detail.eyebrow}</span>
                <Dialog.Title>{detail.title}</Dialog.Title>
                <Dialog.Description>{detail.description}</Dialog.Description>

                {detail.doneWhen ? (
                  <section className={styles.drawerGoal}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    <div>
                      <strong>Done when</strong>
                      <span>{detail.doneWhen}</span>
                    </div>
                  </section>
                ) : null}

                <section className={styles.drawerResourceSection}>
                  <header>
                    <span>Learning resources</span>
                    <small>{detail.resources.length}</small>
                  </header>
                  <div className={styles.drawerResources}>
                    {detail.resources.map((resource) => (
                      <ResourceLink key={resource.href} resource={resource} />
                    ))}
                  </div>
                </section>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function IntermediateQuiz({
  open,
  onOpenChange,
  onPass,
}: {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  onPass: () => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingError, setGradingError] = useState("");
  const [graderFeedback, setGraderFeedback] = useState("");

  const resetQuiz = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setWrittenAnswer("");
    setScore(0);
    setIsFinished(false);
    setIsSubmitting(false);
    setGradingError("");
    setGraderFeedback("");
  };

  useEffect(() => {
    if (open) resetQuiz();
  }, [open]);

  const currentQuestion =
    INTERMEDIATE_QUESTIONS[questionIndex] ?? INTERMEDIATE_QUESTIONS[0];
  const passed = isFinished && score === INTERMEDIATE_QUESTIONS.length;
  const canSubmit =
    currentQuestion.type === "multiple-choice"
      ? selectedAnswer !== null
      : writtenAnswer.trim().length >= 20;

  const submitAnswer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setGradingError("");
    setGraderFeedback("");
    setIsSubmitting(true);

    let isCorrect = false;
    let feedback = "";

    if (currentQuestion.type === "multiple-choice") {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    } else {
      try {
        const response = await fetch("/api/learn/intermediate-assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: currentQuestion.id,
            answer: writtenAnswer.trim(),
          }),
        });
        const result = (await response.json()) as {
          correct?: boolean;
          feedback?: string;
          error?: string;
        };

        if (!response.ok || typeof result.correct !== "boolean") {
          throw new Error(
            result.error ?? "The written answer could not be graded.",
          );
        }

        isCorrect = result.correct;
        feedback = result.feedback ?? "";
      } catch (error) {
        setGradingError(
          error instanceof Error
            ? error.message
            : "The written answer could not be graded. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }
    }

    const nextScore = score + (isCorrect ? 1 : 0);
    const isLastQuestion = questionIndex === INTERMEDIATE_QUESTIONS.length - 1;

    setScore(nextScore);
    setIsSubmitting(false);

    if (isLastQuestion) {
      setGraderFeedback(isCorrect ? "" : feedback);
      setIsFinished(true);
      if (nextScore === INTERMEDIATE_QUESTIONS.length) onPass();
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
    setWrittenAnswer("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.quizOverlay} />
        <Dialog.Content className={styles.quizDialog}>
          <Dialog.Close className={styles.quizClose} aria-label="Close test">
            <X aria-hidden="true" size={18} />
          </Dialog.Close>

          {!isFinished ? (
            <>
              <header className={styles.quizHeader}>
                <div>
                  <span>Intermediate checkpoint</span>
                  <Dialog.Title>Test your Solana foundations</Dialog.Title>
                </div>
                <strong>
                  {questionIndex + 1}/{INTERMEDIATE_QUESTIONS.length}
                </strong>
              </header>
              <Dialog.Description className={styles.quizDescription}>
                Get all five right to earn the intermediate trophy. The final
                answer is reviewed by AI.
              </Dialog.Description>

              <div className={styles.quizProgress} aria-hidden="true">
                {INTERMEDIATE_QUESTIONS.map((question, index) => (
                  <span
                    key={question.id}
                    className={
                      index < questionIndex
                        ? styles.quizProgressDone
                        : index === questionIndex
                          ? styles.quizProgressCurrent
                          : ""
                    }
                  />
                ))}
              </div>

              <form onSubmit={submitAnswer} className={styles.quizForm}>
                <fieldset>
                  <legend>{currentQuestion.question}</legend>

                  {currentQuestion.type === "multiple-choice" ? (
                    <div
                      className={styles.quizAnswers}
                      role="radiogroup"
                      aria-label="Answer choices"
                    >
                      {currentQuestion.answers.map((answer, index) => (
                        <button
                          key={answer}
                          type="button"
                          role="radio"
                          aria-checked={selectedAnswer === index}
                          className={`${styles.quizAnswer} ${
                            selectedAnswer === index
                              ? styles.quizAnswerSelected
                              : ""
                          }`}
                          onClick={() => setSelectedAnswer(index)}
                        >
                          <span>{String.fromCharCode(65 + index)}</span>
                          {answer}
                          <CheckCircle2 aria-hidden="true" size={18} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.writtenAnswer}>
                      <textarea
                        value={writtenAnswer}
                        onChange={(event) => {
                          setWrittenAnswer(event.target.value);
                          setGradingError("");
                        }}
                        maxLength={700}
                        rows={5}
                        placeholder="Explain the checks you would make…"
                        aria-describedby="written-answer-hint"
                      />
                      <span id="written-answer-hint">
                        {currentQuestion.hint}
                      </span>
                    </div>
                  )}
                </fieldset>

                {gradingError ? (
                  <p className={styles.quizError} role="alert">
                    {gradingError}
                  </p>
                ) : null}

                <footer className={styles.quizFooter}>
                  <span>
                    {currentQuestion.type === "written"
                      ? "AI-graded · one short response"
                      : "Choose one answer"}
                  </span>
                  <button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting
                      ? "Reviewing…"
                      : questionIndex === INTERMEDIATE_QUESTIONS.length - 1
                        ? "Finish test"
                        : "Next question"}
                    {!isSubmitting ? (
                      <ChevronRight aria-hidden="true" size={16} />
                    ) : null}
                  </button>
                </footer>
              </form>
            </>
          ) : (
            <div
              className={`${styles.quizResult} ${
                passed ? styles.quizResultPassed : ""
              }`}
            >
              {passed ? (
                <div className={styles.confetti} aria-hidden="true">
                  {Array.from({ length: 32 }, (_, index) => (
                    <i
                      key={index}
                      style={{
                        left: `${(index * 37) % 100}%`,
                        animationDelay: `${(index % 8) * -0.11}s`,
                        animationDuration: `${1.35 + (index % 5) * 0.16}s`,
                      }}
                    />
                  ))}
                </div>
              ) : null}

              <span className={styles.quizResultIcon}>
                <Trophy aria-hidden="true" size={34} />
                {passed ? (
                  <span>
                    <Check aria-hidden="true" size={13} />
                  </span>
                ) : null}
              </span>
              <small>{passed ? "Checkpoint passed" : "Almost there"}</small>
              <Dialog.Title>
                {passed
                  ? "Intermediate level verified"
                  : `${score} of ${INTERMEDIATE_QUESTIONS.length} correct`}
              </Dialog.Title>
              <Dialog.Description>
                {passed
                  ? "Perfect score. Your intermediate trophy is now lit up on the roadmap."
                  : "Review the path and try again—you need all five answers correct to light the trophy."}
              </Dialog.Description>
              {!passed && graderFeedback ? (
                <p className={styles.graderFeedback}>{graderFeedback}</p>
              ) : null}
              <div className={styles.quizResultActions}>
                {!passed ? (
                  <button type="button" onClick={resetQuiz}>
                    <RotateCcw aria-hidden="true" size={15} />
                    Try again
                  </button>
                ) : null}
                <Dialog.Close>
                  {passed ? "Back to roadmap" : "Review roadmap"}
                </Dialog.Close>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ConceptsRoadmap() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [entryRoute, setEntryRoute] = useState<EntryRoute>("new");
  const [assessmentPassed, setAssessmentPassed] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeDetail, setActiveDetail] = useState<RoadmapDetail | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const progress = readProgress();
    setCompletedIds(progress.completedIds);
    setEntryRoute(progress.entryRoute);
    setAssessmentPassed(progress.assessmentPassed);
    setIsHydrated(true);
  }, []);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const isEthereumPath = entryRoute === "ethereum";
  const requiredSteps = isEthereumPath
    ? [
        INTRO_STEP,
        ETHEREUM_STEP,
        ...SHARED_SETUP_STEPS,
        ...INTERMEDIATE_STEPS,
        FINAL_STEP,
      ]
    : CORE_STEPS;
  const requiredCompletedCount = requiredSteps.filter((step) =>
    completedSet.has(step.id),
  ).length;
  const progress = Math.round(
    (requiredCompletedCount / requiredSteps.length) * 100,
  );
  const nextStepId = requiredSteps.find(
    (step) => !completedSet.has(step.id),
  )?.id;
  const reachedIntermediate = requiredSteps
    .filter((step) => step.id !== FINAL_STEP.id)
    .every((step) => completedSet.has(step.id));

  const writeProgress = (
    nextIds: string[],
    nextRoute = entryRoute,
    nextAssessmentPassed = assessmentPassed,
  ) => {
    safeStorageSetItem(
      getBrowserStorage("localStorage"),
      STORAGE_KEY,
      JSON.stringify({
        completedIds: nextIds,
        entryRoute: nextRoute,
        assessmentPassed: nextAssessmentPassed,
      } satisfies StoredProgress),
    );
  };

  const toggleComplete = (id: string) => {
    setCompletedIds((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      writeProgress(next);
      return next;
    });
  };

  const resetProgress = () => {
    setCompletedIds([]);
    setAssessmentPassed(false);
    setIsQuizOpen(false);
    setActiveDetail(null);
    writeProgress([], entryRoute, false);
  };

  const selectEntryRoute = (nextRoute: EntryRoute) => {
    setEntryRoute(nextRoute);
    writeProgress(completedIds, nextRoute);
  };

  const passAssessment = () => {
    setAssessmentPassed(true);
    writeProgress(completedIds, entryRoute, true);
  };

  const openStep = (step: CoreStep) => {
    setActiveDetail({
      id: step.id,
      eyebrow: `Step ${step.number} · ${step.phase}`,
      title: step.title,
      description: step.description,
      resources: step.resources,
      doneWhen: step.doneWhen,
      canComplete: true,
    });
  };

  const openBranch = (branch: Branch) => {
    setActiveDetail({
      id: branch.id,
      eyebrow: branch.label,
      title: branch.title,
      description: branch.description,
      resources: branch.resources,
      canComplete: true,
    });
  };

  const openEthereumShortcut = () => {
    setActiveDetail({
      id: ETHEREUM_STEP.id,
      eyebrow: "Optional shortcut · Ethereum",
      title: ETHEREUM_STEP.title,
      description: ETHEREUM_STEP.description,
      resources: ETHEREUM_STEP.resources,
      doneWhen: ETHEREUM_STEP.doneWhen,
      canComplete: isEthereumPath,
    });
  };

  const renderStep = (
    step: CoreStep,
    side: "left" | "right" | "center" = "left",
  ) => (
    <RoadmapStep
      key={step.id}
      step={step}
      isComplete={completedSet.has(step.id)}
      isNext={step.id === nextStepId}
      onToggle={toggleComplete}
      onOpen={openStep}
      side={side}
    />
  );

  return (
    <div className={`${styles.roadmap} not-prose`} data-learn-roadmap="">
      <section className={styles.progressPanel} aria-label="Learning progress">
        <div className={styles.progressPanelTop}>
          <div className={styles.progressNumbers}>
            <strong>{isHydrated ? requiredCompletedCount : "—"}</strong>
            <span>/ {requiredSteps.length} required steps</span>
          </div>
          <button
            type="button"
            className={styles.resetButton}
            onClick={resetProgress}
            disabled={completedIds.length === 0 && !assessmentPassed}
          >
            <RotateCcw aria-hidden="true" size={13} />
            Reset progress
          </button>
        </div>
        <div className={styles.progressSummary}>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-label="Learning progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.pathMode}>
            {isEthereumPath ? "Ethereum shortcut" : "Full path"}
          </span>
        </div>
      </section>

      <div className={styles.corePath}>
        <div
          className={`${styles.mapRow} ${styles.mapRowRight} ${styles.agentMapRow}`}
        >
          <aside className={styles.agentNote}>
            <span className={styles.agentIcon}>
              <Bot aria-hidden="true" size={19} />
            </span>
            <div>
              <strong>Using a coding agent?</strong>
              <span>
                Use it throughout the path, but verify account constraints and
                authority checks yourself.
              </span>
            </div>
            <div className={styles.agentLinks}>
              <a
                href="/developers/bootcamp/foundations/ai-best-practices"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play aria-hidden="true" size={14} />
                AI best practices
              </a>
              <a href="/skills" target="_blank" rel="noopener noreferrer">
                <Code2 aria-hidden="true" size={14} />
                Solana skills
              </a>
            </div>
          </aside>
        </div>

        {renderStep(INTRO_STEP, "left")}

        <section
          className={`${styles.ethereumFork} ${
            isEthereumPath ? styles.ethereumForkActive : ""
          }`}
          aria-labelledby="ethereum-shortcut-title"
        >
          <article>
            <button
              type="button"
              className={styles.stepOpenButton}
              onClick={openEthereumShortcut}
              aria-label="Open resources for the Ethereum shortcut"
            />
            <header>
              <span>
                <GitBranch aria-hidden="true" size={14} />
                Optional shortcut
              </span>
              {isEthereumPath ? (
                <button
                  type="button"
                  className={styles.shortcutCheck}
                  onClick={() => toggleComplete(ETHEREUM_STEP.id)}
                  aria-pressed={completedSet.has(ETHEREUM_STEP.id)}
                  aria-label={`${
                    completedSet.has(ETHEREUM_STEP.id)
                      ? "Mark incomplete"
                      : "Mark complete"
                  }: ${ETHEREUM_STEP.title}`}
                >
                  {completedSet.has(ETHEREUM_STEP.id) ? (
                    <Check aria-hidden="true" size={14} />
                  ) : (
                    <Circle aria-hidden="true" size={10} />
                  )}
                </button>
              ) : null}
            </header>
            <h3 id="ethereum-shortcut-title">Already building on Ethereum?</h3>
            <p>
              Read this after the Solana mental model. It replaces the later
              accounts, transactions, PDA, and CPI reading stops—not the first
              two projects.
            </p>
            <div className={styles.stepMeta}>
              <span>
                <BookOpen aria-hidden="true" size={14} />
                {ETHEREUM_STEP.resources.length} resources
              </span>
              <span>
                Open
                <ChevronRight aria-hidden="true" size={14} />
              </span>
            </div>
            <button
              type="button"
              className={styles.shortcutToggle}
              onClick={() =>
                selectEntryRoute(isEthereumPath ? "new" : "ethereum")
              }
              aria-pressed={isEthereumPath}
            >
              {isEthereumPath ? (
                <>
                  <Check aria-hidden="true" size={14} />
                  Shortcut active — use full path
                </>
              ) : (
                <>
                  <GitBranch aria-hidden="true" size={14} />
                  Take the Ethereum shortcut
                </>
              )}
            </button>
          </article>
        </section>

        <div className={styles.phaseLabel}>
          <span>Phase 1 · First projects</span>
        </div>
        {SHARED_SETUP_STEPS.map((step, index) =>
          renderStep(step, index % 2 === 0 ? "left" : "right"),
        )}

        {!isEthereumPath ? (
          <>
            <div className={styles.phaseLabel}>
              <span>Phase 2 · Concepts</span>
            </div>
            {STANDARD_FOUNDATION_STEPS.map((step, index) =>
              renderStep(step, index % 2 === 0 ? "left" : "right"),
            )}
          </>
        ) : null}

        <div className={styles.phaseLabel}>
          <span>Phase 3 · Build beyond the basics</span>
        </div>
        {INTERMEDIATE_STEPS.map((step, index) =>
          renderStep(step, index % 2 === 0 ? "right" : "left"),
        )}

        <div
          className={`${styles.levelMilestone} ${
            reachedIntermediate ? styles.levelMilestoneReached : ""
          } ${assessmentPassed ? styles.levelMilestonePassed : ""}`}
        >
          <span className={styles.levelIcon}>
            <Trophy aria-hidden="true" size={19} />
            {assessmentPassed ? (
              <span className={styles.trophyCheck}>
                <Check aria-hidden="true" size={11} strokeWidth={3} />
              </span>
            ) : null}
          </span>
          <span className={styles.levelCopy}>
            <small>Milestone</small>
            <strong>You&apos;ve reached intermediate level</strong>
          </span>
          {reachedIntermediate || assessmentPassed ? (
            <button
              type="button"
              className={styles.assessmentButton}
              onClick={() => setIsQuizOpen(true)}
            >
              {assessmentPassed ? "Retake test" : "Test me"}
              <ChevronRight aria-hidden="true" size={14} />
            </button>
          ) : null}
        </div>

        <section
          className={styles.specializationFork}
          aria-labelledby="specializations-title"
        >
          <header>
            <div>
              <p className={styles.kicker}>Optional product branches</p>
              <h3 id="specializations-title">Go deeper for your product</h3>
            </div>
          </header>
          <div className={styles.specializationGrid}>
            {PRODUCT_BRANCHES.map((branch) => {
              const isComplete = completedSet.has(branch.id);
              return (
                <article
                  key={branch.id}
                  className={`${styles.branchCard} ${
                    isComplete ? styles.branchComplete : ""
                  }`}
                >
                  <button
                    type="button"
                    className={styles.stepOpenButton}
                    onClick={() => openBranch(branch)}
                    aria-label={`Open resources for ${branch.title}`}
                  />
                  <div className={styles.branchHeader}>
                    <span>
                      <GitBranch aria-hidden="true" size={14} />
                      {branch.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleComplete(branch.id)}
                      aria-pressed={isComplete}
                      aria-label={`${
                        isComplete ? "Mark incomplete" : "Mark complete"
                      }: ${branch.title} branch`}
                    >
                      {isComplete ? (
                        <Check aria-hidden="true" size={14} />
                      ) : (
                        <Circle aria-hidden="true" size={10} />
                      )}
                    </button>
                  </div>
                  <h3>{branch.title}</h3>
                  <p>{branch.description}</p>
                  <div className={styles.stepMeta}>
                    <span>
                      <BookOpen aria-hidden="true" size={14} />
                      {branch.resources.length} resources
                    </span>
                    <span>
                      Open
                      <ChevronRight aria-hidden="true" size={14} />
                    </span>
                  </div>
                </article>
              );
            })}
            <div className={styles.directLane} aria-hidden="true">
              <ArrowRight size={15} />
            </div>
          </div>
        </section>

        <div className={styles.phaseLabel}>
          <span>Phase 4 · Ship</span>
        </div>
        {renderStep(FINAL_STEP, "center")}

        <div className={styles.coreFinish}>
          <ShieldCheck aria-hidden="true" size={18} />
          {requiredCompletedCount === requiredSteps.length
            ? "Roadmap complete"
            : "Complete the required steps to finish"}
        </div>
      </div>

      <p className={styles.srStatus} aria-live="polite">
        {requiredCompletedCount} of {requiredSteps.length} required steps
        complete on the {isEthereumPath ? "Ethereum shortcut" : "full"} path.
      </p>

      <RoadmapResourceDrawer
        detail={activeDetail}
        isComplete={activeDetail ? completedSet.has(activeDetail.id) : false}
        onOpenChange={(open) => {
          if (!open) setActiveDetail(null);
        }}
        onToggle={toggleComplete}
      />

      <IntermediateQuiz
        open={isQuizOpen}
        onOpenChange={setIsQuizOpen}
        onPass={passAssessment}
      />
    </div>
  );
}
