import { Link } from "@workspace/i18n/routing";
import { cn } from "@/app/components/utils";

export type MetricSourceNoteProps = {
  name: string;
  href: string;
  period: string;
  className?: string;
};

const SITE_ORIGIN = "https://solana.com";

/** Source link and reporting period shown beneath a published metric. */
export function MetricSourceNote({
  name,
  href,
  period,
  className,
}: MetricSourceNoteProps) {
  const internalHref = href.startsWith(`${SITE_ORIGIN}/`)
    ? href.slice(SITE_ORIGIN.length)
    : href.startsWith("/")
      ? href
      : undefined;
  const linkClassName =
    "underline decoration-current/40 underline-offset-2 hover:opacity-100 hover:decoration-current";

  return (
    <p
      className={cn(
        "mt-2 text-[12px] md:text-[13px] leading-[1.4] font-normal normal-case opacity-60",
        className,
      )}
    >
      {internalHref ? (
        <Link href={internalHref} className={linkClassName}>
          {name}
        </Link>
      ) : (
        <a
          href={href}
          className={linkClassName}
          target="_blank"
          rel="noopener noreferrer"
        >
          {name}
          <span aria-hidden="true"> ↗</span>
        </a>
      )}
      <span aria-hidden="true"> · </span>
      <span>{period}</span>
    </p>
  );
}
