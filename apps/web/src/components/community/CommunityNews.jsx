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
    <section className="community-podcasts container pb-16">
      <h2>{t("community.popular.title")}</h2>
      <div className="grid grid-cols-12 gap-x-10 gap-y-12 mt-8">
        {posts.map((post, index) => (
          <div
            className="col-span-12 sm:col-span-6 md:col-span-4"
            key={post.id}
          >
            <PostCard post={post} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommunityNews;
