import HTMLHead from "@/components/HTMLHeadLegacy";
import NotFoundPage from "./404";
import Layout from "@/components/layout";
import ModalLauncher from "@/components/ModalLauncher/ModalLauncher";
import MdxLandingRenderer from "@/components/LandingRenderer/MdxLandingRenderer";
import { getLandingContent, getMigratedSlugs } from "@/lib/landings";
import { slugWithLocales, usePathname } from "@workspace/i18n/routing";
import { locales } from "@workspace/i18n/config";

const Page = ({ page }) => {
  if (useAppRouterNavigation(page)) {
    if (typeof window === "undefined") {
      return null;
    }
    window.location.reload();
    return null;
  }

  if (!page) {
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
        <MdxLandingRenderer mdxSource={page.mdxSource} />
        <ModalLauncher />
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  try {
    const migratedSlugs = getMigratedSlugs();
    const slugs = migratedSlugs.map((slug) => slug.split("/"));
    const paths = slugWithLocales(slugs);

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("[getStaticPaths] Error:", {
      message: error.message,
      stack: error.stack,
    });
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  try {
    let slug =
      params?.slug && Array.isArray(params?.slug)
        ? params.slug.join("/")
        : params.slug;

    if (!locales.includes(locale) || !slug) {
      return { notFound: true };
    }

    // Get content from MDX files (falls back to English)
    const page = await getLandingContent(slug, locale);

    if (!page) {
      return { notFound: true };
    }

    const messages = (await import(`@@/public/locales/${locale}/common.json`))
      .default;

    return {
      props: {
        key: page?.id + page?.data?.slug + params.slug,
        locale,
        page: page || null,
        messages,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

export default Page;

function useAppRouterNavigation(page) {
  // There's a bug in Next.js when navigating from the pages router to the app router, we end up in this catch-all route instead of navigating to the app router page, see: https://github.com/vercel/next.js/issues/74696
  // As a workaround, this function checks if we should navigate to the app router page instead of being here
  const pathname = usePathname();
  if (page) return false;
  const regexes = [new RegExp(`^/(?:[^/]{2}/)?universities(/.*)?$`)];
  return regexes.some((regex) => regex.test(pathname));
}
