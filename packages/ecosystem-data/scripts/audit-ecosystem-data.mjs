/* global console, process */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const registryPath = path.join(packageRoot, "src/companies/registry.ts");
const assetsRoot = path.join(packageRoot, "assets/companies");

const registryText = fs.readFileSync(registryPath, "utf8");
const sourceFile = ts.createSourceFile(
  registryPath,
  registryText,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);

function getPropertyByName(node, propertyName) {
  if (!node || !ts.isObjectLiteralExpression(node)) {
    return null;
  }

  return node.properties.find((property) => {
    if (!ts.isPropertyAssignment(property)) {
      return false;
    }

    const name = getPropertyName(property.name);
    return name === propertyName;
  });
}

function getPropertyName(nameNode) {
  if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode)) {
    return nameNode.text;
  }

  return null;
}

function getStringLiteralValue(expression) {
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
    return expression.text;
  }

  return null;
}

function getObjectPropertyString(node, propertyName) {
  const property = getPropertyByName(node, propertyName);
  if (!property) {
    return null;
  }

  return getStringLiteralValue(property.initializer);
}

function getObjectPropertyObject(node, propertyName) {
  const property = getPropertyByName(node, propertyName);
  if (!property || !ts.isObjectLiteralExpression(property.initializer)) {
    return null;
  }

  return property.initializer;
}

function getObjectPropertyArray(node, propertyName) {
  const property = getPropertyByName(node, propertyName);
  if (!property || !ts.isArrayLiteralExpression(property.initializer)) {
    return null;
  }

  return property.initializer;
}

function getNestedProperty(node, propertyPath) {
  let current = node;

  for (const propertyName of propertyPath) {
    if (!current || !ts.isObjectLiteralExpression(current)) {
      return null;
    }

    const next = getPropertyByName(current, propertyName);
    if (!next) {
      return null;
    }

    current = next.initializer;
  }

  return current;
}

const importedAssetPaths = new Map();
let companiesByIdNode = null;

for (const statement of sourceFile.statements) {
  if (ts.isImportDeclaration(statement)) {
    const importClause = statement.importClause;
    if (!importClause?.name) {
      continue;
    }

    const moduleSpecifier = getStringLiteralValue(statement.moduleSpecifier);
    if (!moduleSpecifier?.startsWith("../../assets/companies/")) {
      continue;
    }

    importedAssetPaths.set(
      importClause.name.text,
      moduleSpecifier.replace("../../assets/companies/", ""),
    );
    continue;
  }

  if (!ts.isVariableStatement(statement)) {
    continue;
  }

  for (const declaration of statement.declarationList.declarations) {
    if (!ts.isIdentifier(declaration.name) || declaration.name.text !== "companiesById") {
      continue;
    }

    const initializer = declaration.initializer;
    const objectLiteral =
      initializer && ts.isSatisfiesExpression(initializer)
        ? initializer.expression
        : initializer;

    if (objectLiteral && ts.isObjectLiteralExpression(objectLiteral)) {
      companiesByIdNode = objectLiteral;
    }
  }
}

if (!companiesByIdNode) {
  console.error("Could not locate companiesById in registry.ts");
  process.exit(1);
}

const records = [];

for (const property of companiesByIdNode.properties) {
  if (!ts.isPropertyAssignment(property)) {
    continue;
  }

  const key = getPropertyName(property.name);
  if (!key || !ts.isObjectLiteralExpression(property.initializer)) {
    continue;
  }

  const recordNode = property.initializer;
  const id = getObjectPropertyString(recordNode, "id");
  const slug = getObjectPropertyString(recordNode, "slug");
  const defaultLogoId = getObjectPropertyString(recordNode, "defaultLogoId");
  const gridProfileNode = getNestedProperty(recordNode, ["gridProfile"]);
  const gridProfileObject = ts.isObjectLiteralExpression(gridProfileNode) ? gridProfileNode : null;
  const urlEntries = getObjectPropertyArray(gridProfileObject, "urls");
  const socialsNode = getNestedProperty(recordNode, ["gridProfile", "root", "socials"]);
  const logosArray = getObjectPropertyArray(recordNode, "logos");
  const logos = [];

  if (logosArray) {
    for (const entry of logosArray.elements) {
      if (!ts.isObjectLiteralExpression(entry)) {
        continue;
      }

      const logoId = getObjectPropertyString(entry, "id");
      const fileName = getObjectPropertyString(entry, "fileName");
      const sourceProperty = getPropertyByName(entry, "source");
      const sourceIdentifier =
        sourceProperty && ts.isIdentifier(sourceProperty.initializer)
          ? sourceProperty.initializer.text
          : null;

      if (!logoId || !fileName) {
        continue;
      }

      logos.push({
        id: logoId,
        fileName,
        importedAssetPath: sourceIdentifier
          ? importedAssetPaths.get(sourceIdentifier) ?? null
          : null,
      });
    }
  }

  const hasWebsiteUrl = !!urlEntries?.elements.some((entry) => {
    if (!ts.isObjectLiteralExpression(entry)) {
      return false;
    }

    const urlTypeNode = getObjectPropertyObject(entry, "urlType");
    return getObjectPropertyString(urlTypeNode ?? recordNode, "name") === "website";
  });

  const socialCount =
    socialsNode && ts.isArrayLiteralExpression(socialsNode)
      ? socialsNode.elements.length
      : 0;

  records.push({
    key,
    id,
    slug,
    defaultLogoId,
    logos,
    gridProfileNull: gridProfileNode?.kind === ts.SyntaxKind.NullKeyword,
    hasWebsiteUrl,
    socialCount,
  });
}

const assetFolders = fs
  .readdirSync(assetsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const assetFolderSet = new Set(assetFolders);
const companyIdSet = new Set(records.map((record) => record.id).filter(Boolean));
const recordSlugSet = new Set(records.map((record) => record.slug).filter(Boolean));

const issues = {
  assetFoldersWithoutRecord: assetFolders.filter(
    (folder) => !companyIdSet.has(folder) && !recordSlugSet.has(folder),
  ),
  recordsWithoutAssetFolder: records
    .filter((record) => record.slug && !assetFolderSet.has(record.slug))
    .map((record) => `${record.id} -> ${record.slug}`),
  recordsWithNullGridProfile: records.filter((record) => record.gridProfileNull).map((record) => record.id),
  recordsMissingWebsite: records
    .filter((record) => !record.gridProfileNull && !record.hasWebsiteUrl)
    .map((record) => record.id),
  recordsMissingSocials: records
    .filter((record) => !record.gridProfileNull && record.socialCount === 0)
    .map((record) => record.id),
  recordsWithoutLogos: records.filter((record) => record.logos.length === 0).map((record) => record.id),
  recordsWithInvalidDefaultLogoId: records
    .filter(
      (record) =>
        record.defaultLogoId &&
        !record.logos.some((logo) => logo.id === record.defaultLogoId),
    )
    .map((record) => `${record.id} -> ${record.defaultLogoId}`),
  missingLogoFiles: [],
  importedAssetsMissingOnDisk: [],
  unreferencedAssetFiles: [],
};

for (const record of records) {
  if (!record.slug) {
    continue;
  }

  const folderPath = path.join(assetsRoot, record.slug);
  const folderExists = fs.existsSync(folderPath);
  const referencedFiles = new Set(record.logos.map((logo) => logo.fileName));

  for (const logo of record.logos) {
    const diskPath = path.join(folderPath, logo.fileName);
    if (!fs.existsSync(diskPath)) {
      issues.missingLogoFiles.push(`${record.id} -> ${record.slug}/${logo.fileName}`);
    }

    if (logo.importedAssetPath) {
      const importedAssetAbsolutePath = path.join(assetsRoot, logo.importedAssetPath);
      if (!fs.existsSync(importedAssetAbsolutePath)) {
        issues.importedAssetsMissingOnDisk.push(`${record.id} -> ${logo.importedAssetPath}`);
      }
    }
  }

  if (!folderExists) {
    continue;
  }

  const diskFiles = fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();

  for (const fileName of diskFiles) {
    if (!referencedFiles.has(fileName)) {
      issues.unreferencedAssetFiles.push(`${record.id} -> ${record.slug}/${fileName}`);
    }
  }
}

const summary = {
  companyRecords: records.length,
  assetFolders: assetFolders.length,
  enrichedRecords: records.length - issues.recordsWithNullGridProfile.length,
  nullGridProfiles: issues.recordsWithNullGridProfile.length,
};

let hasIssues = false;

console.log("Ecosystem Data Audit");
console.log(JSON.stringify(summary, null, 2));

for (const [label, values] of Object.entries(issues)) {
  if (values.length === 0) {
    continue;
  }

  hasIssues = true;
  console.log(`\n${label}:`);
  for (const value of values) {
    console.log(`- ${value}`);
  }
}

if (!hasIssues) {
  console.log("\nNo audit issues found.");
  process.exit(0);
}

process.exit(1);
