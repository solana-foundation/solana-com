// ISO 3166-1 alpha-2 codes. Display names are resolved by the client with
// Intl.DisplayNames, while the API uses this list to reject unknown values.
export const COUNTRY_CODES = [
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
] as const;

export const INVOLVEMENT_VALUES = [
  "none",
  "events",
  "hackathon",
  "builder",
  "superteam",
  "other",
] as const;

export const MIN_GRADUATION = "2027-01";
export const MAX_BUILD_IDEA_WORDS = 150;

export const APPLICATION_FIELDS = [
  "school",
  "country",
  "major",
  "graduation",
  "videoShipped",
  "videoOrganized",
  "buildIdea",
  "coLeadName",
  "coLeadEmail",
  "involvement",
  "education",
] as const;

export type ApplicationField = (typeof APPLICATION_FIELDS)[number];

export type AmbassadorApplication = Record<ApplicationField, string>;

export type ValidationCode =
  | "required"
  | "maxLength"
  | "country"
  | "graduation"
  | "url"
  | "buildIdea"
  | "email"
  | "coLeadPair"
  | "option";

const VALIDATION_CODES = [
  "required",
  "maxLength",
  "country",
  "graduation",
  "url",
  "buildIdea",
  "email",
  "coLeadPair",
  "option",
] as const satisfies readonly ValidationCode[];

export type ValidationErrors = Partial<
  Record<ApplicationField, ValidationCode>
>;

export function normalizeAmbassadorApplication(
  input: Record<string, unknown>,
): AmbassadorApplication {
  return APPLICATION_FIELDS.reduce((values, field) => {
    values[field] = typeof input[field] === "string" ? input[field].trim() : "";
    return values;
  }, {} as AmbassadorApplication);
}

export function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/u).length : 0;
}

export function isValidationCode(value: unknown): value is ValidationCode {
  return (
    typeof value === "string" &&
    VALIDATION_CODES.includes(value as ValidationCode)
  );
}

export function validateAmbassadorApplication(
  values: AmbassadorApplication,
): ValidationErrors {
  const errors: ValidationErrors = {};

  addRequiredError(errors, values, "school");
  addRequiredError(errors, values, "country");
  addRequiredError(errors, values, "major");
  addRequiredError(errors, values, "graduation");
  addRequiredError(errors, values, "videoShipped");
  addRequiredError(errors, values, "videoOrganized");
  addRequiredError(errors, values, "buildIdea");

  if (values.school.length > 200) {
    errors.school = "maxLength";
  }

  if (values.major.length > 200) {
    errors.major = "maxLength";
  }

  if (
    values.country &&
    !COUNTRY_CODES.includes(values.country as (typeof COUNTRY_CODES)[number])
  ) {
    errors.country = "country";
  }

  if (values.graduation && !isValidGraduation(values.graduation)) {
    errors.graduation = "graduation";
  }

  if (values.videoShipped && !isHttpUrl(values.videoShipped)) {
    errors.videoShipped = "url";
  }

  if (values.videoOrganized && !isHttpUrl(values.videoOrganized)) {
    errors.videoOrganized = "url";
  }

  if (values.buildIdea.length > 3000) {
    errors.buildIdea = "maxLength";
  } else if (
    values.buildIdea &&
    countWords(values.buildIdea) > MAX_BUILD_IDEA_WORDS
  ) {
    errors.buildIdea = "buildIdea";
  }

  if (values.coLeadName.length > 200) {
    errors.coLeadName = "maxLength";
  }

  if (values.coLeadEmail.length > 320) {
    errors.coLeadEmail = "maxLength";
  } else if (values.coLeadEmail && !isEmail(values.coLeadEmail)) {
    errors.coLeadEmail = "email";
  }

  if (values.education.length > 200) {
    errors.education = "maxLength";
  }

  if (Boolean(values.coLeadName) !== Boolean(values.coLeadEmail)) {
    if (!values.coLeadName) {
      errors.coLeadName = "coLeadPair";
    }
    if (!values.coLeadEmail) {
      errors.coLeadEmail = "coLeadPair";
    }
  }

  if (
    values.involvement &&
    !INVOLVEMENT_VALUES.includes(
      values.involvement as (typeof INVOLVEMENT_VALUES)[number],
    )
  ) {
    errors.involvement = "option";
  }

  return errors;
}

function addRequiredError(
  errors: ValidationErrors,
  values: AmbassadorApplication,
  field: ApplicationField,
) {
  if (!values[field]) {
    errors[field] = "required";
  }
}

function isValidGraduation(value: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/u.test(value) && value >= MIN_GRADUATION;
}

function isHttpUrl(value: string) {
  if (value.length > 2048) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value);
}
