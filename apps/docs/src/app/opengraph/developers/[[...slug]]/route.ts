import { IMAGE_SETTINGS } from "@@/src/utils/images";
import { notFound } from "next/navigation";
import DeveloperDocsImage from "@@/src/components/opengraph/DeveloperDocsImage";

import { docsSource as docs } from "@@/src/app/sources/docs";
import { cookbookSource as cookbook } from "@@/src/app/sources/cookbook";
import { guidesSource as guides } from "@@/src/app/sources/guides";

// Route segment config
export const runtime = "nodejs";
export const revalidate = 3600; // 1 hour
// export const dynamic = "force-static";

type Params = { params: Promise<{ slug?: string[] }> };
export async function GET(_request: Request, { params }: Params) {
  const { slug = [] } = await params;
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
  docs,
};
function getImageProps(slugItems: Array<string>) {
  if (slugItems.length === 0) {
    return { title: "Solana Developers", heading: "Solana Developers" };
  }
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
  collection: any,
  slugs: Array<string>,
): string | null {
  const page = collection.getPage(slugs);
  if (!page) return null;
  return page.data.seoTitle || page.data.h1 || page.data.title;
}
