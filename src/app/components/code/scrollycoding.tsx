import { z } from "zod";
import { Selectable, SelectionProvider } from "codehike/utils/selection";
import { Block, CodeBlock, parseProps } from "codehike/blocks";
import { Code, extractFlags } from "./code";
import { cn } from "@/app/components/utils";
import {
  CodePlaceholderProvider,
  SelectionSticker,
} from "./scrollycoding.client";
import { RawCode } from "codehike/code";

const Schema = Block.extend({
  steps: z.array(
    Block.extend({
      code: z.array(CodeBlock).optional().default([]),
    }),
  ),
});

type Steps = z.infer<typeof Schema>["steps"];

export function ScrollyCoding(props: unknown) {
  const { steps } = parseProps(props, Schema);
  return (
    <div>
      <OneColumnLayout steps={steps} className="lg:hidden" />
      <TwoColumnLayout steps={steps} className="max-lg:hidden wider" />
    </div>
  );
}

function OneColumnLayout(props: { steps: Steps; className?: string }) {
  const { steps, className } = props;
  return (
    <div className={className}>
      {steps.map((step, i) => (
        <OneColumnStep key={i} step={step} />
      ))}
    </div>
  );
}

function OneColumnStep(props: { step: Steps[number] }) {
  const { step } = props;
  const codeblocks = {} as Record<string, React.ReactNode>;
  step.code.forEach((code) => {
    const { title } = extractFlags(code);
    codeblocks[title] = <Code codeblocks={[code]} />;
  });
  return (
    <CodePlaceholderProvider codeblocks={codeblocks}>
      <div>
        <h2 className="mt-8 text-xl">{step.title}</h2>
        <div>{step.children}</div>
      </div>
    </CodePlaceholderProvider>
  );
}

function TwoColumnLayout(props: { steps: Steps; className?: string }) {
  const { steps, className } = props;
  const stickers = getStickers(steps);
  return (
    <SelectionProvider className={cn("flex gap-4", className)}>
      <div className="flex-1 min-w-64 mb-[90vh]">
        {steps.map((step, i) => (
          <Selectable
            key={i}
            index={i}
            selectOn={["click", "scroll"]}
            className="px-5 py-2 mb-24 rounded data-[selected=true]:bg-fd-primary/10 transition-colors duration-300"
          >
            <h2 className="mt-4 text-xl">{step.title}</h2>
            <div>{step.children}</div>
          </Selectable>
        ))}
      </div>
      <div className="bg-card min-w-96 w-1/2">
        <div className="flex-1 top-[112px] xl:top-[78px] sticky max-h-[calc(100vh-118px)] xl:max-h-[calc(100vh-84px)] flex flex-col gap-2">
          <SelectionSticker steps={stickers} />
        </div>
      </div>
    </SelectionProvider>
  );
}

function getStickers(steps: Steps) {
  // First, create intermediate stickers with code and selected file
  const intermediateStickers = steps.map((step) => {
    const codeMap = {} as Record<string, RawCode>;
    let selected: string | undefined;

    step.code.forEach((code, i) => {
      const { title } = extractFlags(code);
      codeMap[title] = code;
      if (i === 0) selected = title;
    });

    return { codes: codeMap, selected };
  });

  // Handle focus annotations between steps
  for (let i = intermediateStickers.length - 2; i >= 0; i--) {
    const current = intermediateStickers[i];
    const next = intermediateStickers[i + 1];
    for (const [title, code] of Object.entries(current.codes)) {
      // if next step doesn't have the same code, add it without focus annotation
      if (!next.codes[title] && code.value.includes("!focus")) {
        next.codes[title] = {
          ...code,
          value: code.value.replace(/^.*!focus.*(\r?\n)/gm, ""),
        };
      }
    }
  }

  // Transform to final stickers with React components
  return intermediateStickers.map(({ codes, selected }) => ({
    selected,
    codeblocks: Object.fromEntries(
      Object.entries(codes).map(([title, code]) => [
        title,
        <Code
          codeblocks={[{ ...code, meta: "" }]}
          flags="ac"
          key={title}
          className="flex-1 min-h-0 m-0"
        />,
      ]),
    ),
  }));
}
