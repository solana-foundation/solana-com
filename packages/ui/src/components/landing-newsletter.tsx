"use client";

import { useState, type FormEvent } from "react";

import { cn } from "../lib/utils";

export interface LandingNewsletterProps {
  formId: string;
  placeholder?: string;
  emailError?: string;
  submitError?: string;
  successMessage?: string;
  className?: string;
}

export function LandingNewsletter({
  formId,
  placeholder,
  emailError = "Please enter a valid email address",
  submitError = "Something went wrong, please try again",
  successMessage = "Success! Thank you for signing up!",
  className,
}: LandingNewsletterProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const action = `https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=${encodeURIComponent(formId)}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage(emailError);
      setSuccess(false);
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const body = new FormData();
      body.append("email", email);
      const response = await fetch(action, { method: "POST", body });
      if (!response.ok) throw new Error("Subscription failed");
      setSuccess(true);
      setMessage(successMessage);
    } catch {
      setSuccess(false);
      setMessage(submitError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      action={action}
      method="post"
      onSubmit={submit}
      className={cn(
        "grid w-full max-w-lg gap-2 sm:grid-cols-[minmax(0,1fr)_auto]",
        className,
      )}
    >
      <label className="sr-only" htmlFor={`landing-email-${formId}`}>
        Email address
      </label>
      <input
        id={`landing-email-${formId}`}
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setMessage("");
        }}
        placeholder={placeholder || "Email address"}
        aria-invalid={!!message && !success}
        aria-describedby={
          message ? `landing-email-status-${formId}` : undefined
        }
        className="min-w-0 rounded-full border border-white/20 bg-[#111114] px-4 py-3 text-white placeholder:text-[#ABABBA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA9FF5]"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-[#14F195] px-6 py-3 font-brand-mono text-xs uppercase tracking-wide text-black disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA9FF5]"
      >
        Sign Up
      </button>
      {message && (
        <p
          id={`landing-email-status-${formId}`}
          role={success ? "status" : "alert"}
          className={cn(
            "text-sm sm:col-span-2",
            success ? "text-[#14F195]" : "text-red-400",
          )}
        >
          {message}
        </p>
      )}
    </form>
  );
}
