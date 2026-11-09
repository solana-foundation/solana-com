type SeoJsonLdProps = {
  data: Record<string, unknown>;
};

/**
 * JSON-LD is inlined in a <script>, where "</script>" or "<!--" inside a string
 * would break out of the element. Escaping "<" keeps the JSON valid for parsers
 * and inert for the HTML tokenizer.
 */
function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function SeoJsonLd({ data }: SeoJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(data),
      }}
    />
  );
}
