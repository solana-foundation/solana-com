import type { PodcastEpisode, PodcastShow } from "@/lib/podcast-types";
import type { PostItem } from "@/lib/post-types";
import type { ReportItem } from "@/lib/report-types";
import {
  buildCollectionJsonLd,
  buildDetailJsonLd,
  createArticleEntity,
  createPodcastEpisodeEntity,
  createPodcastSeriesEntity,
  getLatestDate,
  getLocalizedPageUrl,
  toPlainText,
} from "@/lib/structured-data";

export type UpgradeStructuredDataItem = {
  slug: string;
  title: string;
  description?: string | null;
  publishedAt?: string | null;
  authorName?: string | null;
};

export function buildPostCollectionJsonLd({
  posts,
  path,
  locale,
  title,
  description,
  listName,
  aboutName,
}: {
  posts: PostItem[];
  path: string;
  locale: string;
  title: string;
  description: string;
  listName: string;
  aboutName: string;
}) {
  const entities = posts.map((post) =>
    createArticleEntity({
      path: post.url,
      locale,
      title: post.title,
      description: toPlainText(post.description),
      image: post.heroImage,
      datePublished: post.publishedAt,
      authorName: post.author.name,
      section: post.categories[0],
      keywords: post.tags,
    }),
  );

  return buildCollectionJsonLd({
    path,
    locale,
    title,
    description,
    listName,
    entities,
    dateModified: getLatestDate(posts.map((post) => post.publishedAt)),
    aboutName,
  });
}

export function buildArticleJsonLd({
  slug,
  locale,
  title,
  description,
  image,
  publishedAt,
  authorName,
  category,
  tags,
  backPath,
  backLabel,
}: {
  slug: string;
  locale: string;
  title: string;
  description?: string | null;
  image?: string | null;
  publishedAt?: string | null;
  authorName?: string | null;
  category?: string | null;
  tags?: string[];
  backPath: string;
  backLabel: string;
}) {
  const path = `/news/${slug}`;
  const entity = createArticleEntity({
    path,
    locale,
    title,
    description,
    image,
    datePublished: publishedAt,
    authorName,
    section: category,
    keywords: tags,
  });

  return buildDetailJsonLd({
    path,
    locale,
    entity,
    breadcrumbs: [
      { name: "Solana", path: "/" },
      { name: backLabel, path: backPath },
      { name: title, path },
    ],
  });
}

export function buildReportCollectionJsonLd({
  reports,
  locale,
  title,
  description,
}: {
  reports: ReportItem[];
  locale: string;
  title: string;
  description: string;
}) {
  const entities = reports.map((report) =>
    createArticleEntity({
      type: "Report",
      path: report.url,
      locale,
      title: report.headline || report.title,
      description: report.description,
      image: report.heroImage,
      datePublished: report.publishedAt,
      section: report.categories[0],
      keywords: report.tags,
    }),
  );

  return buildCollectionJsonLd({
    path: "/reports",
    locale,
    title,
    description,
    listName: "Solana ecosystem reports",
    entities,
    dateModified: getLatestDate(reports.map((report) => report.publishedAt)),
    aboutName: "Solana ecosystem research and market analysis",
  });
}

export function buildReportJsonLd({
  slug,
  locale,
  title,
  description,
  image,
  publishedAt,
  categories,
  tags,
}: {
  slug: string;
  locale: string;
  title: string;
  description?: string | null;
  image?: string | null;
  publishedAt?: string | null;
  categories?: string[];
  tags?: string[];
}) {
  const path = `/reports/${slug}`;
  const entity = createArticleEntity({
    type: "Report",
    path,
    locale,
    title,
    description,
    image,
    datePublished: publishedAt,
    authorName: "Solana Foundation",
    section: categories?.[0],
    keywords: tags,
  });

  return buildDetailJsonLd({
    path,
    locale,
    entity,
    breadcrumbs: [
      { name: "Solana", path: "/" },
      { name: "Reports", path: "/reports" },
      { name: title, path },
    ],
  });
}

function podcastSameAs(podcast: PodcastShow) {
  return [
    podcast.rssFeedUrl,
    podcast.applePodcastsUrl,
    podcast.spotifyUrl,
    podcast.youtubeUrl,
  ];
}

function getPodcastPath(podcast: PodcastShow) {
  return `/podcasts/${podcast.slug}`;
}

function getEpisodePath(podcast: PodcastShow, episode: PodcastEpisode) {
  return `${getPodcastPath(podcast)}/episodes/${episode.slug}`;
}

export function buildPodcastCollectionJsonLd({
  podcasts,
  locale,
  title,
  description,
}: {
  podcasts: PodcastShow[];
  locale: string;
  title: string;
  description: string;
}) {
  const entities = podcasts.map((podcast) =>
    createPodcastSeriesEntity({
      path: getPodcastPath(podcast),
      locale,
      name: podcast.title,
      description: podcast.descriptionPlainText,
      image: podcast.coverImage,
      hosts: podcast.hosts.map((host) => host.name),
      sameAs: podcastSameAs(podcast),
    }),
  );

  return buildCollectionJsonLd({
    path: "/podcasts",
    locale,
    title,
    description,
    listName: "Solana podcast shows",
    itemListOrder: "https://schema.org/ItemListUnordered",
    entities,
    dateModified: getLatestDate(
      podcasts.map((podcast) => podcast.latestEpisode?.publishedDate),
    ),
    aboutName: "Solana podcasts and blockchain conversations",
  });
}

export function buildPodcastShowJsonLd({
  podcast,
  episodes,
  locale,
}: {
  podcast: PodcastShow;
  episodes: PodcastEpisode[];
  locale: string;
}) {
  const path = getPodcastPath(podcast);
  const seriesUrl = getLocalizedPageUrl(path, locale);
  const seriesId = `${seriesUrl}#podcast`;
  const episodeEntities = episodes.map((episode) =>
    createPodcastEpisodeEntity({
      path: getEpisodePath(podcast, episode),
      locale,
      name: episode.title,
      description: episode.description,
      image: episode.thumbnailUrl || podcast.coverImage,
      datePublished: episode.publishedDate,
      durationSeconds: episode.duration,
      audioUrl: episode.audioUrl,
      seriesId,
    }),
  );
  const series = createPodcastSeriesEntity({
    path,
    locale,
    name: podcast.title,
    description: podcast.descriptionPlainText,
    image: podcast.coverImage,
    hosts: podcast.hosts.map((host) => host.name),
    sameAs: podcastSameAs(podcast),
    episodeIds: episodeEntities.map((episode) => episode["@id"]),
  });

  return buildDetailJsonLd({
    path,
    locale,
    entity: series,
    additionalEntities: episodeEntities,
    breadcrumbs: [
      { name: "Solana", path: "/" },
      { name: "Podcasts", path: "/podcasts" },
      { name: podcast.title, path },
    ],
  });
}

export function buildPodcastEpisodeJsonLd({
  podcast,
  episode,
  locale,
}: {
  podcast: PodcastShow;
  episode: PodcastEpisode;
  locale: string;
}) {
  const showPath = getPodcastPath(podcast);
  const path = getEpisodePath(podcast, episode);
  const seriesId = `${getLocalizedPageUrl(showPath, locale)}#podcast`;
  const entity = createPodcastEpisodeEntity({
    path,
    locale,
    name: episode.title,
    description: episode.description,
    image: episode.thumbnailUrl || podcast.coverImage,
    datePublished: episode.publishedDate,
    durationSeconds: episode.duration,
    audioUrl: episode.audioUrl,
    seriesId,
  });
  const series = createPodcastSeriesEntity({
    path: showPath,
    locale,
    name: podcast.title,
    description: podcast.descriptionPlainText,
    image: podcast.coverImage,
    hosts: podcast.hosts.map((host) => host.name),
    sameAs: podcastSameAs(podcast),
    episodeIds: [entity["@id"]],
  });

  return buildDetailJsonLd({
    path,
    locale,
    entity,
    additionalEntities: [series],
    breadcrumbs: [
      { name: "Solana", path: "/" },
      { name: "Podcasts", path: "/podcasts" },
      { name: podcast.title, path: showPath },
      { name: episode.title, path },
    ],
  });
}

export function buildUpgradeCollectionJsonLd({
  upgrades,
  locale,
  title,
  description,
}: {
  upgrades: UpgradeStructuredDataItem[];
  locale: string;
  title: string;
  description: string;
}) {
  const entities = upgrades.map((upgrade) =>
    createArticleEntity({
      type: "TechArticle",
      path: `/upgrades/${upgrade.slug}`,
      locale,
      title: upgrade.title,
      description: upgrade.description,
      datePublished: upgrade.publishedAt,
      authorName: upgrade.authorName || "Solana Foundation",
    }),
  );

  return buildCollectionJsonLd({
    path: "/upgrades",
    locale,
    title,
    description,
    listName: "Solana network upgrades",
    entities,
    dateModified: getLatestDate(upgrades.map((upgrade) => upgrade.publishedAt)),
    aboutName: "Solana network and validator upgrades",
  });
}

export function buildUpgradeJsonLd({
  slug,
  locale,
  title,
  description,
  publishedAt,
  authorName,
  image,
}: UpgradeStructuredDataItem & {
  locale: string;
  image?: string | null;
}) {
  const path = `/upgrades/${slug}`;
  const entity = createArticleEntity({
    type: "TechArticle",
    path,
    locale,
    title,
    description,
    image,
    datePublished: publishedAt,
    authorName: authorName || "Solana Foundation",
  });

  return buildDetailJsonLd({
    path,
    locale,
    entity,
    breadcrumbs: [
      { name: "Solana", path: "/" },
      { name: "Upgrades", path: "/upgrades" },
      { name: title, path },
    ],
  });
}
