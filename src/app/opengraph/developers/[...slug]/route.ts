import { IMAGE_SETTINGS } from "@/utils/images";
import { notFound } from "next/navigation";
import DeveloperDocsImage from "@/components/opengraph/DeveloperDocsImage";

// Route segment config
export const runtime = "nodejs";
export const revalidate = 3600; // 1 hour
// export const dynamic = "force-static";

type Params = { params: Promise<{ slug: string[] }> };
export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  // select the correct heading text based on the specific content
  let heading = getHeading(slug);
  let title = getTitle(slug);
  if (!title) {
    notFound();
  }
  // create the dynamic image
  // todo: add support for more image variations
  const imageData = await DeveloperDocsImage({
    heading,
    title,
  });
  return new Response(imageData.body, {
    headers: {
      "Content-Type": IMAGE_SETTINGS.contentType,
      "Cache-Control": "public; max-age=18000",
    },
  });
}

const getTitle = (slugItems: Array<string>) => {
  let [firstSlugItem] = slugItems;
  switch (firstSlugItem.toLowerCase()) {
    case "resources":
      return "Developer Resources";
    default:
      return "Solana Developers";
  }
};

// Get the heading text based on the provided slugItems
const getHeading = (slugItems: Array<string>) => {
  let firstSlugItem = slugItems[0].toLowerCase();
  switch (firstSlugItem) {
    case "resources":
      return "Developer Resources";
    default:
      return "Solana Developers";
  }
};
