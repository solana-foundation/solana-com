import { redirect } from "next/navigation";
import { locales } from "@workspace/i18n/config";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  // Only redirect valid locales to prevent infinite loops
  // Invalid paths like "/news" should not match this route
  if (!locales.includes(locale)) {
    return new Response("Not Found", { status: 404 });
  }

  redirect(`/${locale}/news`);
}
