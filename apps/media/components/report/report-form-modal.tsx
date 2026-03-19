"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReportFormModalProps {
  buttonLabel: string;
  formUrl: string;
  title?: string;
}

export function ReportFormModal({
  buttonLabel,
  formUrl,
  title = "Get the full report",
}: ReportFormModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setIsLoading(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="rounded-full px-6 text-sm uppercase tracking-[0.25em]"
        >
          {buttonLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-3xl overflow-hidden border-gray-200 bg-white p-0 sm:max-w-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            HubSpot form modal for accessing the report.
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
              <Loader2 className="size-8 animate-spin text-white" />
            </div>
          )}

          <iframe
            src={formUrl}
            title={title}
            className="h-[700px] w-full border-0"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
