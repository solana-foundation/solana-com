import { IMAGE_SETTINGS } from "@/utils/images";
import { notFound } from "next/navigation";
import DeveloperDocsImage from "@/components/opengraph/DeveloperDocsImage";
import { cookbookSource } from "@/app/sources/cookbook";

// Route segment config
export const runtime = "nodejs";
export const revalidate = 3600; // 1 hour
// export const dynamic = "force-static";

type Params = { params: Promise<{ slug: string[] }> };
export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const page = cookbookSource.getPage(slug);
  if (!page) {
    notFound();
  }
  const imageData = await DeveloperDocsImage({
    heading: "Solana Cookbook",
    title: page.data.seoTitle || page.data.h1 || page.data.title,
  });
  return new Response(imageData.body, {
    headers: {
      "Content-Type": IMAGE_SETTINGS.contentType,
      "Cache-Control": "public; max-age=18000",
    },
  });
}
