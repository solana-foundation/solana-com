const ALLOWED_EXTERNAL_PROTOCOLS = new Set(["http:", "https:"]);

export function getSafeExternalUrl(
  value: string | null | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return undefined;
  }

  try {
    const url = new URL(trimmedValue);

    if (!ALLOWED_EXTERNAL_PROTOCOLS.has(url.protocol)) {
      return undefined;
    }

    if (url.username || url.password) {
      return undefined;
    }

    return url.toString();
  } catch {
    return undefined;
  }
}
