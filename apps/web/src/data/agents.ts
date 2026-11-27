/**
 * Facts, links, and commands for /agents. Copy lives in the `agents`
 * namespace of packages/i18n/messages/web/en/common.json, keyed by the ids
 * below. The Markdown variant (/agents.md) is built from the same data, so a
 * change here shows up on the page and for agents.
 *
 * Commands are verbatim from the Pay.sh docs (https://pay.sh/docs and
 * apps/docs/content/docs/en/payments/pay-sh.mdx) and the Solana MCP guide
 * (apps/docs/content/docs/en/intro/coding-with-agents.mdx).
 */

export const AGENTS_PATH = "/agents";
export const AGENTS_MARKDOWN_PATH = "/agents.md";
export const AGENTS_SOCIAL_IMAGE = "/social/agents.jpg";

export const LINKS = {
  paySh: "https://pay.sh",
  payShDocs: "/docs/payments/pay-sh",
  paySource: "https://github.com/solana-foundation/pay",
  paySdks: "https://github.com/solana-foundation/pay-kit",
  payCatalogContributing:
    "https://github.com/solana-foundation/pay-skills/blob/main/CONTRIBUTING.md",
  x402: "/x402",
  x402Docs: "/docs/payments/agentic-payments/x402",
  agenticPaymentsDocs: "/docs/payments/agentic-payments",
  mpp: "/docs/payments/agentic-payments/mpp",
  solanaMcp: "https://mcp.solana.com",
  codingWithAgents: "/docs/intro/coding-with-agents",
  skills: "/skills",
  skillMd: "/SKILL.md",
  solanaDevSkill: "https://github.com/solana-foundation/solana-dev-skill",
  agentRegistry: "/agent-registry",
  paymentChannels: "/payment-channels",
  paymentChannelsSource:
    "https://github.com/solana-foundation/payment-channels",
  solanaAgentKit: "https://github.com/sendaifun/solana-agent-kit",
  x402Facilitator: "/docs/tools/x402-facilitator",
  awesomeSolanaAi: "https://github.com/solana-foundation/awesome-solana-ai",
  solutionsAi: "/solutions/ai",
  paySpec: "https://pay.sh/docs/accept-payments/provider-spec",
  solanaAi: "https://solana.ai",
} as const;

/** One step of the request/payment loop drawn by the hero scene. */
export type FlowStage = "request" | "challenge" | "payment" | "success";

export const PAID_FLOW: readonly FlowStage[] = [
  "request",
  "challenge",
  "payment",
  "success",
];
export const FREE_FLOW: readonly FlowStage[] = ["request", "success"];

/** Stage colours for the scene, its HTML overlay, and the no-WebGL fallback. */
export const STAGE_COLORS: Record<FlowStage, string> = {
  request: "#ffffff",
  challenge: "#ffb547",
  payment: "#9945ff",
  success: "#14f195",
};

/** An offering's single action: a copyable command or one named link. */
export type OfferingAction =
  | { type: "command"; command: string }
  | { type: "link"; href: string }
  | { type: "connectors" };

export type Offering = {
  id: string;
  action: OfferingAction;
  /** Reference links shown under the result; labels in `offerings.<id>.links`. */
  links?: readonly { id: string; href: string }[];
};

export type AgentPath = {
  id: "pay" | "build" | "earn" | "sell";
  flow: readonly FlowStage[];
  offerings: readonly Offering[];
};

export type PathId = AgentPath["id"];

export const PATHS: readonly AgentPath[] = [
  {
    id: "pay",
    flow: PAID_FLOW,
    offerings: [
      {
        id: "paySh",
        action: { type: "connectors" },
        links: [
          { id: "site", href: LINKS.paySh },
          { id: "docs", href: LINKS.payShDocs },
          { id: "source", href: LINKS.paySource },
          { id: "sdks", href: LINKS.paySdks },
        ],
      },
      {
        id: "x402",
        action: { type: "link", href: LINKS.x402Docs },
        links: [{ id: "product", href: LINKS.x402 }],
      },
      { id: "mpp", action: { type: "link", href: LINKS.mpp } },
    ],
  },
  {
    id: "build",
    flow: FREE_FLOW,
    offerings: [
      {
        id: "mcp",
        action: {
          type: "command",
          command: "npx add-mcp https://mcp.solana.com/mcp -n solana-mcp -g -y",
        },
        links: [
          { id: "site", href: LINKS.solanaMcp },
          { id: "guide", href: LINKS.codingWithAgents },
        ],
      },
      {
        id: "skills",
        action: {
          type: "command",
          command: `npx skills add ${LINKS.solanaDevSkill}`,
        },
        links: [
          { id: "catalog", href: LINKS.skills },
          { id: "skillMd", href: LINKS.skillMd },
          { id: "source", href: LINKS.solanaDevSkill },
        ],
      },
      {
        id: "agentKit",
        action: { type: "link", href: LINKS.solanaAgentKit },
      },
    ],
  },
  {
    id: "earn",
    flow: PAID_FLOW,
    offerings: [
      {
        id: "registry",
        action: { type: "link", href: LINKS.agentRegistry },
      },
      {
        id: "channels",
        action: { type: "link", href: LINKS.paymentChannels },
        links: [{ id: "source", href: LINKS.paymentChannelsSource }],
      },
    ],
  },
  {
    id: "sell",
    flow: PAID_FLOW,
    offerings: [
      {
        id: "gate",
        action: { type: "command", command: "pay gate scaffold paywall.yml" },
        links: [{ id: "spec", href: LINKS.paySpec }],
      },
      {
        id: "catalog",
        action: { type: "link", href: LINKS.payCatalogContributing },
      },
      {
        id: "facilitator",
        action: { type: "link", href: LINKS.x402Facilitator },
      },
    ],
  },
] as const;

export const DEFAULT_PATH: PathId = "pay";

export const PATH_IDS = PATHS.map((path) => path.id);

/** Installs Pay on macOS; Linux and Windows use the release archives. */
export const PAY_INSTALL_COMMAND = "brew install pay";

/**
 * Agents that Pay.sh connects to, each with the one command that starts it
 * with Pay's payment tools attached.
 */
export const CONNECTORS = [
  { id: "claudeCode", command: "pay claude" },
  { id: "codex", command: "pay codex" },
  { id: "goose", command: "pay acp goose" },
  { id: "mcp", command: "pay setup" },
] as const;

export type ConnectorId = (typeof CONNECTORS)[number]["id"];

/** Example prompts. `path` selects the matching hero path and scene flow. */
export const PROMPTS = [
  { id: "quote", path: "pay" },
  { id: "findApi", path: "pay" },
  { id: "buildToken", path: "build" },
  { id: "register", path: "earn" },
  { id: "gateApi", path: "sell" },
] as const satisfies readonly { id: string; path: PathId }[];

export const TRUST_ITEMS = ["keys", "approval", "limits", "cost"] as const;

export const FAQ_ITEMS = [
  "start",
  "keys",
  "protocols",
  "sandbox",
  "agents",
  "sell",
  "more",
] as const;

export const CLOSING_LINKS = [
  { id: "docs", href: LINKS.agenticPaymentsDocs, variant: "primary" },
  { id: "solanaAi", href: LINKS.solanaAi, variant: "secondary" },
] as const;

export const MORE_LINKS = [
  { id: "awesome", href: LINKS.awesomeSolanaAi },
  { id: "solutionsAi", href: LINKS.solutionsAi },
  { id: "codingWithAgents", href: LINKS.codingWithAgents },
] as const;

export const LATEST_NEWS_QUERY = {
  tags: ["agents"],
  limit: 4,
  fallbackImage: AGENTS_SOCIAL_IMAGE,
  fallbackImageAspectRatio: "1200 / 630",
};

export function getPath(id: string): AgentPath {
  return PATHS.find((path) => path.id === id) ?? PATHS[0]!;
}
