const labels = {
  message: "Admin panel is optimised for desktop (768px+).",
  sub: "Please open this page on a larger screen.",
};

export function AdminMobileBanner() {
  return (
    <div className="lg:hidden flex flex-col items-center justify-center min-h-screen px-6 text-center bg-bg">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: "var(--ink)" }}
      >
        <svg
          viewBox="0 0 24 24"
          width={22}
          height={22}
          fill="none"
          stroke="white"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
        </svg>
      </div>
      <p className="text-[16px] font-semibold text-ink mb-1">{labels.message}</p>
      <p className="text-[14px] text-muted">{labels.sub}</p>
    </div>
  );
}
