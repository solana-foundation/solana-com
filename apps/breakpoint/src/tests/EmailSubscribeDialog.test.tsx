import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import EmailSubscribeDialog from "@/components/EmailSubscribeDialog";

const NEWSLETTER_ACTION_URL =
  "https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=16189fcd-ac6c-4cc9-ac4a-94aa102fccc1";

describe("EmailSubscribeDialog", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("submits the email to Iterable", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({ ok: true } as Response);

    render(<EmailSubscribeDialog open onClose={() => {}} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "builder@example.com" },
    });
    fireEvent.submit(screen.getByLabelText("Email").closest("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        NEWSLETTER_ACTION_URL,
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        }),
      );
    });

    const requestBody = fetchMock.mock.calls[0]![1]!.body as FormData;
    expect(requestBody.get("email")).toBe("builder@example.com");
    expect(await screen.findByText(/subscribed/i)).toBeInTheDocument();
  });

  it("shows an error for invalid email without submitting", () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    render(<EmailSubscribeDialog open onClose={() => {}} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "not-an-email" },
    });
    fireEvent.submit(screen.getByLabelText("Email").closest("form")!);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter a valid email address and try again.",
    );
  });
});
