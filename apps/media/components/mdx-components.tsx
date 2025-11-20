import { format } from "date-fns";
import React from "react";
import {
  Components,
  TinaMarkdown,
  TinaMarkdownContent,
} from "tinacms/dist/rich-text";
import Image from "next/image";
import { Prism } from "tinacms/dist/rich-text/prism";
import { Video } from "./blocks/video";
// Block types for post body templates
type VideoBlockData = {
  __typename?: "Post_BodyVideo";
  background?: string;
  color?: string;
  url?: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  muted?: boolean;
};

type StatsBlockData = {
  __typename?: "Post_BodyStats";
  background?: string;
  title?: string;
  description?: string;
  stats?: Array<{
    stat?: string;
    type?: string;
  }>;
};
import { Mermaid } from "./blocks/mermaid";
import { Tweet } from "react-tweet";
import { Gallery, GalleryProps } from "./ui/gallery";
import { Stats } from "./blocks/stats";

export const components: Components<{
  BlockQuote: {
    children: TinaMarkdownContent;
    authorName: string;
  };
  DateTime: {
    format?: string;
  };
  NewsletterSignup: {
    placeholder: string;
    buttonText: string;
    children: TinaMarkdownContent;
    disclaimer?: TinaMarkdownContent;
  };
  video: VideoBlockData;
  tweet: {
    id: string;
  };
  iframe: {
    src: string;
    width?: string;
    height?: string;
    allow?: string;
  };
  gallery: GalleryProps;
  stats: StatsBlockData;
  sup: {
    children: TinaMarkdownContent;
  };
  footnotes: React.ReactNode;
}> = {
  code_block: (props) => {
    if (!props) {
      return <></>;
    }

    if (props.lang === "mermaid") {
      return <Mermaid value={props.value} />;
    }

    return <Prism lang={props.lang} value={props.value} theme={"vsDark"} />;
  },
  footnotes: () => {
    return (
      <h2 id="footnotes" className="scroll-mt-20">
        Footnotes
      </h2>
    );
  },
  sup: (props) => (
    <sup>
      <TinaMarkdown
        content={props.children}
        components={{
          p: (innerProps: any) => (
            <a href="#footnotes">{innerProps?.children}</a>
          ),
        }}
      />
    </sup>
  ),
  BlockQuote: (props: {
    children: TinaMarkdownContent;
    authorName: string;
  }) => {
    return (
      <div>
        <blockquote>
          <TinaMarkdown content={props.children} />
          {props.authorName}
        </blockquote>
      </div>
    );
  },
  DateTime: (props) => {
    const dt = React.useMemo(() => {
      return new Date();
    }, []);

    switch (props.format) {
      case "iso":
        return <span>{format(dt, "yyyy-MM-dd")}</span>;
      case "utc":
        return <span>{format(dt, "eee, dd MMM yyyy HH:mm:ss OOOO")}</span>;
      case "local":
        return <span>{format(dt, "P")}</span>;
      default:
        return <span>{format(dt, "P")}</span>;
    }
  },
  NewsletterSignup: (props) => {
    return (
      <div className="bg-card">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div>
            <TinaMarkdown content={props.children} />
          </div>
          <div className="mt-8 ">
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email-address"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 border border-gray-300 shadow-xs placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:max-w-xs rounded-md"
                placeholder={props.placeholder}
              />
              <div className="mt-3 rounded-md shadow-sm sm:mt-0 sm:ml-3 sm:shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center py-3 px-5 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  {props.buttonText}
                </button>
              </div>
            </form>
            <div className="mt-3 text-sm text-gray-500">
              {props.disclaimer && <TinaMarkdown content={props.disclaimer} />}
            </div>
          </div>
        </div>
      </div>
    );
  },
  img: (props) => {
    if (!props) {
      return <></>;
    }
    return (
      <figure className="w-full my-6">
        <div className="relative w-full">
          <Image
            src={props.url}
            alt={props.alt || ""}
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
          />
        </div>
        {props.alt && (
          <figcaption className="text-sm text-muted-foreground mt-2 text-center">
            {props.alt}
          </figcaption>
        )}
      </figure>
    );
  },
  mermaid: (props: any) => <Mermaid {...props} />,
  video: (props) => {
    return <Video data={props} />;
  },
  tweet: (props: { id: string }) => (
    <div data-theme="dark">
      <Tweet id={props.id} />
    </div>
  ),
  iframe: (props) => (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: props.height || 0,
        paddingBottom: props.height ? 0 : "61.5746%",
      }}
    >
      <iframe
        src={props.src}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        allow={props.allow || "encrypted-media"}
        allowFullScreen
      />
    </div>
  ),
  gallery: (props) => {
    return <Gallery {...props} />;
  },
  stats: (props) => {
    const statsData = {
      title: props.title || "",
      description: props.description || "",
      stats: props.stats?.map((stat) => ({
        stat: stat?.stat,
        type: stat?.type,
      })),
      background: props.background || "bg-default",
    };

    return <Stats data={statsData} />;
  },
};
