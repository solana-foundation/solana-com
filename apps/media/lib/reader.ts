import "server-only";
import { createReader } from "@keystatic/core/reader";
import config from "../keystatic.config";

// Create a reader instance for accessing content
// Type annotation workaround for Keystatic reader type inference
export const reader: ReturnType<typeof createReader> = createReader(
  process.cwd(),
  config,
);

// Export the reader type for use in other files
export type Reader = typeof reader;
