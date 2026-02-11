import DevelopersLearnCatalog from "@/components/developers-learn/developers-learn-catalog";
import { getAlternates } from "@workspace/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page() {
  return <DevelopersLearnCatalog />;
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;

  return {
    title: "Developers Learn",
    description:
      "Video-first Solana developer foundations course POC with practical lessons and local progress tracking.",
    alternates: getAlternates("/developers/learn", locale),
  };
}
