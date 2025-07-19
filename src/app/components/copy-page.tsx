"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon, ChevronDown, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/app/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import MarkDownIcon from "./icons/MarkDownIcon";
import ChatGPTIcon from "./icons/ChatGPTIcon";
import AnthropicIcon from "./icons/AnthropicIcon";

import type { FC } from "react";

type Props = {
  filePath: string;
  url: string;
};

export const CopyPage: FC<Props> = ({ filePath, url }) => {
  const { t } = useTranslation();

  const githubMarkdown = url
    .replace("github", "raw.githubusercontent")
    .replace("blob/", "");

  const slug = filePath.replace("index.mdx", "").replace(".mdx", "");

  const prompt = encodeURIComponent(
    `${t("commands.open-in-ai.read-from")} https://solana.com/docs/${slug}\n ${t("commands.open-in-ai.read-from")}`,
  );

  const chatGPTLink = `https://chat.openai.com/?hints=search&q=${prompt}`;

  const ClaudeLink = `https://claude.ai/new?q=${prompt}`;

  const onClick = useCallback(async () => {
    try {
      const response = await fetch(githubMarkdown);
      if (response.ok) {
        const text = await response.text();
        navigator.clipboard.writeText(text);
      } else {
        toast.error(response.statusText);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [githubMarkdown]);

  return (
    <DropdownMenu>
      {/* copy as plain text, not markdown */}
      <div className="flex items-center">
        <Button
          variant="outline"
          className="flex-1 items-center p-2 bg-popover rounded-r-none"
          onClick={onClick}
        >
          <span>
            <CopyIcon className="mr-2" /> {t("commands.copy-page.action")}
          </span>
        </Button>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="rounded-l-none ring-0 focus:ring-0 focus-visible:ring-0 outline-none focus:outline-none focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0"
          >
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="bg-fd-background prose rounded-md p-2 w-full ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0">
        {/* copy as markdown */}
        <DropdownMenuItem
          className="cursor-pointer focus:outline-none focus:ring-0"
          onClick={onClick}
        >
          <div className="flex items-center w-full">
            <Button variant="ghost" size="icon" disabled>
              <CopyIcon />
            </Button>
            <div className="flex flex-col">
              <span>{t("commands.copy-page.action")}</span>
              <span>{t("commands.copy-page.description")}</span>
            </div>
          </div>
        </DropdownMenuItem>
        {/* link to raw markdown on github */}
        <DropdownMenuItem className="focus:outline-none focus:ring-0">
          <Link
            href={githubMarkdown}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline block w-full"
          >
            <div className="flex items-center w-full">
              <Button variant="ghost" size="icon" disabled>
                <MarkDownIcon />
              </Button>
              <div className="flex flex-col">
                <span>
                  {t("commands.view-as-markdown.action")} <ArrowUpRightIcon />
                </span>
                <span>{t("commands.view-as-markdown.description")}</span>
              </div>
            </div>
          </Link>
        </DropdownMenuItem>
        {/* link with content encoded for ChatGPT */}
        <DropdownMenuItem className="cursor-pointer focus:outline-none focus:ring-0">
          <Link
            href={chatGPTLink}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline block w-full"
          >
            <div className="flex items-center w-full">
              <Button variant="ghost" size="icon" disabled>
                <ChatGPTIcon />
              </Button>
              <div className="flex flex-col">
                <span>
                  {t("commands.open-in-ai.chat-gpt")} <ArrowUpRightIcon />
                </span>
                <span>{t("commands.open-in-ai.ask-about-page")}</span>
              </div>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer focus:outline-none focus:ring-0">
          <Link
            href={ClaudeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline block py-2 w-full"
          >
            <div className="flex items-center w-full">
              <Button variant="ghost" size="icon" disabled>
                <AnthropicIcon className="w-4 h-4" />
              </Button>
              <div className="flex flex-col">
                <span>
                  {t("commands.open-in-ai.claude")} <ArrowUpRightIcon />
                </span>
                <span>{t("commands.open-in-ai.ask-about-page")}</span>
              </div>
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
