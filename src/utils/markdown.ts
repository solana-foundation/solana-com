import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

import rehypePrettyCode, {
  Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";
import { transformerNotationDiff } from "@shikijs/transformers";
import darkTheme from "shiki/themes/github-dark-dimmed.mjs";
import lightTheme from "shiki/themes/github-light.mjs";
// import codeTheme from "shiki/themes/rose-pine-moon.mjs";

// import codeTheme from "shiki/themes/andromeeda.mjs";
// import rehypeKatex from "rehype-katex";
// import rehypeSanitize from "rehype-sanitize";
// import remarkMath from "remark-math";

/**
 * Serialize markdown and mdx content using the same data standard
 */
export async function serializeMarkdown(
  content: string = "",
  docKey: string = "not provided",
) {
  try {
    // serialize the content via mdx
    return await serialize(content || "", {
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          // remarkMath,
        ],
        // @ts-ignore
        rehypePlugins: rehypePluginConfig,
      },
    });
  } catch (err) {
    console.error("[serializeMarkdown]", docKey);
    console.error(err);
    return await serialize(
      "There was an unknown error while processing the markdown content. \n\n" +
        `If this error persists, please [open an issue here](https://github.com/solana-foundation/developer-content/issues/new?title=${encodeURI(
          `[Render Error]: ${docKey}`,
        )}).`,
    );
  }
}

const CODE_BLOCK_FILENAME_REGEX = /(name|file|filename)="?([^"\s]*)"?/;
// const CODE_BLOCK_SHOW_LINE_NUMBERS_REGEX = /showLineNumbers=?(true|false)?/;

function visit(node: any, tagNames: any, handler: any) {
  if (tagNames.includes(node.tagName)) {
    handler(node);
    return;
  }
  if ("children" in node) {
    for (const n of node.children) {
      visit(n, tagNames, handler);
    }
  }
}

export type ParseMetadataProps = {
  defaultShowCopyCode?: boolean;
};

const parseMetadata =
  ({ defaultShowCopyCode }: ParseMetadataProps) =>
  (tree: any) => {
    visit(tree, ["pre"], (preElem: any) => {
      const [codeElem] = preElem.children;
      const meta: string | undefined = codeElem.data?.meta;

      if (meta) {
        preElem.__filename = meta.match(CODE_BLOCK_FILENAME_REGEX)?.[2];
        // preElem.__showLineNumbers =
        //   meta.match(CODE_BLOCK_SHOW_LINE_NUMBERS_REGEX)?.[1] != "false";

        preElem.__showCopyCode = meta
          ? (defaultShowCopyCode && !/( |^)copy=false($| )/.test(meta)) ||
            /( |^)copy($| )/.test(meta)
          : defaultShowCopyCode;
      }
    });
  };

const attachMetadata = () => (tree: any) => {
  visit(tree, ["div", "pre", "figure"], (node: any) => {
    if (
      "data-rehype-pretty-code-fragment" in node.properties ||
      "data-rehype-pretty-code-figure" in node.properties
    ) {
      // remove <figure data-rehype-pretty-code-fragment /> element that wraps <pre /> element
      // because we'll wrap with our own <div />
      Object.assign(node, node.children[0]);
    }

    node.properties.filename = node.__filename;
    node.properties.showLineNumbers = node.__showLineNumbers;
    // node.properties.showCopyCode = node.__showCopyCode;
  });
};

/**
 *
 */
export const rehypePluginConfig: import("unified").PluggableList = [
  // always run `parseMetadata` first to expose the custom metadata
  [parseMetadata, { defaultShowCopyCode: true } as ParseMetadataProps],

  [
    // @ts-ignore
    rehypePrettyCode,
    {
      // filterMetaString: (string) => string.replace(/filename="[^"]*"/, ""),
      keepBackground: true,
      defaultLang: {
        block: "text",
      },
      theme: {
        dark: darkTheme,
        light: lightTheme,
      },
      transformers: [transformerNotationDiff()],
    } as RehypePrettyCodeOptions,
    // rehypeSanitize,
    // @ts-ignore - katex...
    // rehypeKatex,
  ],

  // always run `attachMetadata` to finally mutate the nodes,
  // making the metadata accessible via react components
  attachMetadata,
];
