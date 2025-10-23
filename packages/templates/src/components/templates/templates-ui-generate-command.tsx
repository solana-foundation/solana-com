"use client";
import { Template } from "../../lib/templates";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
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
            className={
              item === selected
                ? "justify-start bg-purple-500/20 border-purple-500 text-purple-300 hover:bg-purple-500/30"
                : "justify-start"
            }
          >
            {item}
          </Button>
        ))}
      </div>
      <div className="relative">
        <div
          className="rounded-lg my-4 pr-12 overflow-x-auto max-w-full bg-zinc-900 [&>pre]:!bg-zinc-900 [&>pre]:!m-0 [&>pre]:!p-4 [&>pre]:!rounded-lg [&>pre]:overflow-x-auto [&>pre]:max-w-full [&>pre]:text-xs [&_code]:text-xs"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={handleCopy}
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
