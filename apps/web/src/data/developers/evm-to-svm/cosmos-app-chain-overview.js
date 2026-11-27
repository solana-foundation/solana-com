// Header button labels are in the catalog (`navHeading.buttons`), index-aligned.
export const NAV_BUTTON_URLS = [
  "/developers/migrate-to-solana/cosmos/app-chain/halt-and-claim",
  "/developers/migrate-to-solana/cosmos/app-chain/ibc-bridge",
];

// Prose lives in the i18n catalog (`sections.<id>.prose`); each "prose"
// entry consumes the next catalog string, code blocks stay here untranslated.
export const RUNBOOK_SECTIONS = [
  {
    id: "why-solana",
    blocks: ["prose"],
  },
  {
    id: "two-paths",
    blocks: ["prose"],
  },
  {
    id: "choose-a-path",
    blocks: ["prose"],
  },
  {
    id: "concept-map",
    blocks: ["prose"],
  },
  {
    id: "client-sdks",
    blocks: ["prose"],
  },
  {
    id: "real-migrations",
    blocks: ["prose"],
  },
];

// Card copy is in the catalog (`resourceCards`), index-aligned.
export const RESOURCE_CARD_URLS = [
  "/developers/migrate-to-solana/cosmos/app-chain/halt-and-claim",
  "/developers/migrate-to-solana/cosmos/app-chain/ibc-bridge",
  "/developers/migrate-to-solana/cosmos/cosmwasm",
  "https://github.com/sentinel-official/sentinel-solana",
  "https://github.com/akash-network/node/tree/main/contracts/solana",
];
