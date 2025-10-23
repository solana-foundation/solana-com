import { codeToHtml } from "shiki";

export async function highlightCode(
  code: string,
  lang: string = "bash",
): Promise<string> {
  return await codeToHtml(code, {
    lang,
    theme: "github-dark",
  });
}
