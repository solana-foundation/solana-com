import { Pre, RawCode, highlight } from "codehike/code";

import { mark } from "./mark";
import { CodeIcon } from "./code-icon";
import { cn } from "./utils";
import { CopyButton } from "./copy-button";

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(
    { ...codeblock, lang: codeblock.lang || "txt" },
    "github-from-css",
  );

  const title = getTitle(codeblock.meta);

  return (
    <div className="border rounded border-ch-border overflow-hidden my-4 relative">
      {title ? (
        <div
          className={cn(
            "border-b-[1px] border-ch-border bg-ch-tabs-background px-3 py-0",
            "w-full h-9 flex items-center justify-between",
            "text-ch-tab-inactive-foreground text-sm font-mono",
          )}
        >
          <div className="flex items-center gap-2 w-full h-5">
            <div className="size-4">
              <CodeIcon title={title} lang={codeblock.lang} />
            </div>
            <span className="leading-none">{title}</span>
            <div className="ml-auto mr-1 items-center">
              <CopyButton
                text={highlighted.code}
                className="text-ch-tab-inactive-foreground"
              />
            </div>
          </div>
        </div>
      ) : (
        <CopyButton
          text={highlighted.code}
          className="absolute right-3 my-0 top-2.5 text-ch-tab-inactive-foreground bg-ch-background/90"
        />
      )}
      <Pre
        handlers={[mark]}
        style={highlighted.style}
        code={highlighted}
        className="overflow-auto px-0 py-3 m-0 rounded-none !bg-ch-background font-mono selection:bg-ch-selection text-sm"
      />
    </div>
  );
}

function getTitle(meta: string) {
  const match = meta.match(/title=(["'])(.*?)\1/);
  return match ? match[2] : null;
}
