import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { reader } from "@/lib/reader";
import { Section } from "@/components/layout/section";
import { components } from "@/components/mdx-components";
import ErrorBoundary from "@/components/error-boundary";
import { CallToAction } from "@/components/ui/call-to-action";
import Switchback from "@/components/ui/switchback";
import { SocialShare } from "@/components/ui/social-share";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { markdocDocumentToPlainText } from "@/lib/markdoc-renderer";
import { config } from "@/lib/config";
import type { Metadata } from "next";

export const revalidate = 300;
export const dynamicParams = true;

// Transform Markdoc AST nodes to flatten attributes for DocumentRenderer
// DocumentRenderer expects { type, src, alt, text, ... } but Markdoc AST has { type, attributes: { src, alt, content } }
function transformMarkdocNodes(nodes: any[]): any[] {
  if (!Array.isArray(nodes)) return [];

  return nodes.map((node) => {
    if (!node || typeof node !== "object") return node;

    // Handle custom component blocks (like tweet, video, etc.)
    // Keystatic markdoc component blocks can have different structures:
    // 1. type: "component" with name property (markdoc AST)
    // 2. component property with the component name (Keystatic document format)
    // 3. type already set to component name (already transformed)
    if (node.type === "component" && node.name) {
      // Transform component blocks from markdoc AST format
      const transformed: any = {
        type: node.name, // Use the component name as the type (e.g., "tweet", "video")
        ...node.attributes, // Flatten attributes (e.g., { id: "..." })
      };

      // Recursively transform children if they exist
      if (node.children && Array.isArray(node.children)) {
        transformed.children = transformMarkdocNodes(node.children);
      }

      return transformed;
    }

    // Handle Keystatic document format where component blocks have a "component" property
    if (node.component && typeof node.component === "string") {
      const transformed: any = {
        type: node.component, // Use component name as type
        ...node, // Include all other properties (including id, url, etc.)
      };
      delete transformed.component; // Remove the component property

      // Recursively transform children if they exist
      if (node.children && Array.isArray(node.children)) {
        transformed.children = transformMarkdocNodes(node.children);
      }

      return transformed;
    }

    // If node already has a type that matches a custom component, ensure attributes are flattened
    // This handles cases where the node is already partially transformed
    if (
      node.type &&
      [
        "tweet",
        "video",
        "iframe",
        "gallery",
        "stats",
        "blockquote",
        "datetime",
        "newslettersignup",
        "footnotes",
        "sup",
      ].includes(node.type)
    ) {
      // Ensure attributes are flattened for custom components
      const transformed: any = {
        ...node,
        ...(node.attributes || {}), // Flatten any remaining attributes
      };
      delete transformed.attributes; // Remove attributes object if it exists

      // Recursively transform children if they exist
      if (node.children && Array.isArray(node.children)) {
        transformed.children = transformMarkdocNodes(node.children);
      }

      return transformed;
    }

    // Flatten attributes onto the node for standard nodes
    const transformed: any = {
      ...node,
      ...node.attributes,
    };

    // Map 'content' to 'text' for text nodes - DocumentRenderer expects 'text' property
    if (node.type === "text" && node.attributes?.content !== undefined) {
      transformed.text = node.attributes.content;
    }

    // Recursively transform children
    if (node.children && Array.isArray(node.children)) {
      transformed.children = transformMarkdocNodes(node.children);
    }

    return transformed;
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ urlSegments: string[]; locale: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.urlSegments.join("/");

  const post = await reader.collections.posts.read(slug);

  if (!post) {
    notFound();
  }

  // Resolve author
  let author = null;
  if (post.author) {
    author = await reader.collections.authors.read(post.author);
  }

  // Resolve CTA
  let cta = null;
  if (post.cta) {
    cta = await reader.collections.ctas.read(post.cta);
  }

  // Resolve switchback
  let switchback = null;
  if (post.switchback) {
    switchback = await reader.collections.switchbacks.read(post.switchback);
  }

  const date = post.date ? new Date(post.date) : null;
  let formattedDate = "";
  if (date && !isNaN(date.getTime())) {
    formattedDate = format(date, "d MMMM yyyy");
  }

  return (
    <ErrorBoundary>
      <Section>
        <div className="relative w-full py-12 px-4 md:px-6 lg:px-8 pt-8 md:pt-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(82,158,255,0.25),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(25,237,152,0.15),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(153,69,255,0.15),transparent_75%)]" />

          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row lg:gap-12 lg:items-start">
              <div className="flex-1 lg:max-w-xl">
                <h1 className="w-full mb-6 text-5xl md:text-6xl font-bold tracking-tight text-left">
                  {String(post.title)}
                </h1>

                <SocialShare
                  title={String(post.title)}
                  className="gap-3 mb-6"
                />

                <p className="text-base text-gray-400 mb-8 lg:mb-0">
                  <span>{formattedDate}</span>
                  {author && (
                    <>
                      <span>, by </span>
                      <span>{String(author.name)}</span>
                    </>
                  )}
                </p>
              </div>

              {post.heroImage && (
                <div className="flex-1 lg:max-w-md mt-8 lg:mt-0">
                  <div className="relative">
                    <Image
                      priority={true}
                      src={post.heroImage}
                      alt={String(post.title)}
                      width={400}
                      height={400}
                      className="relative z-10 block w-full h-auto opacity-100"
                      style={{ maxWidth: "100%" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {await (async () => {
          // Get the body content from Keystatic
          const bodyResult = await post.body();
          // For markdoc fields, the content is in result directly as an array
          // or it's in result.node.children for AST format
          let bodyDoc: any[] = [];
          if (Array.isArray(bodyResult)) {
            // Already an array - transform to ensure component blocks are properly formatted
            bodyDoc = transformMarkdocNodes(bodyResult);
          } else if (bodyResult && typeof bodyResult === "object") {
            // Check for Keystatic's document format (array at top level)
            // or Markdoc AST format (node.children)
            const result = bodyResult as any;
            if (result.node?.children) {
              // Markdoc AST - transform nodes to have attributes at top level
              bodyDoc = transformMarkdocNodes(result.node.children);
            } else if (Array.isArray(result)) {
              bodyDoc = transformMarkdocNodes(result);
            }
          }

          // Debug: Log the structure to understand how component blocks are formatted
          if (process.env.NODE_ENV === "development") {
            const componentNodes = bodyDoc.filter(
              (node: any) =>
                node.component ||
                node.type === "component" ||
                (node.type &&
                  ["tweet", "video", "iframe", "gallery", "stats"].includes(
                    node.type
                  ))
            );
            if (componentNodes.length > 0) {
              console.log(
                "Component nodes found:",
                JSON.stringify(componentNodes.slice(0, 2), null, 2)
              );
            }
          }

          if (cta) {
            return (
              <div className="max-w-6xl mx-auto mt-12 px-4 md:px-6 lg:px-8">
                <div className="flex gap-8 lg:gap-12 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="prose dark:prose-dark w-full max-w-none">
                      <DocumentRenderer
                        document={bodyDoc}
                        renderers={components}
                      />
                    </div>
                  </div>

                  <div className="hidden lg:block lg:w-50 lg:flex-shrink-0 relative">
                    <div className="sticky top-24">
                      <CallToAction
                        eyebrow={cta.eyebrow || undefined}
                        headline={cta.headline || undefined}
                        description={cta.description || undefined}
                        button={{
                          label: cta.button?.label || "",
                          url: cta.button?.url || "",
                        }}
                        className={cta.className || undefined}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="max-w-6xl mx-auto mt-12 px-4 md:px-6 lg:px-8">
              <div className="prose dark:prose-dark w-full max-w-none">
                <DocumentRenderer document={bodyDoc} renderers={components} />
              </div>
            </div>
          );
        })()}
      </Section>
      {switchback && (
        <Section className="max-w-6xl mx-auto">
          <Switchback
            title={String(switchback.title)}
            image={{
              src: switchback.image?.src ?? "",
              alt: switchback.image?.alt ?? "",
            }}
            eyebrow={switchback.eyebrow || undefined}
            body={await switchback.body()}
            buttons={switchback.buttons?.map((button) => ({
              label: button?.label || "",
              url: button?.url || "",
            }))}
          />
        </Section>
      )}
    </ErrorBoundary>
  );
}

export async function generateStaticParams() {
  try {
    const slugs = await reader.collections.posts.list();
    return slugs.map((slug) => ({
      urlSegments: slug.split("/"),
    }));
  } catch (error) {
    console.warn("Failed to generate static params for posts:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ urlSegments: string[]; locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.urlSegments.join("/");

  const post = await reader.collections.posts.read(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "",
    };
  }

  // Get author name for meta
  let authorName: string | undefined;
  if (post.author) {
    const author = await reader.collections.authors.read(post.author);
    if (author) {
      authorName = String(author.name);
    }
  }

  // Derive SEO from post title, description, and hero image
  const title = String(post.title);

  // Description is a plain text field, not markdoc, so access it directly
  const description = post.description
    ? String(post.description).trim()
    : undefined;

  // Use hero image for OG and Twitter images
  const ogImage = post.heroImage || config.siteMetadata.socialShare;

  // Build canonical URL
  const canonicalUrl = `${config.siteUrl}/news/${slug}`;

  return {
    title,
    description: description || undefined,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description: description || undefined,
      url: canonicalUrl,
      type: "article",
      siteName: config.siteMetadata.title,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
      publishedTime: post.date || undefined,
      authors: authorName ? [authorName] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      images: ogImage ? [ogImage] : undefined,
      creator: config.social.twitter.name
        ? `@${config.social.twitter.name}`
        : undefined,
    },
    authors: authorName ? [{ name: authorName }] : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
