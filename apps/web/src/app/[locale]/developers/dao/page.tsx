import { DevelopersDaoPage } from "./developers-dao";
import { getIndexMetadata } from "@/app/metadata";
import { META } from "@/data/developers/dao";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <DevelopersDaoPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "developers-dao.meta.seoTitle",
    descriptionKey: "developers-dao.meta.seoDescription",
    path: "/developers/dao",
    locale,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: [META.seoImage],
    },
  };
}
