"use client";

import { useTranslations } from "next-intl";
import type { VisualCommandList } from "@/lib/docs/ask/generative-ui/schema";
import { CommandRow } from "./command-row.client";
import { FrameProse, VisualFrame } from "./frame";

/** command_list: copyable shell commands, one per row. */
export function VisualCommandListBlock({ list }: { list: VisualCommandList }) {
  const t = useTranslations("docsAsk.visuals");
  return (
    <VisualFrame label={t("commands")} title={list.title}>
      {list.body ? <FrameProse text={list.body} /> : null}
      <div>
        {list.commands.map((item, index) => (
          <CommandRow
            key={`${index}-${item.command}`}
            variant="row"
            command={item.command}
            description={item.description}
          />
        ))}
      </div>
      {list.footnote ? (
        <p className="m-0 border-t border-[var(--sol-line)] px-3.5 py-2 text-[12px] leading-[1.5] text-[var(--sol-muted)]">
          {list.footnote}
        </p>
      ) : null}
    </VisualFrame>
  );
}
