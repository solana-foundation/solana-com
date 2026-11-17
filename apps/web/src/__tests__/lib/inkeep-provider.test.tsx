import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { useImperativeHandle, useState, type RefObject } from "react";
import messages from "../../../../../packages/i18n/messages/web/en/common.json";
import { InkeepProvider } from "../../../../../packages/ui-chrome/src/inkeep-provider";
import { InkeepSearchBar } from "../../../../../packages/ui-chrome/src/inkeep-searchbar";
import { InkeepChatButton } from "../../../../../packages/ui-chrome/src/inkeep-chat-button";

const state = vi.hoisted(() => ({ query: "" }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(state.query),
}));
vi.mock("../../../../../packages/ui-chrome/src/inkeep-modal", () => ({
  InkeepModal: MockModal,
}));

function MockModal(props: {
  defaultView: string;
  functionsRef: RefObject<{ setView: (view: string) => void }>;
  modalSettings: { isOpen: boolean; onOpenChange: (value: boolean) => void };
}) {
  const [view, setView] = useState(props.defaultView);
  const [conversation, setConversation] = useState("");
  useImperativeHandle(props.functionsRef, () => ({ setView }));
  return (
    <div data-testid="inkeep-instance" hidden={!props.modalSettings.isOpen}>
      <span data-testid="inkeep-view">{view}</span>
      <input
        aria-label="Conversation"
        value={conversation}
        onChange={(event) => setConversation(event.target.value)}
      />
      <button onClick={() => props.modalSettings.onOpenChange(false)}>
        Close widget
      </button>
    </div>
  );
}

afterEach(() => {
  cleanup();
  state.query = "";
});

function mount() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <InkeepProvider>
        <InkeepSearchBar />
        <InkeepChatButton />
      </InkeepProvider>
    </NextIntlClientProvider>,
  );
}

describe("web Inkeep entry points", () => {
  it("shares one widget and preserves the conversation when switching entry points", async () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Ask AI" }));
    await waitFor(() =>
      expect(screen.getByTestId("inkeep-view")).toHaveTextContent("chat"),
    );
    fireEvent.change(screen.getByRole("textbox", { name: "Conversation" }), {
      target: { value: "My question" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Close widget" }));
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    await waitFor(() =>
      expect(screen.getByTestId("inkeep-view")).toHaveTextContent("search"),
    );
    expect(screen.getByRole("textbox", { name: "Conversation" })).toHaveValue(
      "My question",
    );
    expect(screen.getAllByTestId("inkeep-instance")).toHaveLength(1);
  });

  it("opens a deep-linked search without trapping subsequent opens in search", async () => {
    state.query = "search=wallets";
    mount();
    await waitFor(() =>
      expect(screen.getByTestId("inkeep-instance")).toBeVisible(),
    );
    expect(screen.getByTestId("inkeep-view")).toHaveTextContent("search");
    fireEvent.click(screen.getByRole("button", { name: "Close widget" }));
    fireEvent.click(screen.getByRole("button", { name: "Ask AI" }));
    await waitFor(() =>
      expect(screen.getByTestId("inkeep-view")).toHaveTextContent("chat"),
    );
  });
});
