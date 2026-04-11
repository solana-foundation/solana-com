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

const evaluateBootstrapConsent = ({
  now,
  storedValue,
}: {
  now: number;
  storedValue: string | null;
}) => {
  const gtag = vi.fn();
  const removeItem = vi.fn();
  const script = getCookieConsentBootstrapScript();

  class MockDate extends Date {
    static now() {
      return now;
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
      getItem: vi.fn(() => storedValue),
      removeItem,
    },
    window: windowObject,
  };

  windowObject.window = windowObject;
  windowObject.localStorage = context.localStorage;
  vm.runInNewContext(script, context);

  const consentUpdateCall = gtag.mock.calls.find(
    ([command, action]) => command === "consent" && action === "update",
  );

  return {
    consentUpdateCall,
    gtag,
    removeItem,
    windowObject,
  };
};

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

  it("bootstrap script stays in parity with readCookieConsent across storage shapes", () => {
    const cases = [
      { label: "no value", now: 10, storedValue: null },
      { label: "legacy numeric true", now: 10, storedValue: "1" },
      { label: "legacy numeric false", now: 10, storedValue: "0" },
      { label: "legacy string true", now: 10, storedValue: '"true"' },
      { label: "legacy string false", now: 10, storedValue: '"false"' },
      {
        label: "object true",
        now: 10,
        storedValue: JSON.stringify({
          value: true,
          timeToExpire: 100,
        }),
      },
      {
        label: "object false via string",
        now: 10,
        storedValue: JSON.stringify({
          value: "0",
          timeToExpire: 100,
        }),
      },
      {
        label: "expired object",
        now: 11,
        storedValue: JSON.stringify({
          value: true,
          timeToExpire: 10,
        }),
      },
      {
        label: "malformed object",
        now: 10,
        storedValue: JSON.stringify({
          timeToExpire: 100,
        }),
      },
      { label: "invalid json", now: 10, storedValue: "{" },
    ] as const;

    for (const testCase of cases) {
      const removeItem = vi.fn();
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);
      const expectedConsent = readCookieConsent({
        now: testCase.now,
        storage: {
          getItem: vi.fn(() => testCase.storedValue),
          removeItem,
        },
      });
      consoleError.mockRestore();

      const bootstrapResult = evaluateBootstrapConsent(testCase);

      expect(
        bootstrapResult.gtag.mock.calls[0],
        `${testCase.label}: initializes gtag`,
      ).toMatchObject(["js", expect.any(Date)]);
      expect(
        bootstrapResult.gtag.mock.calls[1],
        `${testCase.label}: sets denied default`,
      ).toEqual([
        "consent",
        "default",
        {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          analytics_storage: "denied",
        },
      ]);

      if (expectedConsent === null) {
        expect(
          bootstrapResult.consentUpdateCall,
          `${testCase.label}: should not grant consent`,
        ).toBeUndefined();
        expect(
          bootstrapResult.windowObject.builderNoTrack,
          `${testCase.label}: builder should stay blocked`,
        ).toBe(true);
      } else {
        expect(
          bootstrapResult.consentUpdateCall,
          `${testCase.label}: should update consent`,
        ).toEqual([
          "consent",
          "update",
          {
            ad_storage: expectedConsent ? "granted" : "denied",
            ad_user_data: expectedConsent ? "granted" : "denied",
            ad_personalization: expectedConsent ? "granted" : "denied",
            analytics_storage: expectedConsent ? "granted" : "denied",
          },
        ]);
        expect(
          bootstrapResult.windowObject.builderNoTrack,
          `${testCase.label}: builder should match consent`,
        ).toBe(!expectedConsent);
      }

      expect(
        bootstrapResult.removeItem.mock.calls,
        `${testCase.label}: cleanup parity`,
      ).toEqual(removeItem.mock.calls);
    }
  });
});
