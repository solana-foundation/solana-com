import { describe, expect, it } from "vitest";
import {
  buildHackathonArchiveJsonLd,
  serializeJsonLd,
} from "@/app/[locale]/hackathon/structured-data";

describe("hackathon archive structured data", () => {
  const events = [
    { name: "Frontier", description: "Spring 2026" },
    { name: "Cypherpunk", description: "Fall 2025" },
  ];

  it("uses the localized canonical URL and preserves archive order", () => {
    const data = buildHackathonArchiveJsonLd({
      locale: "fr",
      title: "Archives des hackathons Solana",
      description: "Hackathons précédents",
      events,
    });

    expect(data).toMatchObject({
      "@type": "CollectionPage",
      url: "https://solana.com/fr/hackathon",
      inLanguage: "fr",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: 2,
        itemListElement: [
          { position: 1, name: "Frontier" },
          { position: 2, name: "Cypherpunk" },
        ],
      },
    });
  });

  it("escapes markup in translated JSON-LD content", () => {
    expect(serializeJsonLd({ name: "</script><script>" })).toContain(
      "\\u003c/script>\\u003cscript>",
    );
  });
});
