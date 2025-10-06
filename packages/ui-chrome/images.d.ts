declare module "*.inline.svg" {
  import type { FunctionComponent, SVGProps } from "react";
  const content: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default content;
}
