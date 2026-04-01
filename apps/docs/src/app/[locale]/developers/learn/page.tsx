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
    title: "Developers Learn | Solana Bootcamp 2026",
    description:
      "Video-first Solana learning tracks built from Bootcamp 2026, with YouTube episodes, companion notes, code, and local progress tracking.",
    alternates: getAlternates("/developers/learn", locale),
  };
}
