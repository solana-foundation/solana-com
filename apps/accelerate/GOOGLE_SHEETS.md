---
name: Google Sheets to Sponsors Automation
overview:
  Automate sponsor data sync from Google Sheets to the Accelerate app by
  fetching sponsors with status "published web", downloading logos from Google
  Drive folders, and dynamically rendering them in the Sponsors component based
  on sponsorship level tiers.
todos:
  - id: install-deps
    content: Install googleapis and google-auth-library packages
    status: pending
  - id: env-setup
    content: Set up environment variables and .env.example template
    status: pending
  - id: create-sync-script
    content:
      Create sync-sponsors.ts script to fetch from Sheets and download from
      Drive
    status: pending
  - id: create-utilities
    content: Create sponsors.ts utility library for data access
    status: pending
  - id: create-types
    content: Create TypeScript type definitions for sponsor data
    status: pending
  - id: update-component
    content: Update Sponsors.tsx to use dynamic data instead of hardcoded array
    status: pending
  - id: add-scripts
    content: Add sync:sponsors script to package.json
    status: pending
  - id: test-sync
    content: Test sync script locally and verify logo downloads
    status: pending
  - id: test-component
    content: Test Sponsors component with dynamic data
    status: pending
isProject: false
---

# Google Sheets to Sponsors Automation Plan

## Overview

Create an automated workflow that:

1. Fetches sponsor data from Google Sheets (filtered by status = "published
   web")
2. Downloads logo images from Google Drive folders
3. Stores logos in `public/images/sponsors/[sponsor-name]/` folders
4. Dynamically renders sponsors in the `Sponsors` component based on sponsorship
   level tiers
5. Selects one random logo from each sponsor's folder for display

## Architecture

```
Google Sheets (API Key)
  ↓
Sync Script (pnpm script)
  ↓
Google Drive (Service Account)
  ↓
public/images/sponsors/[sponsor-name]/
  ↓
Sponsors Component (dynamic data)
```

## Implementation Steps

### 1. Install Dependencies

Add to `apps/accelerate/package.json`:

- `googleapis` - Google Sheets and Drive API client
- `google-auth-library` - Service account authentication
- `dotenv` - Environment variable management (dev only)

### 2. Environment Variables Setup

Add to `apps/accelerate/.env.local` (and Vercel):

- `GOOGLE_SHEETS_API_KEY` - API key for Google Sheets API
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` - Service account private key (base64 or
  raw)
- `GOOGLE_SHEET_ID` - Spreadsheet ID
  (`1gs7j3DRpHa-5X6soRMK9iVkS4Sbal005RSyIomvFm-A`)
- `GOOGLE_DRIVE_FOLDER_ID` - Base folder ID where logo folders are stored (if
  applicable)

### 3. Create Sync Script

**File**: `apps/accelerate/scripts/sync-sponsors.ts`

This script will:

- Connect to Google Sheets API using API key
- Read the spreadsheet and filter rows where `status` = "published web"
- Extract: sponsor name, sponsorship level, logo folder ID/path
- For each sponsor:
  - Connect to Google Drive API using service account
  - List all image files in the logo folder
  - Download all images to `public/images/sponsors/[sponsor-name]/`
  - Store metadata about available logos
- Generate a JSON file with sponsor data: `public/data/sponsors.json`

**Data Structure**:

```typescript
interface Sponsor {
  name: string;
  url: string;
  sponsorshipLevel: string; // Maps to tier names
  logoFolder: string; // Folder name/path
  logos: string[]; // Array of logo file paths
  selectedLogo: string; // Randomly selected logo
}
```

### 4. Create Sponsor Data Utilities

**File**: `apps/accelerate/src/lib/sponsors.ts`

Utility functions:

- `getSponsors()` - Read and parse `public/data/sponsors.json`
- `getSponsorsByTier(tier: string)` - Filter sponsors by sponsorship level
- `mapSponsorshipLevelToTier(level: string)` - Map spreadsheet levels to
  component tier names

**Tier Mapping**:

- Spreadsheet levels → Component tiers:
  - "Headline" → "HEADLINE SPONSORS"
  - "Signature" → "SIGNATURE SPONSORS"
  - "Premium" → "PREMIUM SPONSORS"
  - (Add other mappings as needed)

### 5. Update Sponsors Component

**File**: `apps/accelerate/src/components/Sponsors.tsx`

Changes:

- Remove hardcoded `sponsorTiers` array
- Import `getSponsorsByTier()` from `src/lib/sponsors.ts`
- Fetch sponsor data at component level (or use server component)
- Group sponsors by tier dynamically
- Update `SponsorLogo` to use the selected logo path
- Handle loading/error states

**Considerations**:

- Since component uses `"use client"` and Framer Motion, we can:
  - Option A: Fetch data in a server component wrapper, pass as props
  - Option B: Fetch data client-side with `useEffect` (less ideal)
  - Option C: Use Next.js `fetch` with caching in a server component parent

### 6. Add Package.json Scripts

**File**: `apps/accelerate/package.json`

Add scripts:

```json
{
  "scripts": {
    "sync:sponsors": "tsx scripts/sync-sponsors.ts",
    "build": "pnpm sync:sponsors && next build"
  }
}
```

Note: Consider making sync optional in build (or run manually) to avoid API rate
limits.

### 7. Handle Image Selection Logic

In the sync script:

- When multiple images exist in a folder, randomly select one for `selectedLogo`
- Store all images in the folder for potential rotation/future use
- Prefer SVG files, then PNG, then other formats
- Validate image files before downloading

### 8. Error Handling & Logging

- Handle API rate limits gracefully
- Log sync progress and errors
- Validate spreadsheet column names
- Handle missing logo folders gracefully
- Create fallback for missing sponsors data

### 9. Type Definitions

**File**: `apps/accelerate/src/types/sponsors.ts`

Define TypeScript interfaces:

- `Sponsor` (matches JSON structure)
- `SponsorTier`
- `SponsorData` (full data structure)

## Files to Create/Modify

### New Files:

1. `apps/accelerate/scripts/sync-sponsors.ts` - Main sync script
2. `apps/accelerate/src/lib/sponsors.ts` - Sponsor data utilities
3. `apps/accelerate/src/types/sponsors.ts` - TypeScript types
4. `apps/accelerate/.env.example` - Environment variable template
5. `apps/accelerate/public/data/sponsors.json` - Generated sponsor data
   (gitignored or committed)

### Modified Files:

1. `apps/accelerate/package.json` - Add dependencies and scripts
2. `apps/accelerate/src/components/Sponsors.tsx` - Make dynamic
3. `apps/accelerate/.gitignore` - Add `.env.local` and potentially
   `public/data/sponsors.json` if regenerated

## Google API Setup Requirements

### Google Sheets API:

1. Enable Google Sheets API in Google Cloud Console
2. Create API key (restrict to Sheets API)
3. Make spreadsheet publicly viewable OR share with service account

### Google Drive API:

1. Enable Google Drive API in Google Cloud Console
2. Create Service Account:
   - Download JSON key file
   - Extract email and private key
   - Share logo folders with service account email (viewer permission)

3. Store credentials securely (environment variables)

## Testing Strategy

1. **Local Testing**:
   - Run `pnpm sync:sponsors` manually
   - Verify logos download correctly
   - Check `sponsors.json` structure
   - Test component rendering

2. **Build Testing**:
   - Run full build with sync script
   - Verify static generation works
   - Check image optimization

3. **Error Scenarios**:
   - Missing API keys
   - Invalid spreadsheet ID
   - Empty logo folders
   - Network failures

## Deployment Considerations

- **Vercel Build**: Add sync script to build process (or run as separate step)
- **Environment Variables**: Set in Vercel dashboard
- **Service Account Key**: Store as environment variable (base64 encoded or use
  Vercel secrets)
- **Rate Limits**: Consider caching or running sync less frequently
- **Build Time**: Sync may add time to builds; consider async/background sync

## Future Enhancements

- Webhook integration for real-time updates
- Image optimization during sync
- Support for multiple logo variants (light/dark mode)
- Admin UI for manual logo selection
- Automated testing of sync script
