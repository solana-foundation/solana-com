import { getIndexMetadata } from "@/app/metadata";
import { SkillsPage } from "./skills";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return getIndexMetadata({
    titleKey: "skills.meta.seoTitle",
    descriptionKey: "skills.meta.seoDescription",
    path: "/skills",
    locale,
  });
}

export default async function Page(_props: Props) {
  return <SkillsPage />;
}
