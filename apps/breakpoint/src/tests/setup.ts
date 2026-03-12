import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { vi } from "vitest";
import { afterEach } from "vitest";

HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

// Mock IntersectionObserver for ScrollReveal
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(globalThis, "IntersectionObserver", {
  value: MockIntersectionObserver,
});

afterEach(() => cleanup());
