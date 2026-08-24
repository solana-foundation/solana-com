import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import PaymentChannelsExperience from "@/components/payment-channels/PaymentChannelsExperience";

type Props = { params: Promise<{ locale: string }> };

const PAGE_PATH = "/payment-channels";

export default function PaymentChannelsPage() {
  return <PaymentChannelsExperience />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = getAlternates(PAGE_PATH, locale);
  const title = "Payment channels for agentic payments | Solana";
  const description =
    "A visual study of payment channels built to process one million logical payments per second and settle on Solana.";

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      type: "website",
      url: alternates.canonical,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
