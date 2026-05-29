import type { Metadata } from "next";
import type { ComponentPropsWithoutRef } from "react";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Twitter, Facebook, Linkedin, Send } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAlternates } from "@workspace/i18n/routing";
import { config } from "@@/src/config";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string; slug: string }> };

const UPGRADES_CONTENT_DIR = path.join(process.cwd(), "content", "upgrades");

const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="text-4xl md:text-5xl font-bold mb-6" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="text-3xl md:text-4xl font-bold mb-6 mt-16" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="text-2xl md:text-3xl font-semibold mb-4 mt-12" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-lg text-gray-300 mb-6 leading-relaxed" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="list-disc list-inside mb-6 space-y-3 text-gray-300 ml-4"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="list-decimal list-inside mb-6 space-y-3 text-gray-300 ml-4"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="text-lg text-gray-300 leading-relaxed" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="text-[#14F195] hover:underline font-medium" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="bg-gray-800 px-2 py-1 rounded text-sm font-mono text-[#14F195]"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="bg-gray-900 p-6 rounded-lg overflow-x-auto mb-6 border border-white/10"
      {...props}
    />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="overflow-x-auto mb-8">
      <table
        className="w-full border-collapse border border-white/10 rounded-lg"
        {...props}
      />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-gray-900" {...props} />
  ),
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => <tbody {...props} />,
  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr className="border-b border-white/10" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-6 py-4 text-left text-sm font-semibold text-white"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="px-6 py-4 text-base text-gray-300" {...props} />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-12 border-white/20" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-l-4 border-[#14F195] pl-6 italic text-gray-400 my-8 text-lg"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-white" {...props} />
  ),
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="italic text-gray-200" {...props} />
  ),
};

function getUpgradeFilePath(slug: string) {
  return path.join(UPGRADES_CONTENT_DIR, `${slug}.md`);
}

function getMarkdownContent(slug: string) {
  const filePath = getUpgradeFilePath(slug);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, "utf-8");
}

function getTitle(markdownContent: string) {
  return markdownContent.match(/^#\s+(.+)$/m)?.[1] ?? "Solana Upgrade";
}

const FALLBACK_DESCRIPTION =
  "Core protocol work being done to improve security, increase bandwidth, and reduce latency on Solana.";

// Pull the first prose paragraph out of the markdown for the meta description,
// skipping the H1 heading and the "**date** • Solana Foundation" byline.
function getDescription(markdownContent: string) {
  const paragraph: string[] = [];
  let started = false;

  for (const raw of markdownContent.split("\n")) {
    const line = raw.trim();
    if (!started) {
      if (!line || line.startsWith("#") || /^\*\*.+\*\*/.test(line)) continue;
      started = true;
      paragraph.push(line);
    } else {
      if (!line) break;
      paragraph.push(line);
    }
  }

  let text = paragraph
    .join(" ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // markdown links -> link text
    .replace(/[*_`>#]/g, "") // strip leftover markdown formatting
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return FALLBACK_DESCRIPTION;
  if (text.length > 155) {
    text = text.slice(0, 155).replace(/\s+\S*$/, "") + "…";
  }
  return text;
}

function SocialShare({ title, url }: { title: string; url: string }) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const links = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      Icon: Twitter,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: Facebook,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: Linkedin,
    },
    {
      label: "Share on Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: Send,
    },
  ];

  return (
    <div className="flex items-center gap-3 mb-10">
      <span className="text-sm text-gray-400">Share:</span>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-gray-400 hover:text-[#14F195] transition-colors"
        >
          <Icon className="size-5" />
        </a>
      ))}
    </div>
  );
}

export function generateStaticParams() {
  return fs
    .readdirSync(UPGRADES_CONTENT_DIR)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => ({ slug: fileName.replace(/\.md$/, "") }));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const markdownContent = getMarkdownContent(slug);

  if (!markdownContent) {
    notFound();
  }

  const title = getTitle(markdownContent);
  const shareUrl = `${config.siteUrl}/upgrades/${slug}`;

  return (
    <article className="bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <Link
          href="/upgrades"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#14F195] transition-colors mb-10"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Upgrades</span>
        </Link>

        <SocialShare title={title} url={shareUrl} />

        <MDXRemote
          source={markdownContent}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>
    </article>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const markdownContent = getMarkdownContent(slug);

  if (!markdownContent) {
    return {};
  }

  const title = getTitle(markdownContent);
  const description = getDescription(markdownContent);
  const fullTitle = `${title} | Solana Upgrades`;

  return {
    title: fullTitle,
    description,
    alternates: getAlternates(`/upgrades/${slug}`, locale),
    openGraph: {
      title: fullTitle,
      description,
      type: "article",
      url: `/upgrades/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
