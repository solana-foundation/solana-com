import { redirect } from "@workspace/i18n/routing";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  redirect({
    href: "/news",
    locale,
  });
}
