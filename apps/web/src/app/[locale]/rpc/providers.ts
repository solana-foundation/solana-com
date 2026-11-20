/** Source audit: docs/research/eco-859-rpc-directory.md. Unknown offerings are deliberately omitted. */
import {
  RPC_PROVIDER_FEATURES,
  type RpcFeatureEvidence,
  type RpcFeatureId,
} from "./provider-features";

export type RpcProvider = {
  id: string;
  name: string;
  url: string;
  features: Partial<Record<RpcFeatureId, RpcFeatureEvidence>>;
};

export const RPC_PROVIDERS: readonly RpcProvider[] = [
  { id: "alchemy", name: "Alchemy", url: "https://www.alchemy.com/solana" },
  { id: "ankr", name: "Ankr", url: "https://www.ankr.com/rpc/solana/" },
  {
    id: "blockdaemon",
    name: "Blockdaemon",
    url: "https://www.blockdaemon.com/networks",
  },
  { id: "chainflow", name: "Chainflow", url: "https://chainflow.io/contact/" },
  {
    id: "chainstack",
    name: "Chainstack",
    url: "https://chainstack.com/build-better-with-solana/",
  },
  {
    id: "digital-energy",
    name: "Digital Energy",
    url: "https://rpc-landing.digital-energy.io/",
  },
  { id: "fluxrpc", name: "FluxRPC", url: "https://fluxrpc.com/" },
  { id: "getblock", name: "GetBlock", url: "https://getblock.io/nodes/sol/" },
  {
    id: "helius",
    name: "Helius",
    url: "https://www.helius.dev/solana-rpc-nodes",
  },
  {
    id: "nownodes",
    name: "NOWNodes",
    url: "https://nownodes.io/nodes/solana-sol",
  },
  { id: "orbitflare", name: "OrbitFlare", url: "https://orbitflare.com/" },
  {
    id: "quicknode",
    name: "Quicknode",
    url: "https://www.quicknode.com/chains/solana",
  },
  {
    id: "solana-vibe-station",
    name: "Solana Vibe Station",
    url: "https://solanavibestation.com/",
  },
  { id: "syndica", name: "Syndica", url: "https://syndica.io/" },
  {
    id: "triton-rpc-pool",
    name: "Triton / RPC Pool",
    url: "https://triton.one/",
  },
]
  .map((provider) => ({
    ...provider,
    features: RPC_PROVIDER_FEATURES[provider.id] ?? {},
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
