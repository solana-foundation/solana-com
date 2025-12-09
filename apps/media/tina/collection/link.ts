import type { Collection } from "tinacms";

const Link: Collection = {
  label: "Links",
  name: "link",
  path: "content/links",
  format: "mdx",
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      isTitle: true,
      required: true,
      description: "Title of the linked content",
    },
    {
      type: "string",
      label: "URL",
      name: "url",
      required: true,
      description: "The external URL this link points to",
    },
    {
      type: "string",
      label: "Link Type",
      name: "linkType",
      options: [
        { value: "article", label: "Article" },
        { value: "tweet", label: "Tweet/X Post" },
        { value: "video", label: "Video" },
        { value: "github", label: "GitHub" },
        { value: "other", label: "Other" },
      ],
      required: true,
      description: "Type of external content",
    },
    {
      type: "rich-text",
      label: "Description",
      name: "description",
      overrides: {
        toolbar: ["bold", "italic", "link"],
      },
      description: "Brief description or excerpt of the linked content",
    },
    {
      type: "image",
      name: "thumbnailImage",
      label: "Thumbnail Image",
      // @ts-ignore
      uploadDir: () => "links",
      description:
        "Preview image for the link (auto-fetched from Open Graph or manually uploaded)",
    },
    {
      type: "string",
      label: "Source",
      name: "source",
      description: "Name of the source (e.g., Twitter, YouTube, Medium)",
    },
    {
      type: "datetime",
      label: "Published Date",
      name: "publishedAt",
      ui: {
        dateFormat: "MMMM DD YYYY",
        timeFormat: "hh:mm A",
      },
      description: "When this link was added/published",
    },
    {
      type: "object",
      label: "Categories",
      name: "categories",
      list: true,
      fields: [
        {
          type: "reference",
          label: "Category",
          name: "category",
          collections: ["category"],
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
          return { label: item?.category };
        },
      },
    },
    {
      type: "object",
      label: "Tags",
      name: "tags",
      list: true,
      fields: [
        {
          type: "reference",
          label: "Tag",
          name: "tag",
          collections: ["tag"],
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
          return { label: item?.tag };
        },
      },
    },
    {
      type: "boolean",
      label: "Featured",
      name: "featured",
      description: "Display this link in the featured section",
    },
  ],
};

export default Link;
