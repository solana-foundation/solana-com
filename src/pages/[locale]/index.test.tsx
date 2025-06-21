import React from "react";
import { render, screen } from "@testing-library/react";
import I18nProvider from "@/i18n/I18nProvider";
import IndexPage from "./index";

const mockResources = {
  en: { translation: { welcome: "Welcome" } },
  fr: { translation: { welcome: "Bienvenue" } },
};

describe("[locale]/index page", () => {
  it("renders welcome message in English", () => {
    render(
      <I18nProvider
        locale="en"
        namespaces={["translation"]}
        resources={mockResources}
      >
        <IndexPage />
      </I18nProvider>,
    );
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it("renders welcome message in French", () => {
    render(
      <I18nProvider
        locale="fr"
        namespaces={["translation"]}
        resources={mockResources}
      >
        <IndexPage />
      </I18nProvider>,
    );
    expect(screen.getByText(/bienvenue/i)).toBeInTheDocument();
  });
});
