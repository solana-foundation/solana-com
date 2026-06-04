"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { cn } from "@/app/components/utils";
import { ASSET_FILTERS, type AssetFilter } from "@/data/solutions/tokenization";
import type { TokenizedAsset } from "@/lib/tokens/assets";
import { Eyebrow } from "./eyebrow";

export type AssetTableProps = {
  assets: TokenizedAsset[];
};

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const formatUsd = (value: number | null): string =>
  value === null || !Number.isFinite(value) ? "—" : usdFormatter.format(value);

const formatPercent = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

const CATEGORY_DOT: Record<TokenizedAsset["category"], string> = {
  rwa: "bg-[#CA9FF5]",
  equity: "bg-emerald-400",
  etf: "bg-sky-400",
  stablecoin: "bg-teal-400",
  commodity: "bg-amber-400",
};

/**
 * Live registry of tokenized real-world assets, sourced from the Tokens API.
 * Category chips and ticker/issuer search filter the already-fetched rows on
 * the client. Degrades to a notice when no live data is available.
 */
export const AssetTable = ({ assets }: AssetTableProps) => {
  const t = useTranslations("icm.assets");
  const [filter, setFilter] = useState<AssetFilter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map = new Map<AssetFilter, number>();
    map.set("all", assets.length);
    for (const asset of assets) {
      map.set(asset.category, (map.get(asset.category) ?? 0) + 1);
    }
    return map;
  }, [assets]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesCategory = filter === "all" || asset.category === filter;
      const matchesTerm =
        !term ||
        asset.symbol.toLowerCase().includes(term) ||
        asset.name.toLowerCase().includes(term) ||
        (asset.issuer?.toLowerCase().includes(term) ?? false);
      return matchesCategory && matchesTerm;
    });
  }, [assets, filter, query]);

  const hasData = assets.length > 0;

  return (
    <section
      id="assets"
      className="relative bg-black text-white text-left scroll-mt-24"
    >
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px]">
        <div className="max-w-2xl mb-[32px] xl:mb-[48px]">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="mt-4 font-brand font-medium leading-[1.1] text-[32px] md:text-[40px] xl:text-[64px] tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
            {t("title")}
          </h2>
          <p className="mt-4 text-[#ABABBA] text-lg md:text-2xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
            {t("description")}
          </p>
        </div>

        {!hasData ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-12 text-center text-[#ABABBA]">
            {t("unavailable")}
          </div>
        ) : (
          <>
            {/* Filters + search */}
            <div className="flex flex-col xl:flex-row xl:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-2 grow">
                {ASSET_FILTERS.map((value) => {
                  const isActive = filter === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setFilter(value)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CA9FF5]",
                        isActive
                          ? "border-white !bg-white !text-black"
                          : "border-white/15 text-[#ABABBA] hover:border-white/30 hover:text-white",
                      )}
                    >
                      {t(`filters.${value}`)}
                      <span
                        className={cn(
                          "text-xs",
                          isActive ? "text-black/70" : "text-white/60",
                        )}
                      >
                        {counts.get(value) ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="relative xl:w-72 shrink-0">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40"
                  aria-hidden
                />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("searchPlaceholder")}
                  aria-label={t("searchPlaceholder")}
                  className="w-full rounded-full border border-white/15 bg-white/[0.03] py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div
              tabIndex={0}
              role="region"
              aria-label={t("title")}
              className="max-h-[640px] overflow-x-auto overflow-y-auto rounded-2xl border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CA9FF5]"
            >
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.06em] text-white/60">
                    <th className="font-medium px-5 py-4">
                      {t("columns.asset")}
                    </th>
                    <th className="font-medium px-5 py-4">
                      {t("columns.type")}
                    </th>
                    <th className="font-medium px-5 py-4">
                      {t("columns.issuer")}
                    </th>
                    <th className="font-medium px-5 py-4 text-right">
                      {t("columns.marketCap")}
                    </th>
                    <th className="font-medium px-5 py-4 text-right">
                      {t("columns.liquidity")}
                    </th>
                    <th className="font-medium px-5 py-4 text-right">
                      {t("columns.change")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-[#ABABBA] border-t border-white/10"
                      >
                        {t("empty")}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((asset) => (
                      <tr
                        key={asset.assetId}
                        className="border-t border-white/10 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {asset.imageUrl ? (
                              <img
                                src={asset.imageUrl}
                                alt=""
                                width={28}
                                height={28}
                                loading="lazy"
                                className="size-7 rounded-full bg-white/10 object-cover shrink-0"
                              />
                            ) : (
                              <span className="size-7 rounded-full bg-white/10 grid place-items-center text-[10px] font-semibold text-white/70 shrink-0">
                                {asset.symbol.slice(0, 2)}
                              </span>
                            )}
                            <div className="min-w-0">
                              <div className="font-medium leading-tight">
                                {asset.symbol}
                              </div>
                              <div className="text-xs text-white/50 truncate max-w-[220px]">
                                {asset.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-2 text-sm text-[#ABABBA]">
                            <span
                              className={cn(
                                "size-[6px] rounded-full",
                                CATEGORY_DOT[asset.category],
                              )}
                              aria-hidden
                            />
                            {t(`categoryLabels.${asset.category}`)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#ABABBA]">
                          {asset.issuer ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-right tabular-nums">
                          {formatUsd(asset.marketCap)}
                        </td>
                        <td className="px-5 py-4 text-right tabular-nums text-[#ABABBA]">
                          {formatUsd(asset.liquidity)}
                        </td>
                        <td
                          className={cn(
                            "px-5 py-4 text-right tabular-nums",
                            asset.priceChange24hPercent === null
                              ? "text-white/60"
                              : asset.priceChange24hPercent >= 0
                                ? "text-emerald-400"
                                : "text-red-400",
                          )}
                        >
                          {formatPercent(asset.priceChange24hPercent)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm text-white/50">
              <span className="inline-flex items-center gap-2">
                <span className="size-[6px] rounded-full bg-emerald-400 animate-pulse" />
                {t("liveLabel")}
              </span>
              <span>
                {t("showing", {
                  count: filtered.length,
                  total: assets.length,
                })}{" "}
                ·{" "}
                <a
                  href="https://tokens.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-white"
                >
                  {t("viewAll")} →
                </a>
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
