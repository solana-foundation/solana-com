/**
 * docs-tooling CLI. Run with `pnpm --filter @workspace/docs-tooling cli <cmd>`
 * or `pnpm exec docs-tooling <cmd>`.
 */
import { runNav } from "./nav/index.ts";
import { runExamples } from "./examples/index.ts";

const USAGE = `docs-tooling <command> [options]

Commands:
  verify [--skip-generators] [--json]   All content checks (src/verify/index.ts)
  nav verify                            Navigation coverage (src/nav/index.ts)
  examples [--check]                    Build runnable example snippets
`;

/**
 * Flags each command accepts. Anything else is rejected before the command
 * runs, so a typo never runs a command in write mode.
 */
const KNOWN_FLAGS: Record<string, string[]> = {
  nav: [],
  examples: ["check"],
  verify: ["skip-generators", "json"],
};

function parseArgs(argv: string[]) {
  const [cmd, ...rest] = argv;
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]!;
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = rest[i + 1];
    if (next !== undefined && !next.startsWith("--")) {
      flags[key] = next;
      i++;
    } else flags[key] = true;
  }
  return { cmd, flags };
}

async function main() {
  const { cmd, flags } = parseArgs(process.argv.slice(2));
  if (cmd && cmd in KNOWN_FLAGS) {
    const bad = Object.keys(flags).filter(
      (f) => !KNOWN_FLAGS[cmd]!.includes(f),
    );
    if (bad.length) {
      console.error(
        `docs-tooling ${cmd}: unknown option(s) ${bad.map((b) => `--${b}`).join(", ")}; nothing was run.\n\n${USAGE}`,
      );
      return 2;
    }
  }
  switch (cmd) {
    case "nav": {
      const sub = process.argv.slice(3).find((a) => !a.startsWith("--"));
      const r = runNav(sub);
      console.log(r.message);
      return r.code;
    }
    case "verify": {
      const { runVerify } = await import("./verify/index.ts");
      return runVerify({
        generators: !flags["skip-generators"],
        json: Boolean(flags.json),
      });
    }
    case "examples": {
      console.log(runExamples({ check: Boolean(flags.check) }).message);
      return 0;
    }
    default:
      console.log(USAGE);
      return cmd ? 1 : 0;
  }
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err instanceof Error ? err.stack : err);
    process.exit(1);
  },
);
