import type { ImgHTMLAttributes } from "react";
import { Link } from "@/utils/Link";

function LearnImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <span className="block">
      <img {...props} className="w-full mb-4 rounded-lg" />
      <span className="block text-sm text-center text-zinc-400">
        {props.alt}
      </span>
    </span>
  );
}

export const learnMdxComponents = {
  a: Link,
  img: LearnImage,
};
