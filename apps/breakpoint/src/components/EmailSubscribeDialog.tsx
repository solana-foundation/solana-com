"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Button from "@/components/Button";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EmailSubscribeDialog({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const previousActiveElement = document.activeElement;
    const dialog = dialogRef.current;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    inputRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

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
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setTimeout(() => setStatus("done"), 500);
  };

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
            Follow BP26
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
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
          Get news, event updates, and reveal drops for Breakpoint 2026.
        </p>

        {status === "done" ? (
          <p
            role="status"
            aria-live="polite"
            className="type-caption mt-6 text-green"
          >
            You&rsquo;re subscribed.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
            <label htmlFor="bp-email" className="sr-only">
              Email
            </label>
            <input
              id="bp-email"
              ref={inputRef}
              autoComplete="email"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="type-field h-[40px] border border-white/15 bg-transparent px-3 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
            />
            <Button
              disabled={status === "sending"}
              label={status === "sending" ? "Subscribing…" : "Subscribe"}
              type="submit"
              variant="primary"
            />
          </form>
        )}
      </div>
    </div>
  );
}
