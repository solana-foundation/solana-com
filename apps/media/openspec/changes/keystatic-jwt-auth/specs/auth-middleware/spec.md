## ADDED Requirements

### Requirement: Protect Keystatic admin routes

The middleware SHALL check for a valid `keystatic_session` JWT cookie on all requests to `/keystatic` routes (except `/keystatic/login`). If the JWT is missing or invalid, the request SHALL be redirected to `/keystatic/login`.

#### Scenario: Authenticated user accesses Keystatic admin

- **WHEN** a request to `/keystatic` includes a valid, non-expired `keystatic_session` cookie
- **THEN** the request proceeds to the Keystatic admin UI

#### Scenario: Unauthenticated user accesses Keystatic admin

- **WHEN** a request to `/keystatic` does not include a valid `keystatic_session` cookie
- **THEN** the user is redirected to `/keystatic/login`

#### Scenario: Login page is accessible without auth

- **WHEN** a request is made to `/keystatic/login`
- **THEN** the request proceeds without auth checks

### Requirement: Protect Keystatic API routes

The system SHALL verify the `keystatic_session` JWT cookie on all requests to `/api/keystatic/*` routes. If the JWT is missing or invalid, the request SHALL return a 401 Unauthorized response.

#### Scenario: Authenticated API request

- **WHEN** a request to `/api/keystatic/...` includes a valid `keystatic_session` cookie
- **THEN** the request proceeds to the Keystatic route handler

#### Scenario: Unauthenticated API request

- **WHEN** a request to `/api/keystatic/...` does not include a valid `keystatic_session` cookie
- **THEN** the system returns a 401 Unauthorized JSON response

### Requirement: Auth API routes are public

The auth endpoints (`/api/auth/send-code`, `/api/auth/verify-code`, `/api/auth/logout`) SHALL be accessible without authentication.

#### Scenario: Unauthenticated user accesses auth endpoints

- **WHEN** a request is made to any `/api/auth/*` endpoint
- **THEN** the request proceeds without JWT verification

### Requirement: Environment variable configuration

The system SHALL require the following environment variables for auth to be enabled: `AUTH_JWT_SECRET`, `AUTH_ALLOWED_EMAILS`, `SENDGRID_API_KEY`, `AUTH_FROM_EMAIL`. If any are missing, the auth layer SHALL be disabled and Keystatic routes SHALL be accessible without authentication (development fallback).

#### Scenario: All auth env vars present

- **WHEN** all required auth environment variables are set
- **THEN** the JWT authentication layer is active for Keystatic routes

#### Scenario: Auth env vars missing

- **WHEN** any required auth environment variable is not set
- **THEN** the auth layer is disabled and Keystatic routes are accessible without authentication (equivalent to current local development behavior)
