import { z } from "zod";
import { parseProps, Block } from "codehike/blocks";
import { cn } from "@@/src/app/components/utils";
import { WithMentions } from "./code/mentions";

const Schema = Block.extend({
  left: Block,
  right: Block,
});

// usage example: https://github.com/solana-foundation/solana-com/pull/1226
export function SideBySide(props: unknown) {
  const { left, right } = parseProps(props, Schema) as z.infer<typeof Schema>;

  return (
    <WithMentions>
      <div
        className={cn(
          "flex flex-col gap-4 md:flex-row my-4",
          "[&>*]:min-w-0 [&>*]:flex-1",
        )}
      >
        <div
          className={cn(
            "[&:has(>[data-ch-container=true]:only-child)]:flex [&:has(>[data-ch-container=true]:only-child)]:flex-col",
            "[&>[data-ch-container=true]:only-child]:flex-1 [&>[data-ch-container=true]:only-child]:min-h-0 [&>[data-ch-container=true]:only-child]:shrink-0",
            "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          )}
        >
          {left.children}
        </div>
        <div
          className={cn(
            "[&:has(>[data-ch-container=true]:only-child)]:flex [&:has(>[data-ch-container=true]:only-child)]:flex-col",
            "[&>[data-ch-container=true]:only-child]:flex-1 [&>[data-ch-container=true]:only-child]:min-h-0 [&>[data-ch-container=true]:only-child]:shrink-0",
            "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          )}
        >
          {right.children}
        </div>
      </div>
    </WithMentions>
  );
}
