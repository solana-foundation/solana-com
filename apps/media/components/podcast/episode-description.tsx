"use client";

import React from "react";

interface EpisodeDescriptionProps {
  description?: string;
  descriptionHtml?: string;
}

const COLLAPSED_MAX_HEIGHT = 320;
const COLLAPSE_THRESHOLD = 700;

const ALLOWED_TAGS = new Set([
  "a",
  "br",
  "em",
  "i",
  "li",
  "ol",
  "p",
  "strong",
  "b",
  "u",
  "ul",
]);

function sanitizeEpisodeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/\sstyle\s*=\s*(['"]).*?\1/gi, "")
    .replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (match, tagName, attrs) => {
      const normalizedTag = String(tagName).toLowerCase();

      if (!ALLOWED_TAGS.has(normalizedTag)) {
        return "";
      }

      if (normalizedTag === "a") {
        const hrefMatch = String(attrs).match(/\shref\s*=\s*(['"])(.*?)\1/i);
        const href = hrefMatch?.[2];

        if (!href || !/^https?:\/\//i.test(href)) {
          return normalizedTag === "a" && match.startsWith("</") ? "</a>" : "";
        }

        return match.startsWith("</")
          ? "</a>"
          : `<a href="${href}" target="_blank" rel="noopener noreferrer">`;
      }

      return match.startsWith("</")
        ? `</${normalizedTag}>`
        : `<${normalizedTag}>`;
    });
}

function PlainTextDescription({ description }: { description: string }) {
  const paragraphs = description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function EpisodeDescription({
  description,
  descriptionHtml,
}: EpisodeDescriptionProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const contentLength = descriptionHtml?.length ?? description?.length ?? 0;
  const isCollapsible = contentLength > COLLAPSE_THRESHOLD;

  if (descriptionHtml) {
    return (
      <div className="flex flex-col gap-4">
        <div
          className="relative overflow-hidden"
          style={
            isCollapsible && !isExpanded
              ? { maxHeight: `${COLLAPSED_MAX_HEIGHT}px` }
              : undefined
          }
        >
          <div
            className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: sanitizeEpisodeHtml(descriptionHtml),
            }}
          />
          {isCollapsible && !isExpanded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
          )}
        </div>
        {isCollapsible && (
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            className="w-fit text-sm font-medium text-primary transition-colors hover:text-primary/80"
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    );
  }

  if (description) {
    return (
      <div className="flex flex-col gap-4">
        <div
          className="relative overflow-hidden"
          style={
            isCollapsible && !isExpanded
              ? { maxHeight: `${COLLAPSED_MAX_HEIGHT}px` }
              : undefined
          }
        >
          <PlainTextDescription description={description} />
          {isCollapsible && !isExpanded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
          )}
        </div>
        {isCollapsible && (
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            className="w-fit text-sm font-medium text-primary transition-colors hover:text-primary/80"
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    );
  }

  return null;
}
