import { DevelopersPaymentsPage } from "./developers-payments";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <DevelopersPaymentsPage locale={locale} />;
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
