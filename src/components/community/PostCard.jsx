import { Link } from "../../utils/Link";
import Image from "next/legacy/image";
import styled from "styled-components";
import Button from "../shared/Button";
import { useTranslation } from "next-i18next";

const StyledPostCard = styled.article`
  // Using !important here to overcome the global !important setting from solana-variables

  font-family: Diatype, var(--font-family-sans-serif);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .pod {
    &:hover {
      transform: scale(1.02);
      transition: transform 0.1s ease 0s;
    }
  }

  .post-card {
    &-title {
      margin-top: 1rem;
      color: white;
      font-style: normal;
      font-weight: bold;
      font-size: 1.3rem;
      line-height: 130% !important;
    }

    &-image {
      margin: 0 0 10px 0;
      width: auto;
      height: 100%;
      background: var(--color-secondary) no-repeat center center;
      background-size: cover;

      &::before,
      &::after {
        background-color: #000;
        border-radius: 12px;
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

/**
 * Show blog post data in the card
 *
 * @param {object} post - Blog post data
 * @returns {JSX.Element}
 * @constructor
 */
const PostCard = ({ post }) => {
  const { t } = useTranslation();
  const url = `/news/${post?.data?.slug}/`;
  const featuredImage = post?.data?.image ?? "/src/img/news/blogbackup.png";

  return (
    <StyledPostCard>
      <div>
        <div className="ratio ratio-16x9 pod">
          <Link to={url}>
            <Image
              className="post-card-image"
              src={featuredImage}
              loading="eager"
              quality={90}
              width={1920}
              height={1073}
            />
          </Link>
        </div>
        <h3 className="post-card-title">{post?.name}</h3>
      </div>
      <div>
        <Button to={url}>{t("blog.readArticle")}</Button>
      </div>
    </StyledPostCard>
  );
};

export default PostCard;
