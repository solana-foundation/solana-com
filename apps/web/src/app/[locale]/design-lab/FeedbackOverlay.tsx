"use client";

import { useState } from "react";

type Reaction = "love" | "like" | "dislike";

type VariantFeedback = {
  reaction: Reaction | null;
  notes: string;
};

const VARIANTS = ["A", "B", "C"] as const;

const VARIANT_LABELS: Record<string, string> = {
  A: "Fill the Gap",
  B: "Hub with Journey",
  C: "Compact Hub",
};

export function FeedbackOverlay() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, VariantFeedback>>({
    A: { reaction: null, notes: "" },
    B: { reaction: null, notes: "" },
    C: { reaction: null, notes: "" },
  });
  const [copied, setCopied] = useState(false);

  function setReaction(variant: string, reaction: Reaction) {
    setFeedback((prev) => ({
      ...prev,
      [variant]: { ...prev[variant], reaction },
    }));
  }

  function setNotes(variant: string, notes: string) {
    setFeedback((prev) => ({
      ...prev,
      [variant]: { ...prev[variant], notes },
    }));
  }

  function buildMarkdown() {
    const lines = ["## Design Lab Feedback\n"];
    for (const v of VARIANTS) {
      const f = feedback[v];
      lines.push(`### Variant ${v} — ${VARIANT_LABELS[v]}`);
      lines.push(`**Reaction:** ${f.reaction ?? "no rating"}`);
      if (f.notes) lines.push(`**Notes:** ${f.notes}`);
      lines.push("");
    }
    return lines.join("\n");
  }

  async function copyFeedback() {
    await navigator.clipboard.writeText(buildMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const EMOJI: Record<Reaction, string> = {
    love: "❤️",
    like: "👍",
    dislike: "👎",
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(true)}
        className="tw-fixed tw-bottom-6 tw-right-6 tw-z-50 tw-flex tw-items-center tw-gap-2 tw-rounded-full tw-bg-nd-highlight-lavendar tw-px-4 tw-py-2.5 tw-text-sm tw-font-brand tw-font-semibold tw-text-black tw-shadow-lg tw-transition-opacity hover:tw-opacity-90"
        aria-label="Open feedback panel"
      >
        Rate variants
      </button>

      {/* Overlay */}
      {open && (
        <div className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-end sm:tw-items-center tw-justify-center tw-bg-black/60 tw-backdrop-blur-sm">
          <div className="tw-w-full sm:tw-max-w-lg tw-rounded-t-2xl sm:tw-rounded-2xl tw-bg-[#0d0d0d] tw-border tw-border-nd-border-light tw-p-6 tw-max-h-[90dvh] tw-overflow-y-auto">
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
              <h2 className="tw-text-nd-high-em-text tw-text-lg tw-font-brand tw-font-semibold">
                Rate the variants
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="tw-text-nd-mid-em-text hover:tw-text-nd-high-em-text tw-text-xl tw-leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="tw-space-y-6">
              {VARIANTS.map((v) => (
                <div key={v} className="tw-space-y-3">
                  <div>
                    <span className="tw-text-nd-high-em-text tw-font-brand tw-font-semibold">
                      Variant {v}
                    </span>
                    <span className="tw-ml-2 tw-text-nd-mid-em-text tw-text-sm">
                      — {VARIANT_LABELS[v]}
                    </span>
                  </div>
                  <div className="tw-flex tw-gap-2">
                    {(["love", "like", "dislike"] as Reaction[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => setReaction(v, r)}
                        className={`tw-rounded-lg tw-border tw-px-3 tw-py-1.5 tw-text-lg tw-transition-colors ${
                          feedback[v].reaction === r
                            ? "tw-border-nd-highlight-lavendar/70 tw-bg-nd-highlight-lavendar/10"
                            : "tw-border-nd-border-light hover:tw-border-nd-border-prominent"
                        }`}
                        aria-label={r}
                      >
                        {EMOJI[r]}
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="tw-w-full tw-rounded-lg tw-border tw-border-nd-border-light tw-bg-white/[0.03] tw-px-3 tw-py-2 tw-text-sm tw-text-nd-mid-em-text placeholder:tw-text-nd-mid-em-text/50 focus:tw-border-nd-border-prominent focus:tw-outline-none"
                    placeholder="What worked? What didn't? (optional)"
                    rows={2}
                    value={feedback[v].notes}
                    onChange={(e) => setNotes(v, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={copyFeedback}
              className="tw-mt-6 tw-w-full tw-rounded-lg tw-bg-nd-highlight-lavendar tw-py-2.5 tw-text-sm tw-font-brand tw-font-semibold tw-text-black tw-transition-opacity hover:tw-opacity-90"
            >
              {copied ? "Copied!" : "Copy feedback → paste into chat"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
