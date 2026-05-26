import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const labels = {
  logoAlt: "SBD Global Shopping",
  tagline: "Your trusted bridge from global markets to Bangladesh.",
  shopHeading: "Shop",
  companyHeading: "Company",
  helpHeading: "Help",
  paymentHeading: "We accept",
  copyright: `© ${new Date().getFullYear()} SBD Global Shopping. All rights reserved.`,
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  facebook: "Facebook",
};

const shopLinks = [
  { label: "All Products", href: "/" },
  { label: "Beauty & Skincare", href: "/categories/beauty" },
  { label: "Electronics", href: "/categories/electronics" },
  { label: "Fashion & Apparel", href: "/categories/fashion" },
  { label: "Health & Supplements", href: "/categories/supplements" },
  { label: "Home & Living", href: "/categories/home" },
];

const companyLinks = [
  { label: "About SBD", href: "/about" },
  { label: "Contact us", href: "/contact" },
  { label: "Shipment schedule", href: "/shipments" },
  { label: "Traveler programme", href: "/traveler" },
  { label: "Blog", href: "/blog" },
];

const helpLinks = [
  { label: "Track an order", href: "/track" },
  { label: "How it works", href: "/about#how-it-works" },
  { label: "Pre-order policy", href: "/pre-order-policy" },
  { label: "Returns & refunds", href: "/refund-policy" },
  { label: "Pricing & duties", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

const paymentMethods = ["bKash", "Nagad", "Visa", "Mastercard"];

export function SBDFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--paper)]">
      {/* Main footer grid */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" aria-label={labels.logoAlt} className="flex items-center gap-1 mb-3">
            <span className="text-[18px] font-bold tracking-tight text-[var(--ink)]">SBD</span>
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
          </Link>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-4 max-w-xs">
            {labels.tagline}
          </p>
          {/* Social links */}
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/8801711000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={labels.whatsapp}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
            >
              <Icon name="whatsapp" size={16} />
            </a>
            <a
              href="#"
              aria-label={labels.instagram}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
            >
              <Icon name="chat" size={16} />
            </a>
            <a
              href="#"
              aria-label={labels.facebook}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
            >
              <Icon name="globe" size={16} />
            </a>
          </div>
        </div>

        {/* Link columns */}
        <FooterLinkColumn heading={labels.shopHeading} links={shopLinks} />
        <FooterLinkColumn heading={labels.companyHeading} links={companyLinks} />
        <FooterLinkColumn heading={labels.helpHeading} links={helpLinks} />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--line)]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-[var(--muted)]">{labels.copyright}</p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--muted)] mr-1">{labels.paymentHeading}</span>
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="px-2 py-0.5 text-[10px] font-medium border border-[var(--line)] rounded text-[var(--muted)]"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[12px] font-semibold uppercase tracking-widest text-[var(--ink)] mb-3">
        {heading}
      </h3>
      <ul className="space-y-2">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-[13px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
