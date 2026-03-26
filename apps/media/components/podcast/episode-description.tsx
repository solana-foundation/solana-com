"use client";

import React from "react";
import DOMPurify from "dompurify";

interface EpisodeDescriptionProps {
  description?: string;
  descriptionHtml?: string;
}

const COLLAPSED_MAX_HEIGHT = 320;
const COLLAPSE_THRESHOLD = 700;

const ALLOWED_TAGS = [
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
];

function sanitizeEpisodeHtml(html: string): string {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href"],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["iframe", "script", "style"],
  });

  const parser = new DOMParser();
  const document = parser.parseFromString(sanitizedHtml, "text/html");

  document.querySelectorAll("a").forEach((anchor) => {
    const href = anchor.getAttribute("href");

    if (!href) {
      anchor.replaceWith(...anchor.childNodes);
      return;
    }

    try {
      const url = new URL(href);
      if (!["http:", "https:"].includes(url.protocol)) {
        anchor.replaceWith(...anchor.childNodes);
        return;
      }

      anchor.setAttribute("href", url.toString());
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    } catch {
      anchor.replaceWith(...anchor.childNodes);
    }
  });

  return document.body.innerHTML;
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
  const sanitizedDescriptionHtml = React.useMemo(
    () => (descriptionHtml ? sanitizeEpisodeHtml(descriptionHtml) : undefined),
    [descriptionHtml],
  );
  const contentLength = descriptionHtml?.length ?? description?.length ?? 0;
  const isCollapsible = contentLength > COLLAPSE_THRESHOLD;

  if (sanitizedDescriptionHtml) {
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
              __html: sanitizedDescriptionHtml,
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
            className="w-fit cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary/80"
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
            className="w-fit cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary/80"
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
