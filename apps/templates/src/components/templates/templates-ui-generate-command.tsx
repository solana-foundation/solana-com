"use client";
import { Template } from "../../lib/templates";
import { useEffect, useState } from "react";
import { Button } from "@workspace/ui";
import { Check as CheckIcon } from "@boxicons/react/Check";
import { Copy as CopyIcon } from "@boxicons/react/Copy";
import { highlightCode } from "../../lib/syntax-highlight";

const pms = ["npm", "pnpm", "yarn", "bun"];

function getCommand(pm: string, template: string) {
  switch (pm) {
    case "npm":
      // NPM supports the '@latest' task but `npm create solana-dapp@latest` does not take any parameters (eg, -t ...)
      return `npx -y create-solana-dapp@latest -t ${template}`;
    case "yarn":
      // Yarn only supports the `latest` tag
      return `yarn create solana-dapp -t ${template}`;
    case "bun":
      return `bunx create-solana-dapp@latest -t ${template}`;
    default:
      // All other package managers support the `@latest` tag and best practice is to always use it explicitly
      return `${pm} create solana-dapp@latest -t ${template}`;
  }
}

export function TemplatesUiGenerateCommand({
  template: { source, path },
}: {
  template: Template;
}) {
  const [selected, setSelected] = useState("npm");
  const [isCopied, setIsCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const template = `${source.owner}/${source.repo}/${path}`;
  const command = getCommand(selected, template);

  useEffect(() => {
    highlightCode(command, "bash").then(setHighlightedHtml);
  }, [command]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000); // Reset after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setIsCopied(true);
    });
  };

  return (
    <div className="space-y-2">
      <div className="space-x-2">
        {pms.map((item) => (
          <Button
            key={item}
            variant="outline"
            onClick={() => setSelected(item)}
            aria-pressed={item === selected}
            className={
              item === selected
                ? "justify-start bg-nd-primary border-nd-primary text-nd-on-primary hover:bg-nd-primary-hovered dark:bg-nd-primary dark:hover:bg-nd-primary-hovered"
                : "justify-start border-nd-border-prominent text-nd-mid-em-text hover:bg-nd-border-prominent hover:text-nd-high-em-text dark:bg-transparent dark:hover:bg-nd-border-prominent"
            }
          >
            {item}
          </Button>
        ))}
      </div>
      <div className="relative">
        <div
          className="rounded-lg my-4 pr-12 overflow-x-auto max-w-full bg-black border border-nd-border-light [&>pre]:!bg-black [&>pre]:!m-0 [&>pre]:!p-4 [&>pre]:!rounded-lg [&>pre]:overflow-x-auto [&>pre]:max-w-full [&>pre]:text-xs [&_code]:text-xs"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-nd-mid-em-text hover:text-nd-high-em-text"
          onClick={handleCopy}
          aria-label={isCopied ? "Command copied" : "Copy command"}
        >
          {isCopied ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
