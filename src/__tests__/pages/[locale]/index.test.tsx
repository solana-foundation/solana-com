import React from "react";
import { render, screen } from "@testing-library/react";
import I18nProvider from "@/i18n/I18nProvider";
import IndexPage from "@/pages/[locale]/index";
import * as useRouterMock from "@/hooks/useRouter";
jest.mock("@/hooks/useRouter");

jest.mock("@builder.io/react", () => ({
  ...jest.requireActual("@builder.io/react"),
  BuilderComponent: ({ content }) => {
    if (content && content.data && content.data.welcome) {
      return <div>{content.data.welcome}</div>;
    }
    return <div>No Content</div>;
  },
}));

type UseRouterMock = typeof useRouterMock & {
  __setLocale: (_locale: string) => void;
  __setPathname: (_pathname: string) => void;
};

const mock = useRouterMock as UseRouterMock;

const mockResources = {
  en: { translation: { welcome: "Welcome" } },
  fr: { translation: { welcome: "Bienvenue" } },
};

const mockPage = {
  data: {
    welcome: "Welcome",
  },
};

beforeEach(() => {
  mock.__setLocale("fr");
});

describe("[locale]/index page", () => {
  it("renders welcome message in English", () => {
    render(
      <I18nProvider
        locale="en"
        namespaces={["translation"]}
        resources={mockResources}
      >
        <IndexPage page={mockPage} />
      </I18nProvider>,
    );
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it("renders welcome message in French", () => {
    const mockPageFr = {
      data: {
        welcome: "Bienvenue",
      },
    };
    render(
      <I18nProvider
        locale="fr"
        namespaces={["translation"]}
        resources={mockResources}
      >
        <IndexPage page={mockPageFr} />
      </I18nProvider>,
    );
    expect(screen.getByText(/bienvenue/i)).toBeInTheDocument();
  });
});
