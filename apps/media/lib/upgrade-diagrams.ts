// Keystatic and the published MDX renderer share these IDs. Keep the former
// block descriptions here so editors can still see them in the block preview.
export const upgradeDiagramOptions = [
  { label: "Choose a diagram", value: "", description: "" },
  {
    label: "where Alpenglow sits",
    value: "ag-block-lifecycle",
    description: "The life of a block, with the stages Alpenglow replaces",
  },
  {
    label: "candidate banks in one slot",
    value: "ag-banks-per-slot",
    description:
      "Why keying a buffer on the slot alone fuses several banks into one block",
  },
  {
    label: "bank_id across two connections",
    value: "ag-bank-id-across-connections",
    description:
      "Why bank_id cannot be compared between providers, and blockhash can",
  },
  {
    label: "commitment levels under Alpenglow",
    value: "ag-commitment-levels",
    description:
      "How confirmed and finalized converge, and the two paths to finality",
  },
  {
    label: "Votor votes and certificates",
    value: "ag-votor-certificates",
    description:
      "The three routes out of a proposed block and the certificate each produces",
  },
  {
    label: "loaded account bytes running total",
    value: "tx-account-bytes",
    description:
      "How an account created after estimation pushes the running total past the limit",
  },
  {
    label: "v1 simulation failure trace",
    value: "tx-simulation-trace",
    description:
      "Where an empty v1 config fails during simulation, and what comes back",
  },
  {
    label: "transaction wire layout",
    value: "tx-wire-layout",
    description: "Byte layout of legacy, v0 and v1 transactions compared",
  },
] as const;

export type UpgradeDiagramId = Exclude<
  (typeof upgradeDiagramOptions)[number]["value"],
  ""
>;
