import { describe, expect, it, vi } from "vitest";

import {
  applyCookieConsent,
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_TTL_MS,
  getCookieConsentDefaultScript,
  persistCookieConsent,
  readCookieConsent,
} from "../cookie-consent";

describe("cookie consent helpers", () => {
  it("returns null and removes expired consent instead of reviving it", () => {
    const removeItem = vi.fn();
    const storage = {
      getItem: vi.fn(() =>
        JSON.stringify({
          value: true,
          timeToExpire: 10,
        }),
      ),
      removeItem,
    };

    const consent = readCookieConsent({
      now: 11,
      storage,
    });

    expect(consent).toBeNull();
    expect(removeItem).toHaveBeenCalledWith(COOKIE_CONSENT_KEY);
  });

  it("returns null and removes malformed consent without a value", () => {
    const removeItem = vi.fn();
    const storage = {
      getItem: vi.fn(() =>
        JSON.stringify({
          timeToExpire: 100,
        }),
      ),
      removeItem,
    };

    const consent = readCookieConsent({
      now: 10,
      storage,
    });

    expect(consent).toBeNull();
    expect(removeItem).toHaveBeenCalledWith(COOKIE_CONSENT_KEY);
  });

  it("persists consent with the shared ttl", () => {
    const setItem = vi.fn();

    persistCookieConsent({
      now: 100,
      storage: { setItem },
      value: false,
    });

    expect(setItem).toHaveBeenCalledWith(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        value: false,
        timeToExpire: 100 + COOKIE_CONSENT_TTL_MS,
      }),
    );
  });

  it("updates builder tracking even when gtag is unavailable", () => {
    const targetWindow = {};

    applyCookieConsent({
      value: false,
      targetWindow,
    });

    expect(targetWindow).toMatchObject({
      builderNoTrack: true,
    });
  });

  it("updates gtag consent when available", () => {
    const gtag = vi.fn();

    applyCookieConsent({
      value: true,
      targetWindow: {
        gtag,
      },
    });

    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
  });

  it("includes denied-by-default consent mode settings for pre-GTM bootstrap", () => {
    expect(getCookieConsentDefaultScript()).toContain(
      "window.gtag('consent', 'default'",
    );
    expect(getCookieConsentDefaultScript()).toContain(
      "security_storage: 'granted'",
    );
    expect(getCookieConsentDefaultScript()).toContain("wait_for_update: 500");
  });
});
