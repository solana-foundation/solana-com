import React, { ComponentPropsWithoutRef, FC } from "react";
import { cva } from "class-variance-authority";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";
import { Section } from "../layout/section";
import { Link } from "@workspace/i18n/routing";

export interface GalleryImageProps extends ComponentPropsWithoutRef<"figure"> {
  [key: string]: unknown;
  index?: number;
  total?: number;
  heading?: string;
  body?: string;
  button?: Pick<ButtonProps, "variant" | "size" | "className" | "children"> & {
    label?: string;
    link?: string;
    type?: "default" | "link";
  };
  size?: "small" | "large" | "skinny";
  image?: {
    src?: string;
    alt?: string;
  };
  square?: boolean;
}

const wrapper = cva(
  [
    "group relative m-0 overflow-hidden rounded-[1.5rem]",
    "border border-white/10 bg-zinc-950/70 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)]",
    "ring-1 ring-white/5",
  ],
  {
    variants: {
      size: {
        small: ["aspect-square md:col-span-4 md:aspect-square"],
        large: ["aspect-square md:col-span-8 md:aspect-square"],
        skinny: ["aspect-square md:col-span-4 md:aspect-square"],
      },
      square: {
        true: [""],
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

const content = cva([
  "absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end gap-2 p-5 md:p-6",
  "bg-linear-to-t from-black/85 via-black/35 to-transparent",
  "opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100",
]);

function getDesktopSpanClass(index: number, total: number): string {
  if (index === 0) {
    return total === 1 ? "md:col-span-12" : "md:col-span-8";
  }

  if (total <= 2) {
    return "md:col-span-4";
  }

  const tailCount = total - 2;
  const tailIndex = index - 2;
  const remainder = tailCount % 3;

  if (index === 1) {
    return "md:col-span-4";
  }

  if (remainder === 1 && tailIndex === tailCount - 1) {
    return "md:col-span-12";
  }

  if (remainder === 2 && tailIndex >= tailCount - 2) {
    return "md:col-span-6";
  }

  return "md:col-span-4";
}

function parseImagesRaw(imagesRaw?: string): GalleryImageProps[] | undefined {
  if (!imagesRaw) {
    return undefined;
  }

  try {
    const decoded = Buffer.from(imagesRaw, "base64").toString("utf8");
    const value = Function(`"use strict"; return (${decoded});`)();
    return Array.isArray(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

export const GalleryImage: FC<GalleryImageProps> = ({
  heading,
  body,
  button,
  size = "small",
  image,
  index,
  total,
  square,
  ...props
}) => {
  const hasDetails = heading || body || button;
  const desktopSpanClass =
    typeof index === "number" && typeof total === "number"
      ? getDesktopSpanClass(index, total)
      : "md:col-span-4";
  const buttonType = button?.type;
  const buttonProps = button
    ? {
        variant: button.variant,
        size: button.size,
        className: button.className,
      }
    : undefined;

  return (
    <figure
      className={cn(wrapper({ size, square }), desktopSpanClass)}
      {...props}
    >
      {image && image.src && (
        <>
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={image.src || ""}
              alt={image.alt || ""}
              className="h-full w-full min-h-full min-w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-white/0 via-white/0 to-black/10" />
        </>
      )}
      {hasDetails && (
        <figcaption className={content()}>
          {heading && (
            <h3 className="text-display-xs font-bold text-white">{heading}</h3>
          )}
          {body && <p className="text-md text-pretty text-white/80">{body}</p>}
          {button && (button.label || button.children) && (
            <Button
              {...buttonProps}
              asChild={buttonType === "link" && !!button.link}
            >
              {buttonType === "link" && button.link ? (
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
  imagesRaw?: string;
}

export const Gallery: FC<GalleryProps> = ({
  background,
  images,
  imagesRaw,
}) => {
  const resolvedImages =
    images && images.length > 0 ? images : parseImagesRaw(imagesRaw);

  if (!resolvedImages || resolvedImages.length === 0) {
    return null;
  }

  return (
    <Section background={background} className="not-prose my-10">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(153,69,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(25,251,155,0.14),transparent_30%),rgba(10,10,12,0.92)] p-4 md:p-6">
        <div
          className={cn(
            "grid gap-3 md:gap-4",
            "grid-cols-1 sm:grid-cols-2 md:grid-cols-12 md:grid-flow-dense",
          )}
        >
          {resolvedImages.map((img, i) => (
            <GalleryImage
              key={i}
              {...img}
              index={i}
              total={resolvedImages.length}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};
