"use client";

import {
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
} from "react";
import { useTranslations } from "next-intl";
import { cn } from "../cn";
import {
  matchText,
  modelStateAtStep,
  type VisualConceptModel,
  type VisualLink,
  type VisualNode,
  type VisualStep,
  type VisualStepFlow,
} from "@/lib/docs/ask/generative-ui/schema";
import { toneScope } from "../ui";
import { CommandRow } from "./command-row.client";
import { ModelDiagram, type ModelFocus } from "./concept-model.client";
import {
  bodyText,
  Disclosure,
  focusRing,
  FrameProse,
  signatureLabel,
  VisualFrame,
  VisualLinks,
} from "./frame";
import { CircleCheckIcon, DisclosureIcon } from "./icons";
import { enterItem, RAIL_DRAW_MS, staggerStyle, useEnter } from "./motion";
import { EFFECT_GLYPHS, railColor, stepTone } from "./tones";

/**
 * Which step the reader is looking at: hover wins over keyboard focus, which
 * wins over a step picked by clicking its title (touch has no hover).
 */
type StepPointer = {
  activeId: string | null;
  pinnedId: string | null;
  /** The last pointer to enter a step was a finger. */
  touch: { current: boolean };
  onEnter: (id: string) => void;
  onLeave: () => void;
  onFocus: (id: string) => void;
  onBlur: (event: FocusEvent<HTMLElement>) => void;
  onToggle: (id: string) => void;
};

/** Keyboard focus, not the focus a tap gives a button. */
function focusVisible(element: EventTarget) {
  try {
    return (element as Element).matches(":focus-visible");
  } catch {
    return true;
  }
}

/**
 * Mouse and focus handlers for a step's element in the merged visual. A tap
 * also sends mouseenter and focuses what it hit: neither counts, or tapping
 * Copy inside a step would leave it lit.
 */
function pointerProps(step: VisualStep, pointer: StepPointer | undefined) {
  if (!pointer) return {};
  return {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      pointer.touch.current = event.pointerType === "touch";
    },
    onMouseEnter: () => {
      if (!pointer.touch.current) pointer.onEnter(step.id);
    },
    onMouseLeave: pointer.onLeave,
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (pointer.touch.current && !focusVisible(event.target)) return;
      pointer.onFocus(step.id);
    },
    onBlur: pointer.onBlur,
  };
}

function StepTitle({
  step,
  pointer,
  className,
}: {
  step: VisualStep;
  pointer?: StepPointer;
  className?: string;
}) {
  const t = useTranslations("docsAsk.visuals");
  const title = step.title ?? t("step", { n: step.n });
  const base = cn(
    "text-[14px] font-medium leading-5 text-[var(--sol-text)] [@container_(min-width:42rem)]:text-[15px] [@container_(min-width:42rem)]:leading-6",
    className,
  );
  // A title only does something when the step touches the diagram.
  if (!pointer || (step.touches.length === 0 && step.connects.length === 0)) {
    return <p className={cn(base, "m-0")}>{title}</p>;
  }
  const active = pointer.activeId === step.id;
  return (
    <button
      type="button"
      aria-pressed={pointer.pinnedId === step.id}
      onClick={() => pointer.onToggle(step.id)}
      className={cn(
        base,
        "rounded-sm text-start transition-colors duration-150 motion-reduce:transition-none [@media(hover:hover)]:hover:text-[var(--tone)]",
        active && "text-[var(--tone)]",
        focusRing,
      )}
    >
      {title}
    </button>
  );
}

/**
 * The step's one paragraph: its body with the result as the last sentence,
 * or the result alone; a result the body already says is left out.
 */
function stepParagraph(step: VisualStep) {
  const body = step.body?.trim();
  const result = step.result?.trim();
  if (!result || (body && matchText(body).includes(matchText(result)))) {
    return body;
  }
  if (!body) return result;
  return `${/[.!?…:;]$/.test(body) ? body : `${body}.`} ${result}`;
}

/**
 * Title (drawn by the caller), paragraph, command, then one meta row: the
 * "What changes" toggle and the step's docs links. The changes open under
 * the row, each with a coloured mark for what happens.
 */
function StepDetails({ step }: { step: VisualStep }) {
  const t = useTranslations("docsAsk.visuals");
  const [open, setOpen] = useState(false);
  const listId = useId();
  const changes = step.effects.filter((effect) => effect.label);
  const text = stepParagraph(step);
  return (
    <>
      {text ? (
        <p
          className={cn(
            bodyText,
            "m-0 mt-1 text-[13px] leading-[1.6] [@container_(min-width:42rem)]:text-[14px]",
          )}
        >
          {text}
        </p>
      ) : null}
      {step.command ? (
        <div className="mt-2">
          <CommandRow variant="boxed" command={step.command} />
        </div>
      ) : null}
      {changes.length > 0 || step.links.length > 0 ? (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] leading-5 text-[var(--sol-muted)] [@container_(min-width:42rem)]:text-[13px]">
          {changes.length > 0 ? (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={open ? listId : undefined}
              onClick={() => setOpen((value) => !value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-sm transition-colors duration-150 hover:text-[var(--sol-text)] motion-reduce:transition-none",
                focusRing,
              )}
            >
              <DisclosureIcon
                className={cn(
                  "shrink-0 text-[var(--sol-dim)] transition-transform duration-150 motion-reduce:transition-none",
                  !open && "-rotate-90 group-data-[dir=rtl]/visual:rotate-90",
                )}
              />
              {t("changes")}
            </button>
          ) : null}
          <VisualLinks links={step.links} />
        </div>
      ) : null}
      {open ? (
        <ul
          id={listId}
          className="m-0 mt-1.5 list-none space-y-1 p-0 text-[12px] leading-[1.55] text-[var(--sol-muted)] motion-safe:animate-in motion-safe:fade-in-0 [@container_(min-width:42rem)]:text-[13px]"
        >
          {changes.map((effect, index) => {
            const mark = effect.action ? EFFECT_GLYPHS[effect.action] : null;
            return (
              <li
                key={`${index}-${effect.label}`}
                data-effect={effect.action ?? undefined}
                className="flex gap-2"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-3 shrink-0 text-center font-medium",
                    mark?.className ?? "text-[var(--sol-dim)]",
                  )}
                >
                  {mark?.glyph ?? "•"}
                </span>
                <span className="min-w-0">{effect.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </>
  );
}

/*
 * A numeral takes its step's tone (`stepTone`: the kind of card it acts
 * on), never a colour per position, so a hue means one thing in the whole
 * diagram. Hover only where there is a real hover; focus only from the
 * keyboard.
 */
const circleIdle =
  "border-[var(--tone-line)] bg-[var(--tone-soft)] text-[var(--tone)]";
const circleOn =
  "border-[var(--tone)] bg-[var(--tone)] text-white dark:text-[var(--sol-page)]";
const circleHover =
  "[@media(hover:hover)]:group-hover/step:border-[var(--tone)] [@media(hover:hover)]:group-hover/step:bg-[var(--tone)] [@media(hover:hover)]:group-hover/step:text-white dark:[@media(hover:hover)]:group-hover/step:text-[var(--sol-page)] group-has-[:focus-visible]/step:border-[var(--tone)] group-has-[:focus-visible]/step:bg-[var(--tone)] group-has-[:focus-visible]/step:text-white dark:group-has-[:focus-visible]/step:text-[var(--sol-page)]";

/**
 * The numbered rail: circles in each step's tone that fill while the step
 * is pointed at, joined by a hairline that runs the Solana gradient down
 * the flow and, on a visual's first appearance, draws downward one slice
 * after another.
 */
function StepRail({
  steps,
  nodes,
  pointer,
  staggerFrom = 0,
}: {
  steps: VisualStep[];
  /** The model's cards, which give each step its tone. */
  nodes?: VisualNode[];
  pointer?: StepPointer;
  /** Items already in the entrance sequence (the model's cards). */
  staggerFrom?: number;
}) {
  const enter = useEnter();
  const count = steps.length;
  const segmentMs = count > 1 ? Math.round(RAIL_DRAW_MS / (count - 1)) : 0;
  return (
    <ol className="m-0 list-none px-3.5 py-3.5">
      {steps.map((step, index) => {
        const last = index === count - 1;
        const active = pointer?.activeId === step.id;
        const tone = stepTone(step, nodes);
        const style = {
          "--rail-from": railColor(index, count),
          "--rail-to": railColor(index + 1, count),
          "--rail-ms": `${segmentMs}ms`,
          "--rail-delay": `${index * segmentMs}ms`,
          ...(enter ? staggerStyle(staggerFrom + index) : null),
        } as CSSProperties;
        return (
          <li
            key={step.id}
            data-step={step.id}
            data-active={active || undefined}
            data-tone={tone}
            style={style}
            className={cn(
              "group/step grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3",
              toneScope[tone],
              enter && enterItem,
            )}
            {...pointerProps(step, pointer)}
          >
            <div aria-hidden="true" className="flex flex-col items-center">
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border text-[11px] font-medium leading-none tabular-nums transition-colors duration-150 motion-reduce:transition-none",
                  active ? circleOn : cn(circleIdle, circleHover),
                )}
              >
                {step.n}
              </span>
              {last ? null : (
                <span
                  data-rail=""
                  className={cn(
                    "my-1 w-px flex-1 origin-top bg-[linear-gradient(var(--rail-from),var(--rail-to))] opacity-60 transition-transform dark:opacity-[0.45] ease-linear [transition-delay:var(--rail-delay)] [transition-duration:var(--rail-ms)] motion-reduce:transition-none",
                    enter && "motion-safe:[@starting-style]:scale-y-0",
                  )}
                />
              )}
            </div>
            <div className={cn("min-w-0 pt-0.5", !last && "pb-4")}>
              <StepTitle step={step} pointer={pointer} />
              <StepDetails step={step} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** "Before you start": setup steps as a checklist; folded when long. */
function SetupChecklist({
  steps,
  pointer,
}: {
  steps: VisualStep[];
  pointer?: StepPointer;
}) {
  const t = useTranslations("docsAsk.visuals");
  const list = (
    <ul className="m-0 mt-2 list-none space-y-2 p-0">
      {steps.map((step) => (
        <li
          key={step.id}
          data-step={step.id}
          data-active={pointer?.activeId === step.id || undefined}
          className="flex items-start gap-2"
          {...pointerProps(step, pointer)}
        >
          <CircleCheckIcon className="mt-[3px] shrink-0 text-[var(--sol-dim)]" />
          <div className="min-w-0 flex-1">
            <p className="m-0 text-[13px] leading-5 text-[var(--sol-muted)]">
              {step.title ?? step.body ?? t("step", { n: step.n })}
            </p>
            {step.command ? (
              <div className="mt-1">
                <CommandRow variant="compact" command={step.command} />
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="border-b border-[var(--sol-line)] px-3.5 py-3">
      {steps.length > 2 ? (
        <Disclosure
          summary={`${t("beforeYouStart")} (${steps.length})`}
          summaryClassName={signatureLabel}
        >
          {list}
        </Disclosure>
      ) : (
        <>
          <p className={cn(signatureLabel, "m-0")}>{t("beforeYouStart")}</p>
          {list}
        </>
      )}
    </div>
  );
}

/** "More you can do": optional steps, folded; titles in the steps' tones. */
function OptionalSteps({
  steps,
  nodes,
  pointer,
}: {
  steps: VisualStep[];
  nodes?: VisualNode[];
  pointer?: StepPointer;
}) {
  const t = useTranslations("docsAsk.visuals");
  return (
    <div className="border-t border-[var(--sol-line)] px-3.5 py-3">
      <Disclosure
        summary={`${t("moreYouCanDo")} (${steps.length})`}
        summaryClassName={signatureLabel}
      >
        <ul className="m-0 mt-3 list-none space-y-4 p-0">
          {steps.map((step) => (
            <li
              key={step.id}
              data-step={step.id}
              data-active={pointer?.activeId === step.id || undefined}
              className={toneScope[stepTone(step, nodes)]}
              {...pointerProps(step, pointer)}
            >
              <StepTitle step={step} pointer={pointer} />
              <StepDetails step={step} />
            </li>
          ))}
        </ul>
      </Disclosure>
    </div>
  );
}

/** Links of the model and flow that no step already shows. */
function footerLinks(flow: VisualStepFlow, extra: VisualLink[] = []) {
  const shown = new Set(
    [...flow.setup, ...flow.steps, ...flow.optional].flatMap((step) =>
      step.links.map((link) => link.href),
    ),
  );
  const links: VisualLink[] = [];
  for (const link of [...extra, ...flow.links]) {
    if (shown.has(link.href)) continue;
    shown.add(link.href);
    links.push(link);
  }
  return links;
}

function FlowBody({
  flow,
  nodes,
  links,
  pointer,
  staggerFrom,
}: {
  flow: VisualStepFlow;
  /** The model's cards, when the flow is drawn with them. */
  nodes?: VisualNode[];
  links: VisualLink[];
  pointer?: StepPointer;
  staggerFrom?: number;
}) {
  const t = useTranslations("docsAsk.visuals");
  return (
    <>
      {flow.setup.length > 0 ? (
        <SetupChecklist steps={flow.setup} pointer={pointer} />
      ) : null}
      {flow.steps.length > 0 ? (
        <StepRail
          steps={flow.steps}
          nodes={nodes}
          pointer={pointer}
          staggerFrom={staggerFrom}
        />
      ) : null}
      {flow.optional.length > 0 ? (
        <OptionalSteps steps={flow.optional} nodes={nodes} pointer={pointer} />
      ) : null}
      <VisualLinks
        className="border-t border-[var(--sol-line)] px-3.5 py-2.5"
        label={t("docs")}
        links={links}
      />
    </>
  );
}

/** step_flow on its own. */
export function VisualStepFlowBlock({
  flow,
  prose,
}: {
  flow: VisualStepFlow;
  /** Show the flow's paragraph (the answer has no summary). */
  prose: boolean;
}) {
  const t = useTranslations("docsAsk.visuals");
  return (
    <VisualFrame label={t("steps")} title={flow.title}>
      {prose && flow.body ? <FrameProse text={flow.body} /> : null}
      <FlowBody flow={flow} links={footerLinks(flow)} />
    </VisualFrame>
  );
}

/**
 * concept_model and step_flow together: the diagram on top, the steps
 * below. Pointing at a step (hover, focus, or a click on its title)
 * highlights the parts it touches, dims the rest and shows their fields as
 * that step leaves them. One paragraph at most: the model's, else the
 * flow's.
 */
export function VisualModelFlowBlock({
  model,
  flow,
  prose,
}: {
  model: VisualConceptModel;
  flow: VisualStepFlow;
  prose: boolean;
}) {
  const t = useTranslations("docsAsk.visuals");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const touch = useRef(false);
  const activeId = hoveredId ?? focusedId ?? pinnedId;
  const focus = useMemo((): ModelFocus | null => {
    const step = [...flow.setup, ...flow.steps, ...flow.optional].find(
      (item) => item.id === activeId,
    );
    if (!step) return null;
    return {
      touches: step.touches,
      connects: step.connects,
      state: modelStateAtStep(model, flow, step.id),
    };
  }, [activeId, model, flow]);
  const pointer: StepPointer = {
    activeId,
    pinnedId,
    touch,
    onEnter: setHoveredId,
    onLeave: () => setHoveredId(null),
    onFocus: setFocusedId,
    onBlur: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setFocusedId(null);
      }
    },
    onToggle: (id) => setPinnedId((current) => (current === id ? null : id)),
  };
  const paragraph = prose ? (model.body ?? flow.body) : undefined;
  return (
    <VisualFrame
      label={t("diagram")}
      title={flow.title ?? model.title ?? t("model")}
    >
      {paragraph ? <FrameProse text={paragraph} /> : null}
      <ModelDiagram model={model} focus={focus} />
      <div className="border-t border-[var(--sol-line)]">
        <FlowBody
          flow={flow}
          nodes={model.nodes}
          links={footerLinks(flow, model.links)}
          pointer={pointer}
          staggerFrom={model.nodes.length}
        />
      </div>
    </VisualFrame>
  );
}
