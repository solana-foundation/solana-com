import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ts from "typescript";

const webRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const repoRoot = path.resolve(webRoot, "../..");
const auditedFiles = [
  "src/data/developers/defi.ts",
  "src/data/pyusd.ts",
  "src/data/solutions/financial-institutions.ts",
];
const requiredExports = {
  "src/data/developers/defi.ts": [
    "HERO_BUTTONS",
    "STATS",
    "NETWORK_PROPERTIES",
    "STACK_STEPS",
    "TEMPLATES",
    "PRIMITIVES",
    "LANDING_STEPS",
    "SECURITY_ITEMS",
    "READING",
    "COMMUNITY_LINKS",
  ],
  "src/data/pyusd.ts": [
    "HERO_BUTTONS",
    "STATS",
    "TRUST_ITEMS",
    "MINT_EXTENSIONS",
    "BUILD_STEPS",
    "RESOURCES",
    "RELATED_LINKS",
  ],
  "src/data/solutions/financial-institutions.ts": ["PROJECTS"],
};
const requiredClaimPaths = [
  "financial-institutions-solution.projects.morganStanley.stat",
  "financial-institutions-solution.projects.jpmorgan.stat",
  "financial-institutions-solution.projects.citi.stat",
  "financial-institutions-solution.projects.societeGenerale.stat",
  "financial-institutions-solution.projects.stateStreet.stat",
  "financial-institutions-solution.projects.stateStreet.description",
  "pyusd.hero.body",
  "developers-defi.stats.items.dexVolume.value",
  "developers-defi.stats.items.stablecoins.value",
  "developers-defi.stats.items.computeUnits.value",
  "developers-defi.stats.items.txSize.value",
  "pyusd.stats.items.solanaSupply.value",
  "pyusd.stats.items.reserves.value",
  "pyusd.stats.items.solanaShare.value",
  "pyusd.stats.items.backing.value",
  "pyusd.trust.items.issuer.body",
  "pyusd.mint.extensions.transferFee.body",
];

const redirectSources = new Set();
const redirectPatterns = [];
const redirectsFile = path.join(webRoot, "rewrites-redirects.ts");
const redirectsSource = ts.createSourceFile(
  redirectsFile,
  readFileSync(redirectsFile, "utf8"),
  ts.ScriptTarget.Latest,
  true,
);
function collectRedirectSources(node) {
  if (
    ts.isPropertyAssignment(node) &&
    node.name.getText(redirectsSource) === "source" &&
    ts.isStringLiteral(node.initializer)
  ) {
    const source = node.initializer.text;
    redirectSources.add(source);
    if (source.includes(":")) redirectPatterns.push(sourcePattern(source));
  }
  ts.forEachChild(node, collectRedirectSources);
}
collectRedirectSources(redirectsSource);

// Next.js path params: `:slug` is one segment, `:slug+` one or more and
// `:slug*` zero or more.
function sourcePattern(source) {
  const pattern = source
    .split("/")
    .map((segment) => {
      const param = segment.match(/^:\w+([*+?])?$/);
      if (!param) return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (param[1] === "*") return "(?:/.*)?";
      if (param[1] === "+") return "/.+";
      if (param[1] === "?") return "(?:/[^/]+)?";
      return "/[^/]+";
    })
    .reduce((joined, part) =>
      part.startsWith("/") || part.startsWith("(?:/")
        ? joined + part
        : `${joined}/${part}`,
    );
  return new RegExp(`^${pattern}$`);
}

function routeExists(pathname) {
  if (redirectSources.has(pathname)) return true;
  if (pathname.startsWith("/ecosystem/")) return true; // web rewrite to /ecosystem
  if (pathname.startsWith("/news/")) {
    const slug = pathname.slice("/news/".length);
    return existsSync(
      path.join(repoRoot, "apps/media/content/posts", `${slug}.mdx`),
    );
  }
  if (pathname.startsWith("/developers/cookbook/")) {
    const slug = pathname.slice("/developers/cookbook/".length);
    const base = path.join(repoRoot, "apps/docs/content/cookbook", slug);
    return (
      existsSync(`${base}.mdx`) || existsSync(path.join(base, "index.mdx"))
    );
  }
  if (pathname.startsWith("/docs/")) {
    const slug = pathname.slice("/docs/".length);
    const base = path.join(repoRoot, "apps/docs/content/docs/en", slug);
    return (
      existsSync(`${base}.mdx`) || existsSync(path.join(base, "index.mdx"))
    );
  }
  // Checked after content-backed prefixes so a catch-all rewrite such as
  // /docs/:path* cannot hide a missing page.
  if (redirectPatterns.some((pattern) => pattern.test(pathname))) return true;
  for (const app of ["web", "docs", "media"]) {
    const base = path.join(repoRoot, `apps/${app}/src/app/[locale]`, pathname);
    if (existsSync(path.join(base, "page.tsx"))) return true;
  }
  return false;
}

export function validateUrl(value, location) {
  const errors = [];
  if (typeof value !== "string" || !value.trim()) {
    return [`${location}: URL is empty`];
  }
  if (value !== value.trim())
    errors.push(`${location}: URL has surrounding whitespace`);
  try {
    const url = new URL(value, "https://solana.com");
    if (
      value.startsWith("//") ||
      (!value.startsWith("/") && !/^https?:\/\//.test(value))
    ) {
      errors.push(`${location}: URL must be absolute or root-relative`);
    }
    if (!["http:", "https:"].includes(url.protocol)) {
      errors.push(`${location}: unsupported URL protocol`);
    }
    if (
      (value.startsWith("/") ||
        url.hostname === "solana.com" ||
        url.hostname === "www.solana.com") &&
      !routeExists(url.pathname)
    ) {
      errors.push(`${location}: no local destination for ${url.pathname}`);
    }
  } catch {
    errors.push(`${location}: invalid URL ${value}`);
  }
  return errors;
}

export function validateLinks(record, location) {
  const errors = [];
  if (!record || typeof record !== "object") return errors;
  if (Array.isArray(record)) {
    record.forEach((item, index) =>
      errors.push(...validateLinks(item, `${location}[${index}]`)),
    );
    return errors;
  }
  if (
    (location.endsWith(".button") ||
      location.endsWith(".callToAction") ||
      "hierarchy" in record) &&
    !("url" in record)
  ) {
    errors.push(`${location}: actionable object requires a URL`);
  }
  for (const [key, value] of Object.entries(record)) {
    if (key === "url" || key === "href" || key === "statSource") {
      errors.push(...validateUrl(value, `${location}.${key}`));
    } else {
      errors.push(...validateLinks(value, `${location}.${key}`));
    }
  }
  return errors;
}

function staticValue(node, declarations) {
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isIdentifier(node) && declarations.has(node.text))
    return staticValue(declarations.get(node.text), declarations);
  if (ts.isArrayLiteralExpression(node))
    return node.elements.flatMap((element) => {
      if (ts.isSpreadElement(element)) {
        const value = staticValue(element.expression, declarations);
        if (!Array.isArray(value))
          throw new Error("Cannot resolve array spread");
        return value;
      }
      return [staticValue(element, declarations)];
    });
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(
      node.properties.flatMap((property) => {
        if (ts.isSpreadAssignment(property)) {
          const value = staticValue(property.expression, declarations);
          if (!value || typeof value !== "object" || Array.isArray(value))
            throw new Error("Cannot resolve object spread");
          return Object.entries(value);
        }
        if (ts.isShorthandPropertyAssignment(property)) {
          const value = staticValue(property.name, declarations);
          if (value === undefined)
            throw new Error("Cannot resolve shorthand property");
          return [[property.name.text, value]];
        }
        if (!ts.isPropertyAssignment(property)) return [];
        const name = property.name.getText().replace(/^['"]|['"]$/g, "");
        // Dynamic values such as logo lookups are irrelevant to link validation.
        const value = staticValue(property.initializer, declarations);
        if (
          ["url", "href", "button", "callToAction"].includes(name) &&
          value === undefined
        )
          throw new Error(`Cannot resolve ${name} property`);
        return [[name, value]];
      }),
    );
  }
  if (
    ts.isAsExpression(node) ||
    ts.isSatisfiesExpression(node) ||
    ts.isParenthesizedExpression(node)
  )
    return staticValue(node.expression, declarations);
  return undefined;
}

function readStaticExport(sourceText, relativePath, exportName) {
  const source = ts.createSourceFile(
    relativePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
  );
  const declarations = new Map();
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer)
        declarations.set(declaration.name.text, declaration.initializer);
    }
  }
  const initializer = declarations.get(exportName);
  return initializer ? staticValue(initializer, declarations) : undefined;
}

export function validateSource(sourceText, relativePath) {
  const source = ts.createSourceFile(
    relativePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
  );
  const errors = [];
  const declarations = new Map();
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer)
        declarations.set(declaration.name.text, declaration.initializer);
    }
  }
  for (const name of requiredExports[relativePath] ?? []) {
    if (!declarations.has(name))
      errors.push(`${relativePath}: missing audited export ${name}`);
  }
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!declaration.initializer) continue;
      const location = `${relativePath}:${declaration.name.getText(source)}`;
      try {
        const value = staticValue(declaration.initializer, declarations);
        if (
          value === undefined &&
          requiredExports[relativePath]?.includes(
            declaration.name.getText(source),
          )
        )
          errors.push(`${location}: cannot resolve audited export`);
        else errors.push(...validateLinks(value, location));
      } catch (error) {
        errors.push(`${location}: ${error.message}`);
      }
    }
  }
  return errors;
}

function validateFile(relativePath) {
  return validateSource(
    readFileSync(path.join(webRoot, relativePath), "utf8"),
    relativePath,
  );
}

function messageAtPath(messages, dottedPath) {
  return dottedPath
    .split(".")
    .reduce((current, part) => current?.[part], messages);
}

export function validateClaims(
  claims,
  messages,
  today = new Date().toISOString().slice(0, 10),
) {
  const errors = [];
  for (const requiredPath of requiredClaimPaths) {
    if (!claims.some((entry) => entry.path === requiredPath)) {
      errors.push(`claims.json: missing required claim ${requiredPath}`);
    }
  }
  for (const entry of claims) {
    const location = `claims.json:${entry.path}`;
    const copy = messageAtPath(messages, entry.path);
    if (
      !entry.claim ||
      typeof copy !== "string" ||
      !copy.includes(entry.claim)
    ) {
      errors.push(`${location}: claim text is absent from English content`);
    }
    if (!entry.owner?.trim()) errors.push(`${location}: owner is required`);
    try {
      const sourceUrl = new URL(entry.sourceUrl);
      if (sourceUrl.protocol !== "https:" || !sourceUrl.hostname)
        errors.push(`${location}: valid HTTPS source is required`);
    } catch {
      errors.push(`${location}: valid HTTPS source is required`);
    }
    for (const field of ["asOf", "reviewBy"]) {
      const date = entry[field];
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "") ||
        Number.isNaN(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date
      ) {
        errors.push(`${location}: valid ${field} date is required`);
      }
    }
    if (entry.asOf > today) errors.push(`${location}: asOf is in the future`);
    if (entry.reviewBy < today)
      errors.push(`${location}: review deadline has passed`);
    if (entry.reviewBy < entry.asOf)
      errors.push(`${location}: review deadline precedes asOf`);
  }
  return errors;
}

export function validateFinancialProjectStats(projects, claims, messages) {
  if (!Array.isArray(projects))
    return ["financial institutions: PROJECTS must be a static array"];
  const errors = [];
  for (const project of projects) {
    const path = `financial-institutions-solution.projects.${project.key}.stat`;
    const claim = claims.find((entry) => entry.path === path);
    const message = messageAtPath(messages, path);
    if (
      !project.statValue ||
      project.statValue !== message ||
      project.statValue !== claim?.claim
    )
      errors.push(
        `${path}: displayed stat must match the audited English claim`,
      );
    if (!project.statSource || project.statSource !== claim?.sourceUrl)
      errors.push(`${path}: displayed source must match the audited source`);
  }
  return errors;
}

// Pages whose STATS export renders `<namespace>.stats.items.<id>.value`
// beside a link to `statSource`.
const statPages = [
  { namespace: "developers-defi", file: "src/data/developers/defi.ts" },
  { namespace: "pyusd", file: "src/data/pyusd.ts" },
];

export function validatePageStats(namespace, stats, claims, messages) {
  if (!Array.isArray(stats))
    return [`${namespace}: STATS must be a static array`];
  const errors = [];
  for (const stat of stats) {
    const path = `${namespace}.stats.items.${stat.id}.value`;
    const claim = claims.find((entry) => entry.path === path);
    if (!claim || messageAtPath(messages, path) !== claim.claim)
      errors.push(
        `${path}: displayed stat must match the audited English claim`,
      );
    if (!stat.statSource || stat.statSource !== claim?.sourceUrl)
      errors.push(`${path}: displayed source must match the audited source`);
  }
  return errors;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const claims = JSON.parse(
    readFileSync(path.join(webRoot, "content-audit/claims.json"), "utf8"),
  );
  const messages = JSON.parse(
    readFileSync(
      path.join(repoRoot, "packages/i18n/messages/web/en/common.json"),
      "utf8",
    ),
  );
  const errors = [
    ...auditedFiles.flatMap(validateFile),
    ...validateClaims(claims, messages),
    ...validateFinancialProjectStats(
      readStaticExport(
        readFileSync(
          path.join(webRoot, "src/data/solutions/financial-institutions.ts"),
          "utf8",
        ),
        "src/data/solutions/financial-institutions.ts",
        "PROJECTS",
      ),
      claims,
      messages,
    ),
    ...statPages.flatMap(({ namespace, file }) =>
      validatePageStats(
        namespace,
        readStaticExport(
          readFileSync(path.join(webRoot, file), "utf8"),
          file,
          "STATS",
        ),
        claims,
        messages,
      ),
    ),
  ];
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(
      `Validated links in ${auditedFiles.length} page data files and ${claims.length} dated claims.`,
    );
  }
}
