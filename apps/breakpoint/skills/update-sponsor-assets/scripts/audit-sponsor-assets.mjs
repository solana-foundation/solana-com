import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Read-only: never delete assets or rewrite records. Preview output is optional.
const repo = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../../..",
);
const packageRoot = path.join(repo, "packages/ecosystem-data");
const assetsRoot = path.join(packageRoot, "assets/companies");
const require = createRequire(import.meta.url);
const ts = require(require.resolve("typescript", { paths: [packageRoot] }));
const next = require.resolve("next/package.json", {
  paths: [path.join(repo, "apps/breakpoint")],
});
const sharp = require(require.resolve("sharp", { paths: [next] }));
const args = process.argv.slice(2);
const previewIndex = args.indexOf("--preview");
let preview;
if (previewIndex >= 0) {
  preview = args[previewIndex + 1];
  if (!preview || preview.startsWith("--"))
    throw new Error("--preview needs a PNG path");
  args.splice(previewIndex, 2);
}
if (
  !args.length ||
  args.some((slug) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
) {
  throw new Error(
    "Usage: node audit-sponsor-assets.mjs <company-slug> ... [--preview /tmp/logos.png]",
  );
}
const slugs = new Set(args);
const errors = [];
const candidates = [];
const previews = [];
const links = [];
const fail = (message) => errors.push(message);
const unwrap = (node) => {
  while (
    node &&
    (ts.isSatisfiesExpression(node) ||
      ts.isAsExpression(node) ||
      ts.isParenthesizedExpression(node))
  )
    node = node.expression;
  return node;
};
const property = (node, key) =>
  node?.properties?.find(
    (p) =>
      ts.isPropertyAssignment(p) &&
      p.name.getText().replaceAll('"', "").replaceAll("'", "") === key,
  )?.initializer;
const value = (node, key) => {
  const p = property(node, key);
  return p && (ts.isStringLiteral(p) || ts.isNumericLiteral(p))
    ? p.text
    : undefined;
};
const filesUnder = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory()
      ? filesUnder(file)
      : entry.isFile()
        ? [file]
        : [];
  });

for (const slug of slugs) {
  try {
    const recordPath = path.join(
      packageRoot,
      "src/companies/records",
      `${slug}.ts`,
    );
    const source = ts.createSourceFile(
      recordPath,
      fs.readFileSync(recordPath, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    if (source.parseDiagnostics.length)
      throw new Error("Record has TypeScript parse errors");
    const imports = new Map();
    for (const statement of source.statements) {
      if (
        ts.isImportDeclaration(statement) &&
        /\.(svg|png|webp|jpe?g)$/.test(statement.moduleSpecifier.text)
      ) {
        const file = path.resolve(
          path.dirname(recordPath),
          statement.moduleSpecifier.text,
        );
        if (!fs.existsSync(file))
          fail(`${slug}: missing imported asset ${file}`);
      }
      if (ts.isImportDeclaration(statement) && statement.importClause?.name) {
        imports.set(
          statement.importClause.name.text,
          path.resolve(
            path.dirname(recordPath),
            statement.moduleSpecifier.text,
          ),
        );
      }
    }
    const record = source.statements
      .filter(ts.isVariableStatement)
      .flatMap((s) => s.declarationList.declarations)
      .map((d) => unwrap(d.initializer))
      .find(
        (node) =>
          node &&
          ts.isObjectLiteralExpression(node) &&
          value(node, "id") === slug,
      );
    if (!record) throw new Error("Missing company record matching slug");
    const collectLinks = (node, keys = []) => {
      if (!node || !ts.isObjectLiteralExpression(node)) return;
      for (const p of node.properties) {
        if (!ts.isPropertyAssignment(p)) continue;
        const key = p.name
          .getText(source)
          .replaceAll('"', "")
          .replaceAll("'", "");
        if (
          ts.isStringLiteral(p.initializer) &&
          /^https?:/.test(p.initializer.text)
        ) {
          const url = new URL(p.initializer.text);
          if (url.protocol !== "https:" || url.username || url.password)
            fail(
              `${slug}: review non-HTTPS or credential-bearing URL ${url.href}`,
            );
          links.push({
            company: slug,
            field: [...keys, key].join("."),
            url: url.href,
          });
        } else collectLinks(p.initializer, [...keys, key]);
      }
    };
    collectLinks(property(record, "profile"));
    const logosNode = property(record, "logos");
    if (!logosNode || !ts.isArrayLiteralExpression(logosNode))
      throw new Error("Missing logos array");
    const ids = new Set();
    const uniqueFiles = new Set();
    let breakpoint;
    for (const logo of logosNode.elements) {
      const id = value(logo, "id");
      if (!id || ids.has(id))
        fail(`${slug}: missing or repeated logo ID ${id}`);
      ids.add(id);
      const imported = property(logo, "source");
      const file =
        imported && ts.isIdentifier(imported)
          ? imports.get(imported.text)
          : undefined;
      if (!file || !fs.existsSync(file)) {
        fail(
          `${slug}/${id}: missing imported asset ${file ?? imported?.getText(source)}`,
        );
        continue;
      }
      if (path.basename(file) !== value(logo, "fileName"))
        fail(`${slug}/${id}: fileName differs from imported filename`);
      if (path.extname(file).slice(1) !== value(logo, "format"))
        fail(`${slug}/${id}: format differs from imported extension`);
      if (path.dirname(file) !== path.join(assetsRoot, slug))
        fail(`${slug}/${id}: asset is outside its company folder`);
      uniqueFiles.add(file);
      if (id === "breakpoint-2026-white") breakpoint = { logo, file };
    }
    if (!ids.has(value(record, "defaultLogoId")))
      fail(`${slug}: defaultLogoId does not resolve`);
    if (!breakpoint) fail(`${slug}: missing breakpoint-2026-white selector`);
    // Include unreferenced artwork: a duplicate export still takes up space even
    // when no logos entry imports it. The package audit reports orphan files.
    const companyFolder = path.join(assetsRoot, slug);
    if (fs.existsSync(companyFolder)) {
      for (const file of filesUnder(companyFolder)) {
        if (/\.(svg|png|webp|jpe?g)$/i.test(file)) uniqueFiles.add(file);
      }
    }
    const rendered = [];
    for (const file of uniqueFiles) {
      const { data, info } = await sharp(file)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      if (info.channels !== 4) throw new Error(`${file}: expected RGBA image`);
      let left = info.width,
        top = info.height,
        right = -1,
        bottom = -1;
      let nonwhite = 0,
        transparent = 0;
      for (let y = 0; y < info.height; y++)
        for (let x = 0; x < info.width; x++) {
          const offset = (y * info.width + x) * 4;
          if (data[offset + 3] === 0) {
            transparent++;
            continue;
          }
          left = Math.min(left, x);
          right = Math.max(right, x);
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
          if (
            data[offset] !== 255 ||
            data[offset + 1] !== 255 ||
            data[offset + 2] !== 255
          )
            nonwhite++;
        }
      if (right < left) {
        fail(`${slug}/${path.basename(file)}: empty artwork`);
        continue;
      }
      const bounds = {
        left,
        top,
        width: right - left + 1,
        height: bottom - top + 1,
      };
      // Compare colors and alpha, with transparent RGB normalized away. Never
      // make a white/color comparison by flattening onto a white background.
      const normalized = await sharp(data, { raw: info })
        .extract(bounds)
        .resize(256, 128, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .raw()
        .toBuffer();
      for (let i = 0; i < normalized.length; i += 4)
        for (let c = 0; c < 3; c++)
          normalized[i + c] = Math.round(
            (normalized[i + c] * normalized[i + 3]) / 255,
          );
      rendered.push({
        file,
        data: normalized,
        ratio: bounds.width / bounds.height,
      });
      if (breakpoint?.file !== file) continue;
      if (nonwhite || !transparent)
        fail(
          `${slug}: Breakpoint artwork must be pure white with real transparency (${nonwhite} nonwhite pixels; ${transparent} transparent pixels)`,
        );
      if (
        value(breakpoint.logo, "theme") !== "dark" ||
        value(breakpoint.logo, "background") !== "transparent" ||
        value(breakpoint.logo, "treatment") !== "monotone"
      )
        fail(
          `${slug}: Breakpoint logo needs dark theme, transparent background, and monotone treatment metadata`,
        );
      const width = Number(value(breakpoint.logo, "width"));
      const height = Number(value(breakpoint.logo, "height"));
      if (
        !(width > 0 && height > 0) ||
        Math.abs(width / height / (info.width / info.height) - 1) > 0.01
      )
        fail(
          `${slug}: Breakpoint dimensions are missing or have the wrong aspect ratio`,
        );
      if ((bounds.width * bounds.height) / (info.width * info.height) < 0.75)
        candidates.push(`${slug}: inspect excess Breakpoint artboard padding`);
      const image = await sharp(file)
        .resize(320, 120, { fit: "contain", background: "#171717" })
        .flatten({ background: "#171717" })
        .png()
        .toBuffer();
      previews.push({ slug, image });
    }
    for (let i = 0; i < rendered.length; i++)
      for (let j = i + 1; j < rendered.length; j++) {
        const a = rendered[i],
          b = rendered[j];
        if (Math.abs(a.ratio / b.ratio - 1) > 0.03) continue;
        let difference = 0;
        for (let k = 0; k < a.data.length; k++)
          difference += Math.abs(a.data[k] - b.data[k]);
        difference /= a.data.length;
        if (difference < 3)
          candidates.push(
            `${slug}: compare ${path.basename(a.file)} / ${path.basename(b.file)} (mean RGBA difference ${difference.toFixed(3)}); preserve actual color or layout differences`,
          );
      }
  } catch (error) {
    fail(`${slug}: ${error.message}`);
  }
}

// Compare bytes across the entire company tree, but fail only groups involving
// this invocation's companies. Existing unrelated duplicates stay out of scope.
const hashes = new Map();
for (const file of filesUnder(assetsRoot)) {
  const hash = createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  const files = hashes.get(hash) ?? [];
  files.push(file);
  hashes.set(hash, files);
}
for (const files of hashes.values()) {
  if (
    files.length > 1 &&
    files.some((f) =>
      slugs.has(path.relative(assetsRoot, f).split(path.sep)[0]),
    )
  )
    fail(
      `Duplicate files: ${files.map((f) => path.relative(assetsRoot, f)).join(" = ")}`,
    );
}
if (preview && previews.length) {
  const cellWidth = 320,
    cellHeight = 150,
    columns = Math.min(3, previews.length);
  const rows = Math.ceil(previews.length / columns);
  const layers = previews.flatMap(({ slug, image }, index) => {
    const left = (index % columns) * cellWidth,
      top = Math.floor(index / columns) * cellHeight;
    const label = Buffer.from(
      `<svg width="320" height="30"><text x="12" y="20" font-size="14" fill="white">${slug}</text></svg>`,
    );
    return [
      { input: image, left, top },
      { input: label, left, top: top + 120 },
    ];
  });
  await sharp({
    create: {
      width: columns * cellWidth,
      height: rows * cellHeight,
      channels: 4,
      background: "#171717",
    },
  })
    .composite(layers)
    .png()
    .toFile(preview);
}
console.log(
  JSON.stringify(
    {
      companies: [...slugs],
      errors,
      reviewCandidates: candidates,
      linksToVerify: links,
      preview,
    },
    null,
    2,
  ),
);
if (errors.length) process.exitCode = 1;
