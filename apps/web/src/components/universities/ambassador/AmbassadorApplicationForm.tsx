"use client";

import React, { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ChevronDown } from "@boxicons/react/ChevronDown";

import {
  APPLICATION_FIELDS,
  COUNTRY_CODES,
  MAX_BUILD_IDEA_WORDS,
  isValidationCode,
  normalizeAmbassadorApplication,
  validateAmbassadorApplication,
  type ApplicationField,
  type ValidationCode,
  type ValidationErrors,
} from "@/lib/university-ambassador/validation";

type FieldTranslation = { label: string; placeholder: string };

interface AmbassadorApplicationFormProps {
  translations: {
    school: FieldTranslation;
    country: { label: string; placeholder: string };
    email: FieldTranslation;
    major: FieldTranslation;
    graduation: FieldTranslation;
    videoShipped: FieldTranslation;
    videoOrganized: FieldTranslation;
    buildIdea: FieldTranslation;
    coLead: {
      label: string;
      namePlaceholder: string;
      emailPlaceholder: string;
    };
    involvement: {
      label: string;
      options: {
        none: string;
        events: string;
        hackathon: string;
        builder: string;
        superteam: string;
        other: string;
      };
    };
    education: FieldTranslation;
    validation: Record<ValidationCode, string>;
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };
}

const LABEL_CLASSES = "font-medium text-[14px] text-black";
const INPUT_CLASSES =
  "h-[50px] w-full rounded-lg border border-[#cfcfd6] bg-white px-4 text-[16px] text-[#1a1a1d] placeholder:text-[#757575] focus:border-black focus:outline-none";
const SELECT_CLASSES =
  "h-[52px] w-full rounded-lg border border-[#cfcfd6] bg-white pl-[19px] pr-10 text-[16px] text-[#1a1a1d] focus:border-black focus:outline-none";
const ERROR_CLASSES = "border-[#b42318]";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

function Field({
  label,
  htmlFor,
  className = "",
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const errorId = `${htmlFor}-error`;

  return (
    <div className={`flex flex-col gap-[9px] ${className}`}>
      <label htmlFor={htmlFor} className={LABEL_CLASSES}>
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} role="alert" className="text-[13px] text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  );
}

function getInputClasses(error?: string) {
  return `${INPUT_CLASSES}${error ? ` ${ERROR_CLASSES}` : ""}`;
}

export function AmbassadorApplicationForm({
  translations: t,
}: AmbassadorApplicationFormProps) {
  const locale = useLocale();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [serverError, setServerError] = useState("");

  const countries = useMemo(() => {
    const displayNames = new Intl.DisplayNames([locale], { type: "region" });
    return COUNTRY_CODES.map((code) => ({
      code,
      name: displayNames.of(code) ?? code,
    })).sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [locale]);

  const validationMessages = t.validation;
  const errorMessage = (field: ApplicationField) => {
    const code = errors[field];
    return code ? validationMessages[code] : undefined;
  };

  const handleInput = (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    const field = target.name as ApplicationField;

    if (!APPLICATION_FIELDS.includes(field)) {
      return;
    }

    setErrors((currentErrors) => {
      if (!currentErrors[field] && status !== "error") {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];

      if (field === "coLeadName") {
        delete nextErrors.coLeadEmail;
      }
      if (field === "coLeadEmail") {
        delete nextErrors.coLeadName;
      }

      return nextErrors;
    });

    if (status === "error") {
      setStatus("idle");
      setServerError("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = normalizeAmbassadorApplication(
      Object.fromEntries(formData.entries()),
    );
    const nextErrors = validateAmbassadorApplication(values);

    setErrors(nextErrors);
    setServerError("");

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = APPLICATION_FIELDS.find(
        (field) => nextErrors[field],
      );
      const firstInvalidElement = firstInvalidField
        ? form.elements.namedItem(firstInvalidField)
        : null;

      if (firstInvalidElement instanceof HTMLElement) {
        firstInvalidElement.focus();
      }

      setStatus("idle");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/university-ambassador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          locale,
          website: formData.get("website"),
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (isRecord(payload) && isValidationErrors(payload.fieldErrors)) {
          setErrors(payload.fieldErrors);
        }

        setServerError(
          isRecord(payload) && typeof payload.error === "string"
            ? payload.error
            : t.error,
        );
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setServerError(t.error);
      setStatus("error");
    }
  };

  const schoolError = errorMessage("school");
  const countryError = errorMessage("country");
  const emailError = errorMessage("email");
  const majorError = errorMessage("major");
  const graduationError = errorMessage("graduation");
  const videoShippedError = errorMessage("videoShipped");
  const videoOrganizedError = errorMessage("videoOrganized");
  const buildIdeaError = errorMessage("buildIdea");
  const coLeadNameError = errorMessage("coLeadName");
  const coLeadEmailError = errorMessage("coLeadEmail");
  const involvementError = errorMessage("involvement");
  const educationError = errorMessage("education");

  return (
    <form
      noValidate
      onInput={handleInput}
      onSubmit={handleSubmit}
      aria-busy={status === "submitting"}
      className="grid grid-cols-1 content-start gap-x-[18px] gap-y-6 sm:grid-cols-2"
    >
      <Field
        label={t.school.label}
        htmlFor="ambassador-school"
        error={schoolError}
      >
        <input
          id="ambassador-school"
          name="school"
          type="text"
          required
          maxLength={200}
          autoComplete="organization"
          placeholder={t.school.placeholder}
          aria-invalid={Boolean(schoolError)}
          aria-describedby={schoolError ? "ambassador-school-error" : undefined}
          className={getInputClasses(schoolError)}
        />
      </Field>

      <Field
        label={t.country.label}
        htmlFor="ambassador-country"
        error={countryError}
      >
        <div className="relative">
          <select
            id="ambassador-country"
            name="country"
            required
            defaultValue=""
            aria-invalid={Boolean(countryError)}
            aria-describedby={
              countryError ? "ambassador-country-error" : undefined
            }
            className={`${SELECT_CLASSES} appearance-none invalid:text-[#757575]${countryError ? ` ${ERROR_CLASSES}` : ""}`}
          >
            <option value="" disabled>
              {t.country.placeholder}
            </option>
            {countries.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown
            width={14}
            height={14}
            fill="#1a1a1d"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          />
        </div>
      </Field>

      <Field
        label={t.email.label}
        htmlFor="ambassador-email"
        error={emailError}
      >
        <input
          id="ambassador-email"
          name="email"
          type="email"
          required
          maxLength={320}
          autoComplete="email"
          inputMode="email"
          placeholder={t.email.placeholder}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "ambassador-email-error" : undefined}
          className={getInputClasses(emailError)}
        />
      </Field>

      <Field
        label={t.major.label}
        htmlFor="ambassador-major"
        error={majorError}
      >
        <input
          id="ambassador-major"
          name="major"
          type="text"
          required
          maxLength={200}
          placeholder={t.major.placeholder}
          aria-invalid={Boolean(majorError)}
          aria-describedby={majorError ? "ambassador-major-error" : undefined}
          className={getInputClasses(majorError)}
        />
      </Field>

      <Field
        label={t.graduation.label}
        htmlFor="ambassador-graduation"
        error={graduationError}
      >
        <input
          id="ambassador-graduation"
          name="graduation"
          type="month"
          required
          min="2027-01"
          aria-invalid={Boolean(graduationError)}
          aria-describedby={
            graduationError ? "ambassador-graduation-error" : undefined
          }
          placeholder={t.graduation.placeholder}
          className={getInputClasses(graduationError)}
        />
      </Field>

      <Field
        label={t.videoShipped.label}
        htmlFor="ambassador-video-shipped"
        className="sm:col-span-2"
        error={videoShippedError}
      >
        <input
          id="ambassador-video-shipped"
          name="videoShipped"
          type="url"
          required
          maxLength={2048}
          inputMode="url"
          placeholder={t.videoShipped.placeholder}
          aria-invalid={Boolean(videoShippedError)}
          aria-describedby={
            videoShippedError ? "ambassador-video-shipped-error" : undefined
          }
          className={getInputClasses(videoShippedError)}
        />
      </Field>

      <Field
        label={t.videoOrganized.label}
        htmlFor="ambassador-video-organized"
        className="sm:col-span-2"
        error={videoOrganizedError}
      >
        <input
          id="ambassador-video-organized"
          name="videoOrganized"
          type="url"
          required
          maxLength={2048}
          inputMode="url"
          placeholder={t.videoOrganized.placeholder}
          aria-invalid={Boolean(videoOrganizedError)}
          aria-describedby={
            videoOrganizedError ? "ambassador-video-organized-error" : undefined
          }
          className={getInputClasses(videoOrganizedError)}
        />
      </Field>

      <Field
        label={t.buildIdea.label}
        htmlFor="ambassador-build-idea"
        className="sm:col-span-2"
        error={buildIdeaError}
      >
        <textarea
          id="ambassador-build-idea"
          name="buildIdea"
          required
          rows={3}
          maxLength={3000}
          placeholder={t.buildIdea.placeholder}
          aria-invalid={Boolean(buildIdeaError)}
          aria-describedby={
            buildIdeaError ? "ambassador-build-idea-error" : undefined
          }
          className={`${getInputClasses(buildIdeaError)} h-[106px] resize-none py-[15px]`}
        />
        <p className="text-[12px] text-[#6d6d78]">
          {MAX_BUILD_IDEA_WORDS} words maximum.
        </p>
      </Field>

      <Field
        label={t.coLead.label}
        htmlFor="ambassador-co-lead-name"
        error={coLeadNameError}
      >
        <input
          id="ambassador-co-lead-name"
          name="coLeadName"
          type="text"
          maxLength={200}
          autoComplete="name"
          placeholder={t.coLead.namePlaceholder}
          aria-invalid={Boolean(coLeadNameError)}
          aria-describedby={
            coLeadNameError ? "ambassador-co-lead-name-error" : undefined
          }
          className={getInputClasses(coLeadNameError)}
        />
      </Field>

      <div className="flex h-full flex-col justify-end gap-[9px]">
        <label htmlFor="ambassador-co-lead-email" className="sr-only">
          {t.coLead.emailPlaceholder}
        </label>
        <input
          id="ambassador-co-lead-email"
          name="coLeadEmail"
          type="email"
          maxLength={320}
          autoComplete="email"
          placeholder={t.coLead.emailPlaceholder}
          aria-invalid={Boolean(coLeadEmailError)}
          aria-describedby={
            coLeadEmailError ? "ambassador-co-lead-email-error" : undefined
          }
          className={getInputClasses(coLeadEmailError)}
        />
        {coLeadEmailError && (
          <p
            id="ambassador-co-lead-email-error"
            role="alert"
            className="text-[13px] text-[#b42318]"
          >
            {coLeadEmailError}
          </p>
        )}
      </div>

      <Field
        label={t.involvement.label}
        htmlFor="ambassador-involvement"
        error={involvementError}
      >
        <div className="relative">
          <select
            id="ambassador-involvement"
            name="involvement"
            defaultValue="none"
            aria-invalid={Boolean(involvementError)}
            aria-describedby={
              involvementError ? "ambassador-involvement-error" : undefined
            }
            className={`${SELECT_CLASSES} appearance-none${involvementError ? ` ${ERROR_CLASSES}` : ""}`}
          >
            {(
              Object.entries(t.involvement.options) as Array<[string, string]>
            ).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            width={14}
            height={14}
            fill="#1a1a1d"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          />
        </div>
      </Field>

      <Field
        label={t.education.label}
        htmlFor="ambassador-education"
        error={educationError}
      >
        <input
          id="ambassador-education"
          name="education"
          type="text"
          maxLength={200}
          placeholder={t.education.placeholder}
          aria-invalid={Boolean(educationError)}
          aria-describedby={
            educationError ? "ambassador-education-error" : undefined
          }
          className={getInputClasses(educationError)}
        />
      </Field>

      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      <div className="mt-[10px] sm:col-span-2">
        <button
          type="submit"
          disabled={status === "submitting" || status === "success"}
          className="flex h-[54px] w-full items-center justify-center gap-2 rounded-full !bg-black text-[17px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? t.submitting : t.submit}
          {status !== "submitting" && status !== "success" && (
            <ArrowRight width={24} height={24} fill="currentColor" />
          )}
        </button>
        {status === "success" && (
          <p
            role="status"
            className="mt-4 text-center text-[15px] text-[#146c43]"
          >
            {t.success}
          </p>
        )}
        {status === "error" && (
          <p
            role="alert"
            className="mt-4 text-center text-[15px] text-[#b42318]"
          >
            {serverError || t.error}
          </p>
        )}
      </div>
    </form>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isValidationErrors(value: unknown): value is ValidationErrors {
  if (!isRecord(value)) {
    return false;
  }

  return Object.keys(value).every((key) => {
    return (
      APPLICATION_FIELDS.includes(key as ApplicationField) &&
      isValidationCode(value[key])
    );
  });
}
