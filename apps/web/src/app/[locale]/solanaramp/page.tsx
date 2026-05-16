import { SolanarampPage } from "./solanaramp";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  return <SolanarampPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "on-off-ramp.meta.title",
    descriptionKey: "on-off-ramp.meta.description",
    path: "/solanaramp",
    locale,
  });
}
