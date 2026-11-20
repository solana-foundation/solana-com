/** Feature claims verified against first-party Solana product/docs pages on 2026-10-27.
 * A missing feature is unknown, not an assertion that the provider lacks it.
 * Availability can vary by plan; see each linked source before selecting a service.
 */
export const RPC_FEATURES = [
  { id: "websocket", group: "streaming" },
  { id: "grpc", group: "streaming" },
  { id: "history", group: "data" },
  { id: "enhanced", group: "data" },
  { id: "free", group: "access" },
  { id: "trial", group: "access" },
  { id: "dedicated", group: "access" },
  { id: "regions", group: "reliability" },
  { id: "sla", group: "reliability" },
] as const;

export type RpcFeatureId = (typeof RPC_FEATURES)[number]["id"];
export type RpcFeatureGroup = (typeof RPC_FEATURES)[number]["group"];
export type RpcFeatureEvidence = {
  sourceUrl: string;
  checkedOn: string;
  note: string;
};

export const RPC_PROVIDER_FEATURES: Record<
  string,
  Partial<Record<RpcFeatureId, RpcFeatureEvidence>>
> = {
  alchemy: {
    free: {
      sourceUrl: "https://www.alchemy.com/solana",
      checkedOn: "2026-10-27",
      note: "Solana-specific product page says Get started for free; plan limits on pricing page.",
    },
    websocket: {
      sourceUrl:
        "https://www.alchemy.com/docs/reference/solana-subscription-api-endpoints",
      checkedOn: "2026-10-27",
      note: "Solana Mainnet and Devnet PubSub WebSocket endpoints.",
    },
    grpc: {
      sourceUrl:
        "https://www.alchemy.com/docs/reference/yellowstone-grpc-api-overview",
      checkedOn: "2026-10-27",
      note: "Yellowstone gRPC Solana subscriptions.",
    },
    history: {
      sourceUrl:
        "https://www.alchemy.com/blog/how-alchemy-built-the-fastest-archival-methods-on-solana",
      checkedOn: "2026-10-27",
      note: "Historical transactions, blocks and signatures via RPC; separate paid Account Archive for historical account state.",
    },
    enhanced: {
      sourceUrl:
        "https://www.alchemy.com/docs/reference/feature-support-by-chain",
      checkedOn: "2026-10-27",
      note: "Solana DAS and Photon APIs listed by chain.",
    },
  },
  ankr: {
    free: {
      sourceUrl: "https://www.ankr.com/docs/whats-new/",
      checkedOn: "2026-10-27",
      note: "Solana is labeled Freemium/Premium; sign-in is needed for free access under the revised chain availability.",
    },
    websocket: {
      sourceUrl: "https://www.ankr.com/docs/rpc-service/pricing/",
      checkedOn: "2026-10-27",
      note: "Solana WSS subscriptions/notifications are priced; Premium plans support WSS.",
    },
  },
  blockdaemon: {
    dedicated: {
      sourceUrl: "https://www.blockdaemon.com/networks",
      checkedOn: "2026-10-27",
      note: "Solana is explicitly listed with dedicated nodes.",
    },
    websocket: {
      sourceUrl: "https://docs.blockdaemon.com/reference/rpc-websocket",
      checkedOn: "2026-10-27",
      note: "Solana subscriptions and their compute-unit charges documented.",
    },
    history: {
      sourceUrl: "https://docs.blockdaemon.com/docs/historical-data",
      checkedOn: "2026-10-27",
      note: "Solana Mainnet RPC full history in chain/network table; Devnet/Testnet partial history.",
    },
  },
  chainflow: {},
  chainstack: {
    free: {
      sourceUrl: "https://chainstack.com/build-better-with-solana/",
      checkedOn: "2026-10-27",
      note: "No-cost plan lists 3 million calls monthly.",
    },
    dedicated: {
      sourceUrl: "https://chainstack.com/build-better-with-solana/",
      checkedOn: "2026-10-27",
      note: "Dedicated Solana RPC nodes offered.",
    },
    websocket: {
      sourceUrl: "https://chainstack.com/build-better-with-solana/",
      checkedOn: "2026-10-27",
      note: "Solana JSON-RPC over HTTP and WebSocket described.",
    },
    grpc: {
      sourceUrl: "https://chainstack.com/build-better-with-solana/",
      checkedOn: "2026-10-27",
      note: "Yellowstone gRPC Geyser streaming documented.",
    },
    history: {
      sourceUrl: "https://chainstack.com/archive-data/",
      checkedOn: "2026-10-27",
      note: "Solana archive nodes and historical ledger queries documented.",
    },
  },
  "digital-energy": {
    history: {
      sourceUrl: "https://digital-energy.io/",
      checkedOn: "2026-10-27",
      note: "Operator lists commercial Solana RPC with account indexes and full transaction history.",
    },
  },
  fluxrpc: {
    free: {
      sourceUrl: "https://fluxrpc.com/",
      checkedOn: "2026-10-27",
      note: "Pricing comparison lists a $0 Free tier.",
    },
    websocket: {
      sourceUrl: "https://fluxrpc.com/docs",
      checkedOn: "2026-10-27",
      note: "Solana WebSocket subscriptions and endpoint listed.",
    },
    grpc: {
      sourceUrl: "https://fluxrpc.com/docs",
      checkedOn: "2026-10-27",
      note: "Yellowstone gRPC Solana endpoint listed; product page says available on paid plans.",
    },
  },
  getblock: {
    free: {
      sourceUrl: "https://getblock.io/nodes/sol/",
      checkedOn: "2026-10-27",
      note: "Solana Free tier with shared Mainnet/Devnet/Testnet endpoint and daily CU allowance.",
    },
    dedicated: {
      sourceUrl: "https://getblock.io/pricing/",
      checkedOn: "2026-10-27",
      note: "Solana dedicated node configuration listed.",
    },
    websocket: {
      sourceUrl: "https://getblock.io/nodes/sol/",
      checkedOn: "2026-10-27",
      note: "Solana Free plan explicitly includes WebSocket access.",
    },
    grpc: {
      sourceUrl: "https://getblock.io/pricing/",
      checkedOn: "2026-10-27",
      note: "Yellowstone gRPC offered as an add-on to Solana dedicated node configuration.",
    },
    history: {
      sourceUrl: "https://getblock.io/blog/getblock-dev-update-april-2025/",
      checkedOn: "2026-10-27",
      note: "Solana archive node API documented in addition to shared/dedicated full nodes.",
    },
  },
  helius: {
    free: {
      sourceUrl: "https://www.helius.dev/pricing",
      checkedOn: "2026-10-27",
      note: "Solana Free plan listed.",
    },
    dedicated: {
      sourceUrl: "https://www.helius.dev/pricing",
      checkedOn: "2026-10-27",
      note: "Dedicated RPC nodes offered separately for custom requirements.",
    },
    websocket: {
      sourceUrl: "https://www.helius.dev/blog/laserstream-websockets",
      checkedOn: "2026-10-27",
      note: "Standard and enhanced Solana WebSockets documented.",
    },
    grpc: {
      sourceUrl: "https://www.helius.dev/pricing",
      checkedOn: "2026-10-27",
      note: "LaserStream gRPC: Devnet on Developer plan; broader gRPC from Business plan.",
    },
    history: {
      sourceUrl: "https://www.helius.dev/solana-rpc-nodes",
      checkedOn: "2026-10-27",
      note: "Helius historical data product and archival methods listed.",
    },
    enhanced: {
      sourceUrl: "https://www.helius.dev/solana-rpc-nodes",
      checkedOn: "2026-10-27",
      note: "Token APIs, parsed events, and webhooks listed as Solana data products.",
    },
  },
  nownodes: {
    websocket: {
      sourceUrl: "https://nownodes.io/nodes/solana-sol",
      checkedOn: "2026-10-27",
      note: "Solana RPC supports WebSocket subscriptions.",
    },
    dedicated: {
      sourceUrl: "https://nownodes.io/nodes/solana-sol",
      checkedOn: "2026-10-27",
      note: "Shared and dedicated Solana nodes are listed.",
    },
    trial: {
      sourceUrl: "https://nownodes.io/nodes/solana-sol",
      checkedOn: "2026-10-27",
      note: "START plan includes 100,000 requests for one month.",
    },
    regions: {
      sourceUrl: "https://nownodes.io/nodes/solana-sol",
      checkedOn: "2026-10-27",
      note: "Requests use geo-distributed, load-balanced node clusters.",
    },
    sla: {
      sourceUrl: "https://nownodes.io/nodes/solana-sol",
      checkedOn: "2026-10-27",
      note: "An uptime and support SLA is stated; check the plan terms.",
    },
  },
  orbitflare: {
    websocket: {
      sourceUrl: "https://orbitflare.com/products/rpc-nodes",
      checkedOn: "2026-10-27",
      note: "WebSockets are included across RPC plans.",
    },
    history: {
      sourceUrl: "https://orbitflare.com/products/rpc-nodes",
      checkedOn: "2026-10-27",
      note: "Archival data is included across RPC plans.",
    },
    free: {
      sourceUrl: "https://orbitflare.com/products/rpc-nodes",
      checkedOn: "2026-10-27",
      note: "A $0 Solana RPC plan is listed.",
    },
    regions: {
      sourceUrl: "https://orbitflare.com/products/rpc-nodes",
      checkedOn: "2026-10-27",
      note: "RPC is available in 11 global regions.",
    },
    sla: {
      sourceUrl: "https://orbitflare.com/products/rpc-nodes",
      checkedOn: "2026-10-27",
      note: "The published uptime SLA applies to paid plans.",
    },
    grpc: {
      sourceUrl: "https://orbitflare.com/products/rpc-nodes",
      checkedOn: "2026-10-27",
      note: "Devnet gRPC is listed on lower plans; Mainnet gRPC requires a higher plan or add-on.",
    },
    dedicated: {
      sourceUrl: "https://orbitflare.com/products/dedicated-nodes",
      checkedOn: "2026-10-27",
      note: "Dedicated RPC infrastructure is a separately priced option.",
    },
    enhanced: {
      sourceUrl: "https://orbitflare.com/",
      checkedOn: "2026-10-27",
      note: "Digital Asset API is a separate product beyond standard RPC.",
    },
  },
  quicknode: {
    websocket: {
      sourceUrl: "https://www.quicknode.com/docs/solana/api-overview",
      checkedOn: "2026-10-27",
      note: "Solana WebSocket methods are documented for Mainnet, Devnet, and Testnet.",
    },
    history: {
      sourceUrl: "https://www.quicknode.com/docs/solana/api-overview",
      checkedOn: "2026-10-27",
      note: "Mainnet archive is documented; Devnet and Testnet do not list archive access.",
    },
    grpc: {
      sourceUrl: "https://www.quicknode.com/docs/solana/api-overview",
      checkedOn: "2026-10-27",
      note: "Solana gRPC is included with Scale and Business plans.",
    },
    dedicated: {
      sourceUrl: "https://www.quicknode.com/chains/solana",
      checkedOn: "2026-10-27",
      note: "Dedicated Solana access is listed as an enterprise option.",
    },
    sla: {
      sourceUrl: "https://www.quicknode.com/chains/solana",
      checkedOn: "2026-10-27",
      note: "An SLA is listed for enterprise access.",
    },
    trial: {
      sourceUrl: "https://www.quicknode.com/chains/solana",
      checkedOn: "2026-10-27",
      note: "Time limited one-month offer",
    },
    enhanced: {
      sourceUrl: "https://www.quicknode.com/docs/solana/add-ons",
      checkedOn: "2026-10-27",
      note: "Add-ons depend on plan and activation",
    },
    regions: {
      sourceUrl: "https://www.quicknode.com/chains/solana",
      checkedOn: "2026-10-27",
      note: "The Solana product page lists regional infrastructure.",
    },
  },
  "solana-vibe-station": {
    websocket: {
      sourceUrl: "https://solanavibestation.com/services",
      checkedOn: "2026-10-27",
      note: "The Solana RPC product includes WebSocket support.",
    },
    free: {
      sourceUrl: "https://solanavibestation.com/services",
      checkedOn: "2026-10-27",
      note: "The Solana RPC product offers a free starting tier.",
    },
    regions: {
      sourceUrl: "https://solanavibestation.com/services",
      checkedOn: "2026-10-27",
      note: "Atlanta and Amsterdam regions are listed.",
    },
    history: {
      sourceUrl: "https://solanavibestation.com/services",
      checkedOn: "2026-10-27",
      note: "Paid archival reads extend back to block 297,562,244.",
    },
    grpc: {
      sourceUrl: "https://solanavibestation.com/services",
      checkedOn: "2026-10-27",
      note: "Yellowstone gRPC is a separately priced streaming service.",
    },
    dedicated: {
      sourceUrl: "https://solanavibestation.com/pricing",
      checkedOn: "2026-10-27",
      note: "Dedicated infrastructure is offered by quote.",
    },
    enhanced: {
      sourceUrl: "https://solanavibestation.com/services",
      checkedOn: "2026-10-27",
      note: "Hyperion account queries are included on paid RPC tiers.",
    },
    sla: {
      sourceUrl: "https://solanavibestation.com/sla",
      checkedOn: "2026-10-27",
      note: "The SLA terms govern availability; check them before choosing a plan.",
    },
  },
  "triton-rpc-pool": {
    websocket: {
      sourceUrl: "https://www.triton.one/chains/solana",
      checkedOn: "2026-10-27",
      note: "WebSocket on every endpoint; gRPC available with subscriptions",
    },
    grpc: {
      sourceUrl: "https://www.triton.one/chains/solana",
      checkedOn: "2026-10-27",
      note: "WebSocket on every endpoint; gRPC available with subscriptions",
    },
    dedicated: {
      sourceUrl: "https://www.triton.one/chains/solana",
      checkedOn: "2026-10-27",
      note: "Dedicated Solana nodes are offered separately from shared RPC access.",
    },
    regions: {
      sourceUrl: "https://www.triton.one/chains/solana",
      checkedOn: "2026-10-27",
      note: "Shared RPC uses GeoDNS across global data centers; dedicated nodes can be deployed in multiple regions.",
    },
    history: {
      sourceUrl: "https://triton.one/",
      checkedOn: "2026-10-27",
      note: "The Solana product page documents full historical transactions and signatures.",
    },
    enhanced: {
      sourceUrl: "https://www.triton.one/chains/solana",
      checkedOn: "2026-10-27",
      note: "Separate usage-priced APIs",
    },
  },
};
