/** Feature claims verified against first-party Solana product/docs pages on 2026-10-27.
 * A missing feature is unknown, not an assertion that the provider lacks it.
 * Availability can vary by plan; see each linked source before selecting a service.
 */
export const RPC_FEATURES = [
  { id: "websocket", group: "interfaces" },
  { id: "grpc", group: "interfaces" },
  { id: "history", group: "data" },
  { id: "enhanced", group: "data" },
  { id: "dedicated", group: "infrastructure" },
  { id: "regions", group: "infrastructure" },
  { id: "free", group: "terms" },
  { id: "trial", group: "terms" },
  { id: "sla", group: "terms" },
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
      note: "Solana-specific",
    },
    dedicated: {
      sourceUrl: "https://nownodes.io/nodes/solana-sol",
      checkedOn: "2026-10-27",
      note: "Solana-specific",
    },
    trial: {
      sourceUrl: "https://nownodes.io/nodes/solana-sol",
      checkedOn: "2026-10-27",
      note: "Solana-specific, time limited",
    },
    regions: {
      sourceUrl: "https://nownodes.io/nodes/solana-sol",
      checkedOn: "2026-10-27",
      note: "Solana-specific product page; SLA terms vary by plan",
    },
    sla: {
      sourceUrl: "https://nownodes.io/nodes/solana-sol",
      checkedOn: "2026-10-27",
      note: "Solana-specific product page; SLA terms vary by plan",
    },
  },
  orbitflare: {
    websocket: {
      sourceUrl: "https://orbitflare.com/products/rpc-nodes",
      checkedOn: "2026-10-27",
      note: "Solana-specific; paid-plan SLA only",
    },
    history: {
      sourceUrl: "https://orbitflare.com/products/rpc-nodes",
      checkedOn: "2026-10-27",
      note: "Solana-specific; paid-plan SLA only",
    },
    free: {
      sourceUrl: "https://orbitflare.com/products/rpc-nodes",
      checkedOn: "2026-10-27",
      note: "Solana-specific; paid-plan SLA only",
    },
    regions: {
      sourceUrl: "https://orbitflare.com/products/rpc-nodes",
      checkedOn: "2026-10-27",
      note: "Solana-specific; paid-plan SLA only",
    },
    sla: {
      sourceUrl: "https://orbitflare.com/products/rpc-nodes",
      checkedOn: "2026-10-27",
      note: "Solana-specific; paid-plan SLA only",
    },
    grpc: {
      sourceUrl: "https://orbitflare.com/products/rpc-nodes",
      checkedOn: "2026-10-27",
      note: "Feature availability depends on cluster and plan",
    },
    dedicated: {
      sourceUrl: "https://orbitflare.com/products/dedicated-nodes",
      checkedOn: "2026-10-27",
      note: "Separate dedicated product",
    },
    enhanced: {
      sourceUrl: "https://orbitflare.com/",
      checkedOn: "2026-10-27",
      note: "Separate product, not standard RPC",
    },
  },
  quicknode: {
    websocket: {
      sourceUrl: "https://www.quicknode.com/docs/solana/api-overview",
      checkedOn: "2026-10-27",
      note: "Archive documented for Mainnet, not Devnet or Testnet",
    },
    history: {
      sourceUrl: "https://www.quicknode.com/docs/solana/api-overview",
      checkedOn: "2026-10-27",
      note: "Archive documented for Mainnet, not Devnet or Testnet",
    },
    grpc: {
      sourceUrl: "https://www.quicknode.com/docs/solana/api-overview",
      checkedOn: "2026-10-27",
      note: "Plan dependent",
    },
    dedicated: {
      sourceUrl: "https://www.quicknode.com/chains/solana",
      checkedOn: "2026-10-27",
      note: "Dedicated and SLA are enterprise options",
    },
    sla: {
      sourceUrl: "https://www.quicknode.com/chains/solana",
      checkedOn: "2026-10-27",
      note: "Dedicated and SLA are enterprise options",
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
      note: "Solana-specific product claim",
    },
  },
  "solana-vibe-station": {
    websocket: {
      sourceUrl: "https://solanavibestation.com/services",
      checkedOn: "2026-10-27",
      note: "RPC product; regions listed as Atlanta and Amsterdam",
    },
    free: {
      sourceUrl: "https://solanavibestation.com/services",
      checkedOn: "2026-10-27",
      note: "RPC product; regions listed as Atlanta and Amsterdam",
    },
    regions: {
      sourceUrl: "https://solanavibestation.com/services",
      checkedOn: "2026-10-27",
      note: "RPC product; regions listed as Atlanta and Amsterdam",
    },
    history: {
      sourceUrl: "https://solanavibestation.com/services",
      checkedOn: "2026-10-27",
      note: "Partial historical range, not full archive from genesis",
    },
    grpc: {
      sourceUrl: "https://solanavibestation.com/services",
      checkedOn: "2026-10-27",
      note: "Separate paid streaming product",
    },
    dedicated: {
      sourceUrl: "https://solanavibestation.com/pricing",
      checkedOn: "2026-10-27",
      note: "Quoted enterprise option",
    },
    enhanced: {
      sourceUrl: "https://solanavibestation.com/services",
      checkedOn: "2026-10-27",
      note: "Current Solana RPC extension; avoid Rewind beta as proof",
    },
    sla: {
      sourceUrl: "https://solanavibestation.com/sla",
      checkedOn: "2026-10-27",
      note: "Terms document controls; marketing services page says 99.99%",
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
      note: "Separate access models",
    },
    regions: {
      sourceUrl: "https://www.triton.one/chains/solana",
      checkedOn: "2026-10-27",
      note: "Separate access models",
    },
    history: {
      sourceUrl: "https://triton.one/",
      checkedOn: "2026-10-27",
      note: "Solana-specific; Old Faithful gRPC is private beta",
    },
    enhanced: {
      sourceUrl: "https://www.triton.one/chains/solana",
      checkedOn: "2026-10-27",
      note: "Separate usage-priced APIs",
    },
  },
};
