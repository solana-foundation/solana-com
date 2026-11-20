/**
 * gen:addresses.
 *
 *   tsx src/generators/addresses.ts [--check] [--sync] [--report]
 *
 * Source: apps/docs/content/addresses.json, the well-known address registry:
 *
 * ```json
 * { "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": { "label": "USDC mint (mainnet)", "cluster": "mainnet-beta" } }
 * ```
 *
 * `cluster` is `mainnet-beta`, `devnet`, `testnet` or `all` (program IDs and
 * sysvars that are identical on every cluster; linked without a cluster).
 *
 * Authors opt in per mention:
 *
 *   <span className="sol-address" data-address="EPjF…Dt1v">`EPjF…Dt1v`</span>
 *
 * (or the spec's `<Tooltip data-address="…">`), and `--sync` expands it to
 *
 *   <span className="sol-address" data-address="X"><Tooltip headline="USDC mint
 *   (mainnet)" tip="X" cta="View on Solana Explorer" href="https://explorer…/X">`X`</Tooltip><span
 *   className="nojs-only"> ([USDC mint (mainnet)](https://explorer…/X))</span></span>
 *
 * Nothing else is ever linked: addresses in code blocks and recorded outputs
 * stay plain, because local Surfpool addresses do not exist on public
 * clusters. `--report` lists prose mentions (inline code equal to a known
 * address, outside a marked element) as candidates; it never edits them.
 *
 * There is no generated snippet: `--check` validates the registry and fails
 * when a marked mention is out of date.
 *
 * Localization: `addresses.json` may carry `"_ui": { "cta": "…" }`, and an
 * optional `addresses.<locale>.json` next to it overrides `_ui` and labels
 * (`{ "_ui": { "cta": "…" }, "<address>": { "label": "…" } }`; clusters and
 * addresses always come from the English file). Locale pages use their
 * locale's strings, falling back to English.
 */
import { existsSync } from "node:fs";
import { DOCS_LOCALES } from "../lib/locales.ts";
import path from "node:path";
import type { AstNode } from "../types.ts";
import {
  emptyResult,
  finish,
  getAttr,
  hasClass,
  isJsx,
  isMain,
  isRecord,
  jsxText,
  link,
  parseFlags,
  printResult,
  readJson,
  resolveDocsRoot,
  setAttrs,
  setChildren,
  syncPages,
  text,
  walkTree,
  type GeneratorOptions,
  type GeneratorResult,
  type Problem,
  uiStrings,
} from "./_lib.ts";

export type Cluster = "mainnet-beta" | "devnet" | "testnet" | "all";
export interface AddressDef {
  address: string;
  label: string;
  cluster: Cluster;
}

const CLUSTERS = new Set<Cluster>(["mainnet-beta", "devnet", "testnet", "all"]);
/** Base58 alphabet, 32-44 characters (a 32-byte public key). */
const BASE58_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export const ADDRESS_UI = { cta: "View on Solana Explorer" };
export type AddressUi = typeof ADDRESS_UI;

export function explorerUrl(a: AddressDef) {
  const base = `https://explorer.solana.com/address/${a.address}`;
  return a.cluster === "devnet" || a.cluster === "testnet"
    ? `${base}?cluster=${a.cluster}`
    : base;
}

export function parseAddresses(
  raw: unknown,
  problems: Problem[],
): AddressDef[] {
  const file = "addresses.json";
  const err = (message: string) =>
    problems.push({ level: "error", file, message });
  if (!isRecord(raw)) {
    err("must be an object of address -> { label, cluster }");
    return [];
  }
  const out: AddressDef[] = [];
  for (const [address, v] of Object.entries(raw)) {
    if (address === "$schema" || address === "_ui") continue;
    if (!BASE58_RE.test(address)) err(`${address}: not a base58 public key`);
    if (!isRecord(v) || typeof v.label !== "string" || !v.label.trim()) {
      err(`${address}: needs a non-empty "label"`);
      continue;
    }
    for (const k of Object.keys(v))
      if (k !== "label" && k !== "cluster")
        err(`${address}: unknown field "${k}"`);
    const cluster = (v.cluster ?? "all") as Cluster;
    if (!CLUSTERS.has(cluster))
      err(`${address}: cluster must be one of ${[...CLUSTERS].join(", ")}`);
    out.push({ address, label: v.label, cluster });
  }
  return out;
}

export function loadAddresses(docsRoot: string, problems: Problem[]) {
  const file = path.join(docsRoot, "addresses.json");
  if (!existsSync(file)) {
    problems.push({
      level: "error",
      file: "addresses.json",
      message: "missing",
    });
    return [];
  }
  return parseAddresses(readJson(file), problems);
}

export interface AddressLocale {
  ui: AddressUi;
  /** address -> localized label */
  labels: Map<string, string>;
}

/** English UI plus every `addresses.<loc>.json` layer that exists. */
export function loadAddressLocales(
  docsRoot: string,
  known: Set<string>,
  problems: Problem[],
): Map<string, AddressLocale> {
  const out = new Map<string, AddressLocale>();
  const enFile = path.join(docsRoot, "addresses.json");
  const enRaw = existsSync(enFile) ? readJson(enFile) : {};
  const enUi = uiStrings(ADDRESS_UI, isRecord(enRaw) ? enRaw._ui : undefined);
  out.set("en", { ui: enUi, labels: new Map() });
  for (const loc of DOCS_LOCALES) {
    const file = path.join(docsRoot, `addresses.${loc}.json`);
    if (!existsSync(file)) continue;
    const rel = `addresses.${loc}.json`;
    const raw = readJson(file);
    if (!isRecord(raw)) {
      problems.push({
        level: "error",
        file: rel,
        message: "must be an object",
      });
      continue;
    }
    const labels = new Map<string, string>();
    for (const [k, v] of Object.entries(raw)) {
      if (k === "_ui" || k === "$schema") continue;
      if (!known.has(k)) {
        problems.push({
          level: "error",
          file: rel,
          message: `${k}: not in addresses.json`,
        });
        continue;
      }
      if (isRecord(v) && typeof v.label === "string" && v.label.trim())
        labels.set(k, v.label);
    }
    out.set(loc, { ui: uiStrings(enUi, raw._ui), labels });
  }
  return out;
}

/** Expand/refresh every `data-address` mention. Returns true if changed. */
export function syncAddressMentions(
  tree: AstNode,
  registry: Map<string, AddressDef>,
  problems: Problem[],
  locale: AddressLocale = { ui: ADDRESS_UI, labels: new Map() },
): boolean {
  let changed = false;
  walkTree(tree, (n, parent, index) => {
    if (n.type === "code" || n.type === "inlineCode") return "skip";
    if (!isJsx(n)) return;
    const address = getAttr(n, "data-address");
    if (address === undefined) return;
    const a = registry.get(address);
    if (!a) {
      problems.push({
        level: "error",
        message: `data-address="${address}" is not in addresses.json`,
      });
      return "skip";
    }
    if (n.type !== "mdxJsxTextElement") {
      problems.push({
        level: "warn",
        message: `data-address="${address}" on a block element; ignored`,
      });
      return "skip";
    }
    let wrapper = n;
    if (n.name === "Tooltip") {
      wrapper = jsxText("span", [], [n]);
      parent!.children![index] = wrapper;
      changed = true;
    } else if (n.name !== "span" || !hasClass(n, "sol-address")) {
      problems.push({
        level: "error",
        message: `data-address="${address}" must be on <span className="sol-address"> or <Tooltip>`,
      });
      return "skip";
    }
    const kids = wrapper.children ?? [];
    const tooltip = kids.find((k) => isJsx(k) && k.name === "Tooltip");
    const trigger = tooltip
      ? (tooltip.children ?? [])
      : kids.filter((k) => !(isJsx(k) && hasClass(k, "nojs-only")));
    const href = explorerUrl(a);
    const label = locale.labels.get(address) ?? a.label;
    if (parent?.type === "tableCell")
      problems.push({
        level: "warn",
        message: `data-address="${address}" in a table cell: syncing re-pads the whole table (codec), so the diff is not local`,
      });
    const tooltipNode =
      tooltip ??
      jsxText(
        "Tooltip",
        [],
        trigger.length ? trigger : [{ type: "inlineCode", value: address }],
      );
    if (!tooltip) changed = true;
    changed =
      setAttrs(tooltipNode, [
        ["headline", label],
        ["tip", address],
        ["cta", locale.ui.cta],
        ["href", href],
      ]) || changed;
    const nojs = jsxText(
      "span",
      [["className", "nojs-only"]],
      [text(" ("), link(href, [text(label)]), text(")")],
    );
    changed =
      setAttrs(wrapper, [
        ["className", "sol-address"],
        ["data-address", address],
      ]) || changed;
    changed = setChildren(wrapper, [tooltipNode, nojs]) || changed;
    return "skip";
  });
  return changed;
}

/** Prose inline-code mentions of known addresses that are not marked. */
export function addressCandidates(
  tree: AstNode,
  registry: Map<string, AddressDef>,
) {
  const found: string[] = [];
  walkTree(tree, (n) => {
    if (n.type === "code") return "skip";
    if (isJsx(n) && getAttr(n, "data-address") !== undefined) return "skip";
    if (
      n.type === "inlineCode" &&
      typeof n.value === "string" &&
      registry.has(n.value)
    )
      found.push(n.value);
  });
  return found;
}

export interface AddressesOptions extends GeneratorOptions {
  /** Report unmarked prose mentions (informational). */
  report?: boolean;
}

export function runAddresses(opts: AddressesOptions = {}): GeneratorResult & {
  candidates: { file: string; address: string }[];
} {
  const docsRoot = resolveDocsRoot(opts);
  const check = Boolean(opts.check);
  const r = {
    ...emptyResult(),
    candidates: [] as { file: string; address: string }[],
  };
  const list = loadAddresses(docsRoot, r.problems);
  if (r.problems.some((p) => p.level === "error"))
    return { ...finish(r, check), candidates: [] };
  const registry = new Map(list.map((a) => [a.address, a]));
  const locales = loadAddressLocales(
    docsRoot,
    new Set(registry.keys()),
    r.problems,
  );
  if (r.problems.some((p) => p.level === "error"))
    return { ...finish(r, check), candidates: [] };
  // `--check` always verifies marked mentions; `--sync` writes them.
  if (opts.sync || check || opts.report) {
    syncPages(
      docsRoot,
      (s) =>
        s.includes("data-address") ||
        (Boolean(opts.report) &&
          [...registry.keys()].some((k) => s.includes(k))),
      (tree, file, problems) => {
        if (opts.report)
          for (const address of addressCandidates(tree, registry))
            r.candidates.push({ file: file.rel, address });
        const locale = locales.get(file.lang) ?? locales.get("en");
        return syncAddressMentions(tree, registry, problems, locale);
      },
      check || !opts.sync,
      r,
    );
  }
  return { ...finish(r, check), candidates: r.candidates };
}

if (isMain(import.meta.url)) {
  const f = parseFlags(process.argv.slice(2));
  const r = runAddresses({ check: f.check, sync: f.sync, report: f.report });
  printResult("gen:addresses", r, !f.sync || f.check);
  if (f.report) {
    const by = new Map<string, number>();
    for (const c of r.candidates)
      by.set(c.address, (by.get(c.address) ?? 0) + 1);
    console.log(`unmarked prose mentions: ${r.candidates.length}`);
    for (const [a, n] of [...by].sort((x, y) => y[1] - x[1]))
      console.log(`  ${n}\t${a}`);
  }
  process.exit(r.ok ? 0 : 1);
}
