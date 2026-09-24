import { BookOpen } from "@boxicons/react/BookOpen";
import { CalendarEvent } from "@boxicons/react/CalendarEvent";
import { Film } from "@boxicons/react/Film";
import { Group } from "@boxicons/react/Group";
import { Podcast } from "@boxicons/react/Podcast";
import { cn } from "@/app/components/utils";

type VideoBadgeIconType =
  | "event"
  | "interview"
  | "podcast"
  | "originals"
  | "learn";

const ICON_MAP = {
  event: CalendarEvent,
  interview: Group,
  learn: BookOpen,
  originals: Film,
  podcast: Podcast,
} as const;

export function VideoBadgeIcon({
  type,
  className,
}: {
  type: VideoBadgeIconType;
  className?: string;
}) {
  const Icon = ICON_MAP[type];

  return (
    <span
      className={cn(
        "inline-flex size-[22px] items-center justify-center rounded-[2px] bg-[#00080D] align-middle text-white",
        className,
      )}
    >
      <Icon width={18} height={18} pack="filled" aria-hidden="true" />
    </span>
  );
}
