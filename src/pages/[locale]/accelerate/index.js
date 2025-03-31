import AcceleratePage from "./AcceleratePage";
import { withLocales } from "@/i18n/routing";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Page(props) {
  return <AcceleratePage {...props} />;
}

export async function getStaticProps({ params }) {
  const { locale } = params;

  return {
    props: {
      params,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
