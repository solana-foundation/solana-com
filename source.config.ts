import { defineConfig, defineDocs } from "fs-mdx/config";
import { z } from "zod";

const schema = z.custom<{
  title: string;
  h1?: string;
  seoTitle?: string;
  description?: string;
  hideTableOfContents?: boolean;
  full?: boolean;
  author?: string;
  tags?: string[];
  date?: string;
  difficulty?: string;
}>();

const docsData = defineDocs({
  dir: "content/docs",
  docs: { schema },
  output: "docs",
});

export const docs = docsData.docs;
export const docsMeta = docsData.meta;

const cookbookData = defineDocs({
  dir: "content/cookbook",
  docs: { schema },
  output: "cookbook",
});

export const cookbook = cookbookData.docs;
export const cookbookMeta = cookbookData.meta;

const coursesData = defineDocs({
  dir: "content/courses",
  docs: { schema },
  output: "courses",
});

export const courses = coursesData.docs;
export const coursesMeta = coursesData.meta;

const guidesData = defineDocs({
  dir: "content/guides",
  docs: { schema },
  output: "guides",
});

export const guides = guidesData.docs;
export const guidesMeta = guidesData.meta;

export default defineConfig({
  lastModifiedTime: "git",
});
