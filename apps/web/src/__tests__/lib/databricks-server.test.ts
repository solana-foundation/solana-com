import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  DataApiResponseError,
  getDataApiConfig,
  getDataApiMetricRows,
} from "@/lib/databricks/server";

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: "",
    json: () => Promise.resolve(body),
  } as Response;
}

describe("data-api metrics client", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("normalizes valid environment configuration", () => {
    vi.stubEnv("DATA_API_URL", "https://data.solana.com/");
    vi.stubEnv("DATA_API_KEY", "test-key");

    expect(getDataApiConfig()).toEqual({
      ok: true,
      config: {
        baseUrl: "https://data.solana.com",
        apiKey: "test-key",
      },
    });
  });

  it("reports missing and invalid environment configuration", () => {
    vi.stubEnv("DATA_API_URL", "http://data.solana.com");
    vi.stubEnv("DATA_API_KEY", "");

    expect(getDataApiConfig()).toEqual({
      ok: false,
      invalidEnv: ["DATA_API_URL"],
      missingEnv: ["DATA_API_KEY"],
    });
  });

  it("fetches /metrics with the api key header and maps rows", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        source: "databricks",
        data: {
          generatedAt: "2026-09-10T10:08:27.042247+00:00",
          truncated: false,
          rows: [
            {
              date: "2026-07-20",
              metric_name: "TPS",
              provider_name: "Dune",
              unit: "transactions/second",
              value: "123.5",
            },
            {
              date: "2026-07-20",
              metric_name: null,
              provider_name: "Dune",
              unit: "transactions/second",
              value: 456,
            },
          ],
        },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const result = await getDataApiMetricRows({
      baseUrl: "https://data.solana.com",
      apiKey: "test-key",
    });

    expect(fetchMock).toHaveBeenCalledWith("https://data.solana.com/metrics", {
      cache: "no-store",
      headers: { "x-api-key": "test-key" },
    });
    expect(result).toEqual({
      rows: [
        {
          date: "2026-07-20",
          metricName: "TPS",
          providerName: "Dune",
          unit: "transactions/second",
          value: 123.5,
        },
      ],
      truncated: false,
    });
  });

  it("throws on a non-OK response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        statusText: "Bad Gateway",
        json: () => Promise.resolve(null),
      }),
    );

    await expect(
      getDataApiMetricRows({
        baseUrl: "https://data.solana.com",
        apiKey: "test-key",
      }),
    ).rejects.toThrow(DataApiResponseError);
  });

  it("throws on a malformed payload", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(200, {})));

    await expect(
      getDataApiMetricRows({
        baseUrl: "https://data.solana.com",
        apiKey: "test-key",
      }),
    ).rejects.toThrow(DataApiResponseError);
  });
});
