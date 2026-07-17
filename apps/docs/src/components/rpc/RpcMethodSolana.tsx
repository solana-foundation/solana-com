"use client";

import { useState } from "react";
import type { Endpoint } from "@/lib/rpc-endpoints";

interface RpcMethodSolanaProps {
  endpoint: Endpoint;
}

function TypeBadge({ type }: { type: string }) {
  const baseType = type.replace(" (optional)", "").trim();
  return (
    <code className="text-[11px] text-fd-primary font-medium">{baseType}</code>
  );
}

export function RpcMethodSolana({ endpoint }: RpcMethodSolanaProps) {
  const [activeTab, setActiveTab] = useState<"request" | "response">("request");

  // Group params by parentName
  const topLevelParams = endpoint.params.filter(
    (p) => !p.parentName && !p.isObjectHeader,
  );
  const objectHeaders = endpoint.params.filter(
    (p) => p.isObjectHeader && !p.parentName,
  );

  // Group nested params by their parent
  const nestedByParent: Record<string, typeof endpoint.params> = {};
  endpoint.params.forEach((param) => {
    if (param.parentName) {
      (nestedByParent[param.parentName] ??= []).push(param);
    }
  });

  // Build flat list with proper nesting
  const allParams: ((typeof endpoint.params)[0] & { indent: number })[] = [];

  // Add top-level params first
  topLevelParams.forEach((p) => allParams.push({ ...p, indent: 0 }));

  // Add object headers with their nested children
  const addObjectWithChildren = (
    header: (typeof endpoint.params)[0],
    indentLevel: number,
  ) => {
    allParams.push({ ...header, indent: indentLevel });
    const children = nestedByParent[header.name] || [];
    children.forEach((child) => {
      if (child.isObjectHeader) {
        addObjectWithChildren(child, indentLevel + 1);
      } else {
        allParams.push({ ...child, indent: indentLevel + 1 });
      }
    });
  };

  objectHeaders.forEach((header) => addObjectWithChildren(header, 0));

  // Use resultFields from endpoint (extracted from schema with descriptions)
  const resultFields = endpoint.resultFields || [];

  return (
    <div className="mb-8 pb-8 border-b border-fd-border last:border-0">
      {/* Header */}
      <h3
        id={endpoint.method_name}
        className="flex items-center gap-2 text-base font-semibold text-fd-foreground font-mono mb-1 scroll-mt-20"
      >
        {endpoint.status === "implemented" ? (
          <span
            className="w-2 h-2 rounded-full bg-green-500 shrink-0"
            title="Available"
          />
        ) : (
          <span
            className="w-2 h-2 rounded-full bg-yellow-500 shrink-0"
            title="Coming Soon"
          />
        )}
        {endpoint.method_name}
      </h3>
      <p className="text-sm text-fd-muted-foreground mb-4">
        {endpoint.description}
      </p>

      {/* Parameters Table */}
      {allParams.length > 0 && (
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
              {allParams.map((param, i) => (
                <tr
                  key={i}
                  className="border-b border-fd-border/30 last:border-0"
                >
                  <td className="py-2 pr-4">
                    <div
                      className="flex items-center gap-1.5"
                      style={{ paddingLeft: `${param.indent * 16}px` }}
                    >
                      {param.indent > 0 && (
                        <span className="text-fd-border text-xs">└</span>
                      )}
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
            Result
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-fd-muted-foreground border-b border-fd-border/50">
                <th className="pb-2 font-medium">Field</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium w-full">Description</th>
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
                  <td className="py-2 text-fd-muted-foreground text-[13px]">
                    {field.description}
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
          <div className="flex bg-fd-muted/50 border-b border-fd-border">
            <button
              onClick={() => setActiveTab("request")}
              className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
                activeTab === "request"
                  ? "border-fd-primary text-fd-primary bg-fd-background"
                  : "border-transparent text-fd-muted-foreground hover:text-fd-foreground"
              }`}
            >
              Request
            </button>
            <button
              onClick={() => setActiveTab("response")}
              className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
                activeTab === "response"
                  ? "border-fd-primary text-fd-primary bg-fd-background"
                  : "border-transparent text-fd-muted-foreground hover:text-fd-foreground"
              }`}
            >
              Response
            </button>
          </div>
          {/* Code Content */}
          <pre className="bg-fd-background text-fd-foreground text-[13px] leading-relaxed font-mono p-4 overflow-x-auto">
            <code>
              {activeTab === "request"
                ? endpoint.example_request
                : endpoint.example_response}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
