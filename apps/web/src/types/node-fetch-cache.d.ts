// Local type stub for node-fetch-cache (no @types package available)
declare module "node-fetch-cache" {
  function cachedFetch(
    _url: string | URL | Request,
    _options?: RequestInit,
  ): Promise<Response>;
  export = cachedFetch;
}
