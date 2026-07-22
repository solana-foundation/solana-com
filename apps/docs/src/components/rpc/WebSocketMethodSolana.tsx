"use client";

import { useState } from "react";
import type { WebSocketEndpoint } from "@/lib/websocket-endpoints";

interface WebSocketMethodSolanaProps {
  endpoint: WebSocketEndpoint;
}

function TypeBadge({ type }: { type: string }) {
  const baseType = type.replace(" (optional)", "").trim();
  return (
    <code className="text-[11px] text-fd-primary font-medium">{baseType}</code>
  );
}

type TabType = "subscribe" | "response" | "notification" | "unsubscribe";

export function WebSocketMethodSolana({
  endpoint,
}: WebSocketMethodSolanaProps) {
  const [activeTab, setActiveTab] = useState<TabType>("subscribe");
  const hasUnsubscribe = endpoint.method_name.includes("Subscribe");

  const tabs: { id: TabType; label: string; show: boolean }[] = [
    { id: "subscribe", label: "Subscribe", show: true },
    { id: "response", label: "Response", show: true },
    { id: "notification", label: "Notification", show: true },
    { id: "unsubscribe", label: "Unsubscribe", show: hasUnsubscribe },
  ];

  const getCode = (tab: TabType): string => {
    switch (tab) {
      case "subscribe":
        return endpoint.subscribe_example;
      case "response":
        return endpoint.subscribe_response_example;
      case "notification":
        return endpoint.notification_example;
      case "unsubscribe":
        return `${endpoint.unsubscribe_example}\n\n// Response\n${endpoint.unsubscribe_response_example}`;
      default:
        return "";
    }
  };

  // Parse notification to extract result structure
  type ResultField = { name: string; type: string; indent: number };
  const resultFields: ResultField[] = [];

  const extractFields = (
    obj: unknown,
    prefix: string = "",
    indent: number = 0,
  ) => {
    if (obj === null || obj === undefined) {
      resultFields.push({ name: prefix || "result", type: "null", indent });
      return;
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === "object" && obj[0] !== null) {
        resultFields.push({ name: prefix || "result", type: "array", indent });
        extractFields(obj[0], "[]", indent + 1);
      } else {
        const itemType = obj.length > 0 ? typeof obj[0] : "any";
        resultFields.push({
          name: prefix || "result",
          type: `array<${itemType}>`,
          indent,
        });
      }
      return;
    }

    if (typeof obj === "object") {
      if (prefix) {
        resultFields.push({ name: prefix, type: "object", indent });
      }
      Object.entries(obj).forEach(([key, value]) => {
        if (value === null) {
          resultFields.push({
            name: key,
            type: "null",
            indent: prefix ? indent + 1 : indent,
          });
        } else if (Array.isArray(value)) {
          if (
            value.length > 0 &&
            typeof value[0] === "object" &&
            value[0] !== null
          ) {
            resultFields.push({
              name: key,
              type: "array",
              indent: prefix ? indent + 1 : indent,
            });
            extractFields(value[0], "[]", prefix ? indent + 2 : indent + 1);
          } else {
            const itemType = value.length > 0 ? typeof value[0] : "any";
            resultFields.push({
              name: key,
              type: `array<${itemType}>`,
              indent: prefix ? indent + 1 : indent,
            });
          }
        } else if (typeof value === "object") {
          extractFields(value, key, prefix ? indent + 1 : indent);
        } else {
          resultFields.push({
            name: key,
            type: typeof value,
            indent: prefix ? indent + 1 : indent,
          });
        }
      });
      return;
    }

    resultFields.push({ name: prefix || "result", type: typeof obj, indent });
  };

  try {
    const notification = JSON.parse(endpoint.notification_example);
    if (notification.params?.result !== undefined) {
      extractFields(notification.params.result);
    }
  } catch {
    // ignore parse errors
  }

  return (
    <div className="mb-8 pb-8 border-b border-fd-border last:border-0">
      {/* Header */}
      <h3
        id={endpoint.method_name}
        className="flex items-center gap-2 text-base font-semibold text-fd-foreground font-mono mb-1 scroll-mt-20"
      >
        <span
          className="w-2 h-2 rounded-full bg-purple-500 shrink-0"
          title="WebSocket"
        />
        {endpoint.method_name}
      </h3>
      <p className="text-sm text-fd-muted-foreground mb-4">
        {endpoint.description}
      </p>

      {/* Parameters Table */}
      {endpoint.params.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-semibold text-fd-muted-foreground uppercase tracking-wide mb-2">
            Parameters
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-fd-muted-foreground border-b border-fd-border/50">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium w-full">Description</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {endpoint.params.map((param, i) => (
                <tr
                  key={i}
                  className="border-b border-fd-border/30 last:border-0"
                >
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-1.5">
                      <code className="text-fd-foreground font-mono text-[13px]">
                        {param.name}
                      </code>
                      {param.required && (
                        <span className="text-[9px] text-red-400">*</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    <TypeBadge type={param.type} />
                  </td>
                  <td className="py-2 text-fd-muted-foreground text-[13px]">
                    {param.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Result Table */}
      {resultFields.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-semibold text-fd-muted-foreground uppercase tracking-wide mb-2">
            Notification Result
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-fd-muted-foreground border-b border-fd-border/50">
                <th className="pb-2 font-medium">Field</th>
                <th className="pb-2 font-medium">Type</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {resultFields.map((field, i) => (
                <tr
                  key={i}
                  className="border-b border-fd-border/30 last:border-0"
                >
                  <td className="py-2 pr-4">
                    <div
                      className="flex items-center gap-1.5"
                      style={{ paddingLeft: `${field.indent * 16}px` }}
                    >
                      {field.indent > 0 && (
                        <span className="text-fd-border text-xs">└</span>
                      )}
                      <code className="text-fd-foreground font-mono text-[13px]">
                        {field.name}
                      </code>
                    </div>
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    <TypeBadge type={field.type} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Code Examples with Tabs */}
      <div>
        <div className="text-[11px] font-semibold text-fd-muted-foreground uppercase tracking-wide mb-2">
          Example
        </div>
        <div className="rounded-lg border border-fd-border overflow-hidden">
          {/* Tab Header */}
          <div className="flex bg-fd-muted/50 border-b border-fd-border overflow-x-auto">
            {tabs
              .filter((t) => t.show)
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-fd-primary text-fd-primary bg-fd-background"
                      : "border-transparent text-fd-muted-foreground hover:text-fd-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
          </div>
          {/* Code Content */}
          <pre className="bg-fd-background text-fd-foreground text-[13px] leading-relaxed font-mono p-4 overflow-x-auto">
            <code>{getCode(activeTab)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
