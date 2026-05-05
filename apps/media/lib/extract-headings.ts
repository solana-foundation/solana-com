export type Heading = {
  id: string;
  text: string;
  level: number;
};

/**
 * Extracts h2 and h3 headings from raw MDX/markdown source.
 * Generates URL-friendly slugs for each heading.
 */
export function extractHeadings(mdxSource: string): Heading[] {
  const headings: Heading[] = [];
  const lines = mdxSource.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) continue;

    const level = match[1]?.length ?? 2;
    const raw = match[2]?.trim() ?? "";
    // Strip markdown formatting (bold, italic, code, links)
    const text = raw
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/_(.+?)_/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1");

    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    headings.push({ id, text, level });
  }

  return headings;
}
