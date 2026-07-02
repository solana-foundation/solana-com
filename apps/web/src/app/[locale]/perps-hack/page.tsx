import React from "react";
import type { Metadata } from "next";
import { PerpsHackCasino } from "./perps-hack-casino";

export const metadata: Metadata = {
  title: "PERPS HACK",
  description:
    "A Solana hackathon landing page for builders working on perpetual futures, derivatives, market structure, liquidity, and trading infrastructure.",
  alternates: {
    canonical: "/perps-hack",
  },
};

export default function Page() {
  return <PerpsHackCasino registrationUrl="https://solana.com/events" />;
}
