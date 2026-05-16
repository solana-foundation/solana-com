import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PostItem } from "@/lib/post-types";
import {
  DocumentRenderer,
  DocumentRendererProps,
} from "@keystatic/core/renderer";
import { components } from "@/components/mdx-components";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostItem;
  variant?: "vertical" | "horizontal";
}

function getUniqueValues(values: string[] | undefined): string[] {
  if (!values?.length) return [];
  return Array.from(new Set(values.filter(Boolean)));
}

interface DescriptionContentProps {
  description?:
    | DocumentRendererProps["document"]
    | { node: { children: DocumentRendererProps["document"] } };
}

// Helper: render description as plain text or DocumentRenderer document
function DescriptionContent({ description }: DescriptionContentProps) {
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
  const uniqueTags = getUniqueValues(post.tags);

  if (variant === "horizontal") {
    return (
      <Link
        href={post.url}
        className={cn(
          "flex flex-col gap-4 group hover:opacity-80 transition-all cursor-pointer",
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
              <DescriptionContent
                description={
                  post.description as DescriptionContentProps["description"]
                }
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {post.published}
              </span>
              {uniqueTags.map((tag: string, index: number) => (
                <Badge key={`${post.id}-${tag}-${index}`} variant="outline">
                  {tag}
                </Badge>
              ))}
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
        "flex flex-col gap-4 group hover:opacity-80 transition-all cursor-pointer pb-6 border-b border-border",
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
        {uniqueTags.map((tag: string, index: number) => (
          <Badge key={`${post.id}-${tag}-${index}`} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      <h3 className="text-xl font-semibold group-hover:underline">
        {post.title}
      </h3>
      <div className="text-muted-foreground grow">
        <DescriptionContent
          description={
            post.description as DescriptionContentProps["description"]
          }
        />
      </div>
      <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:underline w-fit">
        Read article
        <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </span>
    </Link>
  );
};
