# Google Cloud Platform Setup Guide

This guide will help you set up your GCP project "Accelerate 26 Docs Automation"
for the sponsor sync automation.

## Step 1: Enable Required APIs

In the GCP Console, you need to enable:

### Required: Google Sheets API

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for **"Google Sheets API"**
3. Click on it and press **"Enable"**

### Optional: Google Drive API (only if downloading logos from Drive)

1. In **"APIs & Services"** → **"Library"**
2. Search for **"Google Drive API"**
3. Click on it and press **"Enable"**

## Step 2: Create API Key for Google Sheets

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"API key"**
4. Copy the generated API key (starts with `AIza...`)
5. **Important**: Click **"RESTRICT KEY"** to secure it:
   - Under **"API restrictions"**, select **"Restrict key"**
   - Check only **"Google Sheets API"**
   - Click **"Save"**

## Step 3: Create Service Account (Optional - for Drive logo downloads)

Only needed if you want to auto-download logos from Google Drive folders.

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"Service account"**
3. Fill in:
   - **Service account name**: `sponsor-sync` (or any name)
   - **Service account ID**: auto-generated
   - Click **"CREATE AND CONTINUE"**
4. Skip role assignment (click **"CONTINUE"**)
5. Click **"DONE"**
6. Click on the newly created service account
7. Go to the **"KEYS"** tab
8. Click **"ADD KEY"** → **"Create new key"**
9. Select **"JSON"** format
10. Download the JSON file (save it securely)

### Extract credentials from JSON:

The downloaded JSON file contains:

```json
{
  "client_email": "sponsor-sync@accelerate-26-docs-automation.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

## Step 4: Share Google Drive Folders (if using Drive)

If you're using Google Drive for logos:

1. Open the Google Drive folder containing sponsor logos
2. Click **"Share"**
3. Add the service account email (from the JSON file: `client_email`)
4. Give it **"Viewer"** access
5. Click **"Done"**

## Step 5: Configure Your Local Environment

Create `.env.local` in `/Users/karambit/Sites/solana-com/apps/accelerate/`:

```bash
# Required: Google Sheets API Key
GOOGLE_SHEETS_API_KEY=AIza...your_api_key_here

# Google Sheet configuration (already set)
GOOGLE_SHEET_ID=1gs7j3DRpHa-5X6soRMK9iVkS4Sbal005RSyIomvFm-A
GOOGLE_SHEET_NAME=Sponsors

# Optional: Service Account (only if downloading from Drive)
GOOGLE_SERVICE_ACCOUNT_EMAIL=sponsor-sync@accelerate-26-docs-automation.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64=LS0tLS1CRUdJTi...
```

### To base64 encode the private key:

```bash
# From the JSON file, copy the entire private_key value (including BEGIN/END lines)
# Then run:
echo -n '-----BEGIN PRIVATE KEY-----
...your key content...
-----END PRIVATE KEY-----' | base64
```

## Step 6: Make Google Sheet Public (Required)

The Google Sheet must be publicly viewable for API key access:

1. Open your Google Sheet:
   https://docs.google.com/spreadsheets/d/1gs7j3DRpHa-5X6soRMK9iVkS4Sbal005RSyIomvFm-A
2. Click **"Share"** (top right)
3. Click **"Change to anyone with the link"**
4. Set permission to **"Viewer"**
5. Click **"Done"**

## Step 7: Test the Setup

1. Navigate to the accelerate app:

   ```bash
   cd /Users/karambit/Sites/solana-com/apps/accelerate
   ```

2. Run the sync script:

   ```bash
   pnpm sync:sponsors
   ```

3. Check that `src/data/sponsors.json` was created/updated

## Troubleshooting

### "API key not valid" error

- Verify the API key is correct
- Check that Google Sheets API is enabled
- Ensure the sheet is shared publicly

### "Permission denied" for Drive

- Verify service account email has access to Drive folders
- Check that Google Drive API is enabled
- Ensure private key is correctly base64 encoded

### "No data found in sheet"

- Verify `GOOGLE_SHEET_ID` matches your sheet
- Check `GOOGLE_SHEET_NAME` matches the tab name exactly
- Ensure the sheet has data in the expected columns

## Quick Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [APIs & Services Dashboard](https://console.cloud.google.com/apis/dashboard)
- [Credentials Page](https://console.cloud.google.com/apis/credentials)
- [Google Sheets API Docs](https://developers.google.com/sheets/api)
