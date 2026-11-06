import { notFound, redirect } from "next/navigation";
import { locales } from "@workspace/i18n/config";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  // Only known locales may be echoed into the Location header; anything else
  // (for example an encoded slash that would build a protocol-relative URL)
  // is a 404 rather than a redirect.
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  redirect(`/${locale}/docs`);
}
