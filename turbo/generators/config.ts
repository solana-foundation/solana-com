import { PlopTypes } from "@turbo/gen";
import { generatorApp } from "./generator-app";
import { generatorPkg } from "./generator-pkg";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("app", generatorApp);
  plop.setGenerator("pkg", generatorPkg);
}
