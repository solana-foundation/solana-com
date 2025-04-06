"use client";

import { CopyButton } from "./copy-button";
import { Maximize2 } from "lucide-react";
import { MermaidModal } from "./mermaid-modal";
import { MermaidRenderer } from "./mermaid-renderer";
import { RawCode } from "codehike/code";
import { cn } from "@/app/components/utils";
import { useState } from "react";

export function Mermaid(props: { codeblocks: RawCode[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const codeblock = props.codeblocks[0];
  const content = codeblock.value;
  const title = extractTitle(codeblock);

  return (
    <>
      <div className="relative my-4 overflow-hidden border rounded border-ch-border">
        {title ? (
          <div
            className={cn(
              "border-b-[1px] border-ch-border bg-ch-tabs-background px-3 py-0",
              "w-full h-9 flex items-center justify-between",
              "text-ch-tab-inactive-foreground text-sm font-mono",
            )}
          >
            <div className="flex items-center w-full h-5 gap-2">
              <span className="leading-none">{title}</span>
              <div className="flex items-center gap-2 ml-auto mr-1">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-ch-tab-inactive-foreground hover:text-ch-tab-active-foreground focus:outline-none"
                  aria-label="Open in fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <CopyButton
                  text={content}
                  className="text-ch-tab-inactive-foreground"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute right-3 my-0 top-2.5 flex gap-2 text-ch-tab-inactive-foreground bg-ch-background/90">
            <button
              onClick={() => setIsModalOpen(true)}
              className="hover:text-ch-tab-active-foreground focus:outline-none"
              aria-label="Open in fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <CopyButton
              text={content}
              className="text-ch-tab-inactive-foreground"
            />
          </div>
        )}
        <div className="p-4 bg-ch-background">
          <MermaidRenderer content={content} />
        </div>
      </div>

      <MermaidModal
        content={content}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

// Extracts title="..." from the codeblock
function extractTitle(codeblock: RawCode): string | null {
  const meta = codeblock.meta || "";

  const match = meta.match(/title=(["'])(.*?)\1/);
  if (match) {
    return match[2];
  }

  return null;
}
