"use client";

import { ChevronDown, Loader2, Play } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

const servers = [
  "https://api.devnet.solana.com",
  "https://api.testnet.solana.com",
  "https://api.mainnet-beta.solana.com",
];

export function RequestClient({ json }: { json: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [response, setResponse] = useState<string | null>("");
  const [server, setServer] = useState(servers[0]);

  const sendRequest = async () => {
    setResponse(null);
    const response = await fetch(server, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    });
    const data = await response.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      data-playground={isOpen}
      className="bg-ch-tabs-background"
    >
      <CollapsibleTrigger className="p-2 gap-2 w-full justify-between items-center flex cursor-pointer text-ch-tab-inactive-foreground hover:text-ch-tab-active-foreground transition-colors duration-200">
        <div className="h-5 shrink-0 font-medium flex items-center gap-2">
          <Play className="size-3" fill="currentColor" />
          <span className="text-ch-tab-active-foreground">Try it</span>
        </div>
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-2 gap-2 flex">
          <Select value={server} onValueChange={setServer}>
            <SelectTrigger className="min-w-0">
              <SelectValue placeholder="Select a server" />
            </SelectTrigger>
            <SelectContent>
              {servers.map((server) => (
                <SelectItem key={server} value={server}>
                  {server}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={sendRequest}
            disabled={response === null}
            className="w-40"
          >
            {response === null ? (
              <>
                <Loader2 className="animate-spin" />
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </Button>
        </div>
        {response && (
          <pre className="overflow-auto px-3 py-3 m-0 rounded-none !bg-ch-background font-mono text-sm max-h-[500px]">
            {response}
          </pre>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
