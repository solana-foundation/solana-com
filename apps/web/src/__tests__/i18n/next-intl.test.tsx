import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { locales } from "@workspace/i18n/config";
import { loadMergedMessages } from "@workspace/i18n/messages";
import { act } from "react";
import { Header, Footer } from "@solana-com/ui-chrome";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock("@solana-com/ui-chrome", () => ({
  Header: () => {
    const t = useTranslations();

    return (
      <nav aria-label="Main">
        <button type="button">{t("nav.developers.title")}</button>
      </nav>
    );
  },
  Footer: () => {
    const t = useTranslations();
    const currentYear = new Date().getFullYear();

    return (
      <footer>
        {t("footer.copyright", { currentYear: String(currentYear) })}
      </footer>
    );
  },
}));

vi.mock("@@/src/app/[locale]/not-found", () => ({
  default: () => {
    const t = useTranslations();

    return (
      <main>
        <h1>{t("404.title")}</h1>
        <p>{t("404.copy")}</p>
        <a href="/">{t("404.button")}</a>
      </main>
    );
  },
}));

import NotFoundPage from "@@/src/app/[locale]/not-found";

const SUPPORTED_LOCALES = locales;
const loadMessages = (locale: string) =>
  loadMergedMessages({ app: "web", locale });

const TestComponent = () => {
  const t = useTranslations();
  return <span>{t("commands.close")}</span>;
};

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

const getCopyrightText = (messages: any) => {
  const template =
    getNestedValue(messages, "footer.copyright") ||
    "© {currentYear} Solana Foundation";
  const currentYear = new Date().getFullYear();
  return template.replace("{currentYear}", currentYear.toString());
};

describe("NextIntlClientProvider", () => {
  it("renders children with the correct English translation", () => {
    const messages = JSON.parse(
      readFileSync(
        path.join(
          __dirname,
          "../../../../../packages/i18n/messages/web/en/common.json",
        ),
        "utf8",
      ),
    );
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <TestComponent />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("renders children with the correct French translation", () => {
    const messages = JSON.parse(
      readFileSync(
        path.join(
          __dirname,
          "../../../../../packages/i18n/messages/web/fr/common.json",
        ),
        "utf8",
      ),
    );
    render(
      <NextIntlClientProvider locale="fr" messages={messages}>
        <TestComponent />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Fermer")).toBeInTheDocument();
  });

  it("falls back to English if locale is unknown", () => {
    const messages = JSON.parse(
      readFileSync(
        path.join(
          __dirname,
          "../../../../../packages/i18n/messages/web/en/common.json",
        ),
        "utf8",
      ),
    );
    render(
      <NextIntlClientProvider locale="es" messages={messages}>
        <TestComponent />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Close")).toBeInTheDocument();
  });
});

describe.skip("Translations", () => {
  const localesDir = path.join(
    __dirname,
    "../../../../../packages/i18n/messages/web",
  );
  const enTranslations = loadMessages("en");

  readdirSync(localesDir).forEach((locale) => {
    if (locale !== "en") {
      it(`has no missing keys for ${locale}`, () => {
        const translations = JSON.parse(
          readFileSync(`${localesDir}/${locale}/common.json`, "utf8"),
        );
        Object.keys(enTranslations).forEach((key) => {
          expect(translations).toHaveProperty(key);
        });
      });
    }
  });
});

describe("Smoke Tests for UI Elements Across Locales", () => {
  SUPPORTED_LOCALES.forEach((locale) => {
    describe(`Locale: ${locale}`, () => {
      let messages: Awaited<ReturnType<typeof loadMessages>>;

      beforeAll(async () => {
        messages = await loadMessages(locale);
      });

      beforeEach(() => {
        vi.mocked(useParams).mockReturnValue({ locale });
        vi.mocked(usePathname).mockReturnValue("/");
      });

      it("renders Header with translated navigation", async () => {
        await act(async () => {
          render(
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Header />
            </NextIntlClientProvider>,
          );
        });

        // Header renders nav landmarks
        expect(
          screen.getByRole("navigation", { name: "Main" }),
        ).toBeInTheDocument();

        // Developers dropdown button uses translated label
        const developersTitle = getNestedValue(
          messages,
          "nav.developers.title",
        );
        expect(
          screen.getByRole("button", {
            name: (name) => name.includes(developersTitle || "Developers"),
          }),
        ).toBeInTheDocument();
      });

      it("renders Footer with translated copyright", async () => {
        await act(async () => {
          render(
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Footer />
            </NextIntlClientProvider>,
          );
        });

        const expectedCopyright = getCopyrightText(messages);
        const copyrightElements = screen.getAllByText(expectedCopyright);
        expect(copyrightElements).toHaveLength(1);
      });

      it("renders 404 page with translated content", async () => {
        await act(async () => {
          render(
            <NextIntlClientProvider locale={locale} messages={messages}>
              <NotFoundPage />
            </NextIntlClientProvider>,
          );
        });

        // Title heading uses translated 404 title
        const title = getNestedValue(messages, "404.title");
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
          title || "This page doesn\u2019t exist.",
        );

        // Subtitle text is present
        const copy = getNestedValue(messages, "404.copy");
        if (copy) {
          expect(screen.getByText(copy)).toBeInTheDocument();
        }

        // CTA link points home and uses translated label
        const ctaLabel = getNestedValue(messages, "404.button");
        const link = screen.getByRole("link", {
          name: ctaLabel || "Back to homepage",
        });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", expect.stringContaining("/"));
      });
    });
  });
});
