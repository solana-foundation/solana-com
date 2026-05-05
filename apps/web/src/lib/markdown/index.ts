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
 */
export function getPostBySlug(
  path: string,
  slug: string,
): {
  path: string;
  frontmatter: Record<string, unknown> & { date: string | null };
  content: string;
} {
  const dir = join(markdownPostsDir, path);
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(dir, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const date =
    data.date && typeof data.date !== "string"
      ? format(data.date as Date, "MMMM dd, yyyy")
      : ((data.date as string | null) ?? null);
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
 */
export function getAllPostsInDir(
  path: string,
): ReturnType<typeof getPostBySlug>[] {
  const dir = join(markdownPostsDir, path);
  const slugs = fs.readdirSync(dir);
  const posts = slugs.map((slug) => getPostBySlug(path, slug));

  return posts;
}
