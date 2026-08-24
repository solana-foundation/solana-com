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
    title: "Payment Channels: give your agent a spending limit",
    description:
      "Payment channels are a new Solana primitive built to solve this across x402 and MPP payment protocols. It lets an agent authorize a spending limit once, spend against the limit, and settle the payment amount once.",
  };
}
