declare module "*.inline.svg" {
  import type { FunctionComponent, SVGProps } from "react";
  const content: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default content;
}
declare module "*.module.scss" {
  const styles: { [key: string]: string };
  export default styles;
}
