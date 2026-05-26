import type { ReactNode } from "react";

type EmptyStateProps = {
  heading: string;
  sub?: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export function EmptyState({ heading, sub, action, icon }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-paper px-6 py-12 text-center">
      {icon && (
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--bg)" }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <p className="text-[16px] font-semibold text-ink">{heading}</p>
      {sub && (
        <p className="mt-1.5 text-[13px] text-muted leading-relaxed max-w-[300px] mx-auto">
          {sub}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
