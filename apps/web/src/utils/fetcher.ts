/**
 * Default fetcher function for SWR.
 *
 * @param args
 * @returns {Promise<unknown>}
 */
const fetcher = <T = unknown>(...args: Parameters<typeof fetch>): Promise<T> =>
  fetch(...args).then((res) => res.json()) as Promise<T>;

export default fetcher;
