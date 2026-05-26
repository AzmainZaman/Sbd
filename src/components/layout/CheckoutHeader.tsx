import Link from "next/link";

const labels = {
  logoAlt: "SBD Global Shopping — return to home",
  secureCheckout: "Secure checkout",
};

export function CheckoutHeader() {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label={labels.logoAlt} className="flex items-center gap-1">
          <span className="text-[18px] font-bold tracking-tight text-[var(--ink)]">SBD</span>
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
        </Link>

        {/* Secure checkout badge */}
        <span className="text-[12px] text-[var(--muted)] flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            width={14}
            height={14}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          {labels.secureCheckout}
        </span>
      </div>
    </header>
  );
}
