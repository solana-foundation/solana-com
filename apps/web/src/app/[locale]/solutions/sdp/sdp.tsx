"use client";

import { VideoPlayerModal } from "@/component-library/video-modal";
import { Hero } from "@/components/sdp/hero";
import { Logos } from "@/component-library/logos";
import { DecorGrid } from "@/components/sdp/decor-grid";
import { Advantages } from "@/components/sdp/advantages";
import { AiAdvantages } from "@/components/sdp/ai-advantages";
import { CardGrid } from "@/components/sdp/card-grid";
import { Infrastructure } from "@/components/sdp/infrastructure";
import { Ecosystem } from "@/components/sdp/ecosystem";
import { Tutorials } from "@/components/sdp/tutorials";
// import { News } from "@/components/sdp/news";
import { Podcasts } from "@/components/sdp/podcasts";
import Join from "@/components/sdp/join";
import Header from "@/components/sdp/header";
import { Footer } from "@/components/sdp/footer";
import Bank from "@@/public/src/img/icons/Bank.inline.svg";
import Nodes from "@@/public/src/img/icons/Nodes.inline.svg";
import Law from "@@/public/src/img/icons/Law.inline.svg";
import Sort from "@@/public/src/img/icons/Sort.inline.svg";
import Dollar from "@@/public/src/img/icons/Dollar.inline.svg";
import Steps from "@@/public/src/img/icons/Steps.inline.svg";
import Switch from "@@/public/src/img/icons/Switch.inline.svg";
import {
  COMPLIANCE_LOGOS,
  INST_LOGOS,
  LOGOS,
  // NEWS,
  NODES_LOGOS,
  PODCASTS,
  RAMP_LOGOS,
  TUTORIALS,
} from "@/data/solutions/sdp";

export function SdpPage() {
  return (
    <div className="bg-[#0C0C0E]">
      <Header
        navLinks={[
          { label: "Platform", href: "#platform" },
          { label: "Use cases", href: "#use-cases" },
          { label: "Partners", href: "#partners" },
          { label: "Sandbox", href: "#sandbox" },
          // { label: "Media", href: "#media" },
        ]}
        ctaLabel="Join waitlist"
        ctaHref="https://platform.solana.com"
      />
      <Hero
        title="Launch and scale financial products on Solana with enterprise-ready APIs"
        description="The institutional infrastructure for digital assets, built for compliant issuance, seamless payments, and efficient trading from a single platform on Solana."
        primaryCta="Join waitlist"
        primaryCtaHref="https://platform.solana.com"
        videoLabel="VISION BEHIND SDP"
      />
      <Logos
        className="py-8"
        itemClassName="!mr-8 xl:!mr-[72px]"
        speed={97}
        fadeColor="transparent"
        logos={LOGOS}
      />
      <DecorGrid />
      <section id="platform" className="scroll-mt-[72px]">
        <Advantages
          title="Build and launch financial products in weeks, not months."
          items={[
            "Accelerate time to market",
            "Built for AI",
            "Designed for institutions",
          ]}
          visualSrc="/src/img/solutions/sdp/advantages-visual.svg"
          visualBgSrc="/src/img/solutions/sdp/advantages-visual-bg.jpg"
        />
      </section>
      <DecorGrid />
      <section id="use-cases" className="scroll-mt-[72px]">
        <CardGrid
          title="A single, unified interface to issue, move and trade tokenized assets"
          columns={[
            {
              num: "1",
              img: "/src/img/solutions/sdp/feat-1.svg",
              bg: "/src/img/solutions/sdp/feat-bg-1.jpg",
              heading: "Issuance",
              body: "Launch GENIUS-compliant tokenized assets across deposits, stablecoins and RWAs with permissioning and privacy built-in.",
            },
            {
              num: "2",
              img: "/src/img/solutions/sdp/feat-2.svg",
              bg: "/src/img/solutions/sdp/feat-bg-2.jpg",
              heading: "Payments",
              body: "Orchestrate fiat and stablecoin flows — on-ramp, off-ramp, and onchain transactions across B2B, B2C, and P2P use cases.",
            },
            {
              num: "3",
              img: "/src/img/solutions/sdp/feat-3.svg",
              bg: "/src/img/solutions/sdp/feat-bg-3.jpg",
              heading: "Trading",
              headingBadge: "Coming Soon",
              body: "Support financial flows including atomic swaps, vaults, onchain FX and more.",
            },
          ]}
        />
      </section>
      <DecorGrid />
      <Infrastructure
        title="Build any financial product, without worrying about the infrastructure"
        description="Whether you're issuing a stablecoin, orchestrating cross-border payments, or tokenizing real-world assets, SDP provides the most reliable APIs and infrastructure to make it happen."
        testimonialQuote="By leveraging SDP, Worldpay can offer merchants seamless access to on-chain settlement and tokenized assets."
        testimonialName="Ahmed Zifzaf"
        testimonialRole="Head of Crypto Partnerships, Worldpay"
        checklistItems={[
          { label: "Create assets", Icon: Dollar },
          { label: "Move money", Icon: Switch },
          { label: "Trade and settle", Icon: Steps },
        ]}
      />
      <DecorGrid />
      <section id="partners" className="scroll-mt-[72px]">
        <Ecosystem
          title="Trusted by the world’s leading financial institutions"
          description="The biggest names in payments and finance are already building with SDP, alongside our vetted infrastructure partners powering the platform."
          partnersTitle="Enterprise-grade ecosystem"
          partnersSubtitle="Access the best of the Solana ecosystem with a unified experience"
          institutions={[
            {
              logoSrc: "/src/img/logos-eco/mastercard.svg",
              logoAlt: "Mastercard",
              name: "Mastercard",
              description: "Stablecoin settlements",
            },
            {
              logoSrc: "/src/img/logos-eco/worldpay.svg",
              logoAlt: "Worldpay",
              name: "Worldpay",
              description: "Payments and settlement",
            },
            {
              logoSrc: "/src/img/logos-eco/western-union.v2.svg",
              logoAlt: "Western Union",
              name: "Western Union",
              description: "Cross-border payments",
            },
          ]}
          categories={[
            {
              id: "node-rpc",
              Icon: Nodes,
              label: "Node / RPC",
              logos: NODES_LOGOS,
            },
            {
              id: "institutional-custody",
              Icon: Bank,
              label: "Institutional custody",
              logos: INST_LOGOS,
            },
            {
              id: "compliance",
              Icon: Law,
              label: "Compliance",
              logos: COMPLIANCE_LOGOS,
            },
            {
              id: "on-off-ramps",
              Icon: Sort,
              label: "On / Off Ramps",
              logos: RAMP_LOGOS,
            },
          ]}
        />
      </section>
      <DecorGrid />
      <AiAdvantages
        title="Build with the AI tools you already use"
        description="SDP works out of the box with AI coding tools like Claude Code by Anthropic and Codex by OpenAI, so your team can build faster with the tools they already know."
        items={[
          "Fully API driven",
          "Skills for AI agents",
          "AI-ready API documentation",
        ]}
        prompts={[
          "Build an RWA tokenization engine that supports different institutional custodians",
          'Build a corporate treasury dashboard that tracks stablecoin movements in and out of the "treasury" wallet',
          "Add stablecoin on/offramp capabilities to XYZ neobank",
          "Set compliance rules for all stablecoin transfers to only allow low risk transactions",
          "Create a new institutional wallet designated for issuing stablecoins",
          "Add stablecoin payout capabilities to XYZ remittance app",
        ]}
      />
      <DecorGrid />
      <section id="sandbox" className="scroll-mt-[72px]">
        <Tutorials title="Get Started in 10min" items={TUTORIALS} />
      </section>
      <DecorGrid />
      {/* <section id="media" className="scroll-mt-[72px]">
        <News title="News & updates" items={NEWS} />
      </section>
      <DecorGrid /> */}
      <Podcasts title="Meet the builders" items={PODCASTS} />
      <DecorGrid />
      <Join
        title="Build the next wave of finance on Solana"
        ctaLabel="Join waitlist"
        ctaHref="https://platform.solana.com"
      />
      <DecorGrid />
      <Footer
        navColumns={[
          {
            title: "Product",
            links: [
              { label: "API documentation", href: "/docs/rpc" },
              { label: "Postman collection", href: "#" },
              { label: "AI skills", href: "#" },
            ],
          },
          {
            title: "Get connected",
            links: [
              { label: "Blog", href: "/news" },
              { label: "Podcasts", href: "/podcasts" },
              { label: "Newsletter", href: "/newsletter" },
            ],
          },
          {
            title: "Legal",
            links: [
              { label: "Disclaimer", href: "/tos" },
              { label: "Privacy policy", href: "/privacy-policy" },
            ],
          },
        ]}
      />

      <VideoPlayerModal />
    </div>
  );
}
