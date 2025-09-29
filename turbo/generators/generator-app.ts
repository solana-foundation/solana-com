import { PlopTypes } from "@turbo/gen";
import { validateName } from "./helpers";

const TARGET_DIR = "apps";
const TEMPLATE_ROOT = "templates/app";

export const generatorApp: PlopTypes.PlopGeneratorConfig = {
  description: `Generator an app in the ${TARGET_DIR} directory`,
  prompts: [
    {
      type: "list",
      name: "type",
      message: "What type of app should be created?",
      choices: ["basic"],
    },
    {
      type: "input",
      name: "name",
      default: ({ type }) => type,
      message: "What is the name of app?",
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
