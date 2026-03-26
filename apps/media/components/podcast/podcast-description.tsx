"use client";

import React from "react";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { components } from "@/components/mdx-components";
import type { PodcastShow } from "@/lib/podcast-types";

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function MarkdownStringDescription({ content }: { content: string }) {
  const blocks = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="text-lg text-muted-foreground">
      {blocks.map((block, index) => {
        if (block.split("\n").every((line) => line.trim().startsWith("- "))) {
          const items = block
            .split("\n")
            .map((line) => line.trim().replace(/^- /, "").trim())
            .filter(Boolean);

          return (
            <ul key={index} className="list-disc list-inside mb-4 space-y-1">
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInlineMarkdown(item)}</li>
              ))}
            </ul>
          );
        }

        if (/^---+$/.test(block)) {
          return <hr key={index} className="my-8 border-border" />;
        }

        if (block.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="text-3xl font-bold mt-6 mb-3 text-foreground"
            >
              {block.slice(3)}
            </h2>
          );
        }

        if (block.startsWith("# ")) {
          return (
            <h1
              key={index}
              className="text-4xl font-bold mt-8 mb-4 text-foreground"
            >
              {block.slice(2)}
            </h1>
          );
        }

        return (
          <p key={index} className="mb-4">
            {renderInlineMarkdown(block)}
          </p>
        );
      })}
    </div>
  );
}

interface PodcastDescriptionProps {
  description: PodcastShow["description"];
  className?: string;
}

export function PodcastDescription({
  description,
  className,
}: PodcastDescriptionProps) {
  if (!description) return null;

  const wrapperClass = className || "text-lg text-muted-foreground";

  if (typeof description === "string") {
    return <MarkdownStringDescription content={description} />;
  }

  if (Array.isArray(description)) {
    return (
      <div className={wrapperClass}>
        <DocumentRenderer document={description} renderers={components} />
      </div>
    );
  }

  if (typeof description === "object" && "node" in description) {
    const node = description as { node?: { children?: unknown } };
    const children = node.node?.children;
    if (Array.isArray(children)) {
      return (
        <div className={wrapperClass}>
          <DocumentRenderer document={children} renderers={components} />
        </div>
      );
    }
  }

  if (typeof description === "object" && "children" in description) {
    const node = description as { children?: unknown };
    const children = node.children;
    if (Array.isArray(children)) {
      return (
        <div className={wrapperClass}>
          <DocumentRenderer document={children} renderers={components} />
        </div>
      );
    }
  }

  return null;
}
