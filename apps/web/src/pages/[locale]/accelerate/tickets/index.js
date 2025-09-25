import TicketsPage from "./tickets.js";
import { withLocales } from "@workspace/i18n/routing";

export default function Page(props) {
  return <TicketsPage {...props} />;
}

export async function getStaticProps({ params }) {
  const { locale } = params;
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;

  return {
    props: {
      params,
      messages,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
