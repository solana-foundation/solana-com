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
  img: (props: ImgHTMLAttributes<HTMLImageElement>) => <Image {...props} />,
  Code,
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
