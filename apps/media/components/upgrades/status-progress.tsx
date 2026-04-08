import type { SIMDStatus } from "@/lib/upgrade-types";

const STEPS: SIMDStatus[] = [
  "idea",
  "draft",
  "review",
  "accepted",
  "implemented",
  "activated",
];

const STEP_LABELS: Record<string, string> = {
  idea: "Idea",
  draft: "Draft",
  review: "Review",
  accepted: "Accept",
  implemented: "Implement",
  activated: "Active",
};

type StepState = "completed" | "current" | "pending" | "withdrawn" | "stagnant";

function getStepState(step: SIMDStatus, currentStatus: SIMDStatus): StepState {
  if (currentStatus === "withdrawn") return "withdrawn";
  if (currentStatus === "stagnant") return "stagnant";

  const current = currentStatus === "living" ? "activated" : currentStatus;
  const stepIndex = STEPS.indexOf(step);
  const currentIndex = STEPS.indexOf(current);

  if (currentIndex < 0) return "pending";
  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "current";
  return "pending";
}

function Checkmark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

const STATE_DOT: Record<
  StepState,
  { dot: string; ring?: string; ping?: string; text: string }
> = {
  completed: {
    dot: "bg-emerald-500",
    text: "text-emerald-500",
  },
  current: {
    dot: "bg-amber-500",
    ring: "ring-2 ring-amber-400/40",
    ping: "bg-amber-400",
    text: "text-amber-400",
  },
  pending: {
    dot: "bg-zinc-700",
    text: "text-zinc-600",
  },
  withdrawn: {
    dot: "bg-rose-500/60",
    text: "text-rose-500/60",
  },
  stagnant: {
    dot: "bg-zinc-700",
    text: "text-zinc-600",
  },
};

const STATE_LINE: Record<StepState, string> = {
  completed: "bg-emerald-500",
  current: "bg-zinc-700",
  pending: "bg-zinc-700",
  withdrawn: "bg-rose-500/30",
  stagnant: "bg-zinc-800",
};

export function StatusProgress({
  status,
  compact = false,
}: {
  status: SIMDStatus;
  compact?: boolean;
}) {
  const isTerminal = status === "withdrawn" || status === "stagnant";

  return (
    <div className="flex items-center justify-start gap-0">
      {STEPS.map((step, index) => {
        const state = getStepState(step, status);
        const style = STATE_DOT[state];
        const isLast = index === STEPS.length - 1;

        const dotSize = compact ? "w-1.5 h-1.5" : "w-2.5 h-2.5";
        const checkSize = compact ? "w-1 h-1" : "w-1.5 h-1.5";
        const stepWidth = compact ? "w-5" : "w-9";
        const lineWidth = compact ? "w-1" : "w-1.5";

        return (
          <div key={step} className="flex items-center">
            <div className={`flex flex-col items-center ${stepWidth}`}>
              <div className="relative">
                {state === "current" && style.ping ? (
                  <div
                    className={`absolute inset-0 rounded-full animate-ping opacity-30 ${style.ping}`}
                  />
                ) : null}
                <div
                  className={`relative ${dotSize} rounded-full flex items-center justify-center ${style.dot} ${style.ring || ""}`}
                >
                  {state === "completed" ? (
                    <Checkmark className={`${checkSize} text-white`} />
                  ) : null}
                </div>
              </div>
              {!compact ? (
                <span
                  className={`mt-0.5 text-[8px] font-medium text-center leading-tight ${style.text}`}
                >
                  {STEP_LABELS[step]}
                </span>
              ) : null}
            </div>

            {!isLast ? (
              <div
                className={`${lineWidth} h-px ${compact ? "mb-0" : "mb-3"} ${
                  isTerminal
                    ? STATE_LINE[state]
                    : state === "completed"
                      ? STATE_LINE.completed
                      : STATE_LINE.pending
                }`}
              />
            ) : null}
          </div>
        );
      })}

      {isTerminal ? (
        <span
          className={`${compact ? "ml-1 text-[7px]" : "ml-2 text-[9px]"} font-medium uppercase tracking-wider ${
            status === "withdrawn" ? "text-rose-500/60" : "text-zinc-600"
          }`}
        >
          {status}
        </span>
      ) : null}
    </div>
  );
}

export function statusLabel(status: SIMDStatus): string {
  return (
    STEP_LABELS[status] || status.charAt(0).toUpperCase() + status.slice(1)
  );
}
