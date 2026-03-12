import { SolutionsSolanaPermissionedEnvironmentsPage } from "./solutions-solana-permissioned-environments";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <SolutionsSolanaPermissionedEnvironmentsPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("spe-solution");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates(
      "/solutions/solana-permissioned-environments",
      locale,
    ),
  };
}
