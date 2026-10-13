import { DevelopersPaymentsPage } from "./developers-payments";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default function Page() {
  return <DevelopersPaymentsPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "developers-payments.meta.seoTitle",
    descriptionKey: "developers-payments.meta.seoDescription",
    path: "/developers/payments",
    locale,
  });
}
