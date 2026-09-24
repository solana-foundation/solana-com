import type { ExampleRunner, PageRunners, RunnerContext } from "./types";

/**
 * Runnable blocks that build their console output in the browser, keyed by the
 * `runner` prop on `<CodeTabs>`:
 *
 *   <CodeTabs storage="cookbook" flags="r" runner="cookbook/wallets/create-keypair">
 *
 * Each entry is a dynamic import so a page only ships the runner it uses. Ids
 * are the doc's content path; pages with more than one runnable block suffix
 * theirs (`cookbook/wallets/restore-keypair#from-bytes`).
 *
 * Most examples need no entry here — their output comes from an `.output.txt`
 * beside the example source. Add a runner only when the output is dominated by
 * freshly generated data.
 */
const pages: Record<string, () => Promise<{ default: PageRunners }>> = {
  "cookbook/wallets/create-keypair": () =>
    import("./cookbook/wallets/create-keypair"),
};

export function hasRunners(id: string | undefined): id is string {
  return !!id && id in pages;
}

/**
 * Resolves the runner for one tab, by title and then by language. Returns null
 * when the block has no runner for this tab, which falls back to its static
 * output.
 */
export async function loadRunner(
  id: string,
  { title, language }: Pick<RunnerContext, "title" | "language">,
): Promise<ExampleRunner | null> {
  const load = pages[id];
  if (!load) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`No runner registered for id "${id}"`);
    }
    return null;
  }

  const { default: runners } = await load();
  return runners[title] ?? runners[language] ?? null;
}
