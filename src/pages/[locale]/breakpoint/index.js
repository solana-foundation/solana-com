import { withLocales } from "@/i18n/routing";
import dynamic from "next/dynamic";

const Page = dynamic(() => import("./[...slug]"), {
  ssr: false,
});

export default function IndexPage(props) {
  return <Page {...props} />;
}

export { getStaticProps } from "./[...slug]";

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
