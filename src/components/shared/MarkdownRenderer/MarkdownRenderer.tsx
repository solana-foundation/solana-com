import { MDXProvider } from "@mdx-js/react";
import {
  MDXRemote,
  MDXRemoteProps,
  MDXRemoteSerializeResult,
} from "next-mdx-remote";
import { createElement, memo } from "react";
import styled from "styled-components";

import ContentApi from "@/utils/contentApi";
import {
  MarkdownCallout,
  MarkdownEmbed,
  MarkdownLine,
  MarkdownLink,
  MarkdownPre,
  MarkdownImage,
  MarkdownSteps,
  MarkdownTabs,
  MarkdownTab,
  MarkdownAccordion,
  MarkdownAccordionItem,
} from "./components";

/**
 * custom component styles for the rendered markdown content
 */
const StyledMarkdown = styled.div`
  a {
    color: var(--mdx-link-color) !important;
  }
  a:hover {
    text-decoration: underline;
  }

  h1,
  h2,
  h3 {
    margin-top: 2rem;
    margin-bottom: 2rem;

    code {
      color: #fff;
    }
  }

  h4,
  h5,
  h6 {
    margin-top: 2.5rem;
    margin-bottom: 1.5rem;

    @media (min-width: 992px) {
      margin-top: 3.5rem;
    }
  }

  hr {
    margin: 1.5rem 0;
  }

  ul {
    margin-bottom: 1rem;

    li {
      margin-bottom: 0.25rem;
    }
  }

  p,
  details,
  div {
    margin-bottom: 0.8rem;
  }

  /**
   * Inline code elements
  */
  *:not(* pre) > code {
    word-break: normal;
    display: inline-block;
    max-width: 100%;
    color: var(--mdx-text-color);
    border: 1px solid var(--mdx-text-color-2);
    background-color: var(--mdx-bg);
    padding: 0.3rem 0.4rem 0.15rem;
    line-height: 100%;
    border-radius: 0.3rem;
    margin: 0 2px;
    font-size: 16px !important;
    // font-style: italic;
  }
  *:not(* pre) > a code {
    color: var(--mdx-link-color);
    text-decoration: none;
  }

  table {
    color: var(--mdx-text-color);
    margin-bottom: 0.8rem;
    border-radius: 1rem;
    width: 100%;

    th:first-of-type {
      border-top-left-radius: 10px;
    }
    th:last-of-type {
      border-top-right-radius: 10px;
    }
    tr:last-of-type td:first-of-type {
      border-bottom-left-radius: 4px;
    }
    tr:last-of-type td:last-of-type {
      border-bottom-right-radius: 4px;
    }

    th {
      background-color: var(--mdx-bg);
      padding: 0.7rem 0.9rem;
      text-decoration: underline;
      font-size: 18px;
    }

    tr:nth-child(even) {
      background-color: var(--mdx-table-bg-1);
    }
    tr:nth-child(odd) {
      background-color: var(--mdx-table-bg-2);
    }

    td {
      padding: 0.6rem 0.8rem;
      font-size: 18px;

      > code {
        text-wrap: nowrap;
      }
    }
  }

  details {
    max-width: 100%;
    display: block;
    padding: 0.8rem 1rem;
    border-radius: 0.5rem;
    background-color: var(--mdx-details-bg);
    border: 1px solid var(--mdx-details-border);
  }
  details summary {
    font-size: 18px;
  }
  details:not([open]) {
    cursor: pointer;
  }
  details[open] {
    border: 1px solid var(--mdx-link-color);
    background-color: transparent;
  }
  details[open] > * {
    margin-bottom: 0.8rem;
  }

  iframe {
    width: 100%;
    border-radius: 0.5rem;
    border: 1px solid #333 !important;
    margin-bottom: 0.8rem;
  }
`;

// tracker for duplicate headings to enable multiple headings with the same label
// const duplicator = new Map<string, number>();
// todo: Nick - fix this to support multi headings that react multi render does not break...

function createHeading(level) {
  return ({ children }) => {
    let slug = ContentApi.slugify(children);

    // if (!duplicator.has(slug)) {
    //   duplicator.set(slug, 0);
    // } else {
    //   duplicator.set(slug, duplicator.get(slug) + 1);
    // }

    // slug = duplicator.get(slug) > 0 ? `${slug}-${duplicator.get(slug)}` : slug;

    return createElement(
      `h${level}`,
      { id: slug },
      children,
      " ", // note: this spacer is important
      [
        createElement(
          "a",
          {
            href: `#${slug}`,
            key: `link-${slug}`,
            // className: "anchor",
          },
          "#",
        ),
      ],
    );
  };
}

/**
 * Defined formatters and elements to be used for each component type
 *
 * Available MDX components: https://mdxjs.com/table-of-components/
 */

const DEFAULT_COMPONENTS: MDXRemoteProps["components"] = {
  h1: createHeading(2), // map all h1 to h2
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  hr: MarkdownLine,
  a: MarkdownLink,
  img: MarkdownImage,

  /** note: pre contains the code block */
  pre: MarkdownPre,

  /** custom components */
  blockquote: MarkdownCallout as any,
  Callout: MarkdownCallout,
  Embed: MarkdownEmbed,
  Steps: MarkdownSteps,
  Tabs: MarkdownTabs,
  Tab: MarkdownTab,
  Accordion: MarkdownAccordion,
  AccordionItem: MarkdownAccordionItem,
};

type MarkdownRendererProps = {
  /** MDX serialized content */
  source: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  >;
  components?: MDXRemoteProps["components"];
};

export default memo(function MarkdownRenderer({
  source,
  components,
}: MarkdownRendererProps) {
  if (!source) return <></>;

  return (
    <StyledMarkdown>
      <MDXProvider>
        <MDXRemote
          {...source}
          components={
            typeof components !== "undefined"
              ? Object.assign(DEFAULT_COMPONENTS, components)
              : DEFAULT_COMPONENTS
          }
        />
      </MDXProvider>
    </StyledMarkdown>
  );
});
