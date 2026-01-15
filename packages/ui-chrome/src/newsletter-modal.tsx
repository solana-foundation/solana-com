"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";
import { X } from "react-feather";
import { useTheme } from "./theme-provider";

function cn(...inputs: classNames.ArgumentArray) {
  return twMerge(classNames(inputs));
}

const ITERABLE_BASE_URL =
  "https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=";

const Status = {
  Idle: "idle",
  Sending: "sending",
  Error: "error",
  Success: "success",
} as const;

type StatusType = (typeof Status)[keyof typeof Status];

interface NewsletterModalProps {
  formId: string;
  children: React.ReactNode;
}

export function NewsletterModal({ formId, children }: NewsletterModalProps) {
  const t = useTranslations();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<StatusType>(Status.Idle);

  const actionUrl = `${ITERABLE_BASE_URL}${formId}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus(Status.Error);
      return;
    }

    setStatus(Status.Sending);

    try {
      const data = new FormData();
      data.append("email", email);

      const response = await fetch(actionUrl, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      setStatus(Status.Success);
      setEmail("");
    } catch {
      setStatus(Status.Error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setStatus(Status.Idle);
      setEmail("");
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 backdrop-blur-sm",
            isDark ? "bg-black/80" : "bg-black/50",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-[calc(100vw-32px)] max-w-[480px]",
            isDark ? "bg-[#0e0e10]" : "bg-white",
            isDark
              ? "border border-[rgba(255,255,255,0.1)]"
              : "border border-gray-200",
            "rounded-none p-8 md:p-10",
            isDark
              ? "shadow-[0_32px_64px_rgba(0,0,0,0.6)]"
              : "shadow-[0_32px_64px_rgba(0,0,0,0.15)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "duration-200",
          )}
        >
          <DialogPrimitive.Close
            className={cn(
              "absolute right-4 top-4 p-1.5 rounded-sm",
              isDark
                ? "text-gray-400 hover:text-white"
                : "text-gray-400 hover:text-black",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-[#9945FF]",
            )}
          >
            <X size={20} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <div className="space-y-6">
            {/* Title */}
            <DialogPrimitive.Title
              className={cn(
                "text-2xl md:text-3xl font-bold tracking-tight text-center uppercase",
                isDark ? "text-white" : "text-black",
              )}
            >
              Join the Solana Network
            </DialogPrimitive.Title>

            {/* Description */}
            <DialogPrimitive.Description
              className={cn(
                "text-sm md:text-base leading-relaxed text-center",
                isDark ? "text-gray-400" : "text-gray-600",
              )}
            >
              Get the latest on Solana ecosystem updates, developer resources,
              events, and more delivered to your inbox.
            </DialogPrimitive.Description>

            {status === Status.Success ? (
              <div className="py-6 text-center space-y-4">
                {/* Solana gradient checkmark */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#14F195]"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p
                  className={cn(
                    "font-semibold text-lg",
                    isDark ? "text-white" : "text-black",
                  )}
                >
                  Welcome to Solana!
                </p>
                <p
                  className={cn(
                    "text-sm",
                    isDark ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {t("shared.mail-signup.form.signup-success")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Inline input + button layout like J.Crew */}
                <div
                  className={cn(
                    "flex border",
                    isDark ? "border-gray-700" : "border-gray-300",
                    status === Status.Error &&
                      (isDark ? "border-red-500/60" : "border-red-400"),
                  )}
                >
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === Status.Error) setStatus(Status.Idle);
                    }}
                    placeholder="YOUR EMAIL, PLEASE"
                    className={cn(
                      "flex-1 min-w-0 px-4 py-3.5",
                      isDark
                        ? "bg-transparent text-white placeholder:text-gray-500"
                        : "bg-white text-black placeholder:text-gray-400",
                      "text-sm tracking-wide uppercase",
                      "border-none outline-none",
                      "focus:ring-0",
                    )}
                    disabled={status === Status.Sending}
                  />
                  <button
                    type="submit"
                    disabled={status === Status.Sending}
                    className={cn(
                      "shrink-0 px-6 py-3.5 font-semibold text-sm tracking-wide uppercase",
                      isDark
                        ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white"
                        : "bg-black text-white hover:bg-gray-800",
                      "hover:opacity-90 active:scale-[0.98]",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "transition-all duration-150",
                      "focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:ring-inset",
                    )}
                  >
                    {status === Status.Sending ? "..." : "Submit"}
                  </button>
                </div>

                {status === Status.Error && (
                  <p
                    className={cn(
                      "text-sm",
                      isDark ? "text-red-400" : "text-red-500",
                    )}
                  >
                    {t("shared.mail-signup.form.email-error")}
                  </p>
                )}

                {/* Privacy note */}
                <p
                  className={cn(
                    "text-xs text-center",
                    isDark ? "text-gray-500" : "text-gray-400",
                  )}
                >
                  To see how we may use your information, take a look at our{" "}
                  <a
                    href="/privacy-policy"
                    className={cn(
                      "underline hover:no-underline",
                      isDark
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-500 hover:text-black",
                    )}
                  >
                    privacy policy
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
