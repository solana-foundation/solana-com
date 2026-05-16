import { formatInTimeZone } from "date-fns-tz";
import { isString } from "./stringUtils";
import { add, format } from "date-fns";
import { parse as parseDurationString, type Duration } from "tinyduration";

export const defaultDateStringOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 * Uses intl to get the locale & formats the given string accordingly.
 */
export const toLocaleString = (
  locale: string | string[] | undefined,
  dateString: string | number | Date,
  dateStringOptions: Intl.DateTimeFormatOptions = defaultDateStringOptions,
): string => new Date(dateString).toLocaleDateString(locale, dateStringOptions);

/**
 * Formats a given date to MM/DD/YYYY HH:MM.
 */
export const formatDateTime = (date: Date | string | number): string => {
  const dateTime = new Date(date);
  let hours: number | string = dateTime.getUTCHours();
  let minutes: number | string = dateTime.getUTCMinutes();
  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${
    dateTime.getUTCMonth() + 1
  }/${dateTime.getUTCDate()}/${dateTime.getUTCFullYear()} ${hours}:${minutes}`;
};

/**
 * Tries to switch the month and day part of a given Date string.
 */
export const switchMonthAndDay = (dateString: string): string => {
  try {
    const dateArray = dateString.split("-");
    return [dateArray[0], dateArray[2], dateArray[1]].join("-");
  } catch (err) {
    console.error(err);
    return dateString;
  }
};

/**
 * Tries to fix a given Date string.
 */
export const fixDate = (dateString: string): Date | string => {
  try {
    const parsedDate = new Date(dateString);
    if (Object.prototype.toString.call(parsedDate) === "[object Date]") {
      if (isNaN(parsedDate.getTime())) {
        const possiblyFixedDateString = switchMonthAndDay(dateString);
        const possiblyFixedDate = fixDate(possiblyFixedDateString);
        if (isString(possiblyFixedDate)) {
          return dateString;
        }
        return possiblyFixedDate;
      }
      return parsedDate;
    }
    return dateString;
  } catch (err) {
    console.error(err);
    return dateString;
  }
};

/**
 * Tries to format a DateTime in a given time zone.
 */
export const formatDate = (
  date: Date | number,
  dateFormat: string,
  timezone?: string,
): string =>
  !!timezone && timezone !== "undefined"
    ? formatInTimeZone(date, timezone, dateFormat)
    : format(date, dateFormat);

/**
 * Converts ISO-8601 Duration string to Duration obj
 */
export function parseDuration(duration: string): Duration | null {
  try {
    return parseDurationString(duration);
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Converts and adds ISO-8601 Duration to a given DateTime
 */
export function addDuration(date: Date | number, duration: string): Date {
  const durationObj = parseDuration(duration);
  return durationObj ? add(date, durationObj) : new Date(date);
}
