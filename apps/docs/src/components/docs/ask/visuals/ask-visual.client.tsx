"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "../cn";
import {
  normalizeAskVisual,
  type NormalizedVisual,
} from "@/lib/docs/ask/generative-ui/schema";
import type { AskGenerativeUi } from "@solana-com/ui-chrome/ask-solana/api";
import { PALETTE, textDirection } from "../ui";
import { VisualCalloutBlock } from "./callout.client";
import { VisualCommandListBlock } from "./command-list.client";
import { VisualConceptModelBlock } from "./concept-model.client";
import { VisualIntroBlock } from "./intro";
import { EnterContext, enterFrame } from "./motion";
import { VisualModelFlowBlock, VisualStepFlowBlock } from "./step-flow.client";

/** Visuals already on screen once, so a re-mount doesn't replay the entrance. */
const shown = new WeakSet<AskGenerativeUi>();

/**
 * The visual's direction from its first letter (`textDirection`): an
 * English answer reads left to right on an Arabic page. Set as `data-dir`
 * too, for arrows and chevrons to flip with `group-data-[dir=rtl]/visual:`.
 */
function visualDirection(visual: NormalizedVisual): "ltr" | "rtl" {
  const text = [
    visual.intro?.title,
    visual.intro?.body,
    visual.model?.title,
    ...(visual.model?.nodes.map((node) => node.name) ?? []),
    visual.flow?.title,
    ...(visual.flow?.steps.map((step) => step.title ?? step.body) ?? []),
    ...visual.callouts.map((callout) => callout.title ?? callout.body),
    ...visual.commandLists.map((list) => list.title ?? list.body),
  ].join(" ");
  return textDirection(text);
}

/**
 * The visual the agent attached to an answer (`ui_done`), drawn in the
 * docs' own style, in the order the agent sent its blocks. A concept model
 * and a step flow merge into one diagram whose steps highlight the parts
 * they touch. The root is a container query box, so the layout follows the
 * panel's width (docked or full screen), not the viewport's.
 *
 * `summary` is the answer's summary text. When there is one, it is the
 * answer's only lead-in: the intro and the model's and flow's paragraphs
 * are left out. They also wait for the stream to finish, so they don't
 * appear and then vanish.
 */
export function AskVisual({
  ui,
  streaming = false,
  summary,
}: {
  ui: AskGenerativeUi;
  streaming?: boolean;
  summary?: string;
}) {
  const visual = useMemo(() => normalizeAskVisual(ui), [ui]);
  // Animate a visual that arrives with its answer, not a restored one.
  const [enter] = useState(() => streaming && !shown.has(ui));
  useEffect(() => {
    shown.add(ui);
  }, [ui]);
  const { intro, model, flow } = visual;
  const dir = visualDirection(visual);
  const prose = !streaming && !summary?.trim();

  const blocks: ReactNode[] = [];
  let drewModelFlow = false;
  for (const block of visual.order) {
    if (block.type === "intro") {
      if (intro && prose) {
        blocks.push(<VisualIntroBlock key="intro" intro={intro} />);
      }
    } else if (block.type === "callout") {
      blocks.push(
        <VisualCalloutBlock
          key={`callout-${block.index}`}
          callout={visual.callouts[block.index]!}
        />,
      );
    } else if (block.type === "commands") {
      blocks.push(
        <VisualCommandListBlock
          key={`commands-${block.index}`}
          list={visual.commandLists[block.index]!}
        />,
      );
    } else if (model && flow) {
      if (!drewModelFlow) {
        drewModelFlow = true;
        blocks.push(
          <VisualModelFlowBlock
            key="model-flow"
            model={model}
            flow={flow}
            prose={prose}
          />,
        );
      }
    } else if (model) {
      blocks.push(
        <VisualConceptModelBlock key="model" model={model} prose={prose} />,
      );
    } else if (flow) {
      blocks.push(<VisualStepFlowBlock key="flow" flow={flow} prose={prose} />);
    }
  }
  if (blocks.length === 0) return null;
  return (
    <EnterContext.Provider value={enter}>
      <div
        data-ask-visual=""
        data-dir={dir}
        dir={dir}
        className={cn(
          "group/visual [container-type:inline-size] my-4 first:mt-0 last:mb-0",
          // The panel's palette again, for a visual mounted elsewhere.
          PALETTE,
          enter && enterFrame,
        )}
      >
        {blocks}
      </div>
    </EnterContext.Provider>
  );
}
