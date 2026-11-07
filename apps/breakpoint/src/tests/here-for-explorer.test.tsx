import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Explorer from "@/components/pages/here-for/Explorer";
import { buildGraphIndex } from "@/components/pages/here-for/graph-index";
import type { HereForHandle } from "@/lib/here-for/types";

const member = { handle: "@z", xHandle: "@z", adds: ["@a"], status: "open" };
const guest = { handle: null, xHandle: null, adds: [], status: "open" };
const mocks = vi.hoisted(() => ({ graph: vi.fn(), me: vi.fn() }));
vi.mock("next/dynamic", () => ({ default: () => () => null }));
vi.mock("@workspace/i18n/client", () => ({
  useTranslations: () => (key: string) => key,
}));
vi.mock("@/components/Button", () => ({ default: () => null }));
vi.mock("@/components/pages/here-for/JoinCard", () => ({
  default: () => <p data-testid="join" />,
}));
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
  useMe: () => [{ status: "ready", data: mocks.me() }],
  useGraphIndex: mocks.graph,
  useMediaQuery: () => false,
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

it("shows guests the map with only the join card", () => {
  mocks.me.mockReturnValue(guest);
  mocks.graph.mockReturnValue(graph(["@a", "@b"]));
  render(<Explorer locale="en" />);
  expect(screen.getByTestId("join")).toBeInTheDocument();
  expect(screen.queryByLabelText("explorer.zoomControls")).toBeNull();
});

it("gives members the full explorer without the join card", () => {
  mocks.me.mockReturnValue(member);
  mocks.graph.mockReturnValue(graph(["@a", "@b"]));
  render(<Explorer locale="en" />);
  expect(screen.queryByTestId("join")).toBeNull();
  expect(screen.getByLabelText("explorer.zoomControls")).toBeInTheDocument();
});

it("remaps selection immediately when refresh shrinks and renumbers the graph", () => {
  mocks.me.mockReturnValue(member);
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
