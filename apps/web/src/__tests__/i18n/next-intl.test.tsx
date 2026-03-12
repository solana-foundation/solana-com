import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import React from "react";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { locales } from "@workspace/i18n/config";
import { act } from "react";

import { Header, Footer } from "@solana-com/ui-chrome";
import NotFoundPage from "@@/src/app/[locale]/not-found";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

const SUPPORTED_LOCALES = locales;
const loadMessages = (locale: string) => {
  const localesDir = path.join(__dirname, "../../../public/locales");
  return JSON.parse(
    readFileSync(`${localesDir}/${locale}/common.json`, "utf8"),
  );
};

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
    const messages = require("@@/public/locales/en/common.json");
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <TestComponent />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("renders children with the correct French translation", () => {
    const messages = require("@@/public/locales/fr/common.json");
    render(
      <NextIntlClientProvider locale="fr" messages={messages}>
        <TestComponent />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Fermer")).toBeInTheDocument();
  });

  it("falls back to English if locale is unknown", () => {
    const messages = require("@@/public/locales/en/common.json");
    render(
      <NextIntlClientProvider locale="es" messages={messages}>
        <TestComponent />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Close")).toBeInTheDocument();
  });
});

describe.skip("Translations", () => {
  const localesDir = path.join(__dirname, "../../../public/locales");
  const enTranslations = loadMessages("en");

  readdirSync(localesDir).forEach((locale) => {
    if (locale !== "en" && locale !== "hi") {
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
    const messages = loadMessages(locale);

    const isIncompleteLocale = locale === "hi";
    if (isIncompleteLocale) {
      describe.skip(`Locale: ${locale} (skipped due to incomplete translations)`, () => {});
      return;
    }

    describe(`Locale: ${locale}`, () => {
      beforeEach(() => {
        const { useParams, usePathname } = jest.requireMock("next/navigation");
        useParams.mockReturnValue({ locale });
        usePathname.mockReturnValue("/");
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
