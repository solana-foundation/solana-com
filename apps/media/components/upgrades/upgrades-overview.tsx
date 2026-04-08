import Link from "next/link";
import type {
  UpgradeItem,
  UpgradeNote,
  UpgradeOverview,
} from "@/lib/upgrade-types";

function formatNoteDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function UpgradesOverview({
  overview,
  featured,
  latestNotes = [],
}: {
  overview: UpgradeOverview | null;
  featured: UpgradeItem[];
  latestNotes?: UpgradeNote[];
}) {
  return (
    <section className="space-y-8">
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#ca9ff5]">
            {overview?.eyebrow || "Solana Upgrades"}
          </p>
          <h1 className="max-w-5xl text-[clamp(2.6rem,5vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.03em] text-white">
            {overview?.title || "Protocol upgrades, tracked with context."}
          </h1>
        </div>

        {(overview?.intro || "")
          .split(/\n\s*\n/)
          .filter(Boolean)
          .map((paragraph, index) => (
            <p
              key={index}
              className="max-w-4xl text-base leading-8 text-[#c5c5d1] md:text-lg"
            >
              {paragraph.trim()}
            </p>
          ))}

        {overview?.lastReviewed ? (
          <div className="text-sm uppercase tracking-[0.22em] text-[#76768c]">
            Last reviewed {overview.lastReviewed}
          </div>
        ) : null}
      </div>

      {overview?.currentFocus || featured.length > 0 ? (
        <div className="grid gap-6 rounded-3xl border border-[rgba(236,228,253,0.12)] bg-[linear-gradient(180deg,rgba(18,20,31,0.95),rgba(11,13,22,0.85))] p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-3">
            <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-[#ca9ff5]">
              Current focus
            </h2>
            {(overview?.currentFocus || "")
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index} className="text-sm leading-7 text-[#c5c5d1]">
                  {paragraph.trim()}
                </p>
              ))}
          </div>

          {featured.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-[0.25em] text-[#ca9ff5]">
                Notable right now
              </h3>
              <ol className="space-y-3 text-sm text-[#d4d4df]">
                {featured.map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-[rgba(236,228,253,0.12)] pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[#8f8fa3]">
                      SIMD-{item.simdNumber}
                    </div>
                    <div className="mt-1 font-medium text-white">
                      {item.title}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-[#a8a8ba]">
                      {item.description || item.editorialNote || item.summary}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      ) : null}

      {latestNotes.length > 0 ? (
        <div className="space-y-4 rounded-3xl border border-[rgba(236,228,253,0.12)] bg-[linear-gradient(180deg,rgba(18,20,31,0.95),rgba(11,13,22,0.85))] p-6">
          <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-[#ca9ff5]">
            Latest updates
          </h2>
          <ol className="space-y-4 text-sm text-[#d4d4df]">
            {latestNotes.map((note) => (
              <li
                key={note.slug}
                className="border-b border-[rgba(236,228,253,0.12)] pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#8f8fa3]">
                    SIMD-{note.simdNumber}
                  </span>
                  <span className="text-[11px] text-[#66667a]">
                    {formatNoteDate(note.publishedAt)}
                  </span>
                </div>
                <div className="mt-1 font-medium text-white">
                  {note.upgradeTitle}
                </div>
                <p className="mt-1 text-sm leading-6 text-[#a8a8ba]">
                  {note.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {overview?.resources && overview.resources.length > 0 ? (
        <div className="flex flex-wrap gap-4 text-sm">
          {overview.resources.map((resource) => (
            <Link
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="text-white underline decoration-white/20 underline-offset-4 hover:decoration-white"
            >
              {resource.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
