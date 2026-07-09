import type { Metadata } from "next";
import Link from "next/link";
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
  const tier = tierFor(parseInt(survived, 10) || 0);
  const title = `Survived ${survived}${capped ? "+" : ""} epochs on Solana — ${tier.name}`;
  const description = `First seen in epoch ${first(sp.fe) || "?"}. How many of Solana's first 1000 epochs did you survive?`;
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
  const survived = parseInt(first(sp.s), 10) || 0;
  const capped = first(sp.x) === "1";
  const tier = tierFor(survived);

  return (
    <main className="w-full max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16 flex flex-col gap-8 min-h-screen">
      <h1 className="font-bold tracking-tight text-xl sm:text-2xl">
        <span style={{ color: tier.color }}>{tier.name}</span> · survived{" "}
        {survived}
        {capped ? "+" : ""} epochs
      </h1>

      <img
        src={`/api/epoch1000/og?${query}`}
        alt={`Survivor card: ${tier.name}, survived ${survived} epochs on Solana`}
        className="w-full rounded-lg border border-ep-edge"
        width={1200}
        height={630}
      />

      <p className="text-sm text-ep-dim">{tier.line}</p>

      <Link
        href="/epoch1000#checker"
        className="self-start bg-ep-ink text-ep-void font-semibold rounded-full px-7 py-3 text-sm hover:bg-ep-dim transition"
      >
        Check your own wallet
      </Link>
    </main>
  );
}
