import { builder, BuilderComponent, useIsPreviewing } from "@builder.io/react";
import NotFoundPage from "../404";
import customComponentsRegistration from "@/utils/customComponentGenerator";
import BreakpointLayout from "@/components/breakpoint/BreakpointLayout";
import { getAllCustomSlugs, getCustomPage } from "@/lib/builder/api";
import { BREAKPOINT_BUILDER_CONFIG } from "@/lib/builder/breakpoint/constants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HTMLHead from "@/components/builder/HTMLHead";
import SimpleHero from "@/components/breakpoint/BreakpointSimpleHero";
import { slugWithLocales } from "@/i18n/routing";

builder.init(BREAKPOINT_BUILDER_CONFIG.apiKey);
builder.apiVersion = "v3";
customComponentsRegistration();

/**
 * Single page view (/:slug)
 *
 * This file renders a single page and loads all the content.
 *
 */
const Page = ({ builderLocale, page }) => {
  const isPreviewing = useIsPreviewing();
  const { showHeader, showDefaultHero, showFooter } = page?.data || false;

  if (!page && !isPreviewing) {
    return <NotFoundPage />;
  }
  return (
    <>
      <HTMLHead
        seo={page?.data?.seo}
        openGraph={page?.data?.openGraph}
        twitterMeta={page?.data?.openGraph}
      />
      <BreakpointLayout data={{ showHeader, showFooter }}>
        {showDefaultHero && <SimpleHero title={page?.data?.heroTitle} />}
        <article>
          <BuilderComponent
            options={{ includeRefs: true }}
            model={BREAKPOINT_BUILDER_CONFIG.model}
            content={page}
            locale={builderLocale || "Default"}
          />
        </article>
      </BreakpointLayout>
    </>
  );
};

export async function getStaticPaths() {
  const allPages = await getAllCustomSlugs(
    "/breakpoint",
    BREAKPOINT_BUILDER_CONFIG.model,
  );
  return {
    paths: slugWithLocales(allPages || []),
    fallback: "blocking",
  };
}

export const getStaticProps = async ({ params }) => {
  const { locale = "en" } = params;
  try {
    let slug = params?.slug || "";

    const isDefaultLocale = locale === "en";
    const builderLocale = isDefaultLocale ? "Default" : locale;

    if (typeof slug === "object" && slug.length) {
      slug = slug.map((slug) => slug.replace(/(%\d+)+$/, ""));

      // if we have more than 1 slug, combine them so its a full path (ex: ['test', 'test'] => 'test/test')
      if (slug.length > 1 && slug !== "") {
        slug = slug.join("/");
      } else {
        slug = slug[0]; // Pass the slug (['faq'] => 'faq')
      }
    }

    let { page } = await getCustomPage(
      BREAKPOINT_BUILDER_CONFIG.model,
      slug,
      builderLocale,
    );

    return {
      props: {
        locale,
        builderLocale,
        key: page?.id + page?.data.slug + params.slug,
        page: page || null,
        ...(await serverSideTranslations(locale, ["common"])),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default Page;
