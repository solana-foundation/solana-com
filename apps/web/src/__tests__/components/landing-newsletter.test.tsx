import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LandingNewsletter } from "@workspace/ui/landing-newsletter";

afterEach(() => vi.unstubAllGlobals());

describe("LandingNewsletter", () => {
  it("validates email before sending", () => {
    const send = vi.fn();
    vi.stubGlobal("fetch", send);
    const { container } = render(<LandingNewsletter formId="test-form" />);

    fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
      target: { value: "bad-email" },
    });
    fireEvent.submit(container.querySelector("form")!);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter a valid email address",
    );
    expect(send).not.toHaveBeenCalled();
  });

  it("reports success only after Iterable accepts the address", async () => {
    const send = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", send);
    const { container } = render(<LandingNewsletter formId="test-form" />);

    fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
      target: { value: "builder@example.com" },
    });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Success!"),
    );
    expect(send).toHaveBeenCalledWith(
      "https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=test-form",
      expect.objectContaining({ method: "POST" }),
    );
    const body = send.mock.calls[0][1].body as FormData;
    expect(body.get("email")).toBe("builder@example.com");
  });

  it("shows a submission error when Iterable rejects the request", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    const { container } = render(<LandingNewsletter formId="test-form" />);

    fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
      target: { value: "builder@example.com" },
    });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Something went wrong",
      ),
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
