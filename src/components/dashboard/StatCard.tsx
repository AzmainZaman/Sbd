type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
};

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="rounded-xl border border-line bg-paper px-4 py-4">
      <p className="text-[12px] font-medium text-muted mb-1">{label}</p>
      <p className="text-[26px] font-semibold text-ink leading-none">{value}</p>
      {sub && <p className="text-[12px] text-muted mt-1.5">{sub}</p>}
    </div>
  );
}
