import client from "@/tina/__generated__/client";
import PostsClientPage from "./client-page";

export const revalidate = 300;

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const featuredPost = await client.queries.postConnection({
    last: 1,
    sort: "date",
    filter: {
      tags: {
        tag: {
          tag: {
            name: {
              eq: "Featured",
            },
          },
        },
      },
    },
  });

  const posts = await client.queries.postConnection({
    last: 13,
    sort: "date",
  });

  return (
    <PostsClientPage
      featuredPostData={featuredPost.data}
      postsData={posts.data}
      initialPageInfo={posts.data.postConnection.pageInfo}
    />
  );
}
