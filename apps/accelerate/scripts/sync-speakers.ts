/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Configuration from environment
const SHEET_ID = process.env.GOOGLE_SHEET_ID_SPEAKERS;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME_SPEAKERS;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SERVICE_ACCOUNT_KEY_BASE64 =
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64;

// Paths
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "src", "data");
const SPEAKERS_JSON = path.join(DATA_DIR, "speakers.json");
const IMAGES_DIR = path.join(ROOT_DIR, "public", "images", "speakers");

interface SheetRow {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  photoResource?: { type: "folder" | "file"; id: string };
}

interface Speaker {
  slug: string;
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  image: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    return { firstName: parts[0] || "", lastName: "" };
  }

  // Last part is last name, everything else is first name
  const lastName = parts[parts.length - 1] || "";
  const firstName = parts.slice(0, -1).join(" ");

  return { firstName, lastName };
}

function extractDriveResource(input: string):
  | {
      type: "folder" | "file";
      id: string;
    }
  | undefined {
  if (!input) return undefined;

  const trimmed = input.trim();

  // Check for direct file link patterns:
  // - https://drive.google.com/file/d/FILE_ID/view
  // - https://drive.google.com/file/d/FILE_ID
  // - drive.google.com/file/d/FILE_ID
  const fileMatch = trimmed.match(/[\/]file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) {
    return { type: "file", id: fileMatch[1] };
  }

  // Check for folder link: https://drive.google.com/drive/folders/FOLDER_ID
  const folderMatch = trimmed.match(/[\/]folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch?.[1]) {
    return { type: "folder", id: folderMatch[1] };
  }

  // Check for drive.google.com/open?id= format (common file sharing link)
  // This format is used for files, not folders
  const openIdMatch = trimmed.match(
    /drive\.google\.com\/open[?&]id=([a-zA-Z0-9_-]+)/,
  );
  if (openIdMatch?.[1] && openIdMatch[1].length >= 20) {
    return { type: "file", id: openIdMatch[1] };
  }

  // Try to extract ID from any Google Drive link format with id= parameter
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch?.[1] && idMatch[1].length >= 20) {
    // If the URL contains /file/, /view, or /open, it's likely a file
    if (
      trimmed.includes("/file/") ||
      trimmed.includes("/view") ||
      trimmed.includes("/open")
    ) {
      return { type: "file", id: idMatch[1] };
    }
    // If it contains /folders/, it's a folder
    if (trimmed.includes("/folders/")) {
      return { type: "folder", id: idMatch[1] };
    }
    // Default to file since user confirmed these are file links
    return { type: "file", id: idMatch[1] };
  }

  // If it looks like an ID already (alphanumeric with dashes/underscores, at least 20 chars for Drive IDs)
  // Since the user confirmed these are file links, default to file
  if (/^[a-zA-Z0-9_-]+$/.test(trimmed) && trimmed.length >= 20) {
    // Default to file since the user indicated these are file links
    return { type: "file", id: trimmed };
  }

  // Last resort: if it contains "file" anywhere, assume it's a file
  if (trimmed.toLowerCase().includes("file")) {
    const idMatch = trimmed.match(/([a-zA-Z0-9_-]{20,})/);
    if (idMatch?.[1]) {
      return { type: "file", id: idMatch[1] };
    }
  }

  return undefined;
}

async function getDriveAuth() {
  if (!SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_KEY_BASE64) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64 are required for downloading images from Google Drive. Set them in .env.local or .env.",
    );
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
      [
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/spreadsheets.readonly",
      ],
    );

    return auth;
  } catch (error) {
    throw new Error(
      `Failed to initialize service account auth: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function listFilesInFolder(drive: any, folderId: string): Promise<any[]> {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType, size)",
    });

    return response.data.files || [];
  } catch (error: any) {
    if (error.code === 404) {
      throw new Error(`Folder not found: ${folderId}`);
    }
    if (error.code === 403) {
      throw new Error(
        `Permission denied: The service account (${SERVICE_ACCOUNT_EMAIL || "unknown"}) does not have access to folder ${folderId}. Please share the folder with the service account.`,
      );
    }
    throw error;
  }
}

function isImageFile(file: any): boolean {
  const imageMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];
  return imageMimeTypes.includes(file.mimeType?.toLowerCase() || "");
}

function getImageExtension(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
  };
  return mimeMap[mimeType.toLowerCase()] || "png";
}

function preferImageFormat(files: any[]): any | null {
  // Prefer PNG, then JPG, then WebP, then SVG, then any other image
  const priority = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/svg+xml",
  ];

  for (const mimeType of priority) {
    const file = files.find((f) => f.mimeType?.toLowerCase() === mimeType);
    if (file) return file;
  }

  // Return first image if no priority match
  return files.find(isImageFile) || null;
}

async function downloadFile(
  drive: any,
  fileId: string,
  outputPath: string,
  mimeType: string,
): Promise<void> {
  try {
    // According to Google Drive API docs: use files.get with alt=media for blob file downloads
    // The alt=media parameter tells the server that a download of content is being requested
    const response = await drive.files.get(
      {
        fileId,
        alt: "media",
      },
      { responseType: "stream" },
    );

    return new Promise((resolve, reject) => {
      const dest = fs.createWriteStream(outputPath);

      // Handle stream errors
      response.data.on("error", (error: Error) => {
        // Try to clean up the partial file
        try {
          if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
          }
        } catch {
          // Ignore cleanup errors
        }
        reject(new Error(`Stream error for file ${fileId}: ${error.message}`));
      });

      dest.on("error", (error: Error) => {
        // Try to clean up the partial file
        try {
          if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
          }
        } catch {
          // Ignore cleanup errors
        }
        reject(new Error(`Write error for file ${fileId}: ${error.message}`));
      });

      dest.on("finish", () => {
        console.log(`  ✓ Downloaded: ${path.basename(outputPath)}`);
        resolve();
      });

      // Pipe the response stream to the file
      response.data.pipe(dest);
    });
  } catch (error: any) {
    // Clean up on error
    try {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    } catch {
      // Ignore cleanup errors
    }

    if (error.code === 403) {
      throw new Error(
        `Permission denied: The service account does not have access to download file ${fileId}. Please share the file with the service account.`,
      );
    }
    if (error.code === 404) {
      throw new Error(
        `File not found: ${fileId}. The file may have been deleted or the ID is incorrect.`,
      );
    }
    throw new Error(
      `Failed to download file ${fileId}: ${error.message || String(error)}`,
    );
  }
}

async function tryFolderDownload(
  drive: any,
  folderId: string,
  speakerSlug: string,
): Promise<string | null> {
  try {
    const files = await listFilesInFolder(drive, folderId);
    const imageFiles = files.filter(isImageFile);

    if (imageFiles.length === 0) {
      console.log(`  ⚠ No image files found in folder`);
      return null;
    }

    console.log(`  Found ${imageFiles.length} image file(s)`);

    // Prefer PNG, then JPG, then WebP, then SVG
    const fileToDownload = preferImageFormat(imageFiles);

    if (!fileToDownload) {
      console.log(`  ⚠ No suitable image file found`);
      return null;
    }

    const extension = getImageExtension(fileToDownload.mimeType);
    const filename = `${speakerSlug}.${extension}`;
    const outputPath = path.join(IMAGES_DIR, filename);

    // Ensure images directory exists
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    await downloadFile(
      drive,
      fileToDownload.id,
      outputPath,
      fileToDownload.mimeType,
    );
    return `/images/speakers/${filename}`;
  } catch (error) {
    console.error(
      `  ✗ Failed to list folder: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

async function getFileMetadata(drive: any, fileId: string): Promise<any> {
  try {
    // Get file metadata (not content) - don't use alt=media here
    const response = await drive.files.get({
      fileId,
      fields: "id, name, mimeType, size, capabilities",
    });
    return response.data;
  } catch (error: any) {
    if (error.code === 404) {
      throw new Error(
        `File not found: ${fileId}. The file may have been deleted or the ID is incorrect.`,
      );
    }
    if (error.code === 403) {
      throw new Error(
        `Permission denied: The service account (${SERVICE_ACCOUNT_EMAIL || "unknown"}) does not have access to file ${fileId}. Please share the file with the service account.`,
      );
    }
    throw error;
  }
}

async function downloadSpeakerImage(
  drive: any,
  resource: { type: "folder" | "file"; id: string },
  speakerSlug: string,
): Promise<string | null> {
  let fileToDownload: any;

  // Always try as file first (since user confirmed these are file links)
  // Even if identified as folder, try file first in case of misidentification
  console.log(`  Attempting to access as file: ${resource.id}`);
  try {
    const fileMetadata = await getFileMetadata(drive, resource.id);

    // Check if file can be downloaded (per Google Drive API docs recommendation)
    if (
      fileMetadata.capabilities &&
      fileMetadata.capabilities.canDownload === false
    ) {
      console.log(
        `  ⚠ File cannot be downloaded (download restricted by owner)`,
      );
      return null;
    }

    if (!isImageFile(fileMetadata)) {
      console.log(
        `  ⚠ File is not an image (mimeType: ${fileMetadata.mimeType})`,
      );
      // If it's not an image but was identified as folder, try folder listing
      if (resource.type === "folder") {
        console.log(`  Trying as folder instead...`);
        return await tryFolderDownload(drive, resource.id, speakerSlug);
      }
      return null;
    }

    fileToDownload = fileMetadata;
    console.log(`  ✓ Found image file: ${fileMetadata.name || resource.id}`);

    // Download the file
    const extension = getImageExtension(fileToDownload.mimeType);
    const filename = `${speakerSlug}.${extension}`;
    const outputPath = path.join(IMAGES_DIR, filename);

    // Ensure images directory exists
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    try {
      await downloadFile(
        drive,
        fileToDownload.id,
        outputPath,
        fileToDownload.mimeType,
      );
      return `/images/speakers/${filename}`;
    } catch (error) {
      console.error(
        `  ✗ Failed to download file: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  } catch (fileError: any) {
    // If file access fails, and it was identified as a folder, try folder listing
    if (resource.type === "folder") {
      console.log(
        `  File access failed (${fileError?.code || fileError?.message || "unknown error"}), trying as folder...`,
      );
      return await tryFolderDownload(drive, resource.id, speakerSlug);
    }
    // If it was identified as a file but access failed, show the error
    console.error(
      `  ✗ Failed to access file: ${fileError?.code || fileError?.message || String(fileError)}`,
    );
    if (fileError?.code === 403) {
      console.error(
        `  💡 Tip: Make sure the file is shared with the service account: ${SERVICE_ACCOUNT_EMAIL || "your-service-account@..."}`,
      );
    } else if (fileError?.code === 404) {
      console.error(
        `  💡 Tip: The file ID might be incorrect or the file may have been deleted.`,
      );
    }
    return null;
  }
}

async function fetchSheetData(): Promise<SheetRow[]> {
  if (!SHEET_ID || !SHEET_NAME) {
    throw new Error(
      "GOOGLE_SHEET_ID_SPEAKERS and GOOGLE_SHEET_NAME_SPEAKERS are required. Set them in .env.local or .env.",
    );
  }

  // Use service account authentication if available, otherwise fall back to API key
  let auth;
  let authMethod: "service_account" | "api_key" = "api_key";

  if (SERVICE_ACCOUNT_EMAIL && SERVICE_ACCOUNT_KEY_BASE64) {
    try {
      const privateKey = Buffer.from(
        SERVICE_ACCOUNT_KEY_BASE64,
        "base64",
      ).toString("utf-8");

      auth = new google.auth.JWT(
        SERVICE_ACCOUNT_EMAIL!,
        undefined,
        privateKey,
        [
          "https://www.googleapis.com/auth/spreadsheets.readonly",
          "https://www.googleapis.com/auth/drive.readonly",
        ],
      );
      authMethod = "service_account";
      console.log(
        `Using service account authentication: ${SERVICE_ACCOUNT_EMAIL!}`,
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

      // Find column indices - matching actual sheet headers
      const firstNameIdx = headers.findIndex(
        (h: string) =>
          h === "first name" || h === "firstname" || h.includes("first name"),
      );
      const lastNameIdx = headers.findIndex(
        (h: string) =>
          h === "last name" || h === "lastname" || h.includes("last name"),
      );
      // Fallback: look for combined name column
      const nameIdx = headers.findIndex(
        (h: string) =>
          h === "name" || h === "full name" || h.includes("what is your name"),
      );
      const titleIdx = headers.findIndex(
        (h: string) =>
          h === "title" ||
          h === "job title" ||
          h.includes("title") ||
          h.includes("position"),
      );
      const companyIdx = headers.findIndex(
        (h: string) =>
          h === "company" ||
          h === "organization" ||
          h.includes("company") ||
          h.includes("organization"),
      );
      const photoIdx = headers.findIndex(
        (h: string) =>
          h.includes("please upload a photo of yourself") ||
          h.includes("upload a photo") ||
          h.includes("photo") ||
          h.includes("picture") ||
          h.includes("image"),
      );

      console.log("Column mapping:", {
        firstNameIdx,
        lastNameIdx,
        nameIdx,
        titleIdx,
        companyIdx,
        photoIdx,
      });
      console.log("Headers found:", headers);

      if (firstNameIdx === -1 && lastNameIdx === -1 && nameIdx === -1) {
        throw new Error(
          "Could not find 'first name', 'last name', or 'name' column in sheet",
        );
      }

      const speakers: SheetRow[] = [];

      for (const row of dataRows) {
        // Get first name and last name from separate columns or combined
        let firstName = "";
        let lastName = "";
        let fullName = "";

        if (firstNameIdx !== -1 && lastNameIdx !== -1) {
          // Use separate first name and last name columns
          firstName = row[firstNameIdx]?.trim() || "";
          lastName = row[lastNameIdx]?.trim() || "";
          fullName = `${firstName} ${lastName}`.trim();
        } else if (nameIdx !== -1) {
          // Fallback: use combined name column and split it
          fullName = row[nameIdx]?.trim() || "";
          const split = splitName(fullName);
          firstName = split.firstName;
          lastName = split.lastName;
        }

        if (!fullName && !firstName && !lastName) continue;

        const title = titleIdx !== -1 ? row[titleIdx]?.trim() || "" : "";
        const company = companyIdx !== -1 ? row[companyIdx]?.trim() || "" : "";
        const photoFolderRaw =
          photoIdx !== -1 ? row[photoIdx]?.trim() || "" : "";
        const photoResource = extractDriveResource(photoFolderRaw);

        // Ensure we have a valid name
        const speakerName =
          fullName || `${firstName} ${lastName}`.trim() || "Unknown";
        if (!speakerName || speakerName === "Unknown") continue;

        // Debug logging for first few rows
        if (speakers.length < 3 && photoFolderRaw) {
          console.log(
            `  Debug: ${speakerName} - Raw photo value: "${photoFolderRaw}", Extracted: ${photoResource ? `${photoResource.type}:${photoResource.id}` : "none"}`,
          );
        }

        speakers.push({
          name: speakerName,
          firstName,
          lastName,
          title,
          company,
          photoResource,
        });
      }

      return speakers;
    } catch (error: any) {
      if (error?.message === "PERMISSION_DENIED" || error?.code === 403) {
        throw new Error(
          `\n❌ Permission denied: The Google Sheet is not publicly readable.\n\n` +
            `To fix this, choose one of the following:\n` +
            `Option 1 (Recommended): Share with service account\n` +
            `  1. Open the Google Sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}\n` +
            `  2. Click "Share" button\n` +
            `  3. Add this email with "Viewer" permission: ${SERVICE_ACCOUNT_EMAIL || "your-service-account@..."}\n` +
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
      (name) => name?.toLowerCase() === SHEET_NAME?.toLowerCase(),
    );

    if (!matchingSheet) {
      throw new Error(
        `Sheet tab "${SHEET_NAME}" not found. Available tabs: ${availableSheets.join(", ")}\n` +
          `Please check GOOGLE_SHEET_NAME_SPEAKERS in your .env file.`,
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

    // Find column indices - matching actual sheet headers
    const firstNameIdx = headers.findIndex(
      (h: string) =>
        h === "first name" || h === "firstname" || h.includes("first name"),
    );
    const lastNameIdx = headers.findIndex(
      (h: string) =>
        h === "last name" || h === "lastname" || h.includes("last name"),
    );
    // Fallback: look for combined name column
    const nameIdx = headers.findIndex(
      (h: string) =>
        h === "name" || h === "full name" || h.includes("what is your name"),
    );
    const titleIdx = headers.findIndex(
      (h: string) =>
        h === "title" ||
        h === "job title" ||
        h.includes("title") ||
        h.includes("position"),
    );
    const companyIdx = headers.findIndex(
      (h: string) =>
        h === "company" ||
        h === "organization" ||
        h.includes("company") ||
        h.includes("organization"),
    );
    const photoIdx = headers.findIndex(
      (h: string) =>
        h.includes("please upload a photo of yourself") ||
        h.includes("upload a photo") ||
        h.includes("photo") ||
        h.includes("picture") ||
        h.includes("image"),
    );

    console.log("Column mapping:", {
      firstNameIdx,
      lastNameIdx,
      nameIdx,
      titleIdx,
      companyIdx,
      photoIdx,
    });
    console.log("Headers found:", headers);

    if (firstNameIdx === -1 && lastNameIdx === -1 && nameIdx === -1) {
      throw new Error(
        "Could not find 'first name', 'last name', or 'name' column in sheet",
      );
    }

    const speakers: SheetRow[] = [];

    for (const row of dataRows) {
      // Get first name and last name from separate columns or combined
      let firstName = "";
      let lastName = "";
      let fullName = "";

      if (firstNameIdx !== -1 && lastNameIdx !== -1) {
        // Use separate first name and last name columns
        firstName = row[firstNameIdx]?.trim() || "";
        lastName = row[lastNameIdx]?.trim() || "";
        fullName = `${firstName} ${lastName}`.trim();
      } else if (nameIdx !== -1) {
        // Fallback: use combined name column and split it
        fullName = row[nameIdx]?.trim() || "";
        const split = splitName(fullName);
        firstName = split.firstName;
        lastName = split.lastName;
      }

      if (!fullName && !firstName && !lastName) continue;

      const title = titleIdx !== -1 ? row[titleIdx]?.trim() || "" : "";
      const company = companyIdx !== -1 ? row[companyIdx]?.trim() || "" : "";
      const photoFolderRaw = photoIdx !== -1 ? row[photoIdx]?.trim() || "" : "";
      const photoResource = extractDriveResource(photoFolderRaw);

      // Ensure we have a valid name
      const speakerName =
        fullName || `${firstName} ${lastName}`.trim() || "Unknown";
      if (!speakerName || speakerName === "Unknown") continue;

      // Debug logging for first few rows
      if (speakers.length < 3 && photoFolderRaw) {
        console.log(
          `  Debug: ${speakerName} - Raw photo value: "${photoFolderRaw}", Extracted: ${photoResource ? `${photoResource.type}:${photoResource.id}` : "none"}`,
        );
      }

      speakers.push({
        name: speakerName,
        firstName,
        lastName,
        title,
        company,
        photoResource,
      });
    }

    return speakers;
  } catch (error: any) {
    if (error?.code === 403 || error?.status === 403) {
      const errorMessage =
        authMethod === "service_account"
          ? `\n❌ Permission denied: The service account (${SERVICE_ACCOUNT_EMAIL || "unknown"}) does not have access to the Google Sheet.\n\n` +
            `To fix this:\n` +
            `1. Open the Google Sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}\n` +
            `2. Click "Share" button\n` +
            `3. Add this email with "Viewer" permission: ${SERVICE_ACCOUNT_EMAIL || "your-service-account@..."}\n` +
            `4. Run the script again\n`
          : `\n❌ Permission denied: The Google Sheet is not publicly readable.\n\n` +
            `To fix this, choose one of the following:\n` +
            `Option 1 (Recommended): Share with service account\n` +
            `  1. Open the Google Sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}\n` +
            `  2. Click "Share" button\n` +
            `  3. Add this email with "Viewer" permission: ${SERVICE_ACCOUNT_EMAIL || "your-service-account@..."}\n` +
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

async function syncSpeakers() {
  console.log("Starting speaker sync...\n");

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Ensure images directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // Fetch sheet data
  const sheetRows = await fetchSheetData();
  console.log(`\nFound ${sheetRows.length} total rows in sheet\n`);

  // Filter for rows with names (all rows are valid speakers)
  const validRows = sheetRows.filter((row) => row.name && row.name.trim());
  console.log(`Found ${validRows.length} speakers with names\n`);

  // Get Drive auth for downloading images
  let drive: any = null;
  try {
    const driveAuth = await getDriveAuth();
    drive = google.drive({ version: "v3", auth: driveAuth });
    console.log("Drive API initialized for image downloads\n");
  } catch (error) {
    console.warn(
      `⚠ Warning: Could not initialize Drive API. Images will not be downloaded.\n` +
        `Error: ${error instanceof Error ? error.message : String(error)}\n`,
    );
  }

  const speakers: Speaker[] = [];
  const processedSlugs = new Set<string>();

  for (const row of validRows) {
    const slug = slugify(row.name);

    // Skip if we've already processed this slug
    if (processedSlugs.has(slug)) {
      console.log(`Skipping duplicate: ${row.name} (${slug})`);
      continue;
    }

    processedSlugs.add(slug);
    console.log(`Processing: ${row.name} (${slug})`);

    let imagePath: string | null = null;

    // Download image from Google Drive if photo resource is provided
    if (row.photoResource && drive) {
      try {
        imagePath = await downloadSpeakerImage(drive, row.photoResource, slug);
        if (!imagePath) {
          console.log(`  ⚠ No image downloaded, will use fallback`);
        }
      } catch (error) {
        console.error(
          `  ✗ Failed to download image: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    } else if (row.photoResource && !drive) {
      console.log(`  ⚠ Photo resource provided but Drive API not available`);
    } else {
      console.log(`  ⚠ No photo resource provided`);
    }

    // Check for existing local image as fallback
    if (!imagePath) {
      const existingExtensions = ["png", "jpg", "jpeg", "webp", "svg"];
      for (const ext of existingExtensions) {
        const existingPath = path.join(IMAGES_DIR, `${slug}.${ext}`);
        if (fs.existsSync(existingPath)) {
          imagePath = `/images/speakers/${slug}.${ext}`;
          console.log(`  Using existing local image: ${imagePath}`);
          break;
        }
      }
    }

    // Final fallback
    if (!imagePath) {
      imagePath = `/images/speakers/${slug}.png`; // Default path, may not exist
      console.log(`  ⚠ No image found, using default path: ${imagePath}`);
    }

    speakers.push({
      slug,
      name: row.name,
      firstName: row.firstName.toUpperCase(),
      lastName: row.lastName.toUpperCase(),
      title: row.title,
      company: row.company,
      image: imagePath,
    });
  }

  // Write JSON file
  const data = {
    syncedAt: new Date().toISOString(),
    speakers,
  };

  fs.writeFileSync(SPEAKERS_JSON, JSON.stringify(data, null, 2));
  console.log(`\n✓ Wrote ${speakers.length} speakers to ${SPEAKERS_JSON}`);

  // Summary
  const withImages = speakers.filter((s) => {
    const imagePath = path.join(ROOT_DIR, "public", s.image);
    return fs.existsSync(imagePath);
  });

  console.log(`\nSummary:`);
  console.log(`  Total speakers: ${speakers.length}`);
  console.log(`  Speakers with images: ${withImages.length}`);
  console.log(
    `  Speakers without images: ${speakers.length - withImages.length}`,
  );

  if (speakers.length - withImages.length > 0) {
    console.log(`\n⚠ Note: Some speakers are missing images.`);
    console.log(`  To fix this:`);
    console.log(`  1. Open each speaker's photo file in Google Drive`);
    console.log(`  2. Click "Share" and add the service account email:`);
    console.log(`     ${SERVICE_ACCOUNT_EMAIL || "your-service-account@..."}`);
    console.log(`  3. Give it "Viewer" permission`);
    console.log(`  4. Run the sync again`);
  }

  console.log("\n✓ Sync complete!");
}

// Run the sync
syncSpeakers().catch((error) => {
  console.error("Sync failed:", error);
  process.exit(1);
});
