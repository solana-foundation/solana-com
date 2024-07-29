import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { serializeMarkdown } from "@/utils/markdown";
import { RECORD_GROUPS } from "@/constants/developerContentConfig";

import HTMLHead from "@/components/HTMLHead";
import ContentApi from "@/utils/contentApi";
import DevelopersLayout from "@/components/developers/DevelopersLayout";
import DevelopersContentPage from "@/components/developers/DevelopersContentPage/DevelopersContentPage";

export default function SingleDeveloperGuidePage({ record, source }) {
  return (
    <DevelopersLayout>
      <HTMLHead
        title={record.title || "Developer Guide"}
        description={record.description || ""}
      />
      <DevelopersContentPage
        record={record}
        source={source}
        baseHref={"/developers/resources"}
        breadcrumbs={[
          { label: "Developers", href: "/developers" },
          { label: "resources", href: "/developers/resources" },
          // {
          //   href: record.href,
          //   title: record.title,
          // },
        ]}
      />
    </DevelopersLayout>
  );
}

export async function getStaticPaths(
  {
    /*locales,*/
  },
) {
  // const localeParam = locales.join("&locale=");

  // locate the current record being viewed (via the correctly formatted api route)
  const pathData = await ContentApi.getPathsForGroup("resources");

  return {
    paths: pathData
      // removing the `isExternal=true` items prevents local redirects via our site
      ?.filter(
        (record) =>
          !(record?.isExternal == true && !!record.href) &&
          record.href?.startsWith("/developers/resources"),
      )
      .map((item) => {
        return {
          params: {
            // note: `item.href` is expected to have a prefix of "/developers/resources/"
            slug: item.href
              .toLowerCase()
              .replaceAll(/^(\/developers\/resources\/?)?/gi, "")
              .split("/"),
          },
        };
      }),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params, locale }) {
  const { slug = [] } = params;

  if (!slug || !Array.isArray(slug) || !slug?.length) {
    return {
      notFound: true,
    };
  }

  // define the base route for the requested content
  const route = `${RECORD_GROUPS.resources}/${slug.join("/")}`;

  // locate the current record being viewed (via the correctly formatted api route)
  const record = await ContentApi.getSingleRecord(route, locale);

  // ensure the content record was found
  if (!record || !record.href) {
    return {
      notFound: true,
    };
  }

  // handle record redirects for altRoutes and external links
  const redirect = ContentApi.recordRedirectPayload(
    record,
    route,
    locale,
    "/developers/",
  );
  if (!!redirect) return redirect;

  // serialize the content via mdx
  const source = await serializeMarkdown(record.body || "", record?.id);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      record,
      source,
    },
    revalidate: 60,
  };
}
