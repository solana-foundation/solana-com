import CommonMarkdown from "@/components/sharedPageSections/CommonMarkdown";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import SimpleHero from "@/components/sharedPageSections/SimpleHero";

import SocialShareButtons from "@/components/sharedPageSections/SocialShareButtons";
import Divider from "@/components/shared/Divider";
import { config } from "src/config";

import { getAllPostsInDir, getPostBySlug } from "@/lib/markdown";
import LearnPagination from "@/components/learn/LearnPagination";
import { pathsWithLocales } from "@/i18n/routing";

const LearnPage = ({ article }) => {
  const {
    frontmatter: {
      slug,
      topic,
      title,
      description,
      prevSlug,
      prevTopic,
      nextSlug,
      nextTopic,
    },
    content,
  } = article;

  const shareUrl = `/learn/${slug}`;

  return (
    <Layout>
      <HTMLHead title={`${title} ${topic}`} description={description} />
      <SimpleHero
        frontmatter={{ title, topic }}
        breadcrumbs={[{ label: "Learn", href: undefined }]}
      />
      <div className="container py-8">
        <div className="row justify-content-between">
          <article className="col-lg-12">
            <CommonMarkdown>{content}</CommonMarkdown>

            <div className="my-8">
              <Divider theme="light" axis="x" />
              <SocialShareButtons
                url={config.siteUrl + shareUrl}
                title={`${title} ${topic}`}
                className="my-6 d-flex justify-content-center"
              />
              <Divider theme="light" axis="x" />
            </div>

            <LearnPagination
              prevSlug={prevSlug}
              prevTopic={prevTopic}
              nextSlug={nextSlug}
              nextTopic={nextTopic}
            />
          </article>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const articles = getAllPostsInDir("learn");
  const paths = articles.map(({ frontmatter }) => ({
    params: {
      slug: frontmatter.slug,
    },
  }));

  return {
    paths: pathsWithLocales(paths),
    fallback: "blocking",
  };
};

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  const article = getPostBySlug("learn", params.slug);

  if (!article) {
    return { notFound: true };
  }

  return {
    props: {
      locale,
      article,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 60,
  };
}

export default LearnPage;
