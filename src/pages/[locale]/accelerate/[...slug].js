import { builder, BuilderComponent, useIsPreviewing } from "@builder.io/react";
import NotFoundPage from "../404";
import customComponentsRegistration from "@/utils/customComponentGenerator";
import AccelerateLayout from "@/components/accelerate/AccelerateLayout";
import { getAllCustomSlugs, getCustomPage } from "@/lib/builder/api";
import { ACCELERATE_BUILDER_CONFIG } from "@/lib/builder/accelerate/constants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HTMLHead from "@/components/builder/HTMLHead";
import SimpleHero from "@/components/accelerate/AccelerateSimpleHero";
import { slugWithLocales } from "@/i18n/routing";

builder.init(ACCELERATE_BUILDER_CONFIG.apiKey);
builder.apiVersion = "v3";
customComponentsRegistration();

/**
 * Single page view (/:slug)
 *
 * This file renders a single page and loads all the content.
 *
 */
const AcceleratePage = ({ builderLocale, page }) => {
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
      <AccelerateLayout data={{ showHeader, showFooter }}>
        {showDefaultHero && <SimpleHero title={page?.data?.heroTitle} />}
        <article>
          <BuilderComponent
            options={{ includeRefs: true }}
            model={ACCELERATE_BUILDER_CONFIG.model}
            content={page}
            locale={builderLocale || "Default"}
          />
        </article>
      </AccelerateLayout>
    </>
  );
};

export async function getStaticPaths() {
  const allPages = await getAllCustomSlugs(
    "/accelerate",
    ACCELERATE_BUILDER_CONFIG.model,
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
      ACCELERATE_BUILDER_CONFIG.model,
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

export default AcceleratePage;
