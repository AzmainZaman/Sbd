export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 py-12">
      <div className="w-full max-w-[400px]">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <span className="text-[22px] font-bold tracking-tight text-[var(--ink)]">
            SBD
          </span>
          <span
            className="inline-block w-2 h-2 rounded-full ml-1 mb-0.5"
            style={{ backgroundColor: "var(--accent)" }}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
