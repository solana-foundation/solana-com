import { formatInTimeZone } from "date-fns-tz";
import { isString } from "./stringUtils";
import { add, format } from "date-fns";
import { parse as parseDurationString } from "tinyduration";

export const defaultDateStringOptions = {
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
  locale,
  dateString,
  dateStringOptions = defaultDateStringOptions,
) => new Date(dateString).toLocaleDateString(locale, dateStringOptions);

/**
 * Formats a given date to MM/DD/YYYY HH:MM.
 *
 * @param {Date|string} date  The given date.
 * @returns {string}
 */
export const formatDateTime = (date) => {
  const dateTime = new Date(date);
  let hours = dateTime.getUTCHours();
  let minutes = dateTime.getUTCMinutes();
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
export const switchMonthAndDay = (dateString) => {
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
export const fixDate = (dateString) => {
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
export const formatDate = (date, dateFormat, timezone) =>
  !!timezone && timezone !== "undefined"
    ? formatInTimeZone(date, timezone, dateFormat)
    : format(date, dateFormat);

/**
 * Converts ISO-8601 Duration string to Duration obj
 *
 * @param {string} duration ISO-8601 Duration String
 * @returns {(Duration|null)}
 */
export function parseDuration(duration) {
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
 * @param {DateTime} date
 * @param {string} duration ISO-8601 Duration
 * @returns {(DateTime|null)}
 */
export function addDuration(date, duration) {
  const durationObj = parseDuration(duration);
  return durationObj ? add(date, durationObj) : date;
}
