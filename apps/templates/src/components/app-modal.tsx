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
        <Button variant="outline" className="w-full">
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-zinc-950 border-white/5">
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
