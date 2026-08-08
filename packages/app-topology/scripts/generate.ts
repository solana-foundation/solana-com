import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createSecretsRolloutManifest } from "../src/index.ts";

const outputPath = fileURLToPath(
  new URL(
    "../../../scripts/secrets-rollout/projects.solana-apps.json",
    import.meta.url,
  ),
);
const expected = `${JSON.stringify(createSecretsRolloutManifest(), null, 2)}\n`;

if (process.argv.includes("--check")) {
  const actual = await readFile(outputPath, "utf8");

  if (actual !== expected) {
    console.error(
      "Generated topology is stale. Run `pnpm topology:generate` from the repository root.",
    );
    process.exitCode = 1;
  }
} else {
  await writeFile(outputPath, expected);
  console.log(`Generated ${outputPath}`);
}
