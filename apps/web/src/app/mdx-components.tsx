import defaultMdxComponents from "fumadocs-ui/mdx";
import { ImgHTMLAttributes } from "react";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { MarkdownEmbed } from "@@/src/components/shared/MarkdownRenderer/components/MarkdownEmbed";
import { Code } from "@@/src/app/components/code/code";
import { WithMentions, MentionLink } from "@@/src/app/components/code/mentions";
import { WithNotes } from "@@/src/app/components/code/notes";
import FumaLink, { LinkProps } from "fumadocs-core/link";
import { z } from "zod";
import { Block, CodeBlock } from "codehike/blocks";
import { RawCode } from "codehike/code";
import { NoteTooltip } from "./components/code/notes.tooltip";
import { InlineCode } from "./components/code/inline-code";
import { Terminal } from "./components/code/terminal";
import { Mermaid } from "./components/code/mermaid";
import { Download, Rocket, Coins } from "lucide-react";
import { ScrollyCoding } from "./components/code/scrollycoding";
import { CodePlaceholder } from "./components/code/scrollycoding.client";
import { Tweet } from "./components/tweet";

export const mdxComponents = {
  ...defaultMdxComponents,
  Callout,
  Embed: MarkdownEmbed,
  Steps,
  Step,
  Accordion,
  Accordions,
  Tab,
  Tabs,
  img: Image,
  a: Link,
  WithMentions,
  WithNotes,
  InlineCode,
  Code: DocsKitCode,
  CodeTabs,
  TerminalPicker,
  ScrollyCoding,
  CodePlaceholder,
  Tweet,
  // Icons
  Download,
  Rocket,
  Coins,
};

function DocsKitCode(props: { codeblock: RawCode }) {
  const { codeblock, ...rest } = props;

  if (codeblock.lang == "terminal") {
    return <Terminal codeblocks={[codeblock]} />;
  }

  if (codeblock.lang == "mermaid") {
    return <Mermaid codeblocks={[codeblock]} />;
  }

  return <Code {...rest} codeblocks={[codeblock]} />;
}

function Link(props: LinkProps) {
  if (props.href?.startsWith("mention:")) {
    return <MentionLink {...props} />;
  } else if (props.href?.startsWith("tooltip")) {
    return <NoteTooltip name={props.title}>{props.children}</NoteTooltip>;
  }
  return <FumaLink {...props} />;
}

function Image(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <span className="block">
      <img {...props} className="w-full mb-4 rounded-lg" />
      <span className="block text-sm text-center text-fd-muted-foreground">
        {props.alt}
      </span>
    </span>
  );
}

function CodeTabs(props: unknown) {
  const { data, error } = Block.extend({
    code: z.array(CodeBlock),
    flags: z.string().optional(),
    storage: z.string().optional(),
  }).safeParse(props);

  if (error) {
    throw betterError(error, "CodeTabs");
  }

  const { code, flags, storage } = data;

  return <Code codeblocks={code} flags={flags} storage={storage} />;
}

function TerminalPicker(props: unknown) {
  const { data, error } = Block.extend({
    code: z.array(CodeBlock),
    storage: z.string().optional(),
  }).safeParse(props);

  if (error) {
    throw betterError(error, "TerminalPicker");
  }

  const { code, storage } = data;
  return <Terminal codeblocks={code} storage={storage} />;
}

function betterError(error: z.ZodError, componentName: string) {
  const { issues } = error;
  if (issues.length == 1 && issues[0].path[0] == "code") {
    return new Error(
      `<${componentName}> should contain at least one codeblock marked with \`!!\``,
    );
  } else {
    return error;
  }
}
