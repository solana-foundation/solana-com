/* global console, process */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const walletDataPath = path.join(packageRoot, "src/wallets/wallet-data.ts");

function printUsage() {
  console.log(`Usage: pnpm --filter @workspace/ecosystem-data wallets:research-queue [options]

Options:
  --slug <slug>              Return one canonical wallet record.
  --stale-before <YYYY-MM-DD> Return records not verified since the date.
  --help                     Show this help.`);
}

function readOptions(args) {
  const options = { slug: undefined, staleBefore: undefined };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--") {
      continue;
    }

    if (argument === "--help") {
      printUsage();
      process.exit(0);
    }

    if (argument === "--slug" || argument === "--stale-before") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${argument} requires a value`);
      }

      if (argument === "--slug") {
        options.slug = value;
      } else {
        options.staleBefore = value;
      }

      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${argument}`);
  }

  if (options.staleBefore && !/^\d{4}-\d{2}-\d{2}$/.test(options.staleBefore)) {
    throw new Error("--stale-before must use YYYY-MM-DD format");
  }

  return options;
}

function unwrapExpression(expression) {
  let current = expression;

  while (
    current &&
    (ts.isSatisfiesExpression(current) ||
      ts.isAsExpression(current) ||
      ts.isParenthesizedExpression(current))
  ) {
    current = current.expression;
  }

  return current;
}

function getPropertyName(nameNode) {
  if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode)) {
    return nameNode.text;
  }

  return undefined;
}

function getProperty(node, propertyName) {
  return node.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) &&
      getPropertyName(property.name) === propertyName,
  );
}

function getString(node, propertyName) {
  const property = getProperty(node, propertyName);
  const value = property && unwrapExpression(property.initializer);

  return value &&
    (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value))
    ? value.text
    : undefined;
}

function getStringArray(node, propertyName) {
  const property = getProperty(node, propertyName);
  const value = property && unwrapExpression(property.initializer);

  if (!value || !ts.isArrayLiteralExpression(value)) {
    return [];
  }

  return value.elements
    .map((element) => unwrapExpression(element))
    .filter(
      (element) =>
        ts.isStringLiteral(element) ||
        ts.isNoSubstitutionTemplateLiteral(element),
    )
    .map((element) => element.text);
}

function getWalletRecordsObject(sourceFile) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === "walletRecords"
      ) {
        const initializer = unwrapExpression(declaration.initializer);
        if (initializer && ts.isObjectLiteralExpression(initializer)) {
          return initializer;
        }
      }
    }
  }

  throw new Error(`Could not find walletRecords in ${walletDataPath}`);
}

function readWallets() {
  const sourceText = fs.readFileSync(walletDataPath, "utf8");
  const sourceFile = ts.createSourceFile(
    walletDataPath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const recordsObject = getWalletRecordsObject(sourceFile);

  return recordsObject.properties
    .filter(ts.isPropertyAssignment)
    .map((property) => {
      const slug = getPropertyName(property.name);
      const record = unwrapExpression(property.initializer);

      if (!slug || !record || !ts.isObjectLiteralExpression(record)) {
        return undefined;
      }

      return {
        slug,
        name: getString(record, "name"),
        aliases: getStringArray(record, "aliases"),
        companyId: getString(record, "companyId"),
        category: getString(record, "category"),
        website: getString(record, "website"),
        lastVerified: getString(record, "lastVerified"),
      };
    })
    .filter(Boolean)
    .sort((first, second) => first.slug.localeCompare(second.slug));
}

const options = readOptions(process.argv.slice(2));
let wallets = readWallets();

if (options.slug) {
  wallets = wallets.filter((wallet) => wallet.slug === options.slug);

  if (wallets.length === 0) {
    throw new Error(`Unknown wallet slug: ${options.slug}`);
  }
}

if (options.staleBefore) {
  wallets = wallets.filter(
    (wallet) =>
      !wallet.lastVerified || wallet.lastVerified < options.staleBefore,
  );
}

console.log(
  JSON.stringify(
    {
      source: path.relative(packageRoot, walletDataPath),
      count: wallets.length,
      wallets,
    },
    null,
    2,
  ),
);
