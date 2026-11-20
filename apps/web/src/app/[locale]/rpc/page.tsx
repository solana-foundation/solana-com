import { RpcPage, type RpcCopy } from "./rpc";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rpc" });
  return <RpcPage copy={t.raw("directory") as RpcCopy} locale={locale} />;
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
