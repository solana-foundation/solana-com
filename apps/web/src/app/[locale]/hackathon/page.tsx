import { HackathonPage } from "./hackathon";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <HackathonPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "hackathon.index.title",
    descriptionKey: "hackathon.index.description",
    path: "/hackathon",
    locale,
  });
}
