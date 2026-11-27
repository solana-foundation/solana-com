"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { trackContentSelection } from "@solana-com/ui-chrome/analytics";
import { SelectionColor } from "@/component-library/selection-color";
import { CopyCommand } from "@/components/shared/copy-command";
import { Tabs } from "@/components/shared/tabs";
import { Link } from "@/utils/Link";
import {
  CONNECTORS,
  DEFAULT_PATH,
  LINKS,
  PATH_IDS,
  PAY_INSTALL_COMMAND,
  PROMPTS,
  STAGE_COLORS,
  getPath,
  type FlowStage,
  type PathId,
} from "@/data/agents";

const FlowScene = dynamic(() => import("@/components/agents/flow-scene"), {
  ssr: false,
  loading: () => null,
});

// LatestNews uses hooks without its own "use client"; re-exporting it from
// this client module lets the server page render it.
export { LatestNews } from "@/components/solutions/latest-news.v2";

const PLACEMENT = "agents";

function track(contentType: string, contentId: string, linkUrl?: string) {
  trackContentSelection({
    appName: "web",
    contentType,
    contentId,
    placement: PLACEMENT,
    linkUrl,
  });
}

export function PageSelectionColor() {
  return (
    <SelectionColor selectionColor="#14F195" selectionTextColor="#000000" />
  );
}

/* Page state: the selected path and prompt drive the tabs and the scene. */

type AgentsState = {
  path: PathId;
  prompt: string | null;
  replay: number;
  selectPath: (path: PathId) => void;
  selectPrompt: (prompt: string, path: PathId) => void;
};

const AgentsContext = createContext<AgentsState | null>(null);

function useAgentsState() {
  const state = useContext(AgentsContext);
  if (!state) throw new Error("useAgentsState needs AgentsStateProvider");
  return state;
}

export function AgentsStateProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<PathId>(DEFAULT_PATH);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [replay, setReplay] = useState(0);

  const selectPath = useCallback((next: PathId) => {
    setPath(next);
    setPrompt(null);
    setReplay((n) => n + 1);
  }, []);

  const selectPrompt = useCallback((next: string, nextPath: PathId) => {
    setPath(nextPath);
    setPrompt(next);
    setReplay((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({ path, prompt, replay, selectPath, selectPrompt }),
    [path, prompt, replay, selectPath, selectPrompt],
  );

  return (
    <AgentsContext.Provider value={value}>{children}</AgentsContext.Provider>
  );
}

/* Hero path tabs. Panels are rendered on the server and passed in. */

export function PathTabs({ panels }: { panels: Record<PathId, ReactNode> }) {
  const t = useTranslations("agents");
  const { path, selectPath } = useAgentsState();

  return (
    <Tabs
      label={t("hero.pathsLabel")}
      selected={PATH_IDS.indexOf(path)}
      onSelect={(index) => {
        const next = PATH_IDS[index]!;
        selectPath(next);
        track("agents_path", next);
      }}
      tablistClassName="flex-wrap !overflow-visible"
      items={PATH_IDS.map((id) => ({
        key: id,
        name: t(`paths.${id}.label`),
        content: panels[id],
      }))}
    />
  );
}

/* Tracked primitives. */

export function TrackedCopyCommand({
  command,
  label,
  contentId,
  contentType = "command",
  prompt,
  wrap,
}: {
  command: string;
  label: string;
  contentId: string;
  contentType?: string;
  prompt?: string | null;
  wrap?: boolean;
}) {
  const t = useTranslations("agents.offering");
  return (
    <CopyCommand
      command={command}
      label={label}
      copyLabel={t("copy")}
      copiedLabel={t("copied")}
      prompt={prompt}
      wrap={wrap}
      onCopy={() => track(contentType, contentId)}
    />
  );
}

export function TrackedLink({
  href,
  contentId,
  className,
  children,
}: {
  href: string;
  contentId: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track("agents_cta", contentId, href)}
    >
      {children}
    </Link>
  );
}

/* Pay.sh connector picker: one panel per supported agent. */

export function ConnectorPicker() {
  const t = useTranslations("agents.connectors");
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <TrackedCopyCommand
          command={PAY_INSTALL_COMMAND}
          label={t("install")}
          contentId="pay_install"
        />
        <p className="m-0 text-sm leading-relaxed text-nd-mid-em-text">
          {t("installNote")}{" "}
          <TrackedLink
            href={`${LINKS.paySource}/releases/latest`}
            contentId="pay_release"
            className="text-white underline decoration-white/40 underline-offset-4 hover:text-nd-highlight-green"
          >
            {t("installLink")}
          </TrackedLink>
        </p>
      </div>
      <Tabs
        label={t("label")}
        items={CONNECTORS.map(({ id, command }) => ({
          key: id,
          name: t(`items.${id}.name`),
          content: (
            <div className="flex flex-col gap-2">
              <TrackedCopyCommand
                command={command}
                label={t("launch", { agent: t(`items.${id}.name`) })}
                contentId={`connector_${id}`}
              />
              <p className="m-0 text-sm leading-relaxed text-nd-mid-em-text">
                {t(`items.${id}.note`)}
              </p>
            </div>
          ),
        }))}
      />
      <p className="m-0 font-brand-mono text-xs leading-relaxed text-nd-mid-em-text">
        {t("sandbox")}
      </p>
    </div>
  );
}

/* Prompt cards: copying or selecting one plays its flow in the scene. */

export function PromptCards() {
  const t = useTranslations("agents");
  const { prompt: activePrompt, selectPrompt } = useAgentsState();

  return (
    <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
      {PROMPTS.map(({ id, path }) => {
        const active = activePrompt === id;
        return (
          <li
            key={id}
            className={`flex min-w-0 flex-col gap-3 rounded-2xl border p-4 transition-colors md:p-5 ${active ? "border-nd-highlight-green/70 bg-white/[0.06]" : "border-nd-border-light bg-white/[0.03]"}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="m-0 font-brand text-xl font-medium tracking-[-0.02em] text-white">
                {t(`prompts.items.${id}.title`)}
              </h3>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => {
                  selectPrompt(id, path);
                  track("agents_prompt_flow", id);
                }}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-nd-border-prominent !bg-transparent px-3 py-1 font-brand-mono text-[11px] uppercase tracking-[0.12em] text-nd-mid-em-text transition-colors hover:border-nd-border-hovered hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nd-highlight-green"
              >
                <span
                  aria-hidden
                  className="size-1.5 rounded-full"
                  style={{
                    backgroundColor: active
                      ? STAGE_COLORS.success
                      : "#ffffff4d",
                  }}
                />
                {t(`paths.${path}.label`)}
                <span className="sr-only">: {t("prompts.show")}</span>
              </button>
            </div>
            <div
              onClickCapture={(event) => {
                if ((event.target as HTMLElement).closest("button")) {
                  selectPrompt(id, path);
                }
              }}
            >
              <TrackedCopyCommand
                command={t(`prompts.items.${id}.text`)}
                label={t("prompts.eyebrow")}
                contentId={id}
                contentType="agents_prompt"
                prompt={null}
                wrap
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* The scene and its accessible overlay. */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Nodes sit at 20% and 80% of the width, matching the WebGL camera fit. */
const NODE_LEFT = ["20%", "80%"] as const;

function StaticFlow({ stages }: { stages: readonly FlowStage[] }) {
  const last = stages[stages.length - 1] ?? "success";
  return (
    <div aria-hidden className="absolute inset-0">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M20 50 Q50 20 80 50"
          fill="none"
          stroke={STAGE_COLORS.request}
          strokeOpacity="0.55"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M80 50 Q50 80 20 50"
          fill="none"
          stroke={STAGE_COLORS[last]}
          strokeOpacity="0.55"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {NODE_LEFT.map((left) => (
        <span
          key={left}
          style={{ left }}
          className="absolute top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/50"
        >
          <span className="size-3 rounded-full bg-white" />
        </span>
      ))}
    </div>
  );
}

export function FlowVisual() {
  const t = useTranslations("agents.scene");
  const tPrompts = useTranslations("agents.prompts");
  const { path, prompt, replay } = useAgentsState();
  const stages = getPath(path).flow;
  const reducedMotion = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [active, setActive] = useState(-1);
  const onUnavailable = useCallback(() => setWebgl(false), []);

  useEffect(() => setWebgl(hasWebGL()), []);
  useEffect(() => setActive(-1), [path, replay]);

  // Without animation, every stage reads as complete.
  const animated = webgl === true && !reducedMotion;
  const from = t(`paths.${path}.from`);
  const to = t(`paths.${path}.to`);

  return (
    <figure
      className="relative m-0 flex aspect-[4/3] min-h-[280px] w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-nd-border-light bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgba(153,69,255,0.16),transparent_70%)] sm:aspect-[16/10] xl:aspect-auto xl:h-full xl:min-h-[520px]"
      aria-label={t("label", { from, to })}
    >
      <div className="relative min-h-0 flex-1">
        {webgl === false && <StaticFlow stages={stages} />}
        {webgl === true && (
          <FlowScene
            stages={stages}
            replayKey={replay}
            still={reducedMotion}
            onStage={setActive}
            onUnavailable={onUnavailable}
          />
        )}
        {[from, to].map((label, index) => (
          <span
            key={index}
            style={{ left: NODE_LEFT[index] }}
            className="pointer-events-none absolute top-1/2 mt-10 max-w-[38%] -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-center font-brand-mono text-[11px] uppercase leading-snug tracking-[0.12em] text-white md:mt-12 md:text-xs"
          >
            {label}
          </span>
        ))}
      </div>
      <figcaption className="relative z-10 flex flex-col gap-3 border-t border-nd-border-light bg-black/60 p-4 backdrop-blur-md md:p-5">
        {prompt && (
          <p className="m-0 text-sm text-white">
            {tPrompts(`items.${prompt}.title`)}
          </p>
        )}
        <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
          {stages.map((stage, index) => {
            const lit = animated ? index <= active : true;
            const current = animated && index === active;
            return (
              <li
                key={stage}
                aria-current={current ? "step" : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-brand-mono text-[11px] uppercase tracking-[0.1em] transition-colors md:text-xs ${current ? "border-white/60 text-white" : lit ? "border-nd-border-prominent text-white" : "border-nd-border-light text-nd-mid-em-text"}`}
              >
                <span
                  aria-hidden
                  className="size-2 rounded-full transition-opacity"
                  style={{
                    backgroundColor: STAGE_COLORS[stage],
                    opacity: lit ? 1 : 0.3,
                  }}
                />
                {t(`stages.${stage}`)}
              </li>
            );
          })}
        </ol>
      </figcaption>
    </figure>
  );
}
