"use client";

import { motion } from "motion/react";
import { LoaderLines as Loader2 } from "@boxicons/react/LoaderLines";
import { useEffect, useRef } from "react";
import { useTranslations } from "@workspace/i18n/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { cn } from "@/app/components/utils";
import {
  getDefaultRpcRegion,
  getRpcRegionOptions,
  rangeOptions,
  rpcInfraOptions,
  rpcMethodOptions,
  rpcTimeframeOptions,
  type DashboardTab,
  type ProviderName,
  type RpcLatencyInfra,
  type RpcLatencyFiltersResponse,
  type RpcLatencyMethod,
  type RpcLatencyRegion,
  type RpcTimeframe,
} from "./data-config";
import {
  tabIcons,
  tabIndicatorSpring,
  tabOptions,
} from "./dashboard-constants";
import {
  getProviderColor,
  hasAllProvidersSelected,
  toggleProvider,
} from "./dashboard-providers";
import type { QueryUpdates } from "./dashboard-types";

export function DashboardControls({
  activeTab,
  availableProviders,
  isRefreshing,
  onUpdateQuery,
  rangeDays,
  rpcInfra,
  rpcMethod,
  rpcRegion,
  rpcRegionsByInfra,
  rpcTimeframe,
  selectedProviders,
  showProviderControls,
  showRangeControl,
  showRpcFilterControls,
  showTimeframeControl,
}: {
  activeTab: DashboardTab;
  availableProviders: ProviderName[];
  isRefreshing: boolean;
  onUpdateQuery: (_updates: QueryUpdates) => void;
  rangeDays: number;
  rpcInfra: RpcLatencyInfra;
  rpcMethod: RpcLatencyMethod;
  rpcRegion: RpcLatencyRegion;
  rpcRegionsByInfra: RpcLatencyFiltersResponse["regionsByInfra"];
  rpcTimeframe: RpcTimeframe;
  selectedProviders: Set<ProviderName>;
  showProviderControls: boolean;
  showRangeControl: boolean;
  showRpcFilterControls: boolean;
  showTimeframeControl: boolean;
}) {
  const t = useTranslations("dataDashboard");

  return (
    <div className="px-4 md:px-8 xl:px-10 py-2 grid gap-2">
      <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center md:gap-x-3">
        <div className="relative -mx-1 min-w-0 md:mx-0">
          <div className="flex items-center overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-0">
            <TabSwitcher
              activeTab={activeTab}
              onChange={(value) => onUpdateQuery({ tab: value })}
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-nd-inverse to-transparent md:hidden"
          />
        </div>
        {showRangeControl ? (
          <>
            <Separator />
            <div className="-mx-1 flex items-center overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0">
              <InlineControl
                ariaLabel={t("controls.rangeAriaLabel")}
                options={rangeOptions}
                value={rangeDays}
                onChange={(value) => onUpdateQuery({ days: value })}
              />
            </div>
          </>
        ) : null}
        {showTimeframeControl ? (
          <>
            <Separator />
            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                ariaLabel={t("controls.rpcTimeframeAriaLabel")}
                label={t("controls.rpcTimeframeLabel")}
                options={rpcTimeframeOptions}
                value={rpcTimeframe}
                onChange={(value) => onUpdateQuery({ timeframe: value })}
              />
            </div>
          </>
        ) : null}
        {showRpcFilterControls ? (
          <>
            <Separator />
            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                ariaLabel={t("controls.rpcRegionAriaLabel")}
                label={t("controls.rpcRegionLabel")}
                options={getRpcRegionOptions(rpcInfra, rpcRegionsByInfra)}
                value={rpcRegion}
                onChange={(value) => onUpdateQuery({ region: value })}
              />
              <FilterSelect
                ariaLabel={t("controls.rpcInfraAriaLabel")}
                label={t("controls.rpcInfraLabel")}
                options={rpcInfraOptions}
                value={rpcInfra}
                onChange={(value) => {
                  const nextRegionOptions = getRpcRegionOptions(
                    value,
                    rpcRegionsByInfra,
                  );
                  const nextRegion = nextRegionOptions.some(
                    (option) => option.value === rpcRegion,
                  )
                    ? rpcRegion
                    : getDefaultRpcRegion(value, rpcRegionsByInfra);

                  onUpdateQuery({ infra: value, region: nextRegion });
                }}
              />
              <FilterSelect
                ariaLabel={t("controls.rpcMethodAriaLabel")}
                label={t("controls.rpcMethodLabel")}
                options={rpcMethodOptions}
                value={rpcMethod}
                onChange={(value) => onUpdateQuery({ method: value })}
              />
            </div>
          </>
        ) : null}
      </div>

      {isRefreshing ||
      (showProviderControls && availableProviders.length > 0) ? (
        <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center md:gap-x-4">
          {isRefreshing ? <RefreshingIndicator /> : null}
          {showProviderControls && availableProviders.length > 0 ? (
            <ProviderControls
              availableProviders={availableProviders}
              selectedProviders={selectedProviders}
              onChange={(nextProviders) =>
                onUpdateQuery({ providers: nextProviders })
              }
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function RefreshingIndicator() {
  const t = useTranslations("dataDashboard");

  return (
    <div
      aria-live="polite"
      className="inline-flex shrink-0 items-center gap-2 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text"
      role="status"
    >
      <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
      <span>{t("loading.refreshing")}</span>
    </div>
  );
}

function TabSwitcher({
  activeTab,
  onChange,
}: {
  activeTab: DashboardTab;
  onChange: (_value: DashboardTab) => void;
}) {
  const t = useTranslations("dataDashboard");
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      block: "nearest",
      inline: "center",
    });
  }, [activeTab]);

  return (
    <div
      aria-label={t("controls.tabsAriaLabel")}
      className="flex shrink-0 items-center"
      role="tablist"
    >
      {tabOptions.map((option) => {
        const Icon = tabIcons[option.value];
        const isActive = option.value === activeTab;

        return (
          <button
            aria-selected={isActive}
            className={cn(
              "group relative flex shrink-0 items-center gap-2 px-3 py-2.5 font-brand-mono text-[12px] leading-none font-bold uppercase tracking-wide transition-colors",
              "focus-visible:outline-none focus-visible:text-nd-high-em-text",
              isActive
                ? "text-nd-high-em-text"
                : "text-nd-mid-em-text/60 hover:text-nd-high-em-text",
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            ref={isActive ? activeTabRef : undefined}
            role="tab"
            type="button"
          >
            <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
            {t(option.labelKey)}
            {isActive ? (
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-nd-high-em-text"
                layoutId="dataTabUnderline"
                transition={tabIndicatorSpring}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function Separator() {
  return (
    <span
      aria-hidden="true"
      className="hidden h-3 w-px shrink-0 bg-nd-border-prominent md:inline-block"
    />
  );
}

function ProviderControls({
  availableProviders,
  onChange,
  selectedProviders,
}: {
  availableProviders: ProviderName[];
  onChange: (_providers: Set<ProviderName>) => void;
  selectedProviders: Set<ProviderName>;
}) {
  const t = useTranslations("dataDashboard");
  const allProvidersSelected = hasAllProvidersSelected(
    selectedProviders,
    availableProviders,
  );

  return (
    <div className="-mx-1 flex items-center gap-x-3 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="shrink-0 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text/70">
        {t("controls.providersLabel")}
      </span>
      {availableProviders.map((provider) => (
        <ProviderToggle
          active={selectedProviders.has(provider)}
          color={getProviderColor(provider)}
          key={provider}
          label={provider}
          onClick={() => onChange(toggleProvider(selectedProviders, provider))}
        />
      ))}
      <button
        className="shrink-0 border border-nd-border-prominent px-2.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text transition-colors hover:bg-nd-border-light/20 hover:text-nd-high-em-text"
        onClick={() =>
          onChange(
            allProvidersSelected
              ? new Set<ProviderName>()
              : new Set(availableProviders),
          )
        }
        type="button"
      >
        {allProvidersSelected ? t("legend.deselectAll") : t("legend.selectAll")}
      </button>
    </div>
  );
}

function InlineControl<T extends string | number>({
  ariaLabel,
  onChange,
  options,
  value,
}: {
  ariaLabel: string;
  onChange: (_value: T) => void;
  options: readonly { label: string; value: T }[];
  value: T;
}) {
  return (
    <div
      aria-label={ariaLabel}
      className="inline-flex shrink-0 items-center gap-1.5"
      role="group"
    >
      {options.map((option) => (
        <button
          aria-pressed={option.value === value}
          className={cn(
            "border px-2.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase transition-colors",
            option.value === value
              ? "border-nd-primary bg-nd-border-light/20 text-nd-high-em-text"
              : "border-nd-border-prominent text-nd-mid-em-text hover:bg-nd-border-light/20 hover:text-nd-high-em-text",
          )}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function FilterSelect<T extends string>({
  ariaLabel,
  label,
  onChange,
  options,
  value,
}: {
  ariaLabel: string;
  label: string;
  onChange: (_value: T) => void;
  options: readonly { label: string; value: T }[];
  value: T;
}) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => onChange(nextValue as T)}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className="h-auto w-auto shrink-0 gap-1.5 rounded-none border-nd-border-prominent bg-transparent px-2.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold text-nd-high-em-text ring-offset-0 transition-colors hover:bg-nd-border-light/20 focus:ring-1 focus:ring-nd-primary focus:ring-offset-0 [&>svg]:h-3.5 [&>svg]:w-3.5"
      >
        <span className="text-nd-mid-em-text/70">{label}</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-none border-nd-border-prominent bg-[#1D1D20] text-nd-high-em-text">
        {options.map((option) => (
          <SelectItem
            className="rounded-none py-1.5 font-brand-mono text-[11px] leading-[1.42] font-bold text-nd-mid-em-text focus:bg-white/10 focus:text-nd-high-em-text data-[state=checked]:text-nd-high-em-text"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ProviderToggle({
  active,
  color,
  label,
  onClick,
}: {
  active: boolean;
  color?: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 px-1.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase transition-colors",
        active
          ? "text-nd-high-em-text"
          : "text-nd-mid-em-text/60 hover:text-nd-high-em-text",
      )}
      onClick={onClick}
      type="button"
    >
      {color ? (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5"
          style={{ backgroundColor: active ? color : `${color}40` }}
        />
      ) : null}
      {label}
    </button>
  );
}
