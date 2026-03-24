import { z } from "zod";
import { parseProps, Block, CodeBlock } from "codehike/blocks";
import { AnnotationHandler } from "codehike/code";
import { isValidElement, ReactNode } from "react";
import { cn } from "@@/src/app/components/utils";
import { SingleCode, toCodeGroup } from "./code/code";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Hoverable, HoverBlock, HoverProvider } from "./code/hover.client";

const BaseFieldSchema = Block.extend({
  type: z.string(),
});
const FieldSchema = BaseFieldSchema.extend({
  blocks: z.lazy(() => FieldSchema.array()).optional(),
});

const Schema = Block.extend({
  code: CodeBlock,
  reference: Block.extend({
    blocks: z.array(FieldSchema).optional(),
  }),
});

type FieldBlock = z.infer<typeof BaseFieldSchema> & {
  blocks?: FieldBlock[];
};

const hover: AnnotationHandler = {
  name: "hover",
  Block: HoverBlock,
};

export async function CodeReference(props: unknown) {
  const { code, reference } = parseProps(props, Schema) as z.infer<
    typeof Schema
  >;

  const group = await toCodeGroup({
    codeblocks: [code],
    handlers: [hover],
  });

  return (
    <HoverProvider>
      <div
        className={cn(
          "flex flex-col gap-4 md:flex-row my-4",
          "[&>*]:min-w-0 [&>*]:flex-1",
        )}
      >
        <div className="flex flex-col">
          <SingleCode
            group={group}
            className="flex-1 min-h-0 shrink-0 has-[[data-block-hovered=true]]:border-sky-500/40 transition-colors duration-300 m-0"
          />
        </div>
        <div
          className={cn(
            "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
            "md:sticky top-[112px] xl:top-[78px] md:self-start",
          )}
        >
          <FieldsSection fields={reference.blocks} />
        </div>
      </div>
    </HoverProvider>
  );
}

function FieldsSection({
  fields,
  prefix = "",
}: {
  fields?: FieldBlock[];
  prefix?: string;
}) {
  if (!fields?.length) return null;
  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, i) => {
        const path = prefix ? `${prefix}.${field.title}` : field.title;
        return (
          <Hoverable
            key={i}
            name={path}
            className="tw-border border-ch-border p-2 rounded bg-ch-background data-[hovered=true]:border-sky-500/40 transition-colors duration-300 block"
          >
            <div className="flex items-center gap-1">
              <span className="font-mono font-bold truncate text-sm">
                {field.title}
              </span>
              <div className="flex gap-1 ml-auto">
                <Pill value={field.type} color="var(--ch-6)" />
              </div>
            </div>
            <div className="mt-2 [&>p]:mt-0 [&>p]:mb-0 prose-no-margin">
              {field.children}
            </div>
            {field.blocks && (
              <div className="flex flex-col gap-2 mt-2">
                {field.blocks.map((block, i) => (
                  <ObjectField key={i} block={block} prefix={path} />
                ))}
              </div>
            )}
          </Hoverable>
        );
      })}
    </div>
  );
}

function ObjectField({ block, prefix }: { block: FieldBlock; prefix: string }) {
  const path = `${prefix}.${block.title}`;
  const isEmpty =
    !hasRenderableChildren(block.children) && !block.blocks?.length;
  return (
    <Hoverable key={block.title} name={path} className="block group">
      <Collapsible
        className="tw-border border-ch-border bg-ch-tabs-background rounded group-data-[hovered=true]:border-sky-500/40 transition-colors duration-300"
        disabled={isEmpty}
      >
        <CollapsibleTrigger className="flex gap-2 justify-between items-center p-2 w-full">
          <span className="font-mono text-sm truncate">{block.title}</span>
          <Pill
            className="mr-1 ml-auto"
            value={block.type}
            color="var(--ch-6)"
          />
          <ChevronDown
            className="size-4"
            style={{ opacity: isEmpty ? 0.3 : 1 }}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-2 pb-4 prose-no-margin">{block.children}</div>
          {block.blocks && (
            <div className="flex flex-col gap-2 p-2 pt-0">
              {block.blocks.map((child, i) => (
                <ObjectField key={i} block={child} prefix={path} />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Hoverable>
  );
}

function hasRenderableChildren(children: ReactNode): boolean {
  if (children == null || typeof children === "boolean") return false;
  if (typeof children === "string") return children.trim().length > 0;
  if (typeof children === "number") return true;
  if (Array.isArray(children)) {
    return children.some((child) => hasRenderableChildren(child));
  }
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return hasRenderableChildren(children.props.children);
  }
  return true;
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
