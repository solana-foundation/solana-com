"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { cardParams, type CheckResult } from "@/lib/epoch1000/card-params";
import {
  isValidSolanaAddress,
  SOLANA_ADDRESS_ERROR,
} from "@/lib/epoch1000/public-key";

const LOADING_LINE_KEYS = [
  "loadingChecking",
  "loadingFindingVote",
  "loadingScanning",
  "loadingBuilding",
] as const;

interface Props {
  onResult?: (_result: CheckResult | null) => void;
}

export default function ValidatorChecker({ onResult }: Props) {
  const t = useTranslations("epoch1000.validator.checker");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLine, setLoadingLine] = useState<
    (typeof LOADING_LINE_KEYS)[number]
  >(LOADING_LINE_KEYS[0]);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [showAddress, setShowAddress] = useState(true);
  const [copied, setCopied] = useState(false);

  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-US"), []);

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
          LOADING_LINE_KEYS[
            Math.floor(Math.random() * LOADING_LINE_KEYS.length)
          ],
        ),
      2500,
    );
    try {
      const res = await fetch("/api/epoch1000/validator/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteAccount: trimmed }),
      });
      const json = await res.json();
      if (!res.ok) {
        setLookupError(json.error ?? t("lookupFailed"));
      } else {
        setResult(json as CheckResult);
        onResult?.(json as CheckResult);
      }
    } catch {
      setLookupError(t("lookupFailed"));
    } finally {
      clearInterval(rotator);
      setLoading(false);
    }
  }

  const params = result ? cardParams(result, showAddress, "validator") : "";
  const cardUrl = result
    ? `${window.location.origin}/epoch1000/validator/card?${params}`
    : "";
  const tweet = result
    ? encodeURIComponent(
        t("tweet", {
          epochsSurvived: result.epochsSurvived,
          capped: result.capped ? "+" : "",
          tier: result.tier,
          cardUrl,
        }),
      )
    : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
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
          {t.rich("heading", {
            gradient: (chunks) => (
              <span className="text-sol-gradient">{chunks}</span>
            ),
          })}
        </h2>
        <p className="mt-2 text-sm text-ep-dim">{t("description")}</p>
      </div>

      <form onSubmit={check} className="flex flex-col sm:flex-row gap-3">
        <input
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setLookupError(null);
          }}
          placeholder={t("placeholder")}
          spellCheck={false}
          autoComplete="off"
          aria-label={t("inputAriaLabel")}
          aria-invalid={validationError ? true : undefined}
          aria-describedby={
            displayedError ? "epoch1000-validator-error" : undefined
          }
          className="ep-glow-input flex-1 bg-ep-panel border border-ep-edge rounded-full px-5 py-3 font-mono text-sm placeholder:text-ep-dust"
        />
        <button
          type="submit"
          disabled={loading || !isAddressValid}
          className="!bg-ep-ink text-ep-void font-semibold rounded-full px-7 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:!bg-ep-dim transition"
        >
          {loading ? t("submitLoading") : t("submit")}
        </button>
      </form>

      {loading && (
        <p className="text-sm text-ep-dust animate-pulse" aria-live="polite">
          {t(loadingLine)}
        </p>
      )}

      {displayedError && (
        <p
          id="epoch1000-validator-error"
          className="text-sm text-red-400"
          role="alert"
        >
          {displayedError}
        </p>
      )}

      {result && (
        <div className="flex flex-col gap-4">
          <img
            key={params}
            src={`/api/epoch1000/og?${params}`}
            alt={t("imageAlt", {
              firstEpoch: result.firstEpoch,
              epochsSurvived: result.epochsSurvived,
            })}
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
              {t("showVoteAccount")}
            </label>
            <a
              href={`https://twitter.com/intent/tweet?text=${tweet}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ep-ink text-ep-void font-semibold rounded-full px-5 py-2 hover:bg-ep-dim transition"
            >
              {t("share")}
            </a>
            <button
              onClick={copyLink}
              className="border border-ep-edge rounded-full px-5 py-2 text-ep-dim hover:text-ep-ink transition"
            >
              {copied ? t("copied") : t("copyLink")}
            </button>
            <a
              href={`/api/epoch1000/og?${params}`}
              download={`epoch1000-validator-${result.firstEpoch}.png`}
              className="border border-ep-edge rounded-full px-5 py-2 text-ep-dim hover:text-ep-ink transition"
            >
              {t("png")}
            </a>
          </div>

          <p className="text-xs text-ep-dust">
            {t("firstSeen")}{" "}
            <a
              href={`https://solscan.io/account/${result.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-ep-edge underline-offset-4 hover:text-ep-dim"
            >
              {t("firstSeenEpoch", {
                epoch: result.firstEpoch,
                slot: numberFormatter.format(result.firstSlot),
              })}
            </a>
          </p>
        </div>
      )}
    </section>
  );
}
