import { describe, expect, it } from "vitest";

import {
  countWords,
  normalizeAmbassadorApplication,
  validateAmbassadorApplication,
} from "@/lib/university-ambassador/validation";

const validApplication = {
  school: "Solana University",
  country: "NZ",
  email: "applicant@example.com",
  major: "Computer Science",
  graduation: "2027-11",
  videoShipped: "https://example.com/shipped",
  videoOrganized: "https://example.com/organized",
  buildIdea: "A focused idea for campus builders.",
  coLeadName: "",
  coLeadEmail: "",
  involvement: "none",
  education: "",
};

describe("university ambassador application validation", () => {
  it("accepts a complete application", () => {
    expect(validateAmbassadorApplication(validApplication)).toEqual({});
  });

  it("rejects invalid dates, links, and overlong build ideas", () => {
    const errors = validateAmbassadorApplication({
      ...validApplication,
      email: "not-an-email",
      graduation: "2026-12",
      videoShipped: "javascript:alert(1)",
      buildIdea: Array.from({ length: 151 }, () => "word").join(" "),
    });

    expect(errors).toMatchObject({
      email: "email",
      graduation: "graduation",
      videoShipped: "url",
      buildIdea: "buildIdea",
    });
  });

  it("requires the submitter's email", () => {
    expect(
      validateAmbassadorApplication({ ...validApplication, email: "" }),
    ).toEqual({ email: "required" });
  });

  it("requires both optional co-lead fields together", () => {
    const errors = validateAmbassadorApplication({
      ...validApplication,
      coLeadName: "Ada Lovelace",
    });

    expect(errors).toEqual({ coLeadEmail: "coLeadPair" });
  });

  it("accepts an optional free-text education answer", () => {
    expect(
      validateAmbassadorApplication({
        ...validApplication,
        education: "Solana Bootcamp",
      }),
    ).toEqual({});
  });

  it("normalizes non-string values and counts words", () => {
    const values = normalizeAmbassadorApplication({
      ...validApplication,
      school: "  Solana University  ",
      country: 42,
    });

    expect(values.school).toBe("Solana University");
    expect(values.country).toBe("");
    expect(countWords("One   two\nthree")).toBe(3);
  });
});
