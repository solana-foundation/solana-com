import { config } from "src/config";

/**
 * Prepend the site url to local routes
 */
export function prependSiteUrl(url: string) {
  if (url.startsWith("/")) url = `${config.siteUrl}${url}`;

  return url;
}

/**
 * Generate a random number in the specified range
 */
export function generateRandomInRange(min = 0, max = 100) {
  // find diff
  let difference = max - min;

  // generate random number
  let rand = Math.random();

  // multiply with difference
  rand = Math.floor(rand * difference);

  // add with min value
  rand = rand + min;

  return rand;
}
