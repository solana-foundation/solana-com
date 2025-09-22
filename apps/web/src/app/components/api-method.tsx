import { z } from "zod";
import { parseProps, Block, CodeBlock } from "codehike/blocks";
import { SingleCode, toCodeGroup } from "@@/src/app/components/code/code";
import { cn } from "@@/src/app/components/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Hoverable, HoverBlock, HoverProvider } from "./code/hover.client";
import {
  AnnotationHandler,
  BlockAnnotation,
  highlight,
  InnerLine,
  Pre,
  RawCode,
  Token,
} from "codehike/code";
import { CodeGroup, theme } from "./code/code-group";
import { CodeIcon } from "./code/code-icon";
import { mark } from "./code/mark";
import { collapse } from "./code/collapse";
import {
  Selection,
  Selectable,
  SelectionProvider,
} from "codehike/utils/selection";
import { tokenTransitions } from "./code/token-transitions";
import {
  ParamToken,
  RequestClientContent,
  RequestClientProvider,
} from "./request-client";
import { MultiCode } from "./code/code.client";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@@/src/app/components/ui/resizable";

const BaseParamSchema = Block.extend({
  type: z.string(),
  required: z.optional(z.string()).transform((val) => val != null),
  values: z.optional(z.string()).transform((val) => val?.split(/\s+/)),
  default: z.string().optional(),
});
const ParamSchema = BaseParamSchema.extend({
  blocks: z.lazy(() => ParamSchema.array()).optional(),
});

const ResultSchema = ParamSchema.extend({
  response: CodeBlock.optional(),
});

const MethodSchema = Block.extend({
  request: CodeBlock.array(),
  params: Block.extend({
    blocks: z.array(ParamSchema).optional(),
  }),
  result: z.array(ResultSchema),
});

export function APIMethod(props: unknown) {
  const method = parseProps(props, MethodSchema) as {
    params?: { blocks: ParamBlock[] };
    request: RawCode[];
    result: { response: RawCode; title: string }[];
  };
  const paramsSection = <ParamsSection params={method.params?.blocks} />;
  const resultHeader = (
    <div className="flex gap-2 items-center">
      <h4 className="my-2 font-mono">result</h4>
      <div className="flex gap-1 ml-auto">
        {method.result?.map((result, i) => (
          <Selectable
            key={i}
            index={i}
            selectOn={["click"]}
            className="rounded px-2 data-[selected=true]:bg-ch-tabs-background hover:bg-ch-tabs-background cursor-pointer hover:opacity-80 transition-opacity duration-300 font-light"
            aria-label={`Select ${result.title} response`}
          >
            {result.title}
          </Selectable>
        ))}
      </div>
    </div>
  );
  const resultSection = (
    <Selection
      from={method.result?.map((r, index) => (
        <ResultSection key={index} result={r} />
      ))}
    />
  );
  const requestSection = <RequestBlock codeblocks={method.request} />;
  const responseSection = (
    <Selection
      from={method.result?.map((result, index) => (
        <ResponseBlock key={index} codeblock={result.response} />
      ))}
    />
  );
  return (
    <>
      <div className="hidden md:block group">
        <BigLayout
          paramsSection={paramsSection}
          resultHeader={resultHeader}
          resultSection={resultSection}
          requestSection={requestSection}
          responseSection={responseSection}
        />
      </div>
      <div className="md:hidden">
        <SmallLayout
          paramsSection={paramsSection}
          resultHeader={resultHeader}
          resultSection={resultSection}
          requestSection={requestSection}
          responseSection={responseSection}
        />
      </div>
    </>
  );
}

function BigLayout({
  paramsSection,
  resultHeader,
  resultSection,
  requestSection,
  responseSection,
}: {
  paramsSection: React.ReactNode;
  resultHeader: React.ReactNode;
  resultSection: React.ReactNode;
  requestSection: React.ReactNode;
  responseSection: React.ReactNode;
}) {
  return (
    <HoverProvider>
      <SelectionProvider>
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full !overflow-clip text-base"
        >
          <ResizablePanel
            defaultSize={50}
            minSize={30}
            maxSize={70}
            className="min-w-0"
          >
            <div className="flex-1">
              {paramsSection}
              {resultHeader}
              {resultSection}
            </div>
          </ResizablePanel>
          <ResizableHandle
            withHandle
            className="sticky top-0 w-4 max-h-screen bg-transparent dark:bg-transparent"
          />
          <ResizablePanel
            defaultSize={50}
            maxSize={70}
            className="!overflow-visible min-w-0"
          >
            <div className="flex flex-col gap-2">
              {requestSection}
              {responseSection}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SelectionProvider>
    </HoverProvider>
  );
}

function SmallLayout({
  paramsSection,
  resultHeader,
  resultSection,
  requestSection,
  responseSection,
}: {
  paramsSection: React.ReactNode;
  resultHeader: React.ReactNode;
  resultSection: React.ReactNode;
  requestSection: React.ReactNode;
  responseSection: React.ReactNode;
}) {
  return (
    <SelectionProvider className="flex flex-col gap-2 text-base">
      {requestSection}
      {paramsSection}
      {resultHeader}
      {responseSection}
      {resultSection}
    </SelectionProvider>
  );
}

type ParamBlock = z.infer<typeof BaseParamSchema> & {
  blocks?: ParamBlock[];
};
function ParamsSection({ params }: { params: ParamBlock[] }) {
  return (
    <>
      <h4 className="mt-0 mb-2 font-mono">params</h4>
      {!params?.length && <span>None</span>}
      <div className="flex flex-col gap-2">
        {params?.map((param, i) => (
          <Hoverable
            key={i}
            name={param.title}
            className="tw-border border-ch-border p-2 rounded bg-ch-background data-[hovered=true]:border-sky-500/40  transition-colors duration-300 block"
          >
            <div className="[&>p]:inline">
              <Pill value={param.type} color="var(--ch-6)" className="mr-1" />
              <Pill
                value={param.required ? "required" : "optional"}
                color="var(--ch-8)"
                className="mr-1"
              />
              {param.children}
            </div>
            {param.blocks && (
              <div className="flex flex-col gap-2 mt-2">
                {param.blocks.map((block, i) => (
                  <ObjectParam key={i} block={block} />
                ))}
              </div>
            )}
          </Hoverable>
        ))}
      </div>
    </>
  );
}

function ObjectParam({ block }: { block: ParamBlock }) {
  const isEmpty = !(block.children as any)?.props.children;
  return (
    <Hoverable key={block.title} name={block.title} className="block group">
      <Collapsible
        className="tw-border border-ch-border bg-ch-tabs-background rounded group-data-[hovered=true]:border-sky-500/40 transition-colors duration-300"
        disabled={isEmpty}
      >
        <CollapsibleTrigger className="flex gap-2 justify-between items-center p-2 w-full">
          <span className="font-mono truncate">{block.title}</span>

          <Pill
            className="mr-1 ml-auto"
            value={block.type}
            color="var(--ch-6)"
          />
          <ChevronDown
            className={`size-4`}
            style={{ opacity: isEmpty ? 0.3 : 1 }}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          {block.values && <ValuesTable block={block} />}
          <div className="p-2 pb-4 prose-no-margin">{block.children}</div>
        </CollapsibleContent>
      </Collapsible>
    </Hoverable>
  );
}

function ValuesTable({ block }: { block: ParamBlock }) {
  return (
    <table className="w-full not-prose bg-fd-card">
      <thead>
        <tr className="text-sm text-fd-muted-foreground">
          <th className="px-2 py-2">Values</th>
          <th className="px-2 py-2">Default</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-2 pb-3">
            <span className="flex flex-wrap gap-1">
              {block.values.map((value) => (
                <Pill key={value} value={value} color="var(--ch-2)" />
              ))}
            </span>
          </td>
          <td className="px-2 pb-3">
            <span className="flex flex-wrap gap-1">
              {block.default && (
                <Pill value={block.default} color="var(--ch-2)" />
              )}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

type Result = ParamBlock & {
  response?: RawCode;
};
function ResultSection({ result }: { result: Result }) {
  return (
    <Hoverable
      name="result"
      className="tw-border border-ch-border p-2 rounded bg-ch-background data-[hovered=true]:border-sky-500/40 transition-colors duration-300 block"
    >
      <div className="[&>p]:inline">
        <Pill value={result?.type} color="var(--ch-6)" className="mr-1" />
        {result?.children}
      </div>
      {result?.blocks && (
        <div className="flex flex-col gap-2 mt-2">
          {result?.blocks.map((block, i) => (
            <ObjectParam key={i} block={block} />
          ))}
        </div>
      )}
    </Hoverable>
  );
}

const hover: AnnotationHandler = {
  name: "hover",
  Block: HoverBlock,
};

// add $ and > to the start of the lines to make it look like a shell command
const curlHandler: AnnotationHandler = {
  name: "curl",
  Line: ({ annotation: _, ...props }) => {
    if (props.lineNumber == 1) {
      return (
        <InnerLine merge={props}>
          <span className="select-none text-ch-line-number">$</span>{" "}
          {props.children}
        </InnerLine>
      );
    }
    return (
      <InnerLine merge={props}>
        <span className="select-none text-ch-line-number">{">"}</span>{" "}
        {props.children}
      </InnerLine>
    );
  },
};

const paramHandler: AnnotationHandler = {
  name: "param",
  AnnotatedToken: ParamToken,
};

async function getCurlTab(codeblock: RawCode) {
  // highlight the JSON object
  const indentedValue = codeblock.value
    .split("\n")
    .map((line) => "  " + line)
    .join("\n");
  const highlighted = await highlight(
    { ...codeblock, value: indentedValue },
    theme,
  );
  const json = highlighted.code;

  // add any single line hover as a request param option
  const lines = highlighted.code.split(/\r?\n/);
  const params = highlighted.annotations
    .filter(
      (a: BlockAnnotation) =>
        a.name == "hover" && a.fromLineNumber === a.toLineNumber,
    )
    .map((a: BlockAnnotation) => {
      let line = lines[a.fromLineNumber - 1];
      // remove potential trailing commas
      line = line.trim().replace(/,$/, "");
      const param = parseLineToParam(line, a);
      a.data = { name: param.name };
      return param;
    });
  params.forEach((param) => {
    highlighted.annotations.push({
      name: "param",
      query: "",
      fromLineNumber: param.lineNumber,
      toLineNumber: param.lineNumber,
      data: { name: param.name },
    });
  });

  // add the cURL command
  const prefix = [
    `curl `,
    [`https://api.devnet.solana.com`],
    ` -s -X \\\n  POST -H "Content-Type: application/json" -d ' `,
    `\n`,
  ] as Token[];
  const suffix = `\n'`;
  highlighted.code = prefix.join("") + highlighted.code + suffix;
  highlighted.tokens = [...prefix, ...highlighted.tokens, suffix];
  highlighted.annotations.forEach((annotation) => {
    if ("fromLineNumber" in annotation) {
      annotation.fromLineNumber += 2;
      annotation.toLineNumber += 2;
    }
  });

  // add the SERVER param and annotation
  highlighted.annotations.unshift({
    name: "param",
    query: "SERVER",
    fromLineNumber: 1,
    toLineNumber: 1,
    data: { name: "SERVER" },
  });
  params.push({
    name: "SERVER",
    value: "https://api.devnet.solana.com",
    type: "string",
    lineNumber: 1,
  });

  const handlers = [mark, ...collapse, hover, curlHandler, paramHandler];
  return {
    options: {},
    title: "cURL",
    style: highlighted.style,
    code: highlighted.code,
    icon: <CodeIcon title="Request" lang="sh" />,
    lang: "sh",
    pre: (
      <RequestClientProvider params={params} json={json}>
        <Pre
          code={highlighted}
          className="overflow-auto px-0 py-3 m-0 rounded-none !bg-ch-background font-mono text-sm flex-1 shrink-0"
          handlers={handlers}
        />
        <RequestClientContent />
      </RequestClientProvider>
    ),
  };
}

async function RequestBlock({ codeblocks }: { codeblocks: RawCode[] }) {
  const [codeblock, ...rest] = codeblocks;
  const withClient = codeblock.meta.includes("curl");

  let group: CodeGroup | null = null;

  if (withClient) {
    group = await toCodeGroup({ codeblocks: rest, handlers: [hover] });
    const curlTab = await getCurlTab(codeblock);
    group.tabs.unshift(curlTab);
  } else {
    group = await toCodeGroup({ codeblocks, handlers: [hover] });
  }

  if (!rest.length) {
    return (
      <SingleCode
        group={group}
        className="has-[[data-block-hovered=true]]:border-sky-500/40 transition-colors duration-300 m-0 flex-1 min-h-0 shrink-0"
      />
    );
  }

  return <MultiCode group={group} className="flex-1 my-0 min-h-0 shrink-0" />;
}

async function ResponseBlock({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, theme);
  const handlers = [mark, tokenTransitions, hover, ...collapse];
  const codeGroup = {
    options: {},
    lang: "json",
    title: "Response",
    style: highlighted.style,
    code: highlighted.code,
    icon: <CodeIcon title="Response" lang={"json"} />,
    pre: (
      <Pre
        code={highlighted}
        className="overflow-auto px-0 py-3 m-0 rounded-none !bg-ch-background font-mono selection:bg-ch-selection text-sm"
        handlers={handlers}
      />
    ),
  };

  return (
    <SingleCode
      group={{ tabs: [codeGroup], options: {} }}
      className="has-[[data-block-hovered=true]]:border-sky-500/40 transition-colors duration-300 m-0 flex-1 min-h-0 group-has-[[data-playground=true]]:hidden"
    />
  );
}

function Pill({
  value,
  color,
  className,
}: {
  value: string | undefined;
  color: string;
  className?: string;
}) {
  if (!value) return null;
  return (
    <span
      className={cn("px-1 text-sm rounded", className)}
      style={{
        backgroundColor: `rgb(from ${color} r g b / 0.13)`,
        color,
      }}
    >
      {value}
    </span>
  );
}

// turns an annotated line of JSON into a Param
function parseLineToParam(line: string, annotation: BlockAnnotation) {
  let value = null;
  let name = annotation.query;
  try {
    value = JSON.parse(line);
  } catch {
    const obj = JSON.parse(`{${line}}`);
    name = Object.keys(obj)[0];
    value = obj[name];
  }
  return {
    name,
    value,
    type: typeof value,
    lineNumber: annotation.fromLineNumber,
  };
}
