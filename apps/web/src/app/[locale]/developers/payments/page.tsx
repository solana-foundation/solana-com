import { DevelopersPaymentsPage } from "./developers-payments";
import { getIndexMetadata } from "@/app/metadata";
import { META } from "@/data/developers/payments";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <DevelopersPaymentsPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "developers-payments.meta.seoTitle",
    descriptionKey: "developers-payments.meta.seoDescription",
    path: "/developers/payments",
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
