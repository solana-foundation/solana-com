"use client";

import React, { useEffect, useId, useRef } from "react";
import { useTranslations } from "@workspace/i18n/client";
import EmailSubscribeForm from "@/components/EmailSubscribeForm";
import { BREAKPOINT_NEWSLETTER_FORM_ID } from "@/content/links";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EmailSubscribeDialog({ open, onClose }: Props) {
  const t = useTranslations("breakpoint.subscribe");
  const tAccessibility = useTranslations("breakpoint.accessibility");
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  // Held in a ref so a parent re-render with a new `onClose` does not re-run
  // the effect below and move focus while the dialog is open.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previousActiveElement = document.activeElement;
    const dialog = dialogRef.current;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Focus the field only after the opener is saved, so closing returns to it.
    dialog?.querySelector<HTMLInputElement>("input")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();

      if (e.key !== "Tab" || !dialog) return;

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0]!;
      const lastElement = focusableElements[focusableElements.length - 1]!;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-[440px] border border-neutral-700 bg-neutral-800 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="type-h4 text-white">
            {t("title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={tAccessibility("close")}
            className="text-white/60 transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 2L14 14M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
        <p id={descriptionId} className="type-paragraph mt-3 text-white/72">
          {t("description")}
        </p>

        <EmailSubscribeForm
          className="mt-6"
          formId={BREAKPOINT_NEWSLETTER_FORM_ID}
          placement="subscribe_dialog"
          labels={{
            emailLabel: t("emailLabel"),
            emailPlaceholder: t("emailPlaceholder"),
            submit: t("submit"),
            submitting: t("submitting"),
            success: t("success"),
            error: t("error"),
          }}
        />
      </div>
    </div>
  );
}
