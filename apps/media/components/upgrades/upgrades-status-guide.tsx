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
    <section className="relative text-left text-white">
      <div className="mx-auto max-w-[1440px] px-[20px] py-[64px] md:px-[32px] md:py-[80px] xl:px-[40px] xl:py-[96px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-16">
          <div className="space-y-4">
            <h2 className="m-0 font-sans font-medium text-[28px] md:text-[40px] xl:text-[48px] leading-[1.28] md:leading-[1.3] xl:leading-[1.083] tracking-[-0.84px] md:tracking-[-1.2px] xl:tracking-[-1.44px]">
              How to read this page
            </h2>
            {body ? (
              body.split(/\n\s*\n/).map((paragraph, index) => (
                <p
                  key={index}
                  className="m-0 text-[#ABABBA] text-base md:text-lg tracking-[-0.16px] md:tracking-[-0.18px] leading-[1.5] md:leading-[1.77]"
                >
                  {paragraph.trim()}
                </p>
              ))
            ) : (
              <p className="m-0 text-[#ABABBA] text-base md:text-lg tracking-[-0.16px] md:tracking-[-0.18px] leading-[1.5] md:leading-[1.77]">
                This overview blends editorial context with synced proposal
                metadata so the page can stay useful between manual refreshes.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="m-0 text-[13px] font-medium uppercase tracking-[0.22em] text-[#CA9FF5]">
              Status guide
            </h3>
            <ul className="m-0 list-none p-0 divide-y divide-white/10">
              {STATUS_GUIDE.map((item) => (
                <li
                  key={item.status}
                  className="flex items-center gap-4 py-4 first:pt-0"
                >
                  <StatusBadge status={item.status} />
                  <p className="m-0 text-[#ABABBA] text-base tracking-[-0.16px] leading-[1.5]">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
