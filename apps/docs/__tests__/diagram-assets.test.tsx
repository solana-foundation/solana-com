import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { mdxComponents } from "../src/app/mdx-components";

const publicRoot = path.resolve(import.meta.dirname, "../public/assets/docs");

async function listSvgFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const file = path.join(directory, entry.name);
      return entry.isDirectory() ? listSvgFiles(file) : [file];
    }),
  );
  return files.flat().filter((file) => file.endsWith(".svg"));
}

describe("docs diagram themes", () => {
  it("keeps every overview and core diagram in a matching theme pair", async () => {
    const overviewFiles = await listSvgFiles(path.join(publicRoot, "diagrams"));
    const coreFiles = await listSvgFiles(path.join(publicRoot, "core"));

    for (const files of [overviewFiles, coreFiles]) {
      const names = new Set(files.map((file) => path.basename(file)));
      const darkNames = [...names].filter(
        (name) => !name.endsWith("-light.svg"),
      );

      for (const darkName of darkNames) {
        expect(names).toContain(darkName.replace(/\.svg$/, "-light.svg"));
      }
    }

    const koraFiles = await listSvgFiles(
      path.join(publicRoot, "tools", "kora"),
    );
    const koraNames = new Set(koraFiles.map((file) => path.basename(file)));
    expect(koraNames).toContain("kora.svg");
    expect(koraNames).toContain("kora-light.svg");
  });

  it("uses local typography and identical geometry for technical pairs", async () => {
    const coreFiles = await listSvgFiles(path.join(publicRoot, "core"));
    const lightFiles = coreFiles.filter((file) => file.endsWith("-light.svg"));

    for (const lightFile of lightFiles) {
      const darkFile = lightFile.replace(/-light\.svg$/, ".svg");
      const [light, dark] = await Promise.all([
        readFile(lightFile, "utf8"),
        readFile(darkFile, "utf8"),
      ]);
      const lightViewBox = light.match(/viewBox="([^"]+)"/)?.[1];
      const darkViewBox = dark.match(/viewBox="([^"]+)"/)?.[1];

      expect(light).not.toContain("whimsical.com/fonts");
      expect(dark).not.toContain("whimsical.com/fonts");
      expect(darkViewBox).toBe(lightViewBox);
      expect(dark).not.toBe(light);
    }
  });

  it("renders technical SVGs through the shared light and dark frame", () => {
    const DiagramImage = mdxComponents.img;
    const markup = renderToStaticMarkup(
      <DiagramImage
        src="/assets/docs/core/accounts/account-address.svg"
        alt="Account address"
      />,
    );

    expect(markup).toContain(
      "/assets/docs/core/accounts/account-address-light.svg",
    );
    expect(markup).toContain("/assets/docs/core/accounts/account-address.svg");
    expect(markup).toContain("Account address");
    expect(markup).toContain("border-fd-border");
  });
});
