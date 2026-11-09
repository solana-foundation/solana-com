/**
 * gen:surfpool:
 *
 *   tsx src/generators/surfpool-rpc.ts [--check]
 *
 * Reads the Surfpool JSON schemas in `packages/docs-tooling/data/surfpool/`
 * (`rpc-schema.json`, `response_schema.json`, `websocket_schema.json`) and
 * writes one MDX snippet per Surfpool RPC reference page to
 * `apps/docs/content/snippets/rpc/surfpool/<category>.mdx`:
 *
 *   accounts admin cheatcodes network node transactions websockets
 *
 * Each snippet is static MDX: a category intro, then per method a `##`
 * heading (so the page TOC is native and every method has an anchor), the
 * description, `<ParamField>`/`<ResponseField>` trees (nested fields inside
 * `<Expandable>`, i.e. native `<details>`), and plain titled request/response
 * fences. Nothing depends on JavaScript: no tabs, no client components.
 * The pages (`docs/en/tools/surfpool/rpc/<category>.mdx`) import these
 * snippets.
 *
 * Which methods appear on which page, their parameters, result fields and
 * sample payloads follow the earlier RPC reference components. Every
 * WebSocket subscription in the schema is listed, parameters keep the
 * schema's (positional) order, and examples are cURL commands against a
 * local Surfnet (`http://127.0.0.1:8899`).
 *
 * `--check` regenerates in memory and exits 1 when any snippet on disk
 * differs, is missing, or is stale. Output goes through the repo's oxfmt so
 * lint-staged never rewrites it.
 *
 * `--sync [--ref <ref>]` first merges upstream schema changes into
 * `data/surfpool/` (see `syncSurfpoolSchemas`), then regenerates.
 */
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkStringify from "remark-stringify";
import type { AstNode } from "../types.ts";
import { STRINGIFY_OPTIONS } from "../lib/codec.ts";
import { docsRoot, repoRoot, toolingRoot } from "../lib/paths.ts";

// ---------------------------------------------------------------------------
// Categories (one snippet and one page each)
// ---------------------------------------------------------------------------

export const SURFPOOL_CATEGORIES = [
  "accounts",
  "admin",
  "cheatcodes",
  "network",
  "node",
  "transactions",
  "websockets",
] as const;
export type SurfpoolCategory = (typeof SURFPOOL_CATEGORIES)[number];

/** Default Surfnet endpoints (`surfpool start`). */
export const SURFNET_HTTP = "http://127.0.0.1:8899";
export const SURFNET_WS = "ws://127.0.0.1:8900";

export const SURFPOOL_DATA_DIR = path.join(toolingRoot, "data", "surfpool");
export const SURFPOOL_SNIPPET_DIR = path.join(
  docsRoot,
  "snippets",
  "rpc",
  "surfpool",
);

// ---------------------------------------------------------------------------
// Schema model
// ---------------------------------------------------------------------------

export interface SchemaNode {
  $ref?: string;
  $defs?: Record<string, SchemaNode>;
  type?: string | string[];
  format?: string;
  description?: string;
  properties?: Record<string, SchemaNode>;
  required?: string[];
  items?: SchemaNode | SchemaNode[];
  enum?: unknown[];
  const?: unknown;
  default?: unknown;
  oneOf?: SchemaNode[];
  anyOf?: SchemaNode[];
}

/**
 * `data/surfpool/examples.json`: curated, live-verified sample requests and
 * results. The schema-derived samples carry generator placeholders
 * (`<some-mint>`, slot `123456789`, ...) that Surfnet rejects, so a method
 * listed here uses these values instead. Methods not listed fall back to the
 * schema-derived sample.
 */
export interface RpcExample {
  params: unknown[];
  /** Sample `result` of the response. */
  result?: unknown;
  /** Complete response body (used instead of `result`, e.g. for errors). */
  response?: unknown;
  /** Extra prose shown under the description. */
  note?: string;
}

export interface WsExample {
  params?: unknown[];
  /** Sample `params.result` of the notification. */
  notification?: unknown;
  /** The method is not implemented by Surfnet: no samples are shown. */
  unsupported?: boolean;
}

export interface SurfpoolExamples {
  rpc: Record<string, RpcExample>;
  websocket: Record<string, WsExample>;
}

export interface SurfpoolSchemas {
  rpc: SchemaNode;
  response: SchemaNode;
  websocket: SchemaNode;
  examples?: SurfpoolExamples;
}

export interface Field {
  name: string;
  type: string;
  description: string;
  required: boolean;
  children: Field[];
}

export interface RpcMethod {
  name: string;
  description: string;
  note?: string;
  params: Field[];
  result: Field[];
  request: string;
  response: string;
}

export interface WsMethod {
  name: string;
  description: string;
  unsupported?: boolean;
  params: Field[];
  unsubscribeName: string;
  subscribe: string;
  subscribeResponse: string;
  notification: string;
  unsubscribe: string;
  unsubscribeResponse: string;
}

export function loadSurfpoolSchemas(dir = SURFPOOL_DATA_DIR): SurfpoolSchemas {
  const read = (f: string) =>
    JSON.parse(readFileSync(path.join(dir, f), "utf8")) as SchemaNode;
  const examplesFile = path.join(dir, "examples.json");
  return {
    rpc: read("rpc-schema.json"),
    response: read("response_schema.json"),
    websocket: read("websocket_schema.json"),
    examples: existsSync(examplesFile)
      ? (JSON.parse(readFileSync(examplesFile, "utf8")) as SurfpoolExamples)
      : undefined,
  };
}

const refName = (ref: string | undefined) => ref?.split("/").pop();

function resolveRef(
  ref: string | undefined,
  src: SchemaNode,
): SchemaNode | null {
  const name = refName(ref);
  return name ? (src.$defs?.[name] ?? null) : null;
}

/** Display type: drop `null` arms; `(optional)` is shown as not-required. */
function describeType(schema: SchemaNode | null | undefined): string {
  if (!schema?.type) return "any";
  if (!Array.isArray(schema.type)) return schema.type;
  return schema.type.filter((t) => t !== "null").join(" | ");
}

function typeToString(type: string | string[] | undefined, fallback = "any") {
  if (Array.isArray(type)) return type.filter((t) => t !== "null").join(" | ");
  return type || fallback;
}

function describeUnionType(def: SchemaNode | null, name: string | undefined) {
  if (!def) return name || "object";
  if (def.type) return describeType(def);
  if (def.enum) return def.enum.map((e) => JSON.stringify(e)).join(" | ");
  const variants = def.oneOf ?? def.anyOf;
  if (variants) {
    return variants
      .map((o) => {
        if (o.const !== undefined) return `"${String(o.const)}"`;
        if (o.type) return describeType(o);
        if (o.$ref) return refName(o.$ref);
        return "unknown";
      })
      .filter((l, i, all) => all.indexOf(l) === i)
      .join(" | ");
  }
  return name || "object";
}

interface UnionField {
  name: string;
  schema: SchemaNode;
  description: string;
}

function splitSingleFieldUnion(def: SchemaNode | null | undefined) {
  const variants = def?.oneOf;
  if (!variants?.length) return null;
  const fields: UnionField[] = [];
  for (const v of variants) {
    if (v.type !== "object" || !v.properties) return null;
    const names = Object.keys(v.properties);
    if (names.length !== 1) return null;
    const schema = v.properties[names[0]!]!;
    fields.push({
      name: names[0]!,
      schema,
      description: v.description || schema.description || "",
    });
  }
  return fields;
}

const PICK_ONE = "Provide exactly one of the fields below.";

/** Parameters of one method, as a tree. */
export function extractParams(
  def: SchemaNode | null | undefined,
  rpc: SchemaNode,
  parentOptional = false,
): Field[] {
  if (!def || typeof def !== "object") return [];
  const props = def.properties ?? {};
  const required = new Set(def.required ?? []);
  const out: Field[] = [];
  const best = (d: SchemaNode | null, fallback: string) => {
    if (d?.description) return d.description;
    if (d?.$ref) {
      const r = resolveRef(d.$ref, rpc);
      if (r?.description) return r.description;
    }
    const base = fallback.split(".").pop()?.toLowerCase() ?? "";
    return base.charAt(0).toUpperCase() + base.slice(1);
  };
  const union = (
    fields: UnionField[],
    name: string,
    description: string,
    optional: boolean,
  ): Field => ({
    name,
    type: "object",
    description: description ? `${description} ${PICK_ONE}` : PICK_ONE,
    required: !optional,
    children: fields.map((f) => ({
      name: f.name,
      type: describeType(f.schema),
      description: f.description,
      required: false,
      children: [],
    })),
  });

  for (const [name, p] of Object.entries(props)) {
    const optional = parentOptional || !required.has(name);
    if (p.$ref) {
      const r = resolveRef(p.$ref, rpc);
      if (r?.type === "object" && r.properties) {
        out.push({
          name,
          type: "object",
          description: best(p, name) || best(r, name) || "Configuration object",
          required: !optional,
          children: extractParams(r, rpc, optional),
        });
        continue;
      }
      const u = splitSingleFieldUnion(r);
      if (u) {
        out.push(union(u, name, best(p, name) || best(r, name), optional));
        continue;
      }
      out.push({
        name,
        type: describeUnionType(r, refName(p.$ref)),
        description: best(p, name) || best(r, name),
        required: !optional,
        children: [],
      });
      continue;
    }
    if (p.anyOf) {
      const nn = p.anyOf.find((o) => o.type !== "null" && o.$ref);
      if (nn?.$ref) {
        const r = resolveRef(nn.$ref, rpc);
        if (r?.type === "object" && r.properties) {
          out.push({
            name,
            type: "object",
            description:
              best(p, name) || best(r, name) || "Configuration object",
            required: false,
            children: extractParams(r, rpc, true),
          });
          continue;
        }
        const description = best(p, name) || best(r, name);
        const u = splitSingleFieldUnion(r);
        if (u) {
          out.push(union(u, name, description, true));
          continue;
        }
        out.push({
          name,
          type: describeUnionType(r, refName(nn.$ref)),
          description,
          required: false,
          children: [],
        });
        continue;
      }
    }
    if (p.type === "object" && p.properties) {
      out.push({
        name,
        type: "object",
        description: best(p, name) || "Configuration object",
        required: !optional,
        children: extractParams(p, rpc, optional),
      });
      continue;
    }
    let type = "string";
    let description = best(p, name);
    if (p.type) {
      if (Array.isArray(p.type)) {
        type = p.type.filter((t) => t !== "null").join(" | ");
      } else {
        type = p.type;
        if (type === "array" && p.items && !Array.isArray(p.items)) {
          const items = p.items;
          if (items.type) {
            type = `array[${String(items.type)}]`;
            if (!description && items.description)
              description = items.description;
          } else if (items.$ref) {
            type = `array[${refName(items.$ref)}]`;
            const r = resolveRef(items.$ref, rpc);
            if (!description && r?.description) description = r.description;
          } else type = "array";
        }
      }
    } else if (p.oneOf) {
      const types = p.oneOf.map((o) => {
        if (o.type) return String(o.type);
        if (o.const) return `"${String(o.const)}"`;
        if (o.$ref) return refName(o.$ref);
        return "unknown";
      });
      type = types.length ? types.join(" | ") : "union type";
    }
    out.push({ name, type, description, required: !optional, children: [] });
  }
  return out;
}

interface FlatResult {
  name: string;
  type: string;
  description: string;
  indent: number;
}

/** Legacy `extractResultFieldsFromSchema` (flat rows with indentation). */
function flatResultFields(
  schema: SchemaNode | null | undefined,
  resp: SchemaNode,
  indent = 0,
): FlatResult[] {
  if (!schema) return [];
  const byName = (n: string | undefined) => (n ? resp.$defs?.[n] : undefined);
  const out: FlatResult[] = [];
  if (schema.$ref) {
    const r = byName(refName(schema.$ref));
    return r ? flatResultFields(r, resp, indent) : [];
  }
  if (schema.anyOf || schema.oneOf) {
    const nn = (schema.anyOf ?? schema.oneOf)!.find((o) => o.type !== "null");
    return nn ? flatResultFields(nn, resp, indent) : [];
  }
  const arrayItems = (items: SchemaNode | undefined, at: number) => {
    if (!items?.$ref) return;
    const r = byName(refName(items.$ref));
    if (r?.type === "object" && r.properties) {
      out.push({
        name: "[]",
        type: "object",
        description: "Array item",
        indent: at,
      });
      out.push(...flatResultFields(r, resp, at + 1));
    }
  };
  if (schema.type === "object" && schema.properties) {
    for (const [key, p] of Object.entries(schema.properties)) {
      const description = p.description || "";
      if (p.$ref) {
        const name = refName(p.$ref);
        const r = byName(name);
        if (r?.type === "object" && r.properties) {
          out.push({ name: key, type: "object", description, indent });
          out.push(...flatResultFields(r, resp, indent + 1));
        } else {
          out.push({
            name: key,
            type: typeToString(r?.type, name || "object"),
            description,
            indent,
          });
        }
      } else if (p.anyOf || p.oneOf) {
        const options = p.anyOf ?? p.oneOf ?? [];
        const nn = options.find((o) => o.type !== "null");
        if (nn?.$ref) {
          const name = refName(nn.$ref);
          const r = byName(name);
          if (r?.type === "object" && r.properties) {
            out.push({ name: key, type: "object", description, indent });
            out.push(...flatResultFields(r, resp, indent + 1));
          } else {
            out.push({ name: key, type: name || "any", description, indent });
          }
        } else if (nn?.type === "object" && nn.properties) {
          out.push({ name: key, type: "object", description, indent });
          out.push(...flatResultFields(nn, resp, indent + 1));
        } else {
          const types = options
            .map((o) => o.type)
            .filter((t): t is string | string[] => !!t && t !== "null")
            .map((t) => typeToString(t, ""))
            .filter(Boolean);
          out.push({
            name: key,
            type: types.join(" | ") || "any",
            description,
            indent,
          });
        }
      } else if (p.type === "object" && p.properties) {
        out.push({ name: key, type: "object", description, indent });
        out.push(...flatResultFields(p, resp, indent + 1));
      } else if (p.type === "array" && p.items) {
        const items = Array.isArray(p.items) ? undefined : p.items;
        const itemType =
          typeToString(items?.type, "") || refName(items?.$ref) || "any";
        out.push({
          name: key,
          type: `array<${itemType}>`,
          description,
          indent,
        });
        arrayItems(items, indent + 1);
      } else {
        out.push({
          name: key,
          type: typeToString(p.type, "any"),
          description,
          indent,
        });
      }
    }
  }
  if (schema.type === "array" && schema.items) {
    const items = Array.isArray(schema.items) ? undefined : schema.items;
    const itemType =
      typeToString(items?.type, "") || refName(items?.$ref) || "any";
    out.push({
      name: "result",
      type: `array<${itemType}>`,
      description: schema.description || "",
      indent,
    });
    arrayItems(items, indent + 1);
  }
  if (
    schema.type &&
    schema.type !== "object" &&
    schema.type !== "array" &&
    !schema.properties
  ) {
    out.push({
      name: "result",
      type: typeToString(schema.type, "any"),
      description: schema.description || "",
      indent,
    });
  }
  return out;
}

/**
 * Flat rows -> tree. Legacy "[]" (array item) rows are folded into their
 * array field: the item's properties become the array's nested fields.
 */
function resultTree(rows: FlatResult[]): Field[] {
  const root: Field = {
    name: "",
    type: "",
    description: "",
    required: false,
    children: [],
  };
  const stack: { indent: number; field: Field }[] = [
    { indent: -1, field: root },
  ];
  for (const r of rows) {
    while (stack.length > 1 && stack[stack.length - 1]!.indent >= r.indent)
      stack.pop();
    const parent = stack[stack.length - 1]!.field;
    if (r.name === "[]") {
      // Children of the array item attach to the array field itself.
      stack.push({ indent: r.indent, field: parent });
      continue;
    }
    const field: Field = {
      name: r.name,
      type: r.type,
      description: r.description,
      required: false,
      children: [],
    };
    parent.children.push(field);
    stack.push({ indent: r.indent, field });
  }
  return root.children;
}

/** Legacy `generateSampleFromSchema` (sample payloads). */
export function sampleFromSchema(
  s: SchemaNode | null | undefined,
  src: SchemaNode,
  fieldName?: string,
): unknown {
  if (!s) return null;
  if (s.$ref) {
    const name = s.$ref.replace("#/$defs/", "");
    const r = src.$defs?.[name];
    return r ? sampleFromSchema(r, src, name || fieldName) : null;
  }
  if (s.const !== undefined) return s.const;
  if (Array.isArray(s.enum) && s.enum.length) return s.enum[0];
  if (s.anyOf || s.oneOf) {
    const nn = (s.anyOf ?? s.oneOf)!.find((o) => o.type !== "null");
    return nn ? sampleFromSchema(nn, src, fieldName) : null;
  }
  if (s.type === "object" && s.properties) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(s.properties))
      out[k] = sampleFromSchema(v, src, k);
    return out;
  }
  if (s.type === "array" && s.items) {
    if (Array.isArray(s.items))
      return s.items.map((i) => sampleFromSchema(i, src, fieldName));
    if (
      fieldName &&
      [
        "accounts",
        "constants",
        "instructions",
        "errors",
        "events",
        "types",
      ].includes(fieldName)
    )
      return [];
    return [sampleFromSchema(s.items, src, fieldName)];
  }
  if (s.type) {
    const t = Array.isArray(s.type) ? (s.type[0] ?? "string") : s.type;
    const name = fieldName?.toLowerCase();
    switch (t) {
      case "string":
        if (!name) return "string";
        if (
          name.includes("pubkey") ||
          name.includes("address") ||
          name.includes("account")
        )
          return "83astBRguLMdt2h5U1Tpdq5tjFoJ6noeGwaY3mDLVcri";
        if (name.includes("signature") || name.includes("sig"))
          return "5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW";
        if (name.includes("hash") || name.includes("blockhash"))
          return "EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N";
        if (name.includes("encoding")) return "base64";
        if (name.includes("commitment")) return "finalized";
        if (name.includes("data")) return "0x3b9aca00";
        if (name.includes("owner")) return "11111111111111111111111111111111";
        if (name === "destinationprogramid")
          return "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
        if (name.includes("tokenprogram") || name.includes("programid"))
          return "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        if (name === "depth") return "instruction";
        return `<some-${name}>`;
      case "integer":
        if (name) {
          if (name.includes("slot")) return 123456789;
          if (
            name.includes("lamport") ||
            name.includes("balance") ||
            name.includes("amount")
          )
            return 1000000000;
          if (name.includes("epoch")) return 100;
        }
        return 0;
      case "number":
        return 0;
      case "boolean":
        return true;
      case "null":
        return null;
      case "array":
        return [];
      case "object":
        return {};
      default:
        return t;
    }
  }
  if (s.default !== undefined) return s.default;
  return null;
}

const json = (v: unknown) => JSON.stringify(v, null, 2);

/**
 * `minContextSlot` samples (`123456789`) make a copy-pasted request fail with
 * -32016 "Minimum context slot has not been reached", so they are never part
 * of a schema-derived sample.
 */
function withoutMinContextSlot(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(withoutMinContextSlot);
  if (v && typeof v === "object")
    return Object.fromEntries(
      Object.entries(v)
        .filter(([k]) => k !== "minContextSlot")
        .map(([k, x]) => [k, withoutMinContextSlot(x)]),
    );
  return v;
}

/**
 * Agave validator admin RPC methods that the Surfnet RPC server does not
 * implement (-32601 "Method not found"). Surfnet only serves `listPlugins`,
 * `startTime` and the plugin management methods.
 */
export const SURFNET_UNSUPPORTED_ADMIN = new Set([
  "rpcAddress",
  "setLogFilter",
  "addAuthorizedVoter",
  "addAuthorizedVoterFromBytes",
  "removeAllAuthorizedVoters",
  "setIdentity",
  "setIdentityFromBytes",
  "setStakedNodesOverrides",
  "repairShredFromPeer",
  "setRepairWhitelist",
  "getSecondaryIndexKeySize",
  "setPublicTpuAddress",
  "setPublicTpuForwardsAddress",
]);

const SCHEMA_GROUPS: Record<string, string> = {
  accounts: "AccountsDataEndpoints",
  accountsScan: "AccountsScanEndpoints",
  admin: "AdminEndpoints",
  bank: "BankDataEndpoints",
  full: "FullEndpoints",
  minimal: "MinimalEndpoints",
  cheatcodes: "SurfnetCheatcodesEndpoints",
};

/** Legacy `endpointCategories` (methods from the bank/full/minimal groups). */
const CATEGORY_METHODS: Record<
  "network" | "node" | "accounts" | "transactions",
  string[]
> = {
  network: [
    "getBlock",
    "getBlockCommitment",
    "getBlockHeight",
    "getBlockProduction",
    "getBlockTime",
    "getBlocks",
    "getBlocksWithLimit",
    "getEpochInfo",
    "getEpochSchedule",
    "getFirstAvailableBlock",
    "getGenesisHash",
    "getHighestSnapshotSlot",
    "getInflationGovernor",
    "getInflationRate",
    "getInflationReward",
    "getLatestBlockhash",
    "getLeaderSchedule",
    "getMaxRetransmitSlot",
    "getMaxShredInsertSlot",
    "getMinimumBalanceForRentExemption",
    "getRecentPerformanceSamples",
    "getRecentPrioritizationFees",
    "getRent",
    "getSlot",
    "getSlotLeader",
    "getSlotLeaders",
    "getSupply",
    "getTransactionCount",
    "getVersion",
    "isBlockhashValid",
    "minimumLedgerSlot",
  ],
  node: ["getClusterNodes", "getHealth", "getIdentity", "getVoteAccounts"],
  accounts: ["getBalance"],
  transactions: [
    "getFeeForMessage",
    "getSignatureStatuses",
    "getSignaturesForAddress",
    "getStakeMinimumDelegation",
    "getTransaction",
    "requestAirdrop",
    "sendTransaction",
    "simulateTransaction",
  ],
};

class RpcModel {
  readonly cheatcodeMap: Record<string, string>;
  readonly methodGroup = new Map<string, string>();
  constructor(readonly s: SurfpoolSchemas) {
    const cheat = s.response.$defs?.SurfnetCheatcodesEndpoints;
    this.cheatcodeMap = Object.fromEntries(
      Object.keys(cheat?.properties ?? {}).map((m) => [m, `surfnet_${m}`]),
    );
    for (const [group, def] of Object.entries(SCHEMA_GROUPS)) {
      for (const m of Object.keys(s.response.$defs?.[def]?.properties ?? {}))
        this.methodGroup.set(m, group);
    }
  }

  responseSchema(method: string): SchemaNode {
    const defs = this.s.response.$defs ?? {};
    let group = this.methodGroup.get(method);
    if (!group && method.startsWith("surfnet_")) {
      const base = Object.keys(this.cheatcodeMap).find(
        (k) => this.cheatcodeMap[k] === method,
      );
      if (base) group = this.methodGroup.get(base);
    }
    if (group && SCHEMA_GROUPS[group]) {
      const g = defs[SCHEMA_GROUPS[group]!];
      if (g?.properties?.[method]) return g.properties[method]!;
      const base = method.replace(/^surfnet_/, "");
      if (method.startsWith("surfnet_") && g?.properties?.[base])
        return g.properties[base]!;
    }
    for (const def of Object.values(SCHEMA_GROUPS)) {
      const g = defs[def];
      if (g?.properties?.[method]) return g.properties[method]!;
    }
    return {
      type: ["object", "array", "string", "integer", "boolean", "null"],
      description:
        "The result data returned by the RPC method depends on the specific implementation.",
    };
  }

  responseExample(schema: SchemaNode, method: string, fieldName = method) {
    const ex = this.s.examples?.rpc[method];
    if (ex?.response !== undefined) return json(ex.response);
    return json({
      jsonrpc: "2.0",
      id: 1,
      result:
        ex?.result !== undefined
          ? ex.result
          : sampleFromSchema(schema, this.s.response, fieldName),
    });
  }

  /** Sample params: curated example first, else schema-derived. */
  exampleParams(method: string, derived: unknown[]): unknown[] {
    const ex = this.s.examples?.rpc[method];
    return ex ? ex.params : (withoutMinContextSlot(derived) as unknown[]);
  }

  fromSchema(
    key: string,
    def: SchemaNode,
    endpoint: SchemaNode,
    cheat: boolean,
  ): RpcMethod {
    let name = key;
    if (cheat && this.cheatcodeMap[key]) name = this.cheatcodeMap[key]!;
    if (endpoint.const) {
      name = String(endpoint.const);
      const schema = this.responseSchema(name);
      return {
        name,
        description: endpoint.description || `${name} method`,
        note: this.s.examples?.rpc[name]?.note,
        params: [],
        result: resultTree(flatResultFields(schema, this.s.response)),
        request: json({
          jsonrpc: "2.0",
          id: 1,
          method: name,
          params: this.exampleParams(name, []),
        }),
        response: this.responseExample(schema, name),
      };
    }
    const ref = refName(def.$ref);
    const actual = ref ? this.s.rpc.$defs?.[ref] : def;
    const exampleParams = actual?.properties
      ? Object.keys(actual.properties).map((k) =>
          sampleFromSchema(actual.properties![k], this.s.rpc, k),
        )
      : [];
    const schema = this.responseSchema(name);
    return {
      name,
      description: endpoint.description || `${name} method`,
      note: this.s.examples?.rpc[name]?.note,
      params: extractParams(actual, this.s.rpc),
      result: resultTree(flatResultFields(schema, this.s.response)),
      request: json({
        jsonrpc: "2.0",
        id: 1,
        method: name,
        params: this.exampleParams(name, exampleParams),
      }),
      response: this.responseExample(schema, name),
    };
  }

  group(defName: string, cheat = false): RpcMethod[] {
    const g = this.s.rpc.$defs?.[defName];
    const out: RpcMethod[] = [];
    for (const e of g?.oneOf ?? []) {
      if (e.type === "string" && e.const) {
        out.push(this.fromSchema(String(e.const), {}, e, cheat));
      } else if (e.type === "object" && e.properties) {
        for (const [k, d] of Object.entries(e.properties))
          out.push(this.fromSchema(k, d, e, cheat));
      }
    }
    return out;
  }

  byCategory(c: keyof typeof CATEGORY_METHODS): RpcMethod[] {
    const names = CATEGORY_METHODS[c];
    const all = [
      ...this.group("endpoints4"),
      ...this.group("endpoints5"),
      ...this.group("endpoints6"),
    ];
    return dedupe(all.filter((m) => names.includes(m.name)));
  }

  cheatcodes(): RpcMethod[] {
    const cheat = this.s.response.$defs?.SurfnetCheatcodesEndpoints;
    if (!cheat?.properties) return [];
    const fromRpc = this.group("endpoints7", true);
    const have = new Set(fromRpc.map((m) => m.name.replace(/^surfnet_/, "")));
    const out = [...fromRpc];
    for (const [m, schema] of Object.entries(cheat.properties)) {
      if (have.has(m)) continue;
      const name = this.cheatcodeMap[m] || `surfnet_${m}`;
      out.push({
        name,
        description:
          schema.description?.replace(`${m} - `, "") || `${m} method`,
        note: this.s.examples?.rpc[name]?.note,
        params: [],
        result: resultTree(flatResultFields(schema, this.s.response)),
        request: json({
          jsonrpc: "2.0",
          id: 1,
          method: name,
          params: this.exampleParams(name, []),
        }),
        response: this.responseExample(schema, name, m),
      });
    }
    return out;
  }
}

function dedupe<T extends { name: string }>(xs: T[]): T[] {
  return [...new Map(xs.map((x) => [x.name, x])).values()];
}

/** Legacy websocket category key (first match), else the method's base. */
const WS_CATEGORIES = [
  "account",
  "signature",
  "slot",
  "logs",
  "program",
  "block",
];

export function websocketMethods(s: SurfpoolSchemas): WsMethod[] {
  const ws = s.websocket;
  const resp = s.response;
  const subs = resp.$defs?.WebSocketSubscriptions?.properties ?? {};
  const all = { ...(ws.properties ?? {}), ...subs };
  const out: WsMethod[] = [];
  const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
  for (const name of Object.keys(all)) {
    if (!name.endsWith("Subscribe")) continue;
    const base = name.slice(0, -"Subscribe".length);
    const category =
      WS_CATEGORIES.find((k) => name.toLowerCase().includes(k)) ?? base;
    const def =
      resolveRef(
        ws.$defs?.[`${cap(category)}SubscriptionEndpoints`]?.properties?.[name]
          ?.$ref,
        ws,
      ) || subs[name];
    if (!def) continue;
    const unsubscribeName = name.replace("Subscribe", "Unsubscribe");
    const request = resolveRef(def.properties?.request?.$ref, ws);
    const notification = subs[name];
    const params: Field[] = [];
    const required = new Set(request?.required ?? []);
    const props = Object.entries(request?.properties ?? {}).sort(
      ([a], [b]) => (required.has(a) ? 0 : 1) - (required.has(b) ? 0 : 1),
    );
    for (const [p, d] of props) {
      let type = "any";
      if (d.$ref) type = refName(d.$ref) || "object";
      else if (d.anyOf)
        type = d.anyOf
          .map((o) => refName(o.$ref) || o.type)
          .filter((t) => t !== "null")
          .join(" | ");
      else if (d.oneOf)
        type = d.oneOf.map((o) => refName(o.$ref) || o.type).join(" | ");
      else if (d.type) type = String(d.type);
      params.push({
        name: p,
        type,
        description: d.description || "No description provided.",
        required: required.has(p),
        children: [],
      });
    }
    // Positional order: required parameters (pubkey, programId, signature)
    // first, then the optional config object.
    const sample = request?.properties
      ? Object.keys(request.properties)
          .sort((a, b) => (required.has(a) ? 0 : 1) - (required.has(b) ? 0 : 1))
          .map((k) => sampleFromSchema(request.properties![k], ws))
      : [];
    const ex = s.examples?.websocket[name];
    out.push({
      name,
      description: def.description || "No description available.",
      unsupported: ex?.unsupported,
      params,
      unsubscribeName,
      subscribe: json({
        jsonrpc: "2.0",
        id: 1,
        method: name,
        params: ex?.params ?? sample,
      }),
      subscribeResponse: json({ jsonrpc: "2.0", id: 1, result: 12345 }),
      notification: json({
        jsonrpc: "2.0",
        method: `${category}Notification`,
        params: {
          result:
            ex?.notification !== undefined
              ? ex.notification
              : sampleFromSchema(notification, resp),
          subscription: 12345,
        },
      }),
      unsubscribe: json({
        jsonrpc: "2.0",
        id: 1,
        method: unsubscribeName,
        params: [12345],
      }),
      unsubscribeResponse: json({ jsonrpc: "2.0", id: 1, result: true }),
    });
  }
  return dedupe(out);
}

export interface SurfpoolModel {
  rpc: Record<Exclude<SurfpoolCategory, "websockets">, RpcMethod[]>;
  websockets: WsMethod[];
}

export function buildSurfpoolModel(s: SurfpoolSchemas): SurfpoolModel {
  const m = new RpcModel(s);
  return {
    rpc: {
      accounts: dedupe([
        ...m.group("endpoints"),
        ...m.group("endpoints2"),
        ...m.byCategory("accounts"),
      ]),
      admin: m
        .group("endpoints3")
        .filter((x) => !SURFNET_UNSUPPORTED_ADMIN.has(x.name)),
      cheatcodes: m.cheatcodes(),
      network: m.byCategory("network"),
      node: m.byCategory("node"),
      transactions: m.byCategory("transactions"),
    },
    websockets: websocketMethods(s),
  };
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

/** Legacy `categoryDescriptions` (RpcPageContent / WebSocketsRpc). */
const INTROS: Record<SurfpoolCategory, string> = {
  transactions:
    "These methods handle the creation, simulation, and inspection of transactions on the blockchain. They are essential for executing state changes, estimating fees, checking transaction outcomes, and monitoring transaction lifecycles.",
  accounts:
    "Query account states, balances, token holdings, and program-specific storage data.",
  cheatcodes:
    "Powerful testing utilities unique to Surfpool that allow you to directly modify account and token states. These methods are only available on Surfnet.",
  node: "Monitor node status, health checks, cluster information, and validator details.",
  network:
    "Access network-wide information like epoch data, inflation rates, and performance metrics.",
  admin:
    "Administrative controls for managing the Surfnet instance and its plugins. These come from the Agave validator admin RPC, and Surfnet implements only `exit`, `listPlugins`, `startTime`, `loadPlugin`, `reloadPlugin` and `unloadPlugin`. The other Agave admin methods (for example `setIdentity` or `setLogFilter`) return `-32601 Method not found` on Surfnet and are not listed.",
  websockets: `Real-time WebSocket subscriptions for monitoring blockchain state changes. Connect to \`${SURFNET_WS}\` when running Surfnet. Surfnet implements \`accountSubscribe\`, \`logsSubscribe\`, \`programSubscribe\`, \`signatureSubscribe\` and \`slotSubscribe\`; \`blockSubscribe\`, \`voteSubscribe\` and \`slotUpdatesSubscribe\` are listed for completeness but are not supported. In every notification the payload is wrapped in \`params.result\`, next to the \`subscription\` id.`,
};

const mdParser = unified().use(remarkParse).use(remarkGfm);
const mdxPrinter = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMdx)
  .use(remarkStringify, STRINGIFY_OPTIONS as never);

/** Schema description (markdown-ish doc comment) -> flow nodes, MDX-safe. */
function prose(md: string): AstNode[] {
  const tree = mdParser.parse(md.trim()) as unknown as AstNode;
  const sanitize = (n: AstNode): AstNode => {
    if (n.type === "html") return { type: "text", value: String(n.value) };
    const { position: _p, ...rest } = n;
    return rest.children
      ? { ...rest, children: rest.children.map(sanitize) }
      : (rest as AstNode);
  };
  return (tree.children ?? [])
    .map(sanitize)
    .map((n) => (n.type === "text" ? { type: "paragraph", children: [n] } : n));
}

const attr = (name: string, value: string | null): AstNode => ({
  type: "mdxJsxAttribute",
  name,
  value,
});

function el(name: string, attributes: AstNode[], children: AstNode[]): AstNode {
  return { type: "mdxJsxFlowElement", name, attributes, children };
}

/** Top-level fields open their first nesting level (see `_rpc.renderField`). */
function field(f: Field, kind: "param" | "response", level = 0): AstNode {
  const attributes = [
    attr(kind === "param" ? "body" : "name", f.name),
    attr("type", f.type || "any"),
  ];
  if (kind === "param" && f.required) attributes.push(attr("required", null));
  const children = f.description ? prose(f.description) : [];
  if (f.children.length)
    children.push(
      el(
        "Expandable",
        level === 0
          ? [attr("title", "properties"), attr("defaultOpen", null)]
          : [attr("title", "properties")],
        f.children.map((c) => field(c, kind, level + 1)),
      ),
    );
  return el(
    kind === "param" ? "ParamField" : "ResponseField",
    attributes,
    children,
  );
}

const label = (t: string): AstNode => ({
  type: "paragraph",
  children: [{ type: "strong", children: [{ type: "text", value: t }] }],
});

const fence = (lang: string, title: string, value: string): AstNode => ({
  type: "code",
  lang,
  meta: /\s/.test(title) ? `title="${title}"` : title,
  value,
});

const curl = (body: string) =>
  [
    `curl ${SURFNET_HTTP} -s -X POST \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '`,
    ...body.split("\n").map((l) => `  ${l}`.replace(/'/g, `'\\''`)),
    `'`,
  ].join("\n");

function rpcMethodNodes(m: RpcMethod): AstNode[] {
  const out: AstNode[] = [
    { type: "heading", depth: 2, children: [{ type: "text", value: m.name }] },
    ...prose(m.description),
    ...(m.note ? prose(m.note) : []),
  ];
  if (m.params.length) {
    out.push(label("Parameters"), ...m.params.map((p) => field(p, "param")));
  }
  if (m.result.length) {
    out.push(label("Result"), ...m.result.map((r) => field(r, "response")));
  }
  out.push(fence("bash", "Request", curl(m.request)));
  out.push(fence("json", "Response", m.response));
  return out;
}

function wsMethodNodes(m: WsMethod): AstNode[] {
  const out: AstNode[] = [
    { type: "heading", depth: 2, children: [{ type: "text", value: m.name }] },
    ...prose(m.description),
  ];
  if (m.params.length)
    out.push(label("Parameters"), ...m.params.map((p) => field(p, "param")));
  if (m.unsupported) {
    out.push({
      type: "paragraph",
      children: [
        {
          type: "strong",
          children: [{ type: "text", value: "Not supported by Surfnet." }],
        },
        {
          type: "text",
          value: ` ${m.name} is rejected (or not found) by the Surfnet WebSocket server. It is listed because it is part of the Solana RPC API.`,
        },
      ],
    });
    return out;
  }
  out.push(
    fence("json", "Subscribe", m.subscribe),
    fence("json", "Subscribe response", m.subscribeResponse),
    fence("json", "Notification", m.notification),
    fence("json", `${m.unsubscribeName}`, m.unsubscribe),
    fence("json", `${m.unsubscribeName} response`, m.unsubscribeResponse),
  );
  return out;
}

export const GENERATED_HEADER =
  "GENERATED by packages/docs-tooling/src/generators/surfpool-rpc.ts from packages/docs-tooling/data/surfpool/*.json. Do not edit: run `pnpm --filter @workspace/docs-tooling exec tsx src/generators/surfpool-rpc.ts`.";

export function renderSnippet(
  c: SurfpoolCategory,
  model: SurfpoolModel,
): string {
  const children: AstNode[] = [
    { type: "mdxFlowExpression", value: `/* ${GENERATED_HEADER} */` },
    ...prose(INTROS[c]),
  ];
  if (c === "websockets")
    for (const m of model.websockets) children.push(...wsMethodNodes(m));
  else for (const m of model.rpc[c]) children.push(...rpcMethodNodes(m));
  return mdxPrinter.stringify({ type: "root", children } as never);
}

/** Every snippet, keyed by file name. Pure. */
export function renderSurfpoolSnippets(
  s: SurfpoolSchemas,
): Map<string, string> {
  const model = buildSurfpoolModel(s);
  return new Map(
    SURFPOOL_CATEGORIES.map((c) => [`${c}.mdx`, renderSnippet(c, model)]),
  );
}

export interface GenResult {
  written: string[];
  stale: string[];
  removed: string[];
  ok: boolean;
}

/**
 * Format with the repo's pinned oxfmt (`.oxfmtrc.json`), exactly what
 * lint-staged runs on `*.{mdx,json}` at commit time. Without this the
 * committed snippets would be reformatted on commit and `--check` would
 * report them stale forever.
 */
export function oxfmt(text: string, repoRelPath: string): string {
  const bin = path.join(repoRoot, "node_modules", ".bin", "oxfmt");
  if (!existsSync(bin))
    throw new Error(
      `oxfmt not found at ${bin}: run pnpm install at the repo root`,
    );
  const r = spawnSync(
    bin,
    [
      "-c",
      path.join(repoRoot, ".oxfmtrc.json"),
      `--stdin-filepath=${repoRelPath}`,
    ],
    { input: text, encoding: "utf8", cwd: repoRoot },
  );
  if (r.status !== 0)
    throw new Error(`oxfmt failed on ${repoRelPath}: ${r.stderr}`);
  return r.stdout;
}

export function runSurfpoolGenerator(
  opts: {
    check?: boolean;
    dataDir?: string;
    outDir?: string;
    format?: boolean;
  } = {},
): GenResult {
  const outDir = opts.outDir ?? SURFPOOL_SNIPPET_DIR;
  const raw = renderSurfpoolSnippets(loadSurfpoolSchemas(opts.dataDir));
  const files = new Map(
    [...raw].map(([f, content]) => [
      f,
      opts.format === false
        ? content
        : oxfmt(
            content,
            path.relative(repoRoot, path.join(SURFPOOL_SNIPPET_DIR, f)),
          ),
    ]),
  );
  const res: GenResult = { written: [], stale: [], removed: [], ok: true };
  const existing = existsSync(outDir)
    ? readdirSync(outDir).filter((f) => f.endsWith(".mdx"))
    : [];
  for (const f of existing.sort()) {
    if (!files.has(f)) {
      res.stale.push(f);
      if (!opts.check) {
        rmSync(path.join(outDir, f));
        res.removed.push(f);
      }
    }
  }
  for (const [f, content] of [...files].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const abs = path.join(outDir, f);
    const current = existsSync(abs) ? readFileSync(abs, "utf8") : null;
    if (current === content) continue;
    res.stale.push(f);
    if (!opts.check) {
      mkdirSync(outDir, { recursive: true });
      writeFileSync(abs, content);
      res.written.push(f);
    }
  }
  res.ok = !opts.check || res.stale.length === 0;
  return res;
}

// ---------------------------------------------------------------------------
// Schema drift sync (`--sync [--ref <ref>]`, weekly workflow)
// ---------------------------------------------------------------------------

/**
 * `data/surfpool/upstream.json`: where the schemas come from and the upstream
 * commit the local copies were last synced to. The local copies also carry
 * solana.com edits (e.g. lowercase commitment constants and the clock
 * cheatcode wording from 55383ab74), so a sync is a 3-way merge
 * (base = upstream@base, ours = data file, theirs = upstream@ref) that keeps
 * them, not an overwrite.
 */
export interface SurfpoolUpstream {
  repo: string;
  path: string;
  files: string[];
  base: string;
}

export const SURFPOOL_UPSTREAM_FILE = path.join(
  SURFPOOL_DATA_DIR,
  "upstream.json",
);

export interface SyncResult {
  from: string;
  to: string;
  updated: string[];
  conflicts: string[];
  upToDate: boolean;
}

/** Canonical JSON text, so formatting differences never conflict. */
const canonical = (text: string) =>
  `${JSON.stringify(JSON.parse(text), null, 2)}\n`;

async function fetchText(url: string): Promise<string> {
  const headers: Record<string, string> = {
    "user-agent": "solana-com-docs-tooling",
  };
  if (process.env.GITHUB_TOKEN)
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`GET ${url}: ${r.status} ${r.statusText}`);
  return r.text();
}

export async function resolveUpstreamRef(
  repo: string,
  ref: string,
): Promise<string> {
  const body = JSON.parse(
    await fetchText(
      `https://api.github.com/repos/${repo}/commits/${encodeURIComponent(ref)}`,
    ),
  ) as { sha?: string };
  if (!body.sha) throw new Error(`cannot resolve ${repo}@${ref}`);
  return body.sha;
}

/** 3-way merge of one JSON file with `git merge-file` on canonical text. */
export function mergeJson(
  ours: string,
  base: string,
  theirs: string,
): { text: string; conflicts: boolean } {
  const dir = mkdtempSync(path.join(tmpdir(), "surfpool-sync-"));
  try {
    const [o, b, t] = ["ours.json", "base.json", "theirs.json"].map((n) =>
      path.join(dir, n),
    );
    writeFileSync(o!, canonical(ours));
    writeFileSync(b!, canonical(base));
    writeFileSync(t!, canonical(theirs));
    const r = spawnSync(
      "git",
      [
        "merge-file",
        "-p",
        "-L",
        "ours",
        "-L",
        "base",
        "-L",
        "theirs",
        o!,
        b!,
        t!,
      ],
      {
        encoding: "utf8",
      },
    );
    if (r.status === null || r.status < 0)
      throw new Error(`git merge-file failed: ${r.stderr}`);
    const text = r.stdout;
    if (r.status > 0) return { text, conflicts: true };
    JSON.parse(text); // a clean textual merge must still be valid JSON
    return { text, conflicts: false };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export async function syncSurfpoolSchemas(ref: string): Promise<SyncResult> {
  const up = JSON.parse(
    readFileSync(SURFPOOL_UPSTREAM_FILE, "utf8"),
  ) as SurfpoolUpstream;
  const to = await resolveUpstreamRef(up.repo, ref);
  const res: SyncResult = {
    from: up.base,
    to,
    updated: [],
    conflicts: [],
    upToDate: to === up.base,
  };
  if (res.upToDate) return res;
  const raw = (sha: string, f: string) =>
    fetchText(
      `https://raw.githubusercontent.com/${up.repo}/${sha}/${up.path}/${f}`,
    );
  const merged = new Map<string, string>();
  for (const f of up.files) {
    const abs = path.join(SURFPOOL_DATA_DIR, f);
    const ours = readFileSync(abs, "utf8");
    const m = mergeJson(ours, await raw(up.base, f), await raw(to, f));
    if (m.conflicts) {
      res.conflicts.push(f);
      continue;
    }
    if (canonical(m.text) !== canonical(ours)) merged.set(f, m.text);
  }
  if (res.conflicts.length) return res; // write nothing on conflict
  for (const [f, text] of merged) {
    const rel = path.relative(repoRoot, path.join(SURFPOOL_DATA_DIR, f));
    writeFileSync(path.join(SURFPOOL_DATA_DIR, f), oxfmt(text, rel));
    res.updated.push(f);
  }
  up.base = to;
  writeFileSync(
    SURFPOOL_UPSTREAM_FILE,
    oxfmt(
      `${JSON.stringify(up, null, 2)}\n`,
      path.relative(repoRoot, SURFPOOL_UPSTREAM_FILE),
    ),
  );
  return res;
}

function argValue(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const rel = path.relative(repoRoot, SURFPOOL_SNIPPET_DIR);
  if (process.argv.includes("--sync")) {
    const ref = argValue("--ref") ?? process.env.SURFPOOL_SCHEMA_REF ?? "main";
    const s = await syncSurfpoolSchemas(ref);
    if (s.upToDate)
      console.log(`gen:surfpool --sync: up to date with ${ref} (${s.to})`);
    else if (s.conflicts.length) {
      console.error(
        `gen:surfpool --sync: merge conflicts in ${s.conflicts.join(", ")} (${s.from} -> ${s.to}); nothing written. Merge by hand, then update data/surfpool/upstream.json "base".`,
      );
      return 2;
    } else
      console.log(
        `gen:surfpool --sync: ${s.from.slice(0, 9)} -> ${s.to.slice(0, 9)} (${ref}); updated ${s.updated.join(", ") || "no schema files"}`,
      );
  }
  const check = process.argv.includes("--check");
  const r = runSurfpoolGenerator({ check });
  if (check) {
    if (r.ok) console.log(`gen:surfpool --check: ${rel} is up to date`);
    else
      console.error(
        `gen:surfpool --check: stale ${r.stale.map((f) => `${rel}/${f}`).join(", ")}`,
      );
  } else {
    console.log(
      `gen:surfpool: wrote ${r.written.length}, removed ${r.removed.length}, unchanged ${SURFPOOL_CATEGORIES.length - r.written.length} (${rel})`,
    );
  }
  return r.ok ? 0 : 1;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().then(
    (code) => (process.exitCode = code),
    (err: unknown) => {
      console.error(err instanceof Error ? err.message : err);
      process.exitCode = 1;
    },
  );
}
