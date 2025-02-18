import { IMAGE_SETTINGS } from "@/utils/images";
import { notFound } from "next/navigation";
import DeveloperDocsImage from "@/components/opengraph/DeveloperDocsImage";
import { cookbookData as cookbook } from "@@/.source/cookbook.fm";
import { guidesData as guides } from "@@/.source/guides.fm";
import { coursesData as courses } from "@@/.source/courses.fm";
import { docsData as docs } from "@@/.source/docs.fm";

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

const collections = {
  cookbook,
  guides,
  courses,
  docs,
};
function getImageProps(slugItems: Array<string>) {
  const [first, ...rest] = slugItems;
  const name = first.toLowerCase();
  let title: string | null = null;
  if (collections[name]) {
    title = getTitleFromCollection(collections[name], rest);
    if (!title) {
      return null;
    }
  }
  switch (name) {
    case "courses":
      return {
        title,
        heading: rest.length > 1 ? "Lesson" : "Developer Course",
      };
    case "resources":
      return { title: "Developer Resources", heading: "Developer Resources" };
    case "cookbook":
      return { title, heading: "Solana Cookbook" };
    case "guides":
      return { title, heading: "Developer Guides" };
    case "docs":
      return { title, heading: "Solana Documentation" };
    default:
      return { title: "Solana Developers", heading: "Solana Developers" };
  }
}

function getTitleFromCollection(
  collection: any[],
  slugs: Array<string>,
): string | null {
  const path = slugs.join("/").toLowerCase() || "index";
  const fm = collection[path + ".mdx"] || collection[path + "/index.mdx"];
  return fm ? fm.seoTitle || fm.h1 || fm.title : null;
}
