"use client";

import { useMemo, type ReactNode } from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { cn } from "@/app/components/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
} from "@/app/components/ui/tooltip";
import {
  getRpcTimeframeOption,
  type MetricRow,
  type RpcTimeframe,
} from "./data-config";
import { getProviderColor } from "./dashboard-providers";
import { formatGrpcDowntime } from "./grpc-provider-metrics";
import {
  getGrpcUptimeRows,
  type GrpcUptimeStatus,
} from "./grpc-uptime-metrics";

const statusClasses: Record<GrpcUptimeStatus, string> = {
  observed: "bg-emerald-400/75 hover:bg-emerald-300/90",
  outage: "bg-rose-500/90 hover:bg-rose-400",
  unknown:
    "bg-[repeating-linear-gradient(135deg,transparent,transparent_5px,rgba(255,255,255,0.035)_5px,rgba(255,255,255,0.035)_6px)] hover:bg-white/[0.06]",
};

type TimelineDetail = {
  provider: string;
  label: string;
  time: string;
  description?: string;
};

export function GrpcUptimeTimeline({
  rows,
  selectedProviders,
  timeframe,
  generatedAt,
}: {
  rows: MetricRow[];
  selectedProviders: ReadonlySet<string>;
  timeframe: RpcTimeframe;
  generatedAt?: string;
}) {
  const t = useTranslations("dataDashboard.grpcExperience");
  const locale = useLocale();
  const option = getRpcTimeframeOption(timeframe);
  const range = useMemo(() => {
    const parsed = Date.parse(generatedAt ?? "");
    const end =
      Math.floor((Number.isFinite(parsed) ? parsed : Date.now()) / 60_000) *
      60_000;
    return { start: end - option.durationSeconds * 1000, end };
  }, [generatedAt, option.durationSeconds]);
  const providers = useMemo(
    () =>
      getGrpcUptimeRows(
        rows,
        selectedProviders,
        range.start,
        range.end,
        option.stepSeconds,
      ),
    [rows, selectedProviders, range.start, range.end, option.stepSeconds],
  );
  const percent = (time: number) =>
    ((time - range.start) / (range.end - range.start)) * 100;
  const axisFormat = new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    ...(option.durationSeconds > 24 * 60 * 60
      ? ({ month: "short", day: "numeric" } as const)
      : {}),
  });
  const detailFormat = new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "medium",
  });
  const statusLabel = (status: GrpcUptimeStatus) =>
    t(
      status === "observed"
        ? "uptimeObserved"
        : status === "outage"
          ? "uptimeOutage"
          : "uptimeUnknown",
    );

  return (
    <div role="group" aria-label={t("uptimeChartTitle")} className="min-w-0">
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-brand-mono text-[11px] text-nd-mid-em-text">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 bg-emerald-400/75" />
          {t("uptimeObserved")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 bg-rose-500" />
          {t("uptimeOutage")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-amber-300" />
          {t("uptimeReconnect")}
        </span>
      </div>
      <div className="space-y-4">
        {providers.map((provider) => (
          <div
            key={provider.provider}
            className="grid min-w-0 gap-2 md:grid-cols-[128px_minmax(0,1fr)] md:items-center md:gap-4"
          >
            <span className="flex min-w-0 items-center gap-2 font-brand-mono text-[12px] font-bold text-nd-high-em-text">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0"
                style={{ backgroundColor: getProviderColor(provider.provider) }}
              />
              <span className="truncate">{provider.provider}</span>
            </span>
            <div className="relative h-12 min-w-0 border border-nd-border-light bg-white/[0.025] md:h-14">
              {provider.segments.map((segment) => {
                const label = statusLabel(segment.status);
                const time = `${detailFormat.format(segment.start)} – ${detailFormat.format(segment.end)} UTC`;
                const description =
                  segment.status === "outage"
                    ? t("uptimeRecordedDowntime", {
                        duration: formatGrpcDowntime(segment.downtime, locale),
                      })
                    : undefined;
                return (
                  <TimelineTooltip
                    key={segment.start}
                    detail={{
                      provider: provider.provider,
                      label,
                      time,
                      description,
                    }}
                  >
                    <button
                      type="button"
                      aria-label={`${provider.provider} · ${label} · ${time}${description ? ` · ${description}` : ""}`}
                      className={cn(
                        "absolute inset-y-2 min-w-px border-r border-black/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                        statusClasses[segment.status],
                      )}
                      style={{
                        left: `${percent(segment.start)}%`,
                        width: `${percent(segment.end) - percent(segment.start)}%`,
                      }}
                    />
                  </TimelineTooltip>
                );
              })}
              {provider.reconnects.map((event) => {
                const label = t("reconnectEvent", {
                  provider: provider.provider,
                  count: event.count,
                });
                const detail = {
                  provider: provider.provider,
                  label: t("uptimeReconnectCount", { count: event.count }),
                  time: `${detailFormat.format(event.time)} UTC`,
                };
                return (
                  <TimelineTooltip key={event.time} detail={detail}>
                    <button
                      type="button"
                      aria-label={label}
                      className="group absolute inset-y-0 z-10 w-7 -translate-x-1/2 focus-visible:outline-none"
                      style={{ left: `${percent(event.time)}%` }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-1 left-1/2 w-px bg-amber-300/70 group-hover:bg-amber-100"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-amber-100 bg-amber-300 shadow-sm group-hover:scale-125 group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black"
                      />
                    </button>
                  </TimelineTooltip>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 grid md:grid-cols-[128px_minmax(0,1fr)] md:gap-4">
        <span aria-hidden="true" className="hidden md:block" />
        <div className="relative h-12 border-t border-nd-border-light font-brand-mono text-[10px] text-nd-mid-em-text">
          {[0, 1, 2, 3, 4].map((tick) => (
            <span
              key={tick}
              className={cn(
                "absolute top-2 whitespace-nowrap",
                tick === 0
                  ? "translate-x-0"
                  : tick === 4
                    ? "-translate-x-full"
                    : "-translate-x-1/2",
                tick % 2 === 1 && "hidden sm:block",
              )}
              style={{ left: `${tick * 25}%` }}
            >
              {axisFormat.format(
                range.start + ((range.end - range.start) * tick) / 4,
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineTooltip({
  detail,
  children,
}: {
  detail: TimelineDetail;
  children: ReactNode;
}) {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          side="top"
          sideOffset={8}
          collisionPadding={16}
          className="max-w-[min(360px,calc(100vw-32px))] rounded-none border-nd-border-prominent bg-[#1D1D20] px-3 py-2 font-brand-mono text-[11px] leading-relaxed text-nd-mid-em-text"
        >
          <span className="block font-bold text-nd-high-em-text">
            {detail.provider} · {detail.label}
          </span>
          <span className="mt-1 block">{detail.time}</span>
          {detail.description ? (
            <span className="mt-2 block border-t border-nd-border-light pt-2">
              {detail.description}
            </span>
          ) : null}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}
