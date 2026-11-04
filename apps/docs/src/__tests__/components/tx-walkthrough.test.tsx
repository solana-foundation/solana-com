import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import fixture from "@@/content/snippets/examples/paths/defi/settle-trade/settle-walkthrough.json";
import {
  DVP_COMMIT,
  DVP_REPO,
  ELISION,
  EXCERPTS,
  githubUrl,
  type Excerpt,
} from "@/components/tx-walkthrough/excerpts";
import {
  buildModel,
  DVP_PROGRAM,
  INSTRUCTION_NAMES,
  trimmedResponse,
  type RecordedFixture,
} from "@/components/tx-walkthrough/model";
import { STEPS } from "@/components/tx-walkthrough/steps";
import { TxWalkthroughClient } from "@/components/tx-walkthrough/tx-walkthrough.client";

const repoRoot = path.resolve(__dirname, "../../../../..");
const recorded = fixture as unknown as RecordedFixture;
const model = buildModel(recorded);

/** The cited lines, dedented by their common indent, joined by `// …`. */
function cite(source: string, ranges: [number, number][]) {
  const lines = source.split("\n");
  const chunks = ranges.map(([a, b]) => lines.slice(a - 1, b));
  const indent = Math.min(
    ...chunks
      .flat()
      .filter((l) => l.trim())
      .map((l) => l.length - l.trimStart().length),
  );
  return chunks
    .map((c) => c.map((l) => (l.trim() ? l.slice(indent) : "")).join("\n"))
    .join(`\n${ELISION}\n`);
}

const byKind = (kind: Excerpt["source"]["kind"]) =>
  Object.values(EXCERPTS).filter((e) => e.source.kind === kind);

describe("tx-walkthrough excerpts match the sources they cite", () => {
  it.each(byKind("repo").map((e) => [e.id, e] as const))(
    "%s (tested example code in this repo)",
    (_id, e) => {
      const source = readFileSync(path.join(repoRoot, e.source.path), "utf8");
      expect(e.code).toBe(cite(source, e.ranges));
    },
  );

  it.for(byKind("github"))(
    `$id (${DVP_REPO} at the pinned commit)`,
    { timeout: 20_000 },
    async (e, ctx) => {
      const url = `https://raw.githubusercontent.com/${DVP_REPO}/${DVP_COMMIT}/${e.source.path}`;
      let source: string;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(String(res.status));
        source = await res.text();
      } catch {
        // Offline: the commit is pinned, so the source cannot change, only
        // the excerpt; it is checked on the next run with network.
        ctx.skip();
        return;
      }
      expect(e.code).toBe(cite(source, e.ranges));
      expect(githubUrl(e.source.path, e.ranges)).toContain(
        `/blob/${DVP_COMMIT}/${e.source.path}#L${e.ranges[0][0]}-L`,
      );
    },
  );

  it("every step's excerpts exist", () => {
    for (const s of STEPS)
      for (const id of s.excerpts) expect(EXCERPTS[id], id).toBeDefined();
  });

  it("DvP instruction names follow the generated client's discriminators", () => {
    const dir = path.join(
      repoRoot,
      "packages/docs-examples/paths/defi/settle-trade/dvp/generated/instructions",
    );
    for (const [n, name] of Object.entries(INSTRUCTION_NAMES[DVP_PROGRAM])) {
      const file = `${name[0].toLowerCase()}${name.slice(1)}.ts`;
      const text = readFileSync(path.join(dir, file), "utf8");
      const constName = name.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
      expect(text).toContain(`export const ${constName}_DISCRIMINATOR = ${n};`);
    }
  });
});

describe("tx-walkthrough model (from the recorded run)", () => {
  it("reads the transaction message", () => {
    expect(model.feePayer).toMatchObject({
      label: "Settlement agent",
      signer: true,
      writable: true,
    });
    expect(model.accounts.filter((a) => a.signer)).toHaveLength(1);
    expect(model.instructions.map((i) => i.name)).toEqual([
      "CreateIdempotent",
      "CreateIdempotent",
      "CreateIdempotent",
      "CreateIdempotent",
      "SettleDvp",
    ]);
    const settle = model.instructions[4];
    expect(settle.program.address).toBe(DVP_PROGRAM);
    expect(settle.data).toEqual([2, 0]); // SettleDvp, legAExtrasCount 0
    expect(settle.accounts).toHaveLength(13);
    expect(model.sizeBytes).toBeLessThanOrEqual(model.maxBytes);
    expect(model.messageBytes).toBe(model.sizeBytes - 1 - 64);
  });

  it("decodes the CPIs: 100 USDC out of the PDA-owned escrow, signed by the PDA", () => {
    const [cash, asset, ...closes] = model.cpis;
    expect(cash).toMatchObject({
      name: "TransferChecked",
      amount: "100",
      symbol: "USDC",
      from: { label: "USDC escrow" },
      to: { label: "Seller's USDC account" },
      authority: { label: "Trade record (PDA)" },
    });
    expect(cash.program.label).toBe("Token Program");
    expect(asset).toMatchObject({
      name: "TransferChecked",
      amount: "80",
      symbol: "fund shares",
    });
    expect(closes.map((c) => c.name)).toEqual(["CloseAccount", "CloseAccount"]);
  });

  it("reports balances that changed, with closed escrows", () => {
    const by = Object.fromEntries(
      model.balances.map((b) => [b.account.label, [b.before, b.after]]),
    );
    expect(by["USDC escrow"]).toEqual(["100", null]);
    expect(by["Seller's USDC account"]).toEqual([null, "100"]);
    expect(by["Fund share escrow"]).toEqual(["80", null]);
    expect(by["Buyer's fund share account"]).toEqual(["0", "80"]);
    expect(model.succeeded).toBe(true);
    expect(model.fee).toBeGreaterThan(0);
  });

  it("trims the response to the DvP instruction's logs", () => {
    const r = trimmedResponse(recorded, model);
    expect(r.meta.err).toBeNull();
    expect(r.meta.logMessages[0]).toBe("…");
    expect(r.meta.logMessages[1]).toBe(`Program ${DVP_PROGRAM} invoke [1]`);
    expect(r.meta.logMessages.at(-1)).toBe(`Program ${DVP_PROGRAM} success`);
  });
});

describe("TxWalkthroughClient", () => {
  const code = Object.fromEntries(
    Object.values(EXCERPTS).map((e) => [e.id, <pre key={e.id}>{e.code}</pre>]),
  );
  const renderIt = () =>
    render(
      <TxWalkthroughClient
        model={model}
        code={code}
        response={<pre>response</pre>}
        explorerUrl={`https://explorer.solana.com/address/${DVP_PROGRAM}?cluster=devnet`}
        rpcReferenceHref="/developers/docs/rpc/http/gettransaction"
        flow={<img alt="The whole transaction flow" src="/flow.svg" />}
      />,
    );
  const stageTitle = () =>
    screen.getByRole("heading", { level: 3 }).textContent;
  const railSteps = () =>
    within(screen.getByRole("list", { name: "Steps" })).getAllByRole("button");
  const next = () =>
    screen.getByRole("button", { name: /^Next: |^Start again$/ });

  it("steps through all seven steps with Next, labelled with the next step", () => {
    renderIt();
    expect(STEPS).toHaveLength(7);
    expect(stageTitle()).toBe(STEPS[0].title);
    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
    for (let i = 1; i < STEPS.length; i++) {
      expect(next()).toHaveTextContent(`Next: ${STEPS[i].short}`);
      fireEvent.click(next());
      expect(stageTitle()).toBe(STEPS[i].title);
      expect(
        screen.getByText(`Step ${i + 1} of 7: ${STEPS[i].title}`),
      ).toBeInTheDocument();
    }
    expect(next()).toHaveTextContent("Start again");
    // Result: the recorded status and links.
    expect(screen.getByText("Succeeded")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View the program on Explorer" }),
    ).toHaveAttribute(
      "href",
      `https://explorer.solana.com/address/${DVP_PROGRAM}?cluster=devnet`,
    );
    expect(
      screen.getByRole("link", { name: "getTransaction reference" }),
    ).toHaveAttribute("href", "/developers/docs/rpc/http/gettransaction");
    fireEvent.click(next());
    expect(stageTitle()).toBe(STEPS[0].title);
  });

  it("shows the recorded values as chips and packets", () => {
    const { container } = renderIt();
    const short = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;
    expect(
      screen.getByText(`${model.sizeBytes} of 1,232 bytes`),
    ).toBeInTheDocument();
    fireEvent.click(railSteps()[1]);
    const packets = () =>
      [...container.querySelectorAll(".txw-packet")].map((p) => p.textContent);
    expect(packets()).toEqual([
      `message, ${model.messageBytes} bytes`,
      "signature",
    ]);
    expect(screen.getByText(short(model.signature))).toBeInTheDocument();
    fireEvent.click(railSteps()[3]);
    const fee = `${model.fee.toLocaleString("en-US")} lamports`;
    expect(screen.getAllByText(fee).length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        new RegExp(
          `charges the ${model.fee.toLocaleString("en-US")}-lamport fee`,
        ),
      ),
    ).toBeInTheDocument();
    fireEvent.click(railSteps()[5]);
    expect(packets()).toEqual(["$100 USDC"]);
    expect(container.querySelector(".txw-badge")).toHaveTextContent(
      "all or nothing",
    );
    expect(screen.getByText(/fund shares go to the buyer/)).toBeInTheDocument();
  });

  it("step 6 shows the balance board from the run", () => {
    const { container } = renderIt();
    fireEvent.click(railSteps()[5]);
    const rows = [...container.querySelectorAll(".txw-board li")].map((r) => [
      r.querySelector(".txw-board-name")!.textContent,
      r.querySelector(".txw-was")!.textContent,
      r.querySelector(".txw-now")!.textContent,
    ]);
    expect(rows).toEqual([
      ["USDC escrow", "100", "0"],
      ["Seller's USDC account", "0", "100"],
      ["Fund share escrow", "80", "0"],
      ["Buyer's fund share account", "0", "80"],
    ]);
    expect(screen.getAllByText("closed")).toHaveLength(2);
    fireEvent.click(railSteps()[6]);
    expect(container.querySelector(".txw-board")).toBeNull();
  });

  it("marks steps 5 and 6 as all or nothing on the rail", () => {
    renderIt();
    expect(STEPS.filter((s) => s.atomic).map((s) => s.id)).toEqual([
      "run",
      "cpi",
    ]);
    expect(railSteps()[4]).toHaveAccessibleName(
      "Step 5: Run program (all or nothing)",
    );
  });

  it("Show the code reveals the step's excerpts", () => {
    renderIt();
    const toggle = screen.getByRole("button", { name: "Show the code" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(/getSettleDvpInstruction\(/)).toBeNull();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/getSettleDvpInstruction\(/)).toBeInTheDocument();
    // Step 4 has no code; the result step adds the trimmed response.
    fireEvent.click(railSteps()[3]);
    expect(screen.queryByRole("button", { name: "Show the code" })).toBeNull();
    fireEvent.click(railSteps()[6]);
    expect(screen.getByText("response")).toBeInTheDocument();
  });

  it("See the whole flow reveals the static diagram", () => {
    renderIt();
    const toggle = screen.getByRole("button", { name: "See the whole flow" });
    expect(
      screen.queryByRole("img", { name: "The whole transaction flow" }),
    ).toBeNull();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("img", { name: "The whole transaction flow" }),
    ).toBeVisible();
  });

  it("moves with the arrow keys, Home, and End", () => {
    const { container } = renderIt();
    const section = container.querySelector("section")!;
    fireEvent.keyDown(section, { key: "ArrowRight" });
    expect(stageTitle()).toBe(STEPS[1].title);
    fireEvent.keyDown(section, { key: "End" });
    expect(stageTitle()).toBe(STEPS[6].title);
    fireEvent.keyDown(section, { key: "ArrowLeft" });
    expect(stageTitle()).toBe(STEPS[5].title);
    fireEvent.keyDown(section, { key: "Home" });
    expect(stageTitle()).toBe(STEPS[0].title);
  });

  it("marks the current step on the rail for assistive tech", () => {
    renderIt();
    const steps = railSteps();
    expect(steps).toHaveLength(7);
    expect(steps[0]).toHaveAttribute("aria-current", "step");
    fireEvent.click(steps[3]);
    expect(steps[3]).toHaveAttribute("aria-current", "step");
    expect(steps[0]).not.toHaveAttribute("aria-current");
  });
});
