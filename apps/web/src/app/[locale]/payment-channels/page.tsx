import { getBaseMetadata } from "@/app/metadata";
import { PaymentChannelsPage } from "@/components/payment-channels/payment-channels";

type Props = { params: Promise<{ locale: string }> };

export default function Page() {
  return <PaymentChannelsPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return {
    ...getBaseMetadata(locale),
    title: "Payment channels for agentic payments",
    description:
      "A visual study of payment channels built to process one million logical payments per second and settle on Solana.",
  };
}
