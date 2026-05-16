import { AiPageContent } from "./ai-page";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  return <AiPageContent />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "ai.title",
    descriptionKey: "ai.description",
    path: "/ai",
    locale,
  });
}
