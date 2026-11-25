import { describe, expect, it } from "vitest";
import { ASK_ROOM_CLASS } from "@/components/docs/ask/room";

describe("ASK_ROOM_CLASS", () => {
  const classes = ASK_ROOM_CLASS.split(" ");

  // The panel docks at `end-0` against <html dir>; an untranslated page at
  // /ar/... sets dir="ltr" on the wrapper, so a logical end padding there
  // would open room on the side away from the panel.
  it("makes room on the side <html dir> docks the panel, not the wrapper's end", () => {
    expect(classes.filter((c) => c.includes(":pe-"))).toEqual([]);
    for (const target of ["&>.dh", "&>:not(.dh)"]) {
      const ltr = classes.find((c) =>
        c.startsWith(
          `xl:[html[data-ask=docked]:not([dir=rtl])_${target}]:pr-[`,
        ),
      );
      const rtl = classes.find((c) =>
        c.startsWith(`xl:[html[data-ask=docked][dir=rtl]_${target}]:pl-[`),
      );
      expect(ltr, target).toBeDefined();
      expect(rtl, target).toBeDefined();
      // Same width on both sides.
      expect(rtl!.slice(rtl!.indexOf(":pl-") + 4)).toBe(
        ltr!.slice(ltr!.indexOf(":pr-") + 4),
      );
    }
  });
});
