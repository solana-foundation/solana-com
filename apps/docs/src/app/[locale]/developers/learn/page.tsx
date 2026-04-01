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
    title: "Developers Learn | Solana developer learning library",
    description:
      "Video-first Solana learning library with bootcamp iterations, focused courses, YouTube episodes, companion notes, code, and local progress tracking.",
    alternates: getAlternates("/developers/learn", locale),
  };
}
