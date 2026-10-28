import { RequestForStartupsPage } from "./request-for-startups";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

import { fetchStartupPosts } from "@/lib/media/post";
import { getMediaImageProxyUrl } from "@/lib/media/solution-news";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 300;

export default async function Page() {
  const { posts } = await fetchStartupPosts();
  const news = posts.slice(0, 4).map((post) => ({
    id: post.id,
    title: post.title,
    date: post.publishedAt || undefined,
    link: post.url,
    image: getMediaImageProxyUrl(
      post.heroImage || "/uploads/posts/default-blog.webp",
    )!,
  }));

  return <RequestForStartupsPage news={news} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "request-for-startups.meta",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getAlternates("/request-for-startups", locale),
  };
}
