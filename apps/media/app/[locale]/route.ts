import { redirect } from "next/navigation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  redirect(`/${locale}/media/read`);
}
