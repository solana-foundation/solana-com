/**
 * The translated pages (source.config.ts `translations`), compiled on their
 * first request. A plain module so TypeScript reads translations.d.ts
 * instead of the generated .source/dynamic.ts: inferring a type from its
 * thousands of inline entries runs the type checker out of memory.
 */
export { translations } from "@@/.source/dynamic";
