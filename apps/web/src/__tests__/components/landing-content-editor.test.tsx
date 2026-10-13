import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentEditor } from "@workspace/ui/landing";

describe("ContentEditor", () => {
  it("links JSX headings through existing wrappers and generated IDs", async () => {
    render(
      <ContentEditor tocHeadline="On this page">
        <div id="key-characteristics">
          <h3>Key characteristics</h3>
          <ul>
            <li>Delegated approval</li>
          </ul>
        </div>
        <div>
          <h2>Savings and fees</h2>
        </div>
        <div>
          <h2>{"Can <script> run?"}</h2>
        </div>
      </ContentEditor>,
    );

    await waitFor(() =>
      expect(
        screen.getByRole("link", { name: "Key characteristics" }),
      ).toHaveAttribute("href", "#key-characteristics"),
    );
    expect(
      screen.getByRole("link", { name: "Savings and fees" }),
    ).toHaveAttribute("href", "#savings-and-fees");
    expect(
      screen.getByRole("heading", { name: "Savings and fees" }),
    ).toHaveAttribute("id", "savings-and-fees");
    expect(
      screen.getByRole("link", { name: "Can <script> run?" }),
    ).toHaveAttribute("href", "#can-script-run");
  });
});
