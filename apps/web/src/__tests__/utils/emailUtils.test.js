import { isValidEmail } from "@/utils/emailUtils";

describe("isValidEmail", () => {
  it("accepts common valid email formats", () => {
    expect(isValidEmail("user.name+tag@example.com")).toBe(true);
  });

  it("accepts valid emails with long top-level domains", () => {
    expect(isValidEmail("builder@solana.technology")).toBe(true);
  });

  it("rejects malformed email addresses", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("user@example")).toBe(false);
  });
});
