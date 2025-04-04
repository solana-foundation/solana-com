"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { cn } from "@/app/components/utils";
import { CopyButton } from "@/app/components/code/copy-button";
import React from "react";
import { useStateOrLocalStorage } from "@/hooks/useLocalStorage";
import { CodeGroup } from "@/app/components/code/code-group";

export function MultiCode({
  group,
  className,
}: {
  group: CodeGroup;
  className?: string;
}) {
  const [currentTitle, setCurrentTitle] = useStateOrLocalStorage(
    group.storage,
    group.tabs[0].title,
  );
  const current =
    group.tabs.find((tab) => tab.title === currentTitle) || group.tabs[0];

  const { code } = current;

  return (
    <Tabs
      value={currentTitle}
      onValueChange={setCurrentTitle}
      className={cn(
        "border rounded selection:bg-ch-selection border-ch-border overflow-hidden my-4 relative flex flex-col",
        className,
      )}
    >
      <TabsList
        className={cn(
          "border-b-[1px] border-ch-border bg-ch-tabs-background px-2 py-1 w-full h-9 min-h-9 shrink-0",
          "rounded-none p-0 m-0 justify-start items-stretch !pt-0",
        )}
      >
        {group.tabs.map(({ icon, title }) => (
          <TabsTrigger
            key={title}
            value={title}
            className={cn(
              "rounded-none relative transition-colors duration-200 gap-2 px-3 font-mono",
              "[&[data-state=active]>.absolute]:bg-ch-background", // bottom border
              "border-transparent border-x data-[state=active]:border-x-ch-border first:border-l-0", // x-border
              "border-t data-[state=active]:border-t-ch-active-border", // top border
              "text-ch-tab-inactive-foreground data-[state=active]:text-ch-tab-active-foreground hover:text-ch-tab-active-foreground", // text
              "data-[state=active]:!bg-ch-background",
            )}
          >
            <div className="size-4">{icon}</div>
            <span className="leading-none">{title}</span>
            <div className="absolute h-[1px] top-full left-0 right-0 transition-colors duration-200" />
          </TabsTrigger>
        ))}
        {group.options.copyButton && (
          <div className={cn("ml-auto mr-3 items-center flex")}>
            <CopyButton text={code} />
          </div>
        )}
      </TabsList>
      <TabsContent
        // key={meta}
        value={current.title}
        className="mt-0 contents min-h-0"
      >
        {current.pre}
      </TabsContent>
    </Tabs>
  );
}
