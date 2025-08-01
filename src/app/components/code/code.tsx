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
import { flagsToOptions, theme } from "./code-group";
import { diff } from "./diff";
import { wordWrap } from "./word-wrap";
import { MultiCode } from "./code.client";
import { tooltip } from "./tooltip";
import { tokenTransitions } from "./token-transitions";
import { RunnableLayout } from "./code.runnable";
import { focus } from "./focus";

export async function Code(props: {
  codeblocks: RawCode[];
  flags?: string;
  storage?: string;
  className?: string;
}) {
  const group = await toCodeGroup(props);
  return group.tabs.length === 1 ? (
    <SingleCode group={group} className={props.className} />
  ) : (
    <MultiCode group={group} key={group.storage} className={props.className} />
  );
}

export function SingleCode({
  group,
  className,
}: {
  group: CodeGroup;
  className?: string;
}) {
  const { pre, title, code, icon, lang } = group.tabs[0];
  const isRunnable = group.options.runnable;

  const content = (
    <div
      className={cn(
        "tw-border rounded overflow-hidden relative border-ch-border flex flex-col selection:bg-ch-selection",
        isRunnable ? "h-full" : "my-4",
        className,
      )}
    >
      {title ? (
        <div
          className={cn(
            "border-b-[1px] border-ch-border bg-ch-tabs-background px-3 py-0",
            "w-full h-9 flex items-center justify-between shrink-0",
            "text-ch-tab-inactive-foreground text-sm font-mono",
          )}
        >
          <div className="flex items-center w-full h-5 gap-2">
            <div className="size-4">{icon}</div>
            <span className="leading-none">{title}</span>
            <div className={cn("ml-auto mr-3 items-center flex")}>
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
          className="absolute right-3 my-0 top-2.5 text-ch-tab-inactive-foreground bg-ch-background/90 z-10"
        />
      )}
      {pre}
    </div>
  );

  return isRunnable ? (
    <RunnableLayout code={code} language={lang} className={"my-4"}>
      {content}
    </RunnableLayout>
  ) : (
    content
  );
}

export async function toCodeGroup(props: {
  codeblocks: RawCode[];
  flags?: string;
  storage?: string;
  handlers?: AnnotationHandler[];
}): Promise<CodeGroup> {
  const groupOptions = flagsToOptions(props.flags);
  groupOptions.copyButton = true;

  const tabs = await Promise.all(
    props.codeblocks.map(async (tab) => {
      const { flags, title } = extractFlags(tab);
      const tabOptions = flagsToOptions(flags);
      const options = { ...groupOptions, ...tabOptions };
      // get the user_id from the users cookies

      const highlighted = await highlight(
        { ...tab, lang: tab.lang || "txt" },
        theme,
      );
      const handlers = getHandlers(options);
      if (props.handlers) {
        handlers.push(...props.handlers);
      }
      return {
        options,
        title,
        style: highlighted.style,
        code: highlighted.code,
        icon: <CodeIcon title={title} lang={tab.lang} />,
        lang: tab.lang,
        pre: (
          <Pre
            code={highlighted}
            className="overflow-auto px-0 py-3 m-0 rounded-none !bg-ch-background font-mono selection:bg-ch-selection text-sm max-h-full direction-ltr text-left"
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
    focus,
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
export function extractFlags(codeblock: RawCode) {
  const flags =
    codeblock.meta.split(" ").filter((flag) => flag.startsWith("-"))[0] ?? "";
  const metaWithoutFlags = !flags
    ? codeblock.meta
    : codeblock.meta === flags
      ? ""
      : codeblock.meta.replace(" " + flags, "").trim();
  const title = getTitle(metaWithoutFlags);
  return { title, flags: flags.slice(1) };
}

function getTitle(meta: string) {
  const match = meta.match(/title=(["'])(.*?)\1/);
  return match ? match[2] : null;
}
