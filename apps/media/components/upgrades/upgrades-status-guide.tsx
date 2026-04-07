import { StatusBadge } from "./status-badge";

const STATUS_GUIDE = [
  { status: "idea" as const, body: "Early proposals and concept-stage work." },
  {
    status: "review" as const,
    body: "Active proposals under technical review.",
  },
  {
    status: "accepted" as const,
    body: "Approved proposals moving toward implementation.",
  },
  {
    status: "implemented" as const,
    body: "Protocol work has landed but may not be broadly activated.",
  },
  {
    status: "activated" as const,
    body: "The upgrade is live or broadly available to the network.",
  },
];

export function UpgradesStatusGuide({ body }: { body?: string }) {
  return (
    <section className="grid gap-6 rounded-3xl border border-[rgba(236,228,253,0.12)] bg-[rgba(236,228,253,0.03)] p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-3">
        <h2 className="text-lg font-medium text-white">
          How to read this page
        </h2>
        {body ? (
          body.split(/\n\s*\n/).map((paragraph, index) => (
            <p key={index} className="text-sm leading-7 text-[#bcbccd]">
              {paragraph.trim()}
            </p>
          ))
        ) : (
          <p className="text-sm leading-7 text-[#bcbccd]">
            This overview blends editorial context with synced proposal metadata
            so the page can stay useful between manual refreshes.
          </p>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-[0.22em] text-[#ca9ff5]">
          Status guide
        </h3>
        <ul className="space-y-3">
          {STATUS_GUIDE.map((item) => (
            <li key={item.status} className="flex items-start gap-3">
              <StatusBadge status={item.status} />
              <p className="pt-1 text-sm leading-6 text-[#a8a8ba]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
