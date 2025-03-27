// Integrating Builder Symbols
// https://www.builder.io/c/docs/integrate-symbols

import { builder, BuilderComponent } from "@builder.io/react";
import { PAGE_BUILDER_CONFIG } from "@/lib/builder/page/constants";
import customComponentsRegistration from "@/utils/customComponentGenerator";
import { withLocales } from "@/i18n/routing";
import Head from "next/head";

builder.init(PAGE_BUILDER_CONFIG.apiKey);
builder.apiVersion = "v3";
customComponentsRegistration();

export default function Page() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <BuilderComponent model="symbol" />
    </>
  );
}

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  return {
    props: {
      locale,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
