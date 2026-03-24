import type { Metadata } from "next";

export type SeoImage =
  | string
  | {
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    };

type SeoIconsConfig = {
  ico?: string;
  png?: string;
  svg?: string;
  appleTouchIcon?: string;
  shortcut?: string;
};

export type SeoResolverConfig = {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  titleTemplate?: string;
  description: string;
  author?: string;
  twitterHandle?: string;
  defaultImage: SeoImage;
  keywords?: string[];
  manifest?: string;
  icons?: SeoIconsConfig;
  robots?: Metadata["robots"];
};

export type SeoMetadataInput = {
  locale?: string;
  path?: string;
  canonical?: string;
  alternates?: Metadata["alternates"];
  title?: string;
  description?: string;
  image?: SeoImage;
  keywords?: string[];
  type?: "website" | "article";
  noindex?: boolean;
  authors?: Metadata["authors"];
  other?: Metadata["other"];
  openGraph?: {
    type?: "website" | "article";
    url?: string;
    locale?: string;
    images?: SeoImage[];
    [key: string]: unknown;
  };
  twitter?: {
    images?: string[];
    [key: string]: unknown;
  };
};

function joinUrl(baseUrl: string, path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const url = new URL(baseUrl);

  if (path.startsWith("/")) {
    const basePath = url.pathname.replace(/\/$/, "");
    return new URL(`${basePath}${path}`, url.origin).toString();
  }

  return new URL(path, `${url.toString().replace(/\/?$/, "/")}`).toString();
}

function normalizeImage(image: SeoImage, fallbackAlt: string) {
  if (typeof image === "string") {
    return {
      url: image,
      alt: fallbackAlt,
    };
  }

  return {
    alt: fallbackAlt,
    ...image,
  };
}

function normalizeImages(images: SeoImage[] | undefined, fallbackAlt: string) {
  return images?.map((image) => normalizeImage(image, fallbackAlt));
}

function createRobotsDirective(
  robots: Metadata["robots"] | undefined,
  noindex: boolean | undefined,
) {
  if (!noindex) {
    return robots;
  }

  return {
    index: false,
    follow: false,
  } satisfies Metadata["robots"];
}

export function createIcons(config: SeoIconsConfig = {}): Metadata["icons"] {
  return {
    icon: [
      ...(config.ico ? [{ url: config.ico, type: "image/x-icon" }] : []),
      ...(config.png ? [{ url: config.png, type: "image/png" }] : []),
      ...(config.svg ? [{ url: config.svg, type: "image/svg+xml" }] : []),
    ],
    shortcut: config.shortcut ?? config.ico ?? config.png,
    apple: config.appleTouchIcon
      ? [{ url: config.appleTouchIcon, sizes: "180x180" }]
      : undefined,
  };
}

export function assertSeoConfig(config: SeoResolverConfig) {
  if (!config.siteUrl) {
    throw new Error("SEO config requires siteUrl");
  }

  if (!config.defaultTitle) {
    throw new Error("SEO config requires defaultTitle");
  }

  if (!config.description) {
    throw new Error("SEO config requires description");
  }

  if (!config.defaultImage) {
    throw new Error("SEO config requires defaultImage");
  }
}

export function createSeoResolver(config: SeoResolverConfig) {
  assertSeoConfig(config);

  const baseImage = normalizeImage(config.defaultImage, config.defaultTitle);

  const getBaseMetadata = (input: SeoMetadataInput = {}): Metadata => {
    const locale = input.locale;

    return {
      metadataBase: new URL(config.siteUrl),
      title: {
        default: config.defaultTitle,
        template: config.titleTemplate ?? `%s | ${config.siteName}`,
      },
      description: config.description,
      keywords: config.keywords,
      authors: config.author ? [{ name: config.author }] : undefined,
      creator: config.author,
      publisher: config.siteName,
      openGraph: {
        type: "website",
        locale,
        url: config.siteUrl,
        siteName: config.siteName,
        title: config.defaultTitle,
        description: config.description,
        images: [baseImage],
      },
      twitter: {
        card: "summary_large_image",
        site: config.twitterHandle ? `@${config.twitterHandle}` : undefined,
        creator: config.author,
        title: config.defaultTitle,
        description: config.description,
        images: [baseImage.url],
      },
      robots:
        config.robots ??
        ({
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        } satisfies Metadata["robots"]),
      manifest: config.manifest,
      icons: createIcons(config.icons),
      other: locale ? { language: locale } : undefined,
      alternates: input.alternates,
    };
  };

  const getPageMetadata = (input: SeoMetadataInput = {}): Metadata => {
    const base = getBaseMetadata(input);
    const title = input.title ?? config.defaultTitle;
    const description = input.description ?? config.description;
    const openGraphImages = normalizeImages(
      input.openGraph?.images ?? (input.image ? [input.image] : [config.defaultImage]),
      title,
    );
    const canonicalUrl =
      input.canonical ??
      (input.path ? joinUrl(config.siteUrl, input.path) : undefined);

    return {
      ...base,
      title: input.title ?? base.title,
      description,
      keywords: input.keywords ?? base.keywords,
      authors: input.authors ?? base.authors,
      robots: createRobotsDirective(base.robots, input.noindex),
      alternates: input.alternates ?? (canonicalUrl ? { canonical: canonicalUrl } : undefined),
      other: input.other ?? base.other,
      openGraph: {
        ...base.openGraph,
        ...input.openGraph,
        type: input.type ?? "website",
        locale: input.locale ?? base.openGraph?.locale,
        url: canonicalUrl ?? input.openGraph?.url ?? base.openGraph?.url,
        siteName: config.siteName,
        title,
        description,
        images: openGraphImages,
      },
      twitter: {
        ...base.twitter,
        ...input.twitter,
        title,
        description,
        images: input.twitter?.images ?? openGraphImages?.map((image) => image.url),
      },
    };
  };

  return {
    getBaseMetadata,
    getPageMetadata,
  };
}
