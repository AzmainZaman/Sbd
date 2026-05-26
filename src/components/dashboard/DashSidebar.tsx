"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const nav: { label: string; href: string; icon: IconName }[] = [
  { label: "Overview", href: "/dashboard", icon: "home" },
  { label: "My Orders", href: "/dashboard/orders", icon: "package" },
  { label: "My Quotes", href: "/dashboard/quotes", icon: "tag" },
];

const labels = {
  memberTier: "Gold member",
  accountSettings: "Account settings",
  soon: "Soon",
  signOut: "Sign out",
  userName: "Nuzhat Ahmed",
  userInitials: "NA",
};

export function DashSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-line bg-paper">
      {/* User info */}
      <div className="px-5 py-6 border-b border-line">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--ink)" }}
          >
            <span className="text-[13px] font-semibold text-paper">
              {labels.userInitials}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink truncate">
              {labels.userName}
            </p>
            <p className="text-[12px] text-muted">{labels.memberTier}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors",
                isActive
                  ? "bg-ink text-paper"
                  : "text-muted hover:bg-bg hover:text-ink"
              )}
            >
              <Icon
                name={item.icon}
                size={18}
                strokeWidth={isActive ? 2 : 1.5}
              />
              {item.label}
            </Link>
          );
        })}

        {/* Account settings — Phase 2 */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium cursor-not-allowed select-none opacity-40">
          <Icon name="settings" size={18} strokeWidth={1.5} />
          {labels.accountSettings}
          <span className="ml-auto text-[10px] bg-line text-muted px-1.5 py-0.5 rounded">
            {labels.soon}
          </span>
        </div>
      </nav>

      {/* Sign out — Phase 2 */}
      <div className="px-3 py-4 border-t border-line">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium cursor-not-allowed select-none opacity-40">
          <Icon name="logout" size={18} strokeWidth={1.5} />
          {labels.signOut}
        </div>
      </div>
    </aside>
  );
}
