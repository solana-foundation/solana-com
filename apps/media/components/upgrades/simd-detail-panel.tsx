"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { Github } from "lucide-react";
import Link from "next/link";
import { Link as LocalizedLink } from "@workspace/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UpgradeItem, UpgradeNote } from "@/lib/upgrade-types";
import { StatusProgress } from "./status-progress";
import { StatusBadge } from "./status-badge";

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2">
      <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-[#555568]">
        {label}
      </span>
      <span className="text-right text-sm text-[#ABABBA]">{children}</span>
    </div>
  );
}

export function SIMDDetailPanel({
  upgrade,
  notes,
  relatedSimdsByNumber,
  onClose,
}: {
  upgrade: UpgradeItem | null;
  notes: UpgradeNote[];
  relatedSimdsByNumber: Record<
    string,
    { slug: string; simdNumber: string; title: string }
  >;
  onClose: () => void;
}) {
  const expectedRelease = notes.find(
    (note) => note.expectedRelease,
  )?.expectedRelease;

  return (
    <Dialog open={!!upgrade} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
            <TransitionChild>
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-xl transform transition-transform duration-300 ease-out data-[closed]:translate-x-full"
              >
                <div className="flex h-full flex-col overflow-y-auto border-l border-white/10 bg-black">
                  {upgrade ? (
                    <>
                      {/* Header */}
                      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/95 px-6 py-5 backdrop-blur-sm">
                        <Button
                          onClick={onClose}
                          variant="ghost"
                          size="sm"
                          className="h-auto px-0 text-sm text-[#ABABBA] hover:bg-transparent hover:text-white"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          Back
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="rounded-full border-white/15 bg-white/[0.04] px-3 text-xs font-medium uppercase tracking-[0.2em] text-[#CA9FF5] hover:border-white/25 hover:bg-white/[0.08] hover:text-white dark:border-white/15 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                        >
                          <Link
                            href={upgrade.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Github className="size-4 text-white" />
                            SIMD-{upgrade.simdNumber}
                          </Link>
                        </Button>
                      </div>

                      <div className="flex-1 space-y-8 px-6 py-8">
                        {/* Title + Status */}
                        <div className="space-y-4">
                          <h2 className="m-0 font-sans font-medium text-[1.75rem] md:text-[2rem] leading-tight tracking-tight text-white">
                            {upgrade.title}
                          </h2>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={upgrade.status} />
                            {expectedRelease ? (
                              <span className="text-xs tracking-wide text-[#ABABBA]">
                                {expectedRelease}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Progress */}
                        <Card className="gap-0 rounded-2xl border border-white/10 bg-white/[0.02] p-0 text-white shadow-none">
                          <CardContent className="p-5">
                            <StatusProgress status={upgrade.status} />
                          </CardContent>
                        </Card>

                        {/* Description */}
                        {upgrade.description ||
                        upgrade.editorialNote ||
                        upgrade.summary ? (
                          <div className="space-y-3">
                            <h3 className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-[#CA9FF5]">
                              About
                            </h3>
                            <p className="m-0 text-base leading-relaxed text-[#ABABBA]">
                              {upgrade.description ||
                                upgrade.editorialNote ||
                                upgrade.summary}
                            </p>
                          </div>
                        ) : null}

                        {/* Metadata */}
                        <div>
                          <MetaRow label="Category">
                            {upgrade.category}
                            {upgrade.type ? ` / ${upgrade.type}` : ""}
                          </MetaRow>
                          {upgrade.authors.length > 0 ? (
                            <MetaRow label="Authors">
                              {upgrade.authors.join(", ")}
                            </MetaRow>
                          ) : null}
                          <MetaRow label="Created">
                            {formatDate(upgrade.createdDate)}
                          </MetaRow>
                          <MetaRow label="Updated">
                            {formatDate(
                              upgrade.updatedDate || upgrade.createdDate,
                            )}
                          </MetaRow>
                          {upgrade.featureGate &&
                          !upgrade.featureGate.includes("fill in") &&
                          !upgrade.featureGate.includes("TBD") ? (
                            <MetaRow label="Feature Gate">
                              <code className="text-xs text-[#ABABBA]">
                                {upgrade.featureGate}
                              </code>
                            </MetaRow>
                          ) : null}
                        </div>

                        {/* Related SIMDs */}
                        {upgrade.relatedSimds.length > 0 ? (
                          <div className="space-y-3">
                            <h3 className="m-0 mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#CA9FF5]">
                              Related SIMDs
                            </h3>
                            <ul className="m-0 space-y-2 p-0">
                              {upgrade.relatedSimds.map((simd) => {
                                const relatedSimd = relatedSimdsByNumber[simd];

                                return (
                                  <li key={simd} className="list-none">
                                    {relatedSimd ? (
                                      <LocalizedLink
                                        href={`/upgrades/${relatedSimd.slug}`}
                                        className="text-sm leading-relaxed text-[#ABABBA] underline decoration-white/10 underline-offset-4 transition-colors hover:text-white hover:decoration-[#CA9FF5]"
                                      >
                                        <span className="font-mono text-[#CA9FF5]">
                                          SIMD-{relatedSimd.simdNumber}
                                        </span>
                                        {`: ${relatedSimd.title}`}
                                      </LocalizedLink>
                                    ) : (
                                      <span className="text-sm leading-relaxed text-[#ABABBA]">
                                        <span className="font-mono text-[#CA9FF5]">
                                          SIMD-{simd}
                                        </span>
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : null}

                        {/* Links */}
                        <div className="flex flex-wrap gap-5">
                          {upgrade.discussionUrl ? (
                            <Button
                              asChild
                              variant="link"
                              className="h-auto px-0 text-sm text-white decoration-white/15 hover:decoration-white"
                            >
                              <Link
                                href={upgrade.discussionUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Discussion
                              </Link>
                            </Button>
                          ) : null}
                        </div>

                        {/* Update History */}
                        <div className="space-y-4">
                          <h3 className="m-0 mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#CA9FF5]">
                            Update history
                          </h3>
                          {notes.length > 0 ? (
                            <ol className="m-0 list-none p-0">
                              {notes.map((note) => (
                                <li
                                  key={note.slug}
                                  className="relative border-l-2 border-white/10 py-4 pl-6"
                                >
                                  <div className="absolute -left-[5px] top-5 h-2 w-2 rounded-full border-2 border-black bg-[#CA9FF5]" />
                                  <div className="text-xs uppercase tracking-[0.2em] text-[#555568]">
                                    {formatDate(note.publishedAt)}
                                  </div>
                                  <p className="m-0 mt-2 text-base leading-relaxed text-[#ABABBA]">
                                    {note.body}
                                  </p>
                                </li>
                              ))}
                            </ol>
                          ) : (
                            <p className="m-0 text-sm text-[#555568]">
                              No update notes yet.
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
