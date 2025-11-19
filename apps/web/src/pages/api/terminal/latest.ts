import { NextApiRequest, NextApiResponse } from "next";

const TERMINAL_ITEMS = [
  {
    index: 1,
    id: Math.random().toString(36).substring(2, 15),
    title:
      "Solana hits 100M monthly active addresses, 3.5B transactions in July",
    categoryId: "reports",
    date: "2025-07-21",
  },
  {
    index: 2,
    id: Math.random().toString(36).substring(2, 15),
    title: "Solana surpasses Ethereum in fee revenue, captures $65M monthly",
    categoryId: "developers",
    date: "2025-07-21",
  },
  {
    index: 3,
    id: Math.random().toString(36).substring(2, 15),
    title: "Apps on Solana generate $229M in 30 days, double Ethereum’s",
    categoryId: "reports",
    date: "2025-07-21",
  },
  {
    index: 4,
    id: Math.random().toString(36).substring(2, 15),
    title: "Solana monthly trading volume climbs to $118B, industry-leading",
    categoryId: "solutions",
    date: "2025-07-21",
  },
  {
    index: 5,
    id: Math.random().toString(36).substring(2, 15),
    title: "60% of all new tokens are issued on Solana",
    categoryId: "artists",
    date: "2025-07-21",
  },
  {
    index: 6,
    id: Math.random().toString(36).substring(2, 15),
    title: "Circle’s USDC stablecoin tops 18M monthly transfers on Solana",
    categoryId: "caseStudies",
    date: "2025-07-21",
  },
  {
    index: 7,
    id: Math.random().toString(36).substring(2, 15),
    title: "Visa expands USDC stablecoin settlements on Solana",
    categoryId: "reports",
    date: "2025-07-21",
  },
  {
    index: 8,
    id: Math.random().toString(36).substring(2, 15),
    title: "PayPal launches PYUSD stablecoin natively on Solana",
    categoryId: "reports",
    date: "2025-07-21",
  },
  {
    index: 9,
    id: Math.random().toString(36).substring(2, 15),
    title: "BlackRock’s $1.7B BUIDL fund launches share class on Solana",
    categoryId: "solutions",
    date: "2025-07-21",
  },
  {
    index: 10,
    id: Math.random().toString(36).substring(2, 15),
    title:
      "Franklin Templeton and Superstate bring money market funds on-chain via Solana",
    categoryId: "caseStudies",
    date: "2025-07-21",
  },
];

let items = [...TERMINAL_ITEMS];

// TODO: Replace with actual API
export default async function getLatest(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  items = [
    ...items.slice(-2).map((item) => ({
      ...item,
      id: Math.random().toString(36).substring(2, 15),
    })),
    ...items.slice(0, -2),
  ].map((item, index) => ({
    ...item,
    index: index + 1,
  }));
  return res.status(200).json(items);
}
