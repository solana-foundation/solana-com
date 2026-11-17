"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import {
  getIterableActionUrl,
  sendIterableFormRequest,
} from "@solana-com/ui-chrome/iterable";
import { trackLead } from "@solana-com/ui-chrome/analytics";
import Button from "@/components/Button";

export interface EmailSubscribeFormLabels {
  emailLabel: string;
  emailPlaceholder: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
}

interface Props {
  /** Iterable public form id the email is posted to. */
  formId: string;
  /** Analytics placement, e.g. "subscribe_dialog". */
  placement: string;
  labels: EmailSubscribeFormLabels;
  /** `dark` sits on the black site background; `light` on a brand color. */
  tone?: "dark" | "light";
  /** `stack` puts the button under the field; `inline` beside it on desktop. */
  layout?: "stack" | "inline";
  autoFocus?: boolean;
  className?: string;
}

const TONE_CLASSES = {
  dark: {
    input:
      "border-white/15 text-white placeholder:text-white/40 focus:border-white/40",
    error: "text-pink",
    success: "text-green",
  },
  light: {
    input:
      "border-black/40 text-black placeholder:text-black/50 focus:border-black",
    error: "text-black",
    success: "text-black",
  },
} as const;

export default function EmailSubscribeForm({
  formId,
  placement,
  labels,
  tone = "dark",
  layout = "stack",
  autoFocus = false,
  className = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const toneClasses = TONE_CLASSES[tone];

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  if (status === "done") {
    return (
      <p
        role="status"
        aria-live="polite"
        className={`type-caption ${toneClasses.success} ${className}`.trim()}
      >
        {labels.success}
      </p>
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      await sendIterableFormRequest(getIterableActionUrl(formId), {
        email: trimmedEmail,
      });

      setEmail("");
      setStatus("done");
      trackLead({
        appName: "breakpoint",
        leadType: "newsletter",
        formId: "breakpoint_newsletter",
        placement,
      });
    } catch {
      setStatus("error");
    }
  };

  const isSending = status === "sending";

  return (
    <form
      onSubmit={submit}
      noValidate
      className={`flex flex-col gap-3 ${className}`.trim()}
    >
      <div
        className={
          layout === "inline"
            ? "flex flex-col gap-3 md:flex-row md:items-stretch"
            : "flex flex-col gap-3"
        }
      >
        <label htmlFor={inputId} className="sr-only">
          {labels.emailLabel}
        </label>
        <input
          id={inputId}
          ref={inputRef}
          autoComplete="email"
          type="email"
          value={email}
          required
          aria-invalid={status === "error"}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder={labels.emailPlaceholder}
          disabled={isSending}
          className={`type-field h-[40px] min-w-0 shrink-0 border bg-transparent px-3 focus:outline-none ${layout === "inline" ? "md:flex-1" : ""} ${toneClasses.input}`}
        />
        <Button
          disabled={isSending}
          label={isSending ? labels.submitting : labels.submit}
          type="submit"
          variant="primary"
          className={layout === "inline" ? "w-full md:w-auto" : undefined}
        />
      </div>
      {status === "error" && (
        <p role="alert" className={`type-caption ${toneClasses.error}`}>
          {labels.error}
        </p>
      )}
    </form>
  );
}
