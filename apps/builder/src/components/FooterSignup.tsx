"use client";

import { useState, type FormEvent } from "react";
import {
  getIterableActionUrl,
  sendIterableFormRequest,
} from "@solana-com/ui-chrome/iterable";
import { UPDATES_FORM_ID } from "@@/src/content/links";

const ACTION_URL = getIterableActionUrl(UPDATES_FORM_ID);

type Labels = {
  heading: string;
  placeholder: string;
  submit: string;
  success: string;
  error: string;
};

/**
 * One-field email signup for BLDR updates. The form posts straight to Iterable
 * without script; with script it submits in place and reports the result.
 */
export function FooterSignup({ labels }: { labels: Labels }) {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    setStatus("submitting");
    try {
      await sendIterableFormRequest(ACTION_URL, { email: email.trim() });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col gap-5 border-b border-ink/15 pb-10 md:flex-row md:items-center md:justify-between md:gap-10">
      <label
        htmlFor="bldr-updates-email"
        className="text-[22px] leading-none tracking-[-0.03em] md:text-[28px]"
      >
        {labels.heading}
      </label>

      <div className="w-full md:max-w-[460px]">
        {status === "success" ? (
          <p
            role="status"
            className="flex h-12 items-center text-[18px] leading-none tracking-[-0.03em]"
          >
            {labels.success}
          </p>
        ) : (
          <form
            name="iterable-optin"
            action={ACTION_URL}
            method="post"
            target="_blank"
            onSubmit={onSubmit}
            className="flex"
          >
            <input
              id="bldr-updates-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={labels.placeholder}
              onChange={() => status === "error" && setStatus("idle")}
              className="h-12 min-w-0 flex-1 rounded-none border border-r-0 border-ink/30 bg-transparent px-4 text-[16px] leading-none tracking-[-0.03em] text-ink outline-none placeholder:text-ink/50 focus-visible:border-ink"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-cut h-12 shrink-0 bg-bldr-purple px-5 text-[16px] leading-none tracking-[-0.03em] text-black hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-current disabled:opacity-60"
            >
              {labels.submit}
            </button>
          </form>
        )}
        {status === "error" && (
          <p role="alert" className="mt-3 text-[14px] leading-none text-ink/80">
            {labels.error}
          </p>
        )}
      </div>
    </div>
  );
}
