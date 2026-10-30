"use client";

import { useTranslations } from "next-intl";
import {
  IterableActionForm,
  useIterableSignUp,
} from "@solana-com/ui-chrome/iterable-signup";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const schema = {
  isValidSync: (values: unknown) =>
    typeof values === "object" &&
    values !== null &&
    EMAIL.test(String((values as { email?: unknown }).email ?? "")),
};
const initialValues = { email: "" };

/**
 * Developer newsletter signup. Without JS this is a native
 * `<form method="post" action="https://links.iterable.com/…">` with a named
 * `email` input, so it still submits. With JS, useIterableSignUp posts it in
 * the background and reports the result inline.
 */
export function NewsletterForm({ formId }: { formId: string }) {
  const t = useTranslations("developers.landing.newsletter");
  const {
    actionUrl,
    onValueChange,
    onSubmit,
    isSuccess,
    isLoading,
    isDirty,
    isSubmitting,
    values,
    error,
  } = useIterableSignUp({
    formId,
    schema,
    initialValues,
    analytics: {
      appName: "web",
      leadType: "newsletter",
      placement: "developers_landing",
    },
  });

  const invalid = isDirty && isSubmitting && !schema.isValidSync(values);
  const message = error
    ? t("error")
    : invalid
      ? t("invalid")
      : isSuccess
        ? t("success")
        : isLoading
          ? t("sending")
          : null;
  const inputId = `dl-newsletter-${formId}`;

  return (
    <IterableActionForm
      action={actionUrl}
      onSubmit={onSubmit}
      className="grid w-full gap-2 sm:grid-cols-[minmax(0,1fr)_auto] md:w-auto"
    >
      <label htmlFor={inputId} className="sr-only">
        {t("label")}
      </label>
      <input
        id={inputId}
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder={t("placeholder")}
        onChange={onValueChange}
        aria-invalid={invalid || Boolean(error)}
        aria-describedby={message ? `${inputId}-status` : undefined}
        className="h-10 min-w-0 rounded-lg border border-[var(--dl-line-strong)] bg-[var(--dl-bg)] px-3.5 text-sm text-[var(--dl-text)] placeholder:text-[var(--dl-dim)] focus-visible:border-[var(--dl-accent)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-0 focus-visible:outline-[var(--dl-accent-soft)] md:w-[300px]"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="h-10 rounded-lg border-0 bg-[var(--dl-accent)] px-4 text-sm font-semibold text-[var(--dl-on-accent)] transition-colors hover:bg-[var(--dl-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dl-accent)] disabled:opacity-60"
      >
        {t("submit")}
      </button>
      {message && (
        <p
          id={`${inputId}-status`}
          role={error || invalid ? "alert" : "status"}
          className={`m-0 text-sm sm:col-span-2 ${
            error || invalid
              ? "text-[var(--dl-danger)]"
              : "text-[var(--dl-good)]"
          }`}
        >
          {message}
        </p>
      )}
    </IterableActionForm>
  );
}
