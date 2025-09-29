import { PlopTypes } from "@turbo/gen";
import { generatorPkg } from "./generator-pkg";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("pkg", generatorPkg);
}
