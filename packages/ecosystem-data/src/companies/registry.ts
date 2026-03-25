import type { CompanyRecord } from "../types";
import { aisa } from "./records/aisa";
import { alchemy } from "./records/alchemy";
import { allnodes } from "./records/allnodes";
import { arcium } from "./records/arcium";
import { atxp } from "./records/atxp";
import { bonk } from "./records/bonk";
import { bridge } from "./records/bridge";
import { bydfi } from "./records/bydfi";
import { byreal } from "./records/byreal";
import { coinbase } from "./records/coinbase";
import { dabba } from "./records/dabba";
import { darkresearch } from "./records/darkresearch";
import { doublezero } from "./records/doublezero";
import { fireblocks } from "./records/fireblocks";
import { frodobots } from "./records/frodobots";
import { galaxy } from "./records/galaxy";
import { gradient } from "./records/gradient";
import { jito } from "./records/jito";
import { kast } from "./records/kast";
import { libeara } from "./records/libeara";
import { matcha } from "./records/matcha";
import { mantleByreal } from "./records/mantle-byreal";
import { openmined } from "./records/openmined";
import { osl } from "./records/osl";
import { phantom } from "./records/phantom";
import { playSolana } from "./records/play-solana";
import { quicknode } from "./records/quicknode";
import { safepalWallet } from "./records/safepal-wallet";
import { solanaSpaces } from "./records/solana-spaces";
import { solayer } from "./records/solayer";
import { solflare } from "./records/solflare";
import { spi } from "./records/spi";
import { squads } from "./records/squads";
import { sunrise } from "./records/sunrise";
import { superteamUsa } from "./records/superteam-usa";
import { switchboard } from "./records/switchboard";
import { triton } from "./records/triton";
import { veliaNet } from "./records/velia-net";
import { visa } from "./records/visa";

export const companies = [
  aisa,
  alchemy,
  allnodes,
  arcium,
  atxp,
  bonk,
  bridge,
  bydfi,
  byreal,
  coinbase,
  dabba,
  darkresearch,
  doublezero,
  fireblocks,
  frodobots,
  galaxy,
  gradient,
  jito,
  kast,
  libeara,
  matcha,
  mantleByreal,
  openmined,
  osl,
  phantom,
  playSolana,
  quicknode,
  safepalWallet,
  solanaSpaces,
  solayer,
  solflare,
  spi,
  squads,
  sunrise,
  superteamUsa,
  switchboard,
  triton,
  veliaNet,
  visa,
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
