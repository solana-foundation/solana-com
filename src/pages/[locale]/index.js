import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getPage } from "@/lib/builder/page/api";
import Page from "./[...slug]";
import { withLocales } from "@/i18n/routing";

export default function Home(props) {
  return (
    <div className="overflow-hidden">
      <Page {...props} />
    </div>
  );
}

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  try {
    const page = await getPage("/", locale);
    const isDefaultLocale = locale === "en";
    const builderLocale = isDefaultLocale ? "Default" : locale;

    return {
      props: {
        locale,
        key: page?.id + page?.data.slug + locale,
        page: page || null,
        ...(await serverSideTranslations(builderLocale, ["common"])),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
