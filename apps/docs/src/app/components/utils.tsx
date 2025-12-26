import classNames, { ArgumentArray } from "classnames";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ArgumentArray) {
  return twMerge(classNames(inputs));
}
