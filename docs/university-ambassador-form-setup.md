# University Ambassador application setup

The `/university` form submits to the same-origin Next.js route
`/api/university-ambassador`. The route validates the payload, exchanges the
short-lived Vercel production OIDC identity for a Google access token, and
appends the response to this spreadsheet:

<https://docs.google.com/spreadsheets/d/1wnEyO7xr_X1QrLmAKiZ9uswMmTlnhaNIAuHQ_f34Wyo/edit?gid=0#gid=0>

There is no Apps Script deployment in this setup. The spreadsheet is accessed
directly through the Google Sheets API.

## One-time Google setup

Share the spreadsheet with this Google service account as **Editor**:

```text
university-form-writer@solana-com-university-form.iam.gserviceaccount.com
```

The service account only has the Sheets API scope and is granted access to the
spreadsheet itself. Google Sheets sharing applies to the whole spreadsheet, so
use a dedicated spreadsheet if other tabs contain data that should not be
available to this writer.

The GCP resources are already provisioned in project
`solana-com-university-form`:

- Workload Identity Pool: `vercel`
- OIDC provider: `vercel-team`
- Provider issuer: `https://oidc.vercel.com/solana-foundation`
- Provider audience: `https://vercel.com/solana-foundation`
- Provider restriction: production deployments of the `solana-com` Vercel
  project only

Do not create or download a service-account key. Authentication uses short-lived
tokens from Vercel and service-account impersonation through Workload Identity
Federation.

## Doppler configuration

Doppler is the source of truth for the deployed variables. The production
configuration for the `solana-com` Doppler project is named `prd`.

From the repository root, the values can be set or updated with:

```bash
doppler secrets set \
  --project solana-com \
  --config prd \
  GCP_PROJECT_NUMBER=30966129316 \
  GCP_WORKLOAD_IDENTITY_POOL_ID=vercel \
  GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID=vercel-team \
  GCP_SERVICE_ACCOUNT_EMAIL=university-form-writer@solana-com-university-form.iam.gserviceaccount.com \
  UNIVERSITY_AMBASSADOR_GOOGLE_SHEET_ID=1wnEyO7xr_X1QrLmAKiZ9uswMmTlnhaNIAuHQ_f34Wyo \
  UNIVERSITY_AMBASSADOR_GOOGLE_SHEET_RANGE=A:O
```

The existing Doppler-to-Vercel integration syncs these values into the
production `solana-com` project. Redeploy the app after the sync so the new
route is running with the updated configuration.

## Local development

Local development intentionally does not use the production-only Vercel OIDC
provider. Authenticate Application Default Credentials with the Google account
that can edit the spreadsheet:

```bash
gcloud auth application-default login \
  --scopes=https://www.googleapis.com/auth/spreadsheets
```

Then start the app with the Doppler values available, for example:

```bash
doppler run --project solana-com --config prd -- pnpm dev:web
```

Production continues to use Vercel OIDC and Workload Identity Federation. Do not
broaden the production provider’s attribute condition just to make local
development work.

## Test

Submit a test application at `/university` with two reachable `http` or `https`
video links. A successful submission shows a confirmation message and adds one
row to the first tab of the spreadsheet. The route initializes the header row if
the first row is empty. Delete the test row afterward if needed.

Preview deployments are intentionally not authorized by the GCP provider. This
prevents non-production Vercel deployments from writing to the production
application spreadsheet.
