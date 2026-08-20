/**
 * Known-program registry for classifying sampled blocks, adapted from the
 * perp200 dashboard's decoder (github.com/solanadevmint/perp200). Each
 * transaction is attributed to the first registry program among its account
 * keys — routers before venues, infrastructure never the story.
 */

export const VOTE_PROGRAM = "Vote111111111111111111111111111111111111111";

/** Ordered: routers first, then venues, then broad classes. */
const REGISTRY: [name: string, id: string][] = [
  ["Jupiter", "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"],
  ["Titan", "T1TANpTeScyeqVzzgNViGDNrkQ6qHz9KrSBS4aNXvGT"],
  ["DFlow", "DF1ow4tspfHX9JwWJsAb9epbkA8hmpSEAtxXy1V27QBH"],
  ["OKX router", "proVF4pMXVaYqmy4NjniPh4pqKNfMmsihgd4wdkCX3u"],
  ["pump.fun", "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"],
  ["PumpSwap", "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"],
  ["Raydium AMM", "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"],
  ["Raydium CLMM", "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"],
  ["Raydium CPMM", "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C"],
  ["Orca", "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"],
  ["Meteora", "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"],
  ["Meteora", "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"],
  ["Meteora", "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"],
  ["Phoenix perps", "EtrnLzgbS7nMMy5fbD42kXiUzGg8XQzJ972Xtk1cjWih"],
  ["Phoenix spot", "PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY"],
  ["GMX-Solana", "Gmso1uvJnLbawvw7yezdfCDcPydwW2s2iqG3w6MDucLo"],
  ["OpenBook", "opnb2LAfJYbRMAHHvqjCwQxanZn7ReEHp1k81EohpZb"],
  ["Tensor", "TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN"],
  ["ORE", "oreV3EG1i9BEgiAJ8b177Z2S2rMarzak4NMv1kULvWv"],
  ["Tessera V", "TessVdML9pBGgG9yGks7o4HewRaXVAMuoVj4x83GLQH"],
  ["HumidiFi", "9H6tua7jkLhdm3w8BvgpTn5LZNU7g4ZynDmCiNN3q6Rp"],
  ["BisonFi", "BiSoNHVpsVZW2F7rx2eQ59yQwKxzU5NvBcmKshCSUypi"],
  ["SolFi V2", "SV2EYYJyRz2YhfXwXnhNAevDEui5Q6yrfyo13WtupPF"],
  ["GoonFi V2", "goonuddtQRrWqqn5nFyczVKaie28f3kDkHWkHtURSLE"],
  ["ZeroFi", "ZERor4xhbUycZ6gb9ntrhqscUcZmAbQDjEAtCf4hbZY"],
  ["AlphaQ", "ALPHAQmeA7bjrVuccPsYPiCvsi428SNwte66Srvs4pHA"],
  ["Manifest", "MNFSTqtC93rEfYHB6hF82sKdZpUDFWkViLByLd1k1Ms"],
  ["Byreal", "REALQqNEomY6cQGZJUGwywTBD2UmDT32rZcNnfxQ5N2"],
  ["Aquifer", "AQU1FRd7papthgdrwPTTq5JacJh8YtwEXaBfKU3bTz45"],
  ["Scorch", "SCoRcH8c2dpjvcJD6FiPbCSQyQgu3PcUAWj2Xxx3mqn"],
  ["PancakeSwap", "HpNfyc2Saw7RKkQd8nEL4khUcuPhQ7WwY1B2qjx8jxFq"],
  ["Axiom", "FLASHX8DrLbgeR8FcfNV1F5krxYcYMUdBkrP1EPBtxB9"],
  ["Star Atlas", "SAGE2HAwep459SNq61LHvjxPk4pLPEJLoMETef7f7EE"],
  ["NFT", "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"],
  ["NFT", "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY"],
  ["Staking", "Stake11111111111111111111111111111111111111"],
  ["Oracles (Pyth)", "pythWSnswVUd12oZpeFP8e9CVaEqJg25g1Vtc2biRsT"],
  ["Quote updaters", "HRHjd1NCXLAvCTQERXTyTKUWUqcLGaRHKwLwGmUZ9cJq"],
  ["Quote updaters", "vELoC1audYbSYVRXn1vPaV8Axoa9oU6BYmNGZZBDZ1P"],
  ["Quote updaters", "W1LDCARDa67SPBG7TFpQivHnEZXRtxCFP13ysEd1bWR"],
  ["Quote updaters", "fastC7gqs2WUXgcyNna2BZAe9mte4zcTGprv3mv18N3"],
  ["Quote updaters", "2DNbzPochEcyCcWMbL4d9S3u9QqQEj5bbe6cSZFvKsbh"],
  ["Quote updaters", "dijkbkCAKfFTCxQg3u1pg82gVU1jJGHBBRcteD11mBu"],
  ["Private MMs", "FLUX6xBayGxLX9UcimVRxXFMHH6q43mAbRvDzSpCsvfK"],
  ["Private MMs", "QuaNtZsgYRe5Z9Bk4LZ4cTD9tbkVoyCNf1R2BN9bBDv"],
  ["Arb bots", "ojh19ojaKduoJZuaJADhcVGp4xt1TcdAvZmpVsCorch"],
  ["Arb bots", "Archer8kgiavM61GyusMzaaS2ft5sALtNsD1HxkUPMhy"],
];

const BY_ID = new Map(REGISTRY.map(([name, id]) => [id, name]));
const ORDER = new Map(REGISTRY.map(([, id], i) => [id, i]));

/** Infrastructure programs: a tx invoking only these is a plain transfer. */
const INFRA = new Set([
  "ComputeBudget111111111111111111111111111111",
  "11111111111111111111111111111111",
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
  "AddressLookupTab1e1111111111111111111111111",
  "Ed25519SigVerify111111111111111111111111111",
  "KeccakSecp256k11111111111111111111111111111",
]);

/**
 * Attribute one transaction to a display bucket from the program ids its
 * top-level instructions invoke. Returns null for vote transactions
 * (counted separately).
 */
export function classifyTx(programIds: string[]): string | null {
  let best: string | null = null;
  let bestOrder = Infinity;
  let sawNonInfra = false;
  for (const id of programIds) {
    if (id === VOTE_PROGRAM) return null;
    const order = ORDER.get(id);
    if (order !== undefined && order < bestOrder) {
      bestOrder = order;
      best = BY_ID.get(id)!;
    }
    if (!INFRA.has(id)) sawNonInfra = true;
  }
  if (best) return best;
  return sawNonInfra ? "Other programs" : "Transfers";
}
