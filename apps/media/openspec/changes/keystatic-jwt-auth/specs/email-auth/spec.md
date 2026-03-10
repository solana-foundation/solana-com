## ADDED Requirements

### Requirement: Email allowlist validation

The system SHALL validate that the submitted email address exists in the `AUTH_ALLOWED_EMAILS` environment variable (a comma-separated list of email addresses) before sending a login code. Email comparison SHALL be case-insensitive.

#### Scenario: Allowed email requests login code

- **WHEN** a user submits an email that exists in `AUTH_ALLOWED_EMAILS`
- **THEN** the system sends a 6-digit numeric login code to that email via SendGrid and returns a success response

#### Scenario: Disallowed email requests login code

- **WHEN** a user submits an email that does not exist in `AUTH_ALLOWED_EMAILS`
- **THEN** the system returns a generic success response (to prevent email enumeration) and does NOT send any email

### Requirement: Login code generation and delivery

The system SHALL generate a cryptographically random 6-digit numeric code and send it to the user's email via the SendGrid v3 API using `AUTH_FROM_EMAIL` as the sender address.

#### Scenario: Code is sent via SendGrid

- **WHEN** a valid allowlisted email is submitted to `POST /api/auth/send-code`
- **THEN** the system sends an email containing the 6-digit code with a clear subject line (e.g., "Your Solana Media login code")

#### Scenario: Verification token is set

- **WHEN** a login code is generated
- **THEN** the system sets an HTTP-only cookie `keystatic_verify` containing an HMAC-signed hash of the email, code, and expiry timestamp (10 minutes from now)

### Requirement: Login code verification

The system SHALL verify the submitted code against the signed verification token in the `keystatic_verify` cookie. The code MUST match and MUST not be expired.

#### Scenario: Correct code submitted within expiry

- **WHEN** a user submits the correct 6-digit code to `POST /api/auth/verify-code` within 10 minutes
- **THEN** the system issues a JWT in an HTTP-only cookie `keystatic_session` (7-day expiry, Secure, SameSite=Lax), clears the `keystatic_verify` cookie, and returns a success response

#### Scenario: Incorrect code submitted

- **WHEN** a user submits an incorrect code to `POST /api/auth/verify-code`
- **THEN** the system returns an error response indicating the code is invalid

#### Scenario: Expired code submitted

- **WHEN** a user submits a code after the 10-minute expiry window
- **THEN** the system returns an error response indicating the code has expired and the user must request a new one

### Requirement: JWT session token

The system SHALL issue a JWT signed with `AUTH_JWT_SECRET` containing the user's email and an expiry of 7 days. The JWT SHALL be stored in an HTTP-only, Secure, SameSite=Lax cookie named `keystatic_session`.

#### Scenario: JWT contains required claims

- **WHEN** a JWT is issued after successful code verification
- **THEN** the JWT payload SHALL include `sub` (email), `iat` (issued at), and `exp` (7 days from issued at)

### Requirement: Logout

The system SHALL provide a logout endpoint at `POST /api/auth/logout` that clears the `keystatic_session` cookie.

#### Scenario: User logs out

- **WHEN** an authenticated user sends a POST request to `/api/auth/logout`
- **THEN** the `keystatic_session` cookie is cleared and the user is redirected to the login page

### Requirement: Login page UI

The system SHALL provide a login page at `/keystatic/login` with a two-step flow: (1) enter email address, (2) enter the 6-digit code received via email.

#### Scenario: User enters email

- **WHEN** a user navigates to `/keystatic/login` and submits their email address
- **THEN** the system calls `POST /api/auth/send-code` and transitions to the code entry step

#### Scenario: User enters code

- **WHEN** a user enters the 6-digit code on the login page
- **THEN** the system calls `POST /api/auth/verify-code` and on success redirects to `/keystatic`

#### Scenario: User sees error feedback

- **WHEN** the code verification fails
- **THEN** the login page displays an error message to the user
