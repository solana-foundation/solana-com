import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getPage } from "@/lib/builder/page/api";
import Page from "./[...slug]";

export default function Home(props) {
  return <Page {...props} />;
}

export const getStaticProps = async ({ locale }) => {
  try {
    const page = await getPage("/", locale);
    const isDefaultLocale = locale === "en";
    const builderLocale = isDefaultLocale ? "Default" : locale;

    return {
      props: {
        key: page?.id + page?.data.slug + locale,
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
