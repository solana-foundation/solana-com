"use client";

import React, { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ChevronDown } from "@boxicons/react/ChevronDown";

// ISO 3166-1 alpha-2 codes; display names are resolved per-locale at render
// time via Intl.DisplayNames so the list never needs translating by hand.
const COUNTRY_CODES = [
  "AD",
  "AE",
  "AF",
  "AG",
  "AL",
  "AM",
  "AO",
  "AR",
  "AT",
  "AU",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BN",
  "BO",
  "BR",
  "BS",
  "BT",
  "BW",
  "BY",
  "BZ",
  "CA",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CU",
  "CV",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "ER",
  "ES",
  "ET",
  "FI",
  "FJ",
  "FM",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GH",
  "GM",
  "GN",
  "GQ",
  "GR",
  "GT",
  "GW",
  "GY",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IN",
  "IQ",
  "IR",
  "IS",
  "IT",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KI",
  "KM",
  "KN",
  "KP",
  "KR",
  "KW",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "ME",
  "MG",
  "MH",
  "MK",
  "ML",
  "MM",
  "MN",
  "MR",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NE",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PG",
  "PH",
  "PK",
  "PL",
  "PS",
  "PT",
  "PW",
  "PY",
  "QA",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SG",
  "SI",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "SS",
  "ST",
  "SV",
  "SY",
  "SZ",
  "TD",
  "TG",
  "TH",
  "TJ",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TV",
  "TW",
  "TZ",
  "UA",
  "UG",
  "US",
  "UY",
  "UZ",
  "VC",
  "VE",
  "VN",
  "VU",
  "WS",
  "YE",
  "ZA",
  "ZM",
  "ZW",
];

type FieldTranslation = { label: string; placeholder: string };

interface AmbassadorApplicationFormProps {
  translations: {
    school: FieldTranslation;
    country: { label: string; placeholder: string };
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
    education: {
      label: string;
      options: {
        none: string;
        completed: string;
      };
    };
    submit: string;
    notOpen: string;
  };
}

const LABEL_CLASSES = "font-medium text-[14px] text-black";
const INPUT_CLASSES =
  "h-[50px] w-full rounded-lg border border-[#cfcfd6] bg-white px-4 text-[16px] text-[#1a1a1d] placeholder:text-[#757575] focus:border-black focus:outline-none";
const SELECT_CLASSES =
  "h-[52px] w-full rounded-lg border border-[#cfcfd6] bg-white pl-[19px] pr-10 text-[16px] text-[#1a1a1d] focus:border-black focus:outline-none";

function Field({
  label,
  htmlFor,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-[9px] ${className}`}>
      <label htmlFor={htmlFor} className={LABEL_CLASSES}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function AmbassadorApplicationForm({
  translations: t,
}: AmbassadorApplicationFormProps) {
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);

  const countries = useMemo(() => {
    const displayNames = new Intl.DisplayNames([locale], { type: "region" });
    return COUNTRY_CODES.map((code) => ({
      code,
      name: displayNames.of(code) ?? code,
    })).sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [locale]);

  // Applications open Aug 21; there is no submission endpoint yet, so the
  // form validates and then surfaces the opening date instead of submitting.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 content-start gap-x-[18px] gap-y-6 sm:grid-cols-2"
    >
      <Field label={t.school.label} htmlFor="ambassador-school">
        <input
          id="ambassador-school"
          name="school"
          type="text"
          required
          placeholder={t.school.placeholder}
          className={INPUT_CLASSES}
        />
      </Field>

      <Field label={t.country.label} htmlFor="ambassador-country">
        <div className="relative">
          <select
            id="ambassador-country"
            name="country"
            required
            defaultValue=""
            className={`${SELECT_CLASSES} appearance-none invalid:text-[#757575]`}
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

      <Field label={t.major.label} htmlFor="ambassador-major">
        <input
          id="ambassador-major"
          name="major"
          type="text"
          required
          placeholder={t.major.placeholder}
          className={INPUT_CLASSES}
        />
      </Field>

      <Field label={t.graduation.label} htmlFor="ambassador-graduation">
        <input
          id="ambassador-graduation"
          name="graduation"
          type="text"
          required
          placeholder={t.graduation.placeholder}
          className={INPUT_CLASSES}
        />
      </Field>

      <Field
        label={t.videoShipped.label}
        htmlFor="ambassador-video-shipped"
        className="sm:col-span-2"
      >
        <input
          id="ambassador-video-shipped"
          name="videoShipped"
          type="url"
          required
          placeholder={t.videoShipped.placeholder}
          className={INPUT_CLASSES}
        />
      </Field>

      <Field
        label={t.videoOrganized.label}
        htmlFor="ambassador-video-organized"
        className="sm:col-span-2"
      >
        <input
          id="ambassador-video-organized"
          name="videoOrganized"
          type="url"
          required
          placeholder={t.videoOrganized.placeholder}
          className={INPUT_CLASSES}
        />
      </Field>

      <Field
        label={t.buildIdea.label}
        htmlFor="ambassador-build-idea"
        className="sm:col-span-2"
      >
        <textarea
          id="ambassador-build-idea"
          name="buildIdea"
          required
          rows={3}
          placeholder={t.buildIdea.placeholder}
          className={`${INPUT_CLASSES} h-[106px] resize-none py-[15px]`}
        />
      </Field>

      <Field label={t.coLead.label} htmlFor="ambassador-co-lead-name">
        <input
          id="ambassador-co-lead-name"
          name="coLeadName"
          type="text"
          placeholder={t.coLead.namePlaceholder}
          className={INPUT_CLASSES}
        />
      </Field>

      <div className="flex h-full flex-col justify-end">
        <input
          id="ambassador-co-lead-email"
          name="coLeadEmail"
          type="email"
          aria-label={t.coLead.emailPlaceholder}
          placeholder={t.coLead.emailPlaceholder}
          className={INPUT_CLASSES}
        />
      </div>

      <Field label={t.involvement.label} htmlFor="ambassador-involvement">
        <div className="relative">
          <select
            id="ambassador-involvement"
            name="involvement"
            defaultValue="none"
            className={`${SELECT_CLASSES} appearance-none`}
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

      <Field label={t.education.label} htmlFor="ambassador-education">
        <div className="relative">
          <select
            id="ambassador-education"
            name="education"
            defaultValue="none"
            className={`${SELECT_CLASSES} appearance-none`}
          >
            {(
              Object.entries(t.education.options) as Array<[string, string]>
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

      <div className="mt-[10px] sm:col-span-2">
        <button
          type="submit"
          className="flex h-[54px] w-full items-center justify-center gap-2 rounded-full !bg-black text-[17px] text-white transition-opacity hover:opacity-90"
        >
          {t.submit}
          <ArrowRight width={24} height={24} fill="currentColor" />
        </button>
        {submitted && (
          <p
            role="status"
            className="mt-4 text-center text-[15px] text-[#565662]"
          >
            {t.notOpen}
          </p>
        )}
      </div>
    </form>
  );
}
