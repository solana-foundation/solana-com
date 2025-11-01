import React from "react";
import { videoBlockSchema } from "@/components/blocks/video";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Collection } from "tinacms";
import { galleryBlockSchema } from "@/components/ui/gallery";
import { statsBlockSchema } from "@/components/blocks/stats";

const Post: Collection = {
  label: "Blog Posts",
  name: "post",
  path: "content/posts",
  format: "mdx",
  ui: {
    router: ({ document }) => {
      return `/media/read/${document._sys.breadcrumbs.join("/")}`;
    },
  },
  fields: [
    {
      type: "object",
      label: "SEO",
      name: "seo",
      fields: [
        { type: "string", label: "Title", name: "title" },
        {
          type: "string",
          label: "Description",
          name: "description",
          ui: { component: "textarea" },
        },
        { type: "boolean", label: "No Index", name: "noIndex" },
        { type: "boolean", label: "No Follow", name: "noFollow" },
        {
          type: "object",
          label: "Open Graph",
          name: "openGraph",
          fields: [
            { type: "string", label: "OG Title", name: "ogTitle" },
            {
              type: "string",
              label: "OG Description",
              name: "ogDescription",
              ui: { component: "textarea" },
            },
            {
              type: "image",
              label: "OG Image",
              name: "ogImage",
              // @ts-ignore
              uploadDir: () => "posts",
            },
            { type: "string", label: "OG Type", name: "ogType", list: true },
            { type: "string", label: "OG URL", name: "ogUrl" },
          ],
        },
        {
          type: "object",
          label: "Twitter",
          name: "twitter",
          fields: [
            { type: "string", label: "Twitter Title", name: "twitterTitle" },
            {
              type: "string",
              label: "Twitter Description",
              name: "twitterDescription",
              ui: { component: "textarea" },
            },
            {
              type: "image",
              label: "Twitter Image",
              name: "twitterImage",
              // @ts-ignore
              uploadDir: () => "posts",
            },
          ],
        },
      ],
    },
    {
      type: "string",
      label: "Title",
      name: "title",
      isTitle: true,
      required: true,
    },
    {
      type: "image",
      name: "heroImage",
      label: "Hero Image",
      // @ts-ignore
      uploadDir: () => "posts",
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
      type: "reference",
      label: "Author",
      name: "author",
      collections: ["author"],
      ui: {
        //@ts-ignore
        optionComponent: (
          props: {
            name?: string;
            avatar: string;
          },
          _internalSys: { path: string }
        ) => {
          const { name, avatar } = props;
          if (!name) return _internalSys.path;

          return (
            <p className="flex min-h-8 items-center gap-4">
              <Avatar>
                {avatar && <AvatarImage src={avatar} alt={`${name} Profile`} />}
                <AvatarFallback>
                  {name
                    .split(" ")
                    .map((part) => part[0]?.toUpperCase() || "")
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {name}
            </p>
          );
        },
      },
    },
    {
      type: "datetime",
      label: "Posted Date",
      name: "date",
      ui: {
        dateFormat: "MMMM DD YYYY",
        timeFormat: "hh:mm A",
      },
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
      type: "rich-text",
      label: "Body",
      name: "_body",
      templates: [
        {
          name: "BlockQuote",
          label: "Block Quote",
          fields: [
            {
              name: "children",
              label: "Quote",
              type: "rich-text",
              overrides: {
                toolbar: ["bold", "italic", "link"],
              },
            },
            {
              name: "authorName",
              label: "Author",
              type: "string",
            },
          ],
        },
        {
          name: "DateTime",
          label: "Date & Time",
          inline: true,
          fields: [
            {
              name: "format",
              label: "Format",
              type: "string",
              options: ["utc", "iso", "local"],
            },
          ],
        },
        {
          name: "NewsletterSignup",
          label: "Newsletter Sign Up",
          fields: [
            {
              name: "children",
              label: "CTA",
              type: "rich-text",
            },
            {
              name: "placeholder",
              label: "Placeholder",
              type: "string",
            },
            {
              name: "buttonText",
              label: "Button Text",
              type: "string",
            },
            {
              name: "disclaimer",
              label: "Disclaimer",
              type: "rich-text",
              overrides: {
                toolbar: ["bold", "italic", "link"],
              },
            },
          ],
          ui: {
            defaultItem: {
              placeholder: "Enter your email",
              buttonText: "Notify Me",
            },
          },
        },
        videoBlockSchema,
        galleryBlockSchema,
        statsBlockSchema,
        {
          name: "footnotes",
          label: "Footnotes",
          fields: [
            {
              name: "footnotes",
              label: "Footnotes",
              type: "string",
            },
          ],
        },
        {
          name: "sup",
          label: "Superscript",
          fields: [
            {
              name: "children",
              label: "Text",
              type: "rich-text",
            },
          ],
        },
        {
          name: "tweet",
          label: "Tweet",
          fields: [
            {
              name: "id",
              label: "Tweet ID",
              type: "string",
            },
          ],
        },
        {
          name: "iframe",
          label: "Iframe Embed",
          fields: [
            {
              name: "src",
              label: "Source URL",
              type: "string",
            },
            {
              name: "width",
              label: "Width",
              type: "string",
            },
            {
              name: "height",
              label: "Height",
              type: "string",
            },
            {
              name: "allow",
              label: "Allow Attributes",
              type: "string",
            },
          ],
        },
      ],
      isBody: true,
    },
    {
      type: "reference",
      label: "CTA",
      name: "cta",
      collections: ["cta"],
    },
    {
      type: "reference",
      label: "Switchback",
      name: "switchback",
      collections: ["switchback"],
    },
  ],
};

export default Post;
