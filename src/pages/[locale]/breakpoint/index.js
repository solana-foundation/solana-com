import BreakpointPage, {
  getStaticProps as getStaticPropsCatchAll,
} from "./[...slug]";
import { withLocales } from "@/i18n/routing";

export default function Page(props) {
  // We use an index page instead of an optional catch-all route
  // because the optional catch-all route is 404ing in Vercel for localized routes
  // similar to https://github.com/vercel/next.js/issues/62657
  return <BreakpointPage {...props} />;
}

export async function getStaticProps({ params }) {
  return getStaticPropsCatchAll({ params });
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
