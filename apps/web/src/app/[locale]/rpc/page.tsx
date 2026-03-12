import { RpcPage } from "./rpc";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const t = await getTranslations("rpc");

  const translations = {
    content: t.raw("content") as string,
  };

  return <RpcPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "rpc.meta.title",
    descriptionKey: "rpc.meta.description",
    path: "/rpc",
    locale,
  });
}
