import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@@/(.*)$": "<rootDir>/$1",
    "^src/(.*)$": "<rootDir>/src/$1",
    "\\.svg$": "<rootDir>/src/__mocks__/svgMock.js",
    "@workspace/ui/(.*)": "<rootDir>/../../packages/ui/src/components/$1.tsx",
    "@solana-com/ui-chrome": "<rootDir>/../../packages/ui-chrome/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
};

export default createJestConfig(config);
