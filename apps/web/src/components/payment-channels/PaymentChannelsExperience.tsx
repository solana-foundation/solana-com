"use client";

import type { ReactNode } from "react";
import MachineTelemetryPlayback from "./MachineTelemetryPlayback";
import { MillionPaymentCanvas } from "./MillionPaymentCanvas";

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-brand-mono text-xs uppercase text-nd-highlight-lime">
      {children}
    </p>
  );
}

export default function PaymentChannelsExperience() {
  return (
    <main className="bg-black text-nd-high-em-text">
      <section className="mx-auto grid min-h-[calc(100dvh-72px)] max-w-screen-2xl border-x border-nd-border-light lg:grid-cols-[minmax(0,0.9fr)_minmax(480px,1.1fr)]">
        <div className="flex flex-col justify-between border-b border-nd-border-light px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-14 lg:py-16">
          <div>
            <SectionLabel>Payment channels / a throughput study</SectionLabel>
            <h1 className="mt-6 max-w-xl text-balance font-brand text-5xl leading-[0.94] sm:text-7xl">
              Agents need a payment rail that keeps up with their thinking.
            </h1>
            <p className="mt-8 max-w-lg text-pretty text-lg leading-relaxed text-nd-mid-em-text">
              The next generation of software will not wait at a checkout
              screen. It will make many small, continuous decisions—and pay for
              the data, inference, and services it needs as it goes.
            </p>
          </div>
        </div>

        <div className="relative min-h-[480px] overflow-hidden bg-[#050707]">
          <MillionPaymentCanvas />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between border-b border-nd-border-light bg-black/85 px-5 py-4 font-brand-mono text-xs uppercase sm:px-7">
            <span className="text-nd-mid-em-text">Live payment field</span>
            <span className="text-nd-highlight-lime">
              1,000 × 1,000 payments / second
            </span>
          </div>
          <div className="absolute bottom-5 left-5 z-20 max-w-md border border-nd-border-prominent bg-black/90 p-4 sm:bottom-7 sm:left-7 sm:p-5">
            <p className="font-brand-mono text-xs uppercase text-nd-highlight-lime">
              one million logical payment / second
            </p>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-nd-mid-em-text">
              Our first milestone: process one million logical payments every
              second while touching Solana only when settlement is required.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-screen-2xl border-x border-b border-nd-border-light lg:grid-cols-[0.9fr_1.1fr]">
        <div className="p-6 sm:p-10 lg:border-r lg:border-nd-border-light lg:p-14">
          <SectionLabel>The bet</SectionLabel>
          <h2 className="mt-5 max-w-md text-balance font-brand text-4xl leading-tight sm:text-5xl">
            Payment channels, reintroduced at Solana pace for agentic traffic.
          </h2>
        </div>
        <div className="grid gap-px bg-nd-border-light sm:grid-cols-2">
          {[
            [
              "01",
              "Simple by design",
              "Open a channel once. Exchange signed cumulative updates off-chain. Settle the final balance to Solana when it matters.",
            ],
            [
              "02",
              "Scales cleanly",
              "Ed25519 verification is the CPU-bound work. Independent channel ownership lets you shard channel ranges across Proxies as demand grows.",
            ],
            [
              "03",
              "Cheap at settlement",
              "The 100k-channel study completed with 25,000 four-channel transactions for 0.625 SOL—while the logical payments themselves stayed off-chain.",
            ],
            [
              "04",
              "Your rules, your clock",
              "Settle by time, volume, risk, or your own business logic. Fewer settlements lower cost; tighter settlement windows bring faster finality.",
            ],
          ].map(([number, title, text]) => (
            <article key={number} className="bg-black p-6 sm:p-8">
              <p className="font-brand-mono text-xs text-nd-highlight-lime">
                {number}
              </p>
              <h3 className="mt-7 font-brand text-2xl">{title}</h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-nd-mid-em-text">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <MachineTelemetryPlayback />

      <section className="mx-auto grid max-w-screen-2xl border-x border-b border-nd-border-light lg:grid-cols-[0.8fr_1.2fr]">
        <div className="p-6 sm:p-10 lg:border-r lg:border-nd-border-light lg:p-14">
          <SectionLabel>Full-stack proof</SectionLabel>
          <h2 className="mt-5 max-w-md text-balance font-brand text-4xl leading-tight sm:text-5xl">
            Not a theory. A running payment path.
          </h2>
          <p className="mt-6 max-w-md text-pretty leading-relaxed text-nd-mid-em-text">
            This benchmark exercises the path a developer can deploy: a load
            generator emits signed logical payments, pay.sh handles them as a
            proxy, and payment channels settle final state to Solana.
          </p>
        </div>
        <div className="grid gap-px bg-nd-border-light sm:grid-cols-3">
          <article className="flex flex-col bg-black p-6 sm:p-8">
            <p className="font-brand-mono text-[10px] uppercase text-nd-highlight-lime">
              01 / proxy
            </p>
            <div className="mt-8 flex h-24 items-center">
              <a
                href="https://github.com/solana-foundation/pay"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit"
              >
                <img
                  src="/img/payment-channels/paysh-wordmark.svg"
                  alt="pay.sh — open GitHub repository"
                  className="h-8 w-auto brightness-0 invert"
                />
              </a>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-nd-mid-em-text">
              Runs as the high-throughput proxy for the benchmark.
            </p>
          </article>
          <article className="flex flex-col bg-black p-6 sm:p-8">
            <p className="font-brand-mono text-[10px] uppercase text-nd-highlight-lime">
              02 / standards
            </p>
            <div className="mt-8 flex h-24 items-center gap-3">
              <img
                src="/img/payment-channels/x402.svg"
                alt="x402"
                className="h-8 w-auto brightness-0 invert"
              />
              <img
                src="/img/payment-channels/mpp.svg"
                alt="MPP"
                className="h-6 w-auto brightness-0 invert"
              />
            </div>
            <p className="mt-6 text-sm leading-relaxed text-nd-mid-em-text">
              Uses MPP and x402 at the payment edge.
            </p>
          </article>
          <article className="flex flex-col bg-black p-6 sm:p-8">
            <p className="font-brand-mono text-[10px] uppercase text-nd-highlight-lime">
              03 / reproduce
            </p>
            <div className="mt-8 flex h-24 items-center">
              <h3 className="font-brand text-2xl leading-tight">
                Start with the exact setup.
              </h3>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-nd-mid-em-text">
              The proxy configuration and load-generator workflow are available
              as a template.
            </p>
            <a
              href="https://solana.com/developers/templates/pay-high-throughput-proxy"
              className="mt-auto inline-flex w-fit border border-nd-highlight-lime px-4 py-2 font-brand-mono text-xs text-nd-highlight-lime transition-colors hover:bg-nd-highlight-lime hover:text-black"
            >
              Open template →
            </a>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl border-x border-b border-nd-border-light px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <div className="max-w-2xl">
          <SectionLabel>
            Settlement is the bill, not the bottleneck
          </SectionLabel>
          <h2 className="mt-5 text-balance font-brand text-4xl leading-tight sm:text-6xl">
            100,000 channels. 25,000 transactions. One completed settlement
            cycle.
          </h2>
          <p className="mt-7 text-pretty text-lg leading-relaxed text-nd-mid-em-text">
            A settlement transaction carries four channel updates. The measured
            full cycle finalized all 100,000 channels, making the on-chain
            workload predictable while one million logical payments per second
            continue at application speed.
          </p>
        </div>
        <div className="mt-12 grid border border-nd-border-prominent sm:grid-cols-3">
          <div className="p-6 border-b border-nd-border-light sm:border-b-0 sm:border-r">
            <p className="font-brand-mono text-3xl text-nd-highlight-lime">
              ~203 s
            </p>
            <p className="mt-2 text-sm text-nd-mid-em-text">
              100k-channel settlement cycle observed
            </p>
          </div>
          <div className="p-6 border-b border-nd-border-light sm:border-b-0 sm:border-r">
            <p className="font-brand-mono text-3xl text-nd-highlight-lime">
              0.625 SOL
            </p>
            <p className="mt-2 text-sm text-nd-mid-em-text">
              fee for 100k-channel settlement cycle
            </p>
          </div>
          <div className="p-6">
            <p className="font-brand-mono text-3xl text-nd-highlight-lime">
              25,000
            </p>
            <p className="mt-2 text-sm text-nd-mid-em-text">
              lamports per four-channel transaction
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl border-x px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <SectionLabel>Reproduce the benchmark</SectionLabel>
        <div className="mt-5 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-3xl text-balance font-brand text-4xl leading-tight sm:text-6xl">
            Start with the same high-throughput proxy template.
          </h2>
          <div className="max-w-md">
            <p className="mb-5 text-pretty text-sm leading-relaxed text-nd-mid-em-text">
              The configuration, proxy, and load-generator workflow behind this
              study are available as a developer template.
            </p>
            <a
              href="https://solana.com/developers/templates/pay-high-throughput-proxy"
              className="inline-flex w-fit border border-nd-highlight-lime px-5 py-3 font-brand-mono text-sm text-nd-highlight-lime transition-colors hover:bg-nd-highlight-lime hover:text-black"
            >
              Run the proxy template →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
