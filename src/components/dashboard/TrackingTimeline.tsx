import { formatDate } from "@/lib/utils";
import type { TrackingStep } from "@/types/order";

type TrackingTimelineProps = {
  steps: TrackingStep[];
};

export function TrackingTimeline({ steps }: TrackingTimelineProps) {
  return (
    <ol className="space-y-0">
      {steps.map((step, i) => {
        const isDone = step.status === "done";
        const isCurrent = step.status === "current";
        const isLast = i === steps.length - 1;

        return (
          <li key={step.label} className="flex gap-4">
            {/* Indicator column */}
            <div className="flex flex-col items-center">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: isDone
                    ? "var(--ok)"
                    : isCurrent
                    ? "var(--ink)"
                    : "var(--bg)",
                  border: isDone || isCurrent ? "none" : "1.5px solid var(--line)",
                }}
              >
                {isDone ? (
                  <svg
                    viewBox="0 0 24 24"
                    width={13}
                    height={13}
                    fill="none"
                    stroke="white"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-paper" />
                ) : (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "var(--line)" }}
                  />
                )}
              </div>
              {!isLast && (
                <div
                  className="w-px flex-1 my-1"
                  style={{
                    backgroundColor: isDone ? "var(--ok)" : "var(--line)",
                    opacity: isDone ? 0.4 : 1,
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div className={`pb-5 min-w-0 ${isLast ? "pb-0" : ""}`}>
              <p
                className="text-[14px] font-medium"
                style={{
                  color: isCurrent
                    ? "var(--ink)"
                    : isDone
                    ? "var(--muted)"
                    : "var(--muted)",
                  opacity: isCurrent || isDone ? 1 : 0.6,
                }}
              >
                {step.label}
              </p>
              <p
                className="text-[12px] mt-0.5"
                style={{ color: "var(--muted)" }}
              >
                {step.description}
              </p>
              {step.occurredAt && (
                <p
                  className="font-mono text-[11px] mt-0.5"
                  style={{ color: "var(--muted)", opacity: 0.7 }}
                >
                  {formatDate(step.occurredAt, "short")}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
