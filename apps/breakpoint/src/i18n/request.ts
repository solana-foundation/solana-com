import {
  createAppRequestConfig,
  loadAppRequestMessages,
} from "@workspace/i18n/request";
import type { AppMessages } from "@/content/page";

export async function loadBreakpointMessages(requested?: string | null) {
  return loadAppRequestMessages<AppMessages>("breakpoint", requested);
}

export default createAppRequestConfig("breakpoint");
