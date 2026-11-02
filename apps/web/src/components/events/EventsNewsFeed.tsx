import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "@/utils/Link";
import type { PostItem } from "@/types/media";

export default function EventsNewsFeed({ posts }: { posts: PostItem[] }) {
  const t = useTranslations();
  if (posts.length === 0) return null;

  return (
    <section className="container border-t border-white/10 py-16 md:py-24">
      <h2 className="mb-10 font-brand text-3xl font-medium tracking-[-0.01em] text-white md:text-5xl">
        {t("community.popular.title")}
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <article key={post.url} className="group min-w-0">
            <Link to={post.url} className="block text-white no-underline">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-white/5">
                {post.heroImage && (
                  <Image
                    src={`/api/media/image?path=${encodeURIComponent(post.heroImage)}`}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="mt-4 font-brand text-lg font-medium leading-snug group-hover:underline">
                {post.title}
              </h3>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
