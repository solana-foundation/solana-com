declare module "*.inline.svg" {
  import type { FC, SVGProps } from "react";
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

declare module "*.png" {
  const content: { src: string };
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}
