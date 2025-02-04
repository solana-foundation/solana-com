import { IMAGE_SETTINGS } from "@/utils/images";
import { notFound } from "next/navigation";
import DeveloperDocsImage from "@/components/opengraph/DeveloperDocsImage";
import { cookbookFrontmatter } from "@@/.source/cookbook.fm.js";
import { guidesFrontmatter } from "@@/.source/guides.fm.js";
import { coursesFrontmatter } from "@@/.source/courses.fm.js";
import { docsFrontmatter } from "@@/.source/docs.fm.js";

// Route segment config
export const runtime = "nodejs";
export const revalidate = 3600; // 1 hour
// export const dynamic = "force-static";

type Params = { params: Promise<{ slug: string[] }> };
export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const props = getImageProps(slug);
  if (!props) {
    notFound();
  }
  const imageData = await DeveloperDocsImage(props);
  return new Response(imageData.body, {
    headers: {
      "Content-Type": IMAGE_SETTINGS.contentType,
      "Cache-Control": "public; max-age=18000",
    },
  });
}

function getImageProps(slugItems: Array<string>) {
  let [firstSlugItem, ...rest] = slugItems;
  let path = `/${rest.join("/")?.toLowerCase()}`;
  let fm: any;
  switch (firstSlugItem.toLowerCase()) {
    case "resources":
      return { heading: "Developer Resources", title: "Developer Resources" };
    case "cookbook":
      fm = cookbookFrontmatter[path];
      if (!fm) {
        return null;
      }
      return {
        heading: "Solana Cookbook",
        title: fm.seoTitle || fm.h1 || fm.title,
      };
    case "guides":
      fm = guidesFrontmatter[path];
      if (!fm) {
        return null;
      }
      return {
        heading: "Developer Guides",
        title: fm.seoTitle || fm.h1 || fm.title,
      };
    case "courses":
      fm = coursesFrontmatter[path];
      if (!fm) {
        return null;
      }
      return {
        heading: rest.length > 1 ? "Lesson" : "Developer Course",
        title: fm.seoTitle || fm.h1 || fm.title,
      };
    case "docs":
      fm = docsFrontmatter[path];
      if (!fm) {
        return null;
      }
      return {
        heading: "Solana Documentation",
        title: fm.seoTitle || fm.h1 || fm.title,
      };
    default:
      return { heading: "Solana Developers", title: "Solana Developers" };
  }
}
