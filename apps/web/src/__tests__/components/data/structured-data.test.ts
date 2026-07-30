import { describe, expect, it } from "vitest";

import {
  buildDataDashboardJsonLd,
  serializeJsonLd,
} from "@/app/[locale]/data/structured-data";

const topics = [
  {
    name: "Network",
    description: "Validator, stake, and network metrics.",
  },
  {
    name: "RPC",
    description: "Latency metrics for Solana RPC providers.",
  },
];

describe("data dashboard structured data", () => {
  it("describes the localized page and its dataset", () => {
    const structuredData = buildDataDashboardJsonLd({
      title: "Datos de Solana",
      description: "Métricas de la red Solana.",
      locale: "es",
      path: "/es/data",
      topics,
    });

    expect(structuredData["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "WebPage",
          url: "https://solana.com/es/data",
          inLanguage: "es",
        }),
        expect.objectContaining({
          "@type": "Dataset",
          url: "https://solana.com/es/data",
          inLanguage: "es",
          isAccessibleForFree: true,
          variableMeasured: expect.arrayContaining([
            expect.objectContaining({ name: "Network" }),
            expect.objectContaining({ name: "RPC" }),
          ]),
        }),
      ]),
    );
  });

  it("escapes markup-significant characters before embedding JSON-LD", () => {
    expect(
      serializeJsonLd({ name: "</script><script>alert(1)</script>" }),
    ).toBe('{"name":"\\u003c/script>\\u003cscript>alert(1)\\u003c/script>"}');
  });
});
