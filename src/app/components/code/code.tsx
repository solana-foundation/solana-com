import { AnnotationHandler, Pre, RawCode, highlight } from "codehike/code";

import { mark } from "./mark";
import { CodeIcon } from "./code-icon";
import { cn } from "@/app/components/utils";
import { CopyButton } from "./copy-button";
import { collapse } from "./collapse";
import { fold } from "./fold";
import { mention } from "./mentions";
import { callout } from "./callout";
import { CodeGroup } from "./code-group";
import { flagsToOptions } from "./code-group";
import { diff } from "./diff";
import { wordWrap } from "./word-wrap";
import { MultiCode } from "./code.client";
import { tooltip } from "./tooltip";
import { tokenTransitions } from "./token-transitions";

const theme = "github-from-css";

export async function Code(props: {
  codeblocks: RawCode[];
  flags?: string;
  storage?: string;
}) {
  const group = await toCodeGroup(props);
  return group.tabs.length === 1 ? (
    <SingleCode group={group} />
  ) : (
    <MultiCode group={group} key={group.storage} />
  );
}

function SingleCode({ group }: { group: CodeGroup }) {
  const { pre, title, code, icon } = group.tabs[0];

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
            <div className="size-4">{icon}</div>
            <span className="leading-none">{title}</span>
            <div className="ml-auto mr-1 items-center">
              <CopyButton
                text={code}
                className="text-ch-tab-inactive-foreground"
              />
            </div>
          </div>
        </div>
      ) : (
        <CopyButton
          text={code}
          className="absolute right-3 my-0 top-2.5 text-ch-tab-inactive-foreground bg-ch-background/90"
        />
      )}
      {pre}
    </div>
  );
}

export async function toCodeGroup(props: {
  codeblocks: RawCode[];
  flags?: string;
  storage?: string;
}): Promise<CodeGroup> {
  const groupOptions = flagsToOptions(props.flags);
  groupOptions.copyButton = true;

  const tabs = await Promise.all(
    props.codeblocks.map(async (tab) => {
      const { flags, title } = extractFlags(tab);
      const tabOptions = flagsToOptions(flags);
      const options = { ...groupOptions, ...tabOptions };
      const highlighted = await highlight(
        { ...tab, lang: tab.lang || "txt" },
        theme,
      );
      const handlers = getHandlers(options);
      return {
        options,
        title,
        style: highlighted.style,
        code: highlighted.code,
        icon: <CodeIcon title={title} lang={tab.lang} />,
        pre: (
          <Pre
            code={highlighted}
            className="overflow-auto px-0 py-3 m-0 rounded-none !bg-ch-background font-mono selection:bg-ch-selection text-sm"
            style={highlighted.style}
            handlers={handlers}
          />
        ),
      };
    }),
  );

  return {
    storage: props.storage,
    options: groupOptions,
    tabs,
  };
}

function getHandlers(options: CodeGroup["options"]) {
  return [
    mark,
    tooltip,
    fold,
    options.animate && tokenTransitions,
    // options.lineNumbers && lineNumbers,
    diff,
    ...collapse,
    options.wordWrap && wordWrap,
    mention,
    callout,
  ].filter(Boolean) as AnnotationHandler[];
}

/**
 * Extracts flags and title from the metadata of a code block.
 *
 * @example
 * ```typescript
 * const codeblock = { meta: "foo.js -abc" };
 * const { title, flags } = extractFlags(codeblock);
 * console.log(title); // "foo.js"
 * console.log(flags); // "abc"
 * ```
 */
function extractFlags(codeblock: RawCode) {
  const flags =
    codeblock.meta.split(" ").filter((flag) => flag.startsWith("-"))[0] ?? "";
  const metaWithoutFlags =
    codeblock.meta === flags
      ? ""
      : codeblock.meta.replace(" " + flags, "").trim();
  const title = getTitle(metaWithoutFlags);
  return { title, flags: flags.slice(1) };
}

function getTitle(meta: string) {
  const match = meta.match(/title=(["'])(.*?)\1/);
  return match ? match[2] : null;
}
