import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import Link from "../../utils/Link";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

const PublishedAt = dynamic(() => import("./PublishedAt"), {
  ssr: false,
});

const StyledPostCard = styled.article`
  // Using !important here to overcome the global !important setting from solana-variables

  font-family: Diatype, var(--font-family-sans-serif);

  .post-card {
    &-date {
      margin-top: 32px;
      font-size: 16px;
      line-height: 145%;
      color: #ffffff;
      opacity: 0.7;

      @media (min-width: 992px) {
        color: #f9f9fb;
        margin-top: 12px;
        opacity: 0.5;
      }
    }

    &.featured {
      .post-card-date {
        margin: 0 0 12px 0;

        @media (min-width: 992px) {
          margin: 0 0 20px 0;
        }
      }
    }

    &-title {
      color: #f9f9fb;
      font-style: normal;
      font-weight: bold;
      font-size: 1.75rem !important;
      line-height: 110% !important;
      letter-spacing: -0.02em !important;
      font-feature-settings: "ss14" on;
      &.secondary {
        margin: 1rem 0;
      }

      @media (min-width: 750px) {
        font-size: 2rem !important;
        letter-spacing: -0.01em !important;
        &.secondary {
          margin: 1.5rem 0;
        }
      }

      @media (min-width: 992px) {
        font-size: 3rem !important;
        line-height: 120% !important;
        letter-spacing: -0.01em !important;
        &.secondary {
          font-size: 3.5rem !important;
        }
      }
    }

    &.featured {
      .post-card-title {
        font-style: normal;
        font-weight: bold;
        font-size: clamp(40px, 4vw, 60px) !important;
        line-height: 110% !important;
        font-feature-settings: "ss14" on;

        @media (min-width: 992px) {
          font-size: 60px;
          letter-spacing: -0.03em !important;
        }
      }
    }

    &-excerpt {
      font-size: 20px;
      line-height: 145%;
    }

    &-image {
      display: flex;
      overflow: hidden;
      border-radius: 15px;
    }

    &-tags {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;

      @media (min-width: 992px) {
        flex-direction: row;
      }

      a {
        font-family: "DSemi", monospace;
        font-size: 16px;
        line-height: 125%;
        background-color: #eb54bc;
        border-radius: 28px;
        color: #000005;
        margin-bottom: 12px;
        padding: 6px 12px 4px;
        display: inline-block;
        text-transform: uppercase;

        @media (min-width: 992px) {
          margin: 0 12px 12px 0;
        }

        &:hover {
          text-decoration: none;
        }
      }
    }
    &-button {
      padding: 8px 20px;
      border: 1px solid #ffffff;
      box-sizing: border-box;
      border-radius: 36px;
      color: #ffffff;
      font-size: 0.875rem;
      text-transform: uppercase;
      &:hover {
        text-decoration: none;
      }
    }
  }
`;

const PostCard = ({ post, index, isFirstPage, variant = "primary" }) => {
  const { t } = useTranslation();

  if (!post?.data) {
    return null;
  }

  const url = `/news/${post?.data?.slug}/`;
  const featuredImage = post?.data?.image || "/src/img/news/blogbackup.png";
  const showAsFeaturedPost = index === 0 && isFirstPage;
  const excerpt = post?.data?.description || post?.data?.intro;
  const postTags = post?.tags
    ? post?.tags?.filter((node) => node?.slug !== "featured")
    : [];

  const publishedDate = post?.data?.datePublished || "2021-01-01T00:00:00.000Z";

  if (variant !== "primary") {
    return (
      <StyledPostCard>
        <div>
          <Link to={url} className="post-card-image">
            <Image
              src={featuredImage}
              loading="eager"
              quality={90}
              width={1920}
              height={1073}
            />
          </Link>
          <h2 className="post-card-title secondary">
            {typeof post?.data?.title === "string"
              ? post.data.title
              : post?.data?.title?.Default}
          </h2>
        </div>
        <Link to={url} className="post-card-button">
          {t("blog.read-article")}
        </Link>
      </StyledPostCard>
    );
  }

  return (
    <StyledPostCard
      className={`text-white${
        featuredImage && showAsFeaturedPost ? ` featured` : ``
      }`}
    >
      <article
        className={`post-card${
          featuredImage && showAsFeaturedPost ? ` featured` : ``
        }`}
      >
        <Link to={url} className="text-white">
          {featuredImage && showAsFeaturedPost ? (
            <div>
              <div className="row">
                <div className="col-md-10">
                  <small className="d-block post-card-date">
                    <PublishedAt publishedDateString={publishedDate} />
                  </small>
                  <h2 className="post-card-title">
                    {typeof post?.data?.title === "string"
                      ? post.data.title
                      : post?.data?.title?.Default}
                  </h2>
                  <p className="post-card-excerpt">{excerpt}</p>
                </div>
              </div>
              <div>
                <Image
                  className="post-card-image"
                  src={featuredImage}
                  loading="eager"
                  quality={90}
                  width={1920}
                  height={1073}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          <div>
            {featuredImage && !showAsFeaturedPost ? (
              <div>
                <div>
                  <Image
                    className="post-card-image"
                    src={featuredImage}
                    loading="eager"
                    quality={90}
                    width={1920}
                    height={1073}
                  />
                </div>
                <span className="d-block post-card-date">
                  <PublishedAt publishedDateString={publishedDate} />
                </span>
                <h2 className="post-card-title">
                  {typeof post?.data?.title === "string"
                    ? post.data.title
                    : post?.data?.title?.Default}
                </h2>
                <p className="post-card-excerpt">{excerpt}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </Link>
        <>
          {postTags && (
            <section className="post-card-tags">
              {" "}
              {postTags.map((t) => {
                return (
                  <span key={t.id}>
                    <Link
                      href={`/news/tag/${t.slug}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t.name}
                    </Link>
                  </span>
                );
              })}
            </section>
          )}
          {/* <footer className="post-card-footer">
            <div className="post-card-footer-left">
              <div className="post-card-avatar">
                {post.primary_author.profile_image ? (
                  <img
                    className="author-profile-image"
                    src={post.primary_author.profile_image}
                    alt={post.primary_author.name}
                  />
                ) : (
                  <img
                    className="default-avatar"
                    src="/images/icons/avatar.svg"
                    alt={post.primary_author.name}
                  />
                )}
              </div>
              <span>{post.primary_author.name}</span>
            </div>
            <div className="post-card-footer-left">
              <div>{readingTime}</div>
            </div>
          </footer> */}
        </>
      </article>
    </StyledPostCard>
  );
};

export default PostCard;
