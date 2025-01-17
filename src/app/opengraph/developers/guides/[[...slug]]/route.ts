import { IMAGE_SETTINGS } from "@/utils/images";
import { notFound } from "next/navigation";
import DeveloperDocsImage from "@/components/opengraph/DeveloperDocsImage";
import { guidesSource } from "@/app/sources/guides";

// Route segment config
export const runtime = "nodejs";
export const revalidate = 3600; // 1 hour
// export const dynamic = "force-static";

type Params = { params: Promise<{ slug: string[] }> };
export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const page = guidesSource.getPage(slug);
  if (!page) {
    notFound();
  }
  const imageData = await DeveloperDocsImage({
    heading: "Developer Guides",
    title: page.data.seoTitle || page.data.h1 || page.data.title,
  });
  return new Response(imageData.body, {
    headers: {
      "Content-Type": IMAGE_SETTINGS.contentType,
      "Cache-Control": "public; max-age=18000",
    },
  });
}
