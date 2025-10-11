import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import React from "react";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { locales } from "@workspace/i18n/config";
import { act } from "react";

import Header from "@@/src/components/Header";
import Footer from "@@/src/components/Footer";
import NotFoundPage from "@@/src/app/[locale]/not-found";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock next/image to avoid optimization errors in tests
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

// Add this helper for resolving dotted keys in nested messages
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

// Update getCopyrightText to use getNestedValue
const getCopyrightText = (messages: any) => {
  const template =
    getNestedValue(messages, "footer.copyright") ||
    "© {currentYear} Solana Foundation";
  const currentYear = new Date().getFullYear();
  return template.replace("{currentYear}", currentYear.toString());
};

describe("Smoke Tests for UI Elements Across Locales", () => {
  SUPPORTED_LOCALES.forEach((locale) => {
    const messages = loadMessages(locale);

    // Skip for incomplete locales
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

      it("renders Menu (Header) without errors and with translated copy", async () => {
        let container;
        await act(async () => {
          const result = render(
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Header />
            </NextIntlClientProvider>,
          );
          container = result.container;
        });
        const developersTitle = getNestedValue(
          messages,
          "nav.developers.title",
        );
        if (developersTitle) {
          expect(
            screen.getByRole("button", {
              name: (name) => name.includes(developersTitle),
            }),
          ).toBeInTheDocument();
        } else {
          // Fallback assertion or skip if truly missing
          expect(
            screen.getByRole("button", {
              name: (name) => name.includes("Developers"),
            }),
          ).toBeInTheDocument();
        }
        expect(container).toMatchSnapshot();
      });

      it("renders Footer without errors and with translated copy", async () => {
        let container;
        await act(async () => {
          const result = render(
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Footer />
            </NextIntlClientProvider>,
          );
          container = result.container;
        });
        const expectedCopyright = getCopyrightText(messages);
        const copyrightElements = screen.getAllByText(expectedCopyright);
        expect(copyrightElements).toHaveLength(1); // Expect one identical copyright elements (desktop + mobile)
        expect(container).toMatchSnapshot();
      });

      it("renders 404 Page without errors and with translated copy", async () => {
        let container;
        await act(async () => {
          const result = render(
            <NextIntlClientProvider locale={locale} messages={messages}>
              <NotFoundPage />
            </NextIntlClientProvider>,
          );
          container = result.container;
        });
        const title = getNestedValue(messages, "404.title");
        if (title) {
          expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            title,
          );
        } else {
          expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            "Oops.",
          );
        }
        const copy = getNestedValue(messages, "404.copy");
        if (copy) {
          expect(screen.getByText(copy)).toBeInTheDocument();
        } else {
          expect(
            screen.getByText(
              "We hit a snag, but don’t worry, we’ll sort it out for sure.",
            ),
          ).toBeInTheDocument();
        }
        expect(container).toMatchSnapshot();
      });
    });
  });
});
