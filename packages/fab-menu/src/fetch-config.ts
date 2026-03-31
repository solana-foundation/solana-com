import type { MenuData } from "./types";
import { DEFAULT_MENU_DATA, DEFAULT_API_URL } from "./defaults";

let cachedData: MenuData | null = null;

export async function fetchMenuData(apiUrl?: string): Promise<MenuData> {
  if (cachedData) return cachedData;

  const url = apiUrl ?? DEFAULT_API_URL;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: MenuData = await res.json();
    cachedData = data;
    return data;
  } catch {
    return DEFAULT_MENU_DATA;
  }
}

export function clearCache(): void {
  cachedData = null;
}
