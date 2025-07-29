import { EducationPage } from "./education";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  return <EducationPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "education.title",
    descriptionKey: "education.description",
    path: "/education",
    locale,
  });
}
