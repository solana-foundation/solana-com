import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import en from "../../../../../../packages/i18n/messages/web/en/common.json";

// DocsLink prefetches through the app router, which tests don't mount.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ prefetch: vi.fn() }),
}));
// Shiki itself is not under test: a stand-in marks highlighted blocks.
vi.mock("fumadocs-core/highlight/client", () => ({
  useShiki: (code: string, options: { lang: string }) => (
    <pre className="shiki" data-lang={options.lang}>
      {code}
    </pre>
  ),
}));

const { AskMarkdown, isShellBlock, parseShellLines } =
  await import("@/components/docs/ask/ask-markdown.client");

function withIntl(element: ReactElement) {
  return (
    <NextIntlClientProvider locale="en" messages={en}>
      {element}
    </NextIntlClientProvider>
  );
}

const writeText = vi.fn(async () => {});

beforeEach(() => {
  document.documentElement.lang = "en";
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
});

afterEach(() => {
  writeText.mockClear();
});

describe("shell blocks", () => {
  it("splits commands (prompt removed), comments and output", () => {
    expect(
      parseShellLines(
        "# Make a mint\n$ spl-token create-token\nCreating token Abc\n\nsolana balance",
      ),
    ).toEqual([
      { kind: "comment", text: "Make a mint" },
      { kind: "command", text: "spl-token create-token" },
      { kind: "output", text: "Creating token Abc" },
      { kind: "command", text: "solana balance" },
    ]);
  });

  it("are shell by language, by prompts, or when every line is a command", () => {
    expect(isShellBlock("spl-token accounts", "bash")).toBe(true);
    expect(isShellBlock("$ cargo build-sbf\nFinished", null)).toBe(true);
    expect(isShellBlock("npm install @solana/kit", null)).toBe(true);
    expect(isShellBlock("const x = 1;", "ts")).toBe(false);
    expect(isShellBlock("echo hi", "bash")).toBe(false);
  });
});

describe("AskMarkdown", () => {
  it("styles every element explicitly and keeps headings under the panel title", () => {
    const { container } = render(
      withIntl(
        <AskMarkdown
          text={
            "## Overview\n\nA **mint** holds `decimals`.\n\n- one\n- two\n\n> note\n\n| A | B |\n| - | - |\n| 1 | 2 |"
          }
          streaming
        />,
      ),
    );
    const heading = screen.getByRole("heading", { name: "Overview" });
    expect(heading.tagName).toBe("H3");
    // In em, so headings scale with the body and never fall below it.
    expect(heading.className).toContain("text-[1.0625em]");
    expect(heading.className).toContain("leading-[1.45]");
    expect(container.querySelector("strong")!.className).toContain(
      "font-semibold",
    );
    expect(container.querySelector("code")!.className).toContain(
      "rounded-[5px]",
    );
    const list = container.querySelector("ul")!;
    expect(list.className).toContain("list-disc");
    expect(list.className).toContain("space-y-2");
    expect(list.querySelector("li")!.className).toContain("leading-[1.6]");
    expect(container.querySelector("blockquote")!.className).toContain(
      "border-s-2",
    );
    // GFM tables work (remark-gfm through fumadocs-core).
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "A" }).className).toContain(
      "text-[12px]",
    );
    // Code in a cell stays whole; the table scrolls instead.
    expect(screen.getAllByRole("cell")[0]!.className).toContain(
      "[&_code]:whitespace-nowrap",
    );
  });

  it("opens docs links in place (old /docs paths too) and other sites in a new tab", () => {
    render(
      withIntl(
        <AskMarkdown
          text={
            "[PDAs](/docs/core/pda), [fees](https://solana.com/developers/docs/core/fees) and [Anza](https://anza.xyz)."
          }
        />,
      ),
    );
    const pda = screen.getByRole("link", { name: "PDAs" });
    expect(pda).toHaveAttribute("href", "/developers/docs/core/pda");
    expect(pda).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "fees" })).toHaveAttribute(
      "href",
      "/developers/docs/core/fees",
    );
    const anza = screen.getByRole("link", { name: "Anza" });
    expect(anza).toHaveAttribute("target", "_blank");
    expect(anza).toHaveAttribute("rel", "noreferrer");
  });

  it("links docs in the reader's locale", () => {
    document.documentElement.lang = "ja";
    render(withIntl(<AskMarkdown text="[Accounts](/docs/core/accounts)" />));
    expect(screen.getByRole("link", { name: "Accounts" })).toHaveAttribute(
      "href",
      "/ja/developers/docs/core/accounts",
    );
  });

  it("indents ordered lists so two-digit markers stay in the column", () => {
    const { container } = render(
      withIntl(<AskMarkdown text={"### Steps\n\n1. one\n2. two"} />),
    );
    expect(container.querySelector("ol")!.className).toContain("ps-7");
    expect(screen.getByRole("heading", { name: "Steps" }).className).toContain(
      "text-[1em]",
    );
  });

  it("highlights code only once the answer is complete", () => {
    const text = "```ts\nconst x = 1;\n```";
    const { container, rerender } = render(
      withIntl(<AskMarkdown text={text} streaming />),
    );
    expect(container.querySelector(".shiki")).toBeNull();
    rerender(withIntl(<AskMarkdown text={text} />));
    expect(container.querySelector(".shiki")).toHaveAttribute(
      "data-lang",
      "ts",
    );
  });

  it("draws untitled code as the docs do: no header, copy floating at the end", async () => {
    const { container } = render(
      withIntl(<AskMarkdown text={"```ts\nconst x = 1;\n```"} streaming />),
    );
    // No language label or header bar.
    expect(screen.queryByText("ts")).toBeNull();
    expect(screen.queryByText("Terminal")).toBeNull();
    expect(container.querySelector("pre")!.className).toContain("pe-10");
    const copy = screen.getByRole("button", { name: "Copy code" });
    expect(copy.closest(".absolute")!.className).toContain("end-0");
    await act(async () => fireEvent.click(copy));
    expect(writeText).toHaveBeenLastCalledWith("const x = 1;");
  });

  it("titles shell blocks Terminal, with a green prompt", () => {
    render(withIntl(<AskMarkdown text={"```bash\nsolana --version\n```"} />));
    expect(screen.getByText("Terminal").className).toContain("text-[12px]");
    expect(screen.getByText("$").className).toContain("text-[#15803d]");
  });

  it("renders shell commands as rows; copying never includes the prompt", async () => {
    const { container } = render(
      withIntl(
        <AskMarkdown
          text={
            "```bash\n$ spl-token create-token\nCreating token Abc\n$ spl-token create-account Abc\n```"
          }
        />,
      ),
    );
    const rows = within(container.querySelector("ul")!).getAllByRole(
      "listitem",
    );
    expect(rows).toHaveLength(3);
    expect(rows[0]!.textContent).toBe("$spl-token create-token");
    expect(rows[0]!.querySelector('[aria-hidden="true"]')!.textContent).toBe(
      "$",
    );
    const perRow = screen.getAllByRole("button", { name: "Copy command" });
    expect(perRow).toHaveLength(2);
    // Revealed on the row's hover or focus, not a column of icons.
    expect(perRow[0]!.closest(".opacity-0")).not.toBeNull();
    expect(rows[0]!.className).toContain("group/row");
    await act(async () => fireEvent.click(perRow[1]!));
    expect(writeText).toHaveBeenLastCalledWith("spl-token create-account Abc");
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Copy code" })),
    );
    expect(writeText).toHaveBeenLastCalledWith(
      "spl-token create-token\nspl-token create-account Abc",
    );
  });

  it("keeps a single command to the block's one copy button", () => {
    render(withIntl(<AskMarkdown text={"```sh\nsolana --version\n```"} />));
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Copy code" })).toBeVisible();
  });
});
