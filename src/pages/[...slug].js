import { builder, BuilderComponent, useIsPreviewing } from "@builder.io/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HTMLHead from "../components/builder/HTMLHead";
import NotFoundPage from "./404";
import customComponentsRegistration from "../utils/customComponentGenerator";
import Layout from "../components/layout";
import { PAGE_BUILDER_CONFIG } from "@/lib/builder/page/constants";
import { getPage, getAllPagesWithSlug } from "@/lib/builder/page/api";
import ModalLauncher from "../components/ModalLauncher/ModalLauncher";

builder.init(PAGE_BUILDER_CONFIG.apiKey);
customComponentsRegistration();

const Page = ({ page, builderLocale }) => {
  const isPreviewing = useIsPreviewing();

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
      <Layout>
        <BuilderComponent
          options={{ includeRefs: true }}
          model={PAGE_BUILDER_CONFIG.pagesModel}
          content={page}
          locale={builderLocale || "Default"}
        />
        <ModalLauncher />
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  const allPages = await getAllPagesWithSlug();

  const slugs = await allPages
    ?.map((page) => {
      return page.data.slug[0] === "/" ? page.data.slug : `/${page.data.slug}`;
    })
    .filter((slug) => slug !== "/");

  return {
    paths: [...slugs] || [],
    fallback: "blocking",
  };
}

export const getStaticProps = async ({ locale, params }) => {
  try {
    let slug =
      params?.slug && Array.isArray(params?.slug)
        ? params.slug.join("/")
        : params.slug;
    const isDefaultLocale = locale === "en";
    const builderLocale = isDefaultLocale ? "Default" : locale;

    if (!slug) {
      return { notFound: true };
    }

    const page = await getPage(slug, locale);

    return {
      props: {
        key: page?.id + page?.data.slug + params.slug,
        builderLocale,
        page: page || null,
        ...(await serverSideTranslations(builderLocale, ["common"])),
      },
      revalidate: 30,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default Page;
