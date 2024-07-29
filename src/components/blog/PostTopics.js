import { useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import Link from "../../utils/Link";

import { extractTags } from "@/lib/builder/api";

const StyledPostTopics = styled.div`
  font-family: Diatype, var(--font-family-sans-serif);
  h5 {
    color: #ffffff;
    font-size: 24px;
    line-height: 28px;
    margin-top: 3rem;
    @media (min-width: 750px) {
      font-size: 14px;
      line-height: 16px;
      color: #c8c8d6;
      margin-top: 0.5rem;
    }
  }
  .post-topics {
    display: flex;
    flex-direction: column;
    row-gap: 0.75rem;
    a {
      border: none;
      border-bottom: 1px solid #ffffff50;
      color: #f9f9fb;
      font-size: 1rem;
      line-height: 145%;
      padding-bottom: 0.5rem;
      display: block;
      &:hover {
        text-decoration: none;
      }
    }
  }
`;

const PostTopics = ({ posts }) => {
  const topics = useMemo(() => {
    if (posts) {
      return extractTags(posts, 3);
    } else return [];
  }, [posts]);
  const { t } = useTranslation();

  return (
    <StyledPostTopics>
      <h5 className="mb-6">{t("blog.latestTopics")}</h5>
      <section className="post-topics">
        {topics.map((t) => {
          return (
            <span key={t.slug}>
              <Link href={`/news/tag/${t.slug}`}>{t.name}</Link>
            </span>
          );
        })}
      </section>
    </StyledPostTopics>
  );
};

PostTopics.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default PostTopics;
