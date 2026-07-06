export type BrowserStorage = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
>;
export type BrowserStorageKind = "localStorage" | "sessionStorage";

export function getBrowserStorage(
  kind: BrowserStorageKind,
  targetWindow: Window | undefined = typeof window === "undefined"
    ? undefined
    : window,
): BrowserStorage | null {
  if (!targetWindow) {
    return null;
  }

  try {
    return targetWindow[kind];
  } catch {
    return null;
  }
}

export function safeStorageGetItem(
  storage: Pick<Storage, "getItem"> | null | undefined,
  key: string,
): string | null {
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function safeStorageSetItem(
  storage: Pick<Storage, "setItem"> | null | undefined,
  key: string,
  value: string,
): boolean {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeStorageRemoveItem(
  storage: Pick<Storage, "removeItem"> | null | undefined,
  key: string,
): boolean {
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
