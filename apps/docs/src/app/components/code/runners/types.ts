import type { ReactNode } from "react";

/** What the reader is looking at when they press Run. */
export type RunnerContext = {
  /** The exact code shown in the active tab. */
  code: string;
  /** The tab's language, e.g. `ts`, `rust`, `py`. */
  language: string;
  /** The tab's title, e.g. `Kit`, `Legacy`, `Rust`, `Python`. */
  title: string;
};

/**
 * Produces the console output for one tab of a runnable block.
 *
 * Runners exist for examples whose output is mostly freshly generated data — a
 * new keypair, a new mnemonic — where a hard-coded string would read as wrong.
 * Everything else is served by an `.output.txt` next to the example source; see
 * `apps/docs/src/lib/remark-example-output.mjs`.
 */
export type ExampleRunner = (
  _context: RunnerContext,
) => ReactNode | Promise<ReactNode>;

/** Runners for one runnable block, keyed by tab title, then by language. */
export type PageRunners = Record<string, ExampleRunner>;
