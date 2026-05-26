"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const nav: { label: string; href: string; icon: IconName }[] = [
  { label: "Quotes", href: "/admin/quotes", icon: "tag" },
  { label: "Orders", href: "/admin/orders", icon: "package" },
  { label: "Shipments", href: "/admin/shipments", icon: "truck" },
  { label: "Catalog", href: "/admin/catalog", icon: "grid" },
];

const labels = {
  brand: "SBD Admin",
  phase1Note: "Phase 1 — no auth",
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col w-56 shrink-0"
      style={{ backgroundColor: "var(--ink)" }}
    >
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <p className="text-[15px] font-semibold text-paper">{labels.brand}</p>
        <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
          {labels.phase1Note}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors",
                isActive
                  ? "bg-white/15 text-paper"
                  : "text-paper/50 hover:bg-white/10 hover:text-paper"
              )}
            >
              <Icon
                name={item.icon}
                size={17}
                strokeWidth={isActive ? 2 : 1.5}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to store */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-paper/40 hover:text-paper/70 transition-colors"
        >
          <Icon name="arrow-left" size={16} strokeWidth={1.5} />
          Back to store
        </Link>
      </div>
    </aside>
  );
}
