"use client";
import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { PostQuery } from "@/tina/__generated__/types";
import { useLayout } from "@/components/layout/layout-context";
import { Section } from "@/components/layout/section";
import { components } from "@/components/mdx-components";
import ErrorBoundary from "@/components/error-boundary";
import { CallToAction } from "@/components/ui/call-to-action";
import Switchback from "@/components/ui/switchback";
import { SocialShare } from "@/components/ui/social-share";

interface ClientPostProps {
  data: PostQuery;
  variables: {
    relativePath: string;
  };
  query: string;
}

export default function PostClientPage(props: ClientPostProps) {
  const [shareUrl, setShareUrl] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const { theme } = useLayout();
  const { data } = useTina({ ...props });
  const post = data.post;

  const date = new Date(post.date!);
  let formattedDate = "";
  if (!isNaN(date.getTime())) {
    formattedDate = format(date, "d MMMM yyyy");
  }

  const shareTitle = post.title || "";

  const contentRef = React.useRef<HTMLDivElement>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const [sidebarStyle, setSidebarStyle] = React.useState<React.CSSProperties>(
    {}
  );

  React.useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || !sidebarRef.current) return;

      const contentRect = contentRef.current.getBoundingClientRect();
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const contentTop = contentRect.top;
      const contentBottom = contentRect.bottom;
      const sidebarHeight = sidebarRect.height;
      const headerHeight = 82;
      const spacing = 24;

      if (contentTop > headerHeight + spacing) {
        // Above view - relative position
        setSidebarStyle({ position: "relative", top: 0 });
      } else if (contentBottom > sidebarHeight + headerHeight + spacing) {
        // Stick to top with space for header
        setSidebarStyle({
          position: "fixed",
          top: `${headerHeight + spacing}px`,
          width: "200px",
        });
      } else {
        // Stick to bottom of content
        setSidebarStyle({
          position: "absolute",
          bottom: 0,
          top: "auto",
          width: "200px",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ErrorBoundary>
      <Section>
        <div className="relative w-full py-12 px-4 md:px-6 lg:px-8 pt-8 md:pt-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(82,158,255,0.25),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(25,237,152,0.15),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(153,69,255,0.15),transparent_75%)]" />

          {/* Contained content */}
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row lg:gap-12 lg:items-start">
              {/* Left Column - Text & Meta */}
              <div className="flex-1 lg:max-w-xl">
                <h1
                  data-tina-field={tinaField(post, "title")}
                  className="w-full mb-6 text-5xl md:text-6xl font-bold tracking-tight text-left"
                >
                  {post.title}
                </h1>

                {/* Social Share Icons */}
                <SocialShare title={shareTitle} className="gap-3 mb-6" />

                {/* Date and Author */}
                <p className="text-base text-gray-400 mb-8 lg:mb-0">
                  <span data-tina-field={tinaField(post, "date")}>
                    {formattedDate}
                  </span>
                  {post.author && (
                    <>
                      <span>, by </span>
                      <span data-tina-field={tinaField(post.author, "name")}>
                        {post.author.name}
                      </span>
                    </>
                  )}
                </p>
              </div>

              {/* Right Column - Hero Image */}
              {post.heroImage && (
                <div className="flex-1 lg:max-w-md mt-8 lg:mt-0">
                  <div
                    data-tina-field={tinaField(post, "heroImage")}
                    className="relative"
                  >
                    <Image
                      priority={true}
                      src={post.heroImage}
                      alt={post.title}
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

        {/* Main content area with CTA sidebar */}
        {post.cta ? (
          <div className="max-w-6xl mx-auto mt-12 px-4 md:px-6 lg:px-8">
            <div className="flex gap-8 lg:gap-12 items-start">
              {/* Main content column */}
              <div className="flex-1 min-w-0" ref={contentRef}>
                <div
                  data-tina-field={tinaField(post, "_body")}
                  className="prose dark:prose-dark w-full max-w-none"
                >
                  <TinaMarkdown
                    content={post._body}
                    components={{
                      ...components,
                    }}
                  />
                </div>
              </div>

              {/* Sticky CTA sidebar - only sticks within main content bounds */}
              <div className="hidden lg:block lg:w-50 lg:flex-shrink-0 relative">
                <div ref={sidebarRef} style={sidebarStyle}>
                  <CallToAction
                    eyebrow={post.cta.eyebrow || undefined}
                    headline={post.cta.headline || undefined}
                    description={post.cta.description || undefined}
                    button={{
                      label: post.cta.button?.label || "",
                      url: post.cta.button?.url || "",
                    }}
                    className={post.cta.className || undefined}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* No CTA - full width content */
          <div className="max-w-6xl mx-auto mt-12 px-4 md:px-6 lg:px-8">
            <div
              data-tina-field={tinaField(post, "_body")}
              className="prose dark:prose-dark w-full max-w-none"
            >
              <TinaMarkdown
                content={post._body}
                components={{
                  ...components,
                }}
              />
            </div>
          </div>
        )}
      </Section>
      {post.switchback && (
        <Section className="max-w-6xl mx-auto">
          <Switchback
            title={post.switchback.title}
            image={{
              src: post.switchback.image?.src ?? "",
              alt: post.switchback.image?.alt ?? "",
            }}
            eyebrow={post.switchback.eyebrow || undefined}
            body={post.switchback.body || undefined}
            buttons={post.switchback.buttons?.map((button) => ({
              label: button?.label || "",
              url: button?.url || "",
            }))}
          />
        </Section>
      )}
    </ErrorBoundary>
  );
}
