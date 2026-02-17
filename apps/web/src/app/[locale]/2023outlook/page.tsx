import { Outlook2023Page } from "./outlook-2023";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  return <Outlook2023Page />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "ecdr.title",
    descriptionKey: "ecdr.description",
    path: "/2023outlook",
    locale,
  });
}
