import { describe, expect, it } from "vitest";
import {
  buildCandidates,
  matchCandidates,
} from "@/components/pages/here-for/typeahead";
import { buildGraphIndex } from "@/components/pages/here-for/graph-index";
import type { HereForGraphPayload } from "@/lib/here-for/types";

const graph = buildGraphIndex({
  version: "t",
  generatedAt: "",
  handles: ["@toly", "@tolyfan", "@mert"],
  claimed: [1, 1, 1],
  positions: [0, 0, 0, 1, 1, 1, 2, 2, 2],
  community: [0, 0, 0],
  communities: [{ id: 0, size: 3, label: "@toly" }],
  links: [1, 0, 2, 0, 0, 2],
  inDegree: [2, 0, 1],
} satisfies HereForGraphPayload);
const directory = {
  entries: [
    ["aeyakovenko", "Anatoly Yakovenko"],
    ["toly", "toly 🇺🇸"],
    ["rajgokal", "Raj Gokal"],
    ["jose", "José Martín"],
  ] as [string, string][],
};
const candidates = buildCandidates(graph, directory);
const find = (draft: string, taken: string[] = []) =>
  matchCandidates(candidates, draft, new Set(taken), 5).map((c) => c.handle);

describe("here-for typeahead", () => {
  it("lists map people first, then the directory, without duplicates", () => {
    expect(candidates.map((c) => c.handle)).toEqual([
      "@toly",
      "@mert",
      "@tolyfan",
      "@aeyakovenko",
      "@rajgokal",
      "@jose",
    ]);
    // A directory name fills in for someone already on the map.
    expect(candidates[0]).toMatchObject({ name: "toly 🇺🇸", addedBy: 2 });
  });

  it("finds people by any word of their name, ignoring accents", () => {
    expect(find("anatoly")).toEqual(["@aeyakovenko", "@anatoly"]);
    expect(find("gokal")).toEqual(["@rajgokal", "@gokal"]);
    expect(find("marti")).toEqual(["@jose", "@marti"]);
  });

  it("puts an exact handle first, then prefixes, names and substrings", () => {
    expect(find("@TOLY")).toEqual(["@toly", "@tolyfan"]);
    expect(find("raj")).toEqual(["@rajgokal", "@raj"]);
    expect(find("yak")).toEqual(["@aeyakovenko", "@yak"]);
  });

  it("skips people already picked and offers unknown handles last", () => {
    expect(find("toly", ["@toly"])).toEqual(["@tolyfan"]);
    expect(find("newperson")).toEqual(["@newperson"]);
    expect(find("https://x.com/toly")).toEqual([]);
  });
});
