import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { LinkItem } from "@/lib/link-types";
import {
  ArrowUpRight,
  FileText,
  Github,
  Play,
  Twitter,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkCardProps {
  link: LinkItem;
}

const linkTypeIcons = {
  article: FileText,
  tweet: Twitter,
  video: Play,
  github: Github,
  other: LinkIcon,
};

const linkTypeLabels = {
  article: "Article",
  tweet: "Tweet",
  video: "Video",
  github: "GitHub",
  other: "Link",
};

// Check if image is external (starts with http)
const isExternalImage = (src: string): boolean => {
  return src.startsWith("http://") || src.startsWith("https://");
};

export const LinkCard = ({ link }: LinkCardProps) => {
  const Icon = linkTypeIcons[link.linkType] || LinkIcon;
  const typeLabel = linkTypeLabels[link.linkType] || "Link";
  // External images should skip Next.js optimization
  const hasExternalImage =
    link.thumbnailImage && isExternalImage(link.thumbnailImage);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex flex-col gap-4 group hover:opacity-80 transition-all cursor-pointer pb-6 border-b border-border"
      )}
    >
      {link.thumbnailImage && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={link.thumbnailImage}
            alt={link.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            unoptimized={hasExternalImage}
          />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Icon className="size-3" />
          {typeLabel}
        </Badge>
        {link.source && (
          <span className="text-xs text-muted-foreground">{link.source}</span>
        )}
        {link.publishedAt && (
          <>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              {link.publishedAt}
            </span>
          </>
        )}
        {link.featured && (
          <Badge variant="default" className="bg-yellow-500/10 text-yellow-600">
            Featured
          </Badge>
        )}
      </div>
      <h3 className="text-xl font-semibold group-hover:underline">
        {link.title}
      </h3>
      {link.description && (
        <div className="text-muted-foreground grow line-clamp-3">
          {typeof link.description === "string" ? (
            <p>{link.description}</p>
          ) : (
            <p>{String(link.description)}</p>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {link.tags?.map(
          (tag: string) =>
            tag && (
              <Badge key={`${link.id}-${tag}`} variant="outline">
                {tag}
              </Badge>
            )
        )}
      </div>
      <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:underline w-fit">
        Open link
        <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </span>
    </a>
  );
};
