import { z } from "zod";
import { parseProps, Block, CodeBlock } from "codehike/blocks";
import { SingleCode, toCodeGroup } from "@/app/components/code/code";
import { cn } from "@/app/components/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Hoverable, HoverBlock, HoverProvider } from "./code/hover.client";
import {
  AnnotationHandler,
  highlight,
  InnerLine,
  Pre,
  RawCode,
} from "codehike/code";
import { theme } from "./code/code-group";
import { CodeIcon } from "./code/code-icon";
import { mark } from "./code/mark";
import { collapse } from "./code/collapse";
import {
  Selection,
  Selectable,
  SelectionProvider,
} from "codehike/utils/selection";
import { tokenTransitions } from "./code/token-transitions";
import { RequestClient } from "./request-client";
import { MultiCode } from "./code/code.client";

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

export function HTTPMethod(props: unknown) {
  const method = parseProps(props, MethodSchema);
  const paramsSection = <ParamsSection params={method.params?.blocks} />;
  const resultHeader = (
    <div className="flex items-center gap-2">
      <h4 className="my-2 font-mono">result</h4>
      <div className="ml-auto flex gap-1">
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
      // eslint-disable-next-line react/jsx-key
      from={method.result?.map((result) => <ResultSection result={result} />)}
    />
  );
  const requestSection = <RequestBlock codeblocks={method.request} />;
  const responseSection = (
    <Selection
      from={method.result?.map((result) => (
        // eslint-disable-next-line react/jsx-key
        <ResponseBlock codeblock={result.response} />
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
        <div className="flex flex-row gap-2 w-full text-base">
          <div className="w-1/2">
            {paramsSection}
            {resultHeader}
            {resultSection}
          </div>
          <div
            className="w-1/2 flex flex-col gap-2 sticky h-fit"
            style={{ maxHeight: `calc(100vh - 80px)`, top: `78px` }}
          >
            {requestSection}
            {responseSection}
          </div>
        </div>
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
            className="tw-border border-ch-border p-2 rounded bg-ch-background data-[hovered=true]:border-sky-500/40  transition-colors duration-300"
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
    <Hoverable key={block.title} name={block.title} className="group">
      <Collapsible
        className="tw-border border-ch-border bg-ch-tabs-background rounded group-data-[hovered=true]:border-sky-500/40 transition-colors duration-300"
        disabled={isEmpty}
      >
        <CollapsibleTrigger className="p-2 gap-2 w-full justify-between items-center flex">
          <span className="font-mono truncate">{block.title}</span>

          <Pill
            className="ml-auto mr-1"
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
    <table className="not-prose bg-fd-card w-full">
      <thead>
        <tr className="text-fd-muted-foreground text-sm">
          <th className="py-2 px-2">Values</th>
          <th className="py-2 px-2">Default</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="pb-3 px-2">
            <span className="flex flex-wrap gap-1">
              {block.values.map((value) => (
                <Pill key={value} value={value} color="var(--ch-2)" />
              ))}
            </span>
          </td>
          <td className="pb-3 px-2">
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
      className="tw-border border-ch-border p-2 rounded bg-ch-background data-[hovered=true]:border-sky-500/40  transition-colors duration-300"
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

async function RequestBlock({ codeblocks }: { codeblocks: RawCode[] }) {
  const [codeblock, ...rest] = codeblocks;

  const highlighted = await highlight(
    {
      ...codeblock,
      value: codeblock.value
        .split("\n")
        .map((line) => "  " + line)
        .join("\n"),
    },
    theme,
  );
  const handlers = [mark, ...collapse, hover, curlHandler];
  const prefix = `curl https://api.devnet.solana.com -s -X \\\n  POST -H "Content-Type: application/json" -d ' \n`;
  const suffix = `\n'`;
  highlighted.tokens.unshift(prefix);
  highlighted.tokens.push(suffix);
  highlighted.annotations.forEach((annotation) => {
    if ("fromLineNumber" in annotation) {
      annotation.fromLineNumber += 2;
      annotation.toLineNumber += 2;
    }
  });
  const json = highlighted.code;
  highlighted.code = prefix + highlighted.code + suffix;

  const curlTab = {
    options: {},
    title: rest.length ? "cURL" : "Request",
    style: highlighted.style,
    code: highlighted.code,
    icon: <CodeIcon title="Request" lang={"sh"} />,
    pre: (
      <>
        <Pre
          code={highlighted}
          className="overflow-auto px-0 py-3 m-0 rounded-none !bg-ch-background font-mono selection:bg-ch-selection text-sm"
          handlers={handlers}
        />
        <RequestClient json={json} />
      </>
    ),
  };

  if (!rest.length) {
    return (
      <SingleCode
        group={{ tabs: [curlTab], options: {} }}
        className="has-[[data-block-hovered=true]]:border-sky-500/40 transition-colors duration-300 m-0 flex-1 min-h-0"
      />
    );
  }

  const group = await toCodeGroup({ codeblocks: rest, handlers: [hover] });
  group.tabs.unshift(curlTab);
  return <MultiCode group={group} className="flex-1 min-h-0 my-0" />;
}

async function ResponseBlock({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, theme);
  const handlers = [mark, tokenTransitions, hover, ...collapse];
  const codeGroup = {
    options: {},
    title: "Response",
    style: highlighted.style,
    code: highlighted.code,
    icon: <CodeIcon title="Response" lang={"json"} />,
    pre: (
      <Pre
        code={highlighted}
        className="overflow-auto px-0 py-3 m-0 rounded-none !bg-ch-background font-mono selection:bg-ch-selection text-sm "
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
      className={cn("px-1 rounded text-sm", className)}
      style={{
        backgroundColor: `rgb(from ${color} r g b / 0.13)`,
        color,
      }}
    >
      {value}
    </span>
  );
}
