import { describe, expect, it } from "vitest";
import { createIcons } from "./index";

describe("createIcons", () => {
  it("returns icon, shortcut, and apple metadata in a standardized shape", () => {
    const icons = createIcons({
      ico: "/favicon.ico",
      png: "/favicon.png",
      svg: "/favicon.svg",
      appleTouchIcon: "/apple-touch-icon.png",
      shortcut: "/favicon.ico",
    });

    expect(icons).toEqual({
      icon: [
        { url: "/favicon.ico", type: "image/x-icon" },
        { url: "/favicon.png", type: "image/png" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    });
  });
});
