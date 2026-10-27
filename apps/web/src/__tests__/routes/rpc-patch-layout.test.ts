import { describe, expect, it } from "vitest";
import { RPC_PATHS } from "@/app/[locale]/rpc/directory-state";
import {
  cableEnds,
  PATCH_LAYOUTS,
  PATCH_RACK,
} from "@/app/[locale]/rpc/rpc-patch-layout";

describe("RPC patch-bay hero layout", () => {
  it.each(RPC_PATHS)(
    "wires the %s path to real jacks inside the rack",
    (path) => {
      const layout = PATCH_LAYOUTS[path];
      const ids = layout.modules.map((part) => part.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(
        layout.cables.filter((cable) => cable.role === "request"),
      ).toHaveLength(1);
      expect(
        layout.cables.filter((cable) => cable.role === "downstream").length,
      ).toBe(path === "local" ? 0 : 1);

      const used = new Set<string>();
      for (const cable of layout.cables) {
        for (const [id, jack] of [cable.from, cable.to]) {
          const part = layout.modules.find((item) => item.id === id);
          expect(part, id).toBeDefined();
          expect(jack).toBeLessThan(part!.jacks);
          expect(used.has(`${id}:${jack}`), `${id}:${jack} patched twice`).toBe(
            false,
          );
          used.add(`${id}:${jack}`);
        }
        const { low } = cableEnds(layout, cable);
        expect(low).toBeGreaterThan(PATCH_RACK.y - PATCH_RACK.h / 2);
      }
      for (const part of layout.modules) {
        expect(part.x - part.w / 2).toBeGreaterThan(
          PATCH_RACK.x - PATCH_RACK.w / 2,
        );
        expect(part.x + part.w / 2).toBeLessThan(
          PATCH_RACK.x + PATCH_RACK.w / 2,
        );
      }
    },
  );
});
