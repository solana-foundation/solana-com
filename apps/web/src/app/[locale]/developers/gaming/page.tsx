import { DevelopersGamingPage } from "./developers-gaming";
import { getIndexMetadata } from "@/app/metadata";
import { META } from "@/data/developers/gaming";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <DevelopersGamingPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "developers-gaming.meta.seoTitle",
    descriptionKey: "developers-gaming.meta.seoDescription",
    path: "/developers/gaming",
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
