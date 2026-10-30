/**
 * Line icons the Ask AI visuals add to the docs set (docs-ui-icons.tsx),
 * Lucide drawings (ISC) through the same wrapper.
 */
import { Lucide } from "../../docs-ui-icons";

export function InfoIcon({ className }: { className?: string }) {
  return (
    <Lucide className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </Lucide>
  );
}

export function WarningIcon({ className }: { className?: string }) {
  return (
    <Lucide className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Lucide>
  );
}

/** Chevron down; closed disclosures turn it to point to the inline end. */
export function DisclosureIcon({ className }: { className?: string }) {
  return (
    <Lucide className={className} size={12} strokeWidth={2.25}>
      <path d="m6 9 6 6 6-6" />
    </Lucide>
  );
}

export function CircleCheckIcon({ className }: { className?: string }) {
  return (
    <Lucide className={className} size={14}>
      <circle cx="12" cy="12" r="10" />
      <path d="m16 9-5.5 5.5L8 12" />
    </Lucide>
  );
}
