import { afterEach, describe, expect, it, vi } from "vitest";
import {
  scrollRequestIntoView,
  updateRequestHash,
} from "@/app/[locale]/request-for-startups/request-scroll";

const originalRequestAnimationFrame = window.requestAnimationFrame;
const originalScrollTo = window.scrollTo;

afterEach(() => {
  window.requestAnimationFrame = originalRequestAnimationFrame;
  window.scrollTo = originalScrollTo;
  document.body.replaceChildren();
});

describe("request-for-startups accordion scroll behavior", () => {
  it("keeps each newly expanded request beneath the header", () => {
    const first = document.createElement("div");
    first.id = "exotic-rwas";
    Object.defineProperty(first, "offsetTop", { value: 240 });
    // The section wrapper is mid-entrance (translated 28px); layout offsets
    // must win over the transformed client rect.
    first.getBoundingClientRect = () => DOMRect.fromRect({ y: 268 });
    const second = document.createElement("div");
    second.id = "ai";
    Object.defineProperty(second, "offsetTop", { value: 520 });
    second.getBoundingClientRect = () => DOMRect.fromRect({ y: 548 });
    const header = document.createElement("header");
    header.getBoundingClientRect = () => DOMRect.fromRect({ height: 80 });
    document.body.append(header, first, second);

    const frames: FrameRequestCallback[] = [];
    window.requestAnimationFrame = vi.fn((callback) => {
      frames.push(callback);
      return frames.length;
    });
    window.scrollTo = vi.fn();

    scrollRequestIntoView("exotic-rwas");
    scrollRequestIntoView("ai");
    frames.forEach((callback) => callback(0));

    expect(window.scrollTo).toHaveBeenNthCalledWith(1, {
      top: 136,
      behavior: "auto",
    });
    expect(window.scrollTo).toHaveBeenNthCalledWith(2, {
      top: 416,
      behavior: "auto",
    });
  });

  it("does not scroll when the open request is collapsed", () => {
    window.requestAnimationFrame = vi.fn();
    window.scrollTo = vi.fn();

    scrollRequestIntoView("");

    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("keeps the expanded request in the URL hash", () => {
    window.history.replaceState(null, "", "/request-for-startups?source=hero");

    updateRequestHash("agentic-security");

    expect(window.location.href).toContain(
      "/request-for-startups?source=hero#agentic-security",
    );

    updateRequestHash("");

    expect(window.location.href).toContain("/request-for-startups?source=hero");
    expect(window.location.hash).toBe("");
  });
});
