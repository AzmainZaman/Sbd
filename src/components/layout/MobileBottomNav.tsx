"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const labels = {
  shop: "Shop",
  categories: "Categories",
  quote: "Quote",
  orders: "Orders",
  account: "Account",
};

type NavItem = {
  label: string;
  href: string;
  icon: IconName;
  activeIcon?: IconName;
  matchPrefix?: string;
};

const navItems: NavItem[] = [
  { label: labels.shop, href: "/", icon: "home", matchPrefix: "/" },
  {
    label: labels.categories,
    href: "/categories/beauty",
    icon: "grid",
    matchPrefix: "/categories",
  },
  {
    label: labels.quote,
    href: "/search",
    icon: "search",
    matchPrefix: "/search",
  },
  {
    label: labels.orders,
    href: "/dashboard/orders",
    icon: "package",
    matchPrefix: "/dashboard",
  },
  {
    label: labels.account,
    href: "/dashboard",
    icon: "user",
    matchPrefix: "/dashboard",
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.matchPrefix === "/") return pathname === "/";
    return item.matchPrefix ? pathname.startsWith(item.matchPrefix) : pathname === item.href;
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-[var(--paper)] border-t border-[var(--line)] safe-area-pb"
    >
      <div className="flex items-stretch h-16">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors",
                active
                  ? "text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              )}
            >
              <Icon name={item.icon} size={22} strokeWidth={active ? 2 : 1.5} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
