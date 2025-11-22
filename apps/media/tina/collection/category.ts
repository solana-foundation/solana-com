import type { Collection } from "tinacms";

const Category: Collection = {
  label: "Categories",
  name: "category",
  path: "content/categories",
  format: "mdx",
  fields: [
    {
      type: "string",
      label: "Name",
      name: "name",
      isTitle: true,
      required: true,
    },
  ],
};

export default Category;
