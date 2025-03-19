import { RawCode } from "codehike/code";
import { CopyButton } from "./copy-button";
import { cn } from "@/app/components/utils";
import { MermaidRenderer } from "./mermaid-renderer";

export function Mermaid(props: { codeblocks: RawCode[] }) {
  const codeblock = props.codeblocks[0];
  const content = codeblock.value;
  const title = extractTitle(codeblock);

  return (
    <div className="relative my-4 overflow-hidden border rounded border-ch-border">
      {title ? (
        <div
          className={cn(
            "border-b-[1px] border-ch-border bg-ch-tabs-background px-3 py-0",
            "w-full h-9 flex items-center justify-between",
            "text-ch-tab-inactive-foreground text-sm font-mono",
          )}
        >
          <div className="flex items-center w-full h-5 gap-2">
            <span className="leading-none">{title}</span>
            <div className="items-center ml-auto mr-1">
              <CopyButton
                text={content}
                className="text-ch-tab-inactive-foreground"
              />
            </div>
          </div>
        </div>
      ) : (
        <CopyButton
          text={content}
          className="absolute right-3 my-0 top-2.5 text-ch-tab-inactive-foreground bg-ch-background/90"
        />
      )}
      <div className="p-4 bg-ch-background">
        <MermaidRenderer content={content} />
      </div>
    </div>
  );
}

// Extracts title="..." from the codeblock
function extractTitle(codeblock: RawCode): string | null {
  const meta = codeblock.meta || "";

  const match = meta.match(/title=(["'])(.*?)\1/);
  if (match) {
    return match[2];
  }

  return null;
}
