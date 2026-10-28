const RUNTIME_CONNECTION_LIMIT = "1";
const RUNTIME_POOL_TIMEOUT_SECONDS = "10";

export function awardsRuntimeDatabaseUrl(value: string | undefined) {
  if (!value) return undefined;

  const url = new URL(value);
  url.searchParams.set("connection_limit", RUNTIME_CONNECTION_LIMIT);
  url.searchParams.set("pool_timeout", RUNTIME_POOL_TIMEOUT_SECONDS);
  return url.toString();
}
