import React from "react";
import type { Metadata } from "next";
import { PredictionMarketsHackPage } from "../prediction-markets-hack/prediction-markets-hack";

export const metadata: Metadata = {
  title: "PERPS HACK",
  description:
    "A Solana hackathon landing page for builders working on perpetual futures, derivatives, market structure, liquidity, and trading infrastructure.",
  alternates: {
    canonical: "/perps-hack",
  },
};

const translations = {
  heroTitle: "PERPS HACK",
  heroSubtitle1:
    "A focused Solana hackathon for builders pushing perpetual futures, onchain market structure, liquidity, and trading infrastructure forward.",
  heroSubtitle2: "Build the next generation of perps on Solana.",
  heroHeading: "Build high-performance perps on Solana",
  heroDescription:
    "PERPS HACK brings together founders, protocol engineers, quant builders, and product teams building the next wave of derivatives infrastructure on Solana.",
  heroRegisterButton: "Register interest",
  heroResourcesButton: "View resources",

  timelineTitle: "Timeline",
  timelinePhaseHeader: "Phase",
  timelineDateHeader: "Date",
  timelineEvents: [
    {
      phase: "Hacking starts",
      date: "Jul 8, 2026",
    },
    {
      phase: "Submissions open",
      date: "Jul 9, 2026",
    },
    {
      phase: "Submissions due",
      date: "Jul 22, 2026",
    },
    {
      phase: "Winners announced",
      date: "Jul 29, 2026",
    },
  ],

  prizesTitle: "Prizes",
  prizesSubtitle: "$1,000,000 in total prizes for perps builders on Solana.",
  overallPrizesTitle: "$1,000,000 prize pool",
  overallPrizesSubtitle:
    "Grand prizes for the strongest products plus featured integration prizes.",
  overallPrizes: [
    {
      place: "Grand Prize",
      prize: "$500,000",
      sponsor: "",
      category: "Prize",
    },
    {
      place: "Runner-Up",
      prize: "$200,000",
      sponsor: "",
      category: "Prize",
    },
  ],
  sponsorBountiesTitle: "Featured integration prizes",
  sponsorBountiesSubtitle:
    "$100,000 each for standout integrations with Dflow, Percolator, and Phoenix.",
  sponsorBountiesDisclaimer:
    "Prize details and judging criteria will be finalized before kickoff.",
  sponsorBounties: [
    {
      sponsor: "",
      title: "Dflow Featured Integration",
      description:
        "Dflow is a fully fledged prediction market on Solana. Build applications that use Dflow's order book and settlement layer.",
      prizeAmount: "$100,000",
    },
    {
      sponsor: "",
      title: "Percolator Featured Integration",
      description:
        "Percolator is an open-source risk engine for onchain perps with admin-keyless design, composable matchers, and settlement. Build custom matchers, application-layer venues, or risk tooling on top.",
      prizeAmount: "$100,000",
    },
    {
      sponsor: "",
      title: "Phoenix Featured Integration",
      description:
        "Phoenix is a fully fledged perp DEX with a CLOB and live markets across major assets. Build applications that use Phoenix's order book and settlement layer.",
      prizeAmount: "$100,000",
    },
  ],
  addBountyText: "",

  resourcesTitle: "Resources",
  resourcesDescription:
    "Start with Solana docs, templates, and tooling while the final perps-specific resources are assembled.",
  resourcesLearnMore: "Learn more",
  resources: [
    {
      title: "Solana Docs",
      description:
        "Core concepts, programs, tokens, RPC, and developer guides.",
      category: "Docs",
      url: "https://solana.com/docs",
    },
    {
      title: "Solana Templates",
      description:
        "Starter apps and references for shipping quickly on Solana.",
      category: "Templates",
      url: "https://solana.com/developers/templates",
    },
    {
      title: "Agent Skill",
      description:
        "Machine-readable context for agents building with the Solana developer surface.",
      category: "AI tooling",
      url: "https://solana.com/SKILL.md",
    },
  ],

  requirementsTitle: "What to build",
  requirementsItems: [
    "A working demo related to perpetual futures, derivatives, trading infrastructure, or market structure.",
    "A clear description of the user, protocol, or liquidity problem being solved.",
    "A Solana integration that is meaningful to the product, not just cosmetic.",
    "Open-source code or enough technical detail for judges to evaluate the implementation.",
  ],

  ctaEyebrow: "Builder track",
  ctaTitle: "Build perps that can only work at Solana speed.",
  ctaDescription:
    "Bring your trading, risk, liquidity, data, or UX idea and turn it into a working product.",
  ctaLabel: "Register interest",
  ctaUrl: "https://solana.com/events",
};

export default function Page() {
  return (
    <PredictionMarketsHackPage
      translations={translations}
      registrationUrl={translations.ctaUrl}
      submissionDeadline="2026-07-22T23:59:59"
      finalCtaQuote="Build the next generation of perps on Solana."
    />
  );
}
