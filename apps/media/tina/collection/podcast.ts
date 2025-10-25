import type { Collection } from "tinacms";

const Podcast: Collection = {
  label: "Podcasts",
  name: "podcast",
  path: "content/podcasts",
  format: "mdx",
  ui: {
    router: ({ document }) => {
      return `/media/listen/${document._sys.breadcrumbs.join("/")}`;
    },
  },
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      label: "Slug",
      name: "slug",
      required: true,
      description: "URL-friendly identifier for this podcast",
    },
    {
      type: "rich-text",
      label: "Description",
      name: "description",
      overrides: {
        toolbar: ["bold", "italic", "link"],
      },
    },
    {
      type: "image",
      name: "coverImage",
      label: "Cover Image",
      required: true,
      // @ts-ignore
      uploadDir: () => "podcasts",
    },
    {
      type: "string",
      label: "Riverside Project ID",
      name: "riversideProjectId",
      required: false,
      description:
        "Optional: The project ID from Riverside API (used as 'projectId' query parameter in API v2 calls). Not required for podcasts hosted externally.",
    },
    {
      type: "string",
      label: "Riverside Studio ID",
      name: "riversideStudioId",
      description:
        "Optional: Studio ID from Riverside (used as 'studioId' query parameter to filter recordings)",
    },
    {
      type: "reference",
      label: "Category",
      name: "category",
      collections: ["category"],
      description: "Select a category for this podcast",
    },
    {
      type: "string",
      label: "Tags",
      name: "tags",
      list: true,
      description: "Tags for this podcast (e.g., 'featured')",
      // @ts-ignore - TinaCMS list reference field typing issue
      ui: {
        component: "tags",
      },
    },
    {
      type: "boolean",
      label: "Featured",
      name: "featured",
      description:
        "Display this podcast in the featured section (deprecated: use tags instead)",
    },
    {
      type: "number",
      label: "Display Order",
      name: "displayOrder",
      description: "Lower numbers appear first (0 = highest priority)",
    },
    {
      type: "string",
      label: "Status",
      name: "status",
      options: [
        { value: "active", label: "Active" },
        { value: "archived", label: "Archived" },
        { value: "coming-soon", label: "Coming Soon" },
      ],
      required: true,
    },
    {
      type: "object",
      label: "Hosts",
      name: "hosts",
      list: true,
      fields: [
        {
          type: "reference",
          label: "Host",
          name: "host",
          collections: ["author"],
          ui: {
            optionComponent: (
              props: {
                name?: string;
              },
              _internalSys: { path: string }
            ) => props.name || _internalSys.path,
          },
        },
      ],
      ui: {
        itemProps: (item) => {
          return { label: item?.host };
        },
      },
    },
    {
      type: "string",
      label: "Apple Podcasts URL",
      name: "applePodcastsUrl",
      description: "Link to this podcast on Apple Podcasts",
    },
    {
      type: "string",
      label: "Spotify URL",
      name: "spotifyUrl",
      description: "Link to this podcast on Spotify",
    },
    {
      type: "string",
      label: "RSS Feed URL",
      name: "rssFeedUrl",
      description: "RSS feed URL for this podcast",
    },
    {
      type: "string",
      label: "Release Frequency",
      name: "releaseFrequency",
      description: "e.g., Weekly, Bi-weekly, Monthly",
    },
    {
      type: "datetime",
      label: "First Episode Date",
      name: "firstEpisodeDate",
      ui: {
        dateFormat: "MMMM DD YYYY",
      },
    },
  ],
};

export default Podcast;
