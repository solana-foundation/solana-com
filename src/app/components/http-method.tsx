import { z } from "zod";
import { parseProps, Block, CodeBlock } from "codehike/blocks";
import { SingleCode } from "@/app/components/code/code";
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

const ParamSchema = Block.extend({
  type: z.string(),
  required: z.optional(z.string()).transform((val) => val != null),
  blocks: z.lazy(() => z.array(ParamSchema)).optional(),
});

const MethodSchema = Block.extend({
  request: CodeBlock.optional(),
  response: CodeBlock.optional(),
  params: Block.extend({
    blocks: z.array(ParamSchema).optional(),
  }),
  result: ParamSchema.optional(),
});

export function HTTPMethod(props: unknown) {
  const method = parseProps(props, MethodSchema);
  return (
    <HoverProvider>
      <div className="flex flex-row gap-2 w-full text-base">
        <div className="w-1/2">
          <h4 className="mt-0 mb-2 font-mono">params</h4>
          <div className="flex flex-col gap-2">
            {method.params?.blocks?.map((param, i) => (
              <Hoverable
                key={i}
                name={param.title}
                className="tw-border border-ch-border p-2 rounded bg-ch-background data-[hovered=true]:border-sky-500/40  transition-colors duration-300"
              >
                <div className="[&>p]:inline">
                  <Pill
                    value={param.type}
                    color="var(--ch-6)"
                    className="mr-1"
                  />
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
          <h4 className="my-2 font-mono">result</h4>
          <Hoverable
            name="result"
            className="tw-border border-ch-border p-2 rounded bg-ch-background data-[hovered=true]:border-sky-500/40  transition-colors duration-300"
          >
            <div className="[&>p]:inline">
              <Pill
                value={method.result?.type}
                color="var(--ch-6)"
                className="mr-1"
              />
              {method.result?.children}
            </div>
            {method.result?.blocks && (
              <div className="flex flex-col gap-2 mt-2">
                {method.result?.blocks.map((block, i) => (
                  <ObjectParam key={i} block={block} />
                ))}
              </div>
            )}
          </Hoverable>
        </div>
        <div
          className="w-1/2 flex flex-col gap-2 sticky h-fit"
          style={{ maxHeight: `calc(100vh - 78px)`, top: `78px` }}
        >
          <CurlBlock codeblock={method.request} />
          <ResponseBlock codeblock={method.response} />
        </div>
      </div>
    </HoverProvider>
  );
}

type ParamBlock = z.infer<typeof ParamSchema>;
function ObjectParam({ block }: { block: ParamBlock }) {
  const isEmpty = !(block.children as any)?.props.children;
  return (
    <Hoverable key={block.title} name={block.title} className="group">
      <Collapsible
        className="tw-border border-ch-border bg-ch-tabs-background rounded group-data-[hovered=true]:border-sky-500/40 transition-colors duration-300"
        disabled={isEmpty}
      >
        <CollapsibleTrigger className="p-2 gap-2 w-full justify-between items-center flex">
          <span className="font-mono">{block.title}</span>
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
        <CollapsibleContent className="p-2 pb-4 prose-no-margin">
          {block.children}
        </CollapsibleContent>
      </Collapsible>
    </Hoverable>
  );
}

const requestHandler: AnnotationHandler = {
  name: "hover",
  Block: HoverBlock,
  Line: ({ annotation: _, ...props }) => {
    const opacity =
      props.lineNumber < 5 || props.lineNumber >= props.totalLines - 1
        ? 0.6
        : 1;
    if (props.lineNumber == 1) {
      return (
        <InnerLine merge={props} style={{ opacity }}>
          <span className="select-none">$</span> {props.children}
        </InnerLine>
      );
    }
    return <InnerLine merge={props} style={{ opacity }} />;
  },
};

const responseHandler: AnnotationHandler = {
  name: "hover",
  Block: HoverBlock,
  Line: ({ annotation: _, ...props }) => {
    const opacity =
      props.lineNumber < 3 || props.lineNumber >= props.totalLines - 1
        ? 0.6
        : 1;
    return <InnerLine merge={props} style={{ opacity }} />;
  },
};

async function ResponseBlock({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, theme);
  const handlers = [mark, responseHandler];
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
      className="has-[[data-block-hovered=true]]:border-sky-500/40 transition-colors duration-300 m-0"
    />
  );
}

async function CurlBlock({ codeblock }: { codeblock: RawCode }) {
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
  const handlers = [mark, requestHandler];
  const prefix = `curl https://api.devnet.solana.com -s -X POST -H "Content-Type: application/json" -d ' \n`;
  const suffix = `\n'`;
  highlighted.tokens.unshift(prefix);
  highlighted.tokens.push(suffix);
  highlighted.annotations.forEach((annotation) => {
    if ("fromLineNumber" in annotation) {
      annotation.fromLineNumber += 1;
      annotation.toLineNumber += 1;
    }
  });
  highlighted.code = prefix + highlighted.code + suffix;

  const codeGroup = {
    options: {},
    title: "Request",
    style: highlighted.style,
    code: highlighted.code,
    icon: <CodeIcon title="Request" lang={"sh"} />,
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
      className="has-[[data-block-hovered=true]]:border-sky-500/40 transition-colors duration-300 m-0"
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
