"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { useNotesContext } from "./notes.client";
import { cn } from "@/app/components/utils";

export function NoteTooltip({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  let note = useNotesContext(name);
  if (!note) {
    note = { name, type: "prose", children: name };
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted underline-offset-4 cursor-help">
            {children}
          </span>
        </TooltipTrigger>

        {note.type === "code" ? (
          <TooltipContent
            className={cn(
              "min-w-44 max-w-96 whitespace-normal",
              "p-0 [&>div]:!my-0 border-none overflow-auto rounded-none bg-transparent",
            )}
          >
            {note?.children}
          </TooltipContent>
        ) : note.type === "image" ? (
          <TooltipContent
            className={cn(
              "min-w-44 max-w-96 whitespace-normal",
              "p-0 [&>*]:first:mt-0 [&>*]:last:mb-0 border-none bg-transparent",
            )}
          >
            {note?.children}
          </TooltipContent>
        ) : (
          <TooltipContent
            className={cn(
              "min-w-44 max-w-96 whitespace-normal",
              "p-4 prose dark:prose-invert bg-fd-background",
            )}
          >
            <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
              {note?.children}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
