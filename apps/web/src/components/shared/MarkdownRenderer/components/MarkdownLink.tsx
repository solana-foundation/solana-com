import { ComponentProps } from "react";
import NextLink from "next/link";

const contentDirLinkRegex = new RegExp(
  /^\/content\/(\w+)(.*)\/([\w+-]*(.mdx?))/gm,
);

export const MarkdownLink = ({ ref: _ref, ...props }: ComponentProps<"a">) => {
  let href = (props.href!.toString() as string).replace(
    /^(https?:\/\/)?solana.com\//gi,
    "/",
  );

  if (href.startsWith("/") || href.startsWith(".") || href.startsWith("#")) {
    // reformat paths like `/content/article/sub-dir/doc.md`
    href = href.replace(contentDirLinkRegex, "/$1/$3");
    return (
      <NextLink {...props} href={href.replace(/(index)?(.mdx?)$/gi, "")}>
        {props.children}
      </NextLink>
    );
  }

  return <a target="_blank" {...props} />;
};
