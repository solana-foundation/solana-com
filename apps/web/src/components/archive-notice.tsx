import { Link } from "@workspace/i18n/routing";

type ArchiveNoticeProps = {
  label: string;
  period: string;
  description: string;
  href?: string;
  linkLabel?: string;
};

export function ArchiveNotice({
  label,
  period,
  description,
  href,
  linkLabel,
}: ArchiveNoticeProps) {
  return (
    <aside
      aria-label={label}
      className="border-b border-white/20 bg-black px-6 py-4 text-white"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <strong className="font-semibold">
          {label} · {period}
        </strong>
        <span>{description}</span>
        {href && linkLabel && (
          <Link className="underline underline-offset-4" href={href}>
            {linkLabel}
          </Link>
        )}
      </div>
    </aside>
  );
}
