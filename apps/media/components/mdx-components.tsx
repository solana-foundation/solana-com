import { format } from "date-fns";
import React from "react";
import type { ReactNode, ElementType } from "react";
import Image from "next/image";
import { Video } from "./blocks/video";
import { Mermaid } from "./blocks/mermaid";
import { Tweet } from "react-tweet";
import { Gallery } from "./ui/gallery";
import { Stats } from "./blocks/stats";
import { DocumentRendererProps } from "@keystatic/core/renderer";

// Block types for post body templates
type VideoBlockData = {
  background?: string;
  color?: string;
  url?: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  muted?: boolean;
};

type StatsBlockData = {
  background?: string;
  title?: string;
  description?: string;
  stats?: Array<{
    stat?: string;
    type?: string;
  }>;
};

type GalleryImage = {
  heading?: string;
  body?: string;
  button?: {
    label?: string;
    type?: "default" | "link";
    link?: string;
  };
  size?: "small" | "large" | "skinny";
  image?: {
    src?: string;
    alt?: string;
  };
  square?: boolean;
};

// Keystatic DocumentRenderer renderers for MDX content
// Using 'as any' to work around complex type constraints in DocumentRendererProps
// Custom component blocks are added via the 'component' property
export const components = {
  // Inline components
  inline: {
    // Code inline
    code: ({ children }) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    // Links
    link: ({ href, children }) => (
      <a href={href} className="text-primary hover:underline">
        {children}
      </a>
    ),
  },
  // Block components
  block: {
    // Code blocks with syntax highlighting
    code: ({ children, language }) => {
      // Handle mermaid diagrams
      if (language === "mermaid") {
        return <Mermaid value={children} />;
      }

      return (
        <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto my-4">
          <code className={`language-${language || "plaintext"}`}>
            {children}
          </code>
        </pre>
      );
    },
    // Paragraphs
    paragraph: ({ children }) => <p className="mb-4">{children}</p>,
    // Headings
    heading: ({ level, children }) => {
      const Tag = `h${level}` as ElementType;
      const sizes: Record<number, string> = {
        1: "text-4xl font-bold mt-8 mb-4",
        2: "text-3xl font-bold mt-6 mb-3",
        3: "text-2xl font-semibold mt-5 mb-2",
        4: "text-xl font-semibold mt-4 mb-2",
        5: "text-lg font-medium mt-3 mb-2",
        6: "text-base font-medium mt-3 mb-2",
      };
      return <Tag className={sizes[level] || sizes[2]}>{children}</Tag>;
    },
    // Lists
    list: ({ type, children }) => {
      if (type === "ordered") {
        return (
          <ol className="list-decimal list-inside mb-4 space-y-1">
            {children}
          </ol>
        );
      }
      return (
        <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
      );
    },
    // Blockquotes - handles both standard markdown blockquotes and custom blockquotes with authorName
    blockquote: (props: { children: React.ReactNode; authorName?: string }) => {
      // If authorName is provided, it's a custom blockquote
      if (props.authorName) {
        return (
          <div>
            <blockquote className="border-l-4 border-primary pl-4 my-4 italic">
              {props.children}
              <footer className="mt-2 font-bold">— {props.authorName}</footer>
            </blockquote>
          </div>
        );
      }
      // Standard markdown blockquote
      return (
        <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">
          {props.children}
        </blockquote>
      );
    },
    // Dividers
    divider: () => <hr className="my-8 border-border" />,
    // Images
    image: ({ src, alt }) => {
      if (!src) return null;
      return (
        <span className="block w-full my-6">
          <span className="block relative w-full">
            <Image
              src={src}
              alt={alt || ""}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
            />
          </span>
          {alt && (
            <span className="block text-sm text-muted-foreground mt-2 text-center">
              {alt}
            </span>
          )}
        </span>
      );
    },
    // Tables - Keystatic table renderer receives { head, body }
    table: ({
      head,
      body,
    }: {
      head?: { children: ReactNode; colSpan?: number; rowSpan?: number }[];
      body: { children: ReactNode; colSpan?: number; rowSpan?: number }[][];
    }) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse border border-border">
          {head && (
            <thead className="bg-muted">
              <tr className="border-b border-border">
                {head.map((cell, i) => (
                  <th
                    key={i}
                    className="px-4 py-2 text-left font-semibold border border-border"
                    colSpan={cell.colSpan}
                    rowSpan={cell.rowSpan}
                  >
                    {cell.children}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {body.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 border border-border"
                    colSpan={cell.colSpan}
                    rowSpan={cell.rowSpan}
                  >
                    {cell.children}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    // Custom component renderers for Keystatic component blocks
    // These are used when rendering custom blocks defined in keystatic config
    datetime: (props: { format?: string }) => {
      const dt = new Date();
      switch (props.format) {
        case "iso":
          return <span>{format(dt, "yyyy-MM-dd")}</span>;
        case "utc":
          return <span>{format(dt, "eee, dd MMM yyyy HH:mm:ss OOOO")}</span>;
        case "local":
          return <span>{format(dt, "P")}</span>;
        default:
          return <span>{format(dt, "P")}</span>;
      }
    },

    newslettersignup: (props: {
      children: React.ReactNode;
      placeholder?: string;
      buttonText?: string;
    }) => (
      <div className="bg-card">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div>{props.children}</div>
          <div className="mt-8">
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email-address"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 border border-gray-300 shadow-xs placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:max-w-xs rounded-md"
                placeholder={props.placeholder || "Enter your email"}
              />
              <div className="mt-3 rounded-md shadow-sm sm:mt-0 sm:ml-3 sm:shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center py-3 px-5 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  {props.buttonText || "Notify Me"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    ),

    video: (props: VideoBlockData) => <Video data={props} />,

    tweet: (props: { id: string }) => (
      <div data-theme="dark">
        <Tweet id={props.id} />
      </div>
    ),

    iframe: (props: {
      src: string;
      width?: string;
      height?: string;
      allow?: string;
    }) => (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: props.height || 0,
          paddingBottom: props.height ? 0 : "61.5746%",
        }}
      >
        <iframe
          src={props.src}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          allow={props.allow || "encrypted-media"}
          allowFullScreen
        />
      </div>
    ),

    gallery: (props: { background?: string; images?: GalleryImage[] }) => {
      // Cast to any to avoid type conflicts between Keystatic schema and Gallery component
      return <Gallery {...(props as any)} />;
    },

    stats: (props: StatsBlockData) => {
      const statsData = {
        title: props.title || "",
        description: props.description || "",
        stats: props.stats?.map((stat) => ({
          stat: stat?.stat,
          type: stat?.type,
        })),
        background: props.background || "bg-default",
      };
      return <Stats data={statsData} />;
    },

    footnotes: () => (
      <h2 id="footnotes" className="scroll-mt-20">
        Footnotes
      </h2>
    ),

    sup: (props: { children: React.ReactNode }) => (
      <sup>
        <a href="#footnotes">{props.children}</a>
      </sup>
    ),
  },
} as DocumentRendererProps["renderers"] & {
  block?: Record<string, (props: any) => React.ReactNode>;
};

// Custom component tags used in MDX content (from Keystatic component blocks).
// MDX v3 compiles inline JSX lowercase tags as literal HTML elements, NOT through
// the components map. Only markdown-generated elements (p, h1, img, etc.) go through
// the components prop. To render custom components like <tweet> and <video>, we:
// 1. Capitalize the tags in the MDX source before compilation (preprocessMDX)
// 2. Pass the capitalized components via MDXRemote's components prop
//    (MDX v3 resolves capitalized JSX from props.components via destructuring)
const CUSTOM_COMPONENT_TAGS = [
  "tweet",
  "video",
  "iframe",
  "gallery",
  "stats",
  "blockquote",
  "datetime",
  "newslettersignup",
  "footnotes",
  "sup",
] as const;

/**
 * Pre-processes MDX source to capitalize custom component tags so that
 * MDX v3 compiles them as component references (resolved from scope)
 * rather than literal HTML elements.
 */
export function preprocessMDX(source: string): string {
  let result = source;
  for (const tag of CUSTOM_COMPONENT_TAGS) {
    const capitalized = tag.charAt(0).toUpperCase() + tag.slice(1);
    // Match opening and closing tags: <tag, </tag
    // Followed by whitespace, >, or / to avoid matching partial names
    result = result.replace(
      new RegExp(`<(/?)(${tag})(\\s|>|/)`, "g"),
      (_, slash, _name, after) => `<${slash}${capitalized}${after}`
    );
  }
  return result;
}

// Component implementations for custom MDX blocks.
// Capitalized names are passed via MDXRemote's components prop so MDX v3
// resolves them from props.components during rendering.
const TweetBlock = (props: { id: string }) => (
  <div data-theme="dark">
    <Tweet id={props.id} />
  </div>
);

const VideoBlock = (props: VideoBlockData) => <Video data={props} />;

const IframeBlock = (props: {
  src: string;
  width?: string;
  height?: string;
  allow?: string;
}) => (
  <div
    style={{
      position: "relative",
      width: "100%",
      height: props.height || 0,
      paddingBottom: props.height ? 0 : "61.5746%",
    }}
  >
    <iframe
      src={props.src}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      allow={props.allow || "encrypted-media"}
      allowFullScreen
    />
  </div>
);

const GalleryBlock = (props: {
  background?: string;
  images?: GalleryImage[];
}) => <Gallery {...(props as any)} />;

const StatsBlock = (props: StatsBlockData) => {
  const statsData = {
    title: props.title || "",
    description: props.description || "",
    stats: props.stats?.map((stat: any) => ({
      stat: stat?.stat,
      type: stat?.type,
    })),
    background: props.background || "bg-default",
  };
  return <Stats data={statsData} />;
};

const BlockquoteBlock = (props: {
  children: React.ReactNode;
  authorName?: string;
}) => {
  if (props.authorName) {
    return (
      <div>
        <blockquote className="border-l-4 border-primary pl-4 my-4 italic">
          {props.children}
          <footer className="mt-2 font-bold">— {props.authorName}</footer>
        </blockquote>
      </div>
    );
  }
  return (
    <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">
      {props.children}
    </blockquote>
  );
};

const DatetimeBlock = (props: { format?: string }) => {
  const dt = new Date();
  switch (props.format) {
    case "iso":
      return <span>{format(dt, "yyyy-MM-dd")}</span>;
    case "utc":
      return <span>{format(dt, "eee, dd MMM yyyy HH:mm:ss OOOO")}</span>;
    default:
      return <span>{format(dt, "P")}</span>;
  }
};

const NewslettersignupBlock = (props: {
  children: React.ReactNode;
  placeholder?: string;
  buttonText?: string;
}) => (
  <div className="bg-card">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div>{props.children}</div>
      <div className="mt-8">
        <form className="sm:flex">
          <input
            type="email"
            autoComplete="email"
            required
            className="w-full px-5 py-3 border border-gray-300 shadow-xs placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:max-w-xs rounded-md"
            placeholder={props.placeholder || "Enter your email"}
          />
          <div className="mt-3 rounded-md shadow-sm sm:mt-0 sm:ml-3 sm:shrink-0">
            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-5 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
            >
              {props.buttonText || "Notify Me"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

const FootnotesBlock = () => (
  <h2 id="footnotes" className="scroll-mt-20">
    Footnotes
  </h2>
);

const SupBlock = (props: { children: React.ReactNode }) => (
  <sup>
    <a href="#footnotes">{props.children}</a>
  </sup>
);

// MDX component map for next-mdx-remote rendering.
// Includes both:
// - Capitalized names: for custom inline JSX components (after preprocessMDX capitalizes tags)
//   MDX v3 resolves capitalized JSX from props.components via destructuring
// - Lowercase names: for markdown-generated HTML element overrides (img, blockquote from > syntax)
export const mdxComponents: Record<string, React.ComponentType<any>> = {
  // Capitalized custom components (resolved by MDX v3 for inline JSX)
  Tweet: TweetBlock,
  Video: VideoBlock,
  Iframe: IframeBlock,
  Gallery: GalleryBlock,
  Stats: StatsBlock,
  Blockquote: BlockquoteBlock,
  Datetime: DatetimeBlock,
  Newslettersignup: NewslettersignupBlock,
  Footnotes: FootnotesBlock,
  Sup: SupBlock,
  // Lowercase overrides for markdown-generated elements
  blockquote: BlockquoteBlock,
  img: ({ src, alt }: any) => {
    if (!src) return null;
    return (
      <span className="block w-full my-6">
        <span className="block relative w-full">
          <Image
            src={src}
            alt={alt || ""}
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
          />
        </span>
        {alt && (
          <span className="block text-sm text-muted-foreground mt-2 text-center">
            {alt}
          </span>
        )}
      </span>
    );
  },
};
