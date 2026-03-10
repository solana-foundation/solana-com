export function getAuthConfig() {
  return {
    jwtSecret: process.env.AUTH_JWT_SECRET || "",
    allowedEmails: process.env.AUTH_ALLOWED_EMAILS || "",
    sendgridApiKey: process.env.SENDGRID_API_KEY || "",
    fromEmail: process.env.AUTH_FROM_EMAIL || "",
  };
}

export function isAuthEnabled(): boolean {
  const { jwtSecret, allowedEmails, sendgridApiKey, fromEmail } =
    getAuthConfig();
  return Boolean(jwtSecret && allowedEmails && sendgridApiKey && fromEmail);
}

export function getAllowedEmails(): string[] {
  const { allowedEmails } = getAuthConfig();
  return allowedEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAllowed(email: string): boolean {
  return getAllowedEmails().includes(email.trim().toLowerCase());
}
