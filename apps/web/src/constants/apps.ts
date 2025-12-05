export const NEXT_PUBLIC_MAIN_APP_URL =
  process.env.NEXT_PUBLIC_MAIN_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://solana.com"
    : process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000");
