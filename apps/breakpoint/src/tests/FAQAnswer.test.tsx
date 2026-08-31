import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { describe, expect, it } from "vitest";
import FAQAnswer from "@/components/FAQAnswer";
import messages from "../../../../packages/i18n/messages/breakpoint/en/breakpoint.json";

describe("FAQAnswer", () => {
  it("preserves the active locale for relative links", () => {
    render(
      <NextIntlClientProvider locale="es" messages={messages}>
        <FAQAnswer
          item={{
            answer: "",
            answerHref: "/travel#visas",
            answerLinkLabel: "View visa and ETA support options",
          }}
        />
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByRole("link", {
        name: "View visa and ETA support options",
      }),
    ).toHaveAttribute("href", "/es/breakpoint/travel#visas");
  });
});
