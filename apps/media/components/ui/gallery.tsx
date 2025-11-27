import React, { ComponentPropsWithoutRef, FC } from "react";
import { cva } from "class-variance-authority";
import Image, { ImageProps } from "next/image";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

import { Template } from "tinacms";
import { tinaField } from "tinacms/dist/react";
import { Section, sectionBlockSchemaField } from "../layout/section";
import { Link } from "@workspace/i18n/routing";
import { InfiniteSlider } from "./infinite-slider";

export interface GalleryImageProps extends ComponentPropsWithoutRef<"figure"> {
  [key: string]: any;
  index?: number;
  heading?: string;
  body?: string;
  button?: ButtonProps & {
    label?: string;
    link?: string;
    type?: "default" | "link";
  };
  size?: "small" | "large" | "skinny";
  image?: ImageProps;
  square?: boolean;
}

const wrapper = cva(
  ["relative rounded-lg group m-0 w-full h-full overflow-hidden"],
  {
    variants: {
      size: {
        small: ["aspect-4/3 col-span-2"],
        large: ["aspect-4/3 row-span-2"],
        skinny: ["aspect-9/16 row-span-2"],
      },
      square: {
        true: ["aspect-square"],
      },
    },
  }
);

const content = cva([
  "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
  "h-full z-10 overflow-hidden",
  "bg-black/50 flex flex-col gap-2 p-8 justify-end",
]);

export const GalleryImage: FC<GalleryImageProps> = ({
  heading,
  body,
  button,
  size = "small",
  image,
  index,
  square,
  ...props
}) => {
  const hasDetails = heading || body || button;
  return (
    <figure className={cn(wrapper({ size, square }))} {...props}>
      {image && image.src && (
        <Image
          src={image.src || ""}
          alt={image.alt || ""}
          placeholder="blur"
          blurDataURL={
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAYAAAAfE+zUAAAAHElEQVQImWP4//8/w38GIAXDIBKE0DHxglMKAAIMAB8FhS2+8qo8AAAAAElFTkSuQmCC"
          }
          fill
          sizes="(max-width: 768px) 263px, 263px"
          className="object-cover rounded-lg"
        />
      )}
      {hasDetails && (
        <figcaption className={content()}>
          {heading && <h3 className="text-display-xs font-bold">{heading}</h3>}
          {body && <p className="text-md text-pretty">{body}</p>}
          {button && (button.label || button.children) && (
            <Button
              {...button}
              asChild={button.type === "link" && !!button.link}
            >
              {button.type === "link" && button.link ? (
                <Link href={button.link}>
                  {button.label || button.children}
                </Link>
              ) : (
                button.label || button.children
              )}
            </Button>
          )}
        </figcaption>
      )}
    </figure>
  );
};

export interface GalleryProps {
  background?: string;
  images?: GalleryImageProps[];
}

export const Gallery: FC<GalleryProps> = ({ background, images }) => {
  return (
    <Section background={background}>
      <InfiniteSlider
        direction="horizontal"
        gap={16}
        speed={30}
        speedOnHover={0}
        className="h-[600px]"
      >
        <div
          className="grid grid-flow-col grid-rows-2 gap-4"
          style={{
            gridTemplateRows: "repeat(2, minmax(0, 263px))",
            gridAutoColumns: "minmax(263px, max-content)",
          }}
        >
          {images?.map((img, i) => (
            <GalleryImage
              key={i}
              {...img}
              index={i}
              data-tina-field={tinaField(images?.[i])}
            />
          ))}
        </div>
      </InfiniteSlider>
    </Section>
  );
};

export const galleryBlockSchema: Template = {
  name: "gallery",
  label: "Gallery",
  ui: {
    previewSrc: "/blocks/gallery.png",
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "object",
      label: "Images",
      name: "images",
      list: true,
      ui: {
        itemProps: (item: { heading?: string }) => ({
          label: item?.heading || "Gallery Image",
        }),
      },
      fields: [
        {
          type: "string",
          label: "Heading",
          name: "heading",
        },
        {
          type: "string",
          label: "Body",
          name: "body",
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
            },
            {
              type: "string",
              label: "Type",
              name: "type",
              options: [
                { label: "Default", value: "default" },
                { label: "Link", value: "link" },
              ],
            },
            {
              type: "string",
              label: "Link",
              name: "link",
            },
          ],
        },
        {
          type: "string",
          label: "Size",
          name: "size",
          options: [
            { value: "small", label: "Small" },
            { value: "large", label: "Large" },
            { value: "skinny", label: "Skinny" },
          ],
        },
        {
          type: "object",
          label: "Image",
          name: "image",
          fields: [
            {
              type: "image",
              label: "Image Source",
              name: "src",
            },
            {
              type: "string",
              label: "Alt Text",
              name: "alt",
            },
          ],
        },
        {
          type: "boolean",
          label: "Square",
          name: "square",
        },
      ],
    },
  ],
};
