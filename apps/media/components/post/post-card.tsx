import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PostItem } from "@/lib/post-types";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { ArrowUpRight } from "lucide-react";

interface PostCardProps {
  post: PostItem;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link
      key={post.id}
      href={post.url}
      className="flex flex-col gap-4 group hover:opacity-80 transition-all cursor-pointer pb-6 border-b border-border"
    >
      {post?.heroImage && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post?.heroImage}
            alt={post?.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">{post.published}</span>
        {post.tags?.map(
          (tag: string) =>
            tag && (
              <Badge key={`${post.id}-${tag}`} variant="outline">
                {tag}
              </Badge>
            )
        )}
      </div>
      <h3 className="text-xl font-semibold group-hover:underline">
        {post.title}
      </h3>
      <div className="text-muted-foreground grow">
        <TinaMarkdown content={post.description} />
      </div>
      <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:underline w-fit">
        Read article
        <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </span>
    </Link>
  );
};
