import React from "react";
import { render, screen } from "@testing-library/react";
import I18nProvider from "./I18nProvider";

const mockResources = {
  en: { translation: { hello: "Hello" } },
  fr: { translation: { hello: "Bonjour" } },
};

describe("I18nProvider", () => {
  it("renders children with the correct locale", () => {
    render(
      <I18nProvider
        locale="en"
        namespaces={["translation"]}
        resources={mockResources}
      >
        <span>{mockResources.en.translation.hello}</span>
      </I18nProvider>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders children with a different locale", () => {
    render(
      <I18nProvider
        locale="fr"
        namespaces={["translation"]}
        resources={mockResources}
      >
        <span>{mockResources.fr.translation.hello}</span>
      </I18nProvider>,
    );
    expect(screen.getByText("Bonjour")).toBeInTheDocument();
  });

  it("falls back to default locale if unknown", () => {
    render(
      <I18nProvider
        locale="es"
        namespaces={["translation"]}
        resources={mockResources}
      >
        <span>{mockResources.en.translation.hello}</span>
      </I18nProvider>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
