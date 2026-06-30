import type { CompanyRecord } from "../types";
import { aisa } from "./records/aisa";
import { alchemy } from "./records/alchemy";
import { altitude } from "./records/altitude";
import { allnodes } from "./records/allnodes";
import { ampPay } from "./records/amp-pay";
import { anchorage } from "./records/anchorage";
import { anoma } from "./records/anoma";
import { banxa } from "./records/banxa";
import { arcium } from "./records/arcium";
import { atxp } from "./records/atxp";
import { bhutan } from "./records/bhutan";
import { blackrock } from "./records/blackrock";
import { blockzero } from "./records/blockzero";
import { bonk } from "./records/bonk";
import { brave } from "./records/brave";
import { bridge } from "./records/bridge";
import { bydfi } from "./records/bydfi";
import { byreal } from "./records/byreal";
import { cherryServers } from "./records/cherry-servers";
import { citi } from "./records/citi";
import { coinbase } from "./records/coinbase";
import { comicbook } from "./records/comicbook";
import { d3 } from "./records/d3";
import { dabba } from "./records/dabba";
import { delorean } from "./records/delorean";
import { darkresearch } from "./records/darkresearch";
import { dawn } from "./records/dawn";
import { dfdv } from "./records/dfdv";
import { dmcc } from "./records/dmcc";
import { doublezero } from "./records/doublezero";
import { drpc } from "./records/drpc";
import { dynamic } from "./records/dynamic";
import { fireblocks } from "./records/fireblocks";
import { flashTrade } from "./records/flash-trade";
import { franklinTempleton } from "./records/franklin-templeton";
import { frodobots } from "./records/frodobots";
import { galaxy } from "./records/galaxy";
import { gradient } from "./records/gradient";
import { jito } from "./records/jito";
import { jpmorgan } from "./records/jpmorgan";
import { kast } from "./records/kast";
import { kazakhstan } from "./records/kazakhstan";
import { libeara } from "./records/libeara";
import { listingHelp } from "./records/listing-help";
import { matcha } from "./records/matcha";
import { mantle } from "./records/mantle";
import { mantleByreal } from "./records/mantle-byreal";
import { meta } from "./records/meta";
import { metaplex } from "./records/metaplex";
import { monkeDao } from "./records/monke-dao";
import { morganStanley } from "./records/morgan-stanley";
import { openmined } from "./records/openmined";
import { orbitflare } from "./records/orbitflare";
import { osl } from "./records/osl";
import { pancakeswap } from "./records/pancakeswap";
import { phantom } from "./records/phantom";
import { pipeNetwork } from "./records/pipe-network";
import { playSolana } from "./records/play-solana";
import { pyth } from "./records/pyth";
import { quicknode } from "./records/quicknode";
import { rain } from "./records/rain";
import { ramp } from "./records/ramp";
import { reap } from "./records/reap";
import { renderNetwork } from "./records/render-network";
import { rockawayx } from "./records/rockawayx";
import { ryder } from "./records/ryder";
import { safepalWallet } from "./records/safepal-wallet";
import { sanctum } from "./records/sanctum";
import { sidley } from "./records/sidley";
import { societeGenerale } from "./records/societe-generale";
import { sofi } from "./records/sofi";
import { solanaSpaces } from "./records/solana-spaces";
import { solayer } from "./records/solayer";
import { solflare } from "./records/solflare";
import { solpay } from "./records/solpay";
import { spi } from "./records/spi";
import { squads } from "./records/squads";
import { stateStreet } from "./records/state-street";
import { stripe } from "./records/stripe";
import { streamflow } from "./records/streamflow";
import { sunrise } from "./records/sunrise";
import { superteamUsa } from "./records/superteam-usa";
import { switchboard } from "./records/switchboard";
import { syndica } from "./records/syndica";
import { tala } from "./records/tala";
import { theGraph } from "./records/the-graph";
import { trojan } from "./records/trojan";
import { triton } from "./records/triton";
import { unclaimedSol } from "./records/unclaimed-sol";
import { veliaNet } from "./records/velia-net";
import { visa } from "./records/visa";
import { vybeNetwork } from "./records/vybe-network";
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
  anoma,
  banxa,
  arcium,
  atxp,
  bhutan,
  blackrock,
  blockzero,
  bonk,
  brave,
  bridge,
  bydfi,
  byreal,
  cherryServers,
  citi,
  coinbase,
  comicbook,
  d3,
  dabba,
  delorean,
  darkresearch,
  dawn,
  dfdv,
  dmcc,
  doublezero,
  drpc,
  dynamic,
  fireblocks,
  flashTrade,
  franklinTempleton,
  frodobots,
  galaxy,
  gradient,
  jito,
  jpmorgan,
  kast,
  kazakhstan,
  libeara,
  listingHelp,
  matcha,
  mantle,
  mantleByreal,
  meta,
  metaplex,
  monkeDao,
  morganStanley,
  openmined,
  orbitflare,
  osl,
  pancakeswap,
  phantom,
  pipeNetwork,
  playSolana,
  pyth,
  quicknode,
  rain,
  ramp,
  reap,
  renderNetwork,
  rockawayx,
  ryder,
  safepalWallet,
  sanctum,
  sidley,
  societeGenerale,
  sofi,
  solanaSpaces,
  solayer,
  solflare,
  solpay,
  spi,
  squads,
  stateStreet,
  stripe,
  streamflow,
  sunrise,
  superteamUsa,
  switchboard,
  syndica,
  tala,
  theGraph,
  trojan,
  triton,
  unclaimedSol,
  veliaNet,
  visa,
  vybeNetwork,
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
