import { DevelopersDefiPage } from "./developers-defi";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <DevelopersDefiPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "developers-defi.meta.seoTitle",
    descriptionKey: "developers-defi.meta.seoDescription",
    path: "/developers/defi",
    locale,
  });
}
