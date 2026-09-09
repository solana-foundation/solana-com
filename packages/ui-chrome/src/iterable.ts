export const ITERABLE_BASE_URL =
  "https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=";

export const SOLANA_NEWSLETTER_FORM_ID = "fdd4a0db-f4af-4b29-90f9-98b0556d4c89";

export function getIterableActionUrl(formId: string): string {
  return `${ITERABLE_BASE_URL}${formId}`;
}

export async function sendIterableFormRequest(
  actionUrl: string,
  dataObject: Record<string, string>,
): Promise<void> {
  const data = new FormData();

  for (const [key, value] of Object.entries(dataObject)) {
    data.append(key, value);
  }

  const response = await fetch(actionUrl, {
    method: "POST",
    body: data,
  });

  if (!response.ok) {
    throw new Error("Iterable form submission failed");
  }
}
