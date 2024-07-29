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
    const postData = combinePostData(post.data?.blocks[0]?.children);

    const feedItemData = {
      title: post.data.title,
      id: post.id,
      link: newsURL + post.data.slug,
      description: post.data.intro,
      date: new Date(post.data.datePublished),
      content: Array.isArray(postData) ? postData.join(" ") : "",
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

/**
 * Goes through any Copy or Text components in the builder IO post and adds the raw HTML or text into an array so we
 * add that data to our RSS feed
 *
 * @param {Array} blockData Block data that comes from fetching a Builder IO Post
 * @returns {Array} An array of strings that contain the post data or an empty array
 */
const combinePostData = (blockData) => {
  const acceptableBlockNames = ["Copy", "Text"];

  if (blockData) {
    const postContent = blockData.map((block) => {
      if (acceptableBlockNames.includes(block?.component?.name)) {
        if (block.component.name === "Text") {
          return block.component.options.text;
        } else if (block.component.name === "Copy") {
          return block.component.options.rawHtml;
        }
      }
    });

    return postContent;
  }

  return [];
};

const Rss = () => {};

export async function getServerSideProps({ res }) {
  const posts = await getPostsPage(NEWS_BUILDER_CONFIG.postsModel, 1, 100, "");
  const rss = await generateRssFeed(posts);

  res.setHeader("Content-Type", "text/xml");
  res.write(rss);
  res.end();

  return { props: {} };
}

export default Rss;
