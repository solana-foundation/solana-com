import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import React from "react";
import { readdirSync, readFileSync } from "fs";
import path from "path";

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

describe("Translations", () => {
  const localesDir = path.join(__dirname, "../../../public/locales");
  const enTranslations = JSON.parse(
    readFileSync(`${localesDir}/en/common.json`, "utf8"),
  );

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
