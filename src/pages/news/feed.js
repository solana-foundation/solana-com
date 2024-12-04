import { Feed } from "feed";
import { getPostsPage } from "@/lib/builder/api";
import { NEWS_BUILDER_CONFIG } from "@/lib/builder/news/constants";

const generateRssFeed = async (posts) => {
  const newsURL = "https://solana.com/news/";
  const feed = new Feed({
    title: "Solana News Feed",
    description: "Stay up to date with the latest Solana News",
    id: newsURL,
    link: newsURL,
    language: "en",
    image: "https://solana.com/favicon.png",
    favicon: "https://solana.com/favicon.png",
  });

  posts.forEach((post) => {
    const feedItemData = {
      title:
        typeof post?.data?.title === "string"
          ? post.data.title
          : post.data.seo?.seoTitle,
      id: post.id,
      link: newsURL + post.data.slug,
      description: post.data.intro || post.data.seo?.seoDescription,
      date: new Date(post.data.datePublished),
    };

    if (post.data.image) {
      feedItemData.image = {
        url: post.data.image,
        type: "image/webp", // Images in builder are converted webp by default
      };
    }

    feed.addItem(feedItemData);
  });

  return feed.rss2();
};

const Rss = () => {};

export async function getServerSideProps({ res }) {
  const posts = await getPostsPage(NEWS_BUILDER_CONFIG.postsModel, 1, 20, "");
  const rss = await generateRssFeed(posts);

  res.setHeader("Content-Type", "text/xml");
  res.write(rss);
  res.end();

  return { props: {} };
}

export default Rss;
