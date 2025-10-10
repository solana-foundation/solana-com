import React from "react";
import Image from "next/image";

export type DecorProps = {
  imageSrc?: string;
};

export const Decor = ({ imageSrc }: DecorProps) => {
  return (
    <div className="relative pointer-events-none">
      {imageSrc && (
        <Image
          className="top-0 left-0 !b-auto h-auto object-cover -translate-y-1/2  min-h-[320px]"
          src={imageSrc}
          alt=""
          fill={true}
          loading="lazy"
        />
      )}
    </div>
  );
};
