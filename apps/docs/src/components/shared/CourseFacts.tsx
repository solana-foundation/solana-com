export type CourseFact = {
  label: string;
  value: string;
  /** Render the value as a link to this path. */
  href?: string;
};

/**
 * A compact row of inline label: value pairs for the top of a video course
 * page — level, runtime, audience, prerequisites — so every course answers
 * the same questions in the same place.
 */
export function CourseFacts({ facts }: { facts: CourseFact[] }) {
  return (
    <dl className="not-prose my-6 flex flex-wrap gap-x-8 gap-y-2 rounded-lg border border-fd-border px-5 py-3 text-sm">
      {facts.map((fact) => (
        <div key={fact.label} className="flex gap-2">
          <dt className="text-fd-muted-foreground">{fact.label}:</dt>
          <dd>
            {fact.href ? (
              <a href={fact.href} className="text-fd-primary hover:underline">
                {fact.value}
              </a>
            ) : (
              fact.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
