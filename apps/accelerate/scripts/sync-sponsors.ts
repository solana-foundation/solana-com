/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Configuration from environment
const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME!;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SERVICE_ACCOUNT_KEY_BASE64 =
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64;

// Paths
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "src", "data");
const SPONSORS_JSON = path.join(DATA_DIR, "sponsors.json");
const LOGOS_DIR = path.join(ROOT_DIR, "public", "images", "sponsors");

interface SheetRow {
  name: string;
  status: string;
  sponsorshipLevel: string;
  url: string;
  logoFolderId?: string;
}

interface Sponsor {
  slug: string;
  name: string;
  url: string;
  sponsorshipLevel: string;
  logo: string;
  availableLogos: string[];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function removeBrackets(text: string): string {
  return text.replace(/\s*\([^)]*\)/g, "").trim();
}

function removeComp(text: string): string {
  return text
    .replace(/\s*\(COMP\)/gi, "")
    .replace(/\s*COMP\s*/gi, " ")
    .trim()
    .replace(/\s+/g, " ");
}

async function fetchSheetData(): Promise<SheetRow[]> {
  // Use service account authentication if available, otherwise fall back to API key
  let auth;
  let authMethod: "service_account" | "api_key" = "api_key";

  if (SERVICE_ACCOUNT_EMAIL && SERVICE_ACCOUNT_KEY_BASE64) {
    try {
      const privateKey = Buffer.from(
        SERVICE_ACCOUNT_KEY_BASE64,
        "base64",
      ).toString("utf-8");

      auth = new google.auth.JWT(SERVICE_ACCOUNT_EMAIL, undefined, privateKey, [
        "https://www.googleapis.com/auth/spreadsheets.readonly",
        "https://www.googleapis.com/auth/drive.readonly",
      ]);
      authMethod = "service_account";
      console.log(
        `Using service account authentication: ${SERVICE_ACCOUNT_EMAIL}`,
      );
    } catch (error) {
      console.warn(
        "Failed to initialize service account auth, falling back to API key:",
        error,
      );
      auth = undefined;
    }
  }

  // Fall back to API key for public sheets
  if (!auth && API_KEY) {
    authMethod = "api_key";
    console.log(
      "Using API key authentication (requires sheet to be publicly readable)",
    );

    // For public sheets with API key, use direct fetch
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_NAME + "!A:Z")}?key=${API_KEY}`;
      const fetchResponse = await fetch(url);

      if (!fetchResponse.ok) {
        if (fetchResponse.status === 403) {
          throw new Error("PERMISSION_DENIED");
        }
        throw new Error(
          `HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`,
        );
      }

      const data = await fetchResponse.json();
      const rows = data.values;

      if (!rows || rows.length === 0) {
        console.log("No data found in sheet.");
        return [];
      }

      // First row is headers
      const headerRow = rows[0];
      if (!headerRow) {
        console.log("No header row found in sheet.");
        return [];
      }
      const headers = headerRow.map((h: string) => h.toLowerCase().trim());
      const dataRows = rows.slice(1);

      // Find column indices
      const nameIdx = headers.findIndex(
        (h: string) => h === "name" || h === "sponsor name" || h === "company",
      );
      const statusIdx = headers.findIndex(
        (h: string) =>
          h === "status" ||
          h === "web status" ||
          h === "logo received" ||
          h.includes("logo received"),
      );
      const levelIdx = headers.findIndex(
        (h: string) =>
          h === "sponsorship level" ||
          h === "sponsorhip level" ||
          h.includes("sponsorship level") ||
          h.includes("sponsorhip level") ||
          h === "level" ||
          h === "tier" ||
          h === "sponsorship tier",
      );
      const urlIdx = headers.findIndex(
        (h: string) => h === "url" || h === "website" || h === "link",
      );
      const logoFolderIdx = headers.findIndex((h: string) =>
        h.includes("logo folder"),
      );

      console.log("Column mapping:", {
        nameIdx,
        statusIdx,
        levelIdx,
        urlIdx,
        logoFolderIdx,
      });
      console.log("Headers found:", headers);

      if (nameIdx === -1) {
        throw new Error("Could not find 'name' column in sheet");
      }

      const sponsors: SheetRow[] = [];

      for (const row of dataRows) {
        const name = row[nameIdx]?.trim();
        const status = statusIdx !== -1 ? row[statusIdx]?.trim() || "" : "";
        const level = levelIdx !== -1 ? row[levelIdx]?.trim() || "" : "";
        const url = urlIdx !== -1 ? row[urlIdx]?.trim() || "#" : "#";
        const logoFolderRaw =
          logoFolderIdx !== -1 ? row[logoFolderIdx]?.trim() || "" : "";
        const logoFolderId = extractFolderId(logoFolderRaw);

        if (!name) continue;

        // Debug logging for first few rows
        if (sponsors.length < 3 && logoFolderRaw) {
          console.log(
            `  Debug: ${name} - Raw folder value: "${logoFolderRaw}", Extracted ID: ${logoFolderId || "none"}`,
          );
        }

        sponsors.push({
          name,
          status,
          sponsorshipLevel: level,
          url,
          logoFolderId,
        });
      }

      return sponsors;
    } catch (error: any) {
      if (error?.message === "PERMISSION_DENIED" || error?.code === 403) {
        throw new Error(
          `\n❌ Permission denied: The Google Sheet is not publicly readable.\n\n` +
            `To fix this, choose one of the following:\n` +
            `Option 1 (Recommended): Share with service account\n` +
            `  1. Open the Google Sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}\n` +
            `  2. Click "Share" button\n` +
            `  3. Add this email with "Viewer" permission: ${SERVICE_ACCOUNT_EMAIL}\n` +
            `  4. Make sure GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64 are set in .env\n\n` +
            `Option 2: Make sheet publicly readable\n` +
            `  1. Open the Google Sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}\n` +
            `  2. Click "Share" button\n` +
            `  3. Change access to "Anyone with the link" can view\n` +
            `  4. Run the script again\n`,
        );
      }
      throw error;
    }
  }

  if (!auth) {
    throw new Error(
      "Either GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64, or GOOGLE_SHEETS_API_KEY is required. Set them in .env.local or .env.",
    );
  }

  const sheets = google.sheets({ version: "v4", auth });

  console.log(`Fetching data from sheet: ${SHEET_ID}, tab: ${SHEET_NAME}`);

  try {
    // First, get the spreadsheet metadata to list available sheets
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    const availableSheets =
      spreadsheetInfo.data.sheets?.map((sheet) => sheet.properties?.title) ||
      [];

    console.log(`Available sheets/tabs: ${availableSheets.join(", ")}`);

    // Try to find the sheet by name (case-insensitive)
    const matchingSheet = availableSheets.find(
      (name) => name?.toLowerCase() === SHEET_NAME.toLowerCase(),
    );

    if (!matchingSheet) {
      throw new Error(
        `Sheet tab "${SHEET_NAME}" not found. Available tabs: ${availableSheets.join(", ")}\n` +
          `Please check GOOGLE_SHEET_NAME in your .env file.`,
      );
    }

    // Use the exact sheet name from the spreadsheet (preserves case and special characters)
    const exactSheetName = matchingSheet;
    console.log(`Using sheet: "${exactSheetName}"`);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `'${exactSheetName}'!A:Z`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log("No data found in sheet.");
      return [];
    }

    // First row is headers
    const headerRow = rows[0];
    if (!headerRow) {
      console.log("No header row found in sheet.");
      return [];
    }
    const headers = headerRow.map((h: string) => h.toLowerCase().trim());
    const dataRows = rows.slice(1);

    // Find column indices
    const nameIdx = headers.findIndex(
      (h: string) => h === "name" || h === "sponsor name" || h === "company",
    );
    const statusIdx = headers.findIndex(
      (h: string) =>
        h === "status" ||
        h === "web status" ||
        h === "logo received" ||
        h.includes("logo received"),
    );
    const levelIdx = headers.findIndex(
      (h: string) =>
        h === "sponsorship level" ||
        h === "sponsorhip level" ||
        h.includes("sponsorship level") ||
        h.includes("sponsorhip level") ||
        h === "level" ||
        h === "tier" ||
        h === "sponsorship tier",
    );
    const urlIdx = headers.findIndex(
      (h: string) => h === "url" || h === "website" || h === "link",
    );
    const logoFolderIdx = headers.findIndex((h: string) =>
      h.includes("logo folder"),
    );

    console.log("Column mapping:", {
      nameIdx,
      statusIdx,
      levelIdx,
      urlIdx,
      logoFolderIdx,
    });
    console.log("Headers found:", headers);

    if (nameIdx === -1) {
      throw new Error("Could not find 'name' column in sheet");
    }

    const sponsors: SheetRow[] = [];

    for (const row of dataRows) {
      const name = row[nameIdx]?.trim();
      const status = statusIdx !== -1 ? row[statusIdx]?.trim() || "" : "";
      const level = levelIdx !== -1 ? row[levelIdx]?.trim() || "" : "";
      const url = urlIdx !== -1 ? row[urlIdx]?.trim() || "#" : "#";
      const logoFolderRaw =
        logoFolderIdx !== -1 ? row[logoFolderIdx]?.trim() || "" : "";
      const logoFolderId = extractFolderId(logoFolderRaw);

      if (!name) continue;

      // Debug logging for first few rows
      if (sponsors.length < 3 && logoFolderRaw) {
        console.log(
          `  Debug: ${name} - Raw folder value: "${logoFolderRaw}", Extracted ID: ${logoFolderId || "none"}`,
        );
      }

      sponsors.push({
        name,
        status,
        sponsorshipLevel: level,
        url,
        logoFolderId,
      });
    }

    return sponsors;
  } catch (error: any) {
    if (error?.code === 403 || error?.status === 403) {
      const errorMessage =
        authMethod === "service_account"
          ? `\n❌ Permission denied: The service account (${SERVICE_ACCOUNT_EMAIL}) does not have access to the Google Sheet.\n\n` +
            `To fix this:\n` +
            `1. Open the Google Sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}\n` +
            `2. Click "Share" button\n` +
            `3. Add this email with "Viewer" permission: ${SERVICE_ACCOUNT_EMAIL}\n` +
            `4. Run the script again\n`
          : `\n❌ Permission denied: The Google Sheet is not publicly readable.\n\n` +
            `To fix this, choose one of the following:\n` +
            `Option 1 (Recommended): Share with service account\n` +
            `  1. Open the Google Sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}\n` +
            `  2. Click "Share" button\n` +
            `  3. Add this email with "Viewer" permission: ${SERVICE_ACCOUNT_EMAIL}\n` +
            `  4. Make sure GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64 are set in .env\n\n` +
            `Option 2: Make sheet publicly readable\n` +
            `  1. Open the Google Sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}\n` +
            `  2. Click "Share" button\n` +
            `  3. Change access to "Anyone with the link" can view\n` +
            `  4. Run the script again\n`;

      throw new Error(errorMessage);
    }
    throw error;
  }
}

function extractFolderId(input: string): string | undefined {
  if (!input) return undefined;

  const trimmed = input.trim();

  // If it's a Google Drive URL, extract the folder ID
  // Handles formats like:
  // - https://drive.google.com/drive/folders/FOLDER_ID
  // - https://drive.google.com/drive/u/0/folders/FOLDER_ID
  // - drive.google.com/drive/folders/FOLDER_ID
  const folderMatch = trimmed.match(/[\/]folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) {
    return folderMatch[1];
  }

  // If it looks like a folder ID already (alphanumeric with dashes/underscores, at least 20 chars for Drive IDs)
  if (/^[a-zA-Z0-9_-]+$/.test(trimmed) && trimmed.length >= 20) {
    return trimmed;
  }

  // Try to extract ID from any Google Drive link format
  const idMatch = trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1] && idMatch[1].length >= 20) {
    return idMatch[1];
  }

  return undefined;
}

function findExistingLogos(sponsorSlug: string): string[] {
  const logos: string[] = [];
  const seenPaths = new Set<string>();

  // Check for per-sponsor folder
  const sponsorDir = path.join(LOGOS_DIR, sponsorSlug);
  if (fs.existsSync(sponsorDir) && fs.statSync(sponsorDir).isDirectory()) {
    const files = fs.readdirSync(sponsorDir);
    for (const file of files) {
      // Match PNG and SVG files (case-insensitive)
      if (/\.(svg|png|jpg|jpeg|webp)$/i.test(file)) {
        const logoPath = `/images/sponsors/${sponsorSlug}/${file}`;
        const lowerPath = logoPath.toLowerCase();
        if (!seenPaths.has(lowerPath)) {
          logos.push(logoPath);
          seenPaths.add(lowerPath);
        }
      }
    }
  }

  // Check for flat file (legacy format) - check all files in logos directory
  // to handle case variations (e.g., logo.PNG, logo.png, logo.SVG, logo.svg)
  const allFiles = fs.existsSync(LOGOS_DIR) ? fs.readdirSync(LOGOS_DIR) : [];
  const baseNameLower = sponsorSlug.toLowerCase();

  for (const file of allFiles) {
    const fileLower = file.toLowerCase();
    // Check if file matches sponsor slug with any image extension (case-insensitive)
    // Match patterns like: slug.svg, slug.png, slug.PNG, slug.SVG, etc.
    const extMatch = file.match(/\.(svg|png|jpg|jpeg|webp)$/i);
    if (extMatch) {
      const ext = extMatch[0]; // Preserve original case
      const expectedNameLower = `${baseNameLower}${ext.toLowerCase()}`;
      // Match if the file name (case-insensitive) matches expected name
      if (fileLower === expectedNameLower) {
        const logoPath = `/images/sponsors/${file}`;
        const lowerPath = logoPath.toLowerCase();
        if (!seenPaths.has(lowerPath)) {
          logos.push(logoPath);
          seenPaths.add(lowerPath);
        }
      }
    }
  }

  return logos;
}

async function syncSponsors() {
  console.log("Starting sponsor sync...\n");

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Fetch sheet data
  const sheetRows = await fetchSheetData();
  console.log(`\nFound ${sheetRows.length} total rows in sheet`);

  // Filter for published sponsors
  // Check if logo received column contains "yes", "received", "logo received", or similar positive indicators
  const publishedRows = sheetRows.filter((row) => {
    const statusLower = row.status.toLowerCase().trim();
    return (
      statusLower.includes("logo received") ||
      statusLower.includes("received") ||
      statusLower === "yes" ||
      statusLower === "y" ||
      statusLower === "true" ||
      statusLower === "1"
    );
  });
  console.log(
    `Found ${publishedRows.length} sponsors with "Logo Received" status\n`,
  );

  // Load existing sponsors so we only add/update, never remove
  const existingBySlug = new Map<string, Sponsor>();
  if (fs.existsSync(SPONSORS_JSON)) {
    try {
      const existing = JSON.parse(fs.readFileSync(SPONSORS_JSON, "utf-8")) as {
        sponsors?: Sponsor[];
      };
      if (Array.isArray(existing.sponsors)) {
        for (const s of existing.sponsors) {
          existingBySlug.set(s.slug, s);
        }
      }
    } catch {
      // Ignore parse errors; we'll build from sheet only
    }
  }

  const sponsors: Sponsor[] = [];
  const processedSlugs = new Set<string>();

  for (const row of publishedRows) {
    // Clean the name by removing COMP and brackets
    const cleanedName = removeComp(removeBrackets(row.name));
    const slug = slugify(cleanedName);

    // Skip if we've already processed this slug
    if (processedSlugs.has(slug)) {
      console.log(`Skipping duplicate: ${row.name} (${slug})`);
      continue;
    }

    processedSlugs.add(slug);
    console.log(`Processing: ${row.name} (${slug})`);

    // Use existing local logos
    const availableLogos = findExistingLogos(slug);
    if (availableLogos.length > 0) {
      console.log(`  Using ${availableLogos.length} existing local logo(s)`);
    } else {
      console.log(`  Warning: No logos found for ${row.name}`);
    }

    // Pick primary logo (prefer SVG, then PNG, then WebP, then first available)
    // Check for case variations in fallback
    let fallbackLogo = `/images/sponsors/${slug}.svg`;
    if (fs.existsSync(LOGOS_DIR)) {
      const allFiles = fs.readdirSync(LOGOS_DIR);
      const slugLower = slug.toLowerCase();
      // Look for any SVG, PNG, or WebP file matching the slug (case-insensitive)
      const svgFile = allFiles.find(
        (f) => f.toLowerCase() === `${slugLower}.svg`,
      );
      const pngFile = allFiles.find(
        (f) => f.toLowerCase() === `${slugLower}.png`,
      );
      const webpFile = allFiles.find(
        (f) => f.toLowerCase() === `${slugLower}.webp`,
      );
      if (svgFile) {
        fallbackLogo = `/images/sponsors/${svgFile}`;
      } else if (pngFile) {
        fallbackLogo = `/images/sponsors/${pngFile}`;
      } else if (webpFile) {
        fallbackLogo = `/images/sponsors/${webpFile}`;
      }
    }

    const primaryLogo =
      availableLogos.find((l) => l.toLowerCase().endsWith(".svg")) ||
      availableLogos.find((l) => l.toLowerCase().endsWith(".png")) ||
      availableLogos.find((l) => l.toLowerCase().endsWith(".webp")) ||
      availableLogos[0] ||
      fallbackLogo;

    sponsors.push({
      slug,
      name: cleanedName,
      url: row.url || "#",
      sponsorshipLevel: removeBrackets(row.sponsorshipLevel),
      logo: primaryLogo,
      availableLogos,
    });
  }

  // Preserve existing sponsors that are not in the sheet (add-only: never remove)
  const sheetSlugs = new Set(sponsors.map((s) => s.slug));
  for (const [slug, existing] of existingBySlug) {
    if (!sheetSlugs.has(slug)) {
      sponsors.push(existing);
      console.log(
        `Kept existing sponsor not in sheet: ${existing.name} (${slug})`,
      );
    }
  }

  // Write JSON file
  const data = {
    syncedAt: new Date().toISOString(),
    sponsors,
  };

  fs.writeFileSync(SPONSORS_JSON, JSON.stringify(data, null, 2));
  console.log(`\nWrote ${sponsors.length} sponsors to ${SPONSORS_JSON}`);

  // Summary by tier
  const tierCounts = sponsors.reduce(
    (acc, s) => {
      acc[s.sponsorshipLevel] = (acc[s.sponsorshipLevel] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  console.log("\nSponsors by tier:");
  for (const [tier, count] of Object.entries(tierCounts)) {
    console.log(`  ${tier}: ${count}`);
  }

  console.log("\nSync complete!");
}

// Run the sync
syncSponsors().catch((error) => {
  console.error("Sync failed:", error);
  process.exit(1);
});
