import defaultMdxComponents from "fumadocs-ui/mdx";
import { Pre, CodeBlock } from "fumadocs-ui/components/codeblock";
import NextImage from "next/image";
import type { ImageProps } from "next/image";
import { ImgHTMLAttributes } from "react";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { MarkdownCallout } from "@/components/shared/MarkdownRenderer/components/MarkdownCallout";
import { MarkdownEmbed } from "@/components/shared/MarkdownRenderer/components/MarkdownEmbed";

export const mdxComponents = {
  ...defaultMdxComponents,
  Callout: MarkdownCallout,
  Embed: MarkdownEmbed,
  Steps,
  Step,
  Accordion,
  Accordions,
  Tab,
  Tabs,
  pre: ({ ref: _ref, ...props }) => (
    <CodeBlock {...props} allowCopy>
      <Pre className="max-h-none">{props.children}</Pre>
    </CodeBlock>
  ),
  img: ({ src, alt }) => <Image src={src} alt={alt} />,
};

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
