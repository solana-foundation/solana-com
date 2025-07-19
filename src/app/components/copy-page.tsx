"use client";

import Link from "next/link";
import { ArrowUpRightIcon, ChevronDown, CopyIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/app/components/ui/dropdown-menu";
import { Button } from "./ui/button";

export const CopyPage = ({
  filePath,
  href,
}: {
  filePath: string;
  href: string;
}) => {
  return (
    <DropdownMenu>
      {/* copy as plain text, not markdown */}
      <div className="flex items-center">
        <Button
          variant="outline"
          className="flex-1 items-center p-2 bg-popover rounded-r-none"
          onClick={async () => {
            {
              /* we fetch from client, to avoid server-side costs */
            }
            const response = await fetch(
              href
                .replace("github", "raw.githubusercontent")
                .replace("blob/", ""),
            );
            if (response.ok) {
              const text = await response.text();
              console.log(text);
              navigator.clipboard.writeText(text);
            } else {
              console.log("error getting file");
            }
          }}
        >
          <span>
            <CopyIcon className="mr-2" /> Copy page
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
          onClick={async () => {
            {
              /* we fetch from client, to avoid server-side costs */
            }
            const response = await fetch(
              href
                .replace("github", "raw.githubusercontent")
                .replace("blob/", ""),
            );
            if (response.ok) {
              const text = await response.text();
              console.log(text);
              navigator.clipboard.writeText(text);
            } else {
              console.log("error getting file");
            }
          }}
        >
          <div className="flex items-center w-full">
            <Button variant="ghost" size="icon" disabled>
              <CopyIcon />
            </Button>
            <div className="flex flex-col">
              <span>Copy page</span>
              <span>Copy the page as MarkDown for LLMs</span>
            </div>
          </div>
        </DropdownMenuItem>
        {/* link to raw markdown on github */}
        <DropdownMenuItem className="focus:outline-none focus:ring-0">
          <Link
            href={href
              .replace("github", "raw.githubusercontent")
              .replace("blob/", "")}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline block w-full"
          >
            <div className="flex items-center w-full">
              <Button variant="ghost" size="icon" disabled>
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.269 19.385H1.731a1.73 1.73 0 0 1-1.73-1.73V6.345a1.73 1.73 0 0 1 1.73-1.73h20.538a1.73 1.73 0 0 1 1.73 1.73v11.308a1.73 1.73 0 0 1-1.73 1.731zm-16.5-3.462v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.461v7.847zM21.231 12h-2.308V8.077h-2.307V12h-2.308l3.461 4.039z" />
                </svg>
              </Button>
              <div className="flex flex-col">
                <span>
                  View as MarkDown <ArrowUpRightIcon />
                </span>
                <span>View this page as plain text</span>
              </div>
            </div>
          </Link>
        </DropdownMenuItem>
        {/* link with content encoded for ChatGPT */}
        <DropdownMenuItem className="cursor-pointer focus:outline-none focus:ring-0">
          <Link
            href={`https://chat.openai.com/?hints=search&q=${encodeURIComponent(
              `read from https://solana.com/docs/${filePath.replace("index.mdx", "").replace(".mdx", "")}\n so I can ask questions about it.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline block w-full"
          >
            <div className="flex items-center w-full">
              <Button variant="ghost" size="icon" disabled>
                <svg
                  fill="currentColor"
                  fillRule="evenodd"
                  height="1em"
                  viewBox="0 0 24 24"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 shrink-0"
                >
                  <title>OpenAI</title>
                  <path d="M21.55 10.004a5.416 5.416 0 00-.478-4.501c-1.217-2.09-3.662-3.166-6.05-2.66A5.59 5.59 0 0010.831 1C8.39.995 6.224 2.546 5.473 4.838A5.553 5.553 0 001.76 7.496a5.487 5.487 0 00.691 6.5 5.416 5.416 0 00.477 4.502c1.217 2.09 3.662 3.165 6.05 2.66A5.586 5.586 0 0013.168 23c2.443.006 4.61-1.546 5.361-3.84a5.553 5.553 0 003.715-2.66 5.488 5.488 0 00-.693-6.497v.001zm-8.381 11.558a4.199 4.199 0 01-2.675-.954c.034-.018.093-.05.132-.074l4.44-2.53a.71.71 0 00.364-.623v-6.176l1.877 1.069c.02.01.033.029.036.05v5.115c-.003 2.274-1.87 4.118-4.174 4.123zM4.192 17.78a4.059 4.059 0 01-.498-2.763c.032.02.09.055.131.078l4.44 2.53c.225.13.504.13.73 0l5.42-3.088v2.138a.068.068 0 01-.027.057L9.9 19.288c-1.999 1.136-4.552.46-5.707-1.51h-.001zM3.023 8.216A4.15 4.15 0 015.198 6.41l-.002.151v5.06a.711.711 0 00.364.624l5.42 3.087-1.876 1.07a.067.067 0 01-.063.005l-4.489-2.559c-1.995-1.14-2.679-3.658-1.53-5.63h.001zm15.417 3.54l-5.42-3.088L14.896 7.6a.067.067 0 01.063-.006l4.489 2.557c1.998 1.14 2.683 3.662 1.529 5.633a4.163 4.163 0 01-2.174 1.807V12.38a.71.71 0 00-.363-.623zm1.867-2.773a6.04 6.04 0 00-.132-.078l-4.44-2.53a.731.731 0 00-.729 0l-5.42 3.088V7.325a.068.068 0 01.027-.057L14.1 4.713c2-1.137 4.555-.46 5.707 1.513.487.833.664 1.809.499 2.757h.001zm-11.741 3.81l-1.877-1.068a.065.065 0 01-.036-.051V6.559c.001-2.277 1.873-4.122 4.181-4.12.976 0 1.92.338 2.671.954-.034.018-.092.05-.131.073l-4.44 2.53a.71.71 0 00-.365.623l-.003 6.173v.002zm1.02-2.168L12 9.25l2.414 1.375v2.75L12 14.75l-2.415-1.375v-2.75z"></path>
                </svg>
              </Button>
              <div className="flex flex-col">
                <span>
                  Open in ChatGPT <ArrowUpRightIcon />
                </span>
                <span>Ask questions about this page</span>
              </div>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer focus:outline-none focus:ring-0">
          <Link
            href={`https://claude.ai/new?q=${encodeURIComponent(
              `read from https://solana.com/docs/${filePath.replace("index.mdx", "").replace(".mdx", "")}\n so I can ask questions about it.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline block py-2 w-full"
          >
            <div className="flex items-center w-full">
              <Button variant="ghost" size="icon" disabled>
                <svg
                  fill="currentColor"
                  fillRule="evenodd"
                  height="1em"
                  viewBox="0 0 24 24"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 shrink-0"
                >
                  <title>Anthropic</title>
                  <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z"></path>
                </svg>
              </Button>
              <div className="flex flex-col">
                <span>
                  Open in Claude <ArrowUpRightIcon />
                </span>
                <span>Ask questions about this page</span>
              </div>
            </div>
          </Link>
        </DropdownMenuItem>
        {/*<DropdownMenuArrow />*/}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
