/**
 * Class names for the Ask AI panel, merged with tailwind-merge for this
 * app's Tailwind 3: of two classes for the same property, the later wins.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
