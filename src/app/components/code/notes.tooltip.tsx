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
  const className = {
    code: "p-0 [&>div]:!my-0 border-none overflow-auto rounded-none bg-transparent",
    prose:
      "[&>*]:first-child:mt-0 [&>*]:last-child:mb-0 p-4 prose dark:prose-invert bg-fd-background",
    image: "p-0 [&>*]:first:mt-0 [&>*]:last:mb-0 border-none bg-transparent",
  }[note.type || "prose"];

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted underline-offset-4 cursor-help">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent
          className={cn("min-w-44 max-w-96 whitespace-normal", className)}
        >
          {note?.children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
