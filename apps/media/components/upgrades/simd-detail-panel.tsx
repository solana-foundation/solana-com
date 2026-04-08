"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import Link from "next/link";
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
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] py-2.5">
      <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.2em] text-[#66667a]">
        {label}
      </span>
      <span className="text-right text-sm text-[#c5c5d1]">{children}</span>
    </div>
  );
}

export function SIMDDetailPanel({
  upgrade,
  notes,
  onClose,
}: {
  upgrade: UpgradeItem | null;
  notes: UpgradeNote[];
  onClose: () => void;
}) {
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
                <div className="flex h-full flex-col overflow-y-auto border-l border-white/[0.08] bg-[#0a0c14]">
                  {upgrade ? (
                    <>
                      {/* Header */}
                      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#0a0c14]/95 px-6 py-4 backdrop-blur-sm">
                        <button
                          onClick={onClose}
                          className="flex items-center gap-2 text-sm text-[#8f8fa3] transition-colors hover:text-white"
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
                        </button>
                        <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#ca9ff5]">
                          SIMD-{upgrade.simdNumber}
                        </span>
                      </div>

                      <div className="flex-1 space-y-6 px-6 py-6">
                        {/* Title + Status */}
                        <div className="space-y-4">
                          <h2 className="text-2xl font-medium leading-tight text-white">
                            {upgrade.title}
                          </h2>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={upgrade.status} />
                            {upgrade.expectedRelease ? (
                              <span className="text-xs tracking-wide text-[#8f8fa3]">
                                {upgrade.expectedRelease}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                          <StatusProgress status={upgrade.status} />
                        </div>

                        {/* Description */}
                        {upgrade.description ||
                        upgrade.editorialNote ||
                        upgrade.summary ? (
                          <div className="space-y-2">
                            <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#ca9ff5]">
                              About
                            </h3>
                            <p className="text-sm leading-7 text-[#c5c5d1]">
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
                              <code className="text-xs text-[#a8a8ba]">
                                {upgrade.featureGate}
                              </code>
                            </MetaRow>
                          ) : null}
                        </div>

                        {/* Related SIMDs */}
                        {upgrade.relatedSimds.length > 0 ? (
                          <div className="space-y-2">
                            <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#ca9ff5]">
                              Related SIMDs
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {upgrade.relatedSimds.map((simd) => (
                                <span
                                  key={simd}
                                  className="rounded-full border border-white/[0.1] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-[#a8a8ba]"
                                >
                                  SIMD-{simd}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {/* Links */}
                        <div className="flex flex-wrap gap-4">
                          <Link
                            href={upgrade.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-white underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-white"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            Proposal
                          </Link>
                          {upgrade.discussionUrl ? (
                            <Link
                              href={upgrade.discussionUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-white underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-white"
                            >
                              Discussion
                            </Link>
                          ) : null}
                        </div>

                        {/* Update History */}
                        <div className="space-y-3 pt-2">
                          <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#ca9ff5]">
                            Update history
                          </h3>
                          {notes.length > 0 ? (
                            <ol className="space-y-0">
                              {notes.map((note) => (
                                <li
                                  key={note.slug}
                                  className="relative border-l-2 border-white/[0.08] py-3 pl-5"
                                >
                                  <div className="absolute -left-[5px] top-4 h-2 w-2 rounded-full border-2 border-[#0a0c14] bg-[#ca9ff5]" />
                                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#66667a]">
                                    {formatDate(note.publishedAt)}
                                  </div>
                                  <p className="mt-1.5 text-sm leading-6 text-[#c5c5d1]">
                                    {note.body}
                                  </p>
                                </li>
                              ))}
                            </ol>
                          ) : (
                            <p className="text-sm text-[#66667a]">
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
