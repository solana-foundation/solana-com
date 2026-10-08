/** Validate translated card data at the boundary where next-intl returns raw values. */
export function requiredCardContent<const Fields extends readonly string[]>(
  cards: unknown,
  id: string,
  fields: Fields,
  path: string,
): Record<Fields[number], string> {
  const card =
    cards && typeof cards === "object" && !Array.isArray(cards)
      ? (cards as Record<string, unknown>)[id]
      : undefined;

  if (!card || typeof card !== "object" || Array.isArray(card)) {
    throw new Error(`Missing translated card: ${path}.${id}`);
  }

  for (const field of fields) {
    const value = (card as Record<string, unknown>)[field];
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`Missing translated card field: ${path}.${id}.${field}`);
    }
  }

  return card as Record<Fields[number], string>;
}

export function requiredTranslatedLabel(
  labels: unknown,
  id: string,
  path: string,
): string {
  const value =
    labels && typeof labels === "object" && !Array.isArray(labels)
      ? (labels as Record<string, unknown>)[id]
      : undefined;
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing translated label: ${path}.${id}`);
  }
  return value;
}
