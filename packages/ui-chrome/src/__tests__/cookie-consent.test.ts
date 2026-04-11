import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

import {
  applyCookieConsent,
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_TTL_MS,
  getCookieConsentBootstrapScript,
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

  it("removes malformed consent when parsing fails", () => {
    const removeItem = vi.fn();
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const consent = readCookieConsent({
      storage: {
        getItem: vi.fn(() => "{"),
        removeItem,
      },
    });

    expect(consent).toBeNull();
    expect(removeItem).toHaveBeenCalledWith(COOKIE_CONSENT_KEY);
    consoleError.mockRestore();
  });

  it("accepts legacy numeric consent values", () => {
    const consent = readCookieConsent({
      storage: {
        getItem: vi.fn(() => "1"),
        removeItem: vi.fn(),
      },
    });

    expect(consent).toBe(true);
  });

  it("accepts legacy string values inside the consent object", () => {
    const consent = readCookieConsent({
      now: 10,
      storage: {
        getItem: vi.fn(() =>
          JSON.stringify({
            value: "0",
            timeToExpire: 100,
          }),
        ),
        removeItem: vi.fn(),
      },
    });

    expect(consent).toBe(false);
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
    const dispatchEvent = vi.fn();
    class CookieConsentCustomEvent extends Event {
      detail: { value: boolean };

      constructor(type: string, init: { detail: { value: boolean } }) {
        super(type);
        this.detail = init.detail;
      }
    }

    applyCookieConsent({
      value: true,
      targetWindow: {
        CustomEvent: CookieConsentCustomEvent as unknown as typeof CustomEvent,
        dispatchEvent,
        gtag,
      },
    });

    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    expect(dispatchEvent.mock.calls[0]?.[0]).toMatchObject({
      detail: { value: true },
      type: COOKIE_CONSENT_EVENT,
    });
  });

  it("bootstrap script keeps denied consent when stored value is expired", () => {
    const gtag = vi.fn();
    const removeItem = vi.fn();
    const script = getCookieConsentBootstrapScript();
    class MockDate extends Date {
      static now() {
        return 11;
      }
    }
    const windowObject: {
      builderNoTrack: boolean;
      dataLayer: unknown[];
      gtag: typeof gtag;
      localStorage?: object;
      window?: object;
    } = {
      dataLayer: [],
      builderNoTrack: false,
      gtag,
    };
    const context = {
      Date: MockDate,
      localStorage: {
        getItem: vi.fn(() =>
          JSON.stringify({
            value: true,
            timeToExpire: 10,
          }),
        ),
        removeItem,
      },
      window: windowObject,
    };

    windowObject.window = windowObject;
    windowObject.localStorage = context.localStorage;
    vm.runInNewContext(script, context);

    expect(removeItem).toHaveBeenCalledWith(COOKIE_CONSENT_KEY);
    expect(windowObject.builderNoTrack).toBe(true);
    expect(gtag).toHaveBeenNthCalledWith(1, "js", expect.any(Date));
    expect(gtag).toHaveBeenNthCalledWith(2, "consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    expect(gtag).toHaveBeenCalledTimes(2);
  });
});
