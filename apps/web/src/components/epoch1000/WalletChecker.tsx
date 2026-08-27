"use client";

import { useState } from "react";
import { cardParams, type CheckResult } from "@/lib/epoch1000/card-params";
import {
  isValidSolanaAddress,
  SOLANA_ADDRESS_ERROR,
} from "@/lib/epoch1000/public-key";

const LOADING_LINES = [
  "checking...",
  "finding first tx...",
  "scanning history...",
  "building card...",
];

interface Props {
  /** Fires with each lookup result so the page can paint the timeline. */
  onResult?: (_result: CheckResult | null) => void;
}

export default function WalletChecker({ onResult }: Props) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLine, setLoadingLine] = useState(LOADING_LINES[0]);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [showAddress, setShowAddress] = useState(true);
  const [copied, setCopied] = useState(false);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = address.trim();
    if (loading) return;
    if (!isValidSolanaAddress(trimmed)) {
      setLookupError(null);
      return;
    }
    setLoading(true);
    setLookupError(null);
    setResult(null);
    onResult?.(null);
    setCopied(false);
    const rotator = setInterval(
      () =>
        setLoadingLine(
          LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)],
        ),
      2500,
    );
    try {
      const res = await fetch("/api/epoch1000/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: trimmed }),
      });
      const json = await res.json();
      if (!res.ok) {
        setLookupError(json.error ?? "Lookup failed. Try again.");
      } else {
        setResult(json as CheckResult);
        onResult?.(json as CheckResult);
      }
    } catch {
      setLookupError("Lookup failed. Try again.");
    } finally {
      clearInterval(rotator);
      setLoading(false);
    }
  }

  const params = result ? cardParams(result, showAddress) : "";
  const cardUrl = result
    ? `${window.location.origin}/epoch1000/card?${params}`
    : "";
  const tweet = result
    ? encodeURIComponent(
        `I've survived ${result.epochsSurvived}${result.capped ? "+" : ""} Solana epochs - ${result.tier}.\n\n${cardUrl}`,
      )
    : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable - the link is visible in the X intent instead
    }
  }

  const trimmedAddress = address.trim();
  const hasAddress = trimmedAddress.length > 0;
  const isAddressValid = hasAddress && isValidSolanaAddress(trimmedAddress);
  const validationError =
    hasAddress && !isAddressValid ? SOLANA_ADDRESS_ERROR : null;
  const displayedError = validationError ?? lookupError;

  return (
    <section id="checker" className="flex flex-col gap-6">
      <div>
        <h2 className="font-bold tracking-tight text-3xl sm:text-4xl">
          Check <span className="text-sol-gradient">wallet</span>
        </h2>
        <p className="mt-2 text-sm text-ep-dim">
          Find your first epoch and share your survivor card. No connect, no
          signature.
        </p>
      </div>

      <form onSubmit={check} className="flex flex-col sm:flex-row gap-3">
        <input
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setLookupError(null);
          }}
          placeholder="wallet address"
          spellCheck={false}
          autoComplete="off"
          aria-label="Solana wallet address"
          aria-invalid={validationError ? true : undefined}
          aria-describedby={
            displayedError ? "epoch1000-wallet-error" : undefined
          }
          className="ep-glow-input flex-1 bg-ep-panel border border-ep-edge rounded-full px-5 py-3 font-mono text-sm placeholder:text-ep-dust"
        />
        <button
          type="submit"
          disabled={loading || !isAddressValid}
          className="!bg-ep-ink text-ep-void font-semibold rounded-full px-7 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:!bg-ep-dim transition"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {loading && (
        <p className="text-sm text-ep-dust animate-pulse" aria-live="polite">
          {loadingLine}
        </p>
      )}

      {displayedError && (
        <p
          id="epoch1000-wallet-error"
          className="text-sm text-red-400"
          role="alert"
        >
          {displayedError}
        </p>
      )}

      {result && (
        <div className="flex flex-col gap-4">
          {/* The preview IS the shareable image - zero drift. */}
          <img
            key={params}
            src={`/api/epoch1000/og?${params}`}
            alt={`Survivor card: first seen epoch ${result.firstEpoch}, survived ${result.epochsSurvived} epochs`}
            className="w-full rounded-lg border border-ep-edge"
            width={1200}
            height={630}
          />

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2 text-ep-dim cursor-pointer select-none mr-auto">
              <input
                type="checkbox"
                checked={showAddress}
                onChange={(e) => setShowAddress(e.target.checked)}
                className="accent-[#14f195]"
              />
              Show wallet
            </label>
            <a
              href={`https://twitter.com/intent/tweet?text=${tweet}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ep-ink text-ep-void font-semibold rounded-full px-5 py-2 hover:bg-ep-dim transition"
            >
              Share
            </a>
            <button
              onClick={copyLink}
              className="border border-ep-edge rounded-full px-5 py-2 text-ep-dim hover:text-ep-ink transition"
            >
              {copied ? "Copied" : "Copy link"}
            </button>
            <a
              href={`/api/epoch1000/og?${params}`}
              download={`epoch1000-${result.firstEpoch}.png`}
              className="border border-ep-edge rounded-full px-5 py-2 text-ep-dim hover:text-ep-ink transition"
            >
              PNG
            </a>
          </div>

          <p className="text-xs text-ep-dust">
            First seen:{" "}
            <a
              href={`https://solscan.io/tx/${result.firstSignature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-ep-edge underline-offset-4 hover:text-ep-dim"
            >
              epoch {result.firstEpoch} · slot{" "}
              {result.firstSlot.toLocaleString("en-US")}
            </a>
            {result.capped &&
              ` - oldest found across ${result.scanned.toLocaleString("en-US")} transactions.`}
          </p>
        </div>
      )}
    </section>
  );
}
