"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
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
  portalId?: string;
  formId?: string;
  title?: string;
}

type ParsedHubSpotForm = {
  formId: string;
  portalId: string;
  region: "na1" | "eu1";
  fieldValues: Record<string, string>;
};

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (config: Record<string, unknown>) => void;
      };
    };
  }
}

function parseHubSpotFormUrl(formUrl: string): ParsedHubSpotForm | null {
  try {
    const url = new URL(formUrl);
    const pathToken = url.pathname.split("/").filter(Boolean).at(-1) || "";

    if (!pathToken) {
      return null;
    }

    // Derived from HubSpot's shareable-forms bootstrap script.
    const normalized = pathToken.replaceAll("-", "+").replaceAll("_", "/");
    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const hex = [...bytes]
      .map((byte) => (byte + 256).toString(16).slice(-2))
      .reduce((acc, part, index) => {
        if (index === 4 || index === 6 || index === 8 || index === 10) {
          acc += "-";
        }

        return acc + part;
      }, "");

    const formId = hex.substring(1, 37);
    const portalId = parseInt(hex.substring(37), 36).toString();

    if (!formId || !portalId || Number.isNaN(Number(portalId))) {
      return null;
    }

    return {
      formId,
      portalId,
      region: url.hostname.includes("eu") ? "eu1" : "na1",
      fieldValues: Object.fromEntries(url.searchParams.entries()),
    };
  } catch {
    return null;
  }
}

export function ReportFormModal({
  buttonLabel,
  formUrl,
  portalId,
  formId,
  title = "Get the full report",
}: ReportFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fallbackToIframe, setFallbackToIframe] = useState(false);
  const [containerMounted, setContainerMounted] = useState(false);
  const targetId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const createdRef = useRef(false);
  const parsedForm = useMemo(() => {
    if (portalId && formId) {
      return {
        portalId,
        formId,
        region: "na1" as const,
        fieldValues: Object.fromEntries(
          new URL(formUrl).searchParams.entries()
        ),
      };
    }

    return parseHubSpotFormUrl(formUrl);
  }, [formId, formUrl, portalId]);

  useEffect(() => {
    if (!isOpen || !parsedForm || fallbackToIframe || window.hbspt?.forms) {
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.hsforms.net/forms/embed/v2.js"]'
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/embed/v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, [fallbackToIframe, isOpen, parsedForm]);

  useEffect(() => {
    if (
      !isOpen ||
      !parsedForm ||
      fallbackToIframe ||
      !containerMounted ||
      !containerRef.current ||
      isSubmitted
    ) {
      return;
    }

    let cancelled = false;
    let attempts = 0;
    let readyTimeout: number | undefined;

    const applyFieldValues = () => {
      if (!containerRef.current) {
        return;
      }

      for (const [fieldName, fieldValue] of Object.entries(
        parsedForm.fieldValues
      )) {
        const field = containerRef.current.querySelector<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >(`[name="${fieldName}"]`);

        if (!field) {
          continue;
        }

        field.value = fieldValue;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    const markReadyIfRendered = () => {
      if (!containerRef.current) {
        return;
      }

      const hasRenderedEmbed =
        Boolean(containerRef.current.querySelector("iframe")) ||
        Boolean(containerRef.current.querySelector("form"));

      if (hasRenderedEmbed) {
        if (readyTimeout) {
          window.clearTimeout(readyTimeout);
        }
        setIsLoading(false);
      }
    };

    const createForm = () => {
      if (
        cancelled ||
        createdRef.current ||
        !window.hbspt?.forms ||
        !containerRef.current
      ) {
        return;
      }

      containerRef.current.innerHTML = "";
      createdRef.current = true;

      readyTimeout = window.setTimeout(() => {
        if (!cancelled) {
          setFallbackToIframe(true);
        }
      }, 8000);

      try {
        window.hbspt.forms.create({
          region: parsedForm.region,
          portalId: parsedForm.portalId,
          formId: parsedForm.formId,
          target: `#${targetId}`,
          onFormReady: () => {
            if (readyTimeout) {
              window.clearTimeout(readyTimeout);
            }
            applyFieldValues();
            setIsLoading(false);
          },
          onFormSubmitted: () => {
            if (readyTimeout) {
              window.clearTimeout(readyTimeout);
            }
            setIsSubmitted(true);
            setIsLoading(false);
          },
        });
      } catch {
        if (readyTimeout) {
          window.clearTimeout(readyTimeout);
        }
        setFallbackToIframe(true);
      }
    };

    const timer = window.setInterval(() => {
      attempts++;

      if (window.hbspt?.forms) {
        window.clearInterval(timer);
        createForm();
        return;
      }

      if (attempts > 20) {
        window.clearInterval(timer);
        setFallbackToIframe(true);
      }
    }, 250);

    const onMessage = (event: MessageEvent) => {
      if (
        event.data?.type === "hsFormCallback" &&
        event.data?.eventName === "onFormSubmitted"
      ) {
        setIsSubmitted(true);
        setIsLoading(false);
      }
    };

    const observer = new MutationObserver(() => {
      applyFieldValues();
      markReadyIfRendered();
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("message", onMessage);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      if (readyTimeout) {
        window.clearTimeout(readyTimeout);
      }
      window.removeEventListener("message", onMessage);
      observer.disconnect();
    };
  }, [
    containerMounted,
    fallbackToIframe,
    isOpen,
    isSubmitted,
    parsedForm,
    targetId,
  ]);

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          setIsLoading(true);
          setIsSubmitted(false);
          setFallbackToIframe(false);
          setContainerMounted(false);
          createdRef.current = false;
        } else {
          setContainerMounted(false);
          createdRef.current = false;
          if (containerRef.current) {
            containerRef.current.innerHTML = "";
          }
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="rounded-full bg-white px-6 text-sm font-medium text-black hover:bg-white/90"
        >
          {buttonLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-3xl overflow-hidden rounded-2xl border-[rgba(236,228,253,0.12)] bg-[#1c1c1d] p-0 text-white sm:max-w-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            HubSpot form modal for accessing the report.
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full overflow-hidden rounded-2xl">
          {isLoading && !isSubmitted && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0D0C11]">
              <Loader2 className="size-8 animate-spin text-[#CA9FF5]" />
            </div>
          )}

          {isSubmitted ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 px-8 py-12 text-center text-white">
              <CheckCircle2 className="size-12 text-[#14F195]" />
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold">
                  Thanks, you&apos;re all set
                </h3>
                <p className="max-w-md text-sm leading-6 text-white/70">
                  Your submission was received. The next step depends on the
                  HubSpot workflow attached to this form, but in most cases the
                  report or follow-up email should arrive in your inbox shortly.
                  If you do not see it, check spam or promotions.
                </p>
              </div>
            </div>
          ) : fallbackToIframe || !parsedForm ? (
            <div className="bg-[#1c1c1d] p-6">
              <iframe
                src={formUrl}
                title={title}
                className="h-[700px] w-full rounded-xl border border-[rgba(236,228,253,0.12)] bg-white"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          ) : (
            <div
              id={targetId}
              ref={(node) => {
                containerRef.current = node;
                setContainerMounted(Boolean(node));
              }}
              className="min-h-[420px] bg-[#1c1c1d] p-6"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
