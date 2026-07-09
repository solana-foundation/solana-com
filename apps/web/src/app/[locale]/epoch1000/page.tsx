import { getIndexMetadata } from "@/app/metadata";
import Countdown from "@/components/epoch1000/Countdown";
import WalletChecker from "@/components/epoch1000/WalletChecker";

type Props = { params: Promise<{ locale: string }> };

export default function Page(_props: Props) {
  return (
    <main className="w-full max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16 flex flex-col gap-16 sm:gap-24 min-h-screen">
      <header className="flex items-center justify-between">
        <p className="text-xs font-mono tracking-[0.3em] text-ep-dust">
          SOLANA MAINNET-BETA · MARCH 2020 → NOW
        </p>
        <a
          href="#checker"
          className="text-xs text-ep-dust hover:text-ep-ink transition shrink-0"
        >
          check your wallet ↓
        </a>
      </header>

      <div className="flex flex-col gap-6">
        <h1 className="font-black tracking-tight text-5xl sm:text-7xl leading-tight">
          <span className="text-sol-gradient">1000</span> EPOCHS
        </h1>
        <p className="text-sm sm:text-base text-ep-dim max-w-xl">
          Every ~2 days, Solana closes an epoch: 432,000 slots of blocks, votes,
          mints, and sends. The 1,000th is almost here — check how many
          you&apos;ve survived.
        </p>
      </div>

      <WalletChecker />

      <hr className="border-ep-edge" />

      <Countdown />
    </main>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "epoch1000.meta.title",
    descriptionKey: "epoch1000.meta.description",
    path: "/epoch1000",
    locale,
  });
  return {
    ...base,
    openGraph: {
      title: "EPOCH1000 — Solana's 1000th epoch",
      description:
        "Counting down to Solana's 1000th epoch. How many epochs have you survived?",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
