export type MarkdownRequestSource =
  | "accept-header"
  | "md-extension"
  | "direct-api";

type TrackMarkdownRequestInput = {
  route: string;
  source: MarkdownRequestSource;
  currentUrl?: string;
};

const DEFAULT_POSTHOG_HOST = "https://us.i.posthog.com";
const EVENT_NAME = "docs-markdown-requested";

function getPosthogApiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_POSTHOG_KEY;
}

export async function trackMarkdownRequest({
  route,
  source,
  currentUrl,
}: TrackMarkdownRequestInput): Promise<void> {
  const apiKey = getPosthogApiKey();
  if (!apiKey) {
    return;
  }

  await fetch(`${DEFAULT_POSTHOG_HOST}/capture/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      event: EVENT_NAME,
      properties: {
        distinct_id: "docs-markdown-api",
        route,
        source,
        ...(currentUrl ? { $current_url: currentUrl } : {}),
        $process_person_profile: false,
      },
    }),
  }).catch(() => {
    // Tracking should not block request handling.
  });
}
