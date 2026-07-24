import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  resolveVariant,
  resolveVariantFromParams,
  VARIANTS,
} from "@/content/variants";
import { useVariant } from "@/lib/use-variant";

describe("resolveVariant", () => {
  it("resolves every configured variant slug", () => {
    for (const slug of Object.keys(VARIANTS)) {
      expect(resolveVariant(slug)?.slug).toBe(slug);
    }
  });

  it("is case-insensitive", () => {
    expect(resolveVariant("Developers")?.slug).toBe("developers");
    expect(resolveVariant("GENERAL")?.slug).toBe("general");
  });

  it("falls back to null for missing or unknown values", () => {
    expect(resolveVariant(null)).toBeNull();
    expect(resolveVariant(undefined)).toBeNull();
    expect(resolveVariant("")).toBeNull();
    expect(resolveVariant("gaming")).toBeNull();
    expect(resolveVariant("developers ")).toBeNull();
  });

  it("ignores inherited object property names", () => {
    expect(resolveVariant("__proto__")).toBeNull();
    expect(resolveVariant("constructor")).toBeNull();
    expect(resolveVariant("toString")).toBeNull();
  });
});

describe("resolveVariantFromParams", () => {
  it("prefers ?v= over utm_content", () => {
    const params = new URLSearchParams("v=general&utm_content=finance");
    expect(resolveVariantFromParams(params)?.slug).toBe("general");
  });

  it("falls back to an exact-slug utm_content when v is absent", () => {
    const params = new URLSearchParams(
      "utm_source=meta&utm_content=developers",
    );
    expect(resolveVariantFromParams(params)?.slug).toBe("developers");
  });

  it("ignores creative-level utm_content values", () => {
    const params = new URLSearchParams("utm_content=finance-video-b");
    expect(resolveVariantFromParams(params)).toBeNull();
  });

  it("returns null with no params", () => {
    expect(resolveVariantFromParams(new URLSearchParams(""))).toBeNull();
  });
});

describe("variant configs", () => {
  it("carry complete copy for every swapped section", () => {
    for (const variant of Object.values(VARIANTS)) {
      expect(variant.heroHeadline).toBeTruthy();
      expect(variant.heroCtaLabel).toBeTruthy();
      expect(variant.heroCtaHref).toBeTruthy();
      expect(variant.positioningStatement).toBeTruthy();
      expect(variant.ticketsHeadline).toBeTruthy();
      expect(variant.narrativeParagraphs.length).toBeGreaterThanOrEqual(3);
      expect(variant.narrativeParagraphs.length).toBeLessThanOrEqual(4);
      expect(variant.carouselItems.length).toBeGreaterThanOrEqual(3);
      for (const item of variant.carouselItems) {
        expect(item.id).toBeTruthy();
        expect(item.title).toBeTruthy();
        expect(item.url).toBeTruthy();
      }
      expect(variant.stats.length).toBeGreaterThanOrEqual(3);
      expect(variant.stats.length).toBeLessThanOrEqual(4);
      for (const stat of variant.stats) {
        expect(stat.value).toBeTruthy();
        expect(stat.label).toBeTruthy();
      }
      expect(Array.isArray(variant.talkUrls)).toBe(true);
    }
  });
});

function VariantProbe() {
  const variant = useVariant();
  return <output>{variant?.slug ?? "default"}</output>;
}

describe("useVariant", () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState(null, "", "/");
  });

  it("resolves the variant from ?v= after hydration", async () => {
    window.history.replaceState(null, "", "/?v=finance&utm_source=brave");
    render(<VariantProbe />);
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("finance");
    });
  });

  it("renders the default when the param is absent or unknown", async () => {
    window.history.replaceState(null, "", "/?v=unknown");
    render(<VariantProbe />);
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("default");
    });
  });
});
