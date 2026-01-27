"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from "@workspace/ui";

interface LumaModalProps {
  lumaId: string;
  children: React.ReactNode;
}

export function LumaModal({ lumaId, children }: LumaModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-[600px] border-none bg-transparent p-0 shadow-none"
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>Get Tickets</DialogTitle>
        </VisuallyHidden>
        <div className="relative">
          <iframe
            src={`https://lu.ma/embed/event/${lumaId}/simple`}
            className="h-[calc(100vh-5rem)] w-full rounded-none bg-transparent md:max-h-[591px]"
            aria-hidden="false"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
