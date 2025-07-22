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
    const messages = (await import(`@@/public/locales/${locale}/common.json`))
      .default;

    return {
      props: {
        locale,
        key: page?.id + page?.data.slug + locale,
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

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
