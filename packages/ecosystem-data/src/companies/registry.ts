import type { CompanyRecord } from "../types";
import { aisa } from "./records/aisa";
import { alchemy } from "./records/alchemy";
import { altitude } from "./records/altitude";
import { allnodes } from "./records/allnodes";
import { ampPay } from "./records/amp-pay";
import { anchorage } from "./records/anchorage";
import { banxa } from "./records/banxa";
import { arcium } from "./records/arcium";
import { atxp } from "./records/atxp";
import { bhutan } from "./records/bhutan";
import { bonk } from "./records/bonk";
import { bridge } from "./records/bridge";
import { bydfi } from "./records/bydfi";
import { byreal } from "./records/byreal";
import { coinbase } from "./records/coinbase";
import { comicbook } from "./records/comicbook";
import { d3 } from "./records/d3";
import { dabba } from "./records/dabba";
import { darkresearch } from "./records/darkresearch";
import { dawn } from "./records/dawn";
import { dmcc } from "./records/dmcc";
import { doublezero } from "./records/doublezero";
import { drpc } from "./records/drpc";
import { dynamic } from "./records/dynamic";
import { fireblocks } from "./records/fireblocks";
import { flashTrade } from "./records/flash-trade";
import { frodobots } from "./records/frodobots";
import { galaxy } from "./records/galaxy";
import { gradient } from "./records/gradient";
import { jito } from "./records/jito";
import { kast } from "./records/kast";
import { kazakhstan } from "./records/kazakhstan";
import { libeara } from "./records/libeara";
import { listingHelp } from "./records/listing-help";
import { matcha } from "./records/matcha";
import { mantle } from "./records/mantle";
import { mantleByreal } from "./records/mantle-byreal";
import { monkeDao } from "./records/monke-dao";
import { openmined } from "./records/openmined";
import { orbitflare } from "./records/orbitflare";
import { osl } from "./records/osl";
import { pancakeswap } from "./records/pancakeswap";
import { phantom } from "./records/phantom";
import { pipeNetwork } from "./records/pipe-network";
import { playSolana } from "./records/play-solana";
import { quicknode } from "./records/quicknode";
import { reap } from "./records/reap";
import { renderNetwork } from "./records/render-network";
import { rockawayx } from "./records/rockawayx";
import { ryder } from "./records/ryder";
import { safepalWallet } from "./records/safepal-wallet";
import { sanctum } from "./records/sanctum";
import { sofi } from "./records/sofi";
import { solanaSpaces } from "./records/solana-spaces";
import { solayer } from "./records/solayer";
import { solflare } from "./records/solflare";
import { solpay } from "./records/solpay";
import { spi } from "./records/spi";
import { squads } from "./records/squads";
import { sunrise } from "./records/sunrise";
import { superteamUsa } from "./records/superteam-usa";
import { switchboard } from "./records/switchboard";
import { syndica } from "./records/syndica";
import { tala } from "./records/tala";
import { term } from "./records/term";
import { theGraph } from "./records/the-graph";
import { trojan } from "./records/trojan";
import { triton } from "./records/triton";
import { veliaNet } from "./records/velia-net";
import { visa } from "./records/visa";
import { walletconnect } from "./records/walletconnect";
import { walrus } from "./records/walrus";
import { wyoming } from "./records/wyoming";
import { xbit } from "./records/xbit";
import { yala } from "./records/yala";
import { zerion } from "./records/zerion";

export const companies = [
  aisa,
  alchemy,
  altitude,
  allnodes,
  ampPay,
  anchorage,
  banxa,
  arcium,
  atxp,
  bhutan,
  bonk,
  bridge,
  bydfi,
  byreal,
  coinbase,
  comicbook,
  d3,
  dabba,
  darkresearch,
  dawn,
  dmcc,
  doublezero,
  drpc,
  dynamic,
  fireblocks,
  flashTrade,
  frodobots,
  galaxy,
  gradient,
  jito,
  kast,
  kazakhstan,
  libeara,
  listingHelp,
  matcha,
  mantle,
  mantleByreal,
  monkeDao,
  openmined,
  orbitflare,
  osl,
  pancakeswap,
  phantom,
  pipeNetwork,
  playSolana,
  quicknode,
  reap,
  renderNetwork,
  rockawayx,
  ryder,
  safepalWallet,
  sanctum,
  sofi,
  solanaSpaces,
  solayer,
  solflare,
  solpay,
  spi,
  squads,
  sunrise,
  superteamUsa,
  switchboard,
  syndica,
  tala,
  term,
  theGraph,
  trojan,
  triton,
  veliaNet,
  visa,
  walletconnect,
  walrus,
  wyoming,
  xbit,
  yala,
  zerion,
] as const satisfies readonly CompanyRecord[];

export type CompanyId = (typeof companies)[number]["id"];

export const companiesById = Object.fromEntries(
  companies.map((company) => [company.id, company]),
) as Record<CompanyId, CompanyRecord>;

export const companiesBySlug = Object.fromEntries(
  companies.map((company) => [company.slug, company]),
) as Record<string, CompanyRecord>;

export function getCompany(id: string) {
  return companiesById[id as CompanyId];
}

export function getCompanyBySlug(slug: string) {
  return companiesBySlug[slug];
}
