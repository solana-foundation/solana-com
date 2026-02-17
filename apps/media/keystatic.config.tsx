import {
  config,
  collection,
  singleton,
  fields,
  type LocalConfig,
  type GitHubConfig,
} from "@keystatic/core";
import { componentBlocks } from "./lib/keystatic/components";

// Determine if we're in local mode or if GitHub credentials are missing
const hasGitHubCredentials =
  process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
  process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
  process.env.KEYSTATIC_SECRET;

const isLocal = process.env.KEYSTATIC_LOCAL === "true" || !hasGitHubCredentials;

// Storage configuration
const localStorage: LocalConfig["storage"] = {
  kind: "local",
};

const githubStorage: GitHubConfig["storage"] = {
  kind: "github",
  repo: {
    owner: process.env.GITHUB_OWNER || process.env.VERCEL_GIT_REPO_OWNER || "",
    name: process.env.GITHUB_REPO || process.env.VERCEL_GIT_REPO_SLUG || "",
  },
  branchPrefix: "keystatic-",
  pathPrefix: "apps/media",
};

// Background options for section blocks (exported for use in components)
export const backgroundOptions = [
  { label: "Default", value: "bg-default" },
  { label: "White", value: "bg-white/80" },
  { label: "Gray", value: "bg-gray-50/80" },
  { label: "Zinc", value: "bg-zinc-50" },
  { label: "Black", value: "bg-black/80" },
  { label: "Red", value: "bg-red-50/80" },
  { label: "Orange", value: "bg-orange-50/80" },
  { label: "Yellow", value: "bg-yellow-50/80" },
  { label: "Green", value: "bg-green-50/80" },
  { label: "Lime", value: "bg-lime-50/80" },
  { label: "Emerald", value: "bg-emerald-50/80" },
  { label: "Teal", value: "bg-teal-50/80" },
  { label: "Cyan", value: "bg-cyan-50/80" },
  { label: "Blue", value: "bg-blue-50/80" },
  { label: "Sky", value: "bg-sky-50/80" },
  { label: "Indigo", value: "bg-indigo-50/80" },
  { label: "Violet", value: "bg-violet-50/80" },
  { label: "Purple", value: "bg-purple-50/80" },
  { label: "Fuchsia", value: "bg-fuchsia-50/80" },
  { label: "Pink", value: "bg-pink-50/80" },
  { label: "Rose", value: "bg-rose-50/80" },
] as const;

export default config({
  storage: isLocal ? localStorage : githubStorage,
  ui: {
    brand: {
      name: "Solana Media",
    },
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "body" },
      entryLayout: "content",
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
          defaultValue: "draft",
        }),
        heroImage: fields.image({
          label: "Hero Image",
          description: "Used as og:image and twitter:image",
          directory: "public/uploads/posts",
          publicPath: "/uploads/posts",
        }),
        description: fields.text({
          label: "Description",
          description:
            "Required for SEO. Used as meta description, og:description, and twitter:description",
          multiline: true,
        }),
        author: fields.relationship({
          label: "Author",
          collection: "authors",
        }),
        date: fields.text({
          label: "Posted Date",
          description: "Date in YYYY-MM-DD format",
        }),
        categories: fields.array(
          fields.object({
            category: fields.relationship({
              label: "Category",
              collection: "categories",
            }),
          }),
          {
            label: "Categories",
            itemLabel: (props) => props.fields.category.value || "Category",
          }
        ),
        tags: fields.array(
          fields.object({
            tag: fields.relationship({
              label: "Tag",
              collection: "tags",
            }),
          }),
          {
            label: "Tags",
            itemLabel: (props) => props.fields.tag.value || "Tag",
          }
        ),
        body: fields.mdx({
          label: "Body",
          components: componentBlocks,
        }),
        cta: fields.relationship({
          label: "CTA",
          collection: "ctas",
        }),
        switchback: fields.relationship({
          label: "Switchback",
          collection: "switchbacks",
        }),
      },
    }),

    podcasts: collection({
      label: "Podcasts",
      slugField: "title",
      path: "content/podcasts/*",
      format: { contentField: "description" },
      entryLayout: "content",
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        description: fields.mdx({
          label: "Description",
          options: {
            bold: true,
            italic: true,
            link: true,
          },
        }),
        coverImage: fields.image({
          label: "Cover Image",
          directory: "public/uploads/podcasts",
          publicPath: "/uploads/podcasts",
          validation: { isRequired: true },
        }),
        riversideProjectId: fields.text({
          label: "Riverside Project ID",
          description:
            "Optional: The project ID from Riverside API (used as 'projectId' query parameter in API v2 calls). Not required for podcasts hosted externally.",
        }),
        riversideStudioId: fields.text({
          label: "Riverside Studio ID",
          description:
            "Optional: Studio ID from Riverside (used as 'studioId' query parameter to filter recordings)",
        }),
        category: fields.relationship({
          label: "Category",
          collection: "categories",
          description: "Select a category for this podcast",
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          description: "Tags for this podcast (e.g., 'featured')",
          itemLabel: (props) => props.value || "Tag",
        }),
        featured: fields.checkbox({
          label: "Featured",
          description:
            "Display this podcast in the featured section (deprecated: use tags instead)",
        }),
        displayOrder: fields.number({
          label: "Display Order",
          description: "Lower numbers appear first (0 = highest priority)",
        }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Archived", value: "archived" },
            { label: "Coming Soon", value: "coming-soon" },
          ],
          defaultValue: "active",
        }),
        hosts: fields.array(
          fields.object({
            host: fields.relationship({
              label: "Host",
              collection: "authors",
            }),
          }),
          {
            label: "Hosts",
            itemLabel: (props) => props.fields.host.value || "Host",
          }
        ),
        applePodcastsUrl: fields.text({
          label: "Apple Podcasts URL",
          description: "Link to this podcast on Apple Podcasts",
        }),
        spotifyUrl: fields.text({
          label: "Spotify URL",
          description: "Link to this podcast on Spotify",
        }),
        rssFeedUrl: fields.text({
          label: "RSS Feed URL",
          description: "RSS feed URL for this podcast",
        }),
        releaseFrequency: fields.text({
          label: "Release Frequency",
          description: "e.g., Weekly, Bi-weekly, Monthly",
        }),
        firstEpisodeDate: fields.text({
          label: "First Episode Date",
          description: "ISO date string for first episode",
        }),
      },
    }),

    authors: collection({
      label: "Authors",
      slugField: "name",
      path: "content/authors/*",
      format: { contentField: "bio" },
      entryLayout: "content",
      schema: {
        name: fields.slug({
          name: { label: "Name", validation: { isRequired: true } },
        }),
        avatar: fields.image({
          label: "Avatar",
          directory: "public/uploads/authors",
          publicPath: "/uploads/authors",
        }),
        bio: fields.mdx({
          label: "Bio",
          options: {
            bold: true,
            italic: true,
            link: true,
          },
        }),
      },
    }),

    categories: collection({
      label: "Categories",
      slugField: "name",
      path: "content/categories/*",
      format: { contentField: "description" },
      schema: {
        name: fields.slug({
          name: { label: "Name", validation: { isRequired: true } },
        }),
        description: fields.mdx({ label: "Description" }),
      },
    }),

    tags: collection({
      label: "Tags",
      slugField: "name",
      path: "content/tags/*",
      format: { contentField: "description" },
      schema: {
        name: fields.slug({
          name: { label: "Name", validation: { isRequired: true } },
        }),
        description: fields.mdx({ label: "Description" }),
      },
    }),

    ctas: collection({
      label: "CTAs",
      slugField: "title",
      path: "content/ctas/*",
      format: { contentField: "body" },
      entryLayout: "content",
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        eyebrow: fields.text({ label: "Eyebrow" }),
        headline: fields.text({ label: "Headline" }),
        description: fields.text({ label: "Description", multiline: true }),
        button: fields.object(
          {
            label: fields.text({
              label: "Label",
              validation: { isRequired: true },
            }),
            url: fields.text({
              label: "URL",
              validation: { isRequired: true },
            }),
          },
          { label: "Button" }
        ),
        className: fields.text({ label: "Class Name" }),
        body: fields.mdx({
          label: "Body",
          options: {
            bold: true,
            italic: true,
            link: true,
          },
        }),
      },
    }),

    switchbacks: collection({
      label: "Switchbacks",
      slugField: "title",
      path: "content/switchbacks/*",
      format: { contentField: "body" },
      entryLayout: "content",
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        image: fields.object(
          {
            src: fields.image({
              label: "Source",
              directory: "public/uploads/switchbacks",
              publicPath: "/uploads/switchbacks",
            }),
            alt: fields.text({ label: "Alt" }),
          },
          { label: "Image" }
        ),
        eyebrow: fields.text({ label: "Eyebrow" }),
        headline: fields.text({ label: "Headline" }),
        body: fields.mdx({
          label: "Body",
          options: {
            bold: true,
            italic: true,
            link: true,
          },
        }),
        buttons: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            url: fields.text({ label: "URL" }),
          }),
          {
            label: "Buttons",
            itemLabel: (props) => props.fields.label.value || "Button",
          }
        ),
      },
    }),

    links: collection({
      label: "Links",
      slugField: "title",
      path: "content/links/*",
      format: { contentField: "description" },
      entryLayout: "content",
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            validation: { isRequired: true },
            description: "Title of the linked content",
          },
        }),
        url: fields.text({
          label: "URL",
          validation: { isRequired: true },
          description: "The external URL this link points to",
        }),
        linkType: fields.select({
          label: "Link Type",
          options: [
            { label: "Article", value: "article" },
            { label: "Tweet/X Post", value: "tweet" },
            { label: "Video", value: "video" },
            { label: "GitHub", value: "github" },
            { label: "Other", value: "other" },
          ],
          defaultValue: "article",
          description: "Type of external content",
        }),
        description: fields.mdx({
          label: "Description",
          options: {
            bold: true,
            italic: true,
          },
          description: "Brief description or excerpt of the linked content",
        }),
        thumbnailImage: fields.image({
          label: "Thumbnail Image",
          directory: "public/uploads/links",
          publicPath: "/uploads/links",
          description:
            "Preview image for the link (auto-fetched from Open Graph or manually uploaded)",
        }),
        source: fields.text({
          label: "Source",
          description: "Name of the source (e.g., Twitter, YouTube, Medium)",
        }),
        publishedAt: fields.datetime({
          label: "Published Date",
          description: "When this link was added/published",
        }),
        categories: fields.array(
          fields.object({
            category: fields.relationship({
              label: "Category",
              collection: "categories",
            }),
          }),
          {
            label: "Categories",
            itemLabel: (props) => props.fields.category.value || "Category",
          }
        ),
        tags: fields.array(
          fields.object({
            tag: fields.relationship({
              label: "Tag",
              collection: "tags",
            }),
          }),
          {
            label: "Tags",
            itemLabel: (props) => props.fields.tag.value || "Tag",
          }
        ),
        featured: fields.checkbox({
          label: "Featured",
          description: "Display this link in the featured section",
        }),
      },
    }),
  },

  singletons: {
    global: singleton({
      label: "Global Settings",
      path: "content/global/index",
      format: { data: "json" },
      schema: {
        theme: fields.object(
          {
            color: fields.text({ label: "Primary Color" }),
            darkMode: fields.select({
              label: "Dark Mode",
              options: [
                { label: "System", value: "system" },
                { label: "Light", value: "light" },
                { label: "Dark", value: "dark" },
              ],
              defaultValue: "system",
            }),
          },
          { label: "Theme" }
        ),
      },
    }),
  },
});
