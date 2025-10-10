"use client";
import { RepokitTemplate } from "@/lib/repokit";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";

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
  template: RepokitTemplate;
}) {
  const [selected, setSelected] = useState("npm");
  const [isCopied, setIsCopied] = useState(false);
  const template = `${source.owner}/${source.repo}/${path}`;
  const command = getCommand(selected, template);

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
            variant={item === selected ? "default" : "outline"}
            onClick={() => setSelected(item)}
            className="justify-start"
          >
            {item}
          </Button>
        ))}
      </div>
      <div className="relative">
        <pre className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 my-4 pr-12 truncate">
          {command}
        </pre>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-2 -translate-y-1/2"
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
