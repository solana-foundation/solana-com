import { useTranslations } from "next-intl";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { cn } from "@/lib/utils";
import type { SupportedClient } from "@/lib/upgrades/group-by-release";

/**
 * Lists the client releases that support a protocol version. Clients are
 * free-form content entries, so a new validator client shows up here as soon
 * as an editor adds it to the protocol version record.
 */
export function SupportedClients({
  clients,
  className,
}: {
  clients: SupportedClient[];
  className?: string;
}) {
  const t = useTranslations("upgrades.clients");

  if (clients.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50">
        {t("title")}
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {clients.map((client) => {
          const content = (
            <>
              <span className="font-semibold text-white">{client.name}</span>
              <span
                className={cn(
                  "tabular-nums",
                  client.version ? "text-white/70" : "text-white/40",
                )}
              >
                {client.version || t("versionTba")}
              </span>
              {client.url && (
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 text-white/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#14F195]"
                />
              )}
            </>
          );
          const itemClassName =
            "group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-[13.5px]";

          return (
            <li key={`${client.name}-${client.version}`}>
              {client.url ? (
                <a
                  href={client.url}
                  target={client.url.startsWith("http") ? "_blank" : undefined}
                  rel={
                    client.url.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={t("releaseNotes", {
                    client: client.name,
                    version: client.version || t("versionTba"),
                  })}
                  className={cn(
                    itemClassName,
                    "transition-colors hover:border-white/25 hover:bg-white/[0.06]",
                  )}
                >
                  {content}
                </a>
              ) : (
                <span className={itemClassName}>{content}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
