/**
 * Types the internal content api
 */

import { BreadcrumbItem } from "./general";

export type ContentRecordBase = ContentApiNavItem & {
  /** File path relative to `contentDirPath` */
  // _id: string // deleted via the api
  _raw: RawDocumentData;
  // type: 'DeveloperGuide'
  /** Manually defined unique id for this document */

  id?: string | undefined;
  /** The primary title of the post */
  title: string;
  /** Brief description of the content (also used in the SEO metadata) */
  description?: string | undefined;
  /** List of filterable tags for content */
  tags?: string[] | undefined;
  /** List of keywords for the content, primarily used for seo metadata */
  keywords?: string[] | undefined;

  /** The date this content was published */
  date?: IsoDateTimestring | undefined;
  /** The date this content was last updated */
  updatedDate?: IsoDateTimestring | undefined;

  /** Difficulty level of the content */
  difficulty?: "Intro" | "Beginner" | "Intermediate" | "Expert" | undefined;
  /** The primary image of the content (also used in the SEO metadata) */
  image?: string | undefined;

  /** Is this content just a link to external content? */
  isExternal: boolean;
  /** Page route or absolute URL for this document */
  href?: string | undefined;
  /** Canonical url of the content */
  canonical?: string | undefined;
  /** List of alternate routes that should redirect to this same document */
  altRoutes?: string[] | undefined;
  /** Computed slug of the records, based on the file name */
  slug?: string | undefined;
  /** List of lesson slugs (only for lessons and courses) */
  lessons?: string[] | undefined;
  course?: ContentRecord<"courses">;

  /** Whether or not this content is featured */
  featured?: boolean | undefined;
  /** Sort priority for featured content displays */
  featuredPriority: number;
  /** Whether or not this record is used for only metadata */
  metaOnly: boolean;
  /** Whether or not to skip this page when generating previous/next page routes on docs */
  isSkippedInNav?: boolean;
  /** Whether or not to hide this section in the DocNavSidebar (left-hand side) on docs */
  isHiddenInNavSidebar?: boolean;

  /** Markdown file body */
  body?: string | undefined;

  author?: ContentAuthor;

  /** Custom sidebar label to use, instead of the document's title */
  sidebarLabel?: string | undefined;
  /** Sort order of the doc, relative to its siblings */
  sidebarSortOrder?: number | undefined;
  /** Force hide the table of contents displayed on page */
  hideTableOfContents?: boolean | undefined;

  /** The primary title of the post */
  seoTitle?: string | undefined;
  /** Brief description of the content (also used in the SEO metadata) */
  seoDescription?: string | undefined;
  /** Navigation breadcrumbs */
  breadcrumbs?: BreadcrumbItem[];
  // Priority
  priority?: number | undefined;

  // Only hides from UI, as there's a CFP to update it and people
  // that know the URL should still be able to access it.
  isHidden?: boolean | undefined;

  /** The next record */
  next?: ContentApiNavItem;
  /** The previous record */
  prev?: ContentApiNavItem;
};

/**
 * Details about the author of the content record
 */
export type BaseContentAuthor = {
  /** Public display name for this author */
  title: string;
  /** Brief public description for this author */
  description?: string;
  /** GitHub username of the author */
  github?: string;
  /** Twitter/X username of the author */
  twitter?: string;
  /** Website of the author */
  website?: string;
  /** URL for an avatar image to be displayed for the author */
  avatarUrl?: string;
  // _raw: this is force deleted from the records
};

export type ContentAuthor = BaseContentAuthor & {
  /* organization the author is a part of (note: this is a nested author) */
  organization?: BaseContentAuthor;
};

/**
 * imported from `contentlayer`
 */
export type DocumentContentType = "markdown" | "mdx" | "data";

/**
 * imported from `contentlayer`
 */
export type RawDocumentData = {
  /** Relative to `contentDirPath` */
  sourceFilePath: string;
  sourceFileName: string;
  /** Relative to `contentDirPath` */
  sourceFileDir: string;
  contentType: DocumentContentType;
  /** A path e.g. useful as URL paths based on `sourceFilePath` with file extension removed and `/index` removed. */
  flattenedPath: string;
};

/**
 *
 */
export type ContentRecord<T extends ContentRecordGroupKey> =
  ContentRecordBase & {
    __RecordKey: T;
  };

/**
 * Content API response that contains a short list of available records for
 * each content type (e.g. guides, resources, etc)
 */
export type ContentOverviewRecords = {
  [key in ContentRecordGroupKey]: ContentRecord<key> | undefined;
};

/**
 * Available record group names
 *
 * Note: these should at least match the `SimpleRecordGroupName` in the developer content repo:
 * https://github.com/solana-foundation/developer-content/blob/main/src/types/index.ts
 */
export type ContentRecordGroupKey =
  | "docs/rpc"
  | "docs"
  | "guides"
  | "courses"
  | "lessons"
  | "resources"
  | "workshops"
  | "cookbook";

/**
 *
 */
export type TocHeadingItem = {
  heading: number;
  value: string;
  slug: string;
};

/**
 *
 */
export type ExtractFeaturedRecordsProps = {
  records: ContentRecord<ContentRecordGroupKey>[];
  limit?: number;
  addFillerRecords?: boolean;
  randomizeFillerRecords?: boolean;
};

/**
 *
 */
export type ContentApiNavItemBase = {
  id: string;
  label: string;
  slug?: string;
  path?: string;
  href?: string;
  sidebarSortOrder?: number;
  metaOnly?: boolean;
  isExternal?: boolean;
  isSkippedInNav?: boolean;
  isHiddenInNavSidebar?: boolean;
  /**
   *
   */
  items?: Array<any>;
};

/**
 *
 */
export type ContentApiNavItem = ContentApiNavItemBase & {
  items?: Array<ContentApiNavItemBase>;
};

/**
 * ISO 8601 Date string
 *
 * @example '2021-01-01T00:00:00.000Z'
 *
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOstring
 *
 */
export type IsoDateTimestring = string;
