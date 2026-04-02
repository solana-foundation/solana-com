import type { MenuData } from "./types";
import { DEFAULT_MENU_DATA, DEFAULT_API_URL } from "./defaults";

const cachedData = new Map<string, MenuData>();

export async function fetchMenuData(apiUrl?: string): Promise<MenuData> {
  const url = apiUrl ?? DEFAULT_API_URL;
  const cached = cachedData.get(url);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: MenuData = await res.json();
    cachedData.set(url, data);
    return data;
  } catch {
    return DEFAULT_MENU_DATA;
  }
}

export function clearCache(): void {
  cachedData.clear();
}
