import type { NavMatchRule } from "./nav-types";

export function isNavSectionActive(asPath: string, rules: NavMatchRule[]) {
  return rules.some((rule) => {
    if (rule.exclude?.some((value) => asPath.includes(value))) {
      return false;
    }

    if (rule.type === "equals") {
      return asPath === rule.value;
    }

    return asPath.includes(rule.value);
  });
}
