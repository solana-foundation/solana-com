import type { Collection } from "tinacms";

const Switchback: Collection = {
  label: "Switchbacks",
  name: "switchback",
  path: "content/switchbacks",
  format: "mdx",
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      isTitle: true,
      required: true,
    },
    {
      type: "object",
      label: "Image",
      name: "image",
      fields: [
        {
          type: "image",
          label: "Source",
          name: "src",
          // @ts-ignore
          uploadDir: () => "posts",
        },
        {
          type: "string",
          label: "Alt",
          name: "alt",
        },
      ],
    },
    {
      type: "string",
      label: "Eyebrow",
      name: "eyebrow",
    },
    {
      type: "string",
      label: "Headline",
      name: "headline",
    },
    {
      type: "rich-text",
      label: "Body",
      name: "body",
      overrides: {
        toolbar: ["bold", "italic", "link"],
      },
    },
    {
      type: "object",
      label: "Buttons",
      name: "buttons",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.label || "Button" }),
      },
      fields: [
        {
          type: "string",
          label: "Label",
          name: "label",
        },
        {
          type: "string",
          label: "URL",
          name: "url",
        },
      ],
    },
  ],
};

export default Switchback;
