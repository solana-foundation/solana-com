import { RequestForStartupsPage } from "./request-for-startups";
import { getAlternates } from "@workspace/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default function Page() {
  return <RequestForStartupsPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  return {
    title: "Request for Startups | Solana",
    description:
      "The things we want to see built next on Solana, from people shaping the ecosystem.",
    alternates: getAlternates("/request-for-startups", locale),
  };
}
