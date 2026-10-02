import type { Metadata } from "next";
import { Link } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import { getShanghaiAgenda } from "@/lib/shanghai-agenda";
import { getPageMetadata } from "../../../metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "accelerate.metadata",
  });

  return getPageMetadata({
    locale,
    path: "/china/agenda",
    title: "Shanghai agenda | Solana Accelerate",
    description: "Solana Accelerate Shanghai sessions, October 16, 2026.",
    siteTitle: t("site.title"),
    siteDescription: t("site.description"),
    keywords: [
      "Solana Accelerate Shanghai agenda",
      "Shanghai Solana conference agenda",
    ],
  });
}

export default async function ShanghaiAgendaPage() {
  const result = await getShanghaiAgenda();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="container-accelerate flex min-h-[72px] items-center justify-between">
          <Link
            href="/accelerate/china"
            className="font-space-grotesk text-sm font-medium tracking-[0.04em] text-white transition-colors hover:text-accelerate-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accelerate-green"
          >
            Solana Accelerate
          </Link>
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/50">
            Shanghai
          </span>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10 py-16 sm:py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full bg-accelerate-purple/10 blur-[120px]"
        />
        <div className="container-accelerate relative">
          <Link
            href="/accelerate/china"
            className="mb-10 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accelerate-green"
          >
            <span aria-hidden="true">←</span>
            Back to Accelerate China
          </Link>

          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-accelerate-green sm:text-sm">
            October 16, 2026 <span aria-hidden="true">/</span> Shanghai
          </p>
          <h1 className="max-w-5xl font-space-grotesk text-[56px] font-normal leading-[0.98] tracking-[-0.045em] text-white sm:text-[76px] lg:text-[104px]">
            Shanghai <span className="text-accelerate-green">agenda</span>
          </h1>
        </div>
      </section>

      <section
        aria-labelledby="shanghai-sessions-heading"
        className="container-accelerate py-12 sm:py-16 lg:py-20"
      >
        <h2 id="shanghai-sessions-heading" className="sr-only">
          Shanghai sessions
        </h2>

        {result.status === "unavailable" ? (
          <p
            role="status"
            className="max-w-2xl border-y border-white/10 py-8 text-base leading-7 text-white/60 sm:text-lg"
          >
            The agenda is temporarily unavailable. Please check back soon.
          </p>
        ) : result.sessions.length === 0 ? (
          <p
            role="status"
            className="max-w-2xl border-y border-white/10 py-8 text-base leading-7 text-white/60 sm:text-lg"
          >
            No Shanghai sessions have been published yet. Please check back
            soon.
          </p>
        ) : (
          <ol
            aria-label="Shanghai agenda sessions"
            className="divide-y divide-white/10 border-y border-white/10"
          >
            {result.sessions.map((session) => (
              <li
                key={session.id}
                className="grid gap-3 py-7 sm:py-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] md:gap-12 lg:py-10"
              >
                <h3 className="font-space-grotesk text-xl font-medium leading-snug tracking-[-0.02em] text-white sm:text-2xl">
                  {session.title}
                </h3>
                {session.description ? (
                  <p className="max-w-2xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
                    {session.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
