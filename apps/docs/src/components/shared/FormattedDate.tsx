import { memo, useEffect, useState } from "react";
import { formatDate } from "../../utils/dateUtils";

export default memo(function FormattedDate({
  date: dateString,
  format,
  timezone,
}: {
  date: string | Date;
  format: string;
  timezone?: string;
}) {
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    const parsed = new Date(dateString);

    if (isNaN(parsed.getTime())) {
      return;
    }

    const formatted = formatDate(parsed, format, timezone);

    setDate(formatted);
  }, [dateString, format, timezone]);

  if (!date) {
    return null;
  }

  return <>{date}</>;
});
