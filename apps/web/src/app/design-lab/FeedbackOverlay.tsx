"use client";

import { useState } from "react";

const VARIANTS = ["A", "B", "C", "D", "E"];

export function FeedbackOverlay() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function scrollTo(v: string) {
    document
      .querySelector(`[data-variant="${v}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function submit() {
    if (!selected) return;
    const output = `## Design Feedback\n**Winner:** Variant ${selected}\n**Notes:** ${notes || "(none)"}`;
    console.log(output);
    navigator.clipboard?.writeText(output);
    setSubmitted(true);
    setOpen(false);
  }

  return (
    <>
      {/* Jump nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/80 backdrop-blur border border-white/10 rounded-full px-4 py-2">
        {VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => scrollTo(v)}
            className="text-xs font-mono text-white/60 hover:text-white px-2 py-1 rounded transition-colors"
          >
            {v}
          </button>
        ))}
        <div className="w-px bg-white/10 mx-1" />
        <button
          onClick={() => setOpen(true)}
          className="text-xs font-mono text-[#00ffbd] hover:text-white px-2 py-1 rounded transition-colors"
        >
          Pick winner →
        </button>
      </div>

      {/* Feedback modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md flex flex-col gap-5">
            <h2 className="text-white font-brand text-xl font-medium mb-0">
              Which variant wins?
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {VARIANTS.map((v) => (
                <button
                  key={v}
                  onClick={() => setSelected(v)}
                  className={[
                    "py-3 rounded-xl text-sm font-mono font-semibold border transition-colors",
                    selected === v
                      ? "bg-[#00ffbd] text-black border-[#00ffbd]"
                      : "bg-transparent text-white/60 border-white/10 hover:border-white/30",
                  ].join(" ")}
                >
                  {v}
                </button>
              ))}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional) — what did you like or want changed?"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/30 resize-none h-24 focus:outline-none focus:border-white/30"
            />
            <div className="flex gap-3">
              <button
                onClick={submit}
                disabled={!selected}
                className="flex-1 py-3 rounded-full text-sm font-semibold bg-[#00ffbd] text-black disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Submit feedback
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-3 rounded-full text-sm font-semibold border border-white/10 text-white/60 hover:text-white"
              >
                Cancel
              </button>
            </div>
            {submitted && (
              <p className="text-[#00ffbd] text-xs text-center">
                Copied to clipboard
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
