import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Explorer from "@/components/pages/here-for/Explorer";
import { buildGraphIndex } from "@/components/pages/here-for/graph-index";
import type { HereForHandle } from "@/lib/here-for/types";

const mocks = vi.hoisted(() => ({ graph: vi.fn() }));
vi.mock("next/dynamic", () => ({ default: () => () => null }));
vi.mock("@workspace/i18n/client", () => ({
  useTranslations: () => (key: string) => key,
}));
vi.mock("@/components/Button", () => ({ default: () => null }));
vi.mock("@/components/pages/here-for/PersonPanel", () => ({
  default: ({
    index,
    focus,
  }: {
    index: ReturnType<typeof buildGraphIndex>;
    focus: number | null;
  }) => (
    <p data-testid="selection">
      {focus === null ? "none" : index.payload.handles[focus]}
    </p>
  ),
}));
vi.mock("@/components/pages/here-for/client", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("@/components/pages/here-for/client")
  >()),
  useMe: () => [{ status: "ready", data: { handle: null } }],
  useGraphIndex: mocks.graph,
  usePrefersReducedMotion: () => true,
}));

const graph = (handles: HereForHandle[]) => ({
  graph: {
    status: "ready",
    data: buildGraphIndex({
      version: handles.join(),
      generatedAt: new Date(0).toISOString(),
      handles,
      claimed: handles.map(() => 1),
      positions: handles.flatMap(() => [0, 0, 0]),
      community: handles.map(() => 0),
      communities: [],
      links: [],
      inDegree: handles.map(() => 0),
    }),
  },
  refreshing: false,
  refresh: vi.fn(),
});

afterEach(cleanup);

it("remaps selection immediately when refresh shrinks and renumbers the graph", () => {
  mocks.graph.mockReturnValue(graph(["@a", "@b", "@c"]));
  const { rerender } = render(<Explorer locale="en" initialFocus="c" />);
  expect(screen.getByTestId("selection")).toHaveTextContent("@c");

  mocks.graph.mockReturnValue(graph(["@c"]));
  rerender(<Explorer locale="en" initialFocus="c" />);
  expect(screen.getByTestId("selection")).toHaveTextContent("@c");

  mocks.graph.mockReturnValue(graph(["@a"]));
  rerender(<Explorer locale="en" initialFocus="c" />);
  expect(screen.getByTestId("selection")).toHaveTextContent("none");
});
