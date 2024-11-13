"use client";

import { I18nextProvider } from "react-i18next";
import initTranslations from "@/app/i18n";
import { createInstance } from "i18next";
import SSRProvider from "react-bootstrap/SSRProvider";

export default function AppProvider({
  children,
  locale,
  namespaces,
  resources,
}) {
  const i18n = createInstance();

  initTranslations(locale, namespaces, i18n, resources);

  return (
    <SSRProvider>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </SSRProvider>
  );
}
