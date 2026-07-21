import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { UpgradeSocialImage } from "@/components/upgrades/upgrade-social-image";
import { reader } from "@/lib/reader";
import {
  UPGRADE_SOCIAL_IMAGE_SIZE,
  UPGRADE_SOCIAL_IMAGE_TYPE,
} from "@/lib/upgrades/social-image";

export const runtime = "nodejs";
export const revalidate = 300;

type RouteContext = {
  params: Promise<{ slug: string; locale: string }>;
};

const fontFiles = Promise.all([
  readFile(path.join(process.cwd(), "fonts/ABCDiatype-Regular.woff")),
  readFile(path.join(process.cwd(), "fonts/ABCDiatype-Medium.woff")),
]);

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const entry = await reader.collections.upgrades.read(slug);

  if (!entry || entry.status !== "published") {
    return new Response("Upgrade not found", { status: 404 });
  }

  const authorEntry = entry.author
    ? await reader.collections.authors.read(entry.author)
    : null;
  const [regularFont, mediumFont] = await fontFiles;

  return new ImageResponse(
    <UpgradeSocialImage
      title={String(entry.title)}
      subtitle={entry.subtitle ? String(entry.subtitle) : null}
      publishedAt={entry.publishedAt ? String(entry.publishedAt) : null}
      authorName={String(authorEntry?.name ?? "Solana Foundation")}
      badges={entry.badges ?? []}
      metrics={entry.metrics ?? []}
    />,
    {
      ...UPGRADE_SOCIAL_IMAGE_SIZE,
      fonts: [
        {
          name: "ABC Diatype",
          data: regularFont,
          weight: 400,
        },
        {
          name: "ABC Diatype",
          data: mediumFont,
          weight: 500,
        },
      ],
      headers: {
        "Content-Type": UPGRADE_SOCIAL_IMAGE_TYPE,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    },
  );
}
