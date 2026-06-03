import { formatInTimeZone } from "date-fns-tz";
import { isString } from "./stringUtils";
import { add, format, type Duration } from "date-fns";
import { parse as parseDurationString } from "tinyduration";

export const defaultDateStringOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 * Uses intl to get the locale & formats the given string accordingly.
 *
 * @param locale
 * @param dateString          The date to convert.
 * @param dateStringOptions   Options for toLocaleDateString.
 * @returns {string}
 */
export const toLocaleString = (
  locale: string,
  dateString: string | Date,
  dateStringOptions: Intl.DateTimeFormatOptions = defaultDateStringOptions,
): string => new Date(dateString).toLocaleDateString(locale, dateStringOptions);

/**
 * Formats a given date to MM/DD/YYYY HH:MM.
 *
 * @param {Date|string} date  The given date.
 * @returns {string}
 */
export const formatDateTime = (date: Date | string): string => {
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
 *
 * @param dateString
 * @returns {string}
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
 *
 * @param {string}    dateString    The Date string to try to fix.
 * @returns {Date|string}
 */
export const fixDate = (dateString: string): Date | string => {
  try {
    const parsedDate = new Date(dateString);
    if (Object.prototype.toString.call(parsedDate) === "[object Date]") {
      // It is a Date object, but is it valid?
      if (isNaN(parsedDate.getTime())) {
        // Date isn't valid, try to switch month & day & retry.
        const possiblyFixedDateString = switchMonthAndDay(dateString);
        const possiblyFixedDate = fixDate(possiblyFixedDateString);
        if (isString(possiblyFixedDate)) {
          // Didn't work, return as string.
          return dateString;
        }
        // Worked, return new Date object.
        return possiblyFixedDate;
      }
      // Return valid Date object.
      return parsedDate;
    }
    // Not a Date, return as string.
    return dateString;
  } catch (err) {
    // Errored out, return as string.
    console.error(err);
    return dateString;
  }
};

/**
 * Tries to format a DateTime in a given time zone.
 *
 * @param date
 * @param dateFormat
 * @param timezone
 * @returns {string}
 */
export const formatDate = (
  date: Date | string,
  dateFormat: string,
  timezone?: string,
): string =>
  !!timezone && timezone !== "undefined"
    ? formatInTimeZone(date, timezone, dateFormat)
    : format(date, dateFormat);

/**
 * Converts ISO-8601 Duration string to Duration obj
 *
 * @param {string} duration ISO-8601 Duration String
 * @returns {(Duration|null)}
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
 *
 * @param {Date} date
 * @param {string} duration ISO-8601 Duration
 * @returns {Date}
 */
export function addDuration(date: Date, duration: string): Date {
  const durationObj = parseDuration(duration);
  return durationObj ? add(date, durationObj) : date;
}
