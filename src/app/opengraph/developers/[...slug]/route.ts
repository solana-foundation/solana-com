import { IMAGE_SETTINGS } from "@/utils/images";
import { notFound } from "next/navigation";
import DeveloperDocsImage from "@/components/opengraph/DeveloperDocsImage";
import {
  cookbookSource,
  coursesSource,
  docsSource,
  guidesSource,
} from "@/app/source";

// Route segment config
export const runtime = "nodejs";
export const revalidate = 3600; // 1 hour
// export const dynamic = "force-static";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ slug: string[] }>;
  },
) {
  const slug = (await params).slug;
  // format the provided slug as a path route
  let route = slug.join("/").toLowerCase();

  // handle the special case for course lessons
  if (route.startsWith("courses/lesson/"))
    route = route.replace("courses/lesson/", "lesson/");

  let size = IMAGE_SETTINGS.sizeDefault;

  // select the correct heading text based on the specific content
  let heading = getHeading(slug);
  let title = getTitle(slug);
  if (!title) {
    notFound();
  }
  // create the dynamic image
  // todo: add support for more image variations
  const imageData = await DeveloperDocsImage(
    {
      heading,
      title,
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

const getTitle = (slugItems: Array<string>) => {
  let [firstSlugItem, ...path] = slugItems;
  if (slugItems.length > 2 && firstSlugItem === "courses") {
    firstSlugItem = "lesson";
  }
  switch (firstSlugItem.toLowerCase()) {
    case "resources":
      return "Developer Resources";
    case "docs":
      const docsPage = docsSource.getPage(path);
      if (!docsPage) return null;
      return docsPage.data.seoTitle || docsPage.data.h1 || docsPage.data.title;
    case "cookbook":
      const page = cookbookSource.getPage(path);
      if (!page) return null;
      return page.data.seoTitle || page.data.h1 || page.data.title;
    case "guides":
      const guide = guidesSource.getPage(path);
      if (!guide) return null;
      return guide.data.seoTitle || guide.data.h1 || guide.data.title;
    case "courses":
      const course = coursesSource.getPage(path);
      if (!course) return null;
      return course.data.seoTitle || course.data.h1 || course.data.title;
    case "lesson":
      const lesson = coursesSource.getPage(path);
      if (!lesson) return null;
      return lesson.data.seoTitle || lesson.data.h1 || lesson.data.title;
    default:
      return "Solana Developers";
  }
};

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
