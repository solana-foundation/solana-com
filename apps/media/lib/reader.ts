import "server-only";
import { createReader } from "@keystatic/core/reader";
import config from "../keystatic.config";

// Create a reader instance for accessing content
// Type workaround: Keystatic reader type is complex and not portable
// Using 'any' to satisfy TypeScript's portability requirement
export const reader: any = createReader(process.cwd(), config);

// Export the reader type for use in other files
export type Reader = typeof reader;
