/**
 * Stub types for @solana-foundation/solana-lib until upstream ships its own.
 *
 * The `attributes` prop is injected by Builder.io's React SDK and spread
 * directly on to a root HTML element inside each component.  It carries
 * standard HTML attributes (className, style, data-*, aria-*, …) so
 * React.HTMLAttributes<HTMLElement> is the correct shape.
 *
 * @see Phase 8 in openspec/changes/enforce-ts-strict/tasks.md — once the
 * library publishes proper types, delete this file and update imports.
 */

export type SolanaLibAttributes = React.HTMLAttributes<HTMLElement>;
