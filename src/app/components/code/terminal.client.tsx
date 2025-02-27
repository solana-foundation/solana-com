"use client";
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";
import { TerminalIcon } from "lucide-react";
import { useStateOrLocalStorage } from "@/hooks/useLocalStorage";
import React from "react";
import { cn } from "@/app/components/utils";

export function TerminalClient({
  tabs,
  storeKey,
}: {
  storeKey?: string;
  tabs: { name: string; pre: React.ReactNode }[];
}) {
  const [currentName, setCurrentName] = useStateOrLocalStorage(
    storeKey && "terminal-picker-" + storeKey,
    tabs[0]?.name,
  );

  const current = tabs.find((tab) => tab.name === currentName) || tabs[0];
  return (
    <div className="border rounded border-ch-border overflow-hidden my-4 relative">
      <div
        className={cn(
          "border-b-[1px] border-ch-border bg-ch-tabs-background px-3 py-0",
          "w-full h-9 flex items-center justify-between",
          "text-ch-tab-inactive-foreground text-sm font-mono",
        )}
      >
        <div className="flex items-center gap-2 w-full h-5">
          <div className="size-4">
            <TerminalIcon size={16} className="-mt-1.5" />
          </div>
          <span className="leading-none">Terminal</span>
          {tabs.length > 1 && (
            <div className="ml-auto">
              <ToggleGroup
                type="single"
                className="rounded-md inline-flex px-1 bg-ch-background"
                variant="outline"
                value={currentName}
                onValueChange={(value) => {
                  if (value) setCurrentName(value);
                }}
              >
                {tabs.map((tab, index) => (
                  <ToggleGroupItem
                    key={index}
                    value={tab.name}
                    aria-label={`Toggle ${tab.name}`}
                    className="py-0 px-0.5 h-6 !bg-transparent border-none text-ch-tab-active-foreground opacity-60 data-[state=on]:opacity-100"
                  >
                    {tab.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}
        </div>
      </div>
      {current.pre}
    </div>
  );
}
