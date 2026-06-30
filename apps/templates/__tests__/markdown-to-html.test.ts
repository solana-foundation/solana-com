import { describe, expect, it } from "vitest";

import { markdownToHtml } from "../src/lib/markdown-to-html";

describe("markdownToHtml", () => {
  it("strips executable HTML from template README content", async () => {
    const html = await markdownToHtml(`
# Safe heading

<img src=x onerror="alert(1)">
<img src="data:image/svg+xml,<svg onload=alert(1)>">
<a href="javascript:alert(1)" onclick="alert(1)">bad</a>
<script>alert(1)</script>
`);

    expect(html).toContain("<h1>Safe heading</h1>");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("onclick");
    expect(html).not.toContain("data:image");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("<a>bad</a>");
  });

  it("preserves normal README markdown and safe links", async () => {
    const html = await markdownToHtml(`
## Install

Use **pnpm** and visit [Solana](https://solana.com).

![Logo](./logo.png)

- Create a wallet
- Run the app
`);

    expect(html).toContain("<h2>Install</h2>");
    expect(html).toContain("<strong>pnpm</strong>");
    expect(html).toContain('<a href="https://solana.com">Solana</a>');
    expect(html).toContain('<img src="./logo.png" alt="Logo" />');
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>Create a wallet</li>");
  });

  it("adds noopener and noreferrer to target blank links", async () => {
    const html = await markdownToHtml(`
<a href="https://example.com" target="_blank">external</a>
<a href="https://solana.com" target="_blank" rel="nofollow">solana</a>
`);

    expect(html).toContain(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">external</a>',
    );
    expect(html).toContain(
      '<a href="https://solana.com" target="_blank" rel="nofollow noopener noreferrer">solana</a>',
    );
  });

  it("keeps Shiki highlighted code markup without placeholder data", async () => {
    const html = await markdownToHtml(`
\`\`\`ts
const answer: number = 42;
\`\`\`
`);

    expect(html).toContain("<pre");
    expect(html).toContain("shiki");
    expect(html).toContain("<code>");
    expect(html).toContain("answer");
    expect(html).not.toContain("data-code-id");
    expect(html).not.toContain("data-code=");
  });
});
