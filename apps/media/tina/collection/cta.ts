import type { Collection } from "tinacms";

const CTA: Collection = {
  label: "CTA",
  name: "cta",
  path: "content/ctas",
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
      type: "string",
      label: "Description",
      name: "description",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      label: "Button",
      name: "button",
      fields: [
        {
          type: "string",
          label: "Label",
          name: "label",
          required: true,
        },
        {
          type: "string",
          label: "URL",
          name: "url",
          required: true,
        },
      ],
    },
    {
      type: "string",
      label: "Class Name",
      name: "className",
    },
  ],
};

export default CTA;
