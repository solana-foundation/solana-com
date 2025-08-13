import { memo, useEffect, useState } from "react";
import { formatDate } from "../../utils/dateUtils";

export default memo(function FormattedDate({
  date: dateString,
  format,
  timezone,
}) {
  const [date, setDate] = useState(null);

  useEffect(() => {
    const parsed = new Date(dateString);

    if (isNaN(parsed)) {
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
