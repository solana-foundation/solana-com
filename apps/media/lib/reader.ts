import "server-only";
import { createReader } from "@keystatic/core/reader";
import config from "../keystatic.config";

// Create a reader instance for accessing content
// Type annotation workaround for Keystatic reader type inference
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reader: any = createReader(process.cwd(), config);

// Export the reader type for use in other files
export type Reader = typeof reader;
