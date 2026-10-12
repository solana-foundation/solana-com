import { getPathnameWithoutLocale } from "@workspace/i18n/pathname";
import type { NavMatchRule } from "./nav-types";

export function isNavSectionActive(asPath: string, rules: NavMatchRule[]) {
  const pathname = getPathnameWithoutLocale(asPath);

  return rules.some((rule) => {
    if (rule.exclude?.some((value) => pathname.includes(value))) {
      return false;
    }

    if (rule.type === "equals") {
      return pathname === rule.value;
    }

    return pathname.includes(rule.value);
  });
}
