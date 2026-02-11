"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from "@workspace/ui";
import { useTranslations } from "next-intl";

interface LumaModalProps {
  lumaId: string;
  children: React.ReactNode;
}

export function LumaModal({ lumaId, children }: LumaModalProps) {
  const t = useTranslations("accelerate.lumaModal");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) setIsLoaded(false);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-[600px] overflow-hidden rounded-xl border border-white/[0.06] bg-[#111] p-0 shadow-[0_0_60px_-12px_rgba(153,69,255,0.25),0_24px_48px_-12px_rgba(0,0,0,0.5)]"
        showCloseButton
      >
        <VisuallyHidden>
          <DialogTitle>{t("getTickets")}</DialogTitle>
        </VisuallyHidden>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-accelerate-purple/50 to-transparent" />

          {!isLoaded && (
            <div className="absolute inset-0 z-[1] flex items-center justify-center bg-[#111]">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-accelerate-purple" />
            </div>
          )}

          <iframe
            src={`https://lu.ma/embed/event/${lumaId}/simple`}
            className={`h-[calc(100vh-5rem)] w-full bg-transparent transition-opacity duration-500 md:max-h-[591px] ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="false"
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
