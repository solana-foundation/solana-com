import { PlopTypes } from "@turbo/gen";
import { validateName } from "./helpers";

const TARGET_DIR = "packages";
const TEMPLATE_ROOT = "templates/pkg";

export const generatorPkg: PlopTypes.PlopGeneratorConfig = {
  description: `Generator a package in the ${TARGET_DIR} directory`,
  prompts: [
    {
      type: "list",
      name: "type",
      message: "What type of package should be created?",
      choices: ["basic", "react-ui"],
    },
    {
      type: "input",
      name: "name",
      default: ({ type }) => type,
      message: "What is the name of package?",
      validate: (input: string) => {
        return validateName(input);
      },
    },
  ],
  actions: [
    {
      type: "addMany",
      destination: `{{turbo.paths.root}}/${TARGET_DIR}/{{ dashCase name }}`,
      base: `./${TEMPLATE_ROOT}/{{type}}`,
      templateFiles: `./${TEMPLATE_ROOT}/{{type}}/**/*`,
    },
  ],
};
