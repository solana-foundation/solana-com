"use client";

import { Button } from "@workspace/ui";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui";
import { VisuallyHidden } from "@workspace/ui";
import { ReactNode } from "react";

export function AppModal({
  children,
  title,
  submit,
  submitDisabled,
  submitLabel,
  hideTitle,
}: {
  children: ReactNode;
  title: string;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
  hideTitle?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full rounded-none border-white bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/[0.12] bg-[#0C0C0E] text-nd-high-em-text sm:max-w-[800px] sm:rounded-none">
        <DialogHeader>
          {hideTitle ? (
            <VisuallyHidden>
              <DialogTitle>{title}</DialogTitle>
            </VisuallyHidden>
          ) : (
            <DialogTitle>{title}</DialogTitle>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
        <DialogFooter>
          {submit ? (
            <Button type="submit" onClick={submit} disabled={submitDisabled}>
              {submitLabel || "Save"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
