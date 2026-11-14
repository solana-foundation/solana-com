"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { openAskAi } from "@/lib/docs/ask-ai";
import {
  AnthropicIcon,
  ArrowUpRightIcon,
  CheckIcon,
  ChevronIcon,
  CopyIcon,
  MarkdownIcon,
  OpenAiIcon,
  SparkleIcon,
} from "./docs-ui-icons";

/** Interface strings of the docs chrome (developers.docsPage messages). */
export interface DocsUiStrings {
  onThisPage: string;
  copyPage: string;
  copied: string;
  moreActions: string;
  copyPageDesc: string;
  viewMarkdown: string;
  viewMarkdownDesc: string;
  openChatGpt: string;
  openClaude: string;
  askAboutPage: string;
  previous: string;
  next: string;
}

/**
 * Page actions under the page description: "Copy page" (the page's Markdown
 * twin, fetched from `<page>.md`) and a menu with Ask AI (the docs' panel,
 * with this page attached to the question; /developers/docs pages only),
 * Copy page, View as Markdown, Open in ChatGPT and Open in Claude, as one
 * split button. Without JavaScript the menu still opens (<details>) and
 * its links work.
 */

function useCopied(): [boolean, () => void] {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);
  return [copied, () => setCopied(true)];
}

function absolute(path: string) {
  return typeof window === "undefined"
    ? path
    : new URL(path, window.location.origin).toString();
}

export function PageActions({
  markdownUrl,
  strings,
  askAi = false,
}: {
  /** Path of the page's Markdown twin, e.g. /developers/docs/payments.md */
  markdownUrl: string;
  strings: DocsUiStrings;
  /** The page has Ask AI (a /developers/docs page): the menu offers it. */
  askAi?: boolean;
}) {
  const tc = useTranslations("commands");
  const [copied, markCopied] = useCopied();
  const menu = useRef<HTMLDetailsElement>(null);

  const copy = useCallback(async () => {
    const response = await fetch(markdownUrl, {
      headers: { Accept: "text/markdown" },
    });
    const text = await response.text();
    await navigator.clipboard.writeText(text);
    markCopied();
  }, [markdownUrl, markCopied]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const el = menu.current;
      if (el?.open && !el.contains(event.target as Node)) el.open = false;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const prompt = () =>
    `Read ${absolute(markdownUrl)} so I can ask questions about it.`;
  const close = () => {
    if (menu.current) menu.current.open = false;
  };

  return (
    <div id="page-context-menu">
      <button
        id="page-context-menu-button"
        type="button"
        aria-label={strings.copyPage}
        onClick={copy}
      >
        <div className="page-action-label">
          {copied ? (
            <CheckIcon className="page-action-icon" />
          ) : (
            <CopyIcon className="page-action-icon" />
          )}
          <span>{strings.copyPage}</span>
        </div>
      </button>
      <details className="page-action-menu" ref={menu}>
        <summary aria-label={strings.moreActions} aria-haspopup="menu">
          <ChevronIcon className="page-action-chevron" />
        </summary>
        <div className="page-action-list" role="menu">
          {askAi ? (
            <button
              type="button"
              role="menuitem"
              className="page-action-item"
              onClick={() => {
                close();
                openAskAi({ aboutPage: true });
              }}
            >
              <span className="page-action-tile">
                <SparkleIcon className="page-action-item-icon" />
              </span>
              <span className="page-action-text">
                <span className="page-action-title">{tc("askAI")}</span>
                <span className="page-action-desc">{strings.askAboutPage}</span>
              </span>
            </button>
          ) : null}
          <button
            type="button"
            role="menuitem"
            className="page-action-item"
            onClick={() => {
              void copy();
              close();
            }}
          >
            <span className="page-action-tile">
              <CopyIcon className="page-action-item-icon" />
            </span>
            <span className="page-action-text">
              <span className="page-action-title">{strings.copyPage}</span>
              <span className="page-action-desc">{strings.copyPageDesc}</span>
            </span>
          </button>
          <a
            role="menuitem"
            className="page-action-item"
            href={markdownUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            <span className="page-action-tile">
              <MarkdownIcon className="page-action-item-icon" />
            </span>
            <span className="page-action-text">
              <span className="page-action-title">
                {strings.viewMarkdown}
                <ArrowUpRightIcon className="page-action-ext" />
              </span>
              <span className="page-action-desc">
                {strings.viewMarkdownDesc}
              </span>
            </span>
          </a>
          <a
            role="menuitem"
            className="page-action-item"
            href="https://chatgpt.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              event.currentTarget.href = `https://chatgpt.com/?${new URLSearchParams(
                { hints: "search", prompt: prompt() },
              )}`;
              close();
            }}
          >
            <span className="page-action-tile">
              <OpenAiIcon className="page-action-item-icon" />
            </span>
            <span className="page-action-text">
              <span className="page-action-title">
                {strings.openChatGpt}
                <ArrowUpRightIcon className="page-action-ext" />
              </span>
              <span className="page-action-desc">{strings.askAboutPage}</span>
            </span>
          </a>
          <a
            role="menuitem"
            className="page-action-item"
            href="https://claude.ai/new"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              event.currentTarget.href = `https://claude.ai/new?${new URLSearchParams(
                { q: prompt() },
              )}`;
              close();
            }}
          >
            <span className="page-action-tile">
              <AnthropicIcon className="page-action-item-icon" />
            </span>
            <span className="page-action-text">
              <span className="page-action-title">
                {strings.openClaude}
                <ArrowUpRightIcon className="page-action-ext" />
              </span>
              <span className="page-action-desc">{strings.askAboutPage}</span>
            </span>
          </a>
        </div>
      </details>
    </div>
  );
}
