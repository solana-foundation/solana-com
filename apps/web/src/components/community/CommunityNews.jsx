import { useTranslations } from "next-intl";
import PostCard from "../community/PostCard";

/**
 * Display latest blog posts
 *
 * @param {Array} posts - Array of latest posts
 * @returns {JSX.Element}
 * @constructor
 */
const CommunityNews = ({ posts }) => {
  const t = useTranslations();

  return (
    <section className="community-podcasts container">
      <h2>{t("community.popular.title")}</h2>
      <div className="row community-socials-content">
        {posts.map((post, index) => (
          <div className="col-12 col-sm-6 col-md-4" key={post.id}>
            <PostCard post={post} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommunityNews;
