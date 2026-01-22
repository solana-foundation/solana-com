import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PostItem } from "@/lib/post-types";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { components } from "@/components/mdx-components";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostItem;
  variant?: "vertical" | "horizontal";
}

// Helper function to normalize description to an array for DocumentRenderer
function normalizeDescription(description: any): any[] {
  if (!description) return [];

  // If it's already an array, return it
  if (Array.isArray(description)) return description;

  // If it's an object with node.children, use that
  if (description && typeof description === "object" && "node" in description) {
    const children = (description as any).node?.children;
    if (Array.isArray(children)) return children;
  }

  // If it's an object with children directly, use that
  if (
    description &&
    typeof description === "object" &&
    "children" in description
  ) {
    const children = (description as any).children;
    if (Array.isArray(children)) return children;
  }

  // Default to empty array
  return [];
}

export const PostCard = ({ post, variant = "vertical" }: PostCardProps) => {
  const descriptionDoc = normalizeDescription(post.description);

  if (variant === "horizontal") {
    return (
      <Link
        href={post.url}
        className={cn(
          "flex flex-col gap-4 group hover:opacity-80 transition-all cursor-pointer"
        )}
      >
        <h3 className="text-xl font-semibold group-hover:underline">
          {post.title}
        </h3>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {post?.heroImage && (
            <div className="relative aspect-video overflow-hidden w-full max-w-80 sm:w-[30%] shrink-0">
              <Image
                src={post?.heroImage}
                alt={post?.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex flex-col gap-4 grow">
            <div className="text-muted-foreground grow">
              <DocumentRenderer
                document={descriptionDoc}
                renderers={components}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {post.published}
              </span>
              {post.tags?.map(
                (tag: string) =>
                  tag && (
                    <Badge key={`${post.id}-${tag}`} variant="outline">
                      {tag}
                    </Badge>
                  )
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={post.url}
      className={cn(
        "flex flex-col gap-4 group hover:opacity-80 transition-all cursor-pointer pb-6 border-b border-border"
      )}
    >
      {post?.heroImage && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post?.heroImage}
            alt={post?.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
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
        <DocumentRenderer document={descriptionDoc} renderers={components} />
      </div>
      <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:underline w-fit">
        Read article
        <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </span>
    </Link>
  );
};
