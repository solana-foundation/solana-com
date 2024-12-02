import defaultMdxComponents from "fumadocs-ui/mdx";
import { Pre, CodeBlock } from "fumadocs-ui/components/codeblock";
import NextImage from "next/image";
import type { ImageProps } from "next/image";
import { ImgHTMLAttributes } from "react";

export const mdxComponents = {
  ...defaultMdxComponents,
  pre: ({ ref: _ref, ...props }) => (
    <CodeBlock {...props} allowCopy>
      <Pre className="max-h-none">{props.children}</Pre>
    </CodeBlock>
  ),
  img: ({ src, alt }) => <Image src={src} alt={alt} />,
};

function Image(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <span>
      <NextImage
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
        {...(props as ImageProps)}
        className="rounded-lg"
      />
      <span className="text-center text-sm text-fd-muted-foreground">
        {props.alt}
      </span>
    </span>
  );
}
