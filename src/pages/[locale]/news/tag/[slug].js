import { builder } from "@builder.io/react";
import Layout from "@/components/layout";
import PostCard from "@/components/blog/PostCard";
import HTMLHead from "@/components/HTMLHead";
import styled from "styled-components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { slugWithLocales } from "@/i18n/routing";
import {
  getSingleTag,
  getPostsByTag,
  // getTagSlugs,
  getPageSettings,
} from "@/lib/builder/api";

import { NEWS_BUILDER_CONFIG } from "@/lib/builder/news/constants";

import { MetaData } from "@/components/blog/meta";

builder.init(NEWS_BUILDER_CONFIG.apiKey);
builder.apiVersion = "v3";

const StyledBlogTagHeader = styled.div`
  font-family: Diatype, var(--font-family-sans-serif);

  .separator {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  h1 {
    margin-bottom: 0;
    font-style: normal;
    font-weight: bold;
    font-size: clamp(44px, 4vw, 96px) !important;
    line-height: 110% !important;
    letter-spacing: -0.02em !important;
    font-feature-settings: "ss14" on;

    @media (min-width: 768px) {
      letter-spacing: -0.04em !important;
    }
  }
`;

/**
 * Tag page (/tag/:slug)
 *
 * Loads all posts for the requested tag incl. pagination.
 */
const Tag = ({ tag, posts, pageSettings }) => {
  return (
    <Layout>
      <MetaData settings={pageSettings} data={{ builderTag: tag }} />
      <HTMLHead addDefaultMeta={false} />
      <div className="container p-3 p-md-8 text-white">
        <StyledBlogTagHeader>
          <header>
            <h1>{tag.name}</h1>
            {tag.description ? <p>{tag.description}</p> : null}
          </header>
          <div role="separator" className="separator mb-8 mt-4"></div>
        </StyledBlogTagHeader>
        <section className="post-feed">
          {posts.map((post, index) => (
            // The tag below includes the markup for each post - components/common/PostCard.js
            <PostCard
              key={post?.data?.slug}
              post={post}
              index={index}
              isFirstPage={true}
            />
          ))}
        </section>
      </div>
      <style jsx global>{`
        body {
          background: #000;
        }
      `}</style>
    </Layout>
  );
};

export async function getStaticPaths() {
  // Building all tag pages slows down the build process too much
  // const allPaths = await getTagSlugs();
  const allPaths = [];
  const paths = allPaths?.map((p) => `/news/tag/${p?.data?.slug}`) || [];
  return {
    paths: slugWithLocales(paths),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  try {
    const { slug } = params;

    const [tag, posts = [], pageSettings] = await Promise.all([
      getSingleTag(slug),
      getPostsByTag(slug, NEWS_BUILDER_CONFIG.postsModel),
      getPageSettings(),
    ]);

    if (!tag || posts?.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        locale,
        tag,
        pageSettings,
        posts: posts
          ? posts?.map((p) => {
              delete p.html;
              return p;
            })
          : [],
        ...(await serverSideTranslations(locale, ["common"])),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

export default Tag;
