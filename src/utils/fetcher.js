/**
 * Default fetcher function for SWR.
 *
 * @param args
 * @returns {Promise<any>}
 */
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default fetcher;
