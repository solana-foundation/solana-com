import { PyusdPage } from "./pyusd";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <PyusdPage locale={locale} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "pyusd.meta.seoTitle",
    descriptionKey: "pyusd.meta.seoDescription",
    path: "/pyusd",
    locale,
  });
}
