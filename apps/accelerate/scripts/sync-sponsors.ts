import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";

// Configuration from environment
const SHEET_ID =
  process.env.GOOGLE_SHEET_ID || "1gs7j3DRpHa-5X6soRMK9iVkS4Sbal005RSyIomvFm-A";
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || "Sponsors";
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

async function fetchSheetData(): Promise<SheetRow[]> {
  if (!API_KEY) {
    throw new Error(
      "GOOGLE_SHEETS_API_KEY is required. Set it in .env.local or environment.",
    );
  }

  const sheets = google.sheets({ version: "v4", auth: API_KEY });

  console.log(`Fetching data from sheet: ${SHEET_ID}, tab: ${SHEET_NAME}`);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:Z`,
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
    (h: string) => h === "status" || h === "web status",
  );
  const levelIdx = headers.findIndex(
    (h: string) =>
      h === "sponsorship level" ||
      h === "level" ||
      h === "tier" ||
      h === "sponsorship tier",
  );
  const urlIdx = headers.findIndex(
    (h: string) => h === "url" || h === "website" || h === "link",
  );
  const logoFolderIdx = headers.findIndex(
    (h: string) =>
      h === "logo folder" ||
      h === "logo folder id" ||
      h === "drive folder" ||
      h === "logos",
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
    const logoFolderId =
      logoFolderIdx !== -1 ? row[logoFolderIdx]?.trim() || "" : "";

    if (!name) continue;

    sponsors.push({
      name,
      status,
      sponsorshipLevel: level,
      url,
      logoFolderId: extractFolderId(logoFolderId),
    });
  }

  return sponsors;
}

function extractFolderId(input: string): string | undefined {
  if (!input) return undefined;

  // If it's a URL, extract the folder ID
  const folderMatch = input.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) {
    return folderMatch[1];
  }

  // If it looks like a folder ID already
  if (/^[a-zA-Z0-9_-]+$/.test(input) && input.length > 10) {
    return input;
  }

  return undefined;
}

async function downloadLogosFromDrive(
  folderId: string,
  sponsorSlug: string,
): Promise<string[]> {
  if (!SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_KEY_BASE64) {
    console.log(
      `  Skipping Drive download for ${sponsorSlug} - no service account credentials`,
    );
    return [];
  }

  try {
    const privateKey = Buffer.from(
      SERVICE_ACCOUNT_KEY_BASE64,
      "base64",
    ).toString("utf-8");

    const auth = new google.auth.JWT(
      SERVICE_ACCOUNT_EMAIL,
      undefined,
      privateKey,
      ["https://www.googleapis.com/auth/drive.readonly"],
    );

    const drive = google.drive({ version: "v3", auth });

    // List files in the folder
    const listResponse = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType contains 'image/' or mimeType = 'image/svg+xml')`,
      fields: "files(id, name, mimeType)",
    });

    const files = listResponse.data.files || [];
    if (files.length === 0) {
      console.log(`  No logo files found in folder ${folderId}`);
      return [];
    }

    // Create sponsor logo directory
    const sponsorLogoDir = path.join(LOGOS_DIR, sponsorSlug);
    if (!fs.existsSync(sponsorLogoDir)) {
      fs.mkdirSync(sponsorLogoDir, { recursive: true });
    }

    const downloadedLogos: string[] = [];

    for (const file of files) {
      if (!file.id || !file.name) continue;

      const filePath = path.join(sponsorLogoDir, file.name);
      const publicPath = `/images/sponsors/${sponsorSlug}/${file.name}`;

      console.log(`  Downloading: ${file.name}`);

      const response = await drive.files.get(
        { fileId: file.id, alt: "media" },
        { responseType: "arraybuffer" },
      );

      fs.writeFileSync(filePath, Buffer.from(response.data as ArrayBuffer));
      downloadedLogos.push(publicPath);
    }

    return downloadedLogos;
  } catch (error) {
    console.error(`  Error downloading logos for ${sponsorSlug}:`, error);
    return [];
  }
}

function findExistingLogos(sponsorSlug: string): string[] {
  const logos: string[] = [];

  // Check for per-sponsor folder
  const sponsorDir = path.join(LOGOS_DIR, sponsorSlug);
  if (fs.existsSync(sponsorDir) && fs.statSync(sponsorDir).isDirectory()) {
    const files = fs.readdirSync(sponsorDir);
    for (const file of files) {
      if (/\.(svg|png|jpg|jpeg|webp)$/i.test(file)) {
        logos.push(`/images/sponsors/${sponsorSlug}/${file}`);
      }
    }
  }

  // Check for flat file (legacy format)
  const extensions = [".svg", ".png", ".jpg", ".jpeg", ".webp"];
  for (const ext of extensions) {
    const flatFile = path.join(LOGOS_DIR, `${sponsorSlug}${ext}`);
    if (fs.existsSync(flatFile)) {
      logos.push(`/images/sponsors/${sponsorSlug}${ext}`);
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
  const publishedRows = sheetRows.filter(
    (row) =>
      row.status.toLowerCase().includes("published") &&
      row.status.toLowerCase().includes("web"),
  );
  console.log(
    `Found ${publishedRows.length} sponsors with "published web" status\n`,
  );

  const sponsors: Sponsor[] = [];

  for (const row of publishedRows) {
    const slug = slugify(row.name);
    console.log(`Processing: ${row.name} (${slug})`);

    let availableLogos: string[] = [];

    // Try to download from Drive if folder ID provided
    if (row.logoFolderId) {
      availableLogos = await downloadLogosFromDrive(row.logoFolderId, slug);
    }

    // Fall back to existing local logos
    if (availableLogos.length === 0) {
      availableLogos = findExistingLogos(slug);
      if (availableLogos.length > 0) {
        console.log(`  Using ${availableLogos.length} existing local logo(s)`);
      } else {
        console.log(`  Warning: No logos found for ${row.name}`);
      }
    }

    // Pick primary logo (prefer SVG, then first available)
    const primaryLogo =
      availableLogos.find((l) => l.endsWith(".svg")) ||
      availableLogos[0] ||
      `/images/sponsors/${slug}.svg`;

    sponsors.push({
      slug,
      name: row.name,
      url: row.url || "#",
      sponsorshipLevel: row.sponsorshipLevel,
      logo: primaryLogo,
      availableLogos,
    });
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
