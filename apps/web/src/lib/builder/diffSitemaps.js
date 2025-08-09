const fs = require("fs");
const path = require("path");

// File paths (adjust if needed)
const file1Path = path.join("public", "sitemap-0.xml");
const file2Path = path.join("public", "sitemap-diff.xml");

// Add this toggle at the top
const WRITE_TO_FILE = true; // Set to false to output to console instead

// Function to extract <loc> URLs from XML content
function extractLocs(xmlContent) {
  const locs = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(xmlContent)) !== null) {
    locs.push(match[1].trim());
  }
  return new Set(locs); // Use Set for fast lookups and uniqueness
}

// Read files
const file1Content = fs.readFileSync(file1Path, "utf-8");
const file2Content = fs.readFileSync(file2Path, "utf-8");

// Extract <loc> sets
const locs1 = extractLocs(file1Content);
const locs2 = extractLocs(file2Content);

// Find differences
const missingIn2 = [...locs1].filter((url) => !locs2.has(url));
const missingIn1 = [...locs2].filter((url) => !locs1.has(url));

// Output results to a file or console based on the toggle
const outputLines = [
  `\n=== URLs in sitemap-diff.xml but missing in sitemap-0.xml (${missingIn2.length}) ===`,
  ...missingIn2,
  `\n=== URLs in sitemap-0.xml but missing in sitemap-diff.xml (${missingIn1.length}) ===`,
  ...missingIn1,
  "\nDiff complete!",
];

if (WRITE_TO_FILE) {
  const outputPath = path.join("public", "results.txt");
  fs.writeFileSync(outputPath, outputLines.join("\n"), "utf-8");
  console.log(`Results written to ${outputPath}`);
} else {
  console.log(outputLines.join("\n"));
}
