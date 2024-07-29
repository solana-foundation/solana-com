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
  const route = params.slug.join("/");

  let size = IMAGE_SETTINGS.sizeDefault;

  // locate the current record being viewed (via the correctly formatted api route)
  const record = await ContentApi.getSingleRecord(route);

  // ensure the content record was found
  if (!record || !record.href) {
    notFound();
  }

  // select the correct heading text based on the specific content
  let heading = getHeadingText(params.slug[0]);

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

/**
 *
 */
const getHeadingText = (prefix: string) => {
  switch (prefix.toLowerCase()) {
    case "cookbook":
      return "Solana Cookbook";
    case "docs":
      return "Solana Documentation";
    case "guides":
      return "Developer Guides";
    case "resources":
      return "Developer Resources";
    default:
      return "Solana Developers";
  }
};
