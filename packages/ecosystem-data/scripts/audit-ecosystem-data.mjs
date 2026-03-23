/* global console, process */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const recordsRoot = path.join(packageRoot, "src/companies/records");
const assetsRoot = path.join(packageRoot, "assets/companies");

function getPropertyName(nameNode) {
  if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode)) {
    return nameNode.text;
  }

  return null;
}

function getPropertyByName(node, propertyName) {
  if (!node || !ts.isObjectLiteralExpression(node)) {
    return null;
  }

  return node.properties.find((property) => {
    if (!ts.isPropertyAssignment(property)) {
      return false;
    }

    return getPropertyName(property.name) === propertyName;
  });
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

function getRecordObject(filePath) {
  const fileText = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    fileText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const importedAssetPaths = new Map();
  let recordNode = null;

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      const importName = statement.importClause?.name?.text;
      const moduleSpecifier = getStringLiteralValue(statement.moduleSpecifier);

      if (importName && moduleSpecifier?.startsWith("../../../assets/companies/")) {
        importedAssetPaths.set(
          importName,
          moduleSpecifier.replace("../../../assets/companies/", ""),
        );
      }

      continue;
    }

    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    const isExported = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    );
    if (!isExported) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      const initializer = declaration.initializer;
      const objectLiteral =
        initializer && ts.isSatisfiesExpression(initializer)
          ? initializer.expression
          : initializer;

      if (objectLiteral && ts.isObjectLiteralExpression(objectLiteral)) {
        recordNode = objectLiteral;
      }
    }
  }

  return { importedAssetPaths, recordNode };
}

const recordFiles = fs
  .readdirSync(recordsRoot, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
  .map((entry) => entry.name)
  .sort();

const records = [];

for (const fileName of recordFiles) {
  const filePath = path.join(recordsRoot, fileName);
  const { importedAssetPaths, recordNode } = getRecordObject(filePath);

  if (!recordNode) {
    continue;
  }

  const id = getObjectPropertyString(recordNode, "id");
  const slug = getObjectPropertyString(recordNode, "slug");
  const defaultLogoId = getObjectPropertyString(recordNode, "defaultLogoId");
  const profileNode = getNestedProperty(recordNode, ["profile"]);
  const profileObject = ts.isObjectLiteralExpression(profileNode) ? profileNode : null;
  const linksObject = getObjectPropertyObject(profileObject, "links");
  const socialsObject = getObjectPropertyObject(profileObject, "socials");
  const logosArray = getObjectPropertyArray(recordNode, "logos");
  const logos = [];

  if (logosArray) {
    for (const entry of logosArray.elements) {
      if (!ts.isObjectLiteralExpression(entry)) {
        continue;
      }

      const logoId = getObjectPropertyString(entry, "id");
      const fileNameValue = getObjectPropertyString(entry, "fileName");
      const sourceProperty = getPropertyByName(entry, "source");
      const sourceIdentifier =
        sourceProperty && ts.isIdentifier(sourceProperty.initializer)
          ? sourceProperty.initializer.text
          : null;

      if (!logoId || !fileNameValue) {
        continue;
      }

      logos.push({
        id: logoId,
        fileName: fileNameValue,
        importedAssetPath: sourceIdentifier
          ? importedAssetPaths.get(sourceIdentifier) ?? null
          : null,
      });
    }
  }

  const hasWebsiteUrl = Boolean(getObjectPropertyString(linksObject, "website"));

  const socialCount = socialsObject
    ? socialsObject.properties.filter((property) => {
        if (!ts.isPropertyAssignment(property)) {
          return false;
        }

        return Boolean(getStringLiteralValue(property.initializer));
      }).length
    : 0;

  records.push({
    fileName,
    fileSlug: fileName.replace(/\.ts$/, ""),
    id,
    slug,
    defaultLogoId,
    logos,
    profileNull: profileNode?.kind === ts.SyntaxKind.NullKeyword,
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
  filesWithMismatchedSlug: records
    .filter((record) => record.slug && record.fileSlug !== record.slug)
    .map((record) => `${record.fileName} -> slug ${record.slug}`),
  assetFoldersWithoutRecord: assetFolders.filter(
    (folder) => !companyIdSet.has(folder) && !recordSlugSet.has(folder),
  ),
  recordsWithoutAssetFolder: records
    .filter((record) => record.slug && !assetFolderSet.has(record.slug))
    .map((record) => `${record.id} -> ${record.slug}`),
  recordsWithNullProfile: records
    .filter((record) => record.profileNull)
    .map((record) => record.id),
  recordsMissingWebsite: records
    .filter((record) => !record.profileNull && !record.hasWebsiteUrl)
    .map((record) => record.id),
  recordsMissingSocials: records
    .filter((record) => !record.profileNull && record.socialCount === 0)
    .map((record) => record.id),
  recordsWithoutLogos: records
    .filter((record) => record.logos.length === 0)
    .map((record) => record.id),
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
  enrichedRecords: records.length - issues.recordsWithNullProfile.length,
  nullProfiles: issues.recordsWithNullProfile.length,
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
