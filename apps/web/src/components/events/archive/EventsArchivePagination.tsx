import { Link } from "@workspace/i18n/routing";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/app/components/utils";

export interface EventsArchivePaginationProps {
  currentPage: number;
  eventCountLabel: string;
  nextLabel: string;
  pageEnd: number;
  previousLabel: string;
  totalCount: number;
  totalPages: number;
}

const EventsArchivePagination = ({
  currentPage,
  eventCountLabel,
  nextLabel,
  pageEnd,
  previousLabel,
  totalCount,
  totalPages,
}: EventsArchivePaginationProps) => {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages && totalCount > 0;
  const progressPercentage =
    totalCount > 0 ? Math.min((pageEnd / totalCount) * 100, 100) : 0;

  const getPageHref = (page: number) =>
    page <= 1 ? "/events/archive" : `/events/archive?page=${page}`;

  return (
    <nav
      aria-label="Archive pagination"
      className="mt-12 border-t border-white/10 pt-6"
    >
      <div className="font-brand-mono text-[11px] uppercase tracking-[0.25em] text-white/45">
        {eventCountLabel}
        <div className="mt-3 h-px max-w-[14rem] bg-white/10">
          <div
            className="h-full bg-white"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ArchivePageLink
          disabled={!hasPreviousPage}
          href={getPageHref(currentPage - 1)}
          icon={<ArrowLeft aria-hidden className="h-4 w-4" strokeWidth={2.5} />}
        >
          {previousLabel}
        </ArchivePageLink>
        <ArchivePageLink
          disabled={!hasNextPage}
          href={getPageHref(currentPage + 1)}
          icon={
            <ArrowRight aria-hidden className="h-4 w-4" strokeWidth={2.5} />
          }
          iconPosition="right"
        >
          {nextLabel}
        </ArchivePageLink>
      </div>
    </nav>
  );
};

function ArchivePageLink({
  children,
  disabled,
  href,
  icon,
  iconPosition = "left",
}: {
  children: React.ReactNode;
  disabled: boolean;
  href: string;
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
}) {
  const className = cn(
    "inline-flex h-12 w-full items-center justify-center gap-3 rounded-full px-2 font-brand text-base leading-none tracking-normal no-underline transition-colors sm:w-auto",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
    disabled
      ? "cursor-not-allowed border border-white/10 bg-white/[0.04] text-white/35"
      : "bg-white text-black hover:bg-[#ececec]",
  );

  const iconClassName = cn(
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
    disabled ? "bg-white/10 text-white/35" : "bg-black text-white",
  );

  const content = (
    <>
      {iconPosition === "left" && <span className={iconClassName}>{icon}</span>}
      <span className="whitespace-nowrap px-2">{children}</span>
      {iconPosition === "right" && (
        <span className={iconClassName}>{icon}</span>
      )}
    </>
  );

  if (disabled) {
    return (
      <span aria-disabled="true" className={className}>
        {content}
      </span>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export default EventsArchivePagination;
