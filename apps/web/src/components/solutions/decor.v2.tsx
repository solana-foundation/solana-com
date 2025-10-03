import React from "react";
import Image from "next/image";

export type DecorProps = {
  imageSrc?: string;
  mobileImageSrc?: string;
};

export const Decor = ({ imageSrc, mobileImageSrc }: DecorProps) => {
  return (
    <div className="relative pointer-events-none">
      {imageSrc && (
        <Image
          className="top-0 left-0 !b-auto h-auto object-cover -translate-y-1/2 max-xl:hidden"
          src={imageSrc}
          alt=""
          fill={true}
          loading="lazy"
        />
      )}
      {mobileImageSrc && (
        <Image
          className="top-0 left-0 !b-auto h-auto object-cover -translate-y-1/2 xl:hidden"
          src={mobileImageSrc}
          alt=""
          fill={true}
          loading="lazy"
        />
      )}
    </div>
  );
};
