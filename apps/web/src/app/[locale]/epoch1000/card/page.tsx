import type { Metadata } from "next";
import { Link } from "@workspace/i18n/routing";
import Reveal from "@/components/epoch1000/Reveal";
import { tierFor } from "@/lib/epoch1000/tiers";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function ogQuery(sp: Record<string, string | string[] | undefined>): string {
  const p = new URLSearchParams();
  for (const key of ["s", "fe", "c", "t", "x", "w"]) {
    const v = first(sp[key]);
    if (v) p.set(key, v);
  }
  return p.toString();
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const sp = await searchParams;
  const survived = first(sp.s) || "0";
  const capped = first(sp.x) === "1";
  const firstEpoch = first(sp.fe);
  const tier = tierFor(parseInt(survived, 10) || 0);
  const title = `Epoch 1000 Survivor Card — ${tier.name}`;
  const description = `Survived ${survived}${capped ? "+" : ""} of Solana's first 1,000 epochs${firstEpoch ? ` — on chain since epoch ${firstEpoch}` : ""}. ${tier.line}`;
  const image = `/api/epoch1000/og?${ogQuery(sp)}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CardPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = ogQuery(sp);
  const survived = Math.max(0, parseInt(first(sp.s), 10) || 0);
  const capped = first(sp.x) === "1";
  const firstEpoch = first(sp.fe);
  const wallet = first(sp.w);
  const tier = tierFor(survived);
  const survivedLabel = `${survived}${capped ? "+" : ""}`;

  return (
    <main className="w-full max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-20 flex flex-col items-center text-center gap-8 sm:gap-10 min-h-screen">
      <header className="flex flex-col items-center gap-4 sm:gap-5">
        <p className="font-brand-mono text-xs sm:text-sm tracking-[0.2em] text-ep-dust uppercase">
          Solana mainnet · Epoch 1000
        </p>
        <h1
          className="font-black tracking-tight text-4xl sm:text-6xl leading-none"
          style={{ color: tier.color }}
        >
          {tier.name}
        </h1>
        <p className="text-sm sm:text-base text-ep-dim max-w-xl">
          {wallet ? (
            <span className="font-mono text-ep-ink">{wallet}</span>
          ) : (
            "This wallet"
          )}{" "}
          survived{" "}
          <span className="font-semibold text-ep-ink">{survivedLabel}</span> of
          Solana&apos;s first 1,000 epochs
          {firstEpoch ? ` — on chain since epoch ${firstEpoch}` : ""}.
        </p>
      </header>

      <Reveal className="w-full">
        <img
          src={`/api/epoch1000/og?${query}`}
          alt={`Survivor card: ${tier.name}, survived ${survivedLabel} of Solana's first 1,000 epochs`}
          className="w-full rounded-xl border border-ep-edge"
          style={{ boxShadow: `0 20px 100px -30px ${tier.color}66` }}
          width={1200}
          height={630}
        />
      </Reveal>

      <Reveal className="flex flex-col items-center gap-6 sm:gap-8">
        <p className="text-sm text-ep-dim max-w-xl">
          An epoch is roughly two days of uninterrupted Solana blocks — epoch
          1000 marks over six years of mainnet without missing a beat. Every
          survivor card shows how much of that history a wallet lived through.
        </p>

        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/epoch1000#checker"
              className="bg-ep-ink text-ep-void font-semibold rounded-full px-7 py-3 text-sm hover:bg-ep-dim transition-colors duration-200"
            >
              Check your wallet
            </Link>
            <Link
              href="/epoch1000"
              className="border border-ep-edge rounded-full px-7 py-3 text-sm text-ep-dim hover:text-ep-ink transition-colors duration-200"
            >
              Explore the celebration
            </Link>
          </div>
          <p className="text-xs text-ep-dust">
            No connect. No signature. Just paste an address.
          </p>
        </div>
      </Reveal>
    </main>
  );
}
