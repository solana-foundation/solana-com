// Keystatic and the published MDX renderer share these IDs and labels.
export const upgradeDiagramOptions = [
  { label: "Choose a diagram", value: "" },
  { label: "Where Alpenglow sits", value: "ag-block-lifecycle" },
  { label: "Candidate banks in one slot", value: "ag-banks-per-slot" },
  {
    label: "bank_id across two connections",
    value: "ag-bank-id-across-connections",
  },
  { label: "Commitment levels under Alpenglow", value: "ag-commitment-levels" },
  { label: "Votor votes and certificates", value: "ag-votor-certificates" },
  { label: "Loaded account bytes running total", value: "tx-account-bytes" },
  { label: "v1 simulation failure trace", value: "tx-simulation-trace" },
  { label: "Transaction wire layout", value: "tx-wire-layout" },
] as const;

export type UpgradeDiagramId = Exclude<
  (typeof upgradeDiagramOptions)[number]["value"],
  ""
>;
