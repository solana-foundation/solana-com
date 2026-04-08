"use client";

import { FeedbackOverlay } from "./FeedbackOverlay";

const BG_IMAGE =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Ff1d4c0384bf94fd4bd51807305310e9e.png";

const CARDS = [
  {
    heading: "Port CosmWasm contracts",
    body: "Translate storage, entrypoints, authorization, queries, and testing into Solana's account-based program model.",
    cta: "Explore the contract guide",
    url: "/developers/migrate-to-solana/cosmos/cosmwasm",
    tag: "CosmWasm",
  },
  {
    heading: "Migrate a Cosmos app chain",
    body: "Plan governance, state export, token claims, data migration, and post-cutover operations for a full app-chain move.",
    cta: "Explore the app-chain guide",
    url: "/developers/migrate-to-solana/cosmos/app-chain",
    tag: "App Chain",
  },
];

// ─── Variant A: Minimal dark surface, no background image ───────────────────
function VariantA() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {CARDS.map((card) => (
        <a
          key={card.url}
          href={card.url}
          className="flex flex-col gap-6 bg-white/[0.03] border border-white/10 rounded-2xl p-10 no-underline hover:border-white/20 transition-colors group"
        >
          <h2 className="text-white font-sans font-semibold text-3xl leading-tight mb-0">
            {card.heading}
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-0 flex-1">
            {card.body}
          </p>
          <span className="self-center inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white text-sm font-medium group-hover:border-white/40 transition-colors">
            {card.cta}
            <span className="opacity-60">→</span>
          </span>
        </a>
      ))}
    </div>
  );
}

// ─── Variant B: Image-header card (refined current design) ──────────────────
function VariantB() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {CARDS.map((card) => (
        <a
          key={card.url}
          href={card.url}
          className="flex flex-col rounded-2xl overflow-hidden no-underline group"
          style={{
            background: "linear-gradient(160deg, #1a1230 0%, #0d0d1a 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="w-full h-44 bg-cover bg-center"
            style={{ backgroundImage: `url(${BG_IMAGE})` }}
          />
          <div className="flex flex-col items-center text-center px-10 pt-8 pb-10 gap-5">
            <h2 className="text-white font-sans font-semibold text-3xl leading-tight mb-0">
              {card.heading}
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-0 flex-1">
              {card.body}
            </p>
            <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-[#9945FF] text-white group-hover:bg-[#8a38f0] transition-colors">
              {card.cta}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

// ─── Variant C: Numbered border cards — developer aesthetic, no bg image ────
function VariantC() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {CARDS.map((card, i) => (
        <a
          key={card.url}
          href={card.url}
          className="flex flex-col gap-8 rounded-2xl p-10 no-underline border border-white/10 hover:border-white/20 transition-colors group"
          style={{ background: "#0a0a0f" }}
        >
          <span className="font-mono text-white/20 text-sm tracking-widest">
            0{i + 1}
          </span>
          <h2 className="text-white font-sans font-semibold text-[32px] leading-tight mb-0">
            {card.heading}
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-0 flex-1">
            {card.body}
          </p>
          <span className="flex items-center gap-2 text-[#00ffbd] text-sm font-medium">
            {card.cta}
            <span className="group-hover:translate-x-1 transition-transform inline-block">
              →
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}

// ─── Variant D: Horizontal split — image left, content right ────────────────
function VariantD() {
  return (
    <div className="flex flex-col gap-4">
      {CARDS.map((card) => (
        <a
          key={card.url}
          href={card.url}
          className="flex rounded-2xl overflow-hidden no-underline group"
          style={{
            background: "linear-gradient(135deg, #12101f 0%, #0a0a12 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="w-64 shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BG_IMAGE})` }}
          />
          <div className="flex flex-col justify-between px-10 py-8 gap-4">
            <div className="flex flex-col gap-3">
              <h2 className="text-white font-sans font-semibold text-2xl leading-tight mb-0">
                {card.heading}
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-0">
                {card.body}
              </p>
            </div>
            <span className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#9945FF] text-white group-hover:bg-[#8a38f0] transition-colors">
              {card.cta}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

// ─── Variant E: Full-bleed dark with badge + wide CTA ───────────────────────
function VariantE() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {CARDS.map((card) => (
        <a
          key={card.url}
          href={card.url}
          className="flex flex-col gap-6 rounded-2xl p-10 no-underline group relative overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at 70% 20%, rgba(153,69,255,0.12) 0%, #080810 60%)",
            border: "1px solid rgba(153,69,255,0.2)",
          }}
        >
          <span className="self-start px-3 py-1 rounded-full text-xs font-mono text-[#9945FF] border border-[#9945FF]/30 bg-[#9945FF]/10">
            {card.tag}
          </span>
          <h2 className="text-white font-sans font-semibold text-3xl leading-tight mb-0">
            {card.heading}
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-0 flex-1">
            {card.body}
          </p>
          <span className="w-full flex items-center justify-center py-3.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-white group-hover:bg-white/10 transition-colors">
            {card.cta} →
          </span>
        </a>
      ))}
    </div>
  );
}

// ─── Lab shell ───────────────────────────────────────────────────────────────
const VARIANTS = [
  {
    id: "A",
    label: "Minimal surface",
    rationale:
      "Clean dark card, no image. Heading top, outline pill CTA centered. Technical & precise, like Vercel.",
    component: <VariantA />,
  },
  {
    id: "B",
    label: "Image-header (refined current)",
    rationale:
      "Background image on top half, centered heading + body + purple pill CTA below. Polished version of what's live.",
    component: <VariantB />,
  },
  {
    id: "C",
    label: "Numbered border",
    rationale:
      "No image. Numbered (01/02), large heading, green arrow text link. Pure developer aesthetic.",
    component: <VariantC />,
  },
  {
    id: "D",
    label: "Horizontal split",
    rationale:
      "Image left column, content right. Compact at card level but spacious feel. Good for scan-ability.",
    component: <VariantD />,
  },
  {
    id: "E",
    label: "Purple radial glow",
    rationale:
      "No image — radial purple gradient replaces it. Badge tag, wide full-row CTA button at bottom.",
    component: <VariantE />,
  },
];

export default function DesignLabPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-10 py-6 flex items-center gap-4">
        <span className="font-mono text-xs text-white/30 uppercase tracking-widest">
          Design Lab
        </span>
        <span className="text-white/10">·</span>
        <span className="text-white/50 text-sm">
          Cosmos path cards · Technical & precise · Spacious
        </span>
      </div>

      {/* Variants */}
      <div className="px-10 py-12 flex flex-col gap-24">
        {VARIANTS.map((v) => (
          <section
            key={v.id}
            data-variant={v.id}
            className="flex flex-col gap-6"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-4xl font-bold text-white/10">
                {v.id}
              </span>
              <div>
                <h2 className="text-white font-semibold text-lg mb-0">
                  {v.label}
                </h2>
                <p className="text-white/40 text-sm mb-0">{v.rationale}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black p-8">
              {v.component}
            </div>
          </section>
        ))}
      </div>

      <FeedbackOverlay />
    </div>
  );
}
