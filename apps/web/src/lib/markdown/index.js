import matter from "gray-matter";
import fs from "fs";
import { join } from "path";
import { format } from "date-fns";

const markdownPostsDir = join(process.cwd(), "src", "markdown");

/**
 * Returns a single post from Markdown files.
 *
 * @param path
 * @param slug
 * @returns {{path, frontmatter: {date: (string|any)}, content: string}}
 */
export function getPostBySlug(path, slug) {
  const dir = join(markdownPostsDir, path);
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(dir, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const date =
    data.date && typeof data.date !== "string"
      ? format(data.date, "MMMM dd, yyyy")
      : (data.date ?? null);
  return {
    path: realSlug,
    frontmatter: { ...data, date, reviewed: true },
    content,
  };
}

/**
 * Returns all posts from `markdownPostsDir`.
 *
 * @param path
 * @returns {{path: *, frontmatter: {date: *}, content: *|string}[]}
 */
export function getAllPostsInDir(path) {
  const dir = join(markdownPostsDir, path);
  const slugs = fs.readdirSync(dir);
  const posts = slugs.map((slug) => getPostBySlug(path, slug));

  return posts;
}
