import { IMAGE_SETTINGS } from "@/utils/images";
import { notFound } from "next/navigation";
import DeveloperDocsImage from "@/components/opengraph/DeveloperDocsImage";
import { coursesSource } from "@/app/sources/courses";

// Route segment config
export const runtime = "nodejs";
export const revalidate = 3600; // 1 hour
// export const dynamic = "force-static";

type Params = { params: Promise<{ course: string; lesson: string }> };
export async function GET(_request: Request, { params }: Params) {
  const { course, lesson } = await params;
  const page = coursesSource.getPage([course, lesson]);
  if (!page) {
    notFound();
  }
  const imageData = await DeveloperDocsImage({
    heading: "Lesson",
    title: page.data.seoTitle || page.data.h1 || page.data.title,
  });
  return new Response(imageData.body, {
    headers: {
      "Content-Type": IMAGE_SETTINGS.contentType,
      "Cache-Control": "public; max-age=18000",
    },
  });
}
