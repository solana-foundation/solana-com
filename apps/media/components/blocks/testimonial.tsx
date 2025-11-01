import React from "react";
import type { Template } from "tinacms";
import {
  PageBlocksTestimonial,
  PageBlocksTestimonialTestimonials,
} from "../../tina/__generated__/types";
import { Section } from "../layout/section";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { tinaField } from "tinacms/dist/react";
import { sectionBlockSchemaField } from "../layout/section";

export const Testimonial = ({ data }: { data: PageBlocksTestimonial }) => {
  return (
    <Section background={data.background!}>
      <div className="text-center">
        <h2
          className="text-title text-3xl font-semibold"
          data-tina-field={tinaField(data, "title")}
        >
          {data.title}
        </h2>
        <p
          className="text-body mt-6"
          data-tina-field={tinaField(data, "description")}
        >
          {data.description}
        </p>
      </div>
      <div className="mt-8 [column-width:300px] [column-gap:1.5rem] md:mt-12">
        {data.testimonials?.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial!} />
        ))}
      </div>
    </Section>
  );
};

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: PageBlocksTestimonialTestimonials;
}) => {
  return (
    <Card className="mb-6 break-inside-avoid">
      <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-6">
        <Avatar
          className="size-9"
          data-tina-field={tinaField(testimonial, "avatar")}
        >
          {testimonial.avatar && (
            <AvatarImage
              alt={testimonial.author!}
              src={testimonial.avatar}
              loading="lazy"
              width="120"
              height="120"
            />
          )}
          <AvatarFallback>
            {testimonial
              .author!.split(" ")
              .map((word) => word[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3
            className="font-medium"
            data-tina-field={tinaField(testimonial, "author")}
          >
            {testimonial.author}
          </h3>

          <span
            className="text-muted-foreground block text-sm tracking-wide"
            data-tina-field={tinaField(testimonial, "role")}
          >
            {testimonial.role}
          </span>

          <blockquote
            className="mt-3"
            data-tina-field={tinaField(testimonial, "quote")}
          >
            <p className="text-gray-700 dark:text-gray-300">
              {testimonial.quote}
            </p>
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
};

export const testimonialBlockSchema: Template = {
  name: "testimonial",
  label: "Testimonial",
  ui: {
    previewSrc: "/blocks/testimonial.png",
    defaultItem: {
      testimonials: [
        {
          quote:
            "There are only two hard things in Computer Science: cache invalidation and naming things.",
          author: "Phil Karlton",
        },
      ],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "string",
      label: "Description",
      name: "description",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "object",
      list: true,
      label: "Testimonials",
      name: "testimonials",
      ui: {
        defaultItem: {
          quote:
            "There are only two hard things in Computer Science: cache invalidation and naming things.",
          author: "Phil Karlton",
        },
        itemProps: (item) => {
          return {
            label: `${item.quote} - ${item.author}`,
          };
        },
      },
      fields: [
        {
          type: "string",
          ui: {
            component: "textarea",
          },
          label: "Quote",
          name: "quote",
        },
        {
          type: "string",
          label: "Author",
          name: "author",
        },
        {
          type: "string",
          label: "Role",
          name: "role",
        },
        {
          type: "image",
          label: "Avatar",
          name: "avatar",
        },
      ],
    },
  ],
};
