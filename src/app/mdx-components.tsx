import defaultMdxComponents from "fumadocs-ui/mdx";
import NextImage from "next/image";
import type { ImageProps } from "next/image";
import { ImgHTMLAttributes } from "react";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { MarkdownEmbed } from "@/components/shared/MarkdownRenderer/components/MarkdownEmbed";
import { Code } from "@/app/components/code/code";
import { WithMentions, MentionLink } from "@/app/components/code/mentions";
import { WithNotes } from "@/app/components/code/notes";
import FumaLink, { LinkProps } from "fumadocs-core/link";
import { z } from "zod";
import { Block, CodeBlock } from "codehike/blocks";
import { RawCode } from "codehike/code";
import { NoteTooltip } from "./components/code/notes.tooltip";
import { InlineCode } from "./components/code/inline-code";
import { Terminal } from "./components/code/terminal";
import { Download, Rocket, Coins } from "lucide-react";

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
  if (typeof props.src === "string" && props.src.endsWith(".svg")) {
    return (
      <span className="block">
        <img {...props} className="rounded-lg mb-4 w-full" />
        <span className="text-center text-sm text-fd-muted-foreground block">
          {props.alt}
        </span>
      </span>
    );
  }
  return (
    <span className="block">
      <NextImage
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
        {...(props as ImageProps)}
        className="rounded-lg mb-4"
      />
      <span className="text-center text-sm text-fd-muted-foreground block">
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
