/**
 * Navigation. `docs-tooling nav verify`: exact coverage (verify-nav.ts).
 */
import { navPaths } from "./build.ts";
import { verifyNav } from "./verify-nav.ts";

export interface NavOptions {
  docsRoot?: string;
}

export interface NavRunResult {
  code: number;
  message: string;
}

export function runNav(
  sub: string | undefined,
  opts: NavOptions = {},
): NavRunResult {
  const paths = navPaths(opts.docsRoot);
  if (sub !== "verify")
    return { code: 1, message: `nav: unknown subcommand "${sub}" (verify)` };
  const r = verifyNav({ docsRoot: paths.docsRoot });
  const lines = [
    `verify-nav: ${r.errors.length} error(s); ${r.counts.files} English pages, ${r.counts.navEntries} nav entries`,
    ...r.errors.slice(0, 200).map((e) => `  ERROR ${e}`),
  ];
  return { code: r.errors.length ? 1 : 0, message: lines.join("\n") };
}
