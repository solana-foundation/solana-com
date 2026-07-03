import Link from "next/link";
import Image from "next/image";
import { PostItem } from "@/lib/post-types";
import {
  DocumentRenderer,
  DocumentRendererProps,
} from "@keystatic/core/renderer";
import { components } from "@/components/mdx-components";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostItem;
  variant?: "vertical" | "horizontal";
}

/**
 * Editorial meta line: a single durable category label in the accent color
 * followed by the publish date. Replaces noisy tag pills so index cards read
 * like a news front.
 */
function PostMeta({ post }: { post: PostItem }) {
  const category = post.categories?.find(Boolean);
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      {category && (
        <span className="font-semibold uppercase tracking-wider text-primary">
          {category}
        </span>
      )}
      {category && post.published && (
        <span aria-hidden className="text-muted-foreground">
          &middot;
        </span>
      )}
      {post.published && (
        <span className="text-muted-foreground">{post.published}</span>
      )}
    </div>
  );
}

export interface DescriptionContentProps {
  description?:
    | DocumentRendererProps["document"]
    | { node: { children: DocumentRendererProps["document"] } };
}

// Helper: render description as plain text or DocumentRenderer document
export function DescriptionContent({ description }: DescriptionContentProps) {
  if (!description) return null;

  // Plain string from fields.text()
  if (typeof description === "string") {
    return <p>{description}</p>;
  }

  // Array (DocumentRenderer format)
  if (Array.isArray(description)) {
    return <DocumentRenderer document={description} renderers={components} />;
  }

  // Object with node.children
  if (typeof description === "object" && "node" in description) {
    const children =
      "children" in description.node ? description.node?.children : null;
    if (Array.isArray(children)) {
      return <DocumentRenderer document={children} renderers={components} />;
    }
  }

  // Object with children directly
  if (typeof description === "object" && "children" in description) {
    const children = description.children;
    if (Array.isArray(children)) {
      return <DocumentRenderer document={children} renderers={components} />;
    }
  }

  return null;
}

export const PostCard = ({ post, variant = "vertical" }: PostCardProps) => {
  if (variant === "horizontal") {
    return (
      <Link
        href={post.url}
        className="group flex flex-col gap-4 sm:flex-row-reverse sm:items-start sm:gap-6"
      >
        {post?.heroImage && (
          <div className="relative aspect-video w-full shrink-0 overflow-hidden sm:w-[34%]">
            <Image
              src={post?.heroImage}
              alt={post?.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex grow flex-col gap-3">
          <PostMeta post={post} />
          <h3 className="text-xl font-bold leading-snug tracking-tight group-hover:underline md:text-2xl">
            {post.title}
          </h3>
          <div className="line-clamp-3 text-sm text-muted-foreground">
            <DescriptionContent
              description={
                post.description as DescriptionContentProps["description"]
              }
            />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={post.url}
      className={cn("group flex flex-col gap-3 border-b border-border pb-6")}
    >
      {post?.heroImage && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post?.heroImage}
            alt={post?.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-opacity duration-300 group-hover:opacity-90"
            loading="lazy"
          />
        </div>
      )}
      <PostMeta post={post} />
      <h3 className="text-lg font-bold leading-snug tracking-tight group-hover:underline">
        {post.title}
      </h3>
      <div className="line-clamp-2 text-sm text-muted-foreground">
        <DescriptionContent
          description={
            post.description as DescriptionContentProps["description"]
          }
        />
      </div>
    </Link>
  );
};
