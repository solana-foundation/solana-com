"use client";

import { useTranslations } from "next-intl";
import { cn } from "../cn";
import { CheckIcon, CopyIcon } from "../../docs-ui-icons";
import { useCopy, visuallyHidden } from "../ui";
import { codeSurface, focusRing, mono } from "./frame";

/** Copy, then a check for 1.5s, as on the docs' code blocks. */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const t = useTranslations("docsAsk");
  const [copied, copy] = useCopy();
  return (
    <span className="relative shrink-0">
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={() => copy(text)}
        className={cn(
          "grid size-[26px] place-items-center rounded-md text-[#a3a0a6] transition-colors duration-150 hover:text-[#545257] motion-reduce:transition-none dark:hover:text-[#d4d4d8]",
          focusRing,
        )}
      >
        {/* The docs' copied check: purple, and it pops in. */}
        {copied ? (
          <CheckIcon className="size-3.5 text-[var(--sol-purple)] animate-in zoom-in-50 duration-150 motion-reduce:animate-none" />
        ) : (
          <CopyIcon className="size-4" />
        )}
      </button>
      <span role="status" className={visuallyHidden}>
        {copied ? t("copied") : ""}
      </span>
    </span>
  );
}

/**
 * A command's words as unbreakable boxes, so a narrow panel wraps between
 * arguments rather than inside one (`--program-` / `2022`); a word wider
 * than the line still wraps. `<MINT>`-style placeholders, values the reader
 * fills in, are purple.
 */
export function CommandText({ command }: { command: string }) {
  return command.split(/(\s+)/).map((word, index) =>
    index % 2 === 1 || !word ? (
      word
    ) : (
      <span
        key={index}
        className="inline-block max-w-full [overflow-wrap:anywhere]"
      >
        {word.split(/(<[^<>\s]+>)/).map((part, i) =>
          i % 2 === 1 ? (
            <span key={i} className="text-[var(--sol-purple-text)]">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </span>
    ),
  );
}

/**
 * A shell command, not code: a program name first (`solana`, `spl-token`),
 * no call or assignment (`rpc.getBalance(address).send()` is code).
 */
function isShellCommand(command: string) {
  const first = command.trim().split(/\s+/)[0] ?? "";
  return (
    /^[\w@./-]+$/.test(first) &&
    !/^(?:const|let|var|await|import|return|fn|pub)$/.test(first) &&
    !/[;=]\s*$|\)\s*;?\s*$/.test(command.trim())
  );
}

/**
 * One shell command with a green `$` prompt, as the docs' terminals (not
 * selected or copied), and a copy button; multi-line code drops the prompt
 * and scrolls instead of wrapping, and a line of code (a model visual's
 * `rpc.getBalance(address).send()`) shows without the prompt.
 * `row` sits in a list frame, `boxed` stands alone in a step, `compact`
 * goes in the setup checklist.
 */
export function CommandRow({
  command,
  description,
  variant,
}: {
  command: string;
  description?: string;
  variant: "row" | "boxed" | "compact";
}) {
  const t = useTranslations("docsAsk");
  const multiline = command.includes("\n");
  const shell = !multiline && isShellCommand(command);
  const size = variant === "compact" ? "text-[12px]" : "text-[13px]";
  // Commands read left to right on right-to-left pages too, as in the docs.
  return (
    <div
      dir="ltr"
      className={cn(
        "flex items-start gap-2",
        codeSurface,
        variant === "row" &&
          "border-t border-[var(--sol-line)] py-2 ps-3.5 pe-2 first:border-t-0",
        variant !== "row" &&
          "rounded-lg border border-[var(--sol-line)] py-1 ps-3 pe-1",
      )}
    >
      {shell ? (
        <span
          aria-hidden="true"
          className={cn(
            mono,
            size,
            "select-none leading-[26px] text-[#15803d] dark:text-[#4ade80]",
          )}
        >
          $
        </span>
      ) : null}
      {/* The size sits on the box too, so its line box matches the prompt's. */}
      <div className={cn(size, "min-w-0 flex-1 py-[3px] leading-5")}>
        {multiline ? (
          <pre
            className={cn(
              mono,
              size,
              "m-0 overflow-x-auto leading-5 text-[var(--sol-text)] [&_code]:[font-family:inherit]",
            )}
          >
            <code>{command}</code>
          </pre>
        ) : (
          <code
            className={cn(
              mono,
              size,
              "whitespace-pre-wrap leading-5 text-[var(--sol-text)] [overflow-wrap:anywhere]",
            )}
          >
            <CommandText command={command} />
          </code>
        )}
        {description ? (
          <p className="m-0 mt-0.5 text-[12px] leading-[1.5] text-[var(--sol-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      <CopyButton
        text={command}
        label={t(shell ? "copyCommand" : "copyCode")}
      />
    </div>
  );
}
