import { getBaseMetadata } from "@/app/metadata";
import Landing from "@/components/payment-channels/Landing";

type Props = { params: Promise<{ locale: string }> };

export default function Page() {
  return <Landing />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return {
    ...getBaseMetadata(locale),
    title: "Payment channels for agentic payments",
    description:
      "A visual study of payment channels built to process one million payments per second and settle on Solana.",
  };
}
