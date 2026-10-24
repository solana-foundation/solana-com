import { vi } from "vitest";

// next/font/google is a build-time (SWC) transform, so under vitest the named
// font exports don't exist. Stub the fonts the docs components import.
vi.mock("next/font/google", () => {
  const font = () => ({ className: "", style: {}, variable: "" });
  return { Space_Grotesk: font, JetBrains_Mono: font };
});
