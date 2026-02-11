import type { NavMatchRule } from "./nav-types";

export function isNavSectionActive(asPath: string, rules: NavMatchRule[]) {
  return rules.some((rule) => {
    // `/developers/learn` belongs to the Developers section, not the Learn section.
    if (rule.type === "includes" && rule.value === "/learn") {
      if (asPath.includes("/developers/learn")) {
        return false;
      }
    }

    if (rule.type === "equals") {
      return asPath === rule.value;
    }

    return asPath.includes(rule.value);
  });
}
