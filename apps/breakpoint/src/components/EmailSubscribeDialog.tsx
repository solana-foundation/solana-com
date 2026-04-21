"use client";

import React, { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EmailSubscribeDialog({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
      aria-labelledby="subscribe-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] border border-white/15 bg-[#0b0811] p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="subscribe-title"
            className="font-sans text-[1.75rem] leading-[1] tracking-[-0.035em] text-white"
          >
            Follow BP26
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-white/60 hover:text-white"
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
        <p className="mt-3 text-[0.9375rem] leading-[1.4] text-white/72">
          Get news, event updates, and reveal drops for Breakpoint 2026.
        </p>

        {status === "done" ? (
          <p className="mt-6 font-mono text-[0.8125rem] uppercase tracking-[0.08em] text-[#c9ff7c]">
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
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="h-[40px] border border-white/15 bg-transparent px-3 font-mono text-[0.875rem] text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex h-[40px] items-center justify-center bg-white px-5 font-mono text-[14px] font-bold uppercase tracking-[0.08em] leading-[0.9] text-black transition-colors duration-200 hover:bg-[#e7d2f9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
