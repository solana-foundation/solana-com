import { loadAppMessages } from "@workspace/i18n/messages";
import { defaultLocale } from "@workspace/i18n/config";

const GUIDE_URL = "https://solana.com/request-for-startups.md";

export async function getStartupRequestsIndex() {
  const messages = await loadAppMessages("web", defaultLocale);
  const page = messages["request-for-startups"] as {
    requests: { items: Record<string, { title: string; thesis: string }> };
  };

  return [
    "## Request for Startups",
    "",
    `Use the [startup guide](${GUIDE_URL}) to choose a request and plan a first build. Each brief follows one video and includes the speaker, opportunity, starting points, and Solana tooling path.`,
    "",
    ...Object.entries(page.requests.items).map(
      ([slug, request]) =>
        `- [${request.title}](${GUIDE_URL}#${slug}): ${request.thesis}`,
    ),
    "",
  ].join("\n");
}
