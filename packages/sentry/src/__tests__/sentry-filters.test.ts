import { describe, expect, it } from "vitest";

import {
  sentryBeforeSend,
  sentryBeforeSendTransaction,
  sentryTracesSampler,
} from "../index.js";

type TestEvent = {
  exception?: {
    values?: Array<{
      type?: string;
      value?: string;
      mechanism?: { synthetic?: boolean };
      stacktrace?: { frames?: Array<{ filename?: string }> };
    }>;
  };
  extra?: Record<string, unknown>;
  tags?: Record<string, unknown>;
};

const buildSyntheticRejectionEvent = ({
  serialized,
  synthetic = true,
  type = "UnhandledRejection",
}: {
  serialized?: unknown;
  synthetic?: boolean;
  type?: string;
} = {}) => ({
  exception: {
    values: [
      {
        type,
        value:
          "Non-Error promise rejection captured with keys: currentTarget, isTrusted, target, type",
        mechanism: {
          synthetic,
        },
      },
    ],
  },
  extra: {
    __serialized__: serialized,
  },
});

const buildResourceEventPayload = (
  elementMarker: string,
  eventType: string,
) => ({
  currentTarget: `[object ${elementMarker}]`,
  isTrusted: true,
  target: `[object ${elementMarker}]`,
  type: eventType,
});

describe("sentryBeforeSend", () => {
  it("drops events with browser extension stack frames", () => {
    const event = {
      exception: {
        values: [
          {
            type: "TypeError",
            stacktrace: {
              frames: [
                { filename: "chrome-extension://abc123/content-script.js" },
              ],
            },
          },
        ],
      },
    };

    expect(sentryBeforeSend(event)).toBeNull();
  });

  it("drops serialized wallet extension rejections", () => {
    const event = buildSyntheticRejectionEvent({
      serialized: { code: 4001, message: "User rejected the request." },
    });

    expect(sentryBeforeSend(event)).toBeNull();
  });

  it.each(["error", "abort"])(
    "drops resource load rejections for %s events",
    (eventType) => {
      const event = buildSyntheticRejectionEvent({
        serialized: buildResourceEventPayload("HTMLImageElement", eventType),
      });

      expect(sentryBeforeSend(event)).toBeNull();
    },
  );

  it.each([
    "HTMLAudioElement",
    "HTMLIFrameElement",
    "HTMLLinkElement",
    "HTMLScriptElement",
    "HTMLSourceElement",
    "HTMLTrackElement",
    "HTMLVideoElement",
  ])("drops resource load rejections targeting %s", (elementMarker) => {
    const event = buildSyntheticRejectionEvent({
      serialized: buildResourceEventPayload(elementMarker, "error"),
    });

    expect(sentryBeforeSend(event)).toBeNull();
  });

  it("drops resource load rejections with nested element markers", () => {
    const event = buildSyntheticRejectionEvent({
      serialized: {
        type: "error",
        isTrusted: true,
        path: [{ tagName: "IMG", constructor: "HTMLImageElement" }],
      },
    });

    expect(sentryBeforeSend(event)).toBeNull();
  });

  it("keeps rejections whose serialized payload is not a resource event", () => {
    const event = buildSyntheticRejectionEvent({
      serialized: { type: "custom", detail: "application state" },
    });

    expect(sentryBeforeSend(event)).toEqual(event);
  });

  it("keeps resource-shaped rejections that are not synthetic", () => {
    const event = buildSyntheticRejectionEvent({
      serialized: buildResourceEventPayload("HTMLImageElement", "error"),
      synthetic: false,
    });

    expect(sentryBeforeSend(event)).toEqual(event);
  });

  it("keeps resource-shaped rejections with a non-rejection exception type", () => {
    const event = buildSyntheticRejectionEvent({
      serialized: buildResourceEventPayload("HTMLImageElement", "error"),
      type: "TypeError",
    });

    expect(sentryBeforeSend(event)).toEqual(event);
  });

  it("keeps events whose serialized payload mentions elements without an event type", () => {
    const event = buildSyntheticRejectionEvent({
      serialized: { message: "failed to hydrate HTMLImageElement" },
    });

    expect(sentryBeforeSend(event)).toEqual(event);
  });

  it("tags third-party-only stack traces", () => {
    const event: TestEvent = {
      exception: {
        values: [
          {
            type: "TypeError",
            stacktrace: {
              frames: [{ filename: "https://cdn.example.com/widget.js" }],
            },
          },
        ],
      },
    };

    const result = sentryBeforeSend(event);

    expect(result?.tags).toMatchObject({ third_party_code: "true" });
  });

  it("does not tag stack traces that include app frames", () => {
    const event: TestEvent = {
      exception: {
        values: [
          {
            type: "TypeError",
            stacktrace: {
              frames: [
                { filename: "https://cdn.example.com/widget.js" },
                { filename: "app:///_next/static/chunks/main.js" },
              ],
            },
          },
        ],
      },
    };

    const result = sentryBeforeSend(event);

    expect(result?.tags?.third_party_code).toBeUndefined();
  });
});

describe("sentryBeforeSendTransaction", () => {
  it("drops preflight requests", () => {
    expect(
      sentryBeforeSendTransaction({
        request: { method: "OPTIONS", url: "https://solana.com/api/data" },
      }),
    ).toBeNull();
  });

  it("drops oversized span batches", () => {
    expect(
      sentryBeforeSendTransaction({
        transaction: "/some-page",
        spans: Array.from({ length: 101 }, () => ({})),
      }),
    ).toBeNull();
  });

  it("drops health and static asset transactions", () => {
    expect(
      sentryBeforeSendTransaction({ transaction: "/api/health" }),
    ).toBeNull();
    expect(
      sentryBeforeSendTransaction({ transaction: "/_next/static/chunk.js" }),
    ).toBeNull();
  });

  it("keeps page transactions", () => {
    const event = { transaction: "/developers" };

    expect(sentryBeforeSendTransaction(event)).toEqual(event);
  });
});

describe("sentryTracesSampler", () => {
  it("always samples debug transactions", () => {
    expect(
      sentryTracesSampler({
        transactionContext: { name: "/sentry-debug" },
      }),
    ).toBe(1);
  });

  it.each([
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0)",
    "Mozilla/5.0 (compatible; AhrefsBot/7.0)",
    "Mozilla/5.0 HeadlessChrome/120.0.0.0",
    "Screaming Frog SEO Spider/19.0",
  ])("never samples bot traffic (%s)", (userAgent) => {
    expect(
      sentryTracesSampler({
        transactionContext: { name: "/developers" },
        normalizedRequest: {
          headers: { "user-agent": userAgent },
        },
      }),
    ).toBe(0);
  });

  it("does not treat CUBOT phone user agents as bots", () => {
    expect(
      sentryTracesSampler({
        transactionContext: { name: "/developers" },
        normalizedRequest: {
          headers: {
            "user-agent":
              "Mozilla/5.0 (Linux; Android 10; CUBOT NOTE 20) AppleWebKit/537.36",
          },
        },
      }),
    ).toBe(0.1);
  });

  it("never samples health checks or static assets", () => {
    expect(
      sentryTracesSampler({ transactionContext: { name: "/api/health" } }),
    ).toBe(0);
    expect(
      sentryTracesSampler({ transactionContext: { name: "/images/logo.png" } }),
    ).toBe(0);
  });

  it("samples API routes at a lower rate than pages", () => {
    expect(
      sentryTracesSampler({ transactionContext: { name: "/api/data" } }),
    ).toBe(0.01);
    expect(
      sentryTracesSampler({ transactionContext: { name: "/developers" } }),
    ).toBe(0.1);
  });
});
