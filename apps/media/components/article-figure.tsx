import Image, { type ImageProps } from "next/image";
import React, { type ReactNode } from "react";

interface ArticleFigureProps {
  src?: ImageProps["src"];
  alt: string;
  children?: ReactNode;
}

export function ArticleFigure({ src, alt, children }: ArticleFigureProps) {
  if (!src) return null;

  return (
    <figure className="w-full my-6">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        className="w-full h-auto object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
      />
      {children && (
        <figcaption className="text-sm text-muted-foreground mt-2 text-center [&>p]:!m-0">
          {children}
        </figcaption>
      )}
    </figure>
  );
}
