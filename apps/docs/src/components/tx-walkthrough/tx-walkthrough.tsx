/**
 * "See a transaction in action": one real SettleDvp transaction, stepped
 * through one scene at a time (the two actors of each step and what passes
 * between them), with the recorded data and the code behind each step.
 *
 * Server component: reads the recorded fixture at build time, derives what
 * each step shows (model.ts), and highlights the excerpts with the docs'
 * Shiki themes, so the client bundle gets only the finished view.
 *
 * Registered in the docs MDX components (components/docs/docs-components)
 * and mounted on How Solana works (content/docs/en/core/index.mdx)
 * around the static transaction-flow diagram. Children (that static diagram,
 * which the Markdown twin shows on its own) sit behind the
 * walkthrough's "See the whole flow".
 */
import type { ReactNode } from "react";
import { highlight } from "fumadocs-core/highlight";
import fixture from "@@/content/snippets/examples/paths/defi/settle-trade/settle-walkthrough.json";
import { EXCERPTS } from "./excerpts";
import {
  buildModel,
  DVP_PROGRAM,
  trimmedResponse,
  type RecordedFixture,
} from "./model";
import { TxWalkthroughClient } from "./tx-walkthrough.client";

const THEMES = { light: "github-light", dark: "github-dark-dimmed" } as const;

/**
 * The recorded run is on a local Surfpool, so its signature is not on any
 * public cluster. The Explorer link goes to the DvP program on devnet, which
 * is real; swap in a devnet transaction URL once one is recorded there.
 */
const EXPLORER_URL = `https://explorer.solana.com/address/${DVP_PROGRAM}?cluster=devnet`;
const RPC_REFERENCE_HREF = "/developers/docs/rpc/http/gettransaction";

export async function TxWalkthrough({ children }: { children?: ReactNode }) {
  const recorded = fixture as unknown as RecordedFixture;
  const model = buildModel(recorded);
  const code = Object.fromEntries(
    await Promise.all(
      Object.values(EXCERPTS).map(
        async (e) =>
          [
            e.id,
            await highlight(e.code, {
              lang: e.lang,
              themes: THEMES,
              defaultColor: false,
            }),
          ] as const,
      ),
    ),
  );
  const response = await highlight(
    JSON.stringify(trimmedResponse(recorded, model), null, 2),
    { lang: "json", themes: THEMES, defaultColor: false },
  );
  return (
    <TxWalkthroughClient
      model={model}
      code={code}
      response={response}
      explorerUrl={EXPLORER_URL}
      rpcReferenceHref={RPC_REFERENCE_HREF}
      flow={children}
    />
  );
}
