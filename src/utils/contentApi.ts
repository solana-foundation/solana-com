import type {
  ContentApiNavItem,
  ContentOverviewRecords,
  ContentRecord,
  ContentRecordGroupKey,
  ExtractFeaturedRecordsProps,
  TocHeadingItem,
} from "@/types";

/**
 * Regex for parsing headings from raw markdown
 * - note: this only parsed h4 and higher
 */
export const REGEX_MARKDOWN_HEADINGS = /^(#{1,4}) (.*)?$/gim;

/**
 * Regex for parsing markdown links
 */
export const REGEX_MARKDOWN_LINKS = /\[([^\[]+)\]\((.*?)\)/gim;

/**
 * Default language locale to use for the content
 */
export const DEFAULT_LOCALE_EN = "en";

/**
 * Class for request and processing content from the developer content api
 *
 * Repo: https://github.com/solana-foundation/developer-content/
 */
export default class ContentApi {
  /**
   * URL for the API to used for fetching the developer content data
   */
  static CONTENT_API_URL =
    process?.env?.NEXT_PUBLIC_DEVELOPER_CONTENT_API_URL ||
    "https://solana-developer-content.vercel.app";

  /**
   * GitHub organization that holds the content repo
   */
  static GITHUB_ORG_NAME =
    process?.env?.DEVELOPER_CONTENT_GH_ORG || "solana-foundation";

  /**
   * GitHub repo name that contains the content for use
   */
  static GITHUB_REPO_NAME =
    process?.env?.DEVELOPER_CONTENT_GH_REPO || "developer-content";

  /**
   * Standard headers that will be used for all internal requests to the API.
   * Enabling simple access control to the internal APIs.
   */
  static HEADERS = {
    "Api-Key": process.env.DEVELOPER_CONTENT_API_KEY,
  };

  /**
   * Fetch wrapper to auto apply headers and other config data for the developer content API
   *
   * Note: This will auto auto apply the default headers (like the api key)
   */
  static async fetch(url: string, options: RequestInit = {}) {
    // for relative urls, auto prepend the site's address
    if (url.substring(0, 1) == "/")
      url = new URL(url, this.CONTENT_API_URL).toString();

    // merge all the params together with our auto configured values
    options = {
      ...options,

      // merge in the static headers
      // @ts-ignore
      headers: {
        ...options?.headers,
        ...ContentApi.HEADERS,
      },
    };

    // return the fetch request
    return await fetch(url, options);
  }

  /**
   * Fetch the "overview" records from the content api
   * (e.g. featured guides, resources, and courses)
   */
  static async getOverviewRecords(locale: string = DEFAULT_LOCALE_EN) {
    const route = `/api/overview/${locale}`;
    return await this.fetch(route)
      .then((res) => res.json() as unknown as ContentOverviewRecords)
      .catch((err) => {
        // note: catching errors here will help prevent pages from loading on the front end
        console.error("[getOverviewRecords]", route);
        console.error(err);
        // todo: add any extra error handling, if desired
        return {};
      });
  }

  /**
   * Fetch a single content record from the content api
   */
  static async getSingleRecord(
    route: string,
    locale: string = DEFAULT_LOCALE_EN,
  ) {
    if (!route) return;

    // get the group key for the content record
    let groupKey = route.split("/")[0] as ContentRecordGroupKey;
    // handle the one off special case of rpc docs
    if (groupKey == "docs" && route.split("/")[1] == "rpc") {
      groupKey = "docs/rpc";
    }

    route = `/api/content/${locale}/${route}`;
    return await this.fetch(route)
      .then((res) => res.json() as unknown as ContentRecord<typeof groupKey>)
      .catch((err) => {
        // note: catching errors here will help prevent pages from loading on the front end
        console.error("[getSingleRecord]", route, "groupKey:", groupKey);
        console.error(err);
        // todo: add any extra error handling, if desired
        return;
      });
  }

  /**
   * Fetch the listing of content records available in the given `group`
   * todo: handle pagination params
   */
  static async getRecordsForGroup(
    groupKey: ContentRecordGroupKey,
    locale: string = DEFAULT_LOCALE_EN,
    appendix: string = "",
  ) {
    const route = `/api/records/${locale}/${groupKey}/${appendix}`;
    return await this.fetch(route)
      .then((res) => res.json() as unknown as ContentRecord<typeof groupKey>[])
      // .then((records) => {
      //   // todo: preprocess the content record before returning, if desired
      //   return records;
      // })
      .catch((err) => {
        // note: catching errors here will help prevent pages from loading on the front end
        console.error("[getRecordsForGroup]", route);
        console.error(err);
        // todo: add any extra error handling, if desired
        return [] as unknown as ContentRecord<typeof groupKey>[];
      });
  }

  /**
   * Fetch the listing of paths data available for records in the given `group`
   */
  static async getPathsForGroup(
    groupKey: ContentRecordGroupKey,
    locale: string = DEFAULT_LOCALE_EN,
  ): Promise<ContentApiNavItem[]> {
    if (!groupKey) return [];
    const route = `/api/paths/${locale}/${groupKey}`;
    return await this.fetch(route)
      .then((res) => res.json() as unknown as ContentApiNavItem[])
      // .then((records) => {
      //   // todo: preprocess the content record before returning, if desired
      //   return records;
      // })
      .catch((err) => {
        // note: catching errors here will help prevent pages from loading on the front end
        console.error("[getPathsForGroup]", route);
        console.error(err);
        // todo: add any extra error handling, if desired
        return [];
      });
  }

  /**
   * Fetch the listing of the nav data available for records in the given `group`
   */
  static async getNavForGroup(
    group: ContentRecordGroupKey,
    locale: string = DEFAULT_LOCALE_EN,
  ): Promise<ContentApiNavItem[]> {
    const route = `/api/nav/${locale}/${group}`;
    return await this.fetch(route)
      .then((res) => res.json() as unknown as ContentApiNavItem[])
      // .then((records) => {
      //   // todo: preprocess the content record before returning, if desired
      //   return records;
      // })
      .catch((err) => {
        // note: catching errors here will help prevent pages from loading on the front end
        console.error("[getNavForGroup]", route);
        console.error(err);
        // todo: add any extra error handling, if desired
        return [];
      });
  }

  /**
   * Helper function to determine if a redirect should occur, and return the
   * NextJS formatted redirect payload
   */
  static recordRedirectPayload(
    record: ContentRecord<ContentRecordGroupKey>,
    currentRoute: string = "",
    locale: string = DEFAULT_LOCALE_EN,
    prefix: string = "/",
  ) {
    // always lower case the record href
    record.href = record.href?.toLowerCase();

    // always remove the trailing slash on the route
    currentRoute = currentRoute.replace(/\/$/, "").toLowerCase();

    // prevent `/en` in the route redirect (since it is the default language on the site)
    if (locale == DEFAULT_LOCALE_EN) locale = "";
    else locale = `/${locale}`;

    // handle external redirects
    if (record?.isExternal == true && !!record.href) {
      return {
        redirect: {
          destination: `${locale}${record.href}`,
        },
      };
    }
    // handle altRoute redirects
    if (
      !!currentRoute &&
      record.href != `${prefix}${currentRoute}` &&
      record.href != `/${prefix}${currentRoute}`
    ) {
      return {
        redirect: {
          permanent: true,
          destination: `${locale}${record.href}`,
        },
      };
    }

    // when returning nothing, no redirect will occur
    return undefined;
  }

  /**
   * Extract the a listing of featured records, sorted by `featuredPriority`
   */
  static extractFeaturedRecords({
    records,
    limit = 3,
    addFillerRecords = false,
    randomizeFillerRecords = false,
  }: ExtractFeaturedRecordsProps) {
    // filter for the records marked as features, with sort by priority
    let featuredRecords = records
      ?.filter((item) => item?.featured == true)
      .sort((a, b) => a.featuredPriority || 999 - b.featuredPriority || 999);

    // attempt to enforce the goal `limit` using filler records (when desired)
    if (addFillerRecords && featuredRecords.length < limit) {
      // random the filler records when filler records are used to reach the desired record `limit`
      if (randomizeFillerRecords)
        records = records.sort(() => 0.5 - Math.random());
      // add the filler records
      featuredRecords.push(...records.slice(0, limit));
    }
    // enforce the record `limit`
    featuredRecords = featuredRecords.slice(0, limit);

    return featuredRecords;
  }

  /**
   * Compute the correctly formatted local repo path
   */
  static computeGitHubFileUrl(filePath: string): string {
    let repoUrl = `https://github.com/${this.GITHUB_ORG_NAME}/${this.GITHUB_REPO_NAME}`;

    if (!filePath) return repoUrl;
    else if (!filePath.startsWith("/")) filePath = `/${filePath}`;

    return new URL(`${repoUrl}/tree/main${filePath}`).toString();
  }

  /**
   * Compute a standardized slug, based on a file name
   */
  static computeSlugFromName(fileName: string): string {
    if (!fileName) return "";
    return fileName.split(".")[0];
  }

  /**
   * Link processors for standardizing links
   */
  static processSingleLink(url: string = ""): string {
    if (!url) return url;

    // convert `solana.com` links to internal links
    url = url.replace(/^https?:\/\/?solana.com\//gi, "/");

    // process the internal links (i.e. those that start with "/" and ".")
    if (url.startsWith("/") || url.startsWith(".")) {
      // prevent relative climbing
      url = url.replace(/^.*?\//gi, "/");

      // removed specific file extensions (".md", ".mdx", etc) and index.*
      url = url.replace(/((index)?.mdx?|.html?)/gi, "");

      // format urls to assets stored within the content repo
      url = url.replace(
        /^\/(public\/)?assets\//,
        `${this.CONTENT_API_URL}/assets/`,
      );

      // format urls to developer "content" stored within the content repo
      url = url.replace(/^\/content\//, `/developers/`);

      // convert all "developer content" links to lower case
      if (/^\/(docs|developers)/gm.test(url)) url = url.toLowerCase();
    } else {
      // do nothing with other links
    }

    return url;
  }

  /**
   * Helper function generate a Table of Contents listing based on the markdowns headings
   */
  static generateTableOfContents(
    content: string,
  ): TocHeadingItem[] | undefined {
    if (!content) return undefined;

    // const duplicator = new Map<string, number>();

    return content
      .replaceAll(/```(.|\n)+?```/gm, "")
      .match(REGEX_MARKDOWN_HEADINGS)
      ?.map((item) => {
        // strip out any links already in the heading (e.g. the anchor `#` link at the end)
        const prepared = item
          .replace(REGEX_MARKDOWN_LINKS, "")
          .trim()
          .split(REGEX_MARKDOWN_HEADINGS);

        // extract the usable values (note the starting `,` in the array; this will ignore the first param)
        let [, hCount, label] = prepared;

        // we remove any special characters from the end of the label
        // to make it look cleaner in the UI
        // @ts-ignore
        label = label.replace(/[^\p{Letter}\p{Number}]+$/u, "");

        // if (!duplicator.has(label)) {
        //   duplicator.set(label, 0);
        // } else {
        //   duplicator.set(label, duplicator.get(label) + 1);
        // }

        // construct a standardized heading object
        return {
          heading: hCount.length,
          value: label,
          slug: ContentApi.slugify(label),
          // slug: ContentApi.slugify(
          //   duplicator.get(label) > 0
          //     ? `${label}-${duplicator.get(label)}`
          //     : label,
          // ),
        };
      });
  }

  /**
   * Helper function to slugify urls
   */
  static slugify(url: string): string {
    try {
      return (
        url
          .toString()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/\./g, "")
          // @ts-ignore
          .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
          .replace(/^-/g, "")
          .replace(/-$/g, "")
          .replace(/--+/g, "-")
      );
    } catch (err) {
      console.error("[slugify error]", err);
      return "#err";
    }
  }
}
