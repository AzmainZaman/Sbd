import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — SBD Global Shopping",
  description: "Get in touch with SBD Global Shopping via WhatsApp, email, or Messenger.",
};

const labels = {
  heading: "Contact Us",
  sub: "We're here to help. Reach us through any of the channels below — we typically reply within 2 hours during business hours (9 AM–9 PM BDT, Sunday–Thursday).",
};

const channels = [
  {
    label: "WhatsApp",
    value: "+880 1711 000000",
    href: "https://wa.me/8801711000000",
    note: "Fastest response. Send us a message any time.",
  },
  {
    label: "Email",
    value: "team@shob.ai",
    href: "mailto:team@shob.ai",
    note: "For order issues, refund requests, and general enquiries.",
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-180 mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-[36px] sm:text-[44px] font-semibold text-ink tracking-tight mb-4">
        {labels.heading}
      </h1>
      <p className="text-[16px] text-muted leading-relaxed mb-10">{labels.sub}</p>

      <div className="space-y-4">
        {channels.map(({ label, value, href, note }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="block rounded-2xl border border-line bg-paper px-6 py-5 hover:border-ink transition-colors"
          >
            <p className="text-[12px] font-semibold uppercase tracking-widest text-muted mb-1">
              {label}
            </p>
            <p className="text-[18px] font-semibold text-ink mb-1">{value}</p>
            <p className="text-[14px] text-muted">{note}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
