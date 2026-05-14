import { useRouter } from "@workspace/i18n/use-router";
import { useEffect, useMemo, useState } from "react";

export const formatNumber = (
  locale: string,
  value: number | string,
  options: Intl.NumberFormatOptions,
): string | number => {
  try {
    return Intl.NumberFormat(locale, options).format(Number(value));
  } catch (error) {
    console.error(error);
    return value;
  }
};

const humanFriendlyNumbers: Record<number, string> = {
  1: "",
  1e3: "K",
  1e6: "M",
  1e9: "G",
  1e12: "T",
  1e15: "P",
  1e18: "E",
};

/**
 * Format a number down and adds the above extensions.
 *
 * @param {string}                locale
 * @param {number}                value
 * @param {number}                digits          How many digits to display after the floating point, defaults to 1.
 * @param {number}                startDividing   When to start dividing, default to 1e4, divides by 1e3.
 * @param {NumberFormatOptions}   options
 * @return {`${*}${*}`|`${*}${*}`}
 */
export const formatNumberHumanFriendly = (
  locale: string,
  value: number,
  digits = 1,
  startDividing = 1e4,
  options: Intl.NumberFormatOptions = {},
): string => {
  let dividend: number;
  switch (true) {
    case value >= 1e18: {
      dividend = 1e18;
      break;
    }
    case value >= 1e15: {
      dividend = 1e15;
      break;
    }
    case value >= 1e12: {
      dividend = 1e12;
      break;
    }
    case value >= 1e9: {
      dividend = 1e9;
      break;
    }
    case value >= 1e6: {
      dividend = 1e6;
      break;
    }
    case value >= startDividing: {
      dividend = 1e3;
      break;
    }
    default:
      dividend = 1;
  }
  const dividedDown = (value / dividend).toFixed(digits);
  return `${formatNumber(locale, dividedDown, options)}${
    humanFriendlyNumbers[dividend]
  }`;
};

export function FormattedNumber({
  value,
  ...options
}: { value: number } & Intl.NumberFormatOptions) {
  const { locale } = useRouter();

  const formatted = useMemo(() => {
    try {
      return Intl.NumberFormat(locale, options).format(value);
    } catch (error) {
      console.error(error);
      return value;
    }
  }, [locale, value, options]);

  return <>{formatted}</>;
}

export function FormattedDate({
  value,
  ...options
}: { value: Date } & Intl.DateTimeFormatOptions) {
  const { locale } = useRouter();
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setDate(value);
  }, [value]);

  const formatted = useMemo(() => {
    if (!date) {
      return null;
    }

    try {
      return Intl.DateTimeFormat(locale, options).format(date);
    } catch (error) {
      console.error(error);
      return date.toISOString();
    }
  }, [locale, date, options]);

  return <>{formatted}</>;
}
