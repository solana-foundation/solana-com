import { describe, expect, it, vi } from "vitest";
import enNav from "@@/content/navigation/en.json";
import enLabels from "@@/content/navigation/en/labels.json";

// Japanese labels as Lingo would write them (only some translated yet).
vi.mock("@@/content/navigation/ja/labels.json", () => ({
  default: {
    tabs: { payments: "支払い", "start-here": "はじめに" },
    groups: { "payment-basics": "支払いの基本", "build-a-checkout": "" },
    tags: { "30-min": "約30分" },
  },
}));

// Every nav path is an English page titled after its last segment.
vi.mock("@/lib/docs/source", () => ({
  docsSource: {
    getPage(slugs: string[]) {
      const path = slugs.join("/");
      return {
        path: `en/${path}.mdx`,
        url: `/${path}`,
        slugs,
        locale: "en",
        data: { title: slugs.at(-1) ?? "docs" },
      };
    },
    getPages: () => [],
  },
}));

const { getDocsNavigation } = await import("@/lib/docs/navigation");
const { getDocsTabs } = await import("@/data/developers/docs-nav");
const { labelSlug, navLabel } = await import("@/lib/docs/nav-labels");

type Entry =
  | string
  | {
      group?: string;
      tag?: string;
      type?: string;
      title?: string;
      pages?: Entry[];
    };
type Tab = { tab: string; groups?: Entry[]; pages?: Entry[] };

/** Every label navigation/en.json shows, by labels-file section. */
function navLabels() {
  const out = {
    tabs: [] as string[],
    groups: [] as string[],
    links: [] as string[],
    tags: [] as string[],
  };
  const entry = (e: Entry) => {
    if (typeof e === "string") return;
    if (e.type === "link") out.links.push(e.title!);
    if (e.group) out.groups.push(e.group);
    if (e.tag) out.tags.push(e.tag);
    e.pages?.forEach(entry);
  };
  for (const tab of enNav.tabs as Tab[]) {
    out.tabs.push(tab.tab);
    tab.groups?.forEach(entry);
    tab.pages?.forEach(entry);
  }
  return out;
}

describe("navigation labels", () => {
  it("en/labels.json lists every label of navigation/en.json (run gen:nav-labels)", () => {
    const labels = enLabels as Record<string, Record<string, string>>;
    for (const [section, list] of Object.entries(navLabels()))
      for (const label of list)
        expect(
          labels[section]?.[labelSlug(label)],
          `${section}: ${label}`,
        ).toBe(label);
  });

  it("shows a locale's label, and English where it has none", () => {
    expect(navLabel("ja", "tabs", "Payments")).toBe("支払い");
    expect(navLabel("ja", "tabs", "Markets")).toBe("Markets");
    // An empty translation is no translation.
    expect(navLabel("ja", "groups", "Build a checkout")).toBe(
      "Build a checkout",
    );
    expect(navLabel("de", "tabs", "Payments")).toBe("Payments");
    expect(navLabel("en", "tags", "~30 min")).toBe("~30 min");
    expect(navLabel("ja", "tags", undefined)).toBeUndefined();
  });

  it("localizes the docs tabs, sidebar groups, tags and breadcrumbs", () => {
    const en = getDocsNavigation("en");
    const ja = getDocsNavigation("ja");
    const payments = (nav: typeof en) =>
      nav.tabs.find((tab) => tab.key === "payments")!;
    expect(payments(en).title).toBe("Payments");
    expect(payments(ja).title).toBe("支払い");
    // Keys and URLs stay the English slugs and the locale's URLs.
    expect(payments(ja).key).toBe("payments");
    expect(payments(ja).url).toBe("/ja/developers/docs/payments");
    expect(payments(ja).tree.name).toBe("支払い");
    expect(ja.tabs.find((tab) => tab.key === "markets")!.title).toBe("Markets");

    const groups = (nav: typeof en) =>
      payments(nav).items.flatMap((node) =>
        node.kind === "group" ? [node, ...node.children] : [],
      );
    expect(groups(en).map((g) => g.title)).toContain("Payment basics");
    expect(groups(ja).map((g) => g.title)).toContain("支払いの基本");
    const checkout = groups(ja).find(
      (g) => g.kind === "group" && g.tag === "約30分",
    );
    expect(checkout?.title).toBe("Build a checkout");

    const where = ja.byUrl.get(
      "/ja/developers/docs/payments/how-payments-work",
    );
    expect(where?.groups.map((g) => g.title)).toEqual(["支払いの基本"]);
  });

  it("localizes the /developers landing tabs", () => {
    expect(getDocsTabs("ja")[0]!.label).toBe("はじめに");
    expect(getDocsTabs("ja")[1]).toMatchObject({
      key: "payments",
      label: "支払い",
      href: "/ja/developers/docs/payments",
    });
    expect(getDocsTabs("en")[1]!.label).toBe("Payments");
  });
});
