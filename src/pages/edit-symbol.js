// Integrating Builder Symbols
// https://www.builder.io/c/docs/integrate-symbols

import { builder, BuilderComponent } from "@builder.io/react";
import { PAGE_BUILDER_CONFIG } from "@/lib/builder/page/constants";
import customComponentsRegistration from "../utils/customComponentGenerator";

builder.init(PAGE_BUILDER_CONFIG.apiKey);
customComponentsRegistration();

export default function Page() {
  return <BuilderComponent model="symbol" />;
}
