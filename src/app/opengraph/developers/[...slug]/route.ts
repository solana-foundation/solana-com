import { IMAGE_SETTINGS } from "@/utils/images";
import { notFound } from "next/navigation";
import ContentApi from "@/utils/contentApi";
import DeveloperDocsImage from "@/components/opengraph/DeveloperDocsImage";

// Route segment config
export const runtime = IMAGE_SETTINGS.runtime;
export const revalidate = 3600; // 1 hour
// export const dynamic = "force-static";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { slug: string[] };
  },
) {
  // format the provided slug as a path route
  let route = params.slug.join("/").toLowerCase();

  // handle the special case for course lessons
  if (route.startsWith("courses/lesson/"))
    route = route.replace("courses/lesson/", "lesson/");

  let size = IMAGE_SETTINGS.sizeDefault;

  // locate the current record being viewed (via the correctly formatted api route)
  const record = await ContentApi.getSingleRecord(route);

  // ensure the content record was found
  if (!record || !record.href) {
    notFound();
  }

  // select the correct heading text based on the specific content
  let heading = getHeading(params.slug);

  // create the dynamic image
  // todo: add support for more image variations
  const imageData = await DeveloperDocsImage(
    {
      heading,
      title:
        record.seoTitle ||
        record.sidebarLabel ||
        record.title ||
        "Learn how to be a better Solana Developer",
    },
    size,
  );

  return new Response(imageData.body, {
    headers: {
      "Content-Type": IMAGE_SETTINGS.contentType,
      "Cache-Control": "public; max-age=18000",
    },
  });
}

// Get the heading text based on the provided slugItems
const getHeading = (slugItems: Array<string>) => {
  let firstSlugItem = slugItems[0].toLowerCase();
  if (slugItems.length > 2 && firstSlugItem === "courses") {
    firstSlugItem = "lesson";
  }

  switch (firstSlugItem) {
    case "cookbook":
      return "Solana Cookbook";
    case "docs":
      return "Solana Documentation";
    case "guides":
      return "Developer Guides";
    case "resources":
      return "Developer Resources";
    case "courses":
      return "Developer Course";
    case "lesson":
      return "Lesson";
    default:
      return "Solana Developers";
  }
};
